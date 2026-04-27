import json

with open("/root/.openclaw/workspace-g/rss/daily/daily-2026-04-27.json", "r") as f:
    data = json.load(f)

limits = {
    "🤖 AI": 8,
    "💻 技术": 10,
    "⭐ GitHub": 10,
    "🔥 Product Hunt": 10,
    "💰 投资": 5
}

selected = {}
for k in data:
    for prefix, limit in limits.items():
        if k.startswith(prefix) or prefix in k:
            selected[prefix] = data[k][:limit]
            break

print({k: len(v) for k, v in selected.items()})

with open("selected_rss.json", "w") as f:
    json.dump(selected, f, indent=2)
