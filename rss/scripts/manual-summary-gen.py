import json
import os
import requests
from datetime import datetime
import sys

INPUT_JSON = "/root/.openclaw/workspace-g/rss/daily/daily-2026-04-01.json"

with open(INPUT_JSON, 'r', encoding='utf-8') as f:
    data = json.load(f)

CATEGORY_LIMITS = {
    "🤖 AI 前沿": 8,
    "💻 技术动态": 10,
    "⭐ GitHub Trends": 10,
    "🔥 Product Hunt": 10,
    "💰 投资理财": 5,
}

items_to_summarize = {}

for cat, limit in CATEGORY_LIMITS.items():
    if cat in data:
        items_to_summarize[cat] = data[cat][:limit]

# Just print the data to console so I can see it and generate summaries
print(json.dumps(items_to_summarize, ensure_ascii=False, indent=2))
