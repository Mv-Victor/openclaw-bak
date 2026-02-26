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
