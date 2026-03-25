# 📰 每日 RSS 摘要 - 2026-03-25

## ⭐ GitHub Trends (栋少重点关注)

### 1. pascalorg/editor
**来源**: GitHub
**AI 总结**: 一个基于 React Three Fiber 和 WebGPU 构建的 3D 建筑编辑器。采用 Turborepo 单体仓库架构，分离了核心逻辑 (@pascal-app/core)、3D 渲染 (@pascal-app/viewer) 和编辑器 UI (apps/editor)。使用 Zustand 管理场景状态，支持 IndexedDB 持久化和 50 步撤销/重做。节点系统采用扁平字典存储而非嵌套树，通过 parentId 建立层级关系。适合对 3D 编辑器架构感兴趣的同学参考。
**链接**: https://github.com/pascalorg/editor

---

### 2. bytedance/deer-flow
**来源**: GitHub
**AI 总结**: 字节开源的 SuperAgent 框架 2.0 版本，完全重写。定位为"深度探索和高效研究流程"的超级 Agent 编排系统，支持子 Agent 协作、记忆、沙箱和技能扩展。2 月 28 日登上 GitHub Trending #1。推荐使用 Doubao-Seed-2.0-Code、DeepSeek v3.2 和 Kimi 2.5 运行。新增 InfoQuest 智能搜索工具集成。对于想做 Agent 编排的同学是很好的参考实现。
**链接**: https://github.com/bytedance/deer-flow

---

### 3. supermemoryai/supermemory
**来源**: GitHub
**AI 总结**: AI 时代的记忆引擎，在 LongMemEval、LoCoMo 和 ConvoMem 三个主流 AI 记忆基准测试中均排名第一。核心能力包括：从对话中提取事实、处理时间变化和矛盾、自动遗忘过期信息、用户画像维护、混合搜索 (RAG+Memory)。支持 Google Drive/Gmail/Notion/OneDrive/GitHub 等连接器，可处理 PDF、图片 (OCR)、视频 (转录)、代码 (AST 感知分块)。提供 API 和消费级应用，适合需要给 AI 添加持久记忆的项目。
**链接**: https://github.com/supermemoryai/supermemory

---

### 4. FujiwaraChoki/MoneyPrinterV2
**来源**: GitHub
**AI 总结**: 自动化在线赚钱流程的应用，MoneyPrinter 第二版完全重写。功能包括：Twitter 机器人 (带 CRON 调度)、YouTube Shorts 自动化、联盟营销 (Amazon+Twitter)、本地商家挖掘和冷 outreach。需要 Python 3.12。中文版为 MoneyPrinterTurbo。对于想做自动化内容变现的同学有参考价值，但需注意合规风险。
**链接**: https://github.com/FujiwaraChoki/MoneyPrinterV2

---

### 5. harry0703/MoneyPrinterTurbo
**来源**: GitHub
**AI 总结**: MoneyPrinter 的中文版本，利用 AI 大模型一键生成高清短视频。只需提供主题或关键词，即可自动生成文案、素材、字幕、背景音乐并合成视频。支持 9:16 竖屏和 16:9 横屏，批量生成，多种语音合成，字幕样式可调。支持 DeepSeek、Moonshot、通义千问等国内可直接访问的模型。录咖网站基于该项目提供免费在线服务。适合想做短视频自动化生产的同学。
**链接**: https://github.com/harry0703/MoneyPrinterTurbo

---

### 6. Crosstalk-Solutions/project-nomad
**来源**: GitHub
**AI 总结**: 离线优先的生存计算机项目，内置 AI 聊天 (Ollama+Qdrant RAG)、离线维基百科 (Kiwix)、教育平台 (Kolibri+Khan Academy)、离线地图 (ProtoMaps)、数据工具 (CyberChef)、笔记 (FlatNotes) 等功能。通过 Docker 编排所有容器化服务，提供浏览器访问的管理 UI。适合对离线知识系统、边缘计算、灾难恢复场景感兴趣的同学。
**链接**: https://github.com/Crosstalk-Solutions/project-nomad

---

### 7. TauricResearch/TradingAgents
**来源**: GitHub
**AI 总结**: 多 Agent LLM 金融交易框架，模拟真实交易公司的动态。包含基本面分析师、情绪分析师、新闻分析师、技术分析师、多头/空头研究员、交易员、风险管理和投资组合经理等角色。Agent 之间进行动态辩论以确定最优策略。v0.2.2 新增 GPT-5.4/Gemini 3.1/Claude 4.6 支持、五级评分系统、OpenAI Responses API 集成。仅供研究使用，不构成投资建议。对做多 Agent 交易系统的同学有参考价值。
**链接**: https://github.com/TauricResearch/TradingAgents

---

### 8. mvanhorn/last30days-skill
**来源**: GitHub
**AI 总结**: Claude Code 技能，跨 Reddit、X、Bluesky、YouTube、TikTok、Instagram、Hacker News、Polymarket 和全网搜索过去 30 天的内容，生成带真实引用的综合摘要。v2.9.5 新增 Bluesky 支持、对比模式 (X vs Y 并行研究)、每项目.env 配置。v2.9 引入 ScrapeCreators 统一 API (覆盖 Reddit/TikTok/Instagram)。v2.8 新增 Polymarket 预测市场集成，可获取真实资金投注数据。适合需要做深度市场调研的同学。
**链接**: https://github.com/mvanhorn/last30days-skill

---

### 9. ruvnet/ruflo
**来源**: GitHub
**AI 总结**: Claude 的 Agent 编排平台，支持部署智能多 Agent 集群、协调自主工作流、构建对话式 AI 系统。特性包括企业级架构、分布式集群智能、RAG 集成、原生 Claude Code/Codex 集成。具体细节页面被 GitHub 通用内容覆盖，建议直接查看仓库获取更多信息。
**链接**: https://github.com/ruvnet/ruflo

---

### 10. NousResearch/hermes-agent
**来源**: GitHub
**AI 总结**: Nous Research 构建的自我改进 AI Agent，内置学习循环：从经验中创建技能、使用过程中改进技能、定期持久化知识、搜索历史对话、跨会话构建用户模型。支持 200+ 模型 (OpenRouter、Nous Portal、Kimi、MiniMax 等)。提供完整 TUI 终端界面，支持 Telegram/Discord/Slack/WhatsApp/Signal 多平台。内置 cron 调度器、子 Agent 派生、6 种终端后端 (本地/Docker/SSH/Daytona/Singularity/Modal)。可从 OpenClaw 迁移。适合想搭建个人 Agent 系统的同学。
**链接**: https://github.com/NousResearch/hermes-agent

---

## 🤖 AI 前沿

### 1. Auto mode for Claude Code (Simon Willison)
**来源**: Simon Willison's Blog
**AI 总结**: Claude Code 推出新的 auto mode 权限模式，作为 --dangerously-skip-permissions 的替代方案。在 auto mode 下，Claude 代表用户做权限决策，内置安全监控。分类器使用 Claude Sonnet 4.6，在每动作执行前审查对话，阻止超出任务范围、针对不可信基础设施或受 hostile content 驱动的操作。提供详细的 allow/block/soft_deny 规则列表，支持自定义。但 Simon 对依赖 AI 做 prompt injection 防护持保留态度，因为 AI 本质上是非确定性的。
**链接**: https://simonwillison.net/2026/Mar/24/auto-mode-for-claude-code/

---

### 2. Malicious litellm — credential stealer (Simon Willison)
**来源**: Simon Willison's Blog
**AI 总结**: LiteLLM v1.82.8 PyPI 包被植入恶意凭证窃取器，隐藏在 base64 编码的 litellm_init.pth 文件中。安装即触发，无需 import。窃取范围包括 SSH、Git、AWS、Kubernetes、Azure、Docker、NPM、加密货币钱包等配置文件和历史记录。PyPI 已隔离该项目，影响窗口仅数小时。攻击源头可能是针对 Trivy 安全扫描器的供应链攻击，导致 PyPI 凭证泄露。提醒开发者注意依赖包安全，考虑使用依赖冷却机制。
**链接**: https://simonwillison.net/2026/Mar/24/malicious-litellm/

---

### 3. OpenAI to acquire Astral
**来源**: OpenAI Blog
**AI 总结**: OpenAI 宣布收购 Astral，将 uv、Ruff、ty 等流行 Python 开源工具纳入 Codex 生态系统。Astral 团队将加入 Codex 团队，OpenAI 计划继续支持这些开源项目。收购旨在加速 Codex 发展，使其能够参与完整开发工作流 (规划、修改、运行工具、验证、维护)，而非仅生成代码。Codex 已有 200 万周活用户，年初以来用户增长 3 倍、使用量增长 5 倍。对 Python 开发者生态影响重大。
**链接**: https://openai.com/index/openai-to-acquire-astral/

---

### 4. 套壳中国大模型撑起 500 亿美元估值？(阮一峰)
**来源**: 阮一峰的网络日志
**AI 总结**: Cursor 发布 Composer 2 模型，被国外推友发现实际是套壳的 Kimi K2.5 (模型 ID: kimi-k2p5-rl-0317-s515-fast)。Cursor 随后修复漏洞，但消息已传开，马斯克也转发确认。Cursor 负责人承认使用 Kimi K2.5，称通过 Fireworks AI 获得授权，Kimi 官方确认。阮一峰分析 Cursor 隐瞒原因是支撑高估值 (最新 500 亿美元)——需要包装成有模型研发能力的大模型公司，而非单纯的 VS Code 修改版。事件证明中国大模型技术已获国际认可，Kimi 免费获得高价值曝光。
**链接**: http://www.ruanyifeng.com/blog/2026/03/kimi-cursor.html

---

### 5. Streaming experts (Simon Willison)
**来源**: Simon Willison's Blog
**AI 总结**: Dan Woods 实验 streaming experts 技术，通过在 SSD 上流式传输必要的专家权重，在 RAM 不足的硬件上运行大型 MoE 模型。5 天前用 48GB RAM 运行 Qwen3.5-397B-A17B，现在 @seikixtc 在 96GB RAM 的单个 GPU 上运行万亿参数的 Kimi K2.5 (32B 激活权重)。这项技术让大模型在消费级硬件上运行成为可能，值得关注。
**链接**: https://simonwillison.net/2026/Mar/24/streaming-experts/

---

### 6. Package Managers Need to Cool Down (Simon Willison)
**来源**: Simon Willison's Blog
**AI 总结**: 受 LiteLLM 供应链攻击启发，Simon 重新探讨依赖冷却机制——只安装已在野外发布几天的依赖更新，让社区有时间发现潜在问题。Andrew Nesbitt 3 月 4 日的文章回顾了各打包工具的冷却机制支持情况， surprisingly well supported。对于企业级项目，建议考虑启用依赖冷却，降低供应链攻击风险。
**链接**: https://simonwillison.net/2026/Mar/24/package-managers-need-to-cool-down/

---

### 7. Helping developers build safer AI experiences for teens
**来源**: OpenAI Blog
**AI 总结**: OpenAI 发布基于提示的青少年安全策略，帮助开发者使用 gpt-oss-safeguard  moderating 年龄特定风险。针对青少年用户群体，提供年龄分层的内容审核策略，帮助开发者构建更安全的 AI 体验。
**链接**: https://openai.com/index/teen-safety-policies-gpt-oss-safeguard

---

### 8. Creating with Sora Safely
**来源**: OpenAI Blog
**AI 总结**: OpenAI 介绍 Sora 2 和 Sora 应用的安全措施。针对先进视频模型和新社交创作平台带来的新型安全挑战，采用具体保护措施，包括内容审核、水印、滥用检测等。强调安全是 Sora 产品设计的基础。
**链接**: https://openai.com/index/creating-with-sora-safely

---

## 🔥 Product Hunt (栋少重点关注)

*注：Product Hunt 页面被 Cloudflare 保护，无法抓取详细内容。以下基于 RSS 摘要整理：*

### 1. Flux
**来源**: Product Hunt
**AI 总结**: 本地回放生产 API 故障的调试工具。支持录制生产环境的 API 调用，然后在本地精确回放，帮助复现和修复生产 bug。
**链接**: https://www.producthunt.com/products/replay-production-api-failures-locally

---

### 2. Library in ChatGPT
**来源**: Product Hunt
**AI 总结**: 在所有 ChatGPT 对话中查找和复用文件的工具。解决 ChatGPT 文件管理分散的问题，提供统一的文件库视图和搜索功能。
**链接**: https://www.producthunt.com/products/chatgpt

---

### 3. TeamPrompt
**来源**: Product Hunt
**AI 总结**: 面向团队的 AI DLP (数据防泄漏) 和提示词管理系统。帮助企业管控 AI 使用中的敏感信息泄露风险，统一管理提示词模板。
**链接**: https://www.producthunt.com/products/teamprompt-2

---

### 4. Agent Hub Builder (Mindpal AI)
**来源**: Product Hunt
**AI 总结**: 构建 Netflix 风格的 AI 工具库，用于销售。支持创建和托管多个 AI Agent，提供统一的访问入口和管理界面。
**链接**: https://www.producthunt.com/products/mindpal-ai

---

### 5. BotBoard
**来源**: Product Hunt
**AI 总结**: Agent 时代的任务管理工具。针对 AI Agent 自主执行任务的特点，提供任务追踪、状态管理、结果审核等功能。
**链接**: https://www.producthunt.com/products/botboard

---

### 6. Claude Computer Use
**来源**: Product Hunt
**AI 总结**: 启用 Claude 使用电脑完成各项任务的工具。利用 Claude 的 computer use 能力，实现自动化操作。
**链接**: https://www.producthunt.com/products/claude

---

### 7. DebugBase
**来源**: Product Hunt
**AI 总结**: 面向 AI Agent 的 Stack Overflow。为 AI Agent 提供调试帮助和解决方案库。
**链接**: https://www.producthunt.com/products/debugbase

---

### 8. Maestri
**来源**: Product Hunt
**AI 总结**: 无限画布，多个 coding agent 协同工作。提供可视化的多 Agent 协作界面。
**链接**: https://www.producthunt.com/products/maestri

---

### 9. TypeScript 6.0
**来源**: Product Hunt
**AI 总结**: 最后一个基于 JavaScript 构建的 TypeScript 版本。TypeScript 6.0 发布，可能是 TypeScript 自身用 JavaScript 编写的最后一个版本。
**链接**: https://www.producthunt.com/products/the-new-typescript-website

---

### 10. Free AI Video Editor OpenCutAI
**来源**: Product Hunt
**AI 总结**: 免费 AI 视频编辑器，支持创建 Instagram Reels 和视频编辑。适合短视频创作者。
**链接**: https://www.producthunt.com/products/opencutai-video

---

## 💻 技术动态

### 1. new.website joins forces with v0
**来源**: Vercel Blog
**AI 总结**: Vercel 宣布 new.website 加入 v0 团队。new.website 专注于简化网站创建，提供内置表单、SEO 等工具。合并后将加速"帮助任何人用 AI 发布完整生产级软件"的愿景。
**链接**: https://vercel.com/blog/new-website-joins-forces-with-v0

---

### 2. Build knowledge agents without embeddings
**来源**: Vercel Blog
**AI 总结**: Vercel 团队提出不依赖向量嵌入的知识 Agent 构建方案。传统 RAG 需要先选向量数据库、构建分块流水线、选择嵌入模型、调优检索参数，但效果不理想且难以调试。新方案直接从结构化数据中检索特定值，避免嵌入的语义相似性局限。
**链接**: https://vercel.com/blog/build-knowledge-agents-without-embeddings

---

### 3. Powering the agents: Workers AI now runs large models
**来源**: Cloudflare Blog
**AI 总结**: Cloudflare Workers AI 现已支持运行大模型，首发 Kimi K2.5。优化了推理栈，降低了内部 Agent 用例的推理成本。开发者可以在 Cloudflare 边缘网络上运行完整的 Agent 工作流。
**链接**: https://blog.cloudflare.com/workers-ai-large-models/

---

### 4. How Stripe Radar helps prevent free trial abuse
**来源**: Stripe Blog
**AI 总结**: Stripe Radar 新增免费试用滥用防护功能，一键启用。Radar 预测违反常见试用条款的滥用行为 (如重复试用注册、错过取消)，准确率 90%。
**链接**: https://stripe.com/blog/how-stripe-radar-helps-prevent-free-trial-abuse

---

### 5. Testing the impact of Adaptive Pricing across 1.5M subscription checkout sessions
**来源**: Stripe Blog
**AI 总结**: Stripe 自适应定价功能现已支持订阅。自动在 150+ 国家本地化价格，Stripe 处理货币转换。在 150 万订阅结账的 A/B 测试中，转化率提高 4.7%，每会话 LTV 提高 5.4%。
**链接**: https://stripe.com/blog/adaptive-pricing-for-subscriptions

---

## 💰 投资理财

### 1. 马股 REITs 不再是收息天堂？新税制正在改变游戏规则
**来源**: 口木投资理财笔记
**AI 总结**: 马来西亚 REITs 投资环境变化。原本个人投资者只需缴纳 10% 预扣税，股息收入稳定 (5%+ 周息率)。但随着 10% 预扣税取消，股息收入回归个人所得税边际税率申报，对长期依赖马股 REITs 收息的散户影响较大。文章分析了商场 REITs 的投资逻辑 (人流稳定、租户续约、消费文化根深蒂固)，以及新税制下的应对策略。
**链接**: http://ytcinvest.blogspot.com/2026/03/reits.html

---

## 📊 统计汇总

| 分类 | 文章数 |
|------|--------|
| ⭐ GitHub Trends | 10 条 |
| 🤖 AI 前沿 | 8 条 |
| 🔥 Product Hunt | 10 条 |
| 💻 技术动态 | 5 条 |
| 💰 投资理财 | 1 条 |
| **合计** | **34 条** |

---

_生成时间：2026-03-25 09:03 UTC (17:03 GMT+8)_
