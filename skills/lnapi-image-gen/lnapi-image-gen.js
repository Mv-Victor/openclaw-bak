#!/usr/bin/env node

/**
 * LN API Image Generation CLI
 * 
 * ⚠️ WARNING: Each API call costs money. Do not test randomly!
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  apiKey: process.env.LNAPI_API_KEY || 'sk-KX3fWg5nVCZwNF3WF984076bEf0745B5A017716bB11c3f65',
  endpoint: process.env.LNAPI_ENDPOINT || 'lnapi.com',
  defaultModel: process.env.LNAPI_DEFAULT_MODEL || 'nano-banana',
  defaultTimeout: parseInt(process.env.LNAPI_DEFAULT_TIMEOUT || '120', 10) * 1000,
};

// Aspect ratio mapping
const ASPECT_RATIOS = {
  '1:1': '1:1',
  '2:3': '2:3',
  '3:2': '3:2',
  '16:9': '16:9',
  '9:16': '9:16',
  '4:3': '4:3',
  '3:4': '3:4',
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    prompt: null,
    model: CONFIG.defaultModel,
    quality: null,
    aspectRatio: '2:3',
    format: 'file',
    image: null,
    timeout: CONFIG.defaultTimeout,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg === '--prompt' || arg === '-p') {
      options.prompt = args[++i];
    } else if (arg === '--model' || arg === '-m') {
      options.model = args[++i];
    } else if (arg === '--quality' || arg === '-q') {
      options.quality = args[++i];
    } else if (arg === '--ar') {
      options.aspectRatio = args[++i];
    } else if (arg === '--format' || arg === '-f') {
      options.format = args[++i];
    } else if (arg === '--image' || arg === '-i') {
      options.image = args[++i];
    } else if (arg === '--timeout' || arg === '-t') {
      options.timeout = parseInt(args[++i], 10) * 1000;
    } else if (arg === '--json') {
      options.json = true;
    } else if (!arg.startsWith('-') && !options.prompt) {
      options.prompt = arg;
    }
  }

  if (!options.prompt) {
    console.error('Error: Prompt is required');
    printHelp();
    process.exit(1);
  }

  // Validate aspect ratio
  if (!ASPECT_RATIOS[options.aspectRatio]) {
    console.error(`Error: Invalid aspect ratio "${options.aspectRatio}"`);
    console.error(`Supported: ${Object.keys(ASPECT_RATIOS).join(', ')}`);
    process.exit(1);
  }

  return options;
}

function printHelp() {
  console.log(`
LN API Image Generation CLI

⚠️  WARNING: Each API call costs money. Do not test randomly!

Usage:
  lnapi-image-gen "prompt" [options]

Options:
  --prompt, -p <text>      Prompt text (required)
  --model, -m <name>       Model: nano-banana, nano-banana-pro, nano-banana-pro-2k, nano-banana-pro-4k
  --quality, -q <size>     Quality: 4K (for nano-banana-pro)
  --ar <ratio>             Aspect ratio: 1:1, 2:3, 3:2, 16:9, 9:16, 4:3, 3:4
  --format, -f <type>      Output format: file, url
  --image, -i <path>       Output image path
  --timeout, -t <seconds>  Request timeout (default: 120)
  --json                   JSON output
  --help, -h               Show this help

Examples:
  lnapi-image-gen "一只可爱的猫咪"
  lnapi-image-gen "未来城市" --model nano-banana-pro --quality 4K --ar 16:9
  lnapi-image-gen "山水画" --model nano-banana-pro-2k --ar 3:2 --image landscape.png
`);
}

// Build request payload
function buildPayload(options) {
  const payload = {
    model: options.model,
    prompt: options.prompt,
  };

  // Handle different model types
  if (options.model === 'nano-banana') {
    payload.size = options.aspectRatio;
  } else if (options.model === 'nano-banana-pro') {
    payload.size = options.quality || '4K';
    payload.aspect_ratio = options.aspectRatio;
  } else if (options.model.includes('-2k') || options.model.includes('-4k')) {
    // For preset models, only pass size (aspect ratio)
    payload.size = options.aspectRatio;
    if (options.format === 'url') {
      payload.response_format = 'url';
    }
  } else {
    // Default behavior
    payload.size = options.aspectRatio;
  }

  return payload;
}

// Make API request
function generateImage(options) {
  return new Promise((resolve, reject) => {
    const payload = buildPayload(options);
    const payloadStr = JSON.stringify(payload);

    const requestOptions = {
      hostname: CONFIG.endpoint,
      port: 443,
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payloadStr),
      },
      timeout: options.timeout,
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode !== 200) {
            reject(new Error(`API Error (${res.statusCode}): ${JSON.stringify(result)}`));
            return;
          }

          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse response: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request failed: ${err.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${options.timeout / 1000}s`));
    });

    req.write(payloadStr);
    req.end();
  });
}

// Download image from URL
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: ${res.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(outputPath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Main function
async function main() {
  const options = parseArgs();

  try {
    // Generate image
    const result = await generateImage(options);

    // Extract image URL
    let imageUrl = null;
    if (result.data && result.data[0]) {
      imageUrl = result.data[0].url || result.data[0].b64_json;
    }

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    // Handle output format
    if (options.format === 'url') {
      if (options.json) {
        console.log(JSON.stringify({ url: imageUrl, result }, null, 2));
      } else {
        console.log(imageUrl);
      }
      return;
    }

    // Download image
    const outputPath = options.image || `lnapi-${Date.now()}.png`;
    await downloadImage(imageUrl, outputPath);

    // Save metadata
    const metadataPath = `${outputPath}.json`;
    fs.writeFileSync(metadataPath, JSON.stringify({
      prompt: options.prompt,
      model: options.model,
      aspectRatio: options.aspectRatio,
      quality: options.quality,
      timestamp: new Date().toISOString(),
      url: imageUrl,
    }, null, 2));

    if (options.json) {
      console.log(JSON.stringify({
        image: outputPath,
        metadata: metadataPath,
        url: imageUrl,
      }, null, 2));
    } else {
      console.log(`✅ Image saved: ${outputPath}`);
      console.log(`📄 Metadata saved: ${metadataPath}`);
    }

  } catch (err) {
    if (options.json) {
      console.error(JSON.stringify({ error: err.message }, null, 2));
    } else {
      console.error(`❌ Error: ${err.message}`);
    }
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

module.exports = { generateImage, downloadImage };
