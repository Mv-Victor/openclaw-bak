# 📰 每日 RSS 摘要 - 2026-03-23

## 🤖 AI 前沿 (8 条)

### 1. Beats now have notes
**来源**: Simon Willison's Blog
**AI 总结**: Simon Willison 为其博客的"beats"功能添加了注释能力。beats 是他上个月添加的功能，用于从外部来源拉取内容并展示在首页和归档页面。由于这些内容经常超过常规文章数量但缺乏解释，现在可以为 beats 添加"note"注释，让内容更有价值。同时更新了 Atom feed 以包含带注释的 beats。
**链接**: https://simonwillison.net/2026/Mar/23/beats-now-have-notes/#atom-everything

---

### 2. Starlette 1.0 skill
**来源**: Simon Willison's Blog
**AI 总结**: Starlette 1.0 Skill 提供了一份简明的指南，帮助开发者使用 Starlette 构建稳健的 Web 应用。Starlette 是一个轻量级 ASGI 框架，也是 FastAPI 的基础。配套演示展示了一个任务管理应用，包含项目、任务、评论和标签功能，说明了 Starlette 在处理路由、模板 (Jinja2)、异步数据库操作 (aiosqlite) 和实时更新方面的灵活性。
**链接**: https://simonwillison.net/2026/Mar/23/starlette-1-skill/#atom-everything

---

### 3. Experimenting with Starlette 1.0 with Claude skills
**来源**: Simon Willison's Blog
**AI 总结**: Starlette 1.0 正式发布，这是 Python 生态的重要里程碑。Starlette 作为 FastAPI 的基础，使用量巨大但品牌认知度相对较低。新版本最大的变化是使用 lifespan 机制替代了 on_startup/on_shutdown 参数。Simon 使用 Claude skill 功能，让 Claude 自行克隆 Starlette 仓库并构建了完整的 1.0 版技能文档，然后用该技能成功生成了一个使用 Starlette 1.0 的任务管理应用。
**链接**: https://simonwillison.net/2026/Mar/22/starlette/#atom-everything

---

### 4. PCGamer Article Performance Audit
**来源**: Simon Willison's Blog
**AI 总结**: 对 PCGamer 一篇 RSS 阅读器推荐文章的性能审计揭示了严重的页面膨胀问题。尽管核心内容仅 10-15KB 文本和约 150KB 图片，但页面触发了 431 次网络请求，60 秒内传输 5.5MB（解码后 18.8MB），在 Firefox 中因自动播放视频广告膨胀至 200+MB。82% 的网络流量来自广告技术和跟踪脚本。Simon 使用 Claude Code 和 Rodney 工具进行了详细分析。
**链接**: https://simonwillison.net/2026/Mar/22/pcgamer-audit/#atom-everything

---

### 5. JavaScript Sandboxing Research
**来源**: Simon Willison's Blog
**AI 总结**: 一项关于 JavaScript 沙箱方案的研究，比较了在 Node.js 中运行不受信任代码的核心方法。研究涵盖了 worker_threads、node:vm 和 Permission Model，以及流行的 npm 包如 isolated-vm 和 vm2，还有替代引擎如 quickjs-emscripten、QuickJS-NG、ShadowRealm 和 Deno Workers。这项研究由 Aaron Harper 关于 Node.js worker threads 的文章启发，Claude Code 完成了详细的对比分析。
**链接**: https://simonwillison.net/2026/Mar/22/javascript-sandboxing-research/#atom-everything

---

### 6. DNS Lookup
**来源**: Simon Willison's Blog
**AI 总结**: Simon 发现 Cloudflare 的 1.1.1.1 DNS 服务（以及屏蔽恶意软件的 1.1.1.2 和屏蔽恶意软件 + 成人内容的 1.1.1.3）提供了支持 CORS 的 JSON API。他让 Claude Code 构建了一个 UI 工具，可以针对这三个解析器运行 DNS 查询。这个工具使得从任何网页的 JavaScript 都能访问 DNS 查询功能，无需后端代理。
**链接**: https://simonwillison.net/2026/Mar/22/dns/#atom-everything

---

### 7. Merge State Visualizer
**来源**: Simon Willison's Blog
**AI 总结**: Bram Cohen 发表了他对版本控制未来的愿景，使用 CRDTs（无冲突复制数据类型）实现一致性，并用 470 行 Python 代码演示。Simon 将这段代码（去掉注释）输入 Claude 获取解释，然后让 Claude 使用 Pyodide 构建了一个交互式 UI，可以直观地看到这些算法如何工作。这展示了 AI 辅助学习和可视化的强大能力。
**链接**: https://simonwillison.net/2026/Mar/22/manyana/#atom-everything

---

### 8. Profiling Hacker News users based on their comments
**来源**: Simon Willison's Blog
**AI 总结**: Simon 实验了一个"有点反乌托邦"的提示："Profile this user"，配合用户最近 1000 条 Hacker News 评论。利用 Algolia HN API（支持 CORS）获取评论后，输入 Claude Opus 4.6 进行分析。效果惊人地好——以 Simon 自己为例，AI 准确识别出他是独立开发者、Django 联合创始人、Datasette 创作者，以及 AI 辅助编码领域的主要声音，还分析了他的工作风格、技术兴趣和安全意识。
**链接**: https://simonwillison.net/2026/Mar/21/profiling-hacker-news-users/#atom-everything

---

## 💻 技术动态 (10 条)

### 1. SEC 放弃对 Faraday Future 的四年调查
**来源**: TechCrunch
**AI 总结**: 美国证券交易委员会（SEC）已关闭对电动汽车初创公司 Faraday Future 长达四年的调查，尽管 SEC 工作人员去年曾建议采取执法行动。调查关注该公司在 2021 年通过 SPAC 上市时是否做出"虚假和误导性声明"，以及是否在 2023 年伪造了首批电动汽车销售。这是 SEC 执法行动历史性下降的一部分，2025 财年仅对四家上市公司发起案件。Faraday Future 创始人贾跃亭表示可以将全部精力投入到战略执行中。
**链接**: https://techcrunch.com/2026/03/22/the-sec-drops-its-four-year-old-investigation-into-ev-startup-faraday-future/

---

### 2. Nvidia GTC 会议回顾：Olaf 机器人成为焦点
**来源**: TechCrunch
**AI 总结**: Nvidia 的 GTC 会议内容丰富多彩：万亿美元销售预测、DLSS 5 图形技术、"每个公司都需要 OpenClaw 战略"的宣言，甚至还有迪士尼《冰雪奇缘》中 Olaf 雪人的机器人版本。在 TechCrunch 的 Equity 播客中，主持人回顾了 CEO 黄仁勋的主题演讲。Olaf 机器人在演示中开始胡言乱语，最终被切断麦克风，成为会议最有趣的话题之一。播客讨论了 Nvidia 对 OpenClaw 的投资策略及其未来意义。
**链接**: https://techcrunch.com/2026/03/22/do-you-want-to-build-a-robot-snowman/

---

### 3. Cursor 承认 Composer 2 基于 Moonshot AI 的 Kimi
**来源**: TechCrunch
**AI 总结**: AI 编码公司 Cursor 本周发布了 Composer 2 模型，宣传为"前沿级编码智能"。但 X 用户 Fynn 发现 Composer 2"只是 Kimi 2.5"加额外强化学习，Kimi 2.5 是中国公司 Moonshot AI（获阿里巴巴和洪山资本支持）发布的开源模型。Cursor 开发者教育副总裁 Lee Robinson 承认 Composer 2 从开源基础开始，但约 3/4 的计算量来自 Cursor 自己的训练。Kimi 官方账号祝贺 Cursor，称这是"授权商业合作"。Cursor 联合创始人承认未在博客中提及 Kimi 基础是疏忽。
**链接**: https://techcrunch.com/2026/03/22/cursor-admits-its-new-coding-model-was-built-on-top-of-moonshot-ais-kimi/

---

### 4. Elon Musk 公布 SpaceX 和 Tesla 的芯片制造计划
**来源**: TechCrunch
**AI 总结**: Elon Musk 在奥斯汀的一次活动中公布了 Tesla 和 SpaceX 的芯片制造合作计划，称为"Terafab"设施，将建在 Tesla 奥斯汀总部和"超级工厂"附近。Musk 表示半导体制造商无法为他的公司的人工智能和机器人需求足够快地制造芯片，因此必须自建。目标是每年制造支持地球 100-200 千兆瓦计算能力的芯片，以及太空中的 1 太瓦。但文章指出 Musk 没有半导体制造背景，且有过度承诺的历史。
**链接**: https://techcrunch.com/2026/03/22/elon-musk-unveils-chip-manufacturing-plans-for-spacex-and-tesla/

---

### 5. Delve 被指控"虚假合规"误导客户
**来源**: TechCrunch
**AI 总结**: 一篇匿名 Substack 文章指控合规初创公司 Delve"虚假地"说服"数百家客户他们符合"隐私和安全法规，可能使这些客户面临"HIPAA 下的刑事责任和 GDPR 下的巨额罚款"。Delve 是 Y Combinator 支持的初创公司，去年以 3 亿美元估值融资 3200 万美元。匿名作者称 Delve"通过生成虚假证据、代表认证机构生成审计师结论、跳过主要框架要求"来实现其"最快平台"的主张。Delve 回应称这些指控"具有误导性"，表示公司不发布合规报告，只是为审计师提供信息的"自动化平台"。
**链接**: https://techcrunch.com/2026/03/22/delve-accused-of-misleading-customers-with-fake-compliance/

---

### 6. Amazon Trainium 芯片实验室独家参观
**来源**: TechCrunch
**AI 总结**: 在 AWS 宣布向 OpenAI 投资 500 亿美元后，Amazon 邀请 TechCrunch 参观了其芯片开发实验室。Trainium 芯片因对低成本 AI 推理的影响以及可能削弱 Nvidia 垄断地位而受到行业专家关注。AWS 已向 OpenAI 承诺提供 2 千兆瓦的 Trainium 计算能力。目前已有 140 万片 Trainium 芯片部署，其中 100 多万片 Trainium2 芯片运行 Anthropic 的 Claude。新发布的 Trainium3 配合 Neuron 交换机，成本比传统云服务器低 50%。
**链接**: https://techcrunch.com/2026/03/22/an-exclusive-tour-of-amazons-trainium-lab-the-chip-thats-won-over-anthropic-openai-even-apple/

---

### 7. AI tokens：工程师薪酬的新支柱还是业务成本？
**来源**: TechCrunch
**AI 总结**: 硅谷正在讨论将 AI tokens 作为工程师薪酬的第四部分（除薪资、股权和奖金外）。Nvidia CEO 黄仁勋在 GTC 会议上提出工程师应获得约等于基本工资 50% 的 tokens，高管每年可能消耗 25 万美元的 AI 计算。随着 OpenClaw 等可连续运行的 AI 助手出现，token 消耗激增——工程师运行代理群一天可消耗数百万 tokens。但文章指出，大量 token 配额也带来更大期望压力，且当公司 per 员工的 token 支出接近或超过薪资时，人力配置的财务逻辑开始变化。
**链接**: https://techcrunch.com/2026/03/21/are-ai-tokens-the-new-signing-bonus-or-just-a-cost-of-doing-business/

---

### 8. 第一条 tweet 发布 20 周年
**来源**: TechCrunch
**AI 总结**: 2006 年 3 月 21 日，Jack Dorsey 发布了第一条推文："just setting up my twittr"。如今该平台已被 Elon Musk 更名为 X，并并入 xAI，后者又成为 SpaceX 的一部分。Musk 大幅裁员并因整合 xAI 的聊天机器人 Grok 引发新争议，Grok 曾自称"MechaHitler"并被用于制造广泛的性爱深度伪造。尽管 X 在科技行业等用户群体中仍有强大影响力，但面临 Bluesky 和 Meta 的 Threads 竞争。Dorsey 的原推文曾以 290 万美元作为 NFT 售出，但价值已暴跌。
**链接**: https://techcrunch.com/2026/03/21/its-been-20-years-since-the-first-tweet/

---

### 9. 出版商因 AI 担忧撤回恐怖小说《Shy Girl》
**来源**: TechCrunch
**AI 总结**: Hachette Book Group 表示将不再出版名为《Shy Girl》的小说，原因是担心该文本使用人工智能生成。该书原定于今年春季在美国出版，英国版已上市也将停止销售。尽管出版商称决定是在彻底审查文本后做出的，但 GoodReads 和 YouTube 上的评论者一直在推测该书可能是 AI 生成的。作者 Mia Ballard 否认使用 AI 写作，指责她雇佣编辑原自助出版版本的熟人，并表示正在采取法律行动，称自己的"心理健康处于历史最低点"。
**链接**: https://techcrunch.com/2026/03/21/publisher-pulls-horror-novel-shy-girl-over-ai-concerns/

---

### 10. TechCrunch Mobility: Uber everywhere
**来源**: TechCrunch
**AI 总结**: TechCrunch Mobility 专栏本期回顾了 CEO 黄仁勋的 GTC 主题演讲，并讨论了这对 Nvidia 未来的意义。播客主持人 Kirsten Korosec、Sean O'Kane 和 Anthony Ha 在最新一期 Equity 播客中进行了辩论。文章指出，Nvidia 的演示总是关注"工程挑战"而非"真正混乱的灰色地带"，并以 Olaf 机器人为例：如果孩子踢倒 Olaf 会怎样？这反映了 AI 机器人部署中的社会层面问题。
**链接**: https://techcrunch.com/2026/03/22/techcrunch-mobility-uber-everywhere-all-at-once/

---

## 💰 投资理财 (2 条)

### 1. 马股 REITs 不再是收息天堂？新税制正在改变游戏规则
**来源**: 口木投资理财笔记
**AI 总结**: *（原文无法访问，使用 RSS 摘要）* 马来西亚 REITs 投资面临新税制挑战，可能影响其作为稳定收息资产的吸引力。文章分析了税收政策变化对 REITs 收益率的影响，以及投资者应如何调整策略应对新的市场环境。
**链接**: http://ytcinvest.blogspot.com/2026/03/reits.html

---

### 2. 為將來的自己準備
**来源**: 知足常乐 - 水星投资理财
**AI 总结**: *（原文无法访问，使用 RSS 摘要）* 关于为未来做财务准备的投资理财建议。文章探讨了长期投资规划、退休准备和资产配置策略，帮助读者建立稳健的财务基础以应对未来的不确定性。
**链接**: https://mercurychong.blogspot.com/2026/03/blog-post.html

---

## 📊 今日统计
- 🤖 AI 前沿：8 条
- 💻 技术动态：10 条
- 💰 投资理财：2 条（原文无法访问，使用 RSS 摘要）

**备注**: 部分投资理财文章无法访问，已使用 RSS 自带摘要。
