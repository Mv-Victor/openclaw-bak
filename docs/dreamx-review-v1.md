# DreamX Studio 重构指令 — 基于 Drama.Land UI 对标

## 背景
栋少审查了当前 DreamX Studio 的 UI，认为与 Drama.Land (https://drama.land/) 差异太大，不是一个合格的复刻 MVP。以下是详细的改进要求，结合栋少反馈 + G 的代码评审。

---

## 一、首页（Landing Page）重大改造

### Drama.Land 首页核心特征（从源码提取）：

1. **全屏背景视频**：`<video src="/videos/dramaland_homepage_ai_music_video_background_video.mp4">` 自动播放、循环、静音
2. **半透明遮罩层**：多层渐变叠加（`bg-black/40`），营造电影感
3. **顶部公告栏**：红色渐变条 `linear-gradient(90deg, #C0031C 0%, #FF4D4D 100%)`，白色粗体文字 "COMING SOON: ..."
4. **固定导航栏**：透明背景，左侧 Logo（SVG），右侧按钮组（语言切换、微信、Discord、Register/Sign In）
5. **Hero 标题动效**：
   - 超大字体：`text-[12vw] md:text-7xl lg:text-8xl xl:text-[110px]`
   - 斜体倾斜：`md:skew-x-[-15deg] md:-rotate-[5deg]`
   - 发光效果：`text-shadow: 0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4); filter: blur(0.3px)`
   - 文案："Play your Idea into a Music Video."（DreamX 可改为中文等价）
6. **副标题**：斜体、半透明白色、同样倾斜 "The First All-in-One AI Agent for Any Video"
7. **搜索/输入框**：
   - 毛玻璃效果：`backdrop-blur-3xl border border-white/10 bg-white/10`
   - 圆角：`rounded-[12px]`
   - 内部 textarea + 底部工具栏
   - 底部工具栏包含：**Upload Audio 按钮** + **Asset 按钮** + **模式切换器**（SINGLE/SEASON/SCRIPT/🎵MV 四个 tab，pill 样式）+ **语言选择器**（EN/中文）+ **字数计数器**（0/20,000）+ **Generate 按钮**（带魔法图标）
8. **Showcases 入口**：底部 "Showcases" 文字 + 向下箭头，hover 有动画
9. **下滑 Showcase 区域**：标题 "The Drama.Lands"，3列网格展示作品卡片
10. **Footer**：链接（About/Blog/Super Creator Program/Privacy/Terms）+ 社交图标（X/YouTube/Discord/小红书）+ 大背景图

### DreamX 当前问题：
- 没有背景视频/图片，纯色背景太单调
- Hero 标题没有动效（无倾斜、无发光）
- 模式选择器是独立的大按钮组，应该内嵌到搜索框底部工具栏
- 缺少 Upload Audio / Asset 按钮
- 缺少语言切换（EN/中文）
- 缺少字数计数器
- 缺少 Showcases 下滑区域
- 缺少 Footer

### 改造要求：
- 首页整体布局严格参考 Drama.Land
- 背景可以用渐变 + CSS 动画代替视频（暂时没有视频素材）
- Hero 标题加上倾斜 + 发光效果
- 搜索框改为毛玻璃风格，底部工具栏内嵌模式切换、语言选择、Upload、Asset、字数统计、Generate
- 加上 Showcases 区域（mock 数据）
- 加上 Footer

---

## 二、配色方案

### Drama.Land 配色（从源码提取）：
- 背景：纯黑 `#000000`（不是 DreamX 的 `#0a0a0f`）
- 主色：红色 `#C0031C`（不是紫色 `#a855f7`）
- 按钮背景：`rgba(192,3,28,0.2)` 半透明红
- 按钮 hover：`rgba(192,3,28,0.25)`
- 文字：白色为主，`white/80`、`white/60`、`white/40`、`white/20` 多级透明度
- 边框：`white/10`
- 输入框：`bg-white/5`、`bg-white/10`

### 改造要求：
- 主色从紫色改为红色系 `#C0031C`
- 背景改为纯黑
- 整体配色对齐 Drama.Land 的红黑白体系

---

## 三、项目列表页（/projects）

### Drama.Land 特征：
- 标题："Director's Desk"，副标题："Bring your stories to life..."
- 底部 Tab Bar：Home / Projects / Assets（三个 tab，图标 + 文字）
- 项目卡片有封面图、标题、最后编辑时间

### DreamX 当前问题：
- 底部 Tab Bar 用了 emoji（🏠📁🎨），太丑
- 标题是中文"导演工案"，可以保留但样式要对齐

### 改造要求：
- 底部 Tab Bar 改用 lucide 图标，样式对齐 Drama.Land
- 项目卡片样式精细化

---

## 四、画布页（Canvas）

### Drama.Land 特征：
- 节点是**逐步解锁**的：一个节点完成才导出下一个节点
- 没有右侧独立的 Detail Panel
- 节点内容直接在画布上展开/交互
- 节点类型：CHECKPOINT → STORY BIBLE → CHARACTER PACK → PLANNING CENTER → SCRIPT → SCENE DESIGN → SEGMENT DESIGN → COMPOSE

### DreamX 当前问题：
- 所有节点一次性全部显示在画布上
- 有独立的右侧 Detail Panel（这个可以保留，但要借鉴 Drama.Land 的精细格式）
- 节点没有逐步解锁的交互逻辑

### 改造要求：
- 节点改为逐步解锁：只显示已完成 + 当前活跃 + 下一个待解锁的节点
- 未解锁的节点不显示或显示为锁定状态
- 右侧 Detail Panel 可以保留，但内部格式要参考 Drama.Land 节点的精细设计
- 当前活跃节点有明显的视觉提示（发光、动画等）

---

## 五、代码质量问题（G 评审）

1. **节点组件重复代码**：SceneDesignNode、SegmentDesignNode、ComposeNode 几乎一模一样，抽取 BaseWorkflowNode
2. **canvas-layout.ts**：musicTypes/redbookTypes 用 checkpoint 占位，需要专门的节点类型
3. **detail-panel.tsx**：8 个 detail 组件全部同步 import，用 `React.lazy()` 或 `next/dynamic`
4. **Logo 组件**：缺少 `'use client'` 指令
5. **`<img>` 标签**：改用 `next/image`

---

## 六、优先级

1. **P0 - 首页重构**：配色、布局、动效、搜索框全部对齐 Drama.Land
2. **P0 - 配色方案**：全局从紫色改为红色系
3. **P1 - 画布逐步解锁**：节点交互逻辑
4. **P1 - 项目列表页**：底部 Tab Bar 和卡片样式
5. **P2 - 代码质量**：重复代码、lazy loading、img 标签等

请按优先级逐步实施，每完成一个 P0 项就汇报进度。
