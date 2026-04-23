import json

with open("/root/.openclaw/workspace-g/rss/daily/daily-2026-04-23.json", "r") as f:
    all_data = json.load(f)

# The markdown file only contained a few items because of the sent items deduplication.
# I'll manually select the items shown in the markdown for AI summarization.

items_to_summarize = []

# GitHub Trends
trends = all_data.get("⭐ GitHub Trends", [])
titles = ["langfuse/langfuse", "open-metadata/OpenMetadata", "AIDC-AI/Pixelle-Video"]
for t in titles:
    for item in trends:
        if item["title"] == t:
            item["category"] = "⭐ GitHub Trends"
            items_to_summarize.append(item)
            break

# Product Hunt
ph = all_data.get("🔥 Product Hunt", [])
ph_titles = ["Seeknal", "Cavalry Studio", "Iris Studio", "Wrangle", "Zernio Ads API", "Layers", "DecisionBox Enterprise", "Cut/Storm", "Kyohansha", "Stanley For 𝕏"]
for t in ph_titles:
    for item in ph:
        if item["title"] == t:
            item["category"] = "🔥 Product Hunt"
            items_to_summarize.append(item)
            break

with open("/root/.openclaw/workspace-g/rss/daily/items_to_summarize.json", "w") as f:
    json.dump(items_to_summarize, f, ensure_ascii=False, indent=2)

print(len(items_to_summarize))
