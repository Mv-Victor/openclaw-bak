# GROUP_MEMORY.md - 群聊长期记忆

_只保留群里可复用且安全的信息，不混入私聊内容。_

## 协作架构（2026-02-26 完整落地）

### 系统定位
单 Gateway 下的多 Agent 操作系统，5 角色合 2 Agent：
- G = 总指挥 + 军师 + 智库
- 啾啾 = 工程师 + 创作官

### 配置层硬约束（openclaw.json）
- bindings: feishu/g → agent:g, feishu/default → agent:main
- dmScope: per-account-channel-peer（三维会话隔离）
- requireMention: G=false（全局监听），啾啾=true（@触发）
- groupPolicy: open
- agentToAgent.maxPingPongTurns: 0（压制无意义 ping-pong）
- ackReactionScope: group-mentions
- mentionPatterns: G=[G, @G, 总指挥, 军师, 智库]，啾啾=[啾啾, @啾啾, 工程师, 创作官]

### 规则层行为约束（workspace 文件）
| 文件 | 作用 |
|------|------|
| SOUL.md | 人格、语气、职责、质量底线 |
| AGENTS.md | 运行手册、协作流程、记忆规范 |
| ROLE-COLLAB-RULES.md | 角色专属协作边界 |
| TEAM-RULEBOOK.md | 团队统一硬规则（双 Agent 共享） |
| TEAM-DIRECTORY.md | 角色与真实 ID 映射 |
| IDENTITY.md | 身份定义 |
| USER.md | 用户画像 |
| TOOLS.md | 工具清单与权限 |
| MEMORY.md | 长期记忆 |
| GROUP_MEMORY.md | 群聊记忆 |
| HEARTBEAT.md | 心跳规范 |
| memory/YYYY-MM-DD.md | 每日流水 |
| memory/archive/ | 冷归档（7天以上自动归档） |

### 双轨治理
- 配置轨（平台级）：bindings、dmScope、requireMention、groupPolicy、maxPingPongTurns
- 规则轨（行为级）：SOUL.md、AGENTS.md、ROLE-COLLAB-RULES.md、TEAM-RULEBOOK.md
- 两条轨道叠加：平台层先限流 + 行为层再约束

### 群聊 Session Keys

#### 群 oc_c77988450ccd8ae6f30dc77d62038204
- G: `agent:g:feishu:group:oc_c77988450ccd8ae6f30dc77d62038204`
- 啾啾: `agent:main:feishu:group:oc_c77988450ccd8ae6f30dc77d62038204`

#### 群 oc_0af53fdfca746166d27a102fc843f207
- G: `agent:g:feishu:group:oc_0af53fdfca746166d27a102fc843f207`
- 啾啾: `agent:main:feishu:group:oc_0af53fdfca746166d27a102fc843f207`

### 群聊协作流程
```
栋少群里提需求 → G 响应并拆解 → G sessions_send 派工给啾啾
→ 啾啾执行 → 啾啾 sessions_send 回报给 G → G 群里回复栋少
```

### 持久化机制
- 双 workspace 独立 Git 仓库
- Gateway 配置通过 config.patch 自动持久化 + 重启
- 冷归档：scripts/archive-memory.sh + cron 每日凌晨 3 点自动归档 7 天以上 daily memory

## API 配置

### PoloAI（视频生成）
- base_url: https://poloai.top
- 可用模型: `sora-2`, `sora-2-guan`（2026-02-26 验证通过）
- 图片模型全部不可用

### xchai.xyz（文本生成）
- 支持 Anthropic Messages API 兼容格式
- 模型: `claude-opus-4-6`

## 沉淀的经验

### 内存管理
- 服务器 3.6G 内存，drama-server 容易被 OOM kill
- 启动前先 `echo 3 > /proc/sys/vm/drop_caches`
- Go 路径: `/usr/local/go/bin/go`（已加入 ~/.bashrc）

### huobao-drama 项目
- 路径: `/root/huobao-drama`
- 入口: `main.go`，端口: 5678
