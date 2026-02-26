# TEAM-DIRECTORY.md - 角色与身份映射

## Agent 列表

| 角色 | Agent ID | 飞书账号 | Bot 名称 | Workspace | requireMention | mentionPatterns |
|------|----------|----------|----------|-----------|----------------|-----------------|
| 总指挥/军师/智库 | g | g | G | /root/.openclaw/workspace-g | false（全局监听） | G, @G, 总指挥, 军师, 智库 |
| 工程师/创作官 | main | default | 啾啾 | /root/.openclaw/workspace | true（@触发） | 啾啾, @啾啾, 工程师, 创作官 |

## 人员

| 身份 | 称呼 | 备注 |
|------|------|------|
| 老板/用户 | 栋少 (黄智栋) | 快手电商 Java 架构师，最终决策者 |

## 飞书 ID 映射

- 栋少: ou_cb2118fc7fe59bf7009135bec4514e34

## 群聊列表

| 群聊 ID | 用途 | G session | 啾啾 session |
|---------|------|-----------|-------------|
| oc_0af53fdfca746166d27a102fc843f207 | 协作群 | agent:g:feishu:group:oc_0af53fdfca746166d27a102fc843f207 | agent:main:feishu:group:oc_0af53fdfca746166d27a102fc843f207 |
| oc_c77988450ccd8ae6f30dc77d62038204 | 协作群 | agent:g:feishu:group:oc_c77988450ccd8ae6f30dc77d62038204 | agent:main:feishu:group:oc_c77988450ccd8ae6f30dc77d62038204 |

## @触发规则

- G：群聊中全局监听（无需 @），可被 "总指挥"、"军师"、"智库" 触发
- 啾啾：需要被 @ 才响应，可被 "工程师"、"创作官" 触发
