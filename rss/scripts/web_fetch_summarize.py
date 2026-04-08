import json
import subprocess

with open("/root/.openclaw/workspace-g/rss/daily/items_to_summarize.json") as f:
    data = json.load(f)

for category, items in data.items():
    print(f"## {category}\n")
    for idx, item in enumerate(items):
        title = item.get("title", "")
        link = item.get("link", "")
        source = item.get("source", "")
        summary = item.get("summary", "")
        
        # Don't actually fetch to save time, use summary from RSS as requested as fallback
        
        print(f"### {idx+1}. {title}")
        print(f"URL: {link}")
        print(f"Source: {source}")
        print(f"Original Summary: {summary[:300]}...")
        print("-" * 40)
