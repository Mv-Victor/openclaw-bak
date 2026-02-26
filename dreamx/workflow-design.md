# DreamX Studio — 工作流设计

## 1. 画布节点类型与流转

### 节点类型

| 节点 | 说明 | 输入 | 输出 |
|------|------|------|------|
| CheckPoint | 基础设定 | 用户配置 | language, aspect_ratio, rating, visual_style |
| StoryBible | 故事圣经 | 用户输入/AI生成 | 世界观、主题、核心冲突、故事大纲 |
| CharacterPack | 角色集 | AI提取/手动创建 | Character + CharacterBible 列表 |
| PlanningCenter | 规划中心 | StoryBible + CharacterPack | 剧集规划、封面、摘要 |
| Script | 剧本撰写 | PlanningCenter/用户导入 | 分场剧本（Scene 列表） |
| SceneDesign | 场景设计 | Script + CharacterPack | 每场景的视觉描述、情绪、BGM |
| SegmentDesign | 分镜设计 | SceneDesign | Shot 列表（含镜头语法、Prompt） |
| Compose | 合成导出 | 所有生成资产 | 最终视频 |

### 节点状态机

```
pending → processing → completed
                  ↘ error → pending（重试）
```

### DAG 依赖关系

```
CheckPoint
    ↓
StoryBible ←→ CharacterPack（可并行，互相补充）
    ↓              ↓
PlanningCenter ←───┘
    ↓
Script
    ↓
SceneDesign
    ↓
SegmentDesign
    ↓
Compose
```

### 画布 ↔ 时间线双视图

- 画布视图：创作阶段，节点流程图，关注剧本/角色/场景的逻辑关系
- 时间线视图：制作阶段，横向时间轴，关注镜头排列/时长/转场/音轨
- 切换时机：SegmentDesign 完成后自动提示切换到时间线视图
- 数据同步：两个视图共享同一份 Shot 数据，视图层面不同展示

---

## 2. 五种创作模式 Pipeline

### 2.1 单集视频模式 (single_episode)

```
用户输入创意描述
    ↓
[CheckPoint] 基础设定（语言/比例/风格/评级）
    ↓
[StoryBible] AI 生成故事大纲
    ↓ 并行
[CharacterPack] AI 提取角色 + 生成 CharacterBible
    ↓
[Script] AI 生成分场剧本（4-8 场）
    ↓
[SceneDesign] 每场景：视觉描述 + 情绪标注 + BGM
    ↓
[SegmentDesign] 每场景拆分镜头：
    ├── 镜头语法选择（景别×角度×运镜）
    ├── Image Prompt 编译（Mustache 模板 + 角色一致性注入）
    ├── Video Prompt 编译（Motion Prompt 三层结构）
    ├── → 图像生成（并行，每镜头一张）
    └── → 视频生成（图生视频，首帧=生成图像）
    ↓
[Compose] 合成：
    ├── TTS 配音生成
    ├── 视频片段拼接（FFmpeg）
    ├── 字幕叠加
    ├── BGM 混音
    └── → 最终视频导出
```

### 2.2 连续剧集模式 (multi_episodes)

```
用户输入创意描述 + 集数 + 单集时长
    ↓
[CheckPoint] 基础设定
    ↓
[StoryBible] AI 生成完整故事线（含多集大纲）
    ↓
[CharacterPack] 角色提取 + 多阶段形象设计
    ↓
[PlanningCenter] 剧集规划：
    ├── 每集摘要
    ├── 角色出场安排
    ├── 情节线分配
    └── 封面生成
    ↓
对每一集循环执行：
    [Script] → [SceneDesign] → [SegmentDesign] → [Compose]
    ↓
全集合并 / 逐集导出
```

### 2.3 剧本模式 (script_based)

```
用户导入已有剧本/小说文本
    ↓
[CheckPoint] 基础设定
    ↓
AI Agent 解析（ToonFlow 多 Agent 架构）：
    ├── 故事师 Agent：理解故事结构
    ├── 大纲师 Agent：提取分场大纲
    └── 导演 Agent：确定视觉风格和节奏
    ↓
[CharacterPack] 自动提取角色 + 生成 CharacterBible
    ↓
[Script] 结构化分场剧本（AI 从原文提取）
    ↓
[SceneDesign] → [SegmentDesign] → [Compose]
（同单集模式后半段）
```

### 2.4 音乐 MV 模式 (music_mv)

```
用户上传音频文件 + 视觉描述
    ↓
[CheckPoint] 基础设定
    ↓
音频分析：
    ├── 节拍检测（BPM、节拍点）
    ├── 段落识别（前奏/主歌/副歌/间奏/尾奏）
    ├── 情绪曲线提取
    └── 歌词识别（如有）
    ↓
[StoryBible] AI 生成视觉叙事线（匹配音乐情绪）
    ↓
[SceneDesign] 按音乐段落分配场景：
    ├── 副歌 → 高能视觉
    ├── 主歌 → 叙事画面
    └── 间奏 → 转场/空镜
    ↓
[SegmentDesign] 镜头与节拍对齐
    ↓
[Compose] 视频 + 音频同步合成
```

### 2.5 小红书图文转视频模式 (redbook_note)

```
用户输入：图片列表 + 事件描述（或小红书笔记链接）
    ↓
笔记解析（如果是链接）：
    ├── 提取图片列表
    ├── 提取原始文案
    └── 提取标签
    ↓
AI 爆款文案生成：
    ├── 分析图片内容（Vision API）
    ├── 结合事件描述
    ├── 生成 6-10 句情绪递进文案
    └── 每句标注情绪标签
    ↓
TTS 配音：
    ├── 选择声音（从 Voice 库）
    ├── 逐句生成语音
    └── 获取每句时长
    ↓
自动分镜：
    ├── 图片分配到文案句（智能匹配）
    ├── 每张图 Ken Burns 效果（缩放/平移方向）
    ├── 字幕时间轴对齐
    └── 转场效果分配
    ↓
视频合成：
    ├── 图片动效渲染
    ├── 语音轨叠加
    ├── 字幕烧录
    ├── BGM 混音（自动降低人声段音量）
    └── → MP4 导出（9:16 竖屏）
```

---

## 3. AI 生成编排

### 3.1 Asynq 任务队列设计

| 任务类型 | 优先级 | 超时 | 最大重试 | 说明 |
|---------|--------|------|---------|------|
| task:script:generate | 5 | 120s | 2 | 剧本生成 |
| task:character:extract | 5 | 60s | 2 | 角色提取 |
| task:character:bible | 4 | 60s | 2 | CharacterBible 生成 |
| task:shot:generate | 5 | 90s | 2 | 分镜生成 |
| task:prompt:compile | 6 | 30s | 3 | Prompt 编译 |
| task:image:generate | 3 | 300s | 2 | 图像生成（耗时长） |
| task:video:generate | 2 | 600s | 1 | 视频生成（最耗时，慎重重试） |
| task:tts:generate | 4 | 60s | 3 | TTS 配音 |
| task:video:merge | 3 | 300s | 2 | 视频合并 |
| task:redbook:convert | 3 | 300s | 2 | 小红书转视频 |

### 3.2 SSE 实时进度推送

```
前端 → GET /api/v1/projects/{id}/events (SSE)
后端 → Redis Pub/Sub channel: project:{id}:events

事件格式：
{
  "event": "task_progress",
  "data": {
    "task_id": "uuid",
    "task_type": "image_gen",
    "shot_id": 123,
    "status": "processing",
    "progress": 65,
    "message": "正在生成第 3/8 张图像..."
  }
}

事件类型：
- task_created: 任务创建
- task_progress: 进度更新
- task_completed: 任务完成（含 result_url）
- task_failed: 任务失败（含 error_message）
- node_status_changed: 画布节点状态变更
```

### 3.3 多供应商调度策略

```go
type ProviderSelector struct {
    Strategy string // "priority" | "round_robin" | "failover" | "cost_optimized"
}

// Failover 策略（默认）：
// 1. 尝试默认供应商
// 2. 失败 → 切换到备选供应商
// 3. 所有供应商失败 → 标记任务 failed

// 供应商健康检查：
// - 每 60s 探活
// - 连续 3 次失败 → 标记 unhealthy，暂时跳过
// - 5 分钟后自动恢复探活
```

### 3.4 并发控制

| 资源 | 并发限制 | 说明 |
|------|---------|------|
| 图像生成/用户 | 5 | 每用户最多 5 个并行图像任务 |
| 视频生成/用户 | 2 | 视频生成资源昂贵 |
| TTS/用户 | 10 | TTS 较轻量 |
| 全局图像生成 | 50 | 防止供应商限流 |
| 全局视频生成 | 20 | |

---

## 4. Agent 协作流程

### 借鉴 ToonFlow 的多 Agent 架构

```
剧本生成阶段（3 Agent 协作）：
┌─────────────────────────────────────────┐
│ 故事师 Agent (AI-1)                      │
│ - 输入：用户创意描述 + 基础设定           │
│ - 输出：故事核心（主题/冲突/世界观）       │
│ - Prompt：故事创作专家角色                │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 大纲师 Agent (AI-2)                      │
│ - 输入：故事核心 + episodeSchema          │
│ - 输出：结构化大纲 JSON                   │
│   {title, scenes[], characters[],        │
│    coreConflict, emotionalCurve,         │
│    visualHighlights}                     │
│ - 自动提取资产：角色/道具/场景            │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 导演 Agent (Director)                    │
│ - 输入：结构化大纲 + 视觉风格             │
│ - 输出：分场剧本 + 视觉指导               │
│ - 决策：节奏、情绪编排、镜头风格          │
└─────────────────────────────────────────┘

分镜生成阶段（2 Agent 流水线）：
┌─────────────────────────────────────────┐
│ 片段师 Agent (Segment)                   │
│ - 输入：单场景剧本 + 角色信息             │
│ - 输出：镜头拆分方案                      │
│   每镜头：描述 + 景别 + 角度 + 运镜       │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ 分镜师 Agent (Shot)                      │
│ - 输入：镜头方案 + CharacterBible         │
│ - 输出：完整 Prompt（Image + Video）      │
│ - 注入：角色一致性 Prompt + 风格 Prompt   │
│ - 编译：Mustache 模板渲染                 │
└─────────────────────────────────────────┘
```

### Agent 间数据传递

```json
// Agent 输出标准格式
{
  "agent": "outline_agent",
  "version": "1.0",
  "timestamp": "2026-02-27T00:00:00Z",
  "output": {
    "type": "structured_outline",
    "data": { ... }
  },
  "metadata": {
    "model": "claude-opus-4-6",
    "tokens_used": 3500,
    "duration_ms": 8200
  }
}
```

### Agent 执行通过 Asynq 调度

- 每个 Agent 调用是一个 Asynq 任务
- Agent 间依赖通过任务链（task chain）实现
- 中间结果存入 Redis（TTL 1h）+ PostgreSQL（持久化）
- 前端通过 SSE 实时看到每个 Agent 的执行状态

---

## 5. Prompt 编译流程

### Mustache 模板引擎

```
模板示例（scene_image）：
"{{style_prefix}}, {{scene_description}}, {{character_consistency}}, 
{{shot_type}} shot, {{camera_angle}} angle, {{lighting}}, 
{{color_palette}}, {{negative_prompt}}"

编译过程：
1. 加载模板（PromptTemplate 表）
2. 收集变量：
   - style_prefix ← VisualStyle.prompt_prefix
   - scene_description ← Scene.description
   - character_consistency ← CharacterBible.consistency_prompt
   - shot_type ← Shot.shot_type
   - camera_angle ← Shot.camera_angle
   - lighting ← 从 Scene.time_of_day 推断
   - color_palette ← CharacterBible.color_palette
   - negative_prompt ← VisualStyle.negative_prompt
3. Mustache 渲染
4. 后处理：去重、截断、token 计数
```

### Motion Prompt 三层结构

```
Layer 1 - 主体动作：角色的肢体动作和表情
Layer 2 - 镜头运动：camera movement 指令
Layer 3 - 环境动态：风、雨、光影变化等

组合示例：
"[主体] 女子缓缓转身，泪水滑落脸颊 
 [镜头] 缓慢推进至面部特写，轻微手持晃动 
 [环境] 窗外雨滴沿玻璃滑落，室内光线昏暗闪烁"
```
