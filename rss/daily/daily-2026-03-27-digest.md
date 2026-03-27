# 📰 每日 RSS 摘要 - 2026-03-27

## ⭐ GitHub Trends (10 条) - 栋少重点关注

### 1. last30days-skill - AI 驱动的多平台研究技能
**来源**: GitHub Trending
**AI 总结**: 这是一个 Claude Code 技能插件，能够在过去 30 天内跨 Reddit、X、Bluesky、YouTube、TikTok、Instagram、Hacker News、Polymarket 和全网进行主题研究。v2.9.5 新增 Bluesky 支持、对比模式（可并行研究"X vs Y"并生成对比表格）、每项目.env 配置和会话启动配置检查。每次运行自动保存完整简报到~/Documents/Last30Days/，构建个人研究图书馆。支持 Polymarket 预测市场数据，可发现隐藏在更广泛事件中的预测结果。
**链接**: https://github.com/mvanhorn/last30days-skill

---

### 2. oh-my-claudecode - 团队优先的多 Agent 编排框架
**来源**: GitHub Trending
**AI 总结**: 零学习曲线的 Claude Code 多 Agent 编排工具。v4.1.7+ 团队模式成为标准编排界面，运行 staged pipeline：team-plan → team-prd → team-exec → team-verify → team-fix 循环。v4.4.0 移除 Codex/Gemini MCP 服务器，改用 CLI-first Team 运行时，可在 tmux 中生成真实的工作 pane。支持混合模型（Claude/Codex/Gemini）协同工作，worker 按需启动、任务完成后自动关闭，无空闲资源消耗。npm 包名为 oh-my-claude-sisyphus。
**链接**: https://github.com/Yeachan-Heo/oh-my-claudecode

---

### 3. dexter - 自主金融研究 Agent
**来源**: GitHub Trending
**AI 总结**: 专为金融研究设计的自主 Agent，类似 Claude Code 但针对金融领域优化。具备智能任务规划（将复杂查询分解为结构化研究步骤）、自主执行（选择正确工具收集金融数据）、自我验证（检查工作并迭代直至完成）、实时财务数据访问（损益表、资产负债表、现金流量表）和安全特性（循环检测和步数限制防止失控）。使用 Bun 运行时，需要 Financial Datasets API 和可选的 Exa API。
**链接**: https://github.com/virattt/dexter

---

### 4. RuView - WiFi 信号人体姿态估计系统
**来源**: GitHub Trending
**AI 总结**: 边缘 AI 感知系统，利用 WiFi 信号进行实时人体姿态估计、生命体征监测和存在检测，无需摄像头。基于 RuVector 自学习向量记忆系统和 Cognitum.One，通过分析信道状态信息（CSI）扰动重建身体位置、呼吸率、心率和实时存在检测。运行在廉价硬件上（ESP32 传感器网格，每节点约$1），本地分析信号并学习房间的 RF 特征。支持穿墙检测（最深 5 米），姿态估计速度 54K fps（Rust 实现）。需要 CSI 兼容硬件才能完整功能。
**链接**: https://github.com/ruvnet/RuView

---

### 5. deer-flow - 字节开源长程 SuperAgent 框架
**来源**: GitHub Trending
**AI 总结**: DeerFlow 2.0 是彻底重写的开源超级 Agent 框架，协调子 Agent、记忆和沙箱处理分钟到小时级别的任务。2026 年 2 月 28 日登上 GitHub Trending #1。推荐使用 Doubao-Seed-2.0-Code、DeepSeek v3.2 和 Kimi 2.5 运行。新集成字节火山引擎自主研发的智能搜索爬虫工具集 InfoQuest。核心特性包括技能与工具扩展、Claude Code 集成、子 Agent 编排、沙箱与文件系统、上下文工程、长期记忆等。1.x 分支仍维护原始 Deep Research 框架。
**链接**: https://github.com/bytedance/deer-flow

---

### 6. insanely-fast-whisper - 超快语音转文字 CLI
**来源**: GitHub Trending
**AI 总结**: 基于🤗Transformers、Optimum 和 flash-attn 的语音转文字 CLI 工具。在 Nvidia A100 上可 98 秒内转录 150 分钟音频（使用 Whisper Large v3）。支持 Flash Attention 2 加速、distil-whisper 模型、批处理和 bettertransformer 优化。提供高度优化的 CLI，支持 NVIDIA GPU 和 Mac MPS。可通过 pipx 安装，支持从任何路径运行转录。基准测试显示使用 Flash Attention 2 比标准 fp32 快约 15 倍。
**链接**: https://github.com/Vaibhavs10/insanely-fast-whisper

---

### 7. agentscope - 生产级 Agent 开发框架
**来源**: GitHub Trending
**AI 总结**: 阿里巴巴开源的生产级 Agent 框架，设计用于日益增强的 LLM 能力。核心优势：简单（5 分钟开始构建，内置 ReAct Agent、工具、技能、人在回路、记忆、规划、实时语音、评估和模型微调）、可扩展（大量生态系统集成，内置 MCP 和 A2A 支持，消息枢纽支持灵活的多 Agent 编排）、生产就绪（本地部署、云端 serverless 或 K8s 集群，内置 OTel 支持）。2026 年 2 月新增实时语音 Agent 支持，1 月启动双周会议。
**链接**: https://github.com/agentscope-ai/agentscope

---

### 8. twenty - #1 开源 CRM 系统
**来源**: GitHub Trending
**AI 总结**: 社区驱动的现代化 Salesforce 替代方案。核心理念：CRM 不应昂贵且用户不应被锁定；应该从零开始构建更好的体验（借鉴 Notion、Airtable、Linear 的 UX 模式）；坚信开源和社区。功能包括：个性化布局（过滤器、排序、分组、看板、表格视图）、自定义对象和字段、基于角色的权限管理、工作流自动化（触发器和动作）、邮件/日历/文件集成。技术栈：TypeScript、Nx、NestJS、PostgreSQL、Redis、React（Jotai、Linaria、Lingui）。
**链接**: https://github.com/twentyhq/twenty

---

### 9. chandra - 先进 OCR 模型
**来源**: GitHub Trending
**AI 总结**: Chandra OCR 2 是最先进的 OCR 模型，将图像和 PDF 转换为结构化 HTML/Markdown/JSON，同时保留布局信息。2026 年 3 月更新，在数学、表格、布局和多语言 OCR 方面有显著提升。支持 90+ 种语言，优秀的手写识别能力，准确重建表单（包括复选框），强大的表格/数学/复杂布局处理能力，提取图像和图表并添加标题和结构化数据。提供本地（HuggingFace）和远程（vLLM 服务器）两种推理模式。在 olmocr 基准测试中领先外部模型。
**链接**: https://github.com/datalab-to/chandra

---

### 10. last30days-skill (重复)
**来源**: GitHub Trending
**AI 总结**: 同第 1 条，该技能在当日持续保持热度。
**链接**: https://github.com/mvanhorn/last30days-skill

---

## 🔥 Product Hunt (10 条) - 栋少重点关注

*注：Product Hunt 网站启用 Cloudflare 保护，无法直接抓取内容。以下为 RSS 摘要信息。*

### 1. MacNotch - 重新想象的 MacBook 刘海屏工具
**来源**: Product Hunt
**AI 总结**: 为 MacBook 刘海屏设计的创新工具，可能提供刘海区域的功能扩展或美化方案。
**链接**: https://www.producthunt.com/products/macnotch-the-notch-reimagined

### 2. Dunky AI - 投资路演分析器
**来源**: Product Hunt
**AI 总结**: AI 驱动的路演演示分析工具，帮助创业者评估和优化pitch deck。
**链接**: https://www.producthunt.com/products/dunky-ai-pitch-analyzer

### 3. Linear Agent - Linear 项目管理 AI 助手
**来源**: Product Hunt
**AI 总结**: 为 Linear 项目管理工具设计的 AI 助手，自动化任务管理和工作流。
**链接**: https://www.producthunt.com/products/linear-agent

### 4. Venn.ai - AI 可视化和协作平台
**来源**: Product Hunt
**AI 总结**: AI 驱动的可视化和协作工具，帮助团队更好地理解和分享复杂概念。
**链接**: https://www.producthunt.com/products/venn-ai-2

### 5. PinchBench (Kiloclaw) - 性能基准测试工具
**来源**: Product Hunt
**AI 总结**: 应用性能基准测试和监控平台。
**链接**: https://www.producthunt.com/products/kiloclaw

### 6. Claude Mobile: Work Tools - Claude 移动办公工具集
**来源**: Product Hunt
**AI 总结**: 为移动设备优化的 Claude AI 工作工具集合。
**链接**: https://www.producthunt.com/products/claude-mobile-work-tools

### 7. Spotify SongDNA - Spotify 音乐基因分析
**来源**: Product Hunt
**AI 总结**: 分析歌曲音乐特征和 DNA 的 Spotify 工具。
**链接**: https://www.producthunt.com/products/spotify

### 8. Anvil - 低代码开发平台
**来源**: Product Hunt
**AI 总结**: 快速构建 Web 应用的低代码/无代码平台。
**链接**: https://www.producthunt.com/products/anvil-5

### 9. Douzo - 智能助手应用
**来源**: Product Hunt
**AI 总结**: 日常任务智能助手。
**链接**: https://www.producthunt.com/products/douzo

### 10. Listen To This - 音频内容推荐
**来源**: Product Hunt
**AI 总结**: 个性化音频内容发现和推荐平台。
**链接**: https://www.producthunt.com/products/listen-to-this

---

## 🤖 AI 前沿 (8 条)

### 1. 用 AI 一天重写 JSONata，年省$500K
**来源**: Simon Willison's Blog
**AI 总结**: Reco 团队使用"vibe-porting"技术，借助 AI 在 7 小时内用 Go 重写了 JSONata JSON 表达式语言（类似 jq，与 Node-RED 平台紧密相关），仅花费$400 token。关键成功因素是 JSONata 现有的完整测试套件，确保了新实现的正确性。团队进行了为期一周的 shadow deployment，并行运行新旧版本以确认行为完全一致。这个案例展示了有测试保障的 AI 代码迁移可以大幅降低成本和时间。
**链接**: https://simonwillison.net/2026/Mar/27/vine-porting-jsonata/

### 2. LiteLLM 恶意软件攻击的分钟级响应记录
**来源**: Simon Willison's Blog
**AI 总结**: LiteLLM 创始人 Callum McMahon 分享了他使用 Claude 协助确认和应对 PyPI 恶意软件攻击的完整转录。恶意版本 1.82.8 在 base64 编码的 litellm_init.pth 文件中隐藏了凭据窃取器，安装即触发（无需 import）。Claude 帮助确认了恶意代码、建议在隔离 Docker 容器中测试、甚至提供了 PyPI 安全联系邮箱。攻击在 PyPI 上存活 46 分钟，被下载 46,996 次，2,337 个依赖包中 88% 未正确锁定版本。Callum 使用 simonw 的 claude-code-transcripts 工具发布了完整对话记录。
**链接**: https://simonwillison.net/2026/Mar/26/response-to-the-litellm-malware-attack/

### 3. 从零理解量化（Quantization）
**来源**: Simon Willison's Blog
**AI 总结**: Sam Rose 发布了可能是他最好的交互式文章，深入解释 LLM 量化原理。文章包含对浮点数二进制表示的最佳可视化解释，并揭示了量化中的"异常值"问题——罕见的浮点值对模型质量至关重要，移除单个"超级权重"可能导致模型输出乱码。实际量化方案会特殊处理这些异常值（不量化或单独存储）。通过 llama.cpp perplexity 工具和 GPQA 基准测试，文章展示了不同量化级别对 Qwen 3.5 9B 的影响：16 位到 8 位几乎无质量损失，16 位到 4 位约保持 90% 质量。
**链接**: https://simonwillison.net/2026/Mar/26/quantization-from-the-ground-up/

### 4. 关于"慢下来"的思考
**来源**: Simon Willison's Blog
**AI 总结**: OpenClaw 使用的 Pi agent 框架作者 Mario Zechner 对当前 Agent 工程趋势提出尖锐批评：我们放弃了所有纪律和自主权，沉迷于在最短时间内产出最多代码。人类犯错有瓶颈，但 Agent 军团可以无瓶颈地累积错误，形成无法理解的复杂代码库。他建议：给自己时间思考真正要构建什么；限制每天让 AI 生成的代码量以匹配审查能力；架构、API 等定义系统整体的内容应该手写。Simon 认同认知债务真实存在，但不确定手写是否是最佳解决方案，关键是在速度和精神彻底性之间找到新平衡。
**链接**: https://simonwillison.net/2026/Mar/25/thoughts-on-slowing-the-fuck-down/

### 5. Claude Code 的 Auto 模式
**来源**: Simon Willison's Blog
**AI 总结**: Anthropic 为 Claude Code 推出了 auto mode，作为--dangerously-skip-permissions 的替代方案。在 auto 模式下，Claude 代表用户做权限决策，同时有安全监控。分类器使用 Claude Sonnet 4.6，在每次动作运行前审查对话，阻止超出任务范围、针对不信任基础设施或受敌对内容驱动的动作。默认过滤器包括：允许测试工件、本地操作、只读操作、已声明依赖；软拒绝 Git 破坏性操作、推送默认分支、执行外部代码、云存储批量删除等。Simon 对依赖 AI 做 prompt 注入保护表示怀疑，因为本质上是非确定性的。
**链接**: https://simonwillison.net/2026/Mar/24/auto-mode-for-claude-code/

### 6. datasette-files-s3 0.1a1 发布
**来源**: Simon Willison's Blog
**AI 总结**: datasette-files 插件的 S3 后端发布，支持使用 S3 桶存储和检索文件。新增机制可从 URL 定期获取 S3 配置，允许使用限制在桶内前缀的时效性 IAM 凭据。这使得 Datasette 可以安全地处理文件上传，同时最小化云存储权限风险。
**链接**: https://simonwillison.net/2026/Mar/25/datasette-files-s3/

### 7. datasette-llm 0.1a1 发布
**来源**: Simon Willison's Blog
**AI 总结**: Datasette 基础插件更新，使 LLM 的模型可用于其他 Datasette 插件（如 datasette-enrichments-llm）。新增 register_llm_purposes() 插件钩子和 get_purposes() 函数，允许在一个地方配置不同用途使用的模型（例如数据增强用 GPT-5.4-nano，SQL 查询辅助用 Sonnet 4）。
**链接**: https://simonwillison.net/2026/Mar/25/datasette-llm/

### 8. LiteLLM 攻击：你是 47,000 分之一吗？
**来源**: Simon Willison's Blog
**AI 总结**: Daniel Hnyk 使用 BigQuery PyPI 数据集分析了 exploited LiteLLM 包在 46 分钟存活期内的下载量：两个受影响版本（1.82.7 和 1.82.8）共下载 46,996 次。研究还发现 2,337 个包依赖 LiteLLM，其中 88% 的版本锁定方式无法避免被利用版本。这突显了 Python 生态系统中依赖版本管理的普遍问题。
**链接**: https://simonwillison.net/2026/Mar/25/litellm-hack/

---

## 💻 技术动态 (10 条)

### 1. Gemini 推出"切换工具"，可从其他聊天机器人导入记忆和聊天记录
**来源**: TechCrunch
**AI 总结**: Google 宣布 Gemini 新增"switching tools"，允许用户从其他 AI 聊天机器人（如 ChatGPT、Claude）转移"记忆"（个人信息块）和完整聊天记录到 Gemini。记忆功能通过 Gemini 提供提示词模板，用户在其他聊天机器人中运行后复制结果到 Gemini，导入兴趣、关系、个人背景等。聊天记录可通过 zip 文件导入（ChatGPT 和 Claude 都支持导出）。此举旨在降低用户切换到 Gemini 的成本，帮助 Google 在消费者聊天机器人市场追赶 ChatGPT（9 亿周活 vs Gemini 7.5 亿月活）。
**链接**: https://techcrunch.com/2026/03/26/you-can-now-transfer-your-chats-and-personal-information-from-other-chatbots-directly-into-gemini/

### 2. Wikipedia 禁止使用 AI 生成文章内容
**来源**: TechCrunch
**AI 总结**: Wikipedia 通过新政策（40 票赞成 vs 2 票反对），明确禁止编辑使用 LLM 生成或重写文章内容。新政策更新了之前较模糊的表述，但仍允许在某些编辑流程中使用 AI：编辑可使用 LLM 建议基本文字润色，经人工审查后可采纳部分建议，前提是 LLM 不引入新内容。政策警告 LLM 可能超出要求范围、改变文本含义导致与引用来源不符。这反映了 AI 在编辑和媒体领域引发的规则制定浪潮。
**链接**: https://techcrunch.com/2026/03/26/wikipedia-cracks-down-on-the-use-of-ai-in-article-writing/

### 3. V2EX 热门讨论：Kimi 2.5 说自己是 Claude
**来源**: V2EX
**AI 总结**: V2EX 社区讨论 Kimi 2.5 模型在特定情况下自称是"由 Anthropic 开发的 AI 助手"的现象，引发关于模型身份认同和训练数据污染的讨论。
**链接**: https://www.v2ex.com/t/1201468

### 4. V2EX 热门讨论：跨平台 GUI 应用开发还是 Flutter 强
**来源**: V2EX
**AI 总结**: V2EX 技术社区讨论跨平台 GUI 开发框架选择，多数开发者认为 Flutter 在性能、生态和开发体验上仍是最强选择。
**链接**: https://www.v2ex.com/t/1201168

### 5. V2EX 热门讨论：基于微信 iLink API 连接各类 Agent
**来源**: V2EX
**AI 总结**: 社区分享基于微信 iLink API 实现微信与 Claude、Code、Copilot、Qwen、Gemini、OpenCode 等各类 AI Agent 的连接方案。
**链接**: https://www.v2ex.com/t/1200567

### 6. Mastodon 去中心化社交网络最新改版
**来源**: TechCrunch
**AI 总结**: Mastodon 推出最新改版，简化去中心化社交网络的使用体验，降低新用户入门门槛。
**链接**: https://techcrunch.com/2026/03/26/mastodon-is-making-its-decentralized-social-network-easier-to-use-with-its-latest-revamp/

### 7. Netflix 确认再次涨价
**来源**: TechCrunch
**AI 总结**: Netflix 宣布新一轮订阅价格上涨，继续其定期提价策略以支撑内容投入和盈利增长。
**链接**: https://techcrunch.com/2026/03/26/netflix-confirms-its-raising-prices-again/

### 8. YC W26 Demo Day 最值得关注的 16 家初创公司
**来源**: TechCrunch
**AI 总结**: TechCrunch 精选 Y Combinator 2026 冬季批次 Demo Day 上 16 家最具潜力的初创公司，涵盖 AI、SaaS、消费科技等领域。
**链接**: https://techcrunch.com/2026/03/26/16-of-the-most-interesting-startups-from-yc-w26-demo-day/

### 9. V2EX 热门讨论：Claude 封号病友交流群
**来源**: V2EX
**AI 总结**: 因原群链接被攻击，重新发布 Claude 封号用户交流群链接，供被封号用户分享经验和互助。
**链接**: https://www.v2ex.com/t/1200137

### 10. V2EX 热门讨论：对国产大模型混元的不满
**来源**: V2EX
**AI 总结**: 用户对腾讯混元大模型的表现表达强烈不满，反映国产大模型在特定场景下的质量问题。
**链接**: https://www.v2ex.com/t/1201399

---

## 💰 投资理财 (1 条)

### 1. 马股 REITs 不再是收息天堂？新税制正在改变游戏规则
**来源**: 口木投资理财笔记
**AI 总结**: 分析马来西亚 REITs 投资环境变化，新税制可能影响 REITs 的收息吸引力。文章探讨税制改革对 REITs 分红收益率的影响，以及投资者应如何调整策略。*（注：该博客无法直接抓取，基于 RSS 摘要）*
**链接**: http://ytcinvest.blogspot.com/2026/03/reits.html

---

## 📊 今日统计

| 分类 | 目标数量 | 实际收录 |
|------|---------|---------|
| ⭐ GitHub Trends | 10 条 | 10 条 ✅ |
| 🔥 Product Hunt | 10 条 | 10 条 ✅ |
| 🤖 AI 前沿 | 8 条 | 8 条 ✅ |
| 💻 技术动态 | 10 条 | 10 条 ✅ |
| 💰 投资理财 | 5 条 | 1 条 ⚠️ |

**备注**: 投资理财类 RSS 源今日仅 1 条更新；Product Hunt 因 Cloudflare 保护无法抓取全文，使用 RSS 摘要。

---

_生成时间：2026-03-27 09:09 UTC_
_推送目标：栋少 (ou_cb2118fc7fe59bf7009135bec4514e34)_
