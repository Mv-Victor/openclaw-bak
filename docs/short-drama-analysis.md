# AI 短剧生成平台 - 开源项目分析 & 差异化方案

## 一、三个开源项目对比

### 1. huobao-drama (Go + Vue3)

**架构**: DDD 分层 (api/handlers → application/services → domain/models → infrastructure)

**核心流程**:
```
剧本输入 → 角色设计(Character) → 场景设计(Scene) → 分镜拆解(Storyboard) 
→ 帧提示词生成(FramePrompt) → 文生图(ImageGeneration) → 图生视频(VideoGeneration) 
→ 视频合并(VideoMerge) → 最终输出
```

**领域模型**:
- `Drama` → `Episode` → `Storyboard` (一对多层级)
- `Character` (角色库，含外观/性格/语音风格/参考图/seed值)
- `Scene` (场景，含地点/时间/提示词/生成图)
- `Storyboard` (分镜，含镜头类型/角度/运动/动作/对白/BGM提示/音效)
- `Prop` (道具库)
- `CharacterLibrary` (全局角色库，跨剧复用)
- `Asset` (统一素材管理，关联图片/视频/音频生成记录)

**AI 服务适配**: 支持 OpenAI/Gemini/豆包/ChatFire 多 provider，自动设置 endpoint

**亮点**:
- 角色一致性：通过 seed_value + reference_images 保持角色跨镜头一致
- 帧提示词系统：支持首帧/关键帧/尾帧/分镜板/动作序列 5 种类型
- 视频合并：FFmpeg 本地合并 + 异步任务轮询
- 资源转存：自动下载远程资源到本地存储

**不足**:
- 无剪映/Capcut 导出能力
- 视频合并只是简单拼接，无转场/字幕/BGM 叠加
- 前端 Vue3 但无移动端适配

---

### 2. Toonflow-app (Node.js + Express)

**架构**: Express 路由式，SQLite/MySQL，OSS 存储

**核心流程**:
```
项目创建 → 大纲脚本生成(Agent) → 分镜图生成 → Motion Prompt 生成 
→ 视频生成(多 provider) → 视频配置管理
```

**Motion Prompt 系统** (核心亮点):
- 专业的动画导演 prompt 模板
- 画面类型(前景/近景/中景/远景/全景) + 镜头运动 + 角色动作 + 环境动态 + 速度节奏
- 严格的 80-150 字长度控制
- 输出 JSON: `{time, name, content}`

**视频生成**:
- 支持 4 种模式: startEnd(首尾帧), multi(多图), single(单图), text(纯文本)
- 支持 RunningHub 等多 provider
- 多图自动拼接为网格图(sharp)
- Base64 图片自动上传 OSS

**亮点**:
- Motion Prompt 质量高，专业的镜头语言
- 视频配置灵活(configId 关联不同生成参数)
- 前端 Toonflow-web 有完整的分镜编辑 UI

**不足**:
- 无角色一致性方案
- 无视频合并/导出能力
- 无 BGM/音效/字幕系统

---

### 3. Toonflow-web (前端 UI)

主要是 Toonflow-app 的前端，提供分镜编辑、项目管理等 UI 组件。
不单独分析，作为 Toonflow 整体方案的一部分。

---

## 二、Polo API 关键接口

### Sora 视频生成 (异步)
```bash
POST https://poloai.top/v1/videos
Authorization: sk-xxx
Content-Type: multipart/form-data

model: sora-2-guan | sora-2-pro-guan
prompt: "动作描述"
input_reference: 图片文件(可选，尺寸需与视频一致)
seconds: 4 | 8 | 12
size: 1280x720 | 720x1280 | 1024x1792 | 1792x1024
```

**响应**: `{id, status: "queued", progress: 0}`
**查询**: `GET /v1/videos/{id}` → 轮询直到 status=completed

### 其他可用接口
- **文生图**: flux / flux-kontext-pro / stable-diffusion / ideogram / recraftv3
- **豆包**: seedream-4-0 文生图/图生图/多图生图 + 文生视频/图生视频
- **Veo**: 图生视频/文生视频
- **角色创建**: `/sora/v1/characters` (Sora 角色一致性)
- **带角色视频**: 创建视频时可指定 Character ID

---

## 三、差异化方案：DreamX 短剧引擎

### 核心差异点

| 维度 | huobao-drama | Toonflow | DreamX (我们) |
|------|-------------|----------|--------------|
| 最终输出 | MP4 拼接 | 单镜头视频 | **剪映工程文件** |
| 字幕系统 | 无 | 无 | **小红书爆款字幕** |
| BGM/音效 | 提示词级别 | 无 | **素材库召回+自动匹配** |
| 表情包 | 无 | 无 | **情绪召回穿插** |
| 角色一致性 | seed+参考图 | 无 | **Sora Character API** |
| 商业化 | 开源工具 | 开源工具 | **闲鱼/SaaS 变现** |

### 架构设计

```
用户输入(故事大纲/一句话)
    ↓
[Phase 1: 剧本生成] ← Claude LLM
    ├── 故事分析 → 角色提取 → 场景拆解
    ├── 分集剧本(每集 60-180s)
    └── 输出: ScriptDocument
    ↓
[Phase 2: 角色/场景设计] ← Polo 文生图 API
    ├── 角色设计图生成 (flux-kontext-pro)
    ├── Sora Character 创建 (角色一致性)
    ├── 场景背景图生成
    └── 输出: CharacterLibrary + SceneLibrary
    ↓
[Phase 3: 分镜生成] ← Claude LLM
    ├── 每集拆分为 N 个分镜 (参考 Toonflow 的 Motion Prompt 模板)
    ├── 每个分镜: 镜头类型 + 动作描述 + 对白 + 时长
    ├── 情绪标签 → 表情包/BGM 召回
    └── 输出: StoryboardList
    ↓
[Phase 4: 素材生成] ← Polo 图生视频/文生视频 API
    ├── 分镜图生成 (文生图，带角色参考)
    ├── 分镜视频生成 (图生视频，Sora/豆包/Veo)
    ├── TTS 配音生成
    ├── BGM 匹配 (SQLite 素材库召回)
    ├── 表情包匹配 (情绪标签召回)
    └── 输出: AssetBundle
    ↓
[Phase 5: 剪映工程构建] ← DreamX Engine (已有)
    ├── 视频轨道: 分镜视频按序排列
    ├── 字幕轨道: 小红书爆款风格
    ├── 音频轨道: 配音 + BGM
    ├── 贴纸轨道: 表情包穿插
    ├── 转场效果: 自动匹配
    └── 输出: Capcut XML + ZIP 下载链接
```

### 数据模型 (复用 DreamX 已有 + 扩展)

```
Drama (短剧)
├── style: 风格 (realistic/anime/comic)
├── genre: 类型 (romance/comedy/thriller)
├── episodes: Episode[]
│
├── Episode (集)
│   ├── scriptContent: 剧本文本
│   ├── storyboards: Storyboard[]
│   │
│   ├── Storyboard (分镜)
│   │   ├── shotType: 镜头类型
│   │   ├── motionPrompt: 动作提示词
│   │   ├── dialogue: 对白
│   │   ├── emotionTag: 情绪标签
│   │   ├── duration: 时长
│   │   ├── imageUrl: 分镜图
│   │   ├── videoUrl: 分镜视频
│   │   └── audioUrl: 配音音频
│   │
│   └── mergedVideoUrl: 合并后视频
│
├── characters: Character[]
│   ├── name, appearance, personality
│   ├── imageUrl: 角色设计图
│   ├── soraCharacterId: Sora 角色 ID (一致性)
│   └── referenceImages: 参考图集
│
└── scenes: Scene[]
    ├── location, time, mood
    └── imageUrl: 场景背景图
```

### 实现优先级

**P0 - MVP (1周)**:
1. 剧本 → 分镜拆解 (Claude LLM)
2. 分镜 → 文生图 (Polo flux API)
3. 分镜图 → 视频 (Polo Sora API)
4. 视频 + 字幕 + BGM → 剪映工程 (DreamX 已有)

**P1 - 角色一致性 (第2周)**:
1. Sora Character API 集成
2. 角色库持久化
3. 多集复用同一角色

**P2 - 商业化 (第3周)**:
1. 飞书 Bot 交互流程
2. 闲鱼商品模板
3. 批量生成 + 队列管理

### 技术选型

- **剧本/分镜 LLM**: Claude (已有 xchai 配置)
- **文生图**: Polo flux-kontext-pro (角色参考图支持)
- **图生视频**: Polo sora-2-guan (4/8/12s，支持角色)
- **TTS**: DreamX 已有
- **剪映工程**: DreamX VideoProject (已有)
- **素材库**: SQLite (已有 116 表情包 + 76 BGM)
- **存储**: 腾讯 COS (已有)

### 与 DreamX 现有能力的关系

```
DreamX 现有能力 (营销短视频):
  图片 + 文案 → 10s 剪映工程

DreamX 短剧扩展 (本方案):
  故事大纲 → N 个分镜视频 → 60-180s 剪映工程
  
共享组件:
  ✅ VideoProject 构建器
  ✅ Capcut XML 导出
  ✅ COS 上传
  ✅ 字幕样式系统
  ✅ BGM/表情包素材库
  ✅ TTS 配音
  
新增组件:
  🆕 剧本解析器 (LLM)
  🆕 分镜生成器 (LLM)
  🆕 Polo API 客户端 (文生图/图生视频)
  🆕 角色一致性管理 (Sora Character)
  🆕 多轨道时间线编排
```
