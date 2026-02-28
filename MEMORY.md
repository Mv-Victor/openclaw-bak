# MEMORY.md - 啾啾长期记忆

## 栋少信息
- 快手电商 Java 架构师
- 副业：AI 剪辑、AI 漫剧
- 时区：GMT+8
- 沟通渠道：飞书 DM + 群聊

## 多 Agent 协作系统

### 架构
- 单 Gateway + 双 Agent：G（总指挥/军师/智库）+ 啾啾（工程师/创作官）
- 本质是文章里 5 角色合 2：G 承担总指挥+军师+智库，啾啾承担工程师+创作官
- 飞书双账号：G(g) + 啾啾(default)
- G workspace: `/root/.openclaw/workspace-g`
- 啾啾 workspace: `/root/.openclaw/workspace`

### 配置层硬约束（平台级）
- bindings: channel+accountId → agentId 精准路由
- dmScope: per-account-channel-peer（三维会话隔离）
- requireMention: G=false（全局监听），啾啾=true（@触发）
- groupPolicy: open
- agentToAgent.maxPingPongTurns: 0（压制无意义 ping-pong）
- ackReactionScope: group-mentions

### 规则层行为约束（workspace 级）
- SOUL.md: 人格、语气、职责、质量底线
- AGENTS.md: 运行手册、协作流程、记忆规范
- ROLE-COLLAB-RULES.md: 角色专属协作边界
- TEAM-RULEBOOK.md: 团队统一硬规则（双 Agent 共享）
- TEAM-DIRECTORY.md: 角色与真实 ID 映射

### 记忆分层策略
1. 短期流水 (memory/YYYY-MM-DD.md): 当天任务过程
2. 长期记忆 (MEMORY.md): 稳定偏好、长期决策
3. 群聊记忆 (GROUP_MEMORY.md): 群可复用且安全的信息
4. 冷归档 (memory/archive/): 老数据归档，防上下文膨胀
5. 检索: memory_search → memory_get，按需加载

### 持久化机制
- 双 workspace 独立 Git 仓库
- 所有配置、规则、记忆文件均 Git 版本控制
- 配置变更后 commit + push

## Git 备份
- 啾啾 workspace: `/root/.openclaw/workspace` (独立 git repo)
- G workspace: `/root/.openclaw/workspace-g` (独立 git repo)

## 硬规则

### PoloAI API 调用限制（2026-02-26 栋少要求）
- **每次调用必须是能完成任务进度的，不做无意义的测试调用**
- 文生图/文生视频 API 每次调用都花费不菲
- 禁止：用 "test" prompt 测试模型可用性（用 /v1/models 接口代替）
- 禁止：批量遍历模型名称试错
- 允许：确认模型名称正确后，直接用正式 prompt 提交正式任务

## 硬规则

### PoloAI API 调用限制（2026-02-26 栋少要求）
- **每次调用必须是能完成任务进度的，不做无意义的测试调用**
- 文生图/文生视频 API 每次调用都花费不菲
- 禁止：用 "test" prompt 测试模型可用性（用 /v1/models 接口代替）
- 禁止：批量遍历模型名称试错
- 允许：确认模型名称正确后，直接用正式 prompt 提交正式任务

## 技术经验沉淀

### 服务器
- 3.6G 内存，注意 OOM
- 启动重服务前先 `echo 3 > /proc/sys/vm/drop_caches`

### DreamX Studio 组件库模式（2026-02-27）
- **DetailSection**: 详情面板通用 Section 组件（图标 + label）
- **StatusBadge**: 状态 Badge（completed/generating/pending）
- **Button**: 6 variants（default/secondary/ghost/outline/danger）
- **Badge**: 4 variants（default/secondary/outline/danger）
- 使用模式：所有详情面板 100% 使用 DetailSection，Button/Badge 使用率 >80%

### DreamX Studio 数据资产（2026-02-28）
- **视觉风格库**: 107 种（Realistic/Live 52, 2D Animation 24, Illustration 18, 3D Render 7, Experimental 6）
- **配音库**: 151 个（English Male 55, English Female 41, Chinese Male 30, Chinese Female 25）
- 数据来源：参考 Drama.Land 公开资源
- 存储位置：`src/mock/visual-styles.ts`, `src/mock/voices.ts`

### React Flow 最佳实践（G 评审 2026-02-27）
- 使用 initialLoadRef 避免 projectType 变化时重置节点状态
- 使用函数形式更新节点：`setNodes(prev => prev.map(...))` 保留用户进度
- 添加 isValidConnection 防止错误连接（只允许顺序连接）
- 使用 useReactFlow 的 updateNodeData 更新单个节点
- 自定义 Edge 可用动画粒子效果增强视觉（getBezierPath + CSS animation）
- 视口状态可用 localStorage 持久化（onViewportChange 防抖保存）
- 节点位置自动保存到 localStorage（防抖 500ms）
- edgeTypes 注册自定义 Edge 组件

## 项目里程碑

### DreamX Studio（2026-02-26 ~ 2026-02-28）
- **开发周期**: 3 天
- **最终评分**: 9.5/10
- **提交次数**: 20+ 次
- **修复问题**: 49 项（P0+P1+P2 全部完成）
- **UI 还原度**: 95%+（严格对齐 Drama.Land）
- **代码质量**: ESLint 0 错误 0 警告，TypeScript 0 错误
- **状态**: ✅ 可立即上线
- **技术栈**: Next.js 15 + React Flow + TypeScript + Tailwind CSS
- **核心功能**: Canvas 工作流编辑器、节点配置面板、右键菜单、连线反馈
- **性能优化**: 防抖保存、CSS 变量系统化、React.memo 全覆盖
- **Git 仓库**: `/root/dreamx-studio`
- **最新提交**: 851b7d8 (P1 性能优化)
