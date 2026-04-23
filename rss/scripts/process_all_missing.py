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

# Read the previously sent articles so we don't repeat them
import os
sent_articles = set()
history_file = "/root/.openclaw/workspace-g/rss/daily/sent-articles.json"
if os.path.exists(history_file):
    with open(history_file, "r") as f:
        sent_articles = set(json.load(f))

# Filter out sent ones
new_items = []
for item in selected_items:
    item_id = f"{item['title']}|{item['link']}"
    if item_id not in sent_articles:
        new_items.append(item)

with open("/root/.openclaw/workspace-g/rss/daily/selected_new_items.json", "w") as f:
    json.dump(new_items, f, ensure_ascii=False, indent=2)

print(f"Selected {len(new_items)} NEW items for summary.")
