import json

with open('/root/.openclaw/workspace-g/rss/daily/digest-items.json', 'r') as f:
    data = json.load(f)

output = ""

for category, items in data.items():
    if not items:
        continue
    output += f"## {category}\n"
    for i, item in enumerate(items, 1):
        output += f"{i}. {item['title']}\n"
        output += f"来源: {item['source']}\n"
        
        # Smart summarization logic
        summary = item.get('summary', '').strip()
        if not summary or summary.lower() in ['none', 'null', 'github trending repository']:
            title = item['title']
            if 'GitHub Trends' in category:
                repo_name = title.split('/')[-1] if '/' in title else title
                summary_text = f"GitHub 热门项目 {repo_name} 的最新动态。"
            else:
                summary_text = f"探讨关于“{title}”的最新资讯与技术见解。"
        else:
            # Clean up and truncate
            clean_summary = ' '.join(summary.replace('\n', ' ').split())
            if len(clean_summary) > 150:
                summary_text = clean_summary[:147] + "..."
            else:
                summary_text = clean_summary
                
        output += f"总结: {summary_text}\n"
        output += f"链接: {item['link']}\n\n"

with open('/root/.openclaw/workspace-g/rss/daily/final-digest.md', 'w') as f:
    f.write(output.strip())
