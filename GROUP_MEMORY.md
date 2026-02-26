# GROUP_MEMORY.md - 群聊长期记忆

_只保留群里可复用且安全的信息，不混入私聊内容。_

## 协作架构（2026-02-26 完整落地）

### 系统定位
单 Gateway 下的多 Agent 操作系统，5 角色合 2 Agent：
- G = 总指挥 + 军师 + 智库
- 啾啾 = 工程师 + 创作官

### 配置层硬约束
- bindings: feishu/g → agent:g, feishu/default → agent:main
- dmScope: per-account-channel-peer
- requireMention: G=false, 啾啾=true
- groupPolicy: open
- agentToAgent.maxPingPongTurns: 0
- ackReactionScope: group-mentions

### 双轨治理
- 配置轨（平台级）+ 规则轨（行为级）叠加
- 平台层先限流 + 行为层再约束

### 持久化机制
- 双 workspace 独立 Git 仓库
- Gateway 配置通过 config.patch 自动持久化
