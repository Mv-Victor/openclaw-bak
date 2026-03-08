---
name: lnapi-image-gen
description: Generate images using LN API (lnapi.com) with nano-banana models. Supports multiple quality presets and aspect ratios. Use when user mentions "生成图片", "文生图", "lnapi", or wants to create visual content.
---

# LN API Image Generation

AI image generation using LN API's nano-banana models. Supports multiple quality levels and aspect ratios.

## ⚠️ Important

**每次调用都会产生费用！请谨慎使用，不要随意测试。**

## Quick Start

```bash
# Basic generation (nano-banana)
lnapi-image-gen "一张逼真的高分辨率照片，拍摄的是繁忙的城市街道"

# High quality (nano-banana-pro 4K)
lnapi-image-gen "一张逼真的高分辨率照片，拍摄的是繁忙的城市街道" --model nano-banana-pro --quality 4K

# With aspect ratio
lnapi-image-gen "一张逼真的高分辨率照片，拍摄的是繁忙的城市街道" --model nano-banana-pro-2k --ar 16:9
```

## Models

| Model | Description | Quality | Speed |
|-------|-------------|---------|-------|
| `nano-banana` | Base model | Standard | Fast |
| `nano-banana-pro` | Pro model (gemini-3-pro-image-preview) | High (4K) | Medium |
| `nano-banana-pro-2k` | Pro model 2K preset | 2K | Medium |
| `nano-banana-pro-4k` | Pro model 4K preset | 4K | Slow |

## Aspect Ratios

Supported ratios: `1:1`, `2:3`, `3:2`, `16:9`, `9:16`, `4:3`, `3:4`

## Usage

```bash
# Basic
lnapi-image-gen "prompt" --image output.png

# With model selection
lnapi-image-gen "prompt" --model nano-banana-pro --image output.png

# With quality and aspect ratio
lnapi-image-gen "prompt" --model nano-banana-pro --quality 4K --ar 2:3 --image output.png

# Return URL instead of downloading
lnapi-image-gen "prompt" --format url
```

## Options

| Option | Description |
|--------|-------------|
| `--prompt <text>`, `-p` | Prompt text (required if not positional) |
| `--image <path>` | Output image path (default: auto-generated) |
| `--model <name>` | Model name (default: nano-banana) |
| `--quality <size>` | Quality: 4K (nano-banana-pro only) |
| `--ar <ratio>` | Aspect ratio (default: 2:3) |
| `--format url\|file` | Return URL or download file (default: file) |
| `--timeout <seconds>` | Request timeout (default: 120) |
| `--json` | JSON output |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LNAPI_API_KEY` | LN API key (required) |
| `LNAPI_ENDPOINT` | API endpoint (default: lnapi.com) |
| `LNAPI_DEFAULT_MODEL` | Default model |
| `LNAPI_DEFAULT_TIMEOUT` | Default timeout in seconds |

## Examples

### Standard Quality
```bash
lnapi-image-gen "一只可爱的猫咪" --model nano-banana --ar 1:1 --image cat.png
```

### High Quality 4K
```bash
lnapi-image-gen "未来城市夜景" --model nano-banana-pro --quality 4K --ar 16:9 --image city.png
```

### 2K Preset
```bash
lnapi-image-gen "山水风景画" --model nano-banana-pro-2k --ar 3:2 --image landscape.png
```

### Get URL Only
```bash
lnapi-image-gen "产品海报" --model nano-banana-pro-4k --ar 2:3 --format url
```

## Output

- **File mode**: Downloads image to specified path
- **URL mode**: Returns image URL (valid for limited time)
- **Metadata**: Saved as `{image}.json` with generation parameters

## Error Handling

- Missing API key → error with setup instructions
- Generation failure → detailed error message
- Timeout → increase with `--timeout` option
- Invalid parameters → validation error with suggestions

## Cost Considerations

⚠️ **每次调用都会产生费用**
- nano-banana: 较低成本
- nano-banana-pro (4K): 较高成本
- nano-banana-pro-2k: 中等成本
- nano-banana-pro-4k: 最高成本

**建议**：
- 开发测试时使用 nano-banana
- 生产环境根据需求选择合适的模型
- 使用 `--format url` 避免重复下载

## Notes

- 请求超时时间默认 120 秒（可调整）
- 4K 图片生成时间较长，建议设置更长的超时时间
- API 返回的 URL 有时效性，建议及时下载
- 支持中文 prompt

## Configuration

Create `~/.openclaw/workspace/skills/lnapi-image-gen/config.json`:

```json
{
  "apiKey": "sk-your-api-key",
  "defaultModel": "nano-banana-pro-2k",
  "defaultTimeout": 180,
  "defaultAspectRatio": "16:9"
}
```
