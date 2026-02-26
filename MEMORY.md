# MEMORY.md - G 长期记忆

## 栋少信息
- 快手电商 Java 架构师
- 副业：AI 剪辑、AI 漫剧
- 时区：GMT+8
- 沟通渠道：飞书 DM + 群聊

## 多 Agent 协作系统（2026-02-26 完整落地）
- G（总指挥/军师/智库）+ 啾啾（工程师/创作官）
- 单 Gateway，独立 workspace，飞书双账号
- G workspace: `/root/.openclaw/workspace-g`
- 啾啾 workspace: `/root/.openclaw/workspace`
- Git 备份：`git@github.com:Mv-Victor/openclaw-bak.git` 分支 `G`，5 分钟自动备份

### 双轨治理
- 配置轨（Gateway 硬控制）：maxPingPongTurns=0, dmScope=per-account-channel-peer, requireMention, bindings, mentionPatterns
- 规则轨（workspace 软引导）：SOUL.md, AGENTS.md, ROLE-COLLAB-RULES.md, TEAM-RULEBOOK.md, TEAM-DIRECTORY.md

### 群聊 Session Keys
- 群 oc_0af53fdfca746166d27a102fc843f207: G=agent:g:feishu:group:oc_0af53fdfca746166d27a102fc843f207, 啾啾=agent:main:feishu:group:oc_0af53fdfca746166d27a102fc843f207
- 群 oc_c77988450ccd8ae6f30dc77d62038204: G=agent:g:feishu:group:oc_c77988450ccd8ae6f30dc77d62038204, 啾啾=agent:main:feishu:group:oc_c77988450ccd8ae6f30dc77d62038204

### 记忆分层 + 冷归档
- 5 层：短期流水 → 长期记忆 → 群聊记忆 → 冷归档 → 语义检索
- 归档脚本：scripts/archive-memory.sh，cron 每天凌晨 3 点执行（job id: 7f9ecba6）
- 超过 7 天的 daily memory 自动移入 archive/

### 持久化机制
1. 配置轨持久化：openclaw.json 写入磁盘，Gateway 重启自动加载
2. 规则轨持久化：workspace 文件持久存储，每次会话自动读取
3. 记忆持久化：分层存储 + 语义检索按需加载
4. 归档持久化：cron 定时归档，防止上下文膨胀
5. 备份持久化：Git 自动备份（每5分钟），远程仓库冗余

## ⚠️ 硬性约束：API 费用控制（2026-02-26 栋少要求）
- 文生图和文生视频 API 每次调用花费不菲
- **强限制**：每次调用必须能完成任务进度，不要做无意义的调用
- 禁止：测试性调用、已知会失败的重试、模型不可用时的盲目提交
- 必须：调用前验证模型/渠道可用性，失败后分析原因再决定是否重试
- Ralph 循环等自动化任务必须有防空转机制，遇到阻塞立即停止而非反复重试

## AI 短剧生成平台（2026-02-24 启动）

### 业务方向
- 三种变现模式：SaaS Bot、成品视频交付、代运营
- 新方向：短剧生成，IP 角色库 + 按行业垂类建素材库
- 核心壁垒：AI 生成短剧 + 一键导出剪映/Capcut 工程文件

### API 资源
- Polo API token: sk-vPYI81WXaBK95LE9TGPRWMVlpQ6YOOkKCKopNTtiFWROBxPW
- 基础 URL: https://poloai.top
- 支持：Sora-2、豆包、Veo、可灵、万相、Flux 等

### 技术选型
- 主体：huobao-drama（Go+Vue3，`/root/huobao-drama/`）
- 参考：Toonflow-app 的 Agent 分镜拆解逻辑（`/root/Toonflow-app/`）
- 核心开发：Timeline → Capcut draft_content.json 导出模块

### 开源项目路径
- `/root/huobao-drama/` - Go+Vue3 全栈短剧平台（推荐主体）
- `/root/Toonflow-app/` - Node.js AI Agent 分镜生成
- `/root/Toonflow-web/` - 前端，参考价值有限
