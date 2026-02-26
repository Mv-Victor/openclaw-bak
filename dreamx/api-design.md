# DreamX Studio API 设计文档

## 概述

- **Base URL**: `https://api.dreamx.studio/v1`
- **协议**: HTTPS + JSON
- **认证**: Bearer Token (JWT)
- **通用响应格式**:

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

- **错误响应格式**:

```json
{
  "code": 40001,
  "message": "invalid token",
  "data": null
}
```

- **分页参数**: `page`(页码, 从1开始), `page_size`(每页条数, 默认20)
- **分页响应**: `total`, `page`, `page_size`, `items`

---

## 1. 认证模块

### 1.1 用户注册

- **Method**: `POST`
- **Path**: `/auth/register`
- **说明**: 邮箱注册新用户，返回 JWT token 对

**请求 JSON**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "nickname": "创作者小明",
  "invite_code": "INV2024ABC"
}
```

**响应 JSON**:

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

### 1.2 用户登录

- **Method**: `POST`
- **Path**: `/auth/login`
- **说明**: 邮箱密码登录，返回 JWT token 对

**请求 JSON**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": "usr_a1b2c3d4",
    "email": "user@example.com",
    "nickname": "创作者小明",
    "avatar": "https://cdn.dreamx.studio/avatars/usr_a1b2c3d4.jpg",
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 7200
  }
}
```

### 1.3 刷新 Token

- **Method**: `POST`
- **Path**: `/auth/refresh`
- **说明**: 使用 refresh_token 换取新的 access_token

**请求 JSON**:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应 JSON**:

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

---

## 2. 用户模块

### 2.1 获取个人信息

- **Method**: `GET`
- **Path**: `/user/profile`
- **说明**: 获取当前登录用户的个人信息、积分、订阅状态

**请求 JSON**: 无（Header 携带 `Authorization: Bearer <token>`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": "usr_a1b2c3d4",
    "email": "user@example.com",
    "nickname": "创作者小明",
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

### 2.2 更新个人信息

- **Method**: `PUT`
- **Path**: `/user/profile`
- **说明**: 更新昵称、头像等个人信息

**请求 JSON**:

```json
{
  "nickname": "导演小明",
  "avatar": "https://cdn.dreamx.studio/avatars/new_avatar.jpg"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user_id": "usr_a1b2c3d4",
    "nickname": "导演小明",
    "avatar": "https://cdn.dreamx.studio/avatars/new_avatar.jpg"
  }
}
```

### 2.3 获取积分明细

- **Method**: `GET`
- **Path**: `/user/credits`
- **说明**: 查询积分余额和消费/充值记录

**请求 JSON**: 无（Query: `?page=1&page_size=20`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "balance": 1500,
    "items": [
      {
        "id": "cr_001",
        "type": "consume",
        "amount": -10,
        "reason": "image_generation",
        "project_id": "prj_x1y2z3",
        "created_at": "2025-01-15T14:30:00Z"
      },
      {
        "id": "cr_002",
        "type": "recharge",
        "amount": 500,
        "reason": "daily_task",
        "project_id": null,
        "created_at": "2025-01-15T08:00:00Z"
      }
    ],
    "total": 56,
    "page": 1,
    "page_size": 20
  }
}
```

### 2.4 获取订阅信息

- **Method**: `GET`
- **Path**: `/user/subscription`
- **说明**: 查询当前订阅计划详情

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "plan": "pro",
    "status": "active",
    "features": [
      "unlimited_projects",
      "hd_export",
      "priority_queue",
      "advanced_styles"
    ],
    "credits_per_month": 5000,
    "started_at": "2025-01-01T00:00:00Z",
    "expires_at": "2025-06-01T00:00:00Z",
    "auto_renew": true
  }
}
```

### 2.5 订阅/升级计划

- **Method**: `POST`
- **Path**: `/user/subscription`
- **说明**: 创建或升级订阅计划

**请求 JSON**:

```json
{
  "plan": "pro",
  "period": "monthly",
  "payment_method": "wechat"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "order_id": "ord_abc123",
    "plan": "pro",
    "amount": 99.00,
    "currency": "CNY",
    "payment_url": "https://pay.dreamx.studio/checkout/ord_abc123",
    "expires_at": "2025-01-15T15:00:00Z"
  }
}
```

---

## 3. 项目模块

### 3.1 创建项目

- **Method**: `POST`
- **Path**: `/projects`
- **说明**: 创建新的创作项目，支持五种创作模式

**请求 JSON**:

```json
{
  "title": "都市爱情短剧",
  "description": "一个关于都市白领的爱情故事",
  "mode": "single_episode",
  "aspect_ratio": "9:16",
  "style": "realistic",
  "language": "zh-CN"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "project_id": "prj_x1y2z3",
    "title": "都市爱情短剧",
    "description": "一个关于都市白领的爱情故事",
    "mode": "single_episode",
    "aspect_ratio": "9:16",
    "style": "realistic",
    "language": "zh-CN",
    "status": "draft",
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
}
```

### 3.2 获取项目详情

- **Method**: `GET`
- **Path**: `/projects/:project_id`
- **说明**: 获取项目完整信息，包含统计数据

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "project_id": "prj_x1y2z3",
    "title": "都市爱情短剧",
    "description": "一个关于都市白领的爱情故事",
    "mode": "single_episode",
    "aspect_ratio": "9:16",
    "style": "realistic",
    "language": "zh-CN",
    "status": "in_progress",
    "stats": {
      "scenes_count": 5,
      "characters_count": 3,
      "storyboards_count": 12,
      "images_generated": 8,
      "videos_generated": 2
    },
    "canvas_data": {
      "nodes": [],
      "edges": []
    },
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T14:30:00Z"
  }
}
```

### 3.3 更新项目

- **Method**: `PUT`
- **Path**: `/projects/:project_id`
- **说明**: 更新项目基本信息或画布数据

**请求 JSON**:

```json
{
  "title": "都市爱情短剧（修改版）",
  "description": "更新后的描述",
  "canvas_data": {
    "nodes": [
      {"id": "node_1", "type": "checkpoint", "position": {"x": 100, "y": 200}}
    ],
    "edges": [
      {"id": "edge_1", "source": "node_1", "target": "node_2"}
    ]
  }
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "project_id": "prj_x1y2z3",
    "title": "都市爱情短剧（修改版）",
    "updated_at": "2025-01-15T15:00:00Z"
  }
}
```

### 3.4 删除项目

- **Method**: `DELETE`
- **Path**: `/projects/:project_id`
- **说明**: 软删除项目及其关联数据

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 3.5 项目列表

- **Method**: `GET`
- **Path**: `/projects`
- **说明**: 获取当前用户的项目列表，支持分页和筛选

**请求 JSON**: 无（Query: `?page=1&page_size=20&mode=single_episode&status=draft`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "project_id": "prj_x1y2z3",
        "title": "都市爱情短剧",
        "mode": "single_episode",
        "style": "realistic",
        "status": "in_progress",
        "cover_url": "https://cdn.dreamx.studio/covers/prj_x1y2z3.jpg",
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T14:30:00Z"
      }
    ],
    "total": 8,
    "page": 1,
    "page_size": 20
  }
}
```

---

## 4. 剧本模块

### 4.1 AI 生成剧本

- **Method**: `POST`
- **Path**: `/projects/:project_id/script/generate`
- **说明**: 基于用户输入的故事概要，AI 生成完整剧本。异步任务，通过 SSE 推送进度

**请求 JSON**:

```json
{
  "prompt": "一个程序员意外穿越到古代，用现代知识改变命运的故事",
  "genre": "comedy",
  "duration_minutes": 3,
  "tone": "lighthearted",
  "target_audience": "young_adult",
  "language": "zh-CN",
  "reference_style": "抖音爆款短剧"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_script_001",
    "status": "processing",
    "sse_url": "/projects/prj_x1y2z3/script/generate/task_script_001/stream"
  }
}
```

### 4.2 获取剧本内容

- **Method**: `GET`
- **Path**: `/projects/:project_id/script`
- **说明**: 获取项目当前剧本全文

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "script_id": "scr_m1n2o3",
    "project_id": "prj_x1y2z3",
    "title": "穿越码农",
    "content": "## 第一幕：意外穿越\n\n**场景：现代办公室**\n\n（小明坐在工位前，疯狂敲代码...）",
    "format": "markdown",
    "word_count": 2500,
    "version": 3,
    "scenes": [
      {
        "scene_index": 1,
        "title": "意外穿越",
        "summary": "程序员小明加班时意外穿越",
        "location": "现代办公室 → 古代集市",
        "characters": ["小明"],
        "duration_seconds": 30
      },
      {
        "scene_index": 2,
        "title": "初来乍到",
        "summary": "小明发现自己身处古代集市",
        "location": "古代集市",
        "characters": ["小明", "老板娘"],
        "duration_seconds": 45
      }
    ],
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

### 4.3 编辑剧本

- **Method**: `PUT`
- **Path**: `/projects/:project_id/script`
- **说明**: 手动编辑剧本内容，支持全量或增量更新

**请求 JSON**:

```json
{
  "content": "## 第一幕：意外穿越（修改版）\n\n**场景：深夜办公室**\n\n（小明独自加班...）",
  "format": "markdown"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "script_id": "scr_m1n2o3",
    "version": 4,
    "word_count": 2600,
    "updated_at": "2025-01-15T15:00:00Z"
  }
}
```

### 4.4 AI 自动分场

- **Method**: `POST`
- **Path**: `/projects/:project_id/script/split-scenes`
- **说明**: AI 自动将剧本拆分为场景列表，提取角色和道具

**请求 JSON**:

```json
{
  "script_id": "scr_m1n2o3",
  "strategy": "auto",
  "max_scene_duration": 60
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_split_001",
    "status": "processing",
    "sse_url": "/projects/prj_x1y2z3/script/split-scenes/task_split_001/stream"
  }
}
```

---

## 5. 角色模块

### 5.1 AI 提取角色

- **Method**: `POST`
- **Path**: `/projects/:project_id/characters/extract`
- **说明**: 从剧本中自动提取角色信息，生成角色列表

**请求 JSON**:

```json
{
  "script_id": "scr_m1n2o3",
  "include_minor": true
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "characters": [
      {
        "character_id": "chr_001",
        "name": "小明",
        "role": "protagonist",
        "description": "28岁程序员，戴眼镜，穿格子衫",
        "personality": "聪明、幽默、有点社恐",
        "appearances_count": 8
      },
      {
        "character_id": "chr_002",
        "name": "老板娘",
        "role": "supporting",
        "description": "古代客栈老板娘，泼辣爽朗",
        "personality": "热情、精明、仗义",
        "appearances_count": 4
      }
    ]
  }
}
```

### 5.2 创建角色

- **Method**: `POST`
- **Path**: `/projects/:project_id/characters`
- **说明**: 手动创建角色，包含 Character Bible 信息

**请求 JSON**:

```json
{
  "name": "小明",
  "role": "protagonist",
  "description": "28岁程序员，意外穿越到古代",
  "personality": "聪明、幽默、有点社恐",
  "character_bible": {
    "visual_traits": {
      "facial_features": "圆脸、单眼皮、戴黑框眼镜",
      "body_type": "中等身材、偏瘦",
      "unique_marks": "左手腕有一颗痣"
    },
    "style_tokens": ["modern_casual", "glasses", "plaid_shirt"],
    "color_palette": ["#2C3E50", "#3498DB", "#ECF0F1"],
    "reference_images": [
      "https://cdn.dreamx.studio/refs/chr_001_ref1.jpg"
    ],
    "seed_value": 42,
    "stage_appearances": [
      {
        "stage": "modern",
        "description": "格子衫、牛仔裤、运动鞋",
        "style_tokens": ["plaid_shirt", "jeans", "sneakers"]
      },
      {
        "stage": "ancient",
        "description": "粗布长衫、布鞋",
        "style_tokens": ["hanfu_casual", "cloth_shoes"]
      }
    ]
  }
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "character_id": "chr_001",
    "name": "小明",
    "role": "protagonist",
    "character_bible": {
      "visual_traits": {
        "facial_features": "圆脸、单眼皮、戴黑框眼镜",
        "body_type": "中等身材、偏瘦",
        "unique_marks": "左手腕有一颗痣"
      },
      "style_tokens": ["modern_casual", "glasses", "plaid_shirt"],
      "color_palette": ["#2C3E50", "#3498DB", "#ECF0F1"],
      "reference_images": ["https://cdn.dreamx.studio/refs/chr_001_ref1.jpg"],
      "seed_value": 42,
      "consistency_prompt": "a young Chinese man, round face, single eyelids, black-framed glasses, slim build, mole on left wrist"
    },
    "created_at": "2025-01-15T11:00:00Z"
  }
}
```

### 5.3 获取角色详情

- **Method**: `GET`
- **Path**: `/projects/:project_id/characters/:character_id`
- **说明**: 获取角色完整信息，包含 Character Bible

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "character_id": "chr_001",
    "project_id": "prj_x1y2z3",
    "name": "小明",
    "role": "protagonist",
    "description": "28岁程序员，意外穿越到古代",
    "personality": "聪明、幽默、有点社恐",
    "character_bible": {
      "visual_traits": {
        "facial_features": "圆脸、单眼皮、戴黑框眼镜",
        "body_type": "中等身材、偏瘦",
        "unique_marks": "左手腕有一颗痣"
      },
      "style_tokens": ["modern_casual", "glasses", "plaid_shirt"],
      "color_palette": ["#2C3E50", "#3498DB", "#ECF0F1"],
      "reference_images": ["https://cdn.dreamx.studio/refs/chr_001_ref1.jpg"],
      "seed_value": 42,
      "stage_appearances": [
        {
          "stage": "modern",
          "description": "格子衫、牛仔裤、运动鞋",
          "style_tokens": ["plaid_shirt", "jeans", "sneakers"]
        },
        {
          "stage": "ancient",
          "description": "粗布长衫、布鞋",
          "style_tokens": ["hanfu_casual", "cloth_shoes"]
        }
      ],
      "consistency_prompt": "a young Chinese man, round face, single eyelids, black-framed glasses, slim build, mole on left wrist"
    },
    "created_at": "2025-01-15T11:00:00Z",
    "updated_at": "2025-01-15T11:00:00Z"
  }
}
```

### 5.4 更新角色

- **Method**: `PUT`
- **Path**: `/projects/:project_id/characters/:character_id`
- **说明**: 更新角色信息或 Character Bible

**请求 JSON**:

```json
{
  "name": "小明（穿越版）",
  "character_bible": {
    "style_tokens": ["modern_casual", "glasses", "plaid_shirt", "time_traveler"],
    "reference_images": [
      "https://cdn.dreamx.studio/refs/chr_001_ref1.jpg",
      "https://cdn.dreamx.studio/refs/chr_001_ref2.jpg"
    ]
  }
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "character_id": "chr_001",
    "name": "小明（穿越版）",
    "updated_at": "2025-01-15T15:30:00Z"
  }
}
```

### 5.5 删除角色

- **Method**: `DELETE`
- **Path**: `/projects/:project_id/characters/:character_id`
- **说明**: 删除角色

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 5.6 角色列表

- **Method**: `GET`
- **Path**: `/projects/:project_id/characters`
- **说明**: 获取项目下所有角色

**请求 JSON**: 无（Query: `?role=protagonist`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "character_id": "chr_001",
        "name": "小明",
        "role": "protagonist",
        "description": "28岁程序员",
        "avatar_url": "https://cdn.dreamx.studio/characters/chr_001_avatar.jpg",
        "appearances_count": 8
      },
      {
        "character_id": "chr_002",
        "name": "老板娘",
        "role": "supporting",
        "description": "古代客栈老板娘",
        "avatar_url": "https://cdn.dreamx.studio/characters/chr_002_avatar.jpg",
        "appearances_count": 4
      }
    ],
    "total": 2
  }
}
```

---

## 6. 场景模块

### 6.1 创建场景

- **Method**: `POST`
- **Path**: `/projects/:project_id/scenes`
- **说明**: 创建场景，包含视觉风格设定

**请求 JSON**:

```json
{
  "title": "古代集市",
  "description": "热闹的古代集市，人来人往，各种摊位",
  "location": "古代小镇中心",
  "time_of_day": "afternoon",
  "weather": "sunny",
  "mood": "lively",
  "visual_style": {
    "art_style": "realistic",
    "color_tone": "warm",
    "lighting": "natural_daylight",
    "reference_images": [
      "https://cdn.dreamx.studio/refs/scene_market_ref.jpg"
    ],
    "negative_prompt": "modern buildings, cars, phones"
  },
  "characters": ["chr_001", "chr_002"],
  "props": ["古代铜钱", "茶壶", "算盘"],
  "duration_seconds": 45
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "scene_id": "scn_001",
    "project_id": "prj_x1y2z3",
    "title": "古代集市",
    "description": "热闹的古代集市，人来人往，各种摊位",
    "scene_index": 2,
    "visual_style": {
      "art_style": "realistic",
      "color_tone": "warm",
      "lighting": "natural_daylight",
      "reference_images": ["https://cdn.dreamx.studio/refs/scene_market_ref.jpg"],
      "negative_prompt": "modern buildings, cars, phones"
    },
    "characters": ["chr_001", "chr_002"],
    "props": ["古代铜钱", "茶壶", "算盘"],
    "duration_seconds": 45,
    "created_at": "2025-01-15T11:30:00Z"
  }
}
```

### 6.2 获取场景详情

- **Method**: `GET`
- **Path**: `/projects/:project_id/scenes/:scene_id`
- **说明**: 获取场景完整信息

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "scene_id": "scn_001",
    "project_id": "prj_x1y2z3",
    "title": "古代集市",
    "description": "热闹的古代集市，人来人往，各种摊位",
    "scene_index": 2,
    "location": "古代小镇中心",
    "time_of_day": "afternoon",
    "weather": "sunny",
    "mood": "lively",
    "visual_style": {
      "art_style": "realistic",
      "color_tone": "warm",
      "lighting": "natural_daylight",
      "reference_images": ["https://cdn.dreamx.studio/refs/scene_market_ref.jpg"],
      "negative_prompt": "modern buildings, cars, phones"
    },
    "characters": [
      {"character_id": "chr_001", "name": "小明", "stage": "ancient"},
      {"character_id": "chr_002", "name": "老板娘", "stage": "default"}
    ],
    "props": ["古代铜钱", "茶壶", "算盘"],
    "storyboards_count": 4,
    "duration_seconds": 45,
    "created_at": "2025-01-15T11:30:00Z",
    "updated_at": "2025-01-15T11:30:00Z"
  }
}
```

### 6.3 更新场景

- **Method**: `PUT`
- **Path**: `/projects/:project_id/scenes/:scene_id`
- **说明**: 更新场景信息或视觉风格

**请求 JSON**:

```json
{
  "title": "古代集市（黄昏）",
  "time_of_day": "sunset",
  "visual_style": {
    "color_tone": "golden",
    "lighting": "golden_hour"
  }
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "scene_id": "scn_001",
    "title": "古代集市（黄昏）",
    "updated_at": "2025-01-15T16:00:00Z"
  }
}
```

### 6.4 删除场景

- **Method**: `DELETE`
- **Path**: `/projects/:project_id/scenes/:scene_id`
- **说明**: 删除场景及其关联的分镜

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 6.5 场景列表

- **Method**: `GET`
- **Path**: `/projects/:project_id/scenes`
- **说明**: 获取项目下所有场景，按 scene_index 排序

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "scene_id": "scn_001",
        "title": "古代集市",
        "scene_index": 2,
        "mood": "lively",
        "characters_count": 2,
        "storyboards_count": 4,
        "duration_seconds": 45,
        "cover_url": "https://cdn.dreamx.studio/scenes/scn_001_cover.jpg"
      }
    ],
    "total": 5
  }
}
```

---

## 7. 分镜模块

### 7.1 AI 生成分镜

- **Method**: `POST`
- **Path**: `/projects/:project_id/scenes/:scene_id/storyboards/generate`
- **说明**: AI Agent 自动拆解场景为分镜序列（片段师→分镜师流水线），通过 SSE 推送进度

**请求 JSON**:

```json
{
  "scene_id": "scn_001",
  "strategy": "auto",
  "shot_count_hint": 4,
  "grid_mode": false,
  "include_dialogue": true,
  "emotional_curve": "rising"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_sb_001",
    "status": "processing",
    "sse_url": "/projects/prj_x1y2z3/scenes/scn_001/storyboards/generate/task_sb_001/stream"
  }
}
```

### 7.2 获取分镜详情

- **Method**: `GET`
- **Path**: `/projects/:project_id/scenes/:scene_id/storyboards/:storyboard_id`
- **说明**: 获取单个分镜完整信息，包含镜头语法

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "storyboard_id": "sb_001",
    "scene_id": "scn_001",
    "shot_index": 1,
    "description": "小明站在集市入口，环顾四周，满脸惊讶",
    "dialogue": "这...这是哪里？",
    "shot_grammar": {
      "shot_type": "medium_shot",
      "angle": "eye_level",
      "movement": "slow_zoom_in",
      "frame_type": "key"
    },
    "prompt": "a young Chinese man with glasses standing at the entrance of an ancient Chinese market, looking around in surprise, medium shot, eye level, warm afternoon light",
    "negative_prompt": "modern clothes, blurry, deformed",
    "duration_seconds": 5,
    "characters": [
      {
        "character_id": "chr_001",
        "name": "小明",
        "stage": "ancient",
        "position": "center"
      }
    ],
    "image": {
      "url": "https://cdn.dreamx.studio/storyboards/sb_001.jpg",
      "width": 1024,
      "height": 1792,
      "seed": 42
    },
    "video": {
      "url": "https://cdn.dreamx.studio/videos/sb_001.mp4",
      "duration_seconds": 5,
      "status": "completed"
    },
    "created_at": "2025-01-15T12:00:00Z",
    "updated_at": "2025-01-15T12:30:00Z"
  }
}
```

### 7.3 编辑分镜

- **Method**: `PUT`
- **Path**: `/projects/:project_id/scenes/:scene_id/storyboards/:storyboard_id`
- **说明**: 编辑分镜描述、镜头语法、prompt 等

**请求 JSON**:

```json
{
  "description": "小明站在集市入口，缓缓抬头，表情从困惑变为惊讶",
  "dialogue": "我...穿越了？！",
  "shot_grammar": {
    "shot_type": "close_up",
    "angle": "low_angle",
    "movement": "tilt_up"
  },
  "duration_seconds": 6
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "storyboard_id": "sb_001",
    "prompt": "a young Chinese man with glasses at ancient market entrance, slowly looking up, expression changing from confusion to surprise, close-up, low angle, warm light",
    "updated_at": "2025-01-15T16:30:00Z"
  }
}
```

### 7.4 分镜列表

- **Method**: `GET`
- **Path**: `/projects/:project_id/scenes/:scene_id/storyboards`
- **说明**: 获取场景下所有分镜，按 shot_index 排序

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "storyboard_id": "sb_001",
        "shot_index": 1,
        "description": "小明站在集市入口",
        "shot_grammar": {
          "shot_type": "close_up",
          "angle": "low_angle",
          "movement": "tilt_up"
        },
        "duration_seconds": 6,
        "image_url": "https://cdn.dreamx.studio/storyboards/sb_001.jpg",
        "video_status": "completed"
      },
      {
        "storyboard_id": "sb_002",
        "shot_index": 2,
        "description": "集市全景，人来人往",
        "shot_grammar": {
          "shot_type": "wide_shot",
          "angle": "high_angle",
          "movement": "pan_left"
        },
        "duration_seconds": 4,
        "image_url": "https://cdn.dreamx.studio/storyboards/sb_002.jpg",
        "video_status": "pending"
      }
    ],
    "total": 4
  }
}
```

### 7.5 删除分镜

- **Method**: `DELETE`
- **Path**: `/projects/:project_id/scenes/:scene_id/storyboards/:storyboard_id`
- **说明**: 删除单个分镜

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 7.6 分镜排序

- **Method**: `PUT`
- **Path**: `/projects/:project_id/scenes/:scene_id/storyboards/reorder`
- **说明**: 批量调整分镜顺序

**请求 JSON**:

```json
{
  "order": [
    {"storyboard_id": "sb_002", "shot_index": 1},
    {"storyboard_id": "sb_001", "shot_index": 2},
    {"storyboard_id": "sb_003", "shot_index": 3}
  ]
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 8. 图像生成模块

### 8.1 提交图像生成任务

- **Method**: `POST`
- **Path**: `/projects/:project_id/images/generate`
- **说明**: 为分镜提交图像生成任务，支持多供应商（DALL-E / Midjourney / SD / Flux），异步执行

**请求 JSON**:

```json
{
  "storyboard_id": "sb_001",
  "provider": "flux",
  "prompt": "a young Chinese man with glasses standing at the entrance of an ancient Chinese market, looking around in surprise, medium shot, eye level, warm afternoon light",
  "negative_prompt": "modern clothes, blurry, deformed, extra limbs",
  "width": 1024,
  "height": 1792,
  "seed": 42,
  "style_preset": "realistic_photo",
  "character_consistency": true,
  "character_ids": ["chr_001"],
  "reference_images": [
    "https://cdn.dreamx.studio/refs/chr_001_ref1.jpg"
  ],
  "num_images": 4
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_img_001",
    "status": "queued",
    "provider": "flux",
    "credits_cost": 10,
    "estimated_seconds": 30,
    "sse_url": "/projects/prj_x1y2z3/images/generate/task_img_001/stream"
  }
}
```

### 8.2 查询图像生成状态

- **Method**: `GET`
- **Path**: `/projects/:project_id/images/tasks/:task_id`
- **说明**: 查询图像生成任务状态和结果

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_img_001",
    "status": "completed",
    "provider": "flux",
    "storyboard_id": "sb_001",
    "results": [
      {
        "image_id": "img_001",
        "url": "https://cdn.dreamx.studio/generated/img_001.jpg",
        "thumbnail_url": "https://cdn.dreamx.studio/generated/img_001_thumb.jpg",
        "width": 1024,
        "height": 1792,
        "seed": 42,
        "selected": false
      },
      {
        "image_id": "img_002",
        "url": "https://cdn.dreamx.studio/generated/img_002.jpg",
        "thumbnail_url": "https://cdn.dreamx.studio/generated/img_002_thumb.jpg",
        "width": 1024,
        "height": 1792,
        "seed": 43,
        "selected": false
      },
      {
        "image_id": "img_003",
        "url": "https://cdn.dreamx.studio/generated/img_003.jpg",
        "thumbnail_url": "https://cdn.dreamx.studio/generated/img_003_thumb.jpg",
        "width": 1024,
        "height": 1792,
        "seed": 44,
        "selected": false
      },
      {
        "image_id": "img_004",
        "url": "https://cdn.dreamx.studio/generated/img_004.jpg",
        "thumbnail_url": "https://cdn.dreamx.studio/generated/img_004_thumb.jpg",
        "width": 1024,
        "height": 1792,
        "seed": 45,
        "selected": false
      }
    ],
    "credits_cost": 10,
    "started_at": "2025-01-15T12:00:00Z",
    "completed_at": "2025-01-15T12:00:28Z"
  }
}
```

### 8.3 选择/确认图像

- **Method**: `POST`
- **Path**: `/projects/:project_id/images/:image_id/select`
- **说明**: 从生成结果中选择一张图像作为分镜的最终图像

**请求 JSON**:

```json
{
  "storyboard_id": "sb_001"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "storyboard_id": "sb_001",
    "image_id": "img_001",
    "image_url": "https://cdn.dreamx.studio/generated/img_001.jpg"
  }
}
```

### 8.4 重新生成图像

- **Method**: `POST`
- **Path**: `/projects/:project_id/images/regenerate`
- **说明**: 基于已有参数重新生成图像，可微调 prompt 或更换供应商

**请求 JSON**:

```json
{
  "storyboard_id": "sb_001",
  "base_task_id": "task_img_001",
  "prompt_override": "a young Chinese man with glasses at ancient market, more dramatic lighting, cinematic",
  "seed": null,
  "provider": "flux",
  "num_images": 4
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_img_002",
    "status": "queued",
    "provider": "flux",
    "credits_cost": 10,
    "estimated_seconds": 30,
    "sse_url": "/projects/prj_x1y2z3/images/generate/task_img_002/stream"
  }
}
```

---

## 9. 视频生成模块

### 9.1 提交视频生成任务

- **Method**: `POST`
- **Path**: `/projects/:project_id/videos/generate`
- **说明**: 基于分镜图像生成视频片段，支持多供应商（Kling / Seedance / 可灵 / Runway），异步执行

**请求 JSON**:

```json
{
  "storyboard_id": "sb_001",
  "provider": "kling",
  "source_image_id": "img_001",
  "prompt": "the man slowly looks around the market, camera zooms in gently, ambient crowd noise",
  "negative_prompt": "static, frozen, glitch",
  "duration_seconds": 5,
  "fps": 24,
  "resolution": "1080p",
  "motion_strength": 0.7,
  "camera_movement": "slow_zoom_in",
  "seed": 42
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_vid_001",
    "status": "queued",
    "provider": "kling",
    "credits_cost": 50,
    "estimated_seconds": 120,
    "sse_url": "/projects/prj_x1y2z3/videos/generate/task_vid_001/stream"
  }
}
```

### 9.2 查询视频生成状态

- **Method**: `GET`
- **Path**: `/projects/:project_id/videos/tasks/:task_id`
- **说明**: 查询视频生成任务状态和结果

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_vid_001",
    "status": "completed",
    "provider": "kling",
    "storyboard_id": "sb_001",
    "result": {
      "video_id": "vid_001",
      "url": "https://cdn.dreamx.studio/videos/vid_001.mp4",
      "thumbnail_url": "https://cdn.dreamx.studio/videos/vid_001_thumb.jpg",
      "duration_seconds": 5,
      "fps": 24,
      "resolution": "1080x1920",
      "file_size_mb": 12.5,
      "seed": 42
    },
    "credits_cost": 50,
    "started_at": "2025-01-15T13:00:00Z",
    "completed_at": "2025-01-15T13:02:05Z"
  }
}
```

### 9.3 取消视频生成任务

- **Method**: `POST`
- **Path**: `/projects/:project_id/videos/tasks/:task_id/cancel`
- **说明**: 取消排队中或处理中的视频生成任务，退还积分

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_vid_001",
    "status": "cancelled",
    "credits_refunded": 50
  }
}
```

---

## 10. 导出模块

### 10.1 合并导出视频

- **Method**: `POST`
- **Path**: `/projects/:project_id/export/merge`
- **说明**: 将项目中所有场景的视频片段合并为完整视频，支持转场效果和音轨混合（FFmpeg），异步任务

**请求 JSON**:

```json
{
  "scenes": [
    {
      "scene_id": "scn_001",
      "storyboard_ids": ["sb_001", "sb_002", "sb_003"],
      "transition": "crossfade",
      "transition_duration_ms": 500
    },
    {
      "scene_id": "scn_002",
      "storyboard_ids": ["sb_004", "sb_005"],
      "transition": "cut",
      "transition_duration_ms": 0
    }
  ],
  "audio": {
    "bgm_url": "https://cdn.dreamx.studio/audio/bgm_001.mp3",
    "bgm_volume": 0.3,
    "voice_volume": 1.0,
    "include_tts": true
  },
  "subtitles": {
    "enabled": true,
    "style": "bottom_center",
    "font_size": 24,
    "font_color": "#FFFFFF",
    "bg_color": "#00000080"
  },
  "output": {
    "format": "mp4",
    "resolution": "1080x1920",
    "fps": 24,
    "quality": "high"
  }
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_export_001",
    "status": "processing",
    "estimated_seconds": 60,
    "sse_url": "/projects/prj_x1y2z3/export/merge/task_export_001/stream"
  }
}
```

### 10.2 查询导出状态

- **Method**: `GET`
- **Path**: `/projects/:project_id/export/tasks/:task_id`
- **说明**: 查询导出任务状态和下载链接

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_export_001",
    "status": "completed",
    "result": {
      "video_url": "https://cdn.dreamx.studio/exports/prj_x1y2z3_final.mp4",
      "duration_seconds": 180,
      "resolution": "1080x1920",
      "file_size_mb": 85.3,
      "download_expires_at": "2025-01-16T13:00:00Z"
    },
    "started_at": "2025-01-15T14:00:00Z",
    "completed_at": "2025-01-15T14:00:55Z"
  }
}
```

### 10.3 剪映格式导出

- **Method**: `POST`
- **Path**: `/projects/:project_id/export/jianying`
- **说明**: 将项目导出为剪映（CapCut）兼容的草稿格式，包含时间线、轨道、片段信息

**请求 JSON**:

```json
{
  "scenes": ["scn_001", "scn_002"],
  "include_audio": true,
  "include_subtitles": true,
  "draft_name": "穿越码农_剪映草稿"
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_jy_001",
    "status": "processing",
    "estimated_seconds": 15
  }
}
```

### 10.4 查询剪映导出状态

- **Method**: `GET`
- **Path**: `/projects/:project_id/export/jianying/tasks/:task_id`
- **说明**: 查询剪映导出任务状态和下载链接

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_jy_001",
    "status": "completed",
    "result": {
      "draft_url": "https://cdn.dreamx.studio/exports/prj_x1y2z3_jianying.zip",
      "draft_name": "穿越码农_剪映草稿",
      "tracks": {
        "video_tracks": 1,
        "audio_tracks": 2,
        "subtitle_tracks": 1
      },
      "clips_count": 5,
      "file_size_mb": 120.5,
      "download_expires_at": "2025-01-16T14:00:00Z"
    },
    "completed_at": "2025-01-15T14:01:10Z"
  }
}
```

---

## 11. 素材库模块

### 11.1 获取视觉风格列表

- **Method**: `GET`
- **Path**: `/assets/styles`
- **说明**: 获取平台预置的视觉风格库，支持分类筛选

**请求 JSON**: 无（Query: `?category=realistic&page=1&page_size=20`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "style_id": "sty_001",
        "name": "电影写实",
        "category": "realistic",
        "description": "高质量电影级写实风格，适合都市/古装短剧",
        "preview_url": "https://cdn.dreamx.studio/styles/sty_001_preview.jpg",
        "style_tokens": ["cinematic", "realistic", "film_grain"],
        "negative_prompt": "cartoon, anime, painting, illustration",
        "recommended_providers": ["flux", "kling"]
      },
      {
        "style_id": "sty_002",
        "name": "日系动漫",
        "category": "anime",
        "description": "日本动漫风格，适合二次元短剧",
        "preview_url": "https://cdn.dreamx.studio/styles/sty_002_preview.jpg",
        "style_tokens": ["anime", "cel_shading", "vibrant_colors"],
        "negative_prompt": "realistic, photo, 3d render",
        "recommended_providers": ["sd", "flux"]
      }
    ],
    "total": 24,
    "page": 1,
    "page_size": 20
  }
}
```

### 11.2 获取配音音色列表

- **Method**: `GET`
- **Path**: `/assets/voices`
- **说明**: 获取 TTS 配音音色库（火山引擎 TTS / ElevenLabs）

**请求 JSON**: 无（Query: `?language=zh-CN&gender=female&page=1&page_size=20`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "voice_id": "voc_001",
        "name": "甜美女声",
        "provider": "volcengine",
        "language": "zh-CN",
        "gender": "female",
        "description": "年轻甜美的女性声音，适合旁白和角色配音",
        "preview_url": "https://cdn.dreamx.studio/voices/voc_001_sample.mp3",
        "tags": ["sweet", "young", "narrator"],
        "emotions": ["neutral", "happy", "sad", "excited"]
      },
      {
        "voice_id": "voc_002",
        "name": "磁性男声",
        "provider": "volcengine",
        "language": "zh-CN",
        "gender": "male",
        "description": "低沉磁性的男性声音，适合旁白",
        "preview_url": "https://cdn.dreamx.studio/voices/voc_002_sample.mp3",
        "tags": ["deep", "mature", "narrator"],
        "emotions": ["neutral", "serious", "warm"]
      }
    ],
    "total": 36,
    "page": 1,
    "page_size": 20
  }
}
```

### 11.3 获取 Prompt 模板列表

- **Method**: `GET`
- **Path**: `/assets/templates`
- **说明**: 获取 Prompt Compiler 模板库，支持分类筛选

**请求 JSON**: 无（Query: `?type=scene_image&page=1&page_size=20`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "template_id": "tpl_001",
        "name": "场景图像通用模板",
        "type": "scene_image",
        "description": "适用于大多数场景的图像生成 prompt 模板",
        "template": "{{scene_description}}, {{characters}}, {{shot_type}}, {{angle}}, {{lighting}}, {{art_style}}, high quality, detailed",
        "variables": ["scene_description", "characters", "shot_type", "angle", "lighting", "art_style"],
        "is_system": true,
        "usage_count": 15000
      },
      {
        "template_id": "tpl_002",
        "name": "负面提示词通用模板",
        "type": "negative",
        "description": "通用负面提示词模板",
        "template": "{{style_negative}}, blurry, deformed, extra limbs, bad anatomy, watermark, text, low quality",
        "variables": ["style_negative"],
        "is_system": true,
        "usage_count": 12000
      }
    ],
    "total": 18,
    "page": 1,
    "page_size": 20
  }
}
```

### 11.4 获取 BGM 音乐列表

- **Method**: `GET`
- **Path**: `/assets/bgm`
- **说明**: 获取背景音乐素材库

**请求 JSON**: 无（Query: `?mood=happy&genre=pop&page=1&page_size=20`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "bgm_id": "bgm_001",
        "name": "轻快日常",
        "genre": "pop",
        "mood": "happy",
        "duration_seconds": 120,
        "bpm": 110,
        "preview_url": "https://cdn.dreamx.studio/bgm/bgm_001_preview.mp3",
        "full_url": "https://cdn.dreamx.studio/bgm/bgm_001.mp3",
        "license": "royalty_free",
        "tags": ["upbeat", "daily", "vlog"]
      }
    ],
    "total": 50,
    "page": 1,
    "page_size": 20
  }
}
```

---

## 12. 小红书图文转视频模块

### 12.1 解析小红书笔记

- **Method**: `POST`
- **Path**: `/redbook/parse`
- **说明**: 解析小红书笔记链接或手动输入图文内容，提取图片和文字

**请求 JSON**:

```json
{
  "note_url": "https://www.xiaohongshu.com/explore/xxxxxx",
  "manual_input": null
}
```

或手动输入：

```json
{
  "note_url": null,
  "manual_input": {
    "title": "三亚旅行攻略｜人均3000玩转三亚",
    "content": "姐妹们！这次三亚之旅真的太绝了...",
    "images": [
      "https://cdn.dreamx.studio/uploads/rb_img_001.jpg",
      "https://cdn.dreamx.studio/uploads/rb_img_002.jpg",
      "https://cdn.dreamx.studio/uploads/rb_img_003.jpg"
    ],
    "tags": ["三亚旅行", "旅行攻略", "海边"]
  }
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "note_id": "rb_note_001",
    "title": "三亚旅行攻略｜人均3000玩转三亚",
    "content": "姐妹们！这次三亚之旅真的太绝了...",
    "images": [
      {
        "index": 0,
        "url": "https://cdn.dreamx.studio/redbook/rb_note_001_img_0.jpg",
        "width": 1080,
        "height": 1440,
        "description": "三亚海滩日落全景"
      },
      {
        "index": 1,
        "url": "https://cdn.dreamx.studio/redbook/rb_note_001_img_1.jpg",
        "width": 1080,
        "height": 1440,
        "description": "海鲜大餐特写"
      },
      {
        "index": 2,
        "url": "https://cdn.dreamx.studio/redbook/rb_note_001_img_2.jpg",
        "width": 1080,
        "height": 1440,
        "description": "酒店泳池俯拍"
      }
    ],
    "tags": ["三亚旅行", "旅行攻略", "海边"],
    "parsed_at": "2025-01-15T15:00:00Z"
  }
}
```

### 12.2 AI 生成爆款文案

- **Method**: `POST`
- **Path**: `/redbook/copywriting`
- **说明**: 基于解析的图文内容，AI 生成小红书爆款风格文案（6-10句，情绪递进），含 TTS 配音方案

**请求 JSON**:

```json
{
  "note_id": "rb_note_001",
  "style": "enthusiastic",
  "sentence_count": 8,
  "voice_id": "voc_001",
  "include_emotion_tags": true,
  "target_duration_seconds": 60
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "copywriting_id": "cw_001",
    "note_id": "rb_note_001",
    "sentences": [
      {
        "index": 0,
        "text": "姐妹们，你们绝对想不到，人均3000就能在三亚玩到飞起！",
        "emotion": "excited",
        "duration_seconds": 5,
        "image_index": 0
      },
      {
        "index": 1,
        "text": "第一天直奔亚龙湾，这片海蓝得像加了滤镜一样",
        "emotion": "happy",
        "duration_seconds": 5,
        "image_index": 0
      },
      {
        "index": 2,
        "text": "日落的时候整个天空都是橘红色的，美到窒息",
        "emotion": "awe",
        "duration_seconds": 6,
        "image_index": 0
      },
      {
        "index": 3,
        "text": "晚上必须安排一顿海鲜大餐，这个皮皮虾也太肥了吧",
        "emotion": "happy",
        "duration_seconds": 5,
        "image_index": 1
      },
      {
        "index": 4,
        "text": "人均不到200，吃到扶墙出，性价比绝了",
        "emotion": "satisfied",
        "duration_seconds": 5,
        "image_index": 1
      },
      {
        "index": 5,
        "text": "酒店选的海景房，推开窗就是无边泳池",
        "emotion": "relaxed",
        "duration_seconds": 5,
        "image_index": 2
      },
      {
        "index": 6,
        "text": "躺在泳池边吹着海风，这才是生活啊",
        "emotion": "relaxed",
        "duration_seconds": 6,
        "image_index": 2
      },
      {
        "index": 7,
        "text": "姐妹们冲！这份攻略收藏起来，下次就照着玩！",
        "emotion": "excited",
        "duration_seconds": 5,
        "image_index": 2
      }
    ],
    "total_duration_seconds": 42,
    "voice_id": "voc_001",
    "created_at": "2025-01-15T15:05:00Z"
  }
}
```

### 12.3 一键生成视频

- **Method**: `POST`
- **Path**: `/redbook/generate-video`
- **说明**: 基于解析的图文和生成的文案，一键完成 TTS 配音→自动分镜→字幕时间轴→视频合成，异步任务

**请求 JSON**:

```json
{
  "note_id": "rb_note_001",
  "copywriting_id": "cw_001",
  "voice_id": "voc_001",
  "bgm_id": "bgm_001",
  "bgm_volume": 0.2,
  "style": {
    "transition": "crossfade",
    "transition_duration_ms": 500,
    "subtitle_style": "bottom_center",
    "subtitle_font_size": 28,
    "subtitle_color": "#FFFFFF",
    "ken_burns_effect": true
  },
  "output": {
    "aspect_ratio": "9:16",
    "resolution": "1080x1920",
    "fps": 30,
    "format": "mp4"
  }
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_rb_vid_001",
    "status": "processing",
    "credits_cost": 30,
    "steps": [
      {"step": "tts_generation", "status": "processing"},
      {"step": "storyboard_split", "status": "pending"},
      {"step": "subtitle_timeline", "status": "pending"},
      {"step": "video_composition", "status": "pending"}
    ],
    "estimated_seconds": 90,
    "sse_url": "/redbook/generate-video/task_rb_vid_001/stream"
  }
}
```

### 12.4 查询视频生成状态

- **Method**: `GET`
- **Path**: `/redbook/tasks/:task_id`
- **说明**: 查询小红书视频生成任务状态

**请求 JSON**: 无

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_rb_vid_001",
    "status": "completed",
    "steps": [
      {"step": "tts_generation", "status": "completed", "duration_ms": 8000},
      {"step": "storyboard_split", "status": "completed", "duration_ms": 2000},
      {"step": "subtitle_timeline", "status": "completed", "duration_ms": 1500},
      {"step": "video_composition", "status": "completed", "duration_ms": 45000}
    ],
    "result": {
      "video_url": "https://cdn.dreamx.studio/redbook/rb_note_001_video.mp4",
      "thumbnail_url": "https://cdn.dreamx.studio/redbook/rb_note_001_thumb.jpg",
      "duration_seconds": 42,
      "resolution": "1080x1920",
      "file_size_mb": 25.8
    },
    "credits_cost": 30,
    "completed_at": "2025-01-15T15:06:30Z"
  }
}
```

---

## 13. AI 聊天模块

### 13.1 发送聊天消息

- **Method**: `POST`
- **Path**: `/projects/:project_id/chat`
- **说明**: 在项目上下文中与 AI 对话，支持自然语言引导创作方向。非流式响应

**请求 JSON**:

```json
{
  "message": "帮我把第二场的氛围改成更紧张的感觉，角色表情要更夸张",
  "context": {
    "scene_id": "scn_002",
    "storyboard_ids": ["sb_003", "sb_004"]
  },
  "history_limit": 20
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "chat_id": "chat_msg_001",
    "role": "assistant",
    "content": "好的，我来帮你调整第二场的氛围。以下是我的建议：\n\n1. 场景灯光从暖色调改为冷色调，增加阴影对比\n2. 小明的表情从「困惑」改为「惊恐」，眼睛睁大\n3. 镜头从平视改为仰拍，增加压迫感\n4. 增加快速剪辑节奏，每个分镜缩短到3秒\n\n需要我直接应用这些修改吗？",
    "suggestions": [
      {
        "type": "scene_update",
        "scene_id": "scn_002",
        "changes": {
          "mood": "tense",
          "visual_style": {
            "color_tone": "cold",
            "lighting": "dramatic_shadow"
          }
        }
      },
      {
        "type": "storyboard_update",
        "storyboard_id": "sb_003",
        "changes": {
          "shot_grammar": {
            "angle": "low_angle",
            "movement": "quick_zoom"
          },
          "duration_seconds": 3
        }
      }
    ],
    "created_at": "2025-01-15T16:00:00Z"
  }
}
```

### 13.2 SSE 流式聊天

- **Method**: `POST`
- **Path**: `/projects/:project_id/chat/stream`
- **说明**: 流式 AI 对话，通过 SSE（Server-Sent Events）实时推送 token。响应为 `text/event-stream`

**请求 JSON**:

```json
{
  "message": "根据当前剧本，帮我生成一个完整的角色关系图谱",
  "context": {
    "include_script": true,
    "include_characters": true
  },
  "stream": true,
  "history_limit": 20
}
```

**响应（SSE 流）**:

```
Content-Type: text/event-stream

event: start
data: {"chat_id": "chat_msg_002", "model": "gpt-4"}

event: delta
data: {"content": "好的"}

event: delta
data: {"content": "，根据"}

event: delta
data: {"content": "你的剧本"}

event: delta
data: {"content": "，我来梳理"}

event: delta
data: {"content": "角色关系："}

event: delta
data: {"content": "\n\n## 角色关系图谱\n\n"}

event: delta
data: {"content": "**小明** ←→ **老板娘**：互助关系\n"}

event: delta
data: {"content": "**小明** ←→ **县令**：对立关系\n"}

event: suggestions
data: {
  "suggestions": [
    {
      "type": "character_update",
      "character_id": "chr_001",
      "changes": {
        "relationships": [
          {"target": "chr_002", "type": "ally", "description": "互助关系"}
        ]
      }
    }
  ]
}

event: done
data: {"chat_id": "chat_msg_002", "total_tokens": 256, "credits_cost": 2}
```

### 13.3 获取聊天历史

- **Method**: `GET`
- **Path**: `/projects/:project_id/chat/history`
- **说明**: 获取项目的 AI 聊天历史记录

**请求 JSON**: 无（Query: `?page=1&page_size=50`）

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      {
        "chat_id": "chat_msg_001",
        "role": "user",
        "content": "帮我把第二场的氛围改成更紧张的感觉",
        "created_at": "2025-01-15T16:00:00Z"
      },
      {
        "chat_id": "chat_msg_002",
        "role": "assistant",
        "content": "好的，我来帮你调整第二场的氛围...",
        "suggestions_count": 2,
        "created_at": "2025-01-15T16:00:05Z"
      }
    ],
    "total": 24,
    "page": 1,
    "page_size": 50
  }
}
```

### 13.4 应用 AI 建议

- **Method**: `POST`
- **Path**: `/projects/:project_id/chat/:chat_id/apply`
- **说明**: 将 AI 聊天中给出的建议批量应用到项目中

**请求 JSON**:

```json
{
  "suggestion_indices": [0, 1]
}
```

**响应 JSON**:

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "applied": [
      {
        "type": "scene_update",
        "scene_id": "scn_002",
        "status": "applied"
      },
      {
        "type": "storyboard_update",
        "storyboard_id": "sb_003",
        "status": "applied"
      }
    ],
    "applied_count": 2,
    "failed_count": 0
  }
}
```

---

## 附录 A：镜头语法枚举值

### 景别 (shot_type)

| 值 | 说明 |
|---|------|
| `extreme_wide_shot` | 大远景 |
| `wide_shot` | 远景/全景 |
| `medium_wide_shot` | 中远景 |
| `medium_shot` | 中景 |
| `medium_close_up` | 中近景 |
| `close_up` | 近景/特写 |
| `extreme_close_up` | 大特写 |

### 角度 (angle)

| 值 | 说明 |
|---|------|
| `eye_level` | 平视 |
| `high_angle` | 俯拍 |
| `low_angle` | 仰拍 |
| `birds_eye` | 鸟瞰 |
| `dutch_angle` | 荷兰角/倾斜 |
| `over_shoulder` | 过肩 |
| `pov` | 第一人称视角 |

### 运镜 (movement)

| 值 | 说明 |
|---|------|
| `static` | 固定镜头 |
| `pan_left` | 左摇 |
| `pan_right` | 右摇 |
| `tilt_up` | 上摇 |
| `tilt_down` | 下摇 |
| `zoom_in` | 推镜头 |
| `zoom_out` | 拉镜头 |
| `slow_zoom_in` | 缓推 |
| `slow_zoom_out` | 缓拉 |
| `quick_zoom` | 快速推拉 |
| `dolly_in` | 推轨 |
| `dolly_out` | 拉轨 |
| `tracking` | 跟踪 |
| `crane_up` | 升 |
| `crane_down` | 降 |
| `handheld` | 手持晃动 |
| `orbit` | 环绕 |

### 帧类型 (frame_type)

| 值 | 说明 |
|---|------|
| `first` | 首帧 |
| `key` | 关键帧 |
| `last` | 尾帧 |
| `panel` | 面板帧 |
| `action` | 动作帧 |

---

## 附录 B：项目创作模式枚举值

| 值 | 说明 |
|---|------|
| `single_episode` | 单集视频 |
| `multi_episodes` | 连续剧集 |
| `script_based` | 剧本模式 |
| `music_mv` | 音乐 MV |
| `redbook_note` | 小红书图文转视频 |

---

## 附录 C：异步任务通用 SSE 事件格式

所有异步任务（图像生成、视频生成、导出等）的 SSE 推送遵循统一格式：

```
event: progress
data: {"task_id": "task_xxx", "step": "generating", "progress": 45, "message": "正在生成图像..."}

event: progress
data: {"task_id": "task_xxx", "step": "generating", "progress": 90, "message": "即将完成..."}

event: completed
data: {"task_id": "task_xxx", "status": "completed", "result": {...}}

event: failed
data: {"task_id": "task_xxx", "status": "failed", "error": {"code": 50001, "message": "供应商超时"}}
```

---

## 附录 D：错误码表

| 错误码 | 说明 |
|--------|------|
| `0` | 成功 |
| `40001` | Token 无效或过期 |
| `40002` | 参数校验失败 |
| `40003` | 权限不足 |
| `40004` | 资源不存在 |
| `40005` | 积分不足 |
| `40006` | 订阅计划不支持该功能 |
| `40007` | 请求频率超限 |
| `40008` | 文件格式不支持 |
| `40009` | 文件大小超限 |
| `50001` | AI 供应商超时 |
| `50002` | AI 供应商返回错误 |
| `50003` | 任务队列已满 |
| `50004` | 视频合成失败 |
| `50005` | TTS 生成失败 |
| `50006` | 小红书笔记解析失败 |
| `50099` | 服务内部错误 |
