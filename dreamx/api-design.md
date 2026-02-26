# DreamX Studio — API 设计

## 通用约定

- Base URL: `/api/v1`
- 认证: `Authorization: Bearer <token>`
- 响应格式: `{ "code": 200, "message": "ok", "data": {...} }`
- 错误格式: `{ "code": 400, "message": "错误描述", "data": null }`
- 分页: `?page=1&page_size=20` → 响应含 `total`, `page`, `page_size`

---

## 1. 认证模块

### POST /api/v1/auth/register
注册新用户

请求:
```json
{
  "email": "user@example.com",
  "password": "xxx",
  "nickname": "创作者"
}
```
响应:
```json
{
  "code": 200,
  "data": {
    "token": "eyJhbG...",
    "refresh_token": "xxx",
    "user": { "id": 1, "email": "user@example.com", "nickname": "创作者", "credits": 100 }
  }
}
```

### POST /api/v1/auth/login
登录
```json
// 请求
{ "email": "user@example.com", "password": "xxx" }
// 响应同 register
```

### POST /api/v1/auth/refresh
刷新 token
```json
// 请求
{ "refresh_token": "xxx" }
// 响应
{ "code": 200, "data": { "token": "new_token", "refresh_token": "new_refresh" } }
```

---

## 2. 用户模块

### GET /api/v1/user/profile
获取当前用户信息
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "创作者",
    "avatar_url": "https://...",
    "credits": 4825,
    "subscription_tier": "pro",
    "subscription_expires_at": "2026-12-31T00:00:00Z",
    "locale": "zh-cn"
  }
}
```

### PUT /api/v1/user/profile
更新用户信息
```json
// 请求
{ "nickname": "新昵称", "avatar_url": "https://...", "locale": "en" }
```

### GET /api/v1/user/credits
积分流水
```json
{
  "code": 200,
  "data": {
    "balance": 4825,
    "transactions": [
      { "id": 1, "amount": -5, "balance_after": 4825, "type": "image_gen", "description": "图像生成 - 白骨夫人镜头3", "created_at": "..." }
    ],
    "total": 156, "page": 1, "page_size": 20
  }
}
```

---

## 3. 项目模块

### POST /api/v1/projects
创建项目
```json
// 请求
{
  "title": "白骨夫人",
  "description": "西游记科幻重构短剧",
  "mode": "single_episode",
  "language": "zh-cn",
  "aspect_ratio": "9:16",
  "visual_style_id": 5
}
// 响应
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "白骨夫人",
    "mode": "single_episode",
    "status": "draft",
    "canvas_data": null,
    "created_at": "..."
  }
}
```

### GET /api/v1/projects
项目列表
```json
// 查询参数: ?mode=single_episode&status=draft&page=1&page_size=20
{
  "code": 200,
  "data": {
    "items": [
      { "id": 1, "title": "白骨夫人", "mode": "single_episode", "cover_url": "...", "status": "draft", "updated_at": "..." }
    ],
    "total": 5, "page": 1, "page_size": 20
  }
}
```

### GET /api/v1/projects/:id
项目详情（含 canvas_data）

### PUT /api/v1/projects/:id
更新项目

### DELETE /api/v1/projects/:id
删除项目

### POST /api/v1/projects/:id/duplicate
复制项目

### PUT /api/v1/projects/:id/canvas
保存画布数据
```json
// 请求
{
  "canvas_data": {
    "nodes": [
      { "id": "checkpoint-1", "type": "checkpoint", "position": {"x": 0, "y": 0}, "data": {...} }
    ],
    "edges": [
      { "id": "e1", "source": "checkpoint-1", "target": "storybible-1" }
    ]
  }
}
```

---

## 4. 剧本模块

### POST /api/v1/projects/:id/script/generate
AI 生成剧本
```json
// 请求
{
  "prompt": "基于白骨夫人的故事，生成一个5场戏的短剧剧本",
  "episode_id": 1
}
// 响应
{
  "code": 200,
  "data": {
    "task_id": "uuid-xxx",
    "status": "processing"
  }
}
```
（异步任务，通过 SSE 或轮询获取结果）

### POST /api/v1/projects/:id/script/import
导入剧本
```json
// 请求
{ "content": "第一场：荒野...\n第二场：...", "format": "markdown" }
```

### GET /api/v1/projects/:id/episodes/:eid/script
获取剧本内容

### PUT /api/v1/projects/:id/episodes/:eid/script
更新剧本内容
```json
{ "script_content": "更新后的剧本 Markdown..." }
```

---

## 5. 角色模块

### POST /api/v1/projects/:id/characters/extract
AI 提取角色
```json
// 请求
{ "episode_id": 1 }
// 响应
{ "code": 200, "data": { "task_id": "uuid-xxx" } }
```

### GET /api/v1/projects/:id/characters
角色列表
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "白骨夫人",
      "role_type": "protagonist",
      "gender": "female",
      "age": "千年",
      "description": "觉醒的骨人...",
      "voice_id": 12,
      "reference_image_url": "https://...",
      "bible": {
        "visual_traits": { "hair": "银白长发", "eyes": "冰蓝", "skin": "苍白" },
        "style_tokens": ["仙侠", "暗黑", "水墨"],
        "color_palette": { "primary": "#C0C0C0", "secondary": "#4169E1", "accent": "#8B0000" },
        "facial_features": "精致冷艳，额间有骨纹",
        "unique_marks": "额间骨纹，手腕骨刺"
      },
      "stage_appearances": [
        { "id": 1, "stage_name": "人形态", "clothing": "白色纱裙", "reference_image_url": "..." },
        { "id": 2, "stage_name": "骨形态", "clothing": "骨甲", "reference_image_url": "..." }
      ]
    }
  ]
}
```

### POST /api/v1/projects/:id/characters
创建角色

### PUT /api/v1/projects/:id/characters/:cid
更新角色

### DELETE /api/v1/projects/:id/characters/:cid
删除角色

### PUT /api/v1/projects/:id/characters/:cid/bible
更新 CharacterBible
```json
{
  "visual_traits": { "hair": "银白长发", "eyes": "冰蓝" },
  "style_tokens": ["仙侠", "暗黑"],
  "color_palette": { "primary": "#C0C0C0" },
  "facial_features": "精致冷艳",
  "unique_marks": "额间骨纹"
}
```

### POST /api/v1/projects/:id/characters/:cid/stages
添加角色阶段形象

### POST /api/v1/projects/:id/characters/:cid/generate-reference
AI 生成角色参考图
```json
// 请求（可选覆盖）
{ "style_override": "realistic" }
// 响应
{ "code": 200, "data": { "task_id": "uuid-xxx" } }
```

---

## 6. 场景模块

### GET /api/v1/projects/:id/episodes/:eid/scenes
场景列表

### POST /api/v1/projects/:id/episodes/:eid/scenes
创建场景
```json
{
  "title": "荒野对峙",
  "location": "荒野",
  "time_of_day": "黄昏",
  "description": "白骨夫人与唐僧师徒在荒野相遇...",
  "dialogue": "白骨：你们不该来这里。",
  "emotion": "紧张",
  "emotion_intensity": 0.7,
  "transition": "cut",
  "duration_seconds": 15.0
}
```

### PUT /api/v1/projects/:id/episodes/:eid/scenes/:sid
更新场景

### DELETE /api/v1/projects/:id/episodes/:eid/scenes/:sid
删除场景

### PUT /api/v1/projects/:id/episodes/:eid/scenes/reorder
场景排序
```json
{ "scene_ids": [3, 1, 2, 5, 4] }
```

---

## 7. 分镜模块

### POST /api/v1/projects/:id/episodes/:eid/shots/generate
AI 生成分镜
```json
// 请求
{ "scene_id": 1 }
// 响应
{ "code": 200, "data": { "task_id": "uuid-xxx" } }
```

### GET /api/v1/projects/:id/episodes/:eid/scenes/:sid/shots
获取场景下所有镜头
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "shot_number": 1,
      "shot_type": "ELS",
      "camera_angle": "high",
      "camera_movement": "crane",
      "description": "俯瞰荒野全景，白骨夫人独立山巅",
      "motion_prompt": "[主体]白骨夫人长发飘动 [镜头]缓慢下降推近 [环境]黄沙漫天",
      "image_prompt": "...",
      "video_prompt": "...",
      "duration_seconds": 3.0,
      "character_ids": [1],
      "image_url": null,
      "video_url": null,
      "status": "pending"
    }
  ]
}
```

### PUT /api/v1/projects/:id/shots/:shotId
更新镜头

### POST /api/v1/projects/:id/shots/:shotId/compile-prompt
编译 Prompt（Mustache 模板渲染）
```json
// 请求
{ "template_id": 1 }
// 响应
{
  "code": 200,
  "data": {
    "image_prompt": "渲染后的完整 image prompt...",
    "video_prompt": "渲染后的完整 video prompt...",
    "negative_prompt": "..."
  }
}
```

---

## 8. 图像生成模块

### POST /api/v1/generate/image
提交图像生成任务
```json
// 请求
{
  "project_id": 1,
  "shot_id": 1,
  "prompt": "完整 prompt...",
  "negative_prompt": "...",
  "provider": "flux",
  "width": 576,
  "height": 1024
}
// 响应
{ "code": 200, "data": { "task_id": "uuid-xxx", "credits_cost": 5 } }
```

### GET /api/v1/generate/image/:taskId
查询图像生成状态
```json
{
  "code": 200,
  "data": {
    "task_id": "uuid-xxx",
    "status": "completed",
    "progress": 100,
    "result_url": "https://storage.../image.png",
    "credits_cost": 5
  }
}
```

### POST /api/v1/generate/image/:taskId/redo
重做图像生成（使用新 seed）

---

## 9. 视频生成模块

### POST /api/v1/generate/video
提交视频生成任务
```json
{
  "project_id": 1,
  "shot_id": 1,
  "prompt": "视频 prompt...",
  "reference_image_url": "https://...首帧图.png",
  "provider": "kling",
  "model": "kling-v2",
  "duration_seconds": 3.0
}
// 响应
{ "code": 200, "data": { "task_id": "uuid-xxx", "credits_cost": 20 } }
```

### GET /api/v1/generate/video/:taskId
查询视频生成状态

### POST /api/v1/generate/video/:taskId/cancel
取消视频生成

---

## 10. 导出模块

### POST /api/v1/projects/:id/export/merge
视频合并
```json
{
  "episode_id": 1,
  "resolution": "1080p",
  "include_subtitles": true,
  "include_bgm": true,
  "transitions": [
    { "after_scene": 1, "type": "fade", "duration_ms": 500 }
  ]
}
// 响应
{ "code": 200, "data": { "task_id": "uuid-xxx" } }
```

### GET /api/v1/projects/:id/export/:taskId
查询导出状态

### POST /api/v1/projects/:id/export/capcut
导出剪映/CapCut 工程文件
```json
// 请求
{ "episode_id": 1, "format": "capcut" }
// 响应
{ "code": 200, "data": { "download_url": "https://...draft_content.json" } }
```

### POST /api/v1/projects/:id/export/srt
导出 SRT 字幕文件

---

## 11. 素材库模块

### GET /api/v1/styles
视觉风格列表
```json
// 查询参数: ?category=anime
{
  "code": 200,
  "data": [
    { "id": 5, "name": "赛博朋克", "category": "sci-fi", "preview_image_url": "...", "prompt_prefix": "cyberpunk style, neon lights..." }
  ]
}
```

### GET /api/v1/voices
配音列表
```json
// 查询参数: ?gender=female&language=zh-cn
{
  "code": 200,
  "data": [
    { "id": 12, "name": "温柔女声", "gender": "female", "language": "zh-cn", "preview_audio_url": "...", "tags": ["温柔", "知性"] }
  ]
}
```

### GET /api/v1/templates
Prompt 模板列表

### POST /api/v1/templates
创建自定义模板
```json
{
  "name": "我的场景模板",
  "category": "scene_image",
  "template": "{{style_prefix}}, {{scene_description}}, {{character_consistency}}, masterpiece, best quality"
}
```

### POST /api/v1/assets/upload
上传素材（multipart/form-data）
```json
// 响应
{ "code": 200, "data": { "id": 1, "url": "https://...", "type": "image", "filename": "ref.png" } }
```

### GET /api/v1/assets
我的素材列表

---

## 12. 小红书图文转视频

### POST /api/v1/redbook/parse
解析小红书笔记链接
```json
// 请求
{ "url": "https://www.xiaohongshu.com/explore/xxx" }
// 响应
{
  "code": 200,
  "data": {
    "images": ["https://...1.jpg", "https://...2.jpg"],
    "text": "原始文案...",
    "tags": ["旅行", "美食"]
  }
}
```

### POST /api/v1/redbook/copywriting
AI 生成爆款文案
```json
// 请求
{
  "images": ["https://...1.jpg", "https://...2.jpg"],
  "description": "今天去了故宫，太美了",
  "style": "治愈"
}
// 响应
{
  "code": 200,
  "data": {
    "sentences": [
      { "text": "推开朱红色的大门，六百年的时光扑面而来", "emotion": "惊叹", "image_index": 0 },
      { "text": "阳光穿过琉璃瓦，洒下一地碎金", "emotion": "温暖", "image_index": 1 },
      { "text": "每一块砖石都在低语，诉说着王朝的兴衰", "emotion": "感慨", "image_index": 0 }
    ]
  }
}
```

### POST /api/v1/redbook/generate
一键生成视频
```json
// 请求
{
  "images": ["https://..."],
  "sentences": [...],
  "voice_id": 12,
  "bgm_style": "轻快",
  "aspect_ratio": "9:16"
}
// 响应
{ "code": 200, "data": { "task_id": "uuid-xxx" } }
```

---

## 13. AI 聊天模块

### POST /api/v1/projects/:id/chat
发送消息（SSE 流式响应）
```json
// 请求
{ "message": "帮我把第三场的情绪改成更紧张的氛围" }
```

响应为 SSE 流：
```
event: message
data: {"type": "text_delta", "content": "好的，"}

event: message
data: {"type": "text_delta", "content": "我来调整第三场..."}

event: message
data: {"type": "action", "action": "update_scene", "scene_id": 3, "changes": {"emotion": "紧张", "emotion_intensity": 0.9}}

event: message
data: {"type": "done"}
```

---

## 14. SSE 事件流

### GET /api/v1/projects/:id/events
项目级事件流（SSE 长连接）

```
event: task_progress
data: {"task_id":"uuid","task_type":"video_gen","shot_id":3,"status":"processing","progress":65,"message":"生成中..."}

event: task_completed
data: {"task_id":"uuid","task_type":"image_gen","shot_id":1,"result_url":"https://...","credits_cost":5}

event: task_failed
data: {"task_id":"uuid","task_type":"video_gen","error_message":"供应商超时","retry_available":true}

event: node_status
data: {"node_id":"segmentdesign-1","status":"completed"}
```

---

## 15. 任务管理

### GET /api/v1/tasks
任务列表
```json
// 查询参数: ?project_id=1&status=running&task_type=video_gen&page=1
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid-xxx",
        "task_type": "video_gen",
        "status": "running",
        "progress": 65,
        "project_id": 1,
        "shot_id": 3,
        "credits_cost": 20,
        "created_at": "...",
        "started_at": "..."
      }
    ],
    "total": 12
  }
}
```

### POST /api/v1/tasks/:id/cancel
取消任务

### POST /api/v1/tasks/:id/retry
重试失败任务
