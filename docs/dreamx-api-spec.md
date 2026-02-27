# DreamX Studio API 规范文档

基于 Drama.Land 接口规范设计，结合 DreamX 业务需求调整。

---

## 基础规范

### 响应格式

所有 API 返回统一格式：

```typescript
interface ApiResponse<T> {
  code: number;           // 0=成功，非 0=错误码
  message: string;        // 成功时"success"，失败时错误描述
  data: T;                // 业务数据
}
```

### 错误码定义

```typescript
enum ErrorCode {
  SUCCESS = 0,                    // 请求成功
  VALIDATION_ERROR = 1001,        // 参数校验失败
  UNAUTHORIZED = 1002,            // 未授权/登录过期
  FORBIDDEN = 1003,               // 权限不足
  NOT_FOUND = 1004,               // 资源不存在
  RATE_LIMITED = 1005,            // 请求过于频繁
  INSUFFICIENT_CREDITS = 1006,    // 积分不足
  GENERATION_FAILED = 2001,       // AI 生成失败
  TIMEOUT = 2002,                 // 请求超时
  SERVER_ERROR = 5000,            // 服务器内部错误
}
```

### 认证方式

```
Authorization: Bearer <jwt_token>
```

---

## 接口列表

### 用户模块

#### GET `/api/v1/user/info`
获取当前用户信息

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "uid": "user_001",
    "nickname": "栋少",
    "avatar": "https://cos.dreamx.studio/avatars/user_001.jpg",
    "email": "user@example.com",
    "created_at": 1709020800000
  }
}
```

#### GET `/api/v1/user/credits`
获取用户积分汇总

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total_credits": 4825,
    "used_credits": 1175,
    "available_credits": 3650,
    "subscription_tier": "STARTER"
  }
}
```

#### GET `/api/v1/user/points-config`
获取积分配置规则

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "daily_check_in": 10,
    "share_invite": 50,
    "complete_project": 100,
    "costs": {
      "chat_message": 1,
      "story_bible_generate": 20,
      "character_pack_generate": 50,
      "planning_center_generate": 15,
      "script_generate": 10,
      "scene_design_generate": 50,
      "segment_design_generate": 60,
      "video_generate_single": 300,
      "music_generate": 50,
      "compose_export": 5
    }
  }
}
```

---

### 项目模块

#### GET `/api/v1/projects`
获取项目列表

**Query Params：**
- `page` (number, optional): 页码，默认 1
- `page_size` (number, optional): 每页数量，默认 20
- `project_type` (string, optional): 项目类型过滤

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 3,
    "projects": [
      {
        "project_id": "p-001",
        "project_type": "multi_episodes",
        "series_id": "s-001",
        "series_title": "共生劫：白骨夫人的生死局",
        "drama_cover": "https://cos.dreamx.studio/covers/p-001.jpg",
        "updated_at": 1709020800000,
        "episode_count": 4,
        "current_state": "check_point"
      }
    ]
  }
}
```

#### POST `/api/v1/projects`
创建新项目

**请求体：**
```json
{
  "project_type": "multi_episodes",
  "idea_text": "千年白骨精为求解脱轮回之苦...",
  "language": "zh-CN",
  "extra": {
    "episode_count": 4,
    "episode_duration": 60,
    "camera_frame_ratio": "9:16"
  }
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "project_id": "p-002",
    "series_id": "s-002",
    "series_title": "千年白骨精为求解脱轮回之苦",
    "current_state": "check_point"
  }
}
```

#### GET `/api/v1/projects/{projectId}`
获取项目详情

**响应：** 同项目对象

#### POST `/api/v1/projects/{projectId}/resume`
恢复/进入项目

**请求体：**
```json
{
  "series_id": "s-001"
}
```

**响应：** 项目详情对象

---

### 画布模块

#### POST `/api/v1/canvas/main`
获取画布核心数据（节点 + 状态）

**请求体：**
```json
{
  "project_id": "p-001",
  "series_id": "s-001",
  "event": "query_project_state"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "series_id": "s-001",
    "current_state": "script",
    "nodes": [
      {
        "id": "node-0",
        "type": "entry",
        "label": "开始",
        "description": "一切从这里开始",
        "status": "completed",
        "locked": false
      },
      {
        "id": "node-1",
        "type": "checkpoint",
        "label": "基础信息",
        "description": "语言、风格、比例",
        "status": "completed",
        "locked": false
      },
      {
        "id": "node-2",
        "type": "characterpack",
        "label": "角色集",
        "description": "AI 生成角色形象与配音",
        "status": "active",
        "locked": false
      },
      {
        "id": "node-3",
        "type": "script",
        "label": "剧本撰写",
        "description": "AI 生成分场剧本",
        "status": "pending",
        "locked": true
      }
    ],
    "edges": [
      { "source": "node-0", "target": "node-1" },
      { "source": "node-1", "target": "node-2" },
      { "source": "node-2", "target": "node-3" }
    ]
  }
}
```

#### POST `/api/v1/nodes/{nodeId}/status`
更新节点状态

**请求体：**
```json
{
  "project_id": "p-001",
  "series_id": "s-001",
  "status": "completed"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "current_state": "script"
  }
}
```

---

### 资源查询模块

#### GET `/api/v1/resources/visual-styles`
获取视觉风格列表

**Query Params：**
- `type` (string, optional): 风格类型过滤

**响应：**
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
      "img_url": "https://cos.dreamx.studio/styles/1.jpg"
    }
  ]
}
```

#### GET `/api/v1/resources/voices`
获取配音角色列表

**Query Params：**
- `language` (string, optional): zh-CN | en-US
- `gender` (string, optional): Male | Female

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "voice_list": [
      {
        "id": "v-zh-001",
        "name": "霸道总裁",
        "description": "低沉磁性男声，气场强大",
        "audio_url": "https://cos.dreamx.studio/voices/v-zh-001.mp3",
        "age": ["Adult"],
        "language": "zh-CN",
        "gender": "Male"
      }
    ]
  }
}
```

---

### AI 生成模块

#### POST `/api/v1/ai/story-bible`
生成故事圣经

**请求体：**
```json
{
  "project_id": "p-001",
  "series_id": "s-001",
  "idea_text": "千年白骨精...",
  "options": {
    "count": 3,
    "genre": "奇幻/爱情"
  }
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "options": [
      {
        "id": 1,
        "title": "命运交织",
        "genre": "奇幻 / 爱情",
        "logline": "千年白骨精为求解脱轮回之苦...",
        "synopsis": "白骨夫人本是千年妖族女王..."
      }
    ]
  }
}
```

#### POST `/api/v1/ai/characters`
生成角色集

**请求体：**
```json
{
  "project_id": "p-001",
  "series_id": "s-001",
  "story_bible_id": 1
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "characters": [
      {
        "id": "c-001",
        "name": "白骨夫人",
        "occupation": "妖族女王",
        "level": "major",
        "gender": "女",
        "age": "外表 25",
        "height": "170cm",
        "brief_bio": "千年白骨精修炼成人形...",
        "appearance": "银白长发，冰蓝色瞳孔...",
        "image_url": "https://cos.dreamx.studio/characters/c-001.jpg",
        "voice_id": "v-zh-002"
      }
    ]
  }
}
```

#### POST `/api/v1/ai/script`
生成剧本

**请求体：**
```json
{
  "project_id": "p-001",
  "series_id": "s-001",
  "episode_id": "e-001"
}
```

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "episode_id": "e-001",
    "scenes": [
      {
        "scene_number": 1,
        "header": "外景 - 荒山古道 - 黄昏",
        "description": "夕阳西下，一条蜿蜒的古道穿过荒凉的山谷。",
        "dialogue": [
          "悟空：师父，前方妖气甚重，我们还是绕道吧。",
          "唐僧：阿弥陀佛，既是前路，便无退路。"
        ],
        "vo_narration": "命运的齿轮，在这一刻开始转动。"
      }
    ]
  }
}
```

---

### 档案馆模块

#### GET `/api/v1/showcases`
获取档案馆作品列表

**Query Params：**
- `page` (number, optional): 页码
- `page_size` (number, optional): 每页数量
- `type` (string, optional): all | video | image
- `project_type` (string, optional): 项目类型过滤

**响应：**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "items": [
      {
        "id": "show-001",
        "type": "video",
        "title": "共生劫：白骨夫人的生死局",
        "cover_url": "https://cos.dreamx.studio/showcases/show-001.jpg",
        "video_url": "https://cos.dreamx.studio/showcases/show-001.mp4",
        "duration": 58,
        "views": 12300,
        "created_at": 1709020800000,
        "project_type": "multi_episodes"
      }
    ]
  }
}
```

---

## 类型定义

详见 `src/types/api.ts`

### 核心类型

- `ProjectType`: 项目类型（single_episode / multi_episodes / script_based / music_mv / redbook_note）
- `NodeState`: 节点状态（check_point / story_bible / character_pack / planning_center / script / scene_design / segment_design / compose）
- `Project`: 项目对象
- `CanvasNode`: 画布节点
- `Character`: 角色对象
- `Scene`: 场景对象
- `Episode`: 剧集对象
- `VisualStyle`: 视觉风格
- `Voice`: 配音角色
- `ShowcaseItem`: 档案馆作品

---

## Mock 模式

开发环境使用 Mock 数据，通过 `MOCK_MODE` 开关控制：

```typescript
// src/lib/api/client.ts
const MOCK_MODE = true;  // 开发时为 true，生产环境改为 false
```

Mock 数据位于各 API 模块文件中，返回格式与真实 API 一致。

---

## 错误处理

```typescript
try {
  const result = await getProjects();
  if (result.code === 0) {
    // 成功处理
  } else {
    // 错误处理
    console.error(result.message);
  }
} catch (error) {
  if (error instanceof ApiClientError) {
    // API 错误
    console.error(`API Error ${error.code}: ${error.message}`);
  } else {
    // 网络错误等
    console.error('Unknown error:', error);
  }
}
```

---

## 待补充接口

以下接口后续补充：

- [ ] `/api/v1/ai/scene-design` - 场景设计生成
- [ ] `/api/v1/ai/segment-design` - 分镜设计生成
- [ ] `/api/v1/ai/music` - 音乐生成
- [ ] `/api/v1/compose` - 视频合成导出
- [ ] `/api/v1/subscription/tiers` - 订阅档位
- [ ] `/api/v1/tasks` - 任务列表
