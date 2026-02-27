# DreamX Studio — API 接口设计文档

> 版本：v1.0 | 日期：2026-02-26 | 作者：啾啾

---

## 1. 概述

### 1.1 基础规范

| 维度 | 规范 |
|------|------|
| Base URL | `https://api.dreamx.studio/v1`（生产）/ `https://dev-api.dreamx.studio/v1`（开发） |
| 协议 | HTTPS + JSON |
| 认证 | Bearer Token (JWT) |
| 字符集 | UTF-8 |
| 时区 | UTC（前端转换为本地时区） |

### 1.2 通用响应格式

**成功响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

**错误响应：**
```json
{
  "code": 40001,
  "message": "invalid token",
  "data": null
}
```

**分页响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "items": [ ... ]
  }
}
```

### 1.3 错误码定义

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 40001 | 认证失败（token 无效/过期） |
| 40002 | 权限不足 |
| 40003 | 参数校验失败 |
| 40004 | 资源不存在 |
| 40005 | 资源已存在 |
| 40006 | 操作不允许 |
| 40007 | 积分不足 |
| 50001 | 服务器内部错误 |
| 50002 | AI 服务调用失败 |
| 50003 | 第三方服务超时 |
| 50004 | 队列任务失败 |

### 1.4 认证方式

Header 携带：
```
Authorization: Bearer <access_token>
```

Token 有效期：2 小时，过期使用 refresh_token 刷新。

---

## 2. 认证模块 `/auth/*`

### 2.1 用户注册

**POST** `/auth/register`

请求：
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "nickname": "创作者小明",
  "invite_code": "INV2024ABC"
}
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": "usr_a1b2c3d4",
    "email": "user@example.com",
    "nickname": "创作者小明",
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 7200
  }
}
```

### 2.2 用户登录

**POST** `/auth/login`

请求：
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": "usr_a1b2c3d4",
    "email": "user@example.com",
    "nickname": "导演小明",
    "avatar": "https://cdn.dreamx.studio/avatars/usr_a1b2c3d4.jpg",
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 7200
  }
}
```

### 2.3 刷新 Token

**POST** `/auth/refresh`

请求：
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 7200
  }
}
```

### 2.4 Firebase Auth 登录（推荐）

**POST** `/auth/firebase`

请求：
```json
{
  "firebase_id_token": "eyJhbGciOiJSUzI1NiIs...",
  "nickname": "创作者小明"
}
```

响应：同登录响应

---

## 3. 用户模块 `/user/*`

### 3.1 获取个人信息

**GET** `/user/profile`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": "usr_a1b2c3d4",
    "email": "user@example.com",
    "nickname": "导演小明",
    "avatar": "https://cdn.dreamx.studio/avatars/usr_a1b2c3d4.jpg",
    "credits": 1500,
    "subscription": {
      "plan": "pro",
      "status": "active",
      "expires_at": "2025-06-01T00:00:00Z"
    },
    "created_at": "2024-12-01T10:00:00Z"
  }
}
```

### 3.2 获取积分明细

**GET** `/user/credits?page=1&page_size=20`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 50,
    "page": 1,
    "page_size": 20,
    "items": [
      {
        "id": "txn_123",
        "type": "consume",
        "amount": -300,
        "balance_after": 1200,
        "description": "生成视频片段",
        "related_resource": "shot_456",
        "created_at": "2025-02-26T10:00:00Z"
      }
    ]
  }
}
```

### 3.3 更新个人信息

**PUT** `/user/profile`

请求：
```json
{
  "nickname": "导演小明",
  "avatar": "https://cdn.dreamx.studio/avatars/new_avatar.jpg"
}
```

---

## 4. 项目模块 `/projects/*`

### 4.1 项目列表

**GET** `/projects?status=draft&page=1&page_size=20`

Query 参数：
- `status`: 筛选状态（draft/generating/completed/archived）
- `mode`: 筛选模式（single_episode/multi_episodes/...）
- `sort`: 排序（updated_at DESC / created_at DESC）

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 10,
    "page": 1,
    "page_size": 20,
    "items": [
      {
        "project_id": "prj_abc123",
        "title": "共生劫：白骨夫人的生死局",
        "mode": "multi_episodes",
        "visual_style_id": 12,
        "visual_style_name": "Epic Oriental Wuxia",
        "language": "zh-cn",
        "aspect_ratio": "9:16",
        "cover_url": "https://cdn.dreamx.studio/covers/prj_abc123.jpg",
        "status": "generating",
        "episode_count": 4,
        "created_at": "2025-02-20T10:00:00Z",
        "updated_at": "2025-02-26T15:30:00Z"
      }
    ]
  }
}
```

### 4.2 创建项目

**POST** `/projects`

请求：
```json
{
  "title": "我的短剧",
  "mode": "multi_episodes",
  "idea_text": "一个关于职场内卷的故事...",
  "visual_style_id": 12,
  "language": "zh-cn",
  "aspect_ratio": "9:16",
  "episode_count": 4,
  "episode_duration": 60
}
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "project_id": "prj_abc123",
    "series_id": "ser_xyz789",
    "status": "draft",
    "canvas_data": {
      "nodes": [...],
      "edges": [...]
    }
  }
}
```

### 4.3 获取项目详情

**GET** `/projects/:projectId`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "project_id": "prj_abc123",
    "title": "共生劫：白骨夫人的生死局",
    "mode": "multi_episodes",
    "status": "generating",
    "canvas_data": {
      "nodes": [
        { "id": "checkpoint", "type": "checkpoint-node", "data": {...} },
        { "id": "planning", "type": "planningcenter-node", "data": {...} }
      ],
      "edges": [
        { "source": "checkpoint", "target": "planning" }
      ]
    },
    "series": {
      "series_id": "ser_xyz789",
      "state": "planning_center",
      "check_point": { ... },
      "planning_center": { ... }
    },
    "episodes": [ ... ],
    "characters": [ ... ],
    "created_at": "2025-02-20T10:00:00Z",
    "updated_at": "2025-02-26T15:30:00Z"
  }
}
```

### 4.4 更新项目

**PUT** `/projects/:projectId`

请求：
```json
{
  "title": "新标题",
  "canvas_data": { "nodes": [...], "edges": [...] }
}
```

### 4.5 删除项目

**DELETE** `/projects/:projectId`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 4.6 恢复/进入项目

**POST** `/projects/:projectId/resume`

请求：
```json
{
  "series_id": "ser_xyz789",
  "language": "zh-cn"
}
```

响应：同项目详情

---

## 5. 画布/查询模块 `/query/*`

### 5.1 获取画布核心数据

**POST** `/query/main_canvas`

请求：
```json
{
  "req_id": "req_1772122910574_tnbq18mva",
  "event": "query_project_state",
  "project_id": "prj_abc123",
  "series_id": "ser_xyz789",
  "type": "multi_episodes"
}
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "series_id": "ser_xyz789",
      "state": "planning_center",
      "data": {
        "mode": "standard",
        "idea_text": "（用户输入的创意文本）",
        "planning_center": {
          "cover_image": "https://cdn.dreamx.studio/...",
          "episodes": [ ... ]
        }
      }
    }
  ]
}
```

### 5.2 获取视觉风格列表

**GET** `/query/visual_style_list?type=Realistic/Live`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "Immersive Raw Realism",
      "type": "Realistic/Live",
      "description": "Wide-angle natural lighting with continuous dynamic movement...",
      "img_url": "https://cdn.dreamx.studio/styles/1.jpg"
    }
  ]
}
```

### 5.3 获取配音列表

**GET** `/query/voices?language=zh-CN&gender=Female`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "voice_list": [
      {
        "id": "zh_female_xiaoxiao_saturn_bigtts",
        "name": "晓晓",
        "description": "温暖女声，适合情感表达",
        "audio_url": "https://cdn.dreamx.studio/voices/zh_female_xiaoxiao.mp3",
        "age": ["Adult"],
        "language": "zh-CN",
        "gender": "Female"
      }
    ]
  }
}
```

### 5.4 获取项目聊天记录

**GET** `/projects/:projectId/chat?series_id=ser_xyz789&page=1&page_size=50`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 50,
    "items": [
      {
        "id": "msg_123",
        "role": "user",
        "content": "帮我生成 3 个故事方案",
        "created_at": "2025-02-26T10:00:00Z"
      },
      {
        "id": "msg_124",
        "role": "assistant",
        "content": "好的，我为你生成了 3 个方案...",
        "created_at": "2025-02-26T10:00:05Z"
      }
    ]
  }
}
```

### 5.5 发送聊天消息

**POST** `/projects/:projectId/chat`

请求：
```json
{
  "series_id": "ser_xyz789",
  "content": "帮我生成 3 个故事方案",
  "trigger_node": "story_bible"
}
```

响应（SSE 流式）：
```
data: {"type": "stream_start", "message_id": "msg_125"}

data: {"type": "content", "content": "好的，我为你生成了 3 个方案：\n\n"}

data: {"type": "content", "content": "**方案 A：职场逆袭**\n主角林小雨..."}

data: {"type": "content", "content": "**方案 B：爱情抉择**\n..."}

data: {"type": "content", "content": "**方案 C：悬疑反转**\n..."}

data: {"type": "stream_end", "actions": [
  {"label": "选择方案 A", "value": "select_scheme_A"},
  {"label": "选择方案 B", "value": "select_scheme_B"},
  {"label": "选择方案 C", "value": "select_scheme_C"}
]}
```

---

## 6. AI 生成模块 `/ai/*`

### 6.1 生成故事圣经

**POST** `/ai/story_bible/generate`

请求：
```json
{
  "project_id": "prj_abc123",
  "series_id": "ser_xyz789",
  "idea_text": "一个关于职场内卷的故事...",
  "visual_style_id": 12,
  "count": 3
}
```

响应（SSE 流式，同聊天）：
```
data: {"type": "stream_start", "message_id": "msg_126"}
data: {"type": "content", "content": "正在生成故事方案..."}
...
data: {"type": "complete", "schemes": [
  {"id": "scheme_A", "title": "职场逆袭", "logline": "...", "synopsis": "..."},
  {"id": "scheme_B", "title": "爱情抉择", "logline": "...", "synopsis": "..."},
  {"id": "scheme_C", "title": "悬疑反转", "logline": "...", "synopsis": "..."}
]}
```

### 6.2 选择故事方案

**POST** `/ai/story_bible/select`

请求：
```json
{
  "project_id": "prj_abc123",
  "series_id": "ser_xyz789",
  "scheme_id": "scheme_A"
}
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "story_bible": {
      "title": "职场逆袭",
      "genre": "职场/剧情",
      "logline": "实习生林小雨如何在...",
      "synopsis": "...",
      "world_building": "..."
    }
  }
}
```

### 6.3 生成角色集

**POST** `/ai/character_pack/generate`

请求：
```json
{
  "project_id": "prj_abc123",
  "series_id": "ser_xyz789",
  "story_bible_id": "sb_123"
}
```

响应（SSE 流式）：
```
data: {"type": "stream_start"}
data: {"type": "progress", "progress": 10, "message": "正在分析角色..."}
data: {"type": "progress", "progress": 50, "message": "正在生成角色形象..."}
data: {"type": "progress", "progress": 80, "message": "正在匹配配音..."}
data: {"type": "complete", "characters": [
  {
    "id": "char_1",
    "name": "林小雨",
    "role_type": "protagonist",
    "gender": "女",
    "age": "25 岁",
    "image_url": "https://cdn.dreamx.studio/characters/char_1.jpg",
    "voice_id": "zh_female_xiaoxiao_saturn_bigtts"
  }
]}
```

### 6.4 生成规划中心（连续剧集模式）

**POST** `/ai/planning_center/generate`

请求：
```json
{
  "project_id": "prj_abc123",
  "series_id": "ser_xyz789",
  "character_pack_id": "cp_123"
}
```

响应（SSE 流式）：
```
data: {"type": "stream_start"}
data: {"type": "progress", "progress": 30, "message": "正在生成封面..."}
data: {"type": "progress", "progress": 60, "message": "正在生成剧集大纲..."}
data: {"type": "complete", "planning_center": {
  "cover_image": "https://cdn.dreamx.studio/planning/cover.jpg",
  "core_narrative": "...",
  "episodes": [
    {
      "episode_id": "epi_1",
      "episode_number": 1,
      "title": "初入职场",
      "summary": "林小雨第一天入职..."
    }
  ]
}}
```

### 6.5 生成剧本

**POST** `/ai/script/generate`

请求：
```json
{
  "project_id": "prj_abc123",
  "episode_id": "epi_1"
}
```

### 6.6 生成场景设计

**POST** `/ai/scene_design/generate`

请求：
```json
{
  "project_id": "prj_abc123",
  "episode_id": "epi_1",
  "script_id": "script_123"
}
```

### 6.7 生成分镜设计

**POST** `/ai/segment_design/generate`

请求：
```json
{
  "project_id": "prj_abc123",
  "scene_id": "scene_123"
}
```

### 6.8 生成视频片段

**POST** `/ai/video/generate`

请求：
```json
{
  "project_id": "prj_abc123",
  "shot_id": "shot_123",
  "model": "dlim2v",
  "seconds": 4
}
```

响应（异步任务）：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_video_456",
    "status": "queued",
    "progress": 0,
    "estimated_seconds": 120
  }
}
```

### 6.9 查询生成任务状态

**GET** `/ai/tasks/:taskId`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_video_456",
    "type": "video_generation",
    "status": "processing",
    "progress": 78,
    "message": "正在渲染视频...",
    "result": null
  }
}
```

### 6.10 任务 SSE 进度推送

**GET** `/ai/tasks/:taskId/stream`

SSE 流式响应：
```
data: {"type": "progress", "progress": 10, "message": "任务已接收"}
data: {"type": "progress", "progress": 30, "message": "正在初始化..."}
data: {"type": "progress", "progress": 50, "message": "正在生成..."}
data: {"type": "progress", "progress": 80, "message": "正在后处理..."}
data: {"type": "complete", "result": {"video_url": "https://cdn.dreamx.studio/..."}}
```

---

## 7. 素材模块 `/assets/*`

### 7.1 上传素材

**POST** `/assets/upload`

请求（multipart/form-data）：
```
file: <binary>
type: image
project_id: prj_abc123
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "asset_id": "ast_123",
    "url": "https://cdn.dreamx.studio/assets/ast_123.jpg",
    "type": "image",
    "size_bytes": 102400,
    "width": 1920,
    "height": 1080
  }
}
```

### 7.2 素材列表

**GET** `/assets?project_id=prj_abc123&type=image&page=1&page_size=20`

---

## 8. 导出模块 `/export/*`

### 8.1 导出剪映工程

**POST** `/export/capcut`

请求：
```json
{
  "project_id": "prj_abc123",
  "episode_id": "epi_1",
  "include_subtitle": true,
  "include_bgm": true,
  "watermark_text": "@我的账号"
}
```

响应（异步任务）：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_export_789",
    "status": "queued"
  }
}
```

### 8.2 查询导出任务

**GET** `/export/tasks/:taskId`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_export_789",
    "status": "completed",
    "progress": 100,
    "result": {
      "download_url": "https://cdn.dreamx.studio/exports/task_export_789.zip",
      "expires_at": "2025-02-27T15:30:00Z"
    }
  }
}
```

### 8.3 导出 MP4

**POST** `/export/mp4`

请求：
```json
{
  "project_id": "prj_abc123",
  "episode_id": "epi_1",
  "resolution": "1080p",
  "fps": 30
}
```

---

## 9. 订阅模块 `/subscription/*`

### 9.1 获取当前订阅

**GET** `/subscription/current`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "plan": "pro",
    "status": "active",
    "credits_monthly": 40000,
    "credits_used": 12500,
    "credits_remaining": 27500,
    "renew_date": "2025-03-26T00:00:00Z",
    "features": {
      "max_resolution": "1080p",
      "max_duration": 300,
      "pro_models": true,
      "commercial_license": true
    }
  }
}
```

### 9.2 获取订阅档位

**GET** `/subscription/tiers`

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "plan": "starter",
      "name": "Starter",
      "price_monthly": 0,
      "price_yearly": 0,
      "credits_monthly": 0,
      "features": { ... }
    },
    {
      "plan": "basic",
      "name": "Basic",
      "price_monthly": 19.9,
      "price_yearly": 219.9,
      "credits_monthly": 10000,
      "features": { ... }
    }
  ]
}
```

### 9.3 创建订阅

**POST** `/subscription/create`

请求：
```json
{
  "plan": "pro",
  "billing_cycle": "monthly",
  "payment_method": "alipay"
}
```

---

## 10. 小红书专属接口 `/redbook/*`

### 10.1 提取小红书笔记

**POST** `/redbook/extract`

请求：
```json
{
  "note_url": "https://www.xiaohongshu.com/explore/xxx"
}
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "title": "拼多多春节加班，员工直接崩溃",
    "images": [
      "https://cdn.dreamx.studio/temp/img1.jpg",
      "https://cdn.dreamx.studio/temp/img2.jpg"
    ],
    "description": "..."
  }
}
```

### 10.2 生成爆款文案

**POST** `/redbook/script/generate`

请求：
```json
{
  "images": ["ast_1", "ast_2", "ast_3"],
  "event_description": "拼多多春节加班事件",
  "voice_id": "zh_male_yunjian_neural"
}
```

响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "script_id": "script_rb_123",
    "lines": [
      {
        "image_id": "ast_1",
        "text": "拼多多春节加班",
        "duration_ms": 1500
      },
      {
        "image_id": "ast_1",
        "text": "员工直接崩溃了",
        "duration_ms": 1500
      },
      {
        "image_id": "ast_2",
        "text": "年终奖直接砍半",
        "duration_ms": 1500
      }
    ],
    "meme_insertions": [
      {
        "after_line": 2,
        "meme_id": "meme_shock_01",
        "duration_ms": 1000
      }
    ],
    "bgm": {
      "bgm_id": "bgm_complaint_01",
      "name": "吐槽风 - 节奏快"
    },
    "total_duration_ms": 18500
  }
}
```

### 10.3 一键生成视频

**POST** `/redbook/generate`

请求：
```json
{
  "script_id": "script_rb_123",
  "watermark_text": "@我的账号"
}
```

响应（异步任务）：
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_rb_456",
    "status": "queued"
  }
}
```

---

## 11. WebSocket/SSE 规范

### 11.1 SSE 事件类型

| 事件类型 | 说明 | 数据格式 |
|---------|------|---------|
| `stream_start` | 流式输出开始 | `{"message_id": "..."}` |
| `content` | 内容片段 | `{"content": "..."}` |
| `progress` | 进度更新 | `{"progress": 50, "message": "..."}` |
| `stream_end` | 流式输出结束 | `{"actions": [...]}` |
| `complete` | 任务完成 | `{"result": {...}}` |
| `error` | 错误 | `{"code": 50001, "message": "..."}` |

### 11.2 心跳机制

- 客户端每 30s 发送一次 ping
- 服务端 60s 无活动自动断开连接
- 断线后客户端自动重连（指数退避）
