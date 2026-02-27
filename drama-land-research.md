# Drama.Land 技术调研报告

## 1. 技术栈

### 前端
| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 14+ App Router | RSC 流式渲染，路由 `[locale]/(dashboard)/canvas/page` |
| UI 框架 | React 18+ | Server Components + Client Components 混合 |
| 样式 | Tailwind CSS | 原子类，暗色主题 `dark` |
| 组件库 | Radix UI | Dialog、Select、Tooltip 等无样式基础组件 |
| 图标 | Lucide Icons | SVG 图标库 |
| 画布引擎 | React Flow (@xyflow/react) | 节点流程图，含 MiniMap、Controls、Background、Panel |
| 状态管理 | Zustand + Immer | 轻量 store，不可变更新 |
| 国际化 | next-intl | 支持 en / zh-cn，messages 注入 RSC payload |
| 动画 | Lottie | 节点加载动效 |
| 音频 | 原生 HTML5 Audio API | 自封装 GlobalAudioManager，支持播放/暂停/seek/音量 |
| 富文本 | Marked.js | Markdown 渲染（剧本、故事内容） |
| 字体 | next/font | woff2 自托管 |

### 后端（从 API 推断）
| 层级 | 技术 | 说明 |
|------|------|------|
| API 网关 | Next.js Rewrites → `/backend-api/` | 前端统一代理到后端 |
| 认证 | Firebase Auth | project: `drama-land-studio`，app: `1:105668650537:web:4779b1391fc796d0029e38` |
| 用户系统 | Firebase UID | 如 `FLP6Yg0BKZhO5fdy9WrzgaQKA8F2` |
| 存储 | Google Cloud Storage | bucket: `dramaland-public`（图片、音频、视频） |
| 视频导出 | Google Cloud Run | `dramaland-video-export-765296137507.us-central1.run.app` |
| 实时通信 | SSE (Server-Sent Events) | AI 生成进度推送 |
| API 风格 | RESTful JSON | 统一响应格式 `{ code: 200, message: "请求成功", data: ... }` |
| 分析 | GTM + Google Ads | GTM-52K2FDQP, AW-17868813659 |

### 基础设施
- 双区域部署：`cn.drama.land`（中国）/ `drama.land`（国际）
- 静态资源：GCS `dramaland-public` bucket
- 音频预览：`storage.googleapis.com/dramaland-public/character_voice_previews/`
- UGC 媒体：`storage.googleapis.com/dramaland-public/ugc_media/YYYYMMDD/`
- 视觉风格图：`storage.googleapis.com/dramaland-public/visual_style_images/`
- 公司主体：PawLogic Limited

---

## 2. 详细页面设计

### 2.1 首页 `/zh-cn`（未登录）
- 顶部红色公告栏："即将来袭：更稳的角色、更准的卡点、更自由的表达"
- 导航栏：Logo + "注册/登录" 按钮
- Hero 区域：全屏背景视频（`landingpage_new_bg.mp4`），大标题 "把你的想法'玩'成一支音乐MV"
- 创作输入框：textarea + 模式切换（单集视频/连续剧集/剧本模式/音乐MV）+ 语言选择 + 上传音频/资产按钮 + 生成按钮
- Showcases 展示区："Drama.Land 档案馆"，瀑布流视频卡片
- Footer：关于/超级创作者计划/隐私政策/使用条款 + 社交链接（X/YouTube/Discord/小红书）

### 2.2 项目列表页 `/zh-cn/projects`（登录后）
- 顶部导航：Logo + 积分显示（4,825）+ 订阅等级（STARTER）
- 底部 Tab 栏：首页 / 存档 / 资产
- "导演工案" 标题 + 副标题
- 项目卡片列表：
  - 封面图（GCS URL 或占位图）
  - 项目标题（如 "共生劫：白骨夫人的生死局"）
  - 项目类型标签
  - 最后编辑时间
- 空状态提示："空无一人的土地"

### 2.3 画布页 `/zh-cn/canvas`（连续剧集模式）
三栏布局：
- **左侧聊天面板**：可折叠，含 AI 对话输入框（"输入消息..."），用于与 AI 协作创作
- **中间画布区域**：React Flow 画布
  - 节点类型：`checkpoint-node`（基础信息）、`planningcenter-node`（规划中心）
  - 节点间有连线（3 条 edge）
  - 背景网格 + Controls 控件（缩放/平移）
- **右侧面板**：点击节点后展开详情

#### checkpoint-node（基础信息）面板
- 基础设定：语言（中文）、评级（PG）、视觉风格（可切换，100+ 种）
- 剧集设定：任务模式（连续剧集）、剧集数量、单集时长、画面比例（9:16）

#### planningcenter-node（规划中心）面板
- 概览 Tab
- 封面 Tab：AI 生成的封面图 + 编辑/重做/参考/魔法按钮
- 剧集列表 Tab：01/02/03/04 集缩略图
- 剧集摘要：每集的核心剧情描述
- "查看详情" 按钮 → 进入单集详情

### 2.4 单集详情页（剧本视图）
- 顶部 "返回" 按钮 + 项目标题 + "第 01 集"
- 左侧聊天面板
- 中间内容区：
  - "一切从这里开始" 入口节点
  - "剧本撰写" 节点：展示完整分场剧本
    - 场景 01/02/03/04，每场含：场景标题、画面描述、对白、VO 旁白
  - "下一步" 按钮推进流程

### 2.5 画布页（单集视频模式）
- 节点类型不同：`checkpoint-node` + `characterpack-node`（角色集）
- characterpack-node 展示：
  - 角色卡片：名字、职业、角色等级（主角/配角）、性别、年龄、身高
  - 配音选择：每个角色可切换声音
  - 角色详情可编辑

### 2.6 订阅/积分页
- 积分显示 + STARTER 等级标签
- 任务中心入口（"分享邀请链接，赚取积分!"）
- 每日任务、成就、邀请 Tab

---

## 3. 后端接口设计

### 3.1 接口总览

所有接口前缀：`/backend-api/api/v1/`

#### 用户模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/user/get_user_info` | GET | 获取用户信息 |
| `/user/credits/summary` | GET | 积分汇总 |
| `/user/get_points_config` | GET | 积分配置规则 |

#### 订阅模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/subscription/current` | GET | 当前订阅状态 |
| `/subscription/tiers` | GET | 所有订阅档位 |
| `/payment/benefits-packs` | GET | 积分包列表 |

#### 任务模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/task/list` | GET | 任务列表（每日/成就/邀请） |
| `/task/daily-check` | POST | 每日签到 `{}` |

#### 项目模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/project/list` | GET | 项目列表 |
| `/project/chat_list` | GET | 项目聊天记录 `?project_id=&series_id=` |
| `/project/resume` | POST | 恢复/进入项目 |

#### 画布/查询模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/query/main_canvas` | POST | 画布核心数据（节点+状态） |
| `/query/visual_style_list` | GET | 视觉风格列表（100+种） |
| `/query/voices` | GET | 配音角色列表 |

#### 展示模块
| 接口 | 方法 | 说明 |
|------|------|------|
| `/showcase/items` | GET | 首页展示作品 |
| `/share/create` | POST | 创建分享链接 |

### 3.2 关键接口详情

#### POST `/query/main_canvas`
请求：
```json
{
  "req_id": "req_1772122910574_tnbq18mva",
  "event": "query_project_state",
  "project_id": "bfd3f19f-8bd8-403b-8408-e016367d5c9b",
  "series_id": "a875a8a4-e879-4e37-80ff-e3ebedb744f0",
  "type": "multi_episodes"
}
```
响应：
```json
[{
  "series_id": "a875a8a4-e879-4e37-80ff-e3ebedb744f0",
  "state": "check_point",
  "data": {
    "mode": "standard",
    "idea_text": "（用户输入的创意文本）",
    ...
  }
}]
```

#### POST `/project/resume`
请求：
```json
{
  "req_id": "req_...",
  "event": "resume_project",
  "project_id": "...",
  "series_id": "...",
  "uid": "FLP6Yg0BKZhO5fdy9WrzgaQKA8F2",
  "language": "en-US",
  "extra": { "type": "multi_episodes" }
}
```

#### GET `/project/list`
响应：
```json
{
  "code": 200,
  "message": "请求成功",
  "data": [{
    "project_id": "fed419a4-...",
    "project_type": "single_episode",
    "step_status": null,
    "series_title": "众声喧哗",
    "drama_cover": null,
    "updated_at": 1772119665205,
    "episode_count": 0,
    "series_id": "555f4f26-...",
    "type": "single_episode"
  }]
}
```

#### GET `/query/visual_style_list`
响应（数组，100+ 项）：
```json
[{
  "id": 1,
  "title": "Immersive Raw Realism",
  "type": "Realistic/Live",
  "description": "Wide-angle natural lighting with continuous dynamic movement...",
  "img_url": "https://storage.googleapis.com/dramaland-public/visual_style_images/1.jpg"
}]
```

#### GET `/query/voices`
响应：
```json
{
  "voice_list": [{
    "id": "alFofuDn3cOwyoz1i44T",
    "name": "Marcus",
    "description": "narrator. Deep warm baritone...",
    "audioUrl": "https://storage.googleapis.com/dramaland-public/character_voice_previews/xxx.mp3",
    "age": ["Adult", "Middle-Aged"],
    "language": "en-US",
    "gender": "Male"
  }]
}
```

---

## 4. 数据模型设计（推断）

### 实体关系图

```
User (Firebase UID)
 ├── Subscription (tier, status, renewDate)
 ├── Credits (balance, batches[])
 ├── Tasks (daily/achievement/invite)
 └── Project[]
      ├── project_id (UUID)
      ├── project_type: "single_episode" | "multi_episodes" | "script_based" | "music_mv"
      ├── series_title
      ├── drama_cover (GCS URL)
      ├── updated_at (timestamp_ms)
      └── Series
           ├── series_id (UUID)
           ├── state: "check_point" | "planning_center" | "script" | "scene_design" | "segment_design" | "compose"
           ├── CheckPoint (基础信息)
           │    ├── language, rating, visual_style_id
           │    ├── mode: "standard"
           │    ├── idea_text (用户创意输入)
           │    ├── episode_count, episode_duration
           │    └── camera_frame_ratio: "9:16" | "16:9" | "1:1"
           ├── StoryBible (故事设定)
           │    ├── title, genre, sub_genre, tone, keywords
           │    ├── logline, synopsis
           │    └── world_building
           ├── CharacterPack (角色集)
           │    └── Character[]
           │         ├── name, occupation, level: "major"|"supporting"|"minor"|"extra"
           │         ├── gender, age, height
           │         ├── brief_bio, appearance, voice_profile
           │         ├── image_url (AI 生成)
           │         └── voice_id → Voice
           ├── PlanningCenter (规划中心)
           │    ├── cover_image (AI 生成)
           │    ├── core_narrative
           │    └── Episode[]
           │         ├── episode_id (UUID)
           │         ├── title, summary
           │         └── Script
           │              └── Scene[]
           │                   ├── scene_number, header, description
           │                   ├── dialogue[], vo_narration
           │                   └── Segment[]
           │                        ├── segment_id
           │                        ├── visual_description
           │                        ├── shot_type, camera_movement
           │                        ├── video_url (AI 生成)
           │                        └── status: "pending"|"generating"|"completed"|"failed"
           ├── Music
           │    ├── music_url / audio_url
           │    ├── title, tags[], duration
           │    ├── vocal: boolean
           │    └── lyrics
           └── ChatHistory[]
                ├── role: "user" | "assistant"
                └── content
```

### 全局配置实体
```
VisualStyle
 ├── id (int)
 ├── title, type: "Realistic/Live" | "Cartoon/Anime"
 ├── description
 └── img_url

Voice
 ├── id (string, Firestore doc ID)
 ├── name, description
 ├── audioUrl (预览音频)
 ├── age[], language, gender
 └── (推测底层对接 ElevenLabs 或类似 TTS 服务)
```

---

## 5. 工作流设计

### 5.1 整体创作流程

```
用户输入创意 idea_text
    ↓
选择项目类型 (single_episode / multi_episodes / script_based / music_mv)
    ↓
[CheckPoint] 基础信息配置
  → 语言、评级、视觉风格、画面比例
  → POST /query/main_canvas (event: query_project_state)
    ↓
[StoryBible] AI 生成故事设定（多选一）
  → 剧情大纲、世界观、角色概要
    ↓
[CharacterPack] AI 生成角色集
  → 角色形象图 + 配音选择
  → GET /query/voices
    ↓
[PlanningCenter] AI 生成规划中心（仅 multi_episodes）
  → 封面图、剧集列表、每集摘要
  → 用户可编辑调整
    ↓
[Script] AI 生成分场剧本
  → 场景描述、对白、旁白
  → 用户可编辑
    ↓
[SceneDesign] 场景设计
  → AI 生成每个场景的视觉参考
    ↓
[SegmentDesign] 片段设计
  → 逐镜头分镜：shot_type, camera_movement, visual_description
  → AI 生成视频片段
    ↓
[Music] 音乐生成/上传
  → 支持 AI 生成（疑似对接 Udio）或用户上传
  → 支持改编 remix
    ↓
[Compose] 合成
  → 视频片段 + 音乐 + 字幕 → 最终视频
  → 视频导出走 Cloud Run 服务
```

### 5.2 画布节点流转

画布上的节点对应 `Series.state`，是一个有向无环图（DAG）：

**连续剧集模式：**
```
entry → checkpoint → storyBible → characterPack → planningCenter → [per episode] script → sceneDesign → segmentDesign → music → compose
```

**单集视频模式：**
```
entry → checkpoint → characterPack → script → sceneDesign → segmentDesign → compose
```

**音乐 MV 模式：**
```
entry → musicCheckPoint → musicPack → treatmentMusic → visualSetting → segmentDesign → compose
```

### 5.3 AI 生成机制

1. **触发**：用户点击"生成"/"下一步"按钮 → POST 请求到后端
2. **请求格式**：统一带 `req_id`（前端生成的唯一 ID）+ `event`（事件类型）+ `project_id` + `series_id`
3. **进度推送**：SSE (Server-Sent Events) 实时推送生成进度
4. **轮询**：前端通过 `query_project_state` 轮询当前状态
5. **积分扣除**：每次 AI 生成消耗积分，不同操作消耗不同（如角色图生成、视频片段生成）
6. **重试机制**：失败后支持"重试"和"智能重试"（自动优化 prompt）

### 5.4 聊天协作机制

- 每个项目有独立的聊天上下文（`/project/chat_list`）
- 用户可通过聊天面板与 AI 对话，引导创作方向
- AI 回复可能触发画布节点状态变更
- 聊天面板可折叠，不影响画布操作

---

---

## 6. 核心资产数据

### 6.1 视觉风格库（107 种）

按类型分布：

| 类型 | 数量 | 代表风格 |
|------|------|----------|
| Realistic/Live | 52 | Immersive Raw Realism, Hong Kong Neo-Noir, Epic Oriental Wuxia, Romantic Comedy |
| 2D Animation | 24 | Sharp Futuristic Anime, Nostalgic Watercolor Anime, Korean Webtoon, Pastel Shoujo Anime |
| Illustration | 18 | Classic American Comic, Vintage Oil Painting, Chinese Gongbi Art, Pixel Art Animation |
| 3D Render | 7 | Vibrant Soft 3D, Epic High-Fantasy CG, 3D Cartoon, Claymation, Wool Fiber Texture |
| Experimental | 6 | K-Pop Avant-Garde, Digital Glitch, J-pop Bubblegum, 90s Ethereal Zen |

每种风格包含：
- `id` (int): 唯一标识
- `title` (string): 英文名称
- `type` (string): 大类
- `description` (string): 视觉描述（用于 AI prompt 注入）
- `img_url` (string): 预览图 GCS URL

风格描述直接作为视频生成的 visual style prompt 注入，如：
> "Alejandro G. Iñárritu Style: raw natural lighting, gritty realism, high contrast textures, and visceral cinematic intensity"

### 6.2 配音库（151 个角色音色）

| 语言 | 数量 | 性别分布 |
|------|------|----------|
| en-US | 96 | Male 55, Female 41 |
| zh-CN | 55 | Male 30, Female 25 |

每个音色包含：
- `id` (string): 唯一标识（如 `alFofuDn3cOwyoz1i44T` 或 `zh_female_meilinvyou_saturn_bigtts`）
- `name` (string): 角色名
- `description` (string): 声音特征描述
- `audioUrl` (string): 预览音频 GCS URL
- `age` (string[]): 年龄段标签（Young / Young Adult / Adult / Middle-Aged / Old）
- `language` (string): 语言
- `gender` (string): 性别

英文音色 ID 格式为随机字符串（疑似 ElevenLabs ID），中文音色 ID 格式为 `zh_[gender]_[name]_[engine]_bigtts` 或 `ICL_zh_[gender]_[name]_tob`（疑似火山引擎/字节 TTS）。

角色音色设计覆盖了完整的影视角色谱系：
- 英文：旁白型、反派型、甜美型、老年型、儿童型、各种口音（英式、南方、土耳其等）
- 中文：霸道总裁、温柔御姐、病娇少女、古风侠客、幽默大叔、慈祥奶奶等

### 6.3 积分消耗体系

| 操作 | 积分消耗 |
|------|----------|
| 聊天（每次） | 1 |
| 剧情大纲生成 | 20 |
| 角色形象+配音生成 | 50 |
| 规划中心生成 | 15 |
| 剧本生成 | 10 |
| 场景设计生成 | 50 |
| 分镜设计生成 | 60 |
| 视频片段生成（默认 dlim2v） | 300 |
| 音乐生成 | 50 |
| 合成导出 | 5 |
| AI 图片编辑 | 50 |
| AI 文本编辑 | 20 |
| 确认音乐检查点 | 100 |
| 确认音乐包 | 50 |
| 确认角色包 | 50 |
| AI 图片编辑（参考图） | 50 |
| 确认视觉参考 | 50 |

视频生成模型及消耗：

| 模型 | MV 模式 | 普通模式 | 标记 |
|------|---------|----------|------|
| dlai2v | 200 | 400 | - |
| dlim2v（默认） | 200 | 300 | - |
| seedance-1-5 | 300 | 600 | - |
| longcat-avatar | 300 | 600 | - |
| dli2v3 | 200 | 400 | - |
| kling-o3-ref2v | 700 | 1500 | NEW |
| kling-o3-pro-ref2v | 900 | 2400 | NEW |

模型命名推断：
- `dlai2v` / `dlim2v` / `dli2v3`：Drama.Land 自研或封装的视频模型（dl = DramaLand）
- `seedance-1-5`：字节跳动 Seedance 1.5
- `longcat-avatar`：未知，可能是角色驱动视频模型
- `kling-o3-*`：快手可灵 Kling O3 系列

### 6.4 订阅体系

| 档位 | 月价 | 年价 | 月积分 | 最大分辨率 | 最大时长 | Pro模型 | 商用授权 |
|------|------|------|--------|-----------|---------|---------|---------|
| Starter（免费） | $0 | $0 | 0 | 720p | 60s | ❌ | ❌ |
| Basic | $19.9 | $219.9 | 10,000 | 1080p | 60s | ❌ | ❌ |
| Plus | $29.9 | $319.9 | 20,000 | 1080p | 120s | ✅ | ✅ |
| Pro | $59.9 | $649.9 | 40,000 | 1080p | 300s | ✅ | ✅ |
| Ultra | $129.9 | $1,399.9 | 100,000 | 2K | 600s | ✅ | ✅ |

当前促销：Beta 特惠 50% 折扣 + 购买双倍积分（截止 2026-03-19）

### 6.5 部署架构

从 HTTP 响应头推断：
```
Server: nginx/1.24.0 (Ubuntu)          ← 反向代理
x-fah-adapter: nextjs-14.0.21          ← Firebase App Hosting
x-fah-middleware: true                  ← FAH 中间件层
x-powered-by: Next.js                  ← Next.js SSR
via: 1.1 google                        ← Google Cloud CDN
x-cloud-trace-context: ...             ← Google Cloud Trace
Cdn-Cache-Status: miss                 ← CDN 缓存层
Alt-Svc: h3=":443"                     ← HTTP/3 支持
cache-tag: 105668650537:drama-land-studio-backends  ← Firebase 项目标识
```

结论：**Firebase App Hosting (FaaS)** 部署，不是单机服务器。
- 前端：Firebase App Hosting 托管 Next.js 14 SSR
- 后端 API：Google Cloud Run（Serverless 容器）
- 存储：Google Cloud Storage
- 视频导出：独立 Cloud Run 服务（`dramaland-video-export-765296137507.us-central1.run.app`）
- CDN：Google Cloud CDN
- 认证：Firebase Auth
- 中国区：`cn.drama.land` 通过 nginx 反代到同一 Firebase 后端

---

## 7. 竞品对比分析

### 四家平台横向对比

| 维度 | Drama.Land | ToonFlow | Huobao Drama | Moyin Creator |
|------|-----------|----------|-------------|---------------|
| **定位** | SaaS 创作平台 | 桌面端短剧工厂 | 全栈短剧生产平台 | 桌面端分镜工具 |
| **形态** | Web App | Electron 桌面端 | Web App (B/S) | Electron 桌面端 |
| **前端** | Next.js 14 + React Flow | Vue 3 + Electron | Vue 3 + Vite | React 18 + Electron |
| **后端** | Cloud Run (推测 Python/Node) | Node.js (Express/Koa) | Go (Gin + DDD) | 无（纯本地） |
| **数据库** | Firestore (推测) | SQLite (本地) | SQLite / MySQL / PostgreSQL | 本地文件系统 |
| **部署** | Firebase App Hosting (FaaS) | 本地安装 | Docker / 单机 | 本地安装 |
| **开源** | ❌ 闭源 | ✅ AGPL-3.0 | ✅ CC BY-NC-SA 4.0 | ✅ AGPL-3.0 |
| **AI 模型** | 自研封装 + Kling + Seedance | 可配置多供应商 | 可配置多供应商 | 可配置多供应商 |
| **核心优势** | 画布式交互、AI 协作聊天、完整商业化 | 小说→剧本自动化、角色一致性 | DDD 架构清晰、Docker 部署 | Seedance 2.0 多模态、批量化 |
| **核心短板** | 闭源、依赖 GCP | 仅桌面端、无协作 | 前端较简陋 | 仅桌面端、无后端 |

### 各家独特优势提炼

#### Drama.Land 🏆
1. **画布式创作交互**：React Flow 节点流程图，可视化创作进度
2. **AI 聊天协作**：每个项目有独立 AI 对话上下文，引导式创作
3. **完整商业化体系**：积分 + 订阅 + 任务系统 + 邀请裂变
4. **丰富的预置资产**：107 种视觉风格 + 151 种配音角色
5. **多模式支持**：单集/连续剧/剧本/音乐MV 四种创作模式
6. **Story Bible + Codex**：专业级故事圣经和项目法典系统

#### ToonFlow 🏆
1. **小说→剧本自动化**：直接导入小说文本，AI 拆解为结构化剧本
2. **角色一致性系统**：跨分镜角色外观一致性保障
3. **前后端分离架构**：Web 端 + 独立后端，可扩展为 SaaS

#### Huobao Drama 🏆
1. **DDD 领域驱动设计**：Go 后端架构清晰，易于维护扩展
2. **Docker 一键部署**：生产级部署方案
3. **FFmpeg 集成**：本地视频合成，不依赖云服务
4. **多数据库支持**：SQLite / MySQL / PostgreSQL 灵活切换

#### Moyin Creator 🏆
1. **Seedance 2.0 深度集成**：多模态引用（@Image/@Video/@Audio）
2. **6 层身份锚点**：角色圣经系统，确保角色一致性
3. **批量化生产**：一键全流程，多任务并行队列
4. **专业分镜系统**：电影级摄影参数（景别、机位、运动方式）

---

## 8. DreamX 创作平台设计方案

### 8.1 定位

融合 Drama.Land + Huobao + Moyin 三家优势 + 已有 DreamX 智能剪辑能力，打造：

> **DreamX Studio — AI 驱动的全链路短剧/短视频创作平台**

目标用户：短剧创作者、小红书/抖音内容创作者、AI 影视爱好者

### 8.2 五种创作模式

完整复刻 Drama.Land 四种模式 + 新增主打模式：

| 模式 | 说明 | 对标 |
|------|------|------|
| **单集视频** (single_episode) | 单集短视频创作，适合抖音/快手 | Drama.Land |
| **连续剧集** (multi_episodes) | 多集连续剧，DAG 工作流 | Drama.Land |
| **剧本模式** (script_based) | 导入已有剧本，跳过 AI 编剧 | Drama.Land |
| **音乐 MV** (music_mv) | 音乐驱动的视觉创作 | Drama.Land |
| **📌 小红书图文转视频** (redbook_note) | 图文笔记→爆款文案→营销视频（主打） | DreamX 独有 |

### 8.3 核心差异化

1. **五模式全覆盖**：Drama.Land 四种 + 小红书图文转视频（主打差异点）
2. **画布式 + 时间线双视图**：
   - 画布视图（学 Drama.Land）：节点流程图，适合剧本创作阶段
   - 时间线视图（学 Moyin）：分镜排列，适合视频制作阶段
3. **Python 后端 + FaaS 部署**：快速迭代，Serverless 弹性伸缩，成本可控
4. **已有 Java 服务通过 API 桥接**：DreamX 剪映工程生成等已有能力不重写，通过 HTTP API 调用，后续可迁移
5. **角色一致性系统**：学 Moyin 的 6 层身份锚点，跨分镜角色外观一致

### 8.4 技术架构

```
DreamX Studio
├── 前端 (Web App)
│   ├── Next.js 14 App Router（学 Drama.Land）
│   ├── React Flow（画布式创作，节点流程图）
│   ├── Zustand + Immer（状态管理）
│   ├── Tailwind CSS + Radix UI（UI 层）
│   └── next-intl（国际化 zh-cn / en）
│
├── 后端 (Python)  ← 快速实现 + FaaS 友好
│   ├── 框架：FastAPI（async, 自带 OpenAPI, SSE 原生支持）
│   ├── 分层架构
│   │   ├── API 层 (FastAPI Routers)
│   │   ├── Service 层 (Business Logic)
│   │   ├── Domain 层 (Pydantic Models)
│   │   └── Infrastructure 层 (DB, AI, Storage)
│   ├── AI 编排引擎
│   │   ├── 多供应商调度（Kling/Seedance/可灵/Sora/自研）
│   │   ├── Celery + Redis 任务队列（批量生图/生视频，并行+重试）
│   │   └── SSE 进度推送（学 Drama.Land 的实时反馈）
│   ├── 存储层
│   │   ├── PostgreSQL（主库，Supabase 可选）
│   │   ├── Redis（缓存 + 任务队列 broker）
│   │   └── COS/S3（对象存储）
│   └── 扩展接口
│       └── DreamX Java API Bridge（剪映工程生成、TTS、素材库等已有能力）
│           ├── HTTP 调用已有 Java 服务
│           └── 接口抽象层（后续迁移到 Python 时只改实现，不改接口）
│
├── 已有 Java 服务 (DreamX Legacy)  ← 通过 API 暴露，不重写
│   ├── 剪映工程文件生成 (duo-video-jy)
│   ├── TTS 配音 + 情绪分析
│   ├── 小红书爆款文案引擎
│   ├── 素材库（表情包/BGM）
│   └── COS 上传
│
├── AI 核心能力
│   ├── 剧本解析引擎（LLM 驱动，结构化输出）
│   ├── 角色一致性系统（6 层身份锚点，学 Moyin）
│   ├── 视觉风格库（预置 100+ 种，含 prompt 模板）
│   ├── 配音库（火山引擎 TTS / ElevenLabs）
│   ├── 视频生成（多模型：Kling/Seedance/可灵）
│   └── 音乐生成（对接 Udio/Suno 等）
│
└── 部署 (FaaS / Serverless)
    ├── 前端：Vercel / Cloudflare Pages
    ├── 后端 API：
    │   ├── 方案 A：阿里云函数计算 FC（国内首选）
    │   ├── 方案 B：AWS Lambda + API Gateway
    │   └── 方案 C：Google Cloud Run（学 Drama.Land）
    ├── 任务队列：Celery Worker 独立部署（可弹性伸缩）
    ├── Java 服务：Docker 容器（独立部署，API 暴露）
    └── 数据库：Supabase / RDS
```

### 8.5 创作流程设计

#### 模式 1-2：单集视频 / 连续剧集（复刻 Drama.Land）
```
输入创意 idea_text
    ↓
[CheckPoint] 基础配置（语言、风格、比例、集数）
    ↓
[StoryBible] AI 生成故事圣经（多选一）
    ↓
[CharacterPack] AI 生成角色集（形象图+配音+性格）
    ↓  ← 角色一致性锚点系统（6层）
[PlanningCenter] 规划中心（封面+剧集大纲）  ← 仅连续剧集
    ↓
[Script] AI 生成分场剧本（可编辑）
    ↓
[SceneDesign] 场景设计（AI 生成视觉参考）
    ↓
[SegmentDesign] 分镜设计（逐镜头：shot_type, camera_movement）
    ↓  ← 批量生图/生视频，Celery 并行队列
[Compose] 合成导出（FFmpeg + 剪映工程）
```

#### 模式 3：剧本模式（导入已有剧本）
```
导入剧本文本/文件
    ↓
[CheckPoint] 基础配置
    ↓
AI 自动解析剧本结构（场景、角色、对白）
    ↓
[CharacterPack] → [SceneDesign] → [SegmentDesign] → [Compose]
```

#### 模式 4：音乐 MV
```
上传/生成音乐
    ↓
[MusicCheckPoint] 音乐配置
    ↓
[MusicPack] 音乐分析（节拍、情绪、歌词）
    ↓
[TreatmentMusic] 视觉处理方案
    ↓
[VisualSetting] 视觉风格设定
    ↓
[SegmentDesign] → [Compose]
```

#### 模式 5：小红书图文转视频（主打，DreamX 独有）
```
上传图片 + 事件描述（或直接粘贴小红书笔记链接）
    ↓
AI 生成小红书爆款文案（6-10句，情绪递进）
    ↓  ← 调用已有 Java 服务
TTS 配音 + 情绪分析 + 素材召回（表情包/BGM）
    ↓  ← 调用已有 Java 服务
自动分镜（图片分配 + 字幕时间轴）
    ↓
视频合成（剪映工程 / MP4 直出）
    ↓  ← 调用已有 Java 服务
COS 上传 → 返回下载链接 / 一键发布
```

### 8.6 Java 服务桥接设计（可迁移架构）

```python
# Python 侧：抽象接口层
class VideoProjectService(ABC):
    """视频工程服务抽象"""
    @abstractmethod
    async def build_jianying_project(self, project: VideoProject) -> str: ...
    @abstractmethod
    async def upload_to_cos(self, file_path: str) -> str: ...

# 当前实现：调用 Java API
class JavaBridgeVideoProjectService(VideoProjectService):
    """通过 HTTP 调用已有 Java 服务"""
    def __init__(self, java_base_url: str):
        self.base_url = java_base_url  # e.g. http://localhost:8080

    async def build_jianying_project(self, project: VideoProject) -> str:
        async with httpx.AsyncClient() as client:
            resp = await client.post(f"{self.base_url}/api/video/build", json=project.dict())
            return resp.json()["download_url"]

# 未来迁移：Python 原生实现（只改这个类，上层不动）
class NativeVideoProjectService(VideoProjectService):
    """Python 原生实现（迁移后替换）"""
    async def build_jianying_project(self, project: VideoProject) -> str:
        # 直接用 Python 生成剪映工程文件
        ...
```

关键原则：
- 所有 Java 服务调用都经过抽象接口
- 迁移时只需实现新的 Service 类，注入替换即可
- 不改上层业务逻辑

### 8.7 MVP 优先级

| 优先级 | 模块 | 说明 | 工作量 |
|--------|------|------|--------|
| P0 | 小红书图文转视频模式 | 已有 Java 能力，Python 封装 + Web UI | 2 周 |
| P0 | 用户系统 + 项目管理 | FastAPI + PostgreSQL + Firebase Auth | 1 周 |
| P0 | Java API Bridge | 已有 DreamX 服务 HTTP 封装 | 3 天 |
| P1 | 画布式创作 UI | Next.js + React Flow，复刻 Drama.Land 交互 | 3 周 |
| P1 | 单集视频模式 | 完整创作流程 | 2 周 |
| P1 | AI 编排引擎 | Celery 任务队列 + SSE 推送 + 多模型调度 | 2 周 |
| P2 | 连续剧集模式 | 在单集基础上扩展 PlanningCenter | 1.5 周 |
| P2 | 角色一致性系统 | 6 层锚点 + 角色圣经 | 2 周 |
| P2 | 视觉风格库 + 配音库 | 预置数据 + 管理界面 | 1 周 |
| P2 | 积分/订阅体系 | 学 Drama.Land 定价模型 | 1 周 |
| P3 | 剧本模式 | 剧本导入 + AI 解析 | 1.5 周 |
| P3 | 音乐 MV 模式 | 音乐分析 + 视觉处理 | 2 周 |
| P3 | 视频合成导出 | FFmpeg 云端合成 + 剪映工程 | 2 周 |

MVP（P0）预估：约 3.5 周可上线小红书图文转视频 + 基础框架。
P0+P1 约 10 周，五种模式中先跑通两种（小红书 + 单集视频）。

### 8.8 技术选型理由

| 选择 | 理由 |
|------|------|
| FastAPI (Python) | async 原生、SSE 支持好、FaaS 部署友好、AI/ML 生态最强、开发速度快 |
| Next.js 14 | Drama.Land 验证过的方案、RSC 性能好、Vercel 一键部署 |
| React Flow | 画布式交互的事实标准，Drama.Land 用的就是这个 |
| Celery + Redis | Python 生态最成熟的分布式任务队列，批量视频生成必备 |
| PostgreSQL | 结构化数据首选，Supabase 提供免费托管 |
| 抽象接口层 | Java 服务不重写但留好迁移口，符合开闭原则 |

---

## 附录：截图索引

| 文件 | 内容 |
|------|------|
| drama_11_landing.png | 首页（未登录） |
| drama_04_projects.png | 项目列表页 |
| drama_05_canvas.png | 画布页（连续剧集） |
| drama_08_checkpoint_clicked.png | 基础信息面板 |
| drama_06_node_3_planningcenter-node.png | 规划中心面板 |
| drama_10_episode_detail.png | 单集剧本详情 |
| drama_13_single_episode.png | 画布页（单集视频） |
| drama_14_subscription.png | 订阅/积分页 |
| drama_15_task_center.png | 任务中心 |
