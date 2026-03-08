# LN API Image Generation - Examples

## ⚠️ 重要提醒

**每次调用都会产生费用！请谨慎使用，不要随意测试。**

## 基础使用

### 1. 标准质量（nano-banana）
```bash
lnapi-image-gen "一只可爱的猫咪" --model nano-banana --ar 1:1 --image cat.png
```

### 2. 高质量 2K（推荐）
```bash
lnapi-image-gen "未来城市夜景" --model nano-banana-pro-2k --ar 16:9 --image city.png
```

### 3. 超高质量 4K
```bash
lnapi-image-gen "山水风景画" --model nano-banana-pro --quality 4K --ar 3:2 --image landscape.png
```

### 4. 只获取 URL（不下载）
```bash
lnapi-image-gen "产品海报" --model nano-banana-pro-2k --ar 2:3 --format url
```

## 常见场景

### 封面图（16:9）
```bash
lnapi-image-gen "AI技术文章封面，科技感，蓝色调" --model nano-banana-pro-2k --ar 16:9 --image cover.png
```

### 社交媒体（1:1）
```bash
lnapi-image-gen "产品发布海报，简约风格" --model nano-banana-pro-2k --ar 1:1 --image social.png
```

### 竖版海报（2:3）
```bash
lnapi-image-gen "电影海报，悬疑风格" --model nano-banana-pro-2k --ar 2:3 --image poster.png
```

### 手机壁纸（9:16）
```bash
lnapi-image-gen "星空夜景，梦幻风格" --model nano-banana-pro-2k --ar 9:16 --image wallpaper.png
```

## 模型选择建议

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 快速预览 | nano-banana | 速度快，成本低 |
| 日常使用 | nano-banana-pro-2k | 质量好，性价比高 |
| 高质量输出 | nano-banana-pro (4K) | 最高质量，适合打印 |

## 超时设置

不同模型建议的超时时间：
- nano-banana: 60-90 秒
- nano-banana-pro-2k: 90-120 秒
- nano-banana-pro (4K): 120-180 秒

```bash
# 设置 180 秒超时
lnapi-image-gen "复杂场景" --model nano-banana-pro --quality 4K --timeout 180
```

## JSON 输出

```bash
lnapi-image-gen "测试图片" --model nano-banana-pro-2k --json
```

输出：
```json
{
  "image": "lnapi-1234567890.png",
  "metadata": "lnapi-1234567890.png.json",
  "url": "https://..."
}
```

## 环境变量配置

```bash
# 设置 API Key
export LNAPI_API_KEY="sk-your-api-key"

# 设置默认模型
export LNAPI_DEFAULT_MODEL="nano-banana-pro-2k"

# 设置默认超时（秒）
export LNAPI_DEFAULT_TIMEOUT="180"
```

## 成本优化建议

1. **开发测试**: 使用 `nano-banana` 或 `--format url` 避免重复下载
2. **生产环境**: 根据需求选择 2K 或 4K
3. **批量生成**: 提前规划好 prompt，避免重复调用
4. **缓存结果**: 保存生成的图片和 metadata，避免重复生成相同内容
