# TEAM-DIRECTORY.md - 角色与身份映射

## Agent 列表

| 角色 | Agent ID | 飞书账号 | Bot 名称 | Workspace | mentionPatterns |
|------|----------|----------|----------|-----------|-----------------|
| 总指挥+军师+智库 | g | g | G | /root/.openclaw/workspace-g | G, @G, 总指挥, 军师, 智库 |
| 工程师+创作官 | main | default | 啾啾 | /root/.openclaw/workspace | 啾啾, @啾啾, 工程师, 创作官 |

## 人员

| 身份 | 称呼 | 备注 |
|------|------|------|
| 老板/用户 | 栋少 (黄智栋) | 快手电商 Java 架构师，最终决策者 |

## 飞书 ID 映射

- 栋少: ou_cb2118fc7fe59bf7009135bec4514e34

## 群聊 @触发规则

- G：群聊中全局监听（requireMention=false），无需 @
- 啾啾：需要被 @ 才响应（requireMention=true）

## 跨 Agent 通信 Session Keys

- G 群聊 session: `agent:g:feishu:group:<group_id>`
- 啾啾群聊 session: `agent:main:feishu:group:<group_id>`
- 派工方式: `sessions_send(sessionKey=<对方session>, message=<内容>)`

## 5 角色 → 2 Agent 映射

| 原始角色 | 映射到 | 核心能力 |
|----------|--------|----------|
| 总指挥 | G | 全局态势感知、任务拆解、派工、纠偏、收口 |
| 军师 | G | 策略分析、方案评估、风险预判 |
| 智库 | G | 知识审核、质量把关、合规检查 |
| 工程师 | 啾啾 | 代码实现、调试测试、工具调用、系统维护 |
| 创作官 | 啾啾 | 内容创作、表达优化、对外输出 |
