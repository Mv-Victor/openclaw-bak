import json
import os

with open("selected_rss.json", "r") as f:
    selected = json.load(f)

print(json.dumps(selected, indent=2, ensure_ascii=False))
