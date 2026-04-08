import json
import sys

def main():
    try:
        with open("/root/.openclaw/workspace-g/rss/daily/daily-2026-04-08.json") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    limits = {
        "🤖 AI 前沿": 8,
        "💻 技术动态": 10,
        "⭐ GitHub Trends": 10,
        "🔥 Product Hunt": 10,
        "💰 投资理财": 5,
    }

    selected_items = []
    
    for cat, limit in limits.items():
        if cat in data:
            items = data[cat][:limit]
            for item in items:
                selected_items.append({
                    "category": cat,
                    "title": item.get("title", ""),
                    "summary": item.get("summary", ""),
                    "link": item.get("link", ""),
                    "source": item.get("source", "")
                })

    print(json.dumps(selected_items))

if __name__ == "__main__":
    main()
