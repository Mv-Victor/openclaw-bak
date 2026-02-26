# DreamX Studio — AI 短剧创作平台 MVP

## 1. 项目概述

DreamX Studio 是一个融合四家短剧平台优点的 AI 短剧创作平台，目标是为短剧创作者和 AI 内容创作者提供从剧本到成片的全链路创作工具。

**一句话定位**：画布式工作流 × 镜头语法库 × 角色一致性 × AI Agent 分镜 × 小红书图文转视频，五合一的 AI 短剧创作平台。

## 2. 核心差异化

| # | 差异化能力 | 来源 | DreamX 改进 |
|---|-----------|------|------------|
| 1 | 画布式工作流 | drama.land（React Flow 节点流程图） | 增加时间线双视图切换，画布用于剧本创作阶段，时间线用于视频制作阶段 |
| 2 | 镜头语法库 | huobao-drama（Storyboard 模型中的 ShotType/Angle/Movement） | 将镜头语法从数据库字段升级为可视化选择器，支持景别×运镜×角度的组合预览 |
| 3 | 角色一致性系统 | moyin-creator（CharacterBible 6层身份锚点 + 多阶段形象） | 融合 moyin 的 visualTraits/styleTokens/colorPalette 和 huobao 的 ReferenceImages/SeedValue，实现跨场景角色外观锁定 |
| 4 | AI Agent 分镜拆解 | ToonFlow（多 Agent 协作：故事师→大纲师→导演→片段师→分镜师） | 复用 ToonFlow 的 Agent 编排模式，但改为服务端执行（非桌面端），支持 SSE 实时进度推送 |
| 5 | 小红书图文转视频 | DreamX 独有 | 图文笔记→AI 爆款文案→TTS 配音→自动分镜→视频合成，一键完成 |
| 6 | Prompt Compiler | moyin-creator（Mustache 模板引擎） | 复用模板化 prompt 编译机制，支持用户自定义模板，提升生成质量可控性 |
| 7 | S级多镜头合并叙事 | moyin-creator（Seedance 2.0 格子图 + @引用系统） | 借鉴格子图拼接和 @Image/@Video/@Audio 引用协议，支持多镜头一次性生成 |

## 3. 目标用户

- **短剧创作者**：有剧本创作能力，需要 AI 辅助生成视觉内容
- **AI 内容创作者**：熟悉 AI 工具，追求高效批量生产
- **小红书/抖音博主**：需要将图文内容快速转化为短视频

## 4. 五种创作模式

| 模式 | 说明 | 对标来源 |
|------|------|---------|
| 单集视频 (single_episode) | 单集短视频，适合抖音/快手 | drama.land |
| 连续剧集 (multi_episodes) | 多集连续剧，DAG 工作流 | drama.land |
| 剧本模式 (script_based) | 导入已有剧本/小说，AI 自动拆解 | ToonFlow |
| 音乐 MV (music_mv) | 音乐驱动的视觉创作 | drama.land |
| 小红书图文转视频 (redbook_note) | 图文笔记一键转营销视频 | DreamX 独有 |

## 5. 技术栈选型

### 前端

| 技术 | 选型理由 |
|------|---------|
| Next.js 14 App Router | drama.land 已验证的方案，RSC 流式渲染性能好，Vercel 一键部署 |
| React Flow (@xyflow/react) | 画布式交互的事实标准，drama.land 用的就是这个，节点/连线/MiniMap 开箱即用 |
| Zustand + Immer | 轻量状态管理，drama.land 和 moyin-creator 都在用，不可变更新简洁 |
| Tailwind CSS + Radix UI | 原子类样式 + 无样式基础组件，快速搭建暗色主题 UI |
| next-intl | 国际化支持 zh-cn / en |
| Marked.js | 剧本 Markdown 渲染 |

### 后端

| 技术 | 选型理由 |
|------|---------|
| Go (Gin + GORM) | 直接复用 huobao-drama 的后端架构，DDD 分层清晰（handler→service→model），已有完整的 Drama/Episode/Storyboard/Character 数据模型 |
| PostgreSQL | 生产级关系数据库，huobao-drama 已支持（通过 GORM 切换 driver 即可） |
| Redis | 缓存 + 任务队列 broker + SSE 消息通道 |
| Asynq (Go) | Go 原生异步任务队列（替代 Python Celery），与 Go 后端无缝集成，支持重试/优先级/定时任务 |
| MinIO / COS | 对象存储，huobao-drama 已有 LocalStorage 抽象层，扩展 S3 兼容存储即可 |

### AI 能力层

| 能力 | 实现方案 |
|------|---------|
| 剧本生成 | LLM（OpenAI/Gemini/Claude），复用 huobao-drama 的 AIClient 接口抽象 |
| 角色设计 | LLM + 图像生成，借鉴 moyin-creator 的 CharacterDesign 多阶段形象系统 |
| 分镜拆解 | AI Agent 编排，借鉴 ToonFlow 的 segmentAgent→shotAgent 流程 |
| 图像生成 | 多供应商（DALL-E/Midjourney/SD/Flux），复用 huobao-drama 的 ImageGeneration 模型 |
| 视频生成 | 多供应商（Kling/Seedance/可灵/Runway），复用 huobao-drama 的 VideoGeneration 模型 |
| TTS 配音 | 火山引擎 TTS / ElevenLabs，借鉴 drama.land 的 Voice 库设计 |
| Prompt 编译 | Mustache 模板引擎，移植 moyin-creator 的 PromptCompiler |

### 部署

| 组件 | 方案 |
|------|------|
| 前端 | Vercel / Cloudflare Pages |
| 后端 API | Docker 容器（阿里云 ECS / AWS EC2） |
| 任务队列 | Asynq Worker 独立容器，可水平扩展 |
| 数据库 | PostgreSQL（RDS / Supabase） |
| 缓存 | Redis（ElastiCache / Upstash） |
| 存储 | MinIO 自建 / 腾讯云 COS / AWS S3 |

## 6. 各家优点融合策略

### 6.1 从 drama.land 借鉴

**画布式创作交互**
- 完整复刻 React Flow 节点流程图，节点类型包括：CheckPoint、StoryBible、CharacterPack、PlanningCenter、Script、SceneDesign、SegmentDesign、Compose
- 每个节点对应一个创作阶段，点击展开右侧详情面板
- 节点间有向连线表示流程依赖

**AI 聊天协作**
- 每个项目有独立的 AI 对话上下文（左侧可折叠聊天面板）
- 用户可通过自然语言引导 AI 调整创作方向

**商业化体系**
- 积分 + 订阅双轨制，不同操作消耗不同积分
- 每日任务 + 邀请裂变获取积分

**改进点**：
- 增加时间线视图（画布→时间线双视图切换），分镜制作阶段更直观
- 节点支持拖拽重排和自定义连线

### 6.2 从 huobao-drama 借鉴

**DDD 后端架构**
- 直接复用 Go + Gin + GORM 技术栈
- handler→service→model 三层分离
- 复用 Drama/Episode/Storyboard/Character/Scene/Prop 完整数据模型
- 复用 AIServiceConfig 多供应商配置系统
- 复用 AsyncTask 异步任务模型
- 复用 Timeline/Track/Clip 时间线模型

**镜头语法系统**
- 从 Storyboard 模型提取：ShotType（景别）、Angle（角度）、Movement（运镜）
- 从 FramePrompt 模型提取：帧类型（first/key/last/panel/action）
- 升级为可视化镜头语法选择器，预览不同组合效果

**视频合成**
- 复用 VideoMerge 模型和 FFmpeg 合成逻辑
- 支持场景片段拼接、转场效果、音轨混合

**改进点**：
- 镜头语法从纯文本字段升级为结构化选择器 + 预览
- 增加情绪曲线编排（借鉴 ToonFlow 的 emotionalCurve 字段）

### 6.3 从 moyin-creator 借鉴

**角色一致性系统（Character Bible）**
- 移植 CharacterBible 核心概念：visualTraits、styleTokens、colorPalette、referenceImages
- 移植多阶段形象系统（CharacterStageAppearance）：同一角色在不同剧情阶段的外观变化
- 移植一致性元素锁定：facialFeatures、bodyType、uniqueMarks 跨场景不变
- 移植 generateConsistencyPrompt() 函数：自动为每个场景注入角色一致性 prompt

**Prompt Compiler（模板引擎）**
- 移植 Mustache 风格的 `{{variable}}` 模板插值
- 预置模板：sceneImage、sceneVideo、negative、screenplay
- 支持用户自定义模板，运行时更新

**S级多镜头合并叙事**
- 移植格子图拼接逻辑（mergeToGridImage）
- 移植 @Image/@Video/@Audio 引用协议和配额校验（Seedance 2.0 限制）
- 移植 buildGroupPrompt() 组级 prompt 构建器
- 移植对白唇形同步指令生成

**Worker Protocol**
- 移植 Main Thread ↔ Worker 的命令/事件通信协议
- 适配为 HTTP SSE 推送（前端监听生成进度）

**改进点**：
- Character Bible 从纯前端内存存储改为后端持久化（PostgreSQL）
- Prompt 模板支持版本管理和 A/B 测试
- 格子图模式扩展支持更多视频生成供应商（不仅限 Seedance）

### 6.4 从 ToonFlow 借鉴

**AI Agent 分镜拆解**
- 移植多 Agent 协作架构：
  - OutlineScript Agent：故事师(AI1)→大纲师(AI2)→导演(director) 三角色协作
  - Storyboard Agent：片段师(segmentAgent)→分镜师(shotAgent) 两阶段流水线
- 移植结构化大纲 Schema（episodeSchema）：title、chapterRange、scenes、characters、props、coreConflict、outline、keyEvents、emotionalCurve、visualHighlights
- 移植资产自动提取（generateAssets）：从大纲中自动提取角色/道具/场景

**宫格分镜图生成**
- 移植 generateGridPrompt：根据镜头数量自动计算网格布局（2×2 / 3×3）
- 移植 imageSplitting：宫格图自动分割为单张镜头图

**改进点**：
- Agent 从桌面端 SQLite 改为服务端 PostgreSQL + Redis
- Agent 执行过程通过 SSE 实时推送到前端（而非 EventEmitter）
- 增加 Agent 执行历史记录和回放功能

### 6.5 DreamX 独有能力

**小红书图文转视频**
- 输入：图片 + 事件描述（或小红书笔记链接）
- AI 生成小红书爆款文案（6-10句，情绪递进）
- TTS 配音 + 情绪分析
- 自动分镜（图片分配 + 字幕时间轴）
- 视频合成（MP4 直出）
- 一键导出 / 发布

## 7. MVP 优先级

| 优先级 | 模块 | 工作量 |
|--------|------|--------|
| P0 | 用户系统 + 项目管理 + 基础 API | 1 周 |
| P0 | 画布式创作 UI（Next.js + React Flow） | 2 周 |
| P0 | 单集视频模式（完整创作流程） | 2 周 |
| P0 | AI 编排引擎（Asynq 任务队列 + SSE 推送） | 1.5 周 |
| P1 | 角色一致性系统 | 1.5 周 |
| P1 | 小红书图文转视频模式 | 2 周 |
| P1 | 视觉风格库 + 配音库 | 1 周 |
| P2 | 连续剧集模式 | 1.5 周 |
| P2 | 剧本模式（导入 + AI Agent 拆解） | 2 周 |
| P2 | Prompt Compiler + 模板管理 | 1 周 |
| P2 | 积分/订阅体系 | 1 周 |
| P3 | 音乐 MV 模式 | 2 周 |
| P3 | S级多镜头合并叙事 | 1.5 周 |
| P3 | 视频合成导出（FFmpeg + 时间线编辑） | 2 周 |

**MVP（P0）预估**：约 6.5 周可上线单集视频创作 + 画布工作流 + 基础框架。
