---
name: nanobanana-image-gen
description: Generate images using Nano Banana Pro with rich style prompts. Supports cover images, screenshots, social media posts, and more. Use when user mentions "生成图片", "封面图", "截图", "nanobanana", "图片生成", or wants to create visual content.
---

# Nano Banana Pro Image Generation

AI image generation optimized for Nano Banana Pro model via Replicate API. Includes rich style library and prompt optimization for various use cases.

## Quick Start

```bash
# Basic generation
nanobanana-image-gen "A cute cat"

# With style preset
nanobanana-image-gen "A landscape" --style photorealistic

# Cover image for article
nanobanana-image-gen "AI technology article cover" --type cover --ar 16:9

# Screenshot style
nanobanana-image-gen "Dashboard UI" --type screenshot --ar 16:9

# Social media post
nanobanana-image-gen "Product launch announcement" --type social --ar 1:1
```

## Usage Patterns

### 1. Direct Prompt
```bash
nanobanana-image-gen "Your prompt here" --image output.png
```

### 2. With Style Preset
```bash
nanobanana-image-gen "Your prompt" --style <preset> --image output.png
```

### 3. With Content Type
```bash
nanobanana-image-gen "Your prompt" --type <type> --image output.png
```

### 4. Combined
```bash
nanobanana-image-gen "Your prompt" --style photorealistic --type cover --ar 16:9 --image output.png
```

## Style Presets

| Style | Description | Best For |
|-------|-------------|----------|
| `photorealistic` | Ultra-realistic photography | Product shots, portraits, nature |
| `illustration` | Digital illustration style | Book covers, posters, art |
| `anime` | Japanese anime/manga style | Character art, storytelling |
| `3d-render` | 3D rendered graphics | Product visualization, architecture |
| `watercolor` | Soft watercolor painting | Artistic content, gentle themes |
| `oil-painting` | Classic oil painting style | Fine art, portraits |
| `minimalist` | Clean, simple design | UI/UX, modern branding |
| `cyberpunk` | Futuristic neon aesthetic | Tech content, gaming |
| `fantasy` | Magical, fantastical scenes | Gaming, storytelling |
| `vintage` | Retro, nostalgic look | Branding, historical content |

## Content Types

| Type | Description | Default AR | Use Case |
|------|-------------|------------|----------|
| `cover` | Article/video cover image | 16:9 | Blog posts, YouTube thumbnails |
| `screenshot` | UI/dashboard screenshot | 16:9 | Product demos, tutorials |
| `social` | Social media post | 1:1 | Instagram, Twitter, Facebook |
| `story` | Vertical story format | 9:16 | Instagram Stories, TikTok |
| `banner` | Wide banner image | 21:9 | Website headers, ads |
| `portrait` | Portrait orientation | 3:4 | Profile pictures, posters |
| `landscape` | Landscape orientation | 4:3 | Desktop wallpapers, prints |

## Aspect Ratios

Supported ratios: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `21:9`, `2.35:1`

## Quality Settings

| Quality | Resolution | Use Case |
|---------|------------|----------|
| `draft` | 512x512 | Quick previews |
| `standard` | 1024x1024 | General use |
| `high` | 2048x2048 | Print, professional |
| `ultra` | 4096x4096 | Large format, detailed work |

## Prompt Enhancement

The skill automatically enhances prompts based on style and type:

**Example Input**: "A cat"
**Enhanced (photorealistic)**: "A cat, professional photography, high detail, natural lighting, sharp focus, 8k resolution"
**Enhanced (illustration)**: "A cat, digital illustration, vibrant colors, clean lines, professional artwork, trending on artstation"

## Options

| Option | Description |
|--------|-------------|
| `--prompt <text>`, `-p` | Prompt text (required if not positional) |
| `--image <path>` | Output image path (default: auto-generated) |
| `--style <preset>` | Style preset (see Style Presets) |
| `--type <type>` | Content type (see Content Types) |
| `--ar <ratio>` | Aspect ratio (e.g., 16:9, 1:1) |
| `--quality draft\|standard\|high\|ultra` | Quality preset (default: high) |
| `--negative <text>` | Negative prompt (what to avoid) |
| `--seed <number>` | Random seed for reproducibility |
| `--steps <number>` | Inference steps (default: 50) |
| `--guidance <number>` | Guidance scale (default: 7.5) |
| `--json` | JSON output |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REPLICATE_API_TOKEN` | Replicate API token (required) |
| `NANOBANANA_MODEL` | Model override (default: google/nano-banana-pro) |
| `NANOBANANA_DEFAULT_STYLE` | Default style preset |
| `NANOBANANA_DEFAULT_QUALITY` | Default quality |

## Advanced Features

### 1. Batch Generation
```bash
# Generate multiple variations
nanobanana-image-gen "A cat" --n 4 --image cat-{n}.png
```

### 2. Style Mixing
```bash
# Combine multiple styles
nanobanana-image-gen "A cat" --style "photorealistic,anime" --weight "0.7,0.3"
```

### 3. Reference Images
```bash
# Use reference image for style
nanobanana-image-gen "A cat" --ref reference.jpg --image output.png
```

### 4. Prompt Templates
```bash
# Use predefined templates
nanobanana-image-gen --template "tech-cover" --subject "AI" --image cover.png
```

## Prompt Templates

| Template | Description | Variables |
|----------|-------------|-----------|
| `tech-cover` | Technology article cover | subject, color |
| `product-shot` | Product photography | product, background |
| `character-portrait` | Character portrait | character, mood |
| `landscape-scene` | Landscape photography | location, time |
| `ui-screenshot` | UI/dashboard screenshot | app, theme |

## Examples

### Cover Image for Blog Post
```bash
nanobanana-image-gen "AI and the future of work" \
  --type cover \
  --style photorealistic \
  --ar 16:9 \
  --image blog-cover.png
```

### Social Media Post
```bash
nanobanana-image-gen "New product launch celebration" \
  --type social \
  --style minimalist \
  --ar 1:1 \
  --image social-post.png
```

### UI Screenshot
```bash
nanobanana-image-gen "Modern dashboard with charts and graphs" \
  --type screenshot \
  --style minimalist \
  --ar 16:9 \
  --image dashboard.png
```

### Character Illustration
```bash
nanobanana-image-gen "A brave knight in shining armor" \
  --style anime \
  --type portrait \
  --ar 3:4 \
  --image knight.png
```

## Integration with Other Skills

### With baoyu-xhs-images
```bash
# Generate XHS infographic images with nanobanana
baoyu-xhs-images article.md --image-gen nanobanana
```

### With baoyu-cover-image
```bash
# Generate article cover with nanobanana
baoyu-cover-image article.md --provider nanobanana
```

## Error Handling

- Missing API token → error with setup instructions
- Generation failure → auto-retry once with adjusted parameters
- Invalid aspect ratio → warning, use closest supported ratio
- Prompt too long → auto-truncate with warning

## Output

Generated images are saved to specified path or auto-generated filename:
- Format: `nanobanana-{timestamp}-{hash}.png`
- Location: Current directory or specified path
- Metadata: Saved as `{image}.json` with generation parameters

## Notes

- Nano Banana Pro is optimized for high-quality, detailed images
- Generation time: 10-30 seconds depending on quality
- Cost: ~$0.01-0.05 per image depending on resolution
- Rate limit: 100 requests per minute

## Extension Support

Custom configurations via EXTEND.md:
- Default style presets
- Custom prompt templates
- Quality preferences
- Output directory

See `references/config/preferences-schema.md` for details.
