# Image Generation Preferences

## Default Settings

```yaml
default_provider: replicate
default_quality: 2k
default_aspect_ratio: "3:4"

default_model:
  replicate: google/nano-banana-pro
  google: null
  openai: null
  dashscope: null

save_location: /root/.openclaw/workspace-g/generated-images
```

## API Configuration

- Provider: Replicate (via Polo API)
- Model: google/nano-banana-pro
- Base URL: https://poloai.top
- Token: Configured via environment variable

## Notes

- 小红书图片默认使用 3:4 竖版比例
- 质量默认 2k (适合社交媒体)
- 图片保存到 workspace-g/generated-images/
