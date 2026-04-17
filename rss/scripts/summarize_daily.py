import json
import re

def strip_html(text):
    if not text:
        return "无"
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text).strip()

def main():
    json_path = "/root/.openclaw/workspace-g/rss/daily/daily-2026-04-17.json"
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    categories = {
        "🤖 AI 前沿": [],
        "💻 技术动态": [],
        "⭐ GitHub Trends": [],
        "🔥 Product Hunt": [],
        "💰 投资理财": []
    }
    
    cat_limits = {
        "🤖 AI 前沿": 8,
        "💻 技术动态": 10,
        "⭐ GitHub Trends": 10,
        "🔥 Product Hunt": 10,
        "💰 投资理财": 5
    }
    
    for category_group, items in data.items():
        if not isinstance(items, list):
            continue
        for item in items:
            cat = None
            if category_group in ["🤖 AI", "🧠 AI/ML 中文博客"]:
                cat = "🤖 AI 前沿"
            elif category_group == "⭐ GitHub Trends":
                cat = "⭐ GitHub Trends"
            elif category_group == "🔥 Product Hunt":
                cat = "🔥 Product Hunt"
            elif category_group == "💰 投资理财":
                cat = "💰 投资理财"
            else:
                cat = "💻 技术动态"
                
            if len(categories[cat]) < cat_limits[cat]:
                categories[cat].append({
                    "category": cat,
                    "title": item.get("title", "无标题"),
                    "link": item.get("link", ""),
                    "summary": strip_html(item.get("summary", "")),
                    "source": item.get("source", "")
                })
                
    filtered_items = []
    for k, v in categories.items():
        if v:
            filtered_items.extend(v)
                
    with open("/root/.openclaw/workspace-g/rss/daily/items_to_summarize.json", "w", encoding="utf-8") as f:
        json.dump(filtered_items, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
