import json
import sys

with open('/root/.openclaw/workspace-g/rss/daily/digest-items.json', 'r') as f:
    data = json.load(f)

prompt = """
请作为资深技术编辑，为以下 RSS 抓取的文章生成一份每日摘要总结。
要求：
1. 总结要准确、精炼、有价值（100-200字内），一针见血。
2. 遇到没有实质内容的，直接总结标题。
3. 不要只复制自带的无用描述。
4. 严格使用以下格式：

## [分类名]
1. 标题
来源: XXX
总结: [总结内容]
链接: [原文链接]
"""

prompt += "\n\n### 需要总结的内容：\n\n"

for category, items in data.items():
    prompt += f"==== {category} ====\n"
    for i, item in enumerate(items, 1):
        prompt += f"[{i}] {item['title']}\n"
        prompt += f"Source: {item['source']}\n"
        prompt += f"Link: {item['link']}\n"
        summary = item.get('summary', '').replace('\n', ' ').strip()
        if len(summary) > 500:
            summary = summary[:500] + "..."
        prompt += f"Text: {summary}\n\n"

with open('/root/.openclaw/workspace-g/rss/daily/prompt.txt', 'w') as f:
    f.write(prompt)
