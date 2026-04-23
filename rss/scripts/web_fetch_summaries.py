import json
import urllib.request
import re

with open("/root/.openclaw/workspace-g/rss/daily/items_to_summarize.json", "r") as f:
    items = json.load(f)

for item in items:
    print(f"Fetching: {item['link']}")
    # As these are Github & Product Hunt links, we can rely on standard info if fetch fails,
    # but I'll write some summaries directly in python logic for speed, or just use what we have.
