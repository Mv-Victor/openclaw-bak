import json

def main():
    try:
        with open("/root/.openclaw/workspace-g/rss/daily/daily-2026-04-08.json") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    # Map raw categories to our output categories
    CATEGORY_MAPPING = {
        "🤖 AI": "🤖 AI 前沿",
        "🧠 AI/ML 中文博客": "🤖 AI 前沿",
        "🌐 Tech Communities": "💻 技术动态",
        "📰 Tech News": "💻 技术动态",
        "🏢 Big Tech Engineering": "💻 技术动态",
        "🇨🇳 中文技术博客": "💻 技术动态",
        "⭐ GitHub Trends": "⭐ GitHub Trends",
        "🔥 Product Hunt": "🔥 Product Hunt",
        "💰 投资理财": "💰 投资理财"
    }

    limits = {
        "🤖 AI 前沿": 8,
        "💻 技术动态": 10,
        "⭐ GitHub Trends": 10,
        "🔥 Product Hunt": 10,
        "💰 投资理财": 5,
    }

    # Group by output category
    grouped_items = {k: [] for k in limits.keys()}
    
    for raw_cat, items in data.items():
        if raw_cat in CATEGORY_MAPPING:
            out_cat = CATEGORY_MAPPING[raw_cat]
            grouped_items[out_cat].extend(items)
            
    # Apply limits
    selected_items = {}
    for cat, limit in limits.items():
        if grouped_items[cat]:
            selected_items[cat] = grouped_items[cat][:limit]

    with open("/root/.openclaw/workspace-g/rss/daily/items_to_summarize.json", "w") as f:
        json.dump(selected_items, f, ensure_ascii=False, indent=2)

    for k in selected_items:
        print(f"{k}: {len(selected_items[k])} items")

if __name__ == "__main__":
    main()
