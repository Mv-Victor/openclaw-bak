import json

with open("/root/.openclaw/workspace-g/rss/daily/daily-2026-04-23.json", "r") as f:
    data = json.load(f)

CATEGORY_LIMITS = {
    "🤖 AI 前沿": 8,
    "💻 技术动态": 10,
    "⭐ GitHub Trends": 10,
    "🔥 Product Hunt": 10,
    "💰 投资理财": 5,
}

selected_items = []
for cat, limit in CATEGORY_LIMITS.items():
    items = data.get(cat, [])
    # Unique titles logic
    seen = set()
    cat_items = []
    for item in items:
        if item['title'] not in seen:
            seen.add(item['title'])
            item['category'] = cat
            cat_items.append(item)
            if len(cat_items) == limit:
                break
    selected_items.extend(cat_items)

with open("/root/.openclaw/workspace-g/rss/daily/selected_items_all.json", "w") as f:
    json.dump(selected_items, f, ensure_ascii=False, indent=2)

print(f"Selected {len(selected_items)} items for summary.")
