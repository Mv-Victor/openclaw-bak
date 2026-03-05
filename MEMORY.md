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

## ⚠️ 硬性约束：API 费用控制（2026-02-26 栋少要求）
- 文生图和文生视频 API 每次调用花费不菲
- **强限制**：每次调用必须能完成任务进度，不要做无意义的调用
- 禁止：测试性调用、已知会失败的重试、模型不可用时的盲目提交
- 必须：调用前验证模型/渠道可用性，失败后分析原因再决定是否重试
- Ralph 循环等自动化任务必须有防空转机制，遇到阻塞立即停止而非反复重试

## Ralph 驱动模式（2026-02-26 建立）
- 核心思想：cron 从"提醒模式"改为"驱动模式"，每次触发从文件读状态自主执行
- 状态持久化：prd.json（任务列表+完成状态+阻塞标记）+ progress.txt（执行日志+经验沉淀）
- 阻塞跳过：blocked story 自动跳过，尝试下一个依赖已满足的 story
- 防空转：NO_PROGRESS / BLOCKED_ALL / COMPLETE 三种停止信号
- cron 类型：agentTurn + isolated，每次全新 session，不依赖上下文
- prd.json 扩展字段：blocked, blockedReason, blockedSince, dependsOn
- 设计文档：docs/ralph-drive-mode.md
- 参考项目：/root/ralph（snarktank/ralph）

### 教训
- systemEvent 类型 cron 只是"提醒"，session 没上下文就空转
- 遇到阻塞不跳过会导致同一个 story 反复检查（白骨夫人 BG-002 空转 12 次）
- 任务状态必须持久化到文件，不能依赖 session 上下文

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

## DreamX Studio 项目（2026-03-05 上线）

### 项目状态
- **上线时间**: 2026-03-05
- **评审轮次**: 10 轮
- **最终评分**: 9.5/10
- **评审人**: 啾啾

### 评审历程
- 第一轮（23:59）：9.6/10，1 个 P2
- 第二轮（00:54）：9.5/10，P1 全部修复
- 第三至十轮：质量稳定在 9.5/10，P2 优化项从 7 个收敛至 2 个
- UI 还原度：98%
- UI 校验：8 项全部通过

### 技术栈
- 工作流可视化（React Flow）
- 节点卡片、DetailPanel、连线等核心组件
- 左侧导航栏、上传按钮等 UI 组件

### 上线标准
- P1 问题：全部修复并验证通过
- P2 优化项：非阻塞，可后续迭代（约 25min 工作量）

## 小红书文案生成技能（2026-03-02 建立）

### 技能路径
- Skill: `/root/.openclaw/workspace-g/skills/xiaohongshu-copywriting/SKILL.md`
- 数据：`/root/.openclaw/workspace-g/xiaohongshu-data/YYYY-MM-DD.jsonl`
- 分析报告：`/root/.openclaw/workspace-g/xiaohongshu-data/analysis-report-v1.md`

### 数据基础
- 每日爬取：100 篇笔记（评论>100）
- 数据来源：小红书平台
- 关键词：计算机求职、AI 副业、AI 剪辑、大厂、春招、秋招等

### 核心能力
- 7 种标题公式（15 字以内）
- 4 步正文框架（事件陈述→独家角度→利益点→情绪/引导）
- 配图建议（6-9 张）
- 话题标签推荐（5-8 个）

### 三大受众方向
1. 求职/大厂（双非逆袭、绩效考核、面试经验）
2. AI 副业（OpenClaw、Claude API、自动化赚钱）
3. AI 剪辑（效率提升、批量生产、变现路径）

### 运营策略
- 起号主题：AI 时代双非本逆袭大厂 S 绩效
- 核心定位：淋过雨的人愿意为别人打伞
- 内容风格：晒成绩但不纯晒，强调艰辛历程和同理心
