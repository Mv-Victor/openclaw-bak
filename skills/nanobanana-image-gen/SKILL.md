---
name: nanobanana-image-gen
description: Generate images using Nano Banana Pro with rich style prompts. Supports cover images, screenshots, social media posts, and more. Use when user mentions "生成图片", "封面图", "截图", "nanobanana", "图片生成", or wants to create visual content.
---

# Nano Banana Pro 图片生成

使用 Google Nano Banana Pro 生成高质量图片，支持多种风格和场景。

## 功能特性

- 🎨 **丰富的风格库** - 10000+ 精选 prompts
- 🖼️ **多种使用场景** - 封面图、社交媒体、产品营销、YouTube 缩略图等
- 🎭 **多样化风格** - 摄影、动漫、插画、3D 渲染、像素艺术等
- 📐 **精确控制** - 详细的构图和光照控制
- ⚡ **快速生成** - 高质量输出

## 使用方式

### 基础用法

```
生成一张图片：[描述]
```

### 指定风格

```
生成一张 [风格] 风格的图片：[描述]
```

### 指定场景

```
生成一张 [场景] 图片：[描述]
```

## 支持的风格

### 摄影风格
- **人像摄影** - Portrait photography
- **产品摄影** - Product photography
- **风景摄影** - Landscape photography
- **街拍** - Street photography
- **电影剧照** - Cinematic film still

### 插画风格
- **动漫/漫画** - Anime/Manga style
- **水彩画** - Watercolor
- **油画** - Oil painting
- **水墨/中国风** - Ink/Chinese style
- **像素艺术** - Pixel art

### 3D 风格
- **3D 渲染** - 3D render
- **等距视角** - Isometric
- **Q 版/Q 萌风** - Chibi/Q style

### 特殊风格
- **赛博朋克/科幻** - Cyberpunk/Sci-fi
- **复古/怀旧** - Retro/Vintage
- **极简主义** - Minimalism
- **草图/线稿** - Sketch/Line art

## 使用场景

### 社交媒体
- **个人资料/头像** - Profile/Avatar
- **社交媒体帖子** - Social media post
- **小红书图片** - Xiaohongshu images
- **Instagram 帖子** - Instagram post

### 营销推广
- **产品营销** - Product marketing
- **电商主图** - E-commerce main image
- **海报/传单** - Poster/Flyer
- **YouTube 缩略图** - YouTube thumbnail

### 内容创作
- **封面图** - Cover image
- **信息图/教育视觉图** - Infographic/Educational visual
- **漫画/故事板** - Comic/Storyboard
- **游戏素材** - Game asset

### 设计
- **App/网页设计** - App/Web design
- **图表** - Diagram/Chart
- **文本/排版** - Text/Typography
- **抽象/背景** - Abstract/Background

## 精选 Prompts

### 1. 引言卡片（带肖像）

**适用场景**: 社交媒体、封面图
**风格**: 摄影 + 排版

```
一张宽幅引言卡片，上面印有一位名人，背景为棕色，引言文字为浅金色衬线字体："{quote}"，下方是较小的文字："—{author}"。文字前面有一个大而柔和的引号。人物肖像在左侧，文字在右侧。文字占据图片的三分之二，肖像占据三分之一，肖像部分带有轻微的渐变过渡效果。
```

### 2. 小红书风格图片

**适用场景**: 小红书、社交媒体
**风格**: 插画 + 排版

```
小红书风格的信息图，{style} 风格，{layout} 布局，主题：{topic}。使用明亮的色彩，清晰的排版，吸引眼球的视觉元素。
```

**可选风格**:
- cute（可爱）
- fresh（清新）
- warm（温暖）
- bold（大胆）
- minimal（极简）
- retro（复古）
- pop（波普）
- notion（知识卡片）
- chalkboard（黑板）
- study-notes（学习笔记）

**可选布局**:
- sparse（稀疏）
- balanced（平衡）
- dense（密集）
- list（列表）
- comparison（对比）
- flow（流程）
- mindmap（思维导图）
- quadrant（四象限）

### 3. YouTube 缩略图

**适用场景**: YouTube、视频封面
**风格**: 摄影 + 排版

```
YouTube 缩略图，主题：{topic}。使用大而醒目的文字，高对比度的颜色，吸引眼球的视觉元素。人物表情夸张，背景简洁。16:9 比例。
```

### 4. 产品营销图

**适用场景**: 电商、产品推广
**风格**: 产品摄影

```
产品营销图，{product} 产品，{style} 风格。干净的背景，专业的光照，突出产品特点。高质量的产品摄影。
```

### 5. 封面图

**适用场景**: 文章封面、博客
**风格**: 插画/摄影

```
文章封面图，主题：{topic}，{style} 风格。视觉吸引力强，与主题相关，适合作为文章配图。
```

### 6. 信息图

**适用场景**: 教育、数据可视化
**风格**: 图表 + 插画

```
信息图，主题：{topic}。清晰的数据可视化，易于理解的图表，吸引眼球的设计。使用图标和插画增强视觉效果。
```

### 7. 人物头像

**适用场景**: 个人资料、社交媒体
**风格**: 人像摄影/插画

```
{style} 风格的人物头像，{description}。高质量，专业，适合作为个人资料图片。
```

### 8. 游戏素材

**适用场景**: 游戏开发
**风格**: 像素艺术/3D 渲染

```
游戏素材，{type}，{style} 风格。适合 {game_type} 游戏使用。
```

### 9. 海报设计

**适用场景**: 活动推广、宣传
**风格**: 平面设计

```
{event} 活动海报，{style} 风格。包含活动标题、时间、地点等信息。视觉冲击力强，吸引眼球。
```

### 10. 抽象背景

**适用场景**: 网页背景、PPT
**风格**: 抽象艺术

```
抽象背景，{color_scheme} 配色，{style} 风格。适合作为网页或 PPT 背景。
```

## 使用示例

### 示例 1: 生成文章封面图

**用户**: 帮我生成一张关于 AI 未来的文章封面图

**AI 回复**:
```
我来为你生成一张 AI 未来主题的封面图。

使用 Nano Banana Pro 生成：

Prompt: 文章封面图，主题：AI 的未来，科幻风格。展示人工智能、机器人、未来城市等元素。使用蓝色和紫色的配色，营造科技感。高质量的插画风格。

[调用 Nano Banana Pro API 生成图片]

✅ 图片已生成！
```

### 示例 2: 生成小红书图片

**用户**: 生成一组小红书图片，主题是健康饮食

**AI 回复**:
```
我来为你生成小红书风格的健康饮食图片。

使用 Nano Banana Pro 生成：

Prompt: 小红书风格的信息图，fresh（清新）风格，list（列表）布局，主题：健康饮食小贴士。使用明亮的色彩，清晰的排版，包含食物图标和文字说明。

[调用 Nano Banana Pro API 生成图片]

✅ 图片已生成！
```

### 示例 3: 生成 YouTube 缩略图

**用户**: 帮我生成一张 YouTube 视频缩略图，主题是"10 个 Python 技巧"

**AI 回复**:
```
我来为你生成 YouTube 缩略图。

使用 Nano Banana Pro 生成：

Prompt: YouTube 缩略图，主题：10 个 Python 技巧。使用大而醒目的文字"10 个 Python 技巧"，高对比度的颜色（黄色和黑色），Python logo，代码元素。人物表情兴奋，背景简洁。16:9 比例。

[调用 Nano Banana Pro API 生成图片]

✅ 图片已生成！
```

## API 调用

### Nano Banana Pro API

**注意**: 实际使用时需要配置 Nano Banana Pro API 密钥。

```bash
# 环境变量
export NANOBANANA_API_KEY="your_api_key"
export NANOBANANA_API_URL="https://api.nanobanana.com/v1/generate"
```

### 调用示例

```bash
curl -X POST https://api.nanobanana.com/v1/generate \
  -H "Authorization: Bearer $NANOBANANA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "文章封面图，主题：AI 的未来，科幻风格",
    "width": 1024,
    "height": 1024,
    "num_images": 1
  }'
```

## 注意事项

1. **API 密钥**: 需要配置 Nano Banana Pro API 密钥
2. **费用**: 每次生成图片会消耗 API 额度
3. **版权**: 生成的图片版权归用户所有
4. **内容审核**: 不支持生成违规内容

## 参考资源

- [Nano Banana Pro 官网](https://nanobanana.com)
- [Awesome Nano Banana Pro Prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts)
- [YouMind Nano Banana Pro 提示词图库](https://youmind.com/zh-CN/nano-banana-pro-prompts)

## 更新日志

- 2026-03-07: 初始版本，整合 10000+ 精选 prompts
