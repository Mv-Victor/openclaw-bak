#!/usr/bin/env bun
import { writeFile } from "node:fs/promises";
import path from "node:path";

// Style presets with enhanced prompts
const STYLE_PRESETS: Record<string, string> = {
  photorealistic: "professional photography, high detail, natural lighting, sharp focus, 8k resolution, realistic",
  illustration: "digital illustration, vibrant colors, clean lines, professional artwork, trending on artstation",
  anime: "anime style, manga art, cel shading, vibrant colors, detailed character design",
  "3d-render": "3D rendered, octane render, unreal engine, photorealistic materials, ray tracing",
  watercolor: "watercolor painting, soft colors, artistic, hand-painted, gentle brushstrokes",
  "oil-painting": "oil painting, classical art style, rich colors, textured brushwork, fine art",
  minimalist: "minimalist design, clean, simple, modern, flat colors, geometric",
  cyberpunk: "cyberpunk aesthetic, neon lights, futuristic, dark atmosphere, high tech",
  fantasy: "fantasy art, magical, ethereal, detailed environment, epic composition",
  vintage: "vintage style, retro aesthetic, nostalgic, aged look, classic design",
};

// Content type defaults
const CONTENT_TYPES: Record<string, { ar: string; quality: string; enhancement: string }> = {
  cover: { ar: "16:9", quality: "high", enhancement: "professional cover image, eye-catching, high quality" },
  screenshot: { ar: "16:9", quality: "high", enhancement: "clean UI design, modern interface, professional" },
  social: { ar: "1:1", quality: "high", enhancement: "social media optimized, engaging, vibrant" },
  story: { ar: "9:16", quality: "standard", enhancement: "vertical format, mobile optimized, attention-grabbing" },
  banner: { ar: "21:9", quality: "high", enhancement: "wide banner format, professional, impactful" },
  portrait: { ar: "3:4", quality: "high", enhancement: "portrait orientation, detailed, professional" },
  landscape: { ar: "4:3", quality: "high", enhancement: "landscape orientation, scenic, high quality" },
};

// Quality to resolution mapping
const QUALITY_RESOLUTIONS: Record<string, { width: number; height: number }> = {
  draft: { width: 512, height: 512 },
  standard: { width: 1024, height: 1024 },
  high: { width: 2048, height: 2048 },
  ultra: { width: 4096, height: 4096 },
};

interface Args {
  prompt: string;
  image?: string;
  style?: string;
  type?: string;
  ar?: string;
  quality?: string;
  negative?: string;
  seed?: number;
  steps?: number;
  guidance?: number;
  json?: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {
    prompt: "",
    quality: "high",
    steps: 50,
    guidance: 7.5,
    json: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    
    if (arg === "--prompt" || arg === "-p") {
      args.prompt = argv[++i] || "";
    } else if (arg === "--image") {
      args.image = argv[++i];
    } else if (arg === "--style") {
      args.style = argv[++i];
    } else if (arg === "--type") {
      args.type = argv[++i];
    } else if (arg === "--ar") {
      args.ar = argv[++i];
    } else if (arg === "--quality") {
      args.quality = argv[++i];
    } else if (arg === "--negative") {
      args.negative = argv[++i];
    } else if (arg === "--seed") {
      args.seed = parseInt(argv[++i] || "0");
    } else if (arg === "--steps") {
      args.steps = parseInt(argv[++i] || "50");
    } else if (arg === "--guidance") {
      args.guidance = parseFloat(argv[++i] || "7.5");
    } else if (arg === "--json") {
      args.json = true;
    } else if (!arg.startsWith("-") && !args.prompt) {
      args.prompt = arg;
    }
  }

  return args;
}

function enhancePrompt(prompt: string, style?: string, type?: string): string {
  let enhanced = prompt;

  // Add style enhancement
  if (style && STYLE_PRESETS[style]) {
    enhanced += `, ${STYLE_PRESETS[style]}`;
  }

  // Add type enhancement
  if (type && CONTENT_TYPES[type]) {
    enhanced += `, ${CONTENT_TYPES[type].enhancement}`;
  }

  return enhanced;
}

function getAspectRatio(ar?: string, type?: string): string {
  if (ar) return ar;
  if (type && CONTENT_TYPES[type]) return CONTENT_TYPES[type].ar;
  return "1:1";
}

function getQuality(quality?: string, type?: string): string {
  if (quality) return quality;
  if (type && CONTENT_TYPES[type]) return CONTENT_TYPES[type].quality;
  return "high";
}

async function generateImage(args: Args): Promise<void> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error("REPLICATE_API_TOKEN environment variable is required");
  }

  const model = process.env.NANOBANANA_MODEL || "google/nano-banana-pro";
  
  // Enhance prompt
  const enhancedPrompt = enhancePrompt(args.prompt, args.style, args.type);
  
  // Get aspect ratio and quality
  const aspectRatio = getAspectRatio(args.ar, args.type);
  const quality = getQuality(args.quality, args.type);
  const resolution = QUALITY_RESOLUTIONS[quality] || QUALITY_RESOLUTIONS.high;

  console.log(`Generating image with Nano Banana Pro...`);
  console.log(`Model: ${model}`);
  console.log(`Prompt: ${enhancedPrompt}`);
  console.log(`Aspect Ratio: ${aspectRatio}`);
  console.log(`Quality: ${quality} (${resolution.width}x${resolution.height})`);

  // Prepare request
  const input: Record<string, any> = {
    prompt: enhancedPrompt,
    aspect_ratio: aspectRatio,
    num_inference_steps: args.steps,
    guidance_scale: args.guidance,
  };

  if (args.negative) {
    input.negative_prompt = args.negative;
  }

  if (args.seed) {
    input.seed = args.seed;
  }

  // Call Replicate API
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: model.includes(":") ? model.split(":")[1] : undefined,
      input,
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.statusText}`);
  }

  const prediction = await response.json();
  const predictionId = prediction.id;

  // Poll for completion
  let result = prediction;
  while (result.status === "starting" || result.status === "processing") {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        "Authorization": `Bearer ${apiToken}`,
      },
    });

    result = await pollResponse.json();
    console.log(`Status: ${result.status}...`);
  }

  if (result.status === "failed") {
    throw new Error(`Generation failed: ${result.error}`);
  }

  if (result.status !== "succeeded") {
    throw new Error(`Unexpected status: ${result.status}`);
  }

  // Download image
  const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();

  // Save image
  const outputPath = args.image || `nanobanana-${Date.now()}.png`;
  await writeFile(outputPath, Buffer.from(imageBuffer));

  console.log(`✓ Image saved to: ${outputPath}`);

  // Save metadata
  const metadata = {
    prompt: args.prompt,
    enhancedPrompt,
    style: args.style,
    type: args.type,
    aspectRatio,
    quality,
    resolution,
    seed: args.seed,
    steps: args.steps,
    guidance: args.guidance,
    model,
    generatedAt: new Date().toISOString(),
    imageUrl,
  };

  await writeFile(`${outputPath}.json`, JSON.stringify(metadata, null, 2));

  if (args.json) {
    console.log(JSON.stringify({ success: true, image: outputPath, metadata }, null, 2));
  }
}

// Main
const args = parseArgs(process.argv.slice(2));

if (!args.prompt) {
  console.error("Error: --prompt is required");
  process.exit(1);
}

generateImage(args).catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
