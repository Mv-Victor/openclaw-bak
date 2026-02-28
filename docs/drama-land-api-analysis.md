# Drama.Land API 与模型分析报告

**调查时间**: 2026-02-28  
**数据来源**: 
- `https://cn.drama.land/backend-api/api/v1/user/get_points_config`
- `https://cn.drama.land/backend-api/api/v1/showcase/items`
- `https://cn.drama.land/backend-api/api/v1/payment/benefits-packs`

---

## 🎯 核心发现

### 1. 视频生成模型列表

Drama.Land 支持以下视频生成模型：

| 模型 ID | MV 模式积分 | 普通模式积分 | 是否新模型 |
|---------|------------|-------------|-----------|
| `dlai2v` | 200 | 400 | ❌ |
| `dlim2v` | 200 | 300 | ❌ (默认) |
| `seedance-1-5` | 300 | 600 | ❌ |
| `longcat-avatar` | 300 | 600 | ❌ |
| `dli2v3` | 200 | 400 | ❌ |
| `kling-o3-ref2v` | 700 | 1500 | ✅ 新 |
| `kling-o3-pro-ref2v` | 900 | 2400 | ✅ 新 |

**默认模型**: `dlim2v`

### 模型推测

| 模型 ID | 推测真实模型 | 置信度 | 理由 |
|---------|-------------|--------|------|
| `dlai2v` | 即梦 AI (Dreamina) Image-to-Video | 80% | "dl" 开头，可能是字节即梦 |
| `dlim2v` | 即梦 AI (Dreamina) | 80% | 默认模型，性价比高 |
| `seedance-1-5` | SeaDance 1.5 (字节？) | 60% | 名称暗示舞蹈/动作生成 |
| `longcat-avatar` | LongCat Avatar (阿里？) | 70% | "longcat" 可能是阿里的模型 |
| `dli2v3` | 即梦 AI v3 | 75% | "dl" 前缀 + v3 版本号 |
| `kling-o3-ref2v` | **可灵 1.5 (Kling)** | 95% | "kling" 明确指向快手可灵 |
| `kling-o3-pro-ref2v` | **可灵 Pro (Kling Pro)** | 95% | "kling" + "pro" 高端版本 |

### 关键结论

**文生视频主要供应商**:
1. **快手可灵 (Kling)** - 高端模型，支持参考图 (`ref2v` = reference-to-video)
2. **字节即梦 (Dreamina)** - 中端模型，性价比高
3. **其他** - 可能是内部自研或其他供应商

---

## 💰 积分消耗体系

### 核心功能积分

| 功能 | 积分消耗 | 说明 |
|------|---------|------|
| `chat` | 1 | AI 对话 |
| `synopsis_generate` | 20 | 剧情大纲生成 |
| `character_image_voice_generate` | 50 | 角色图像 + 声音生成 |
| `planning_center_generate` | 15 | 规划中心生成 |
| `script_generate` | 10 | 剧本生成 |
| `scene_design_generate` | 50 | 场景设计生成 |
| `segment_generate` | 60 | 片段生成 |
| `segment_video_generate` | **300** | **片段视频生成** |
| `music_generate` | 50 | 音乐生成 |
| `compose_generate` | 5 | 合成 |
| `ai_image_edit` | 50 | AI 图像编辑 |
| `segment_video_edit` | **300** | 片段视频编辑 |
| `ai_text_edit` | 20 | AI 文本编辑 |

### 视频模型消耗对比

**MV 模式** (音乐视频):
- 即梦系列：200-300 积分
- 可灵系列：700-900 积分

**普通模式**:
- 即梦系列：300-600 积分
- 可灵系列：1500-2400 积分

**结论**: 可灵模型消耗是即梦的 3-4 倍，定位高端市场。

---

## 🔍 API 接口分析

### 已发现的 API

| 接口 | 用途 | 认证 |
|------|------|------|
| `GET /backend-api/api/v1/showcase/items` | 获取展示作品列表 | 无需认证 |
| `GET /backend-api/api/v1/user/get_points_config` | 获取积分配置 | 需登录 |
| `GET /backend-api/api/v1/payment/benefits-packs` | 获取会员套餐 | 需登录 |

### 推测的生成接口

基于前端代码和积分配置，推测以下接口存在：

```
POST /backend-api/api/v1/generate/segment_video
POST /backend-api/api/v1/generate/music
POST /backend-api/api/v1/generate/character
POST /backend-api/api/v1/generate/script
```

### 请求体推测

```json
{
  "model": "kling-o3-ref2v",
  "prompt": "...",
  "negative_prompt": "...",
  "duration": 5,
  "resolution": "720p",
  "reference_images": ["..."],
  "audio_url": "...",
  "parameters": {
    "motion_strength": 0.7,
    "creativity": 0.8
  }
}
```

---

## 🎬 文生图功能推测

虽然没直接拿到文生图模型列表，但从 `character_image_voice_generate: 50` 积分可以推测：

### 可能的文生图模型

| 功能 | 推测模型 | 理由 |
|------|---------|------|
| 角色设计参考表 | **Flux.1 Pro** | 多视图布局 + 角色一致性 |
| 场景概念图 | **Midjourney v6** 或 **SDXL** | 高质量场景生成 |
| 角色一致性保持 | **Flux.1** 或 **Stable Diffusion + LoRA** | 业界最佳 |

### Prompt 工程特征

基于栋少提供的例子：

```
Character design reference sheet.
Maintaining exact same facial features, face structure, skin tone, and body proportions as the original character.
Consistent rendering style across all views, matching the original reference.
Left: chest-up close-up portrait facing camera with a desperate, begging expression and tearful eyes.
Right: full-body three-view turnaround showing front, side, and back in a neutral standing pose.
Identity features: [详细特征]
New look: [新造型]
Clean studio backdrop. Raw natural lighting.
Visual style: [风格描述]
```

**特征分析**:
- "Character design reference sheet" - Flux 经典开头
- "Maintaining exact same facial features..." - 角色一致性描述
- "Left: ... Right: ..." - 多视图位置控制
- "Clean studio backdrop. Raw natural lighting." - 摄影风格术语

**结论**: 高度匹配 **Flux.1 Pro/Dev** 的 prompt 工程风格。

---

## 📊 竞品对比

| 平台 | 文生图模型 | 文生视频模型 | 特色 |
|------|-----------|-------------|------|
| **Drama.Land** | Flux.1 (推测) | 可灵 1.5 + 即梦 | 角色一致性 + 音乐 MV 集成 |
| Runway Gen-3 | 自研 | Gen-3 Alpha | 电影级质量 |
| Pika 1.5 | 自研 | Pika 1.5 | 快速迭代 |
| Luma | 自研 | Dream Machine | 物理模拟准确 |

**Drama.Land 优势**:
1. 多模型选择（从性价比到高端）
2. 专注音乐 MV 场景（差异化）
3. 完整工作流（剧本→角色→场景→视频→合成）

---

## 🎯 DreamX Studio 集成建议

### 推荐模型配置

| 功能 | 推荐模型 | 理由 |
|------|---------|------|
| 角色设计 | Flux.1 Pro | 角色一致性最佳 |
| 场景生成 | SDXL 或 Midjourney | 高质量场景 |
| 视频生成 (标准) | 即梦 `dlim2v` | 性价比高 (300 积分) |
| 视频生成 (高端) | 可灵 `kling-o3-ref2v` | 质量最佳 (700 积分) |
| 音乐生成 | Polo API 集成 | 栋少已有资源 |

### API 集成优先级

1. **P0**: Polo API (已有 token)
2. **P1**: 可灵 API (快手内部资源？)
3. **P2**: Flux.1 API (文生图)

---

## 📝 下一步行动

1. **验证模型**: 通过啾啾手动登录 Drama.Land，确认实际使用的模型
2. **Network 抓包**: 记录生成视频时的真实 API 请求
3. **测试生成**: 用 Polo API 测试文生图/文生视频
4. **Prompt 库**: 建立可复用的 prompt 模板

---

**报告人**: G  
**时间**: 2026-02-28 14:30 UTC
