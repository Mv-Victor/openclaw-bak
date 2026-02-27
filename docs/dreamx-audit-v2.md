# DreamX Studio 第二轮审核报告

**审核时间**: 2026-02-27 16:00
**审核人**: G
**对标产品**: Drama.Land (https://drama.land/)

---

## 一、栋少反馈汇总

1. **API 对接层设计** - 仿照 Drama.Land 设计接口规范，先 mock 数据但要按接口模式返回，沉淀接口文档
2. **档案馆画廊** - 瀑布流布局展示 AI 生成的图片/视频封面
3. **画布 UI 和配色** - 与 Drama.Land 不一致，右侧细节栏目要借鉴 Drama.Land 的精细格式设计
4. **首页模式切换** - 搜索框下的剧集模式切换期望一横排，不要换行
5. **导演工案底部 Tab** - 太难看，要仿照 Drama.Land 设计（首页左侧有 SVG 代表首页、存档、资产）

---

## 二、当前状态 vs Drama.Land 差异分析

### 2.1 首页搜索框模式切换

**当前实现**:
```tsx
<div className="flex-shrink-0 flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-0.5 overflow-x-auto">
  {modeTabs.map((tab) => (
    <button className="flex-shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-all whitespace-nowrap">
      {tab.short}  // SINGLE / SEASON / SCRIPT / 🎵MV / 📕小红书
    </button>
  ))}
</div>
```

**Drama.Land 实现** (从源码提取):
```tsx
<div className="hidden md:flex items-center p-1 bg-white/5 rounded-lg border border-white/10 h-9 box-border shrink-0">
  <button className="h-7 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center whitespace-nowrap text-white/40 hover:text-white/60">SINGLE</button>
  <button className="h-7 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center whitespace-nowrap text-white/40 hover:text-white/60">SEASON</button>
  <button className="h-7 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center whitespace-nowrap text-white/40 hover:text-white/60">SCRIPT</button>
  <button className="h-7 px-3 text-xs font-bold rounded-md transition-all flex items-center justify-center whitespace-nowrap bg-white/10 text-white">🎵MV</button>
</div>
```

**差异点**:
- ✅ 已实现一横排不换行（`flex-shrink-0` + `whitespace-nowrap` + `overflow-x-auto`）
- ⚠️ 但 Drama.Land 在移动端是隐藏模式切换器的（`hidden md:flex`），DreamX 没有做响应式隐藏
- ⚠️ Drama.Land 的选中态是 `bg-white/10 text-white`，DreamX 用的是 `bg-white/15`

**结论**: 基本符合，可以接受。

---

### 2.2 导演工案底部 Tab Bar

**当前实现**:
```tsx
<nav className="fixed bottom-0 left-0 right-0 border-t border-white/10 px-6 py-2 flex justify-around bg-black/80 backdrop-blur-xl z-50">
  {[
    { label: '首页', icon: Home, active: true },
    { label: '存档', icon: FolderOpen, active: false },
    { label: '资产', icon: Palette, active: false },
  ].map((tab) => (
    <button className="flex flex-col items-center gap-1 px-6 py-1 cursor-pointer group">
      <div className="p-2 rounded-xl transition-all" style={{ background: tab.active ? 'rgba(192,3,28,0.20)' : 'transparent' }}>
        <Icon className="h-5 w-5 transition-colors" style={{ color: tab.active ? '#FF4D4D' : 'rgba(255,255,255,0.40)' }} />
      </div>
      <span className="text-[11px] font-medium transition-colors" style={{ color: tab.active ? '#FF4D4D' : 'rgba(255,255,255,0.40)' }}>
        {tab.label}
      </span>
    </button>
  ))}
</nav>
```

**Drama.Land 实现** (从源码提取):
```tsx
<footer class="relative z-20 bg-black text-white w-full">
  <div class="w-full px-[20px] min-[600px]:px-[64px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-medium text-white/40 pb-2">
    <div>PawLogic Limited</div>
    <div class="flex items-center gap-4">
      <button class="inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white/80 text-xs" title="Switch to Mainland China">
        <span class="text-sm">🌍</span>
        <span>Global</span>
        <svg class="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
        </svg>
      </button>
      <span>© 2026 All rights reserved</span>
    </div>
  </div>
</footer>
```

**差异点**:
- ❌ Drama.Land 的底部是 **Footer**（版权信息 + 语言切换），不是 Tab Bar
- ❌ Drama.Land 的 **导航在顶部**（Logo + 语言 + Register/Sign In），不是在底部
- ❌ DreamX 的底部 Tab Bar 是移动端风格（类似 App），但 Drama.Land 是纯 Web 风格

**栋少说的"首页左侧有 svg 代表首页、存档、资产"** - 这个在 Drama.Land 源码里没找到，可能是指 Dashboard 页面的侧边栏导航？

**结论**: 需要重新理解栋少的期望。可能是想要 Drama.Land Dashboard 的侧边栏导航风格？

---

### 2.3 画布右侧细节栏目

**Drama.Land 节点详情面板特征** (从源码提取的文案和结构):

**CheckPoint 节点详情**:
```
CHECKPOINT
- 语言：中文 / English
- 评级：PG / PG-13 / R
- 画面比例：9:16 / 16:9 / 1:1
- 剧集数量：[slider 1-12]
- 单集时长：[slider 15-300s]
- 视觉风格：[网格展示 4 个风格卡片，每个卡片有封面图 + 标题 + type badge]
- 创意描述：[textarea]
- 按钮：[确认并继续]
```

**CharacterPack 节点详情**:
```
CHARACTER PACK
- 顶部："{count} 个角色" + "添加角色"按钮
- 角色卡片列表：
  - 左侧：头像（14x14 圆角，支持图片/emoji 占位）
  - 右侧：
    - 第一行：角色名 + 等级 badge（主角/配角/龙套）
    - 第二行：职业
    - 第三行：性别 · 年龄 · 身高
  - 简介：brief_bio
  - 配音：[Volume2 图标] 配音名称 + "切换"按钮
- 底部：[确认角色集]
```

**Script 节点详情**:
```
SCRIPT
- 顶部：剧本标题 + "编辑"按钮
- 场景卡片列表：
  - 顶部：Badge "场景 01" + 场景标题
  - 描述：场景描述文字
  - 对话：[缩进 + 左侧紫色边框] 多行对话
  - VO 旁白：[灰色背景 + 麦克风图标 + 斜体]
- 底部：[确认剧本]
```

**SceneDesign 节点详情**:
```
SCENE DESIGN
- 说明文字："AI 为每个场景生成视觉参考图"
- 场景卡片列表：
  - 封面图区域（aspect-video，生成中显示 loading 遮罩 + 转圈动画）
  - 底部：场景编号 + 场景标题 + 状态 badge（完成/生成中/待生成）
- 底部按钮：[重新生成] [确认场景]
```

**SegmentDesign 节点详情**:
```
SEGMENT DESIGN
- 顶部："{count} 个分镜" + "总时长：XXs"
- 分镜卡片列表（横向布局）：
  - 左侧：缩略图（20x14 圆角，完成显示播放按钮，生成中显示转圈，待生成显示"—"）+ 时长标签（右下角）
  - 右侧：
    - 描述：分镜描述（最多 2 行截断）
    - Badge 行：镜头类型 + 运镜方式 + 状态 badge
- 底部按钮：[重新生成] [确认分镜]
```

**Compose 节点详情**:
```
COMPOSE
- 说明文字："将所有分镜合成为最终视频"
- 预览区域：9:16 比例预览框（显示播放图标 + "预览区域"文字）
- 导出设置卡片：
  - 分辨率：Badge "1080p"
  - 格式：Badge "MP4"
  - 字幕：Badge "内嵌"
  - 预计积分："5"
- 底部按钮：[剪映工程] [导出视频]
```

---

### DreamX 当前详情面板对比

**问题点**:
1. ❌ 详情面板没有统一的视觉风格（Drama.Land 所有卡片都是 `rounded-lg border border-white/10 bg-white/5`）
2. ❌ 没有状态 badge 系统（Drama.Land 用不同颜色 badge 表示 completed/generating/pending）
3. ❌ 没有 loading 动画（Drama.Land 生成中显示转圈 + 遮罩）
4. ❌ 按钮样式不统一（Drama.Land 都是双按钮布局：[重新生成] [确认]）
5. ❌ 卡片内部排版不够精细（Drama.Land 有严格的间距、字体大小、颜色层级）

---

## 三、API 对接层设计规范

### 3.1 参考 Drama.Land 的 API 设计模式

从 Drama.Land 源码中提取的 API 调用模式：

**项目相关**:
```
GET  /api/projects              - 获取项目列表
POST /api/projects              - 创建新项目
GET  /api/projects/:id          - 获取项目详情
PUT  /api/projects/:id          - 更新项目
DELETE /api/projects/:id        - 删除项目
```

**画布节点相关**:
```
POST /api/nodes/:nodeId/generate    - 生成节点内容
PUT  /api/nodes/:nodeId/confirm     - 确认节点
PUT  /api/nodes/:nodeId/revert      - 回退到上一节点
GET  /api/nodes/:nodeId/history     - 获取节点历史
```

**角色相关**:
```
GET    /api/characters              - 获取角色列表
POST   /api/characters              - 创建角色
PUT    /api/characters/:id          - 更新角色
DELETE /api/characters/:id          - 删除角色
POST   /api/characters/generate     - AI 生成角色
POST   /api/characters/:id/switch   - 切换角色配音
```

**场景/分镜相关**:
```
POST /api/scenes/generate        - AI 生成场景
POST /api/segments/generate      - AI 生成分镜
POST /api/segments/:id/video     - 生成视频
PUT  /api/segments/:id/edit      - 编辑分镜
```

**音乐相关**:
```
POST /api/music/generate         - AI 生成音乐
POST /api/music/remix            - Remix 音乐
POST /api/music/upload           - 上传音频
POST /api/music/trim             - 裁剪音频
```

**合成导出**:
```
POST /api/compose                - 合成视频
GET  /api/compose/:id/status     - 查询合成状态
GET  /api/compose/:id/download   - 下载视频
```

---

### 3.2 DreamX API 设计规范（建议）

**基础响应格式**:
```typescript
interface ApiResponse<T> {
  code: number;           // 0=成功，非 0=错误码
  message: string;        // 错误信息
  data: T;                // 数据
}

interface Pagination<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

**错误码规范**:
```typescript
enum ErrorCode {
  SUCCESS = 0,
  VALIDATION_ERROR = 1001,
  UNAUTHORIZED = 1002,
  FORBIDDEN = 1003,
  NOT_FOUND = 1004,
  RATE_LIMIT = 1005,
  INSUFFICIENT_CREDITS = 1006,
  GENERATION_FAILED = 2001,
  TIMEOUT = 2002,
}
```

**完整 API 文档** - 见 `/root/.openclaw/workspace-g/docs/dreamx-api-spec.md`（待啾啾创建）

---

## 四、待办任务清单

### P0 - 画布详情面板精细化改造
- [ ] 统一卡片样式：`rounded-lg border border-white/10 bg-white/5`
- [ ] 实现状态 badge 系统（completed/generating/pending）
- [ ] 添加 loading 动画（转圈 + 遮罩）
- [ ] 双按钮布局：[重新生成] [确认]
- [ ] 严格按照 Drama.Land 的排版间距、字体大小、颜色层级

### P0 - API 对接层设计
- [ ] 创建 `src/lib/api/` 目录
- [ ] 实现 `apiClient.ts`（基础请求封装）
- [ ] 实现各模块 API：`projects.ts`, `nodes.ts`, `characters.ts`, `scenes.ts`, `segments.ts`, `music.ts`, `compose.ts`
- [ ] 创建 `src/types/api.ts` 定义所有接口类型
- [ ] Mock 数据按 API 格式返回
- [ ] 输出 API 文档 `/root/.openclaw/workspace-g/docs/dreamx-api-spec.md`

### P1 - 档案馆画廊
- [ ] 创建 `/assets` 页面
- [ ] 瀑布流布局（masonry layout）
- [ ] 支持图片/视频封面
- [ ] 支持筛选（按项目、按类型、按时间）
- [ ] 支持点击查看大图/播放视频

### P1 - 底部 Tab Bar 重新设计
- [ ] 理解栋少说的"首页左侧有 svg 代表首页、存档、资产"具体指什么
- [ ] 可能需要改成侧边栏导航而不是底部 Tab

### P2 - 首页细节优化
- [ ] 响应式处理：移动端隐藏模式切换器
- [ ] 选中态颜色调整为 `bg-white/10`

---

## 五、审核循环机制

**流程**:
```
G 审核 → 输出差异报告 → 派工给啾啾 → 啾啾修改 → G 再次审核 → ...
```

**每次审核输出**:
1. 差异点列表（带代码对比）
2. 优先级标注（P0/P1/P2）
3. 验收标准（怎样算通过）

**验收标准**:
- P0 项必须 100% 符合 Drama.Land
- P1 项功能完整，样式 80% 相似
- P2 项可以后续迭代

---

## 六、下一步行动

1. **啾啾优先完成 P0 任务**（画布详情面板 + API 层）
2. **输出 API 文档** 给栋少校验
3. **G 进行第二轮审核**，重点检查详情面板的视觉还原度
4. **循环迭代** 直到 P0 项全部达标
