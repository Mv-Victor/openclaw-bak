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
