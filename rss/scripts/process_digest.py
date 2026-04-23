import json
import urllib.request
from datetime import datetime

def fetch_content(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            return True
    except:
        return False

# We'll just read the JSON and select the items as specified.
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
    for item in items[:limit]:
        item['category'] = cat
        selected_items.append(item)

with open("/root/.openclaw/workspace-g/rss/daily/selected_items.json", "w") as f:
    json.dump(selected_items, f, ensure_ascii=False, indent=2)

print(f"Selected {len(selected_items)} items for summary.")
