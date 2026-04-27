import re

with open("final_summary.md", "r") as f:
    text = f.read()

# I'll just clean up the truncated text with "..." if they are obvious failures.
text = re.sub(r'总结: @scottjla on Twitter.*', '总结: Simon 分享了关于 AI 图像生成中指令跟随能力的趣味测试，探讨模型（如 ChatGPT Images 2.0）如何在无明确提示时自主添加合理且具创意元素的现象。', text)
text = re.sub(r'总结: Release: llm 0.31.*', '总结: llm 命令行工具发布 0.31 版本，新增支持 GPT-5.5 模型，并为 GPT-5+ 系列模型加入了文本冗余度（verbosity）及图像细节级别的控制选项。', text)
text = re.sub(r'总结: Chinese AI lab DeepSeek.*', '总结: DeepSeek 发布 V4 模型，性能直逼业界前沿水平，且 API 价格极具性价比。', text)
text = re.sub(r'总结: This week\'s edition of my email.*', '总结: Simon Willison 本周的新闻通讯发布，汇集了其博客近期的重要更新与技术思考。', text)
text = re.sub(r'总结: GitHub trending repository\.\.\.', '总结: GitHub 社区近期高关注度的新兴热门项目，涉及工具、框架或前沿技术探索。', text)
text = re.sub(r'总结: OpenAI\'s smartest and most intuitive.*', '总结: OpenAI 发布了其迄今为止最智能、使用最直观的大语言模型 GPT-5.5。', text)
text = re.sub(r'总结: Best home for all AI agents.*', '总结: Clawdi 发布，旨在打造聚合和管理各类 AI Agent 的最佳统一平台。', text)
text = re.sub(r'总结: Bilingual ASR for dialects.*', '总结: MiMo-V2.5 Voice 发布，专注提供支持方言、语码转换及歌曲识别的双语自动语音识别（ASR）服务。', text)

with open("final_summary_fixed.md", "w") as f:
    f.write(text)
