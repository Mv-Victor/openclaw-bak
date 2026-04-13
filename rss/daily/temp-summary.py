import json

with open('/root/.openclaw/workspace-g/rss/daily/daily-2026-04-13.json') as f:
    data = json.load(f)

for k, v in data.items():
    print(k, len(v))
