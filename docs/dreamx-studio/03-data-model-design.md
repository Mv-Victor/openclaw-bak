# DreamX Studio — 数据模型设计文档

> 版本：v1.0 | 日期：2026-02-26 | 作者：啾啾

---

## 1. 实体关系总览

```
User 1──N Project 1──N Episode 1──N Scene 1──N Shot
  │                      │              │         │
  │                      │              │         ├── FramePrompt
  │                      │              │         ├── ImageGeneration
  │                      │              │         └── VideoGeneration
  │                      │              │
  │                      │              └── Character ──── CharacterBible
  │                      │                                 └── CharacterStageAppearance
  │                      │
  │                      ├── PlanningCenter
  │                      ├── StoryBible
  │                      ├── VideoMerge
  │                      └── AsyncTask
  │
  ├── CreditTransaction
  ├── Subscription
  └── ChatMessage

全局配置实体（不属于用户）：
  VisualStyle, Voice, PromptTemplate, AIServiceConfig, BGM, Meme
```

---

## 2. 核心实体设计

### 2.1 User（用户）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | 自增主键 |
| uid | varchar(64) | UNIQUE, NOT NULL | 外部认证 UID（Firebase/自建） |
| email | varchar(255) | UNIQUE, NOT NULL | 邮箱 |
| nickname | varchar(100) | NOT NULL | 昵称 |
| avatar_url | varchar(500) | | 头像 URL |
| credits | int | DEFAULT 0, NOT NULL | 当前积分余额 |
| subscription_tier | varchar(20) | DEFAULT 'free' | 订阅等级：free/starter/basic/pro/ultra |
| subscription_status | varchar(20) | DEFAULT 'inactive' | 订阅状态：inactive/active/cancelled/expired |
| subscription_expires_at | timestamp | | 订阅过期时间 |
| locale | varchar(10) | DEFAULT 'zh-cn' | 语言偏好 |
| timezone | varchar(50) | DEFAULT 'Asia/Shanghai' | 时区 |
| created_at | timestamp | DEFAULT NOW() | 创建时间 |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | 更新时间 |

索引：
- `uid` UNIQUE
- `email` UNIQUE
- `subscription_tier` + `subscription_status`

---

### 2.2 Project（项目）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | 自增主键 |
| user_id | bigint | FK→User, NOT NULL | 所属用户 |
| title | varchar(200) | NOT NULL | 项目标题 |
| description | text | | 项目描述 |
| mode | varchar(30) | NOT NULL | 创作模式 |
| idea_text | text | | 用户初始创意输入 |
| visual_style_id | bigint | FK→VisualStyle, NULL | 视觉风格 |
| language | varchar(10) | DEFAULT 'zh-cn' | 语言 |
| aspect_ratio | varchar(10) | DEFAULT '9:16' | 画面比例：9:16/16:9/1:1 |
| rating | varchar(10) | DEFAULT 'PG' | 内容评级：G/PG/PG-13/R |
| cover_url | varchar(500) | | 封面图 URL |
| status | varchar(20) | DEFAULT 'draft' | 状态：draft/generating/completed/archived |
| canvas_data | jsonb | | React Flow 画布序列化数据 |
| current_series_id | bigint | FK→Series, NULL | 当前系列 ID |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

索引：
- `user_id`
- `status`
- `mode`
- `created_at` DESC

创作模式枚举：
- `single_episode` — 单集视频
- `multi_episodes` — 连续剧集
- `script_based` — 剧本模式
- `music_mv` — 音乐 MV
- `redbook_note` — 小红书图文转视频

---

### 2.3 Series（系列/创作会话）

一个项目可能有多个 Series（例如连续剧集模式下，用户可能重新生成规划中心，产生新的 Series）。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | 自增主键 |
| project_id | bigint | FK→Project, NOT NULL | 所属项目 |
| state | varchar(30) | NOT NULL | 当前画布节点状态 |
| mode | varchar(30) | NOT NULL | 创作模式（冗余，便于查询） |
| idea_text | text | | 创意文本（冗余） |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

状态枚举（对应画布节点）：
- `entry` — 入口
- `check_point` — 基础配置
- `story_bible` — 故事圣经
- `character_pack` — 角色集
- `planning_center` — 规划中心
- `script` — 剧本
- `scene_design` — 场景设计
- `segment_design` — 分镜设计
- `music` — 音乐
- `compose` — 合成

---

### 2.4 CheckPoint（基础配置）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| series_id | bigint | FK→Series, UNIQUE, NOT NULL | 1:1 关联 Series |
| language | varchar(10) | NOT NULL | 语言 |
| rating | varchar(10) | DEFAULT 'PG' | 内容评级 |
| visual_style_id | bigint | FK→VisualStyle | 视觉风格 |
| aspect_ratio | varchar(10) | DEFAULT '9:16' | 画面比例 |
| episode_count | int | DEFAULT 4 | 集数（连续剧集模式） |
| episode_duration | int | DEFAULT 60 | 单集时长（秒） |
| mode | varchar(30) | NOT NULL | 模式：standard/custom |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

---

### 2.5 StoryBible（故事圣经）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| series_id | bigint | FK→Series, UNIQUE, NOT NULL | 1:1 关联 Series |
| title | varchar(200) | NOT NULL | 故事标题 |
| genre | varchar(50) | | 类型：职场/爱情/悬疑/喜剧... |
| sub_genre | varchar(50) | | 子类型 |
| tone | varchar(50) | | 基调：轻松/严肃/黑暗... |
| keywords | jsonb | | 关键词标签列表 |
| logline | text | | 一句话梗概（50 字内） |
| synopsis | text | | 剧情摘要（500 字内） |
| world_building | text | | 世界观设定 |
| theme | text | | 主题思想 |
| target_audience | varchar(100) | | 目标受众 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

---

### 2.6 Character（角色）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| series_id | bigint | FK→Series, NOT NULL | 所属系列 |
| name | varchar(100) | NOT NULL | 角色名 |
| role_type | varchar(20) | NOT NULL | 角色类型：protagonist/supporting/minor/extra |
| gender | varchar(10) | | 性别 |
| age | varchar(20) | | 年龄/年龄段 |
| occupation | varchar(100) | | 职业 |
| description | text | | 角色描述 |
| personality | text | | 性格特征 |
| brief_bio | text | | 简短背景故事 |
| appearance | text | | 外貌描述 |
| voice_id | varchar(100) | FK→Voice | 配音 ID |
| image_url | varchar(500) | | AI 生成的角色形象图 |
| seed_value | bigint | | 一致性种子值 |
| sort_order | int | DEFAULT 0 | 排序 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

索引：
- `series_id`
- `role_type`

---

### 2.7 CharacterBible（角色一致性配置）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| character_id | bigint | FK→Character, UNIQUE, NOT NULL | 1:1 关联角色 |
| visual_traits | jsonb | | 视觉特征：{hair, eyes, skin, build, height} |
| style_tokens | jsonb | | 风格标记：["realistic", "anime"] |
| color_palette | jsonb | | 色板：{primary, secondary, accent} |
| facial_features | text | | 面部特征描述（跨场景锁定） |
| body_type | text | | 体型描述 |
| unique_marks | text | | 独特标记（疤痕、纹身等） |
| clothing_default | text | | 默认服装描述 |
| reference_images | jsonb | | 参考图 URL 列表 |
| three_view_images | jsonb | | 三视图：{front, side, back} |
| consistency_prompt | text | | 自动生成的一致性 Prompt |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

---

### 2.8 PlanningCenter（规划中心）

仅用于 `multi_episodes` 模式。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| series_id | bigint | FK→Series, UNIQUE, NOT NULL | 1:1 关联 Series |
| cover_image_url | varchar(500) | | AI 生成的封面图 |
| core_narrative | text | | 核心叙事 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

---

### 2.9 Episode（剧集）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| planning_center_id | bigint | FK→PlanningCenter, NOT NULL | 所属规划中心 |
| episode_number | int | NOT NULL | 集数序号（从 1 开始） |
| title | varchar(200) | NOT NULL | 集标题 |
| summary | text | | 集摘要 |
| cover_image_url | varchar(500) | | 集封面图 |
| status | varchar(20) | DEFAULT 'draft' | draft/scripted/generating/completed |
| sort_order | int | DEFAULT 0 | 排序 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

索引：
- `planning_center_id`
- `(planning_center_id, episode_number)` UNIQUE

---

### 2.10 Script（剧本）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| episode_id | bigint | FK→Episode, UNIQUE, NOT NULL | 1:1 关联 Episode |
| content_markdown | text | | 完整剧本文本（Markdown 格式） |
| word_count | int | | 字数统计 |
| estimated_duration | int | | 预估时长（秒） |
| status | varchar(20) | DEFAULT 'draft' | draft/reviewed/locked |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

---

### 2.11 Scene（场景）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| script_id | bigint | FK→Script, NOT NULL | 所属剧本 |
| scene_number | int | NOT NULL | 场景序号（从 1 开始） |
| title | varchar(200) | | 场景标题 |
| location | varchar(200) | | 场景地点 |
| time_of_day | varchar(50) | | 时间：日/夜/黄昏/黎明 |
| description | text | | 场景描述（画面） |
| dialogue | text | | 对白内容 |
| voiceover | text | | 旁白/VO |
| emotion | varchar(50) | | 情绪标签 |
| emotion_intensity | float | DEFAULT 0.5 | 情绪强度 0.0-1.0 |
| bgm_suggestion | varchar(200) | | BGM 建议 |
| transition | varchar(50) | DEFAULT 'cut' | 转场效果 |
| duration_seconds | float | | 场景时长 |
| sort_order | int | DEFAULT 0 | 排序 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

索引：
- `script_id`
- `(script_id, scene_number)` UNIQUE

---

### 2.12 Shot（分镜/镜头）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| scene_id | bigint | FK→Scene, NOT NULL | 所属场景 |
| shot_number | int | NOT NULL | 镜头序号 |
| shot_type | varchar(30) | | 景别 |
| camera_angle | varchar(30) | | 角度 |
| camera_movement | varchar(30) | | 运镜 |
| description | text | | 镜头描述 |
| action | text | | 动作描述 |
| dialogue | text | | 该镜头对白 |
| motion_prompt | text | | Motion Prompt |
| image_prompt | text | | 图像生成 Prompt |
| video_prompt | text | | 视频生成 Prompt |
| duration_seconds | float | | 镜头时长 |
| character_ids | jsonb | | 出场角色 ID 列表 |
| image_url | varchar(500) | | 生成的图像 URL |
| video_url | varchar(500) | | 生成的视频 URL |
| status | varchar(20) | DEFAULT 'pending' | 生成状态 |
| sort_order | int | DEFAULT 0 | 排序 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

索引：
- `scene_id`
- `status`
- `(scene_id, shot_number)` UNIQUE

景别枚举：
- `ECU` — Extreme Close-Up（特写）
- `CU` — Close-Up（近景）
- `MCU` — Medium Close-Up（中近景）
- `MS` — Medium Shot（中景）
- `MLS` — Medium Long Shot（中全景）
- `LS` — Long Shot（全景）
- `ELS` — Extreme Long Shot（大远景）

角度枚举：
- `eye_level` — 平视
- `low` — 仰视
- `high` — 俯视
- `bird` — 鸟瞰
- `dutch` — 倾斜
- `worm` — 虫视

运镜枚举：
- `static` — 固定
- `pan` — 摇
- `tilt` — 俯仰
- `dolly` — 推拉
- `zoom` — 变焦
- `crane` — 升降
- `handheld` — 手持
- `tracking` — 跟踪

---

### 2.13 GenerationTask（生成任务）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| user_id | bigint | FK→User, NOT NULL | 所属用户 |
| project_id | bigint | FK→Project | 关联项目 |
| type | varchar(50) | NOT NULL | 任务类型 |
| status | varchar(20) | DEFAULT 'queued' | 任务状态 |
| progress | int | DEFAULT 0 | 进度 0-100 |
| message | varchar(500) | | 状态消息 |
| req_params | jsonb | | 请求参数 |
| result | jsonb | | 生成结果 |
| error_code | int | | 错误码 |
| error_message | varchar(500) | | 错误消息 |
| retry_count | int | DEFAULT 0 | 重试次数 |
| max_retries | int | DEFAULT 3 | 最大重试次数 |
| cost_credits | int | | 消耗积分 |
| started_at | timestamp | | 开始时间 |
| completed_at | timestamp | | 完成时间 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

索引：
- `user_id`
- `status`
- `type`
- `created_at` DESC

任务类型枚举：
- `story_bible_generation` — 故事圣经生成
- `character_generation` — 角色生成
- `planning_center_generation` — 规划中心生成
- `script_generation` — 剧本生成
- `scene_design_generation` — 场景设计生成
- `segment_design_generation` — 分镜设计生成
- `image_generation` — 图像生成
- `video_generation` — 视频生成
- `music_generation` — 音乐生成
- `export_capcut` — 剪映工程导出
- `export_mp4` — MP4 导出

任务状态枚举：
- `queued` — 排队中
- `processing` — 处理中
- `completed` — 完成
- `failed` — 失败
- `cancelled` — 取消

---

### 2.14 CreditTransaction（积分交易）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| user_id | bigint | FK→User, NOT NULL | 所属用户 |
| type | varchar(20) | NOT NULL | 交易类型 |
| amount | int | NOT NULL | 金额（正=收入，负=支出） |
| balance_after | int | NOT NULL | 交易后余额 |
| description | varchar(500) | NOT NULL | 描述 |
| related_resource_type | varchar(50) | | 关联资源类型 |
| related_resource_id | bigint | | 关联资源 ID |
| metadata | jsonb | | 额外元数据 |
| created_at | timestamp | DEFAULT NOW() | |

索引：
- `user_id`
- `type`
- `created_at` DESC

交易类型枚举：
- `purchase` — 购买
- `reward` — 奖励
- `consume` — 消费
- `refund` — 退款
- `adjustment` — 调整

---

### 2.15 ChatMessage（聊天消息）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| project_id | bigint | FK→Project, NOT NULL | 所属项目 |
| series_id | bigint | FK→Series | 所属系列 |
| role | varchar(20) | NOT NULL | 角色：user/assistant/system |
| content | text | NOT NULL | 消息内容 |
| trigger_node | varchar(50) | | 触发的画布节点 |
| actions | jsonb | | 可执行操作列表 |
| parent_id | bigint | FK→ChatMessage | 父消息（回复） |
| created_at | timestamp | DEFAULT NOW() | |

索引：
- `project_id`
- `series_id`
- `created_at`

---

## 3. 全局配置实体

### 3.1 VisualStyle（视觉风格）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| title | varchar(200) | NOT NULL | 风格名称 |
| type | varchar(50) | NOT NULL | 类型 |
| description | text | | 风格描述（用于 AI prompt 注入） |
| img_url | varchar(500) | | 预览图 URL |
| prompt_template | text | | Prompt 模板 |
| is_active | boolean | DEFAULT true | 是否启用 |
| sort_order | int | DEFAULT 0 | 排序 |
| created_at | timestamp | DEFAULT NOW() | |

类型枚举：
- `Realistic/Live` — 写实/真人
- `2D Animation` — 2D 动画
- `Illustration` — 插画
- `3D Render` — 3D 渲染
- `Experimental` — 实验风格

---

### 3.2 Voice（配音）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | varchar(100) | PK | 配音 ID（第三方服务 ID） |
| name | varchar(100) | NOT NULL | 配音名称 |
| description | text | | 声音特征描述 |
| audio_url | varchar(500) | | 预览音频 URL |
| age | jsonb | | 年龄段标签列表 |
| language | varchar(10) | NOT NULL | 语言 |
| gender | varchar(10) | NOT NULL | 性别 |
| provider | varchar(50) | | 供应商：elevenlabs/volcengine/edge |
| is_active | boolean | DEFAULT true | 是否启用 |
| sort_order | int | DEFAULT 0 | 排序 |

---

### 3.3 BGM（背景音乐）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| title | varchar(200) | NOT NULL | 曲名 |
| artist | varchar(100) | | 艺术家 |
| mood | varchar(50) | | 情绪标签 |
| genre | varchar(50) | | 风格 |
| duration_seconds | int | | 时长 |
| audio_url | varchar(500) | NOT NULL | 音频 URL |
| waveform_data | jsonb | | 波形数据（用于高潮片段定位） |
| climax_ranges | jsonb | | 高潮片段：[{start, end}] |
| tags | jsonb | | 标签列表 |
| is_active | boolean | DEFAULT true | 是否启用 |
| created_at | timestamp | DEFAULT NOW() | |

---

### 3.4 Meme（表情包）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| title | varchar(200) | NOT NULL | 表情包名称 |
| meme_desc | text | | 梗描述 |
| image_url | varchar(500) | NOT NULL | 图片 URL |
| width | int | | 宽度 |
| height | int | | 高度 |
| tags | jsonb | | 标签列表 |
| character | varchar(100) | | 关联角色 |
| is_active | boolean | DEFAULT true | 是否启用 |
| usage_count | int | DEFAULT 0 | 使用次数 |
| created_at | timestamp | DEFAULT NOW() | |

---

## 4. 小红书专属实体

### 4.1 RedbookScript（小红书脚本）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| user_id | bigint | FK→User, NOT NULL | 所属用户 |
| event_description | text | NOT NULL | 事件描述 |
| lines | jsonb | NOT NULL | 字幕行列表 |
| meme_insertions | jsonb | | 表情包插入点 |
| bgm_id | bigint | FK→BGM | 背景音乐 |
| voice_id | varchar(100) | FK→Voice | 配音 |
| total_duration_ms | int | | 总时长 |
| status | varchar(20) | DEFAULT 'draft' | 状态 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

---

### 4.2 RedbookProject（小红书项目）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | bigint | PK, AI | |
| user_id | bigint | FK→User, NOT NULL | 所属用户 |
| script_id | bigint | FK→RedbookScript | 关联脚本 |
| image_assets | jsonb | NOT NULL | 图片资产 ID 列表 |
| watermark_text | varchar(100) | | 水印文字 |
| export_url | varchar(500) | | 导出链接 |
| status | varchar(20) | DEFAULT 'draft' | 状态 |
| created_at | timestamp | DEFAULT NOW() | |
| updated_at | timestamp | DEFAULT NOW() ON UPDATE | |

---

## 5. 数据库 Schema 设计（PostgreSQL）

### 5.1 基础设置

```sql
-- 启用扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 模糊搜索

-- 创建 schema
CREATE SCHEMA IF NOT EXISTS dreamx;

-- 设置搜索路径
SET search_path TO dreamx, public;
```

### 5.2 核心表创建示例

```sql
-- User 表
CREATE TABLE dreamx.users (
    id BIGSERIAL PRIMARY KEY,
    uid VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    credits INT DEFAULT 0 NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'free',
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    subscription_expires_at TIMESTAMP,
    locale VARCHAR(10) DEFAULT 'zh-cn',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 自动更新 updated_at
CREATE OR REPLACE FUNCTION dreamx.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_updated_at
    BEFORE UPDATE ON dreamx.users
    FOR EACH ROW
    EXECUTE FUNCTION dreamx.update_updated_at_column();

-- Project 表
CREATE TABLE dreamx.projects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES dreamx.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    mode VARCHAR(30) NOT NULL,
    idea_text TEXT,
    visual_style_id BIGINT REFERENCES dreamx.visual_styles(id),
    language VARCHAR(10) DEFAULT 'zh-cn',
    aspect_ratio VARCHAR(10) DEFAULT '9:16',
    rating VARCHAR(10) DEFAULT 'PG',
    cover_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft',
    canvas_data JSONB,
    current_series_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON dreamx.projects(user_id);
CREATE INDEX idx_projects_status ON dreamx.projects(status);
CREATE INDEX idx_projects_mode ON dreamx.projects(mode);
CREATE INDEX idx_projects_created_at ON dreamx.projects(created_at DESC);

-- Series 表
CREATE TABLE dreamx.series (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES dreamx.projects(id) ON DELETE CASCADE,
    state VARCHAR(30) NOT NULL,
    mode VARCHAR(30) NOT NULL,
    idea_text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shot 表（示例复杂 JSONB 使用）
CREATE TABLE dreamx.shots (
    id BIGSERIAL PRIMARY KEY,
    scene_id BIGINT NOT NULL REFERENCES dreamx.scenes(id) ON DELETE CASCADE,
    shot_number INT NOT NULL,
    shot_type VARCHAR(30),
    camera_angle VARCHAR(30),
    camera_movement VARCHAR(30),
    description TEXT,
    action TEXT,
    dialogue TEXT,
    motion_prompt TEXT,
    image_prompt TEXT,
    video_prompt TEXT,
    duration_seconds FLOAT,
    character_ids JSONB DEFAULT '[]',
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shots_scene_id ON dreamx.shots(scene_id);
CREATE INDEX idx_shots_status ON dreamx.shots(status);
CREATE UNIQUE INDEX idx_shots_scene_shot ON dreamx.shots(scene_id, shot_number);
```

---

## 6. 数据迁移策略

### 6.1 版本控制

使用 Flyway 或 Alembic 管理数据库迁移：

```
migrations/
├── V1__initial_schema.sql
├── V2__add_redbook_tables.sql
├── V3__add_character_bible.sql
└── ...
```

### 6.2 种子数据

预置数据（视觉风格、配音、BGM、表情包）通过种子脚本导入：

```python
# scripts/seed_data.py
visual_styles = [
    {"id": 1, "title": "Immersive Raw Realism", "type": "Realistic/Live", ...},
    # ... 107 种风格
]

voices = [
    {"id": "zh_female_xiaoxiao", "name": "晓晓", ...},
    # ... 151 个配音
]
```

---

## 7. 性能优化

### 7.1 索引策略

- 所有外键字段建立索引
- 查询频繁的字段建立组合索引
- 时间字段使用 DESC 索引支持最新优先排序
- JSONB 字段使用 GIN 索引支持灵活查询

### 7.2 分区策略

大表（ChatMessage、GenerationTask、CreditTransaction）按月分区：

```sql
CREATE TABLE dreamx.chat_messages (
    ...
) PARTITION BY RANGE (created_at);

CREATE TABLE dreamx.chat_messages_y2026m02 
    PARTITION OF dreamx.chat_messages
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### 7.3 缓存策略

- VisualStyle、Voice 等配置表使用 Redis 缓存
- 用户积分余额使用 Redis 缓存，异步持久化
- 热门项目详情使用 Redis 缓存（TTL 5 分钟）
