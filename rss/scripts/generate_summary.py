import json
import sys
import os

with open('/root/.openclaw/workspace-g/rss/daily/daily-2026-04-11.json', 'r') as f:
    data = json.load(f)

# Categories and their limits
categories = {
    "🤖 AI": 8,
    "🌐 Tech Communities": 10,
    "⭐ GitHub Trends": 10,
    "🔥 Product Hunt": 10,
    "💰 投资理财": 5
}

output = []
for cat, limit in categories.items():
    if cat in data and data[cat]:
        # Rename categories for output
        out_cat = cat
        if cat == "🤖 AI": out_cat = "🤖 AI 前沿"
        elif cat == "🌐 Tech Communities": out_cat = "💻 技术动态"
        
        output.append(f"## {out_cat}")
        for i, item in enumerate(data[cat][:limit]):
            title = item.get('title', 'Unknown Title')
            source = item.get('source', 'Unknown Source')
            link = item.get('link', '')
            summary = item.get('summary', '无')
            
            # Simple summarization strategy for this script:
            # We take the first 100-150 chars of the original summary and clean it up
            # (In a real system, we'd use an LLM API here, but for this demo script we'll just format it)
            clean_summary = summary.strip()[:150].replace('\n', ' ')
            if len(summary) > 150:
                clean_summary += "..."
                
            output.append(f"{i+1}. {title}")
            output.append(f"来源: {source}")
            output.append(f"总结: {clean_summary}")
            output.append(f"链接: {link}\n")

with open('/root/.openclaw/workspace-g/rss/daily/daily-summary.txt', 'w') as f:
    f.write('\n'.join(output))

print("Summary generated at /root/.openclaw/workspace-g/rss/daily/daily-summary.txt")
