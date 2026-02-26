# DreamX Studio — 数据模型设计

## 实体关系总览

```
User 1──N Project 1──N Episode 1──N Scene 1──N Shot
  │                      │              │         │
  │                      │              │         ├── FramePrompt
  │                      │              │         ├── ImageGeneration
  │                      │              │         └── VideoGeneration
  │                      │              │
  │                      ├── Character ──── CharacterBible
  │                      │                    └── CharacterStageAppearance
  │                      │
  │                      ├── VideoMerge
  │                      └── AsyncTask
  │
  ├── CreditTransaction
  ├── Subscription
  └── Asset

全局实体（不属于用户）：
  VisualStyle, Voice, PromptTemplate, AIServiceConfig
```

---

## 1. User（用户）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 自增主键 |
| uid | varchar(64) UNIQUE | 外部认证 UID（Firebase/自建） |
| email | varchar(255) | 邮箱 |
| nickname | varchar(100) | 昵称 |
| avatar_url | varchar(500) | 头像 |
| credits | int DEFAULT 0 | 当前积分余额 |
| subscription_tier | varchar(20) DEFAULT 'free' | 订阅等级：free/starter/pro/enterprise |
| subscription_expires_at | timestamp | 订阅过期时间 |
| locale | varchar(10) DEFAULT 'zh-cn' | 语言偏好 |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

索引：`uid` UNIQUE, `email` UNIQUE

---

## 2. Project（项目）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | 自增主键 |
| user_id | bigint FK→User | 所属用户 |
| title | varchar(200) | 项目标题 |
| description | text | 项目描述 |
| mode | varchar(30) | 创作模式：single_episode / multi_episodes / script_based / music_mv / redbook_note |
| visual_style_id | bigint FK→VisualStyle NULL | 视觉风格 |
| language | varchar(10) DEFAULT 'zh-cn' | 语言 |
| aspect_ratio | varchar(10) DEFAULT '9:16' | 画面比例 |
| rating | varchar(10) DEFAULT 'PG' | 内容评级 |
| cover_url | varchar(500) | 封面图 |
| status | varchar(20) DEFAULT 'draft' | draft / generating / completed |
| canvas_data | jsonb | React Flow 画布节点/连线序列化数据 |
| created_at | timestamp | |
| updated_at | timestamp | |

索引：`user_id`, `status`, `mode`
关联：User 1:N Project, VisualStyle 1:N Project

---

## 3. Episode（剧集）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| project_id | bigint FK→Project | 所属项目 |
| episode_number | int | 集数序号 |
| title | varchar(200) | 集标题 |
| synopsis | text | 剧情摘要 |
| script_content | text | 完整分场剧本（Markdown） |
| duration_seconds | int | 目标时长（秒） |
| status | varchar(20) DEFAULT 'draft' | draft / scripted / generating / completed |
| created_at | timestamp | |
| updated_at | timestamp | |

索引：`project_id`, `(project_id, episode_number)` UNIQUE
关联：Project 1:N Episode

---

## 4. Scene（场景）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| episode_id | bigint FK→Episode | 所属剧集 |
| scene_number | int | 场景序号 |
| title | varchar(200) | 场景标题 |
| location | varchar(200) | 场景地点 |
| time_of_day | varchar(50) | 时间：日/夜/黄昏等 |
| description | text | 场景描述 |
| dialogue | text | 对白内容 |
| voiceover | text | 旁白/VO |
| emotion | varchar(50) | 情绪标签：平静/紧张/悲伤/愤怒等 |
| emotion_intensity | float | 情绪强度 0.0-1.0 |
| bgm_suggestion | varchar(200) | BGM 建议 |
| transition | varchar(50) | 转场效果：cut/fade/dissolve/wipe |
| duration_seconds | float | 场景时长 |
| sort_order | int | 排序 |
| created_at | timestamp | |
| updated_at | timestamp | |

索引：`episode_id`, `(episode_id, scene_number)` UNIQUE
关联：Episode 1:N Scene

---

## 5. Shot（分镜/镜头）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| scene_id | bigint FK→Scene | 所属场景 |
| shot_number | int | 镜头序号 |
| shot_type | varchar(30) | 景别：ECU/CU/MCU/MS/MLS/LS/ELS/OS |
| camera_angle | varchar(30) | 角度：eye_level/low/high/bird/dutch/worm |
| camera_movement | varchar(30) | 运镜：static/pan/tilt/dolly/zoom/crane/handheld/tracking |
| description | text | 镜头描述 |
| action | text | 动作描述 |
| dialogue | text | 该镜头对白 |
| motion_prompt | text | Motion Prompt（三层结构：主体动作+镜头运动+环境动态） |
| image_prompt | text | 图像生成 Prompt |
| video_prompt | text | 视频生成 Prompt |
| duration_seconds | float | 镜头时长 |
| character_ids | jsonb | 出场角色 ID 列表 |
| image_url | varchar(500) | 生成的图像 URL |
| video_url | varchar(500) | 生成的视频 URL |
| status | varchar(20) DEFAULT 'pending' | pending/image_generating/image_done/video_generating/completed/error |
| sort_order | int | 排序 |
| created_at | timestamp | |
| updated_at | timestamp | |

索引：`scene_id`, `status`
关联：Scene 1:N Shot

---

## 6. Character（角色）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| project_id | bigint FK→Project | 所属项目 |
| name | varchar(100) | 角色名 |
| role_type | varchar(20) | 角色类型：protagonist/supporting/extra |
| gender | varchar(10) | 性别 |
| age | varchar(20) | 年龄/年龄段 |
| description | text | 角色描述 |
| personality | text | 性格特征 |
| voice_id | bigint FK→Voice NULL | 配音 |
| reference_image_url | varchar(500) | 参考图 |
| seed_value | bigint | 一致性种子值 |
| created_at | timestamp | |
| updated_at | timestamp | |

索引：`project_id`
关联：Project 1:N Character

---

## 7. CharacterBible（角色一致性配置）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| character_id | bigint FK→Character UNIQUE | 1:1 关联角色 |
| visual_traits | jsonb | 视觉特征：{hair, eyes, skin, build, height, ...} |
| style_tokens | jsonb | 风格标记：["anime", "realistic", ...] |
| color_palette | jsonb | 色板：{primary, secondary, accent, ...} |
| facial_features | text | 面部特征描述（跨场景锁定） |
| body_type | text | 体型描述 |
| unique_marks | text | 独特标记（疤痕、纹身等） |
| clothing_default | text | 默认服装描述 |
| reference_images | jsonb | 参考图 URL 列表 |
| three_view_images | jsonb | 三视图 URL：{front, side, back} |
| consistency_prompt | text | 自动生成的一致性 Prompt |
| created_at | timestamp | |
| updated_at | timestamp | |

关联：Character 1:1 CharacterBible

---

## 8. CharacterStageAppearance（角色多阶段形象）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| character_id | bigint FK→Character | 所属角色 |
| stage_name | varchar(100) | 阶段名称（如"少年期"、"变身后"） |
| trigger_scene_id | bigint FK→Scene NULL | 触发场景 |
| appearance_override | jsonb | 覆盖的外观属性 |
| clothing | text | 该阶段服装 |
| reference_image_url | varchar(500) | 该阶段参考图 |
| sort_order | int | 排序 |
| created_at | timestamp | |

关联：Character 1:N CharacterStageAppearance

---

## 9. VisualStyle（视觉风格）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| name | varchar(100) | 风格名称 |
| name_en | varchar(100) | 英文名 |
| category | varchar(50) | 分类：anime/realistic/3d/watercolor/comic/... |
| preview_image_url | varchar(500) | 预览图 |
| prompt_prefix | text | 注入到 Prompt 前缀的风格描述 |
| negative_prompt | text | 负面 Prompt |
| is_builtin | boolean DEFAULT true | 是否内置 |
| sort_order | int | 排序 |

---

## 10. Voice（配音）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| name | varchar(100) | 声音名称 |
| gender | varchar(10) | 性别 |
| language | varchar(10) | 语言 |
| provider | varchar(30) | 供应商：volcengine/elevenlabs |
| provider_voice_id | varchar(100) | 供应商侧 voice ID |
| preview_audio_url | varchar(500) | 试听音频 |
| tags | jsonb | 标签：["温柔", "磁性", "少年"] |
| is_builtin | boolean DEFAULT true | |

---

## 11. FramePrompt（帧 Prompt）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| shot_id | bigint FK→Shot | 所属镜头 |
| frame_type | varchar(20) | 帧类型：first/key/last/panel/action |
| prompt | text | 完整 Prompt |
| negative_prompt | text | 负面 Prompt |
| image_url | varchar(500) | 生成结果 |
| status | varchar(20) DEFAULT 'pending' | |
| created_at | timestamp | |

关联：Shot 1:N FramePrompt

---

## 12. ImageGeneration（图像生成任务）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| project_id | bigint FK→Project | |
| shot_id | bigint FK→Shot NULL | 关联镜头 |
| prompt | text | 生成 Prompt |
| negative_prompt | text | |
| provider | varchar(30) | dalle/sd/flux/midjourney |
| model | varchar(50) | 具体模型名 |
| width | int | 宽 |
| height | int | 高 |
| result_url | varchar(500) | 结果图 URL |
| status | varchar(20) | pending/processing/completed/failed |
| error_message | text | 错误信息 |
| credits_cost | int | 消耗积分 |
| created_at | timestamp | |
| completed_at | timestamp | |

---

## 13. VideoGeneration（视频生成任务）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| project_id | bigint FK→Project | |
| shot_id | bigint FK→Shot NULL | 关联镜头 |
| prompt | text | 视频 Prompt |
| reference_image_url | varchar(500) | 首帧参考图 |
| provider | varchar(30) | kling/seedance/runway/sora/veo |
| model | varchar(50) | 具体模型名 |
| duration_seconds | float | 目标时长 |
| result_url | varchar(500) | 结果视频 URL |
| status | varchar(20) | pending/processing/completed/failed |
| error_message | text | |
| credits_cost | int | |
| created_at | timestamp | |
| completed_at | timestamp | |

---

## 14. VideoMerge（视频合并任务）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| project_id | bigint FK→Project | |
| episode_id | bigint FK→Episode NULL | |
| input_video_ids | jsonb | 输入视频 ID 列表 |
| transitions | jsonb | 转场配置 [{type, duration_ms}] |
| audio_track_url | varchar(500) | 背景音轨 |
| subtitle_data | jsonb | 字幕数据 |
| result_url | varchar(500) | 合并结果 |
| status | varchar(20) | pending/processing/completed/failed |
| created_at | timestamp | |
| completed_at | timestamp | |

---

## 15. AsyncTask（异步任务通用模型）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar(36) PK | UUID |
| project_id | bigint FK→Project | |
| user_id | bigint FK→User | |
| task_type | varchar(50) | script_gen/character_extract/shot_gen/image_gen/video_gen/video_merge/tts/redbook_convert |
| payload | jsonb | 任务参数 |
| result | jsonb | 任务结果 |
| status | varchar(20) | pending/running/completed/failed/cancelled |
| progress | int DEFAULT 0 | 进度 0-100 |
| error_message | text | |
| retry_count | int DEFAULT 0 | |
| max_retries | int DEFAULT 3 | |
| priority | int DEFAULT 0 | 优先级（越大越高） |
| created_at | timestamp | |
| started_at | timestamp | |
| completed_at | timestamp | |

索引：`user_id`, `project_id`, `status`, `task_type`

---

## 16. AIServiceConfig（AI 服务供应商配置）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| name | varchar(50) | 配置名称 |
| service_type | varchar(20) | text/image/video/tts/embedding |
| provider | varchar(30) | openai/anthropic/google/volcengine/kling/... |
| model | varchar(50) | 模型名 |
| base_url | varchar(300) | API 地址 |
| api_key | varchar(200) | 加密存储 |
| is_default | boolean | 是否为该 service_type 的默认 |
| config | jsonb | 额外配置（temperature, max_tokens 等） |
| enabled | boolean DEFAULT true | |

---

## 17. PromptTemplate（Prompt 模板）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| name | varchar(100) | 模板名 |
| category | varchar(30) | scene_image/scene_video/character/negative/screenplay |
| template | text | Mustache 模板内容，支持 {{variable}} |
| variables | jsonb | 变量定义列表 |
| is_builtin | boolean DEFAULT true | |
| user_id | bigint FK→User NULL | 用户自定义模板 |
| version | int DEFAULT 1 | 版本号 |

---

## 18. Asset（用户素材）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| user_id | bigint FK→User | |
| project_id | bigint FK→Project NULL | 关联项目（NULL=全局素材） |
| type | varchar(20) | image/video/audio/document |
| filename | varchar(200) | 原始文件名 |
| url | varchar(500) | 存储 URL |
| size_bytes | bigint | 文件大小 |
| mime_type | varchar(50) | |
| metadata | jsonb | 额外元数据（宽高、时长等） |
| created_at | timestamp | |

---

## 19. Subscription（订阅计划）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| tier | varchar(20) UNIQUE | free/starter/pro/enterprise |
| name | varchar(50) | 显示名 |
| price_monthly | decimal(10,2) | 月价 |
| price_yearly | decimal(10,2) | 年价 |
| credits_monthly | int | 每月赠送积分 |
| features | jsonb | 功能列表 |
| max_projects | int | 最大项目数 |
| max_episodes_per_project | int | 每项目最大集数 |
| priority_queue | boolean | 是否优先队列 |

---

## 20. CreditTransaction（积分流水）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint PK | |
| user_id | bigint FK→User | |
| amount | int | 变动数量（正=充值/赠送，负=消费） |
| balance_after | int | 变动后余额 |
| type | varchar(30) | purchase/subscription_grant/daily_task/invite/image_gen/video_gen/tts/export |
| reference_id | varchar(100) | 关联业务 ID |
| description | varchar(200) | 描述 |
| created_at | timestamp | |

索引：`user_id`, `type`, `created_at`
