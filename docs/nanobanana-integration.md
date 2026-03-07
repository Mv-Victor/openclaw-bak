# Nano Banana 集成方案

## 概述

已为 G 和啾啾两个 agent 安装以下 skills：
1. `baoyu-danger-x-to-markdown` - X 内容转 Markdown
2. `baoyu-xhs-images` - 小红书图片生成
3. `baoyu-image-gen` - AI 图片生成（已支持 Nano Banana Pro）
4. `nanobanana-image-gen` - Nano Banana 风格库和文档

## 安装位置

### G (总指挥/军师/智库)
- Workspace: `/root/.openclaw/workspace-g/skills/`
- Skills:
  - `baoyu-danger-x-to-markdown/`
  - `baoyu-xhs-images/`
  - `baoyu-image-gen/`
  - `nanobanana-image-gen/`

### 啾啾 (工程师/创作官)
- Workspace: `/root/.openclaw/workspace/skills/`
- Skills:
  - `baoyu-danger-x-to-markdown/`
  - `baoyu-xhs-images/`
  - `baoyu-image-gen/`
  - `nanobanana-image-gen/`

## Nano Banana 使用方式

### 方式 1: 通过 baoyu-image-gen（推荐）

`baoyu-image-gen` 已经内置支持 Replicate，默认模型就是 `google/nano-banana-pro`。

**环境变量配置**:
```bash
export REPLICATE_API_TOKEN="your_replicate_token"
```

**使用示例**:
```bash
# 使用默认 Replicate provider (nano-banana-pro)
bun scripts/main.ts --prompt "一只可爱的猫" --image cat.png --provider replicate

# 指定 nano-banana 模型
bun scripts/main.ts --prompt "一只可爱的猫" --image cat.png --provider replicate --model google/nano-banana

# 使用 nano-banana-pro（默认）
bun scripts/main.ts --prompt "一只可爱的猫" --image cat.png --provider replicate --model google/nano-banana-pro
```

### 方式 2: 通过 Polo API（栋少已有 token）

Polo API 支持多种模型，包括 Nano Banana。

**环境变量配置**:
```bash
export REPLICATE_API_TOKEN="sk-vPYI81WXaBK95LE9TGPRWMVlpQ6YOOkKCKopNTtiFWROBxPW"
export REPLICATE_BASE_URL="https://poloai.top"
```

**使用示例**:
```bash
# 通过 Polo API 使用 nano-banana
bun scripts/main.ts --prompt "一只可爱的猫" --image cat.png --provider replicate --model google/nano-banana-pro
```

## 风格库整合

### Nano Banana 风格库

`nanobanana-image-gen/prompts-library.md` 包含 10000+ 精选 prompts，涵盖：

**社交媒体**:
- 引言卡片（带肖像）
- Instagram 风格帖子
- 小红书封面图

**营销推广**:
- 产品展示图
- 电商主图
- 促销海报

**内容创作**:
- 文章封面图
- YouTube 缩略图
- 博客配图

**教育/信息图**:
- 知识卡片
- 数据可视化
- 教程步骤图

**人物/角色**:
- 专业头像
- 动漫角色
- Q 版角色

**场景/背景**:
- 科幻场景
- 自然风景
- 抽象背景

**游戏素材**:
- 像素艺术
- 3D 游戏素材
- 游戏 UI 元素

**设计元素**:
- Logo 设计
- 图标集
- 排版设计

**特殊效果**:
- 水墨画
- 油画
- 水彩画

### 小红书图片生成整合

`baoyu-xhs-images` 已支持 10 种视觉风格：
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

**整合方案**:
1. `baoyu-xhs-images` 生成小红书图片时，可以使用 `baoyu-image-gen` 的 Replicate provider
2. 从 `nanobanana-image-gen/prompts-library.md` 中选择合适的 prompt 模板
3. 结合小红书风格和 Nano Banana 的高质量渲染

## 使用流程

### 场景 1: 生成小红书封面图

```bash
# Step 1: 使用 baoyu-xhs-images 分析内容并生成 outline
# (通过 AI agent 调用)

# Step 2: 使用 baoyu-image-gen + Replicate (nano-banana) 生成图片
bun baoyu-image-gen/scripts/main.ts \
  --prompt "小红书封面图，AI 工具推荐主题，cute 风格。使用大标题，吸引眼球的视觉元素，明亮的色彩。9:16 竖版比例。" \
  --image cover.png \
  --provider replicate \
  --ar 9:16
```

### 场景 2: X 内容转 Markdown + 生成配图

```bash
# Step 1: 转换 X 内容为 Markdown
bun baoyu-danger-x-to-markdown/scripts/main.ts https://x.com/user/status/123 -o article.md

# Step 2: 为文章生成封面图
bun baoyu-image-gen/scripts/main.ts \
  --prompt "文章封面图，主题：AI 的未来，科幻风格。展示人工智能、机器人、未来城市等元素。使用蓝色和紫色的配色，营造科技感。高质量的插画风格。" \
  --image cover.png \
  --provider replicate \
  --ar 16:9
```

### 场景 3: 批量生成小红书图片系列

```bash
# 使用 baoyu-xhs-images 的完整工作流
# AI agent 会自动调用 baoyu-image-gen 生成每张图片
# 通过 --provider replicate 使用 Nano Banana
```

## API 配置

### Replicate 官方 API
```bash
export REPLICATE_API_TOKEN="your_token_here"
```
获取地址: https://replicate.com/account/api-tokens

### Polo API（栋少已有）
```bash
export REPLICATE_API_TOKEN="sk-vPYI81WXaBK95LE9TGPRWMVlpQ6YOOkKCKopNTtiFWROBxPW"
export REPLICATE_BASE_URL="https://poloai.top"
```

支持的模型：
- Sora-2
- 豆包
- Veo
- 可灵
- 万相
- Flux
- Nano Banana

## 费用控制

⚠️ **重要提醒**（栋少 2026-02-26 要求）:
- 文生图和文生视频 API 每次调用花费不菲
- **强限制**: 每次调用必须能完成任务进度，不要做无意义的调用
- 禁止: 测试性调用、已知会失败的重试、模型不可用时的盲目提交
- 必须: 调用前验证模型/渠道可用性，失败后分析原因再决定是否重试

## Prompts 库（2026-03-08 更新）

### awesome-nano-banana-pro-prompts 整合完成 ✅

已从 [YouMind-OpenLab/awesome-nano-banana-pro-prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts) 仓库整合：

**统计数据**:
- 📝 总 prompts 数: **10835**
- ⭐ 精选 prompts: **9**
- 📄 完整库位置: `nanobanana-image-gen/awesome-prompts-full.md`

**主要分类**:

**使用场景**:
- 个人资料/头像
- 社交媒体帖子
- 信息图/教育视觉图
- YouTube 缩略图
- 漫画/故事板
- 产品营销
- 电商主图
- 游戏素材
- 海报/传单
- App/网页设计

**风格**:
- 摄影、电影/电影剧照
- 动漫/漫画、插画
- 草图/线稿、漫画/图画小说
- 3D 渲染、Q 版/Q 萌风、等距
- 像素艺术
- 油画、水彩画、水墨/中国风
- 复古/怀旧、赛博朋克/科幻
- 极简主义

**主体**:
- 人像/自拍、网红/模特、角色
- 团体/情侣
- 产品、食品/饮料、时尚单品
- 动物/生物、车辆
- 建筑/室内设计
- 风景/自然、城市风光/街道
- 图表、文本/排版
- 摘要/背景

**精选 Prompts 示例**:
1. 带肖像和中英文定制的宽引言卡（支持 Raycast 动态参数）
2. 高级液态玻璃 Bento 网格产品信息图（8 个模块）
3. 手绘风格标题图片（从照片生成）

**在线图库**: [YouMind Nano Banana Pro 提示词图库](https://youmind.com/zh-CN/nano-banana-pro-prompts)

## 下一步工作

### 1. 扩展 baoyu-xhs-images 的风格库
- 将 Nano Banana 的风格关键词整合到小红书图片生成流程
- 为每种小红书风格匹配最佳的 Nano Banana prompt 模板

### 2. 创建快捷命令
- 为常用场景创建快捷脚本
- 例如: `generate-xhs-cover.sh`, `x-to-article.sh` 等

## 参考资源

- [Nano Banana Pro 官网](https://nanobanana.com)
- [Awesome Nano Banana Pro Prompts](https://github.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts)
- [YouMind Nano Banana Pro 提示词图库](https://youmind.com/zh-CN/nano-banana-pro-prompts)
- [Polo API 文档](https://poloai.top)
- [Replicate API 文档](https://replicate.com/docs)

## 更新日志

- 2026-03-08: 初始集成完成
  - 为 G 和啾啾安装 4 个 skills
  - 确认 baoyu-image-gen 已支持 Nano Banana
  - 创建集成文档
