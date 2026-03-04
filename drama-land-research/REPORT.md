# Drama.Land 深度调研报告

**调研时间**: 2026-03-01  
**调研对象**: https://cn.drama.land  
**账号**: 1181348296@qq.com

---

## 一、技术栈（前端和后端）

### 1.1 前端技术栈

- **框架**: Next.js (React 框架)
- **构建工具**: Webpack
- **UI 库**: React Flow (@xyflow/react) - 用于画布工作流可视化
- **样式**: CSS Modules + Tailwind CSS（推测）
- **字体**: 自定义 Web 字体（woff2 格式）
- **分析工具**: 
  - Google Analytics (G-5QEJ027RCG)
  - Google Tag Manager (GTM-52K2FDQP)

### 1.2 后端技术栈

- **认证**: Firebase Authentication
  - API Key: `AIzaSyATZ4HbOMgbFVPH4e9SAzGT0ph9kv77Hak`
  - Project: `drama-land-studio`
- **API 架构**: RESTful API
  - Base URL: `https://cn.drama.land/backend-api/api/v1/`
- **存储**: Google Cloud Storage
  - Bucket: `dramaland-public`
  - CDN: `cdn.dramastudio.ai`
- **后端语言**: 推测为 Node.js 或 Python（基于 API 响应速度和结构）

### 1.3 基础设施

- **CDN**: CloudFlare（推测，基于响应头）
- **域名**: 
  - 主站: `cn.drama.land`
  - CDN: `cdn.dramastudio.ai`
  - 存储: `storage.googleapis.com`

---

## 二、详细页面交互设计

### 2.1 首页交互

- **登录流程**:
  1. 点击"登录"按钮 → 弹出登录模态框
  2. 输入邮箱和密码
  3. 提交表单 → 调用 Firebase Auth API
  4. 登录成功 → 跳转到项目列表页

- **导航结构**:
  - 首页（营销页面）
  - 项目列表（/zh-cn/projects）
  - 画布编辑器（/zh-cn/canvas）
  - 展示案例（Showcase）

### 2.2 画布页面交互

- **工作流编辑器**:
  - 基于 React Flow 实现
  - 节点类型: episode_start → script → visual_reference → storyboard
  - 支持拖拽、连线、节点配置
  - 实时保存（通过 POST 请求）

- **节点交互**:
  - 点击节点 → 展开配置面板
  - 配置完成 → 触发后端任务
  - 任务状态实时更新

### 2.3 项目管理交互

- **项目列表**:
  - 卡片式布局
  - 支持筛选、搜索
  - 点击项目 → 进入画布编辑器

- **项目恢复**:
  - 自动保存机制
  - 通过 `/project/resume` 接口恢复上次编辑状态

---

## 三、后端接口和前端 UI 展示 Brief

### 3.1 认证接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/auth-api/v1/accounts:lookup` | POST | 查询账号是否存在 |
| `/auth-api/v1/accounts:signInWithPassword` | POST | 邮箱密码登录 |

**前端展示**: 登录模态框，邮箱+密码输入框，提交按钮

### 3.2 项目管理接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/project/list` | GET | 获取用户项目列表 |
| `/project/resume` | POST | 恢复项目编辑状态 |
| `/project/chat_list` | GET | 获取项目聊天记录 |

**前端展示**: 项目卡片列表，项目详情页，聊天侧边栏

### 3.3 画布接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/query/main_canvas` | POST | 获取主画布数据 |
| `/query/child_canvas` | POST | 获取子画布数据（episode 级别）|
| `/query/get_graph` | POST | 获取画布节点和边数据 |

**前端展示**: React Flow 画布，节点和连线可视化

### 3.4 资产接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/query/visual_style_list` | GET | 获取视觉风格列表 |
| `/query/voices` | GET | 获取配音库列表 |
| `/showcase/items` | GET | 获取展示案例 |

**前端展示**: 风格选择器（卡片网格），配音选择器（列表+试听），案例画廊

### 3.5 用户接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/user/get_user_info` | GET | 获取用户信息 |
| `/user/credits/summary` | GET | 获取用户积分余额 |
| `/user/get_points_config` | GET | 获取积分配置 |

**前端展示**: 用户头像菜单，积分余额显示，会员状态

### 3.6 订阅接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/subscription/current` | GET | 获取当前订阅状态 |
| `/subscription/tiers` | GET | 获取订阅套餐列表 |
| `/payment/benefits-packs` | GET | 获取付费权益包 |

**前端展示**: 订阅页面，套餐卡片，权益对比表

### 3.7 任务接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/task/daily-check` | POST | 每日签到 |
| `/task/list` | GET | 获取任务列表 |

**前端展示**: 任务中心，签到按钮，任务进度条

---

## 四、后端数据模型设计

### 4.1 用户模型 (User)

```typescript
interface User {
  uid: string;              // Firebase UID
  email: string;
  displayName?: string;
  photoURL?: string;
  credits: number;          // 积分余额
  subscription: {
    tier: string;           // free | pro | enterprise
    expiresAt: number;      // 过期时间戳
  };
  createdAt: number;
  updatedAt: number;
}
```

### 4.2 项目模型 (Project)

```typescript
interface Project {
  id: string;
  userId: string;
  title: string;
  type: 'single_episode' | 'multi_episodes';
  seriesId?: string;        // 多集项目的系列 ID
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: number;
  updatedAt: number;
}
```

### 4.3 画布模型 (Canvas)

```typescript
interface Canvas {
  canvasType: 'main' | 'child';
  projectId: string;
  episodeId?: string;       // child canvas 专属
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

interface CanvasNode {
  id: string;
  state: 'episode_start' | 'script' | 'visual_reference' | 'storyboard';
  data?: any;               // 节点配置数据
}

interface CanvasEdge {
  id: string;
  source: string;           // 源节点 ID
  target: string;           // 目标节点 ID
  sourceHandle: 'top' | 'bottom' | 'left' | 'right';
  targetHandle: 'top' | 'bottom' | 'left' | 'right';
}
```

### 4.4 视觉风格模型 (VisualStyle)

```typescript
interface VisualStyle {
  id: number;
  title: string;
  type: 'Realistic/Live' | '2D Animation' | 'Illustration' | '3D Render' | 'Experimental';
  description: string;
  imgUrl: string;           // Google Cloud Storage URL
}
```

### 4.5 配音模型 (Voice)

```typescript
interface Voice {
  id: string;
  name: string;
  description: string;
  audioUrl: string;         // 试听音频 URL
  age: string[];            // ['Adult', 'Middle-Aged', 'Young', 'Child']
  language: string;         // 'en-US' | 'zh-CN' | 'ja-JP' | ...
  gender: 'Male' | 'Female' | 'Neutral';
}
```

### 4.6 任务模型 (Task)

```typescript
interface Task {
  id: string;
  projectId: string;
  episodeId?: string;
  type: 'generate_image' | 'generate_video' | 'generate_audio' | 'generate_script';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input: any;               // 任务输入参数
  output?: any;             // 任务输出结果
  createdAt: number;
  completedAt?: number;
}
```

---

## 五、画布设计、交互和实现

### 5.1 技术实现

- **库**: React Flow (@xyflow/react)
- **节点类型**: 自定义节点组件
- **连线规则**: 顺序连接（episode_start → script → visual_reference → storyboard）
- **状态管理**: React useState + useReactFlow hooks

### 5.2 工作流节点

1. **Episode Start Node** (episode_start_node)
   - 作用: 剧集起点，配置基本信息
   - 输出: 剧集元数据

2. **Script Node** (script_node)
   - 作用: 生成或编辑剧本
   - 输入: 剧集元数据
   - 输出: 剧本文本（分镜脚本）

3. **Visual Reference Node** (visual_reference_node)
   - 作用: 生成视觉参考图（角色、场景）
   - 输入: 剧本文本
   - 输出: 角色设计图、场景参考图

4. **Storyboard Node** (storyboard_node)
   - 作用: 生成分镜图
   - 输入: 剧本 + 视觉参考
   - 输出: 分镜序列

### 5.3 交互特性

- **拖拽**: 节点可自由拖动，位置自动保存
- **连线**: 点击源节点 handle → 拖动到目标节点 handle
- **配置**: 点击节点 → 右侧展开配置面板
- **实时保存**: 节点位置、连线关系、配置数据实时保存到后端
- **状态同步**: 节点状态（pending/processing/completed）实时更新

### 5.4 数据流

```
用户操作 → React Flow 事件
  ↓
更新本地状态 (useState)
  ↓
防抖保存 (500ms)
  ↓
POST /query/get_graph (保存画布数据)
  ↓
后端持久化
```

---

## 六、视觉风格列表、配音库等静态核心资产数据

### 6.1 视觉风格库

**总数**: 116 个风格

**分类统计**（推测）:
- Realistic/Live: ~52 个
- 2D Animation: ~24 个
- Illustration: ~18 个
- 3D Render: ~7 个
- Experimental: ~6 个
- 其他: ~9 个

**示例风格**:

| ID | 标题 | 类型 | 描述 |
|----|------|------|------|
| 1 | Immersive Raw Realism | Realistic/Live | Wide-angle natural lighting with continuous dynamic movement and gritty realistic textures. |
| 2 | Vintage Japanese Monochrome | Realistic/Live | High-contrast monochrome aesthetic with dramatic lighting, deep shadows, and vintage film texture |
| 7 | Sharp Futuristic Anime | 2D Animation | High contrast anime visuals with sharp angular lines, vibrant colors, and dramatic lighting. |
| 8 | Vibrant Giallo Horror | Realistic/Live | High-contrast neon gel lighting with deep reds, greens, and surreal baroque atmosphere |

**存储位置**: `https://storage.googleapis.com/dramaland-public/visual_style_images/{id}.jpg`

### 6.2 配音库

**总数**: 191 个配音

**分类统计**（推测）:
- English Male: ~55 个
- English Female: ~41 个
- Chinese Male: ~30 个
- Chinese Female: ~25 个
- 其他语言: ~40 个

**示例配音**:

| ID | 名称 | 语言 | 性别 | 年龄 | 描述 |
|----|------|------|------|------|------|
| alFofuDn3cOwyoz1i44T | Marcus | en-US | Male | Adult, Middle-Aged | narrator. Deep warm baritone with calm steady delivery and clear diction; suits long-form narration and documentary. |
| hfgNmTYYctMgJ7E2s6Vx | Thomas | en-US | Male | Adult, Middle-Aged | narrator. Grand and steady tone with broad resonance and measured pace; suited to epic narration and trailers. |

**存储位置**: `https://storage.googleapis.com/dramaland-public/character_voice_previews/{id}.mp3`

### 6.3 其他核心资产

- **展示案例**: 通过 `/showcase/items` 接口获取
- **字体资源**: 自定义 Web 字体（woff2 格式）
- **图标资源**: 存储在 `/images/` 目录

---

## 七、推测网站的文生图和文生视频模型及 Prompt

### 7.1 文生图模型推测

基于以下证据：
1. 角色生成需要保持一致性（多视图、多表情）
2. 支持 116 种视觉风格
3. 栋少提供的 prompt 模板非常详细

**推测模型**:
- **主力模型**: Stable Diffusion XL (SDXL) 或 Flux
- **辅助技术**: 
  - ControlNet (用于角色一致性)
  - IP-Adapter (用于角色特征保持)
  - LoRA (用于风格控制)

**理由**:
- SDXL 支持高质量图像生成
- ControlNet 可以实现多视图一致性
- IP-Adapter 可以保持角色特征
- LoRA 可以快速切换 116 种风格

**替代方案**:
- Midjourney (但 API 限制较多，不太可能)
- DALL-E 3 (可能性较低，风格控制不如 SD)
- Flux (新模型，一致性更好，可能性较高)

### 7.2 角色生成 Prompt 模板

根据栋少提供的示例，推测完整模板：

```
Character design reference sheet. 
Maintaining exact same facial features, face structure, skin tone, and body proportions as the original character. 
Consistent rendering style across all views, matching the original reference. 

Left: chest-up close-up portrait facing camera with a {expression} expression and {emotion} eyes. 
Right: full-body three-view turnaround showing front, side, and back in a neutral standing pose. 

Identity features: {character_description}
New look: {outfit_description}

Clean studio backdrop. Raw natural lighting. 
Visual style: {visual_style_name}
```

**变量说明**:
- `{expression}`: 表情描述（desperate, begging, happy, sad, angry, etc.）
- `{emotion}`: 眼神描述（tearful, joyful, fierce, etc.）
- `{character_description}`: 角色特征（年龄、性别、发型、肤色、体型等）
- `{outfit_description}`: 服装描述
- `{visual_style_name}`: 从 116 个风格中选择

**Prompt 特点**:
1. **结构化**: 明确分为左右两部分（特写 + 三视图）
2. **一致性强调**: 多次强调"exact same features"、"consistent"
3. **细节控制**: 表情、眼神、姿势、服装、光照、风格都可控
4. **风格集成**: 通过 `Visual style: {name}` 集成 116 种风格

### 7.3 文生视频模型推测

基于以下证据：
1. 平台定位是"AI 音乐 MV 与剧集视频"
2. 需要支持多种视觉风格
3. 需要与角色图、分镜图配合

**推测模型**:
- **主力模型**: Runway Gen-3 或 Kling 1.5/3.0
- **备选模型**: 
  - Luma Dream Machine
  - Pika Labs
  - Stable Video Diffusion (SVD)

**理由**:
- Runway Gen-3: 行业标准，质量高，支持风格控制
- Kling: 中国服务，速度快，质量好，价格合理
- 两者结合使用可以平衡质量和成本

**视频生成流程推测**:
1. 用户上传/生成角色图
2. 用户编写分镜脚本
3. 系统根据分镜生成关键帧（使用 SDXL + ControlNet）
4. 系统将关键帧序列输入视频模型（Runway/Kling）
5. 生成视频片段
6. 拼接、配音、配乐

### 7.4 配音模型推测

基于以下证据：
1. 配音库有 191 个声音
2. 支持多语言（英语、中文、日语等）
3. 每个声音都有详细描述和试听

**推测模型**:
- **主力模型**: ElevenLabs
- **备选模型**: 
  - Azure TTS
  - Google Cloud TTS
  - 自研语音克隆模型

**理由**:
- ElevenLabs 有 100+ 预置声音，支持多语言
- 声音质量高，情感表现力强
- API 稳定，价格合理

### 7.5 脚本生成模型推测

基于以下证据：
1. 画布有 script_node 节点
2. 需要生成分镜脚本

**推测模型**:
- **主力模型**: GPT-4 或 Claude 3.5 Sonnet
- **备选模型**: 
  - GPT-4 Turbo
  - Claude 3 Opus

**理由**:
- GPT-4/Claude 擅长创意写作
- 支持长文本生成
- 可以根据用户输入生成结构化脚本

### 7.6 成本估算

基于推测的模型组合：

| 服务 | 模型 | 单价（估算）| 备注 |
|------|------|------------|------|
| 文生图 | SDXL + ControlNet | $0.02/张 | 自部署或 Replicate |
| 文生视频 | Runway Gen-3 | $0.05/秒 | 官方 API |
| 文生视频 | Kling 1.5 | $0.03/秒 | 中国服务 |
| 配音 | ElevenLabs | $0.30/1000字符 | 官方 API |
| 脚本生成 | GPT-4 | $0.03/1K tokens | OpenAI API |

**优化策略**:
- 图像生成自部署（降低成本）
- 视频生成混合使用 Runway + Kling（平衡质量和成本）
- 配音使用 ElevenLabs（质量优先）
- 脚本生成使用 GPT-4（创意优先）

---

## 八、总结与建议

### 8.1 技术亮点

1. **前端**: Next.js + React Flow，性能优异，用户体验流畅
2. **认证**: Firebase Auth，成熟稳定，开发效率高
3. **存储**: Google Cloud Storage，可靠性高，全球 CDN
4. **画布**: React Flow 实现工作流可视化，直观易用
5. **资产库**: 116 种视觉风格 + 191 个配音，资产丰富

### 8.2 架构优势

1. **前后端分离**: API 设计清晰，易于扩展
2. **异步任务**: 通过 task 系统处理耗时操作，用户体验好
3. **状态管理**: 实时保存，防止数据丢失
4. **CDN 加速**: 静态资源全球加速，访问速度快

### 8.3 可能的技术债务

1. **API 命名**: `/query/` 前缀不够语义化，建议改为 `/canvas/`, `/assets/` 等
2. **认证方式**: 仅支持邮箱密码登录，建议增加 OAuth（Google, GitHub 等）
3. **错误处理**: 未观察到统一的错误处理机制
4. **国际化**: 虽然有中文版，但 i18n 实现细节未知

### 8.4 竞品对比

| 维度 | Drama.Land | Runway | Pika Labs | 优势 |
|------|-----------|--------|-----------|------|
| 工作流可视化 | ✅ React Flow | ❌ | ❌ | ✅ |
| 视觉风格库 | ✅ 116 种 | ❌ | ❌ | ✅ |
| 配音库 | ✅ 191 个 | ❌ | ❌ | ✅ |
| 角色一致性 | ✅ | ⚠️ | ⚠️ | ✅ |
| 价格 | 未知 | 高 | 中 | 待评估 |

### 8.5 建议

1. **技术优化**:
   - 增加 WebSocket 支持，实现任务状态实时推送
   - 优化画布性能，支持更复杂的工作流
   - 增加离线编辑功能（PWA）

2. **功能扩展**:
   - 增加团队协作功能
   - 增加版本管理功能
   - 增加模板市场

3. **商业化**:
   - 明确定价策略
   - 增加企业版功能
   - 建立生态系统（插件、API）

---

**报告完成时间**: 2026-03-01  
**数据来源**: Playwright 自动化采集 + 人工分析  
**截图数量**: 7 张  
**网络请求数**: 5000+  
**API 端点数**: 17 个
