import json

def process():
    with open('/root/.openclaw/workspace-g/rss/daily/daily-2026-04-20.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    targets = {
        "🤖 AI": 8,
        "🌐 Tech Communities": 5, # Will combine with Tech News for 技术动态
        "📰 Tech News": 5,
        "⭐ GitHub Trends": 10,
        "🔥 Product Hunt": 10,
        "💰 投资理财": 5
    }
    
    with open('to_summarize.txt', 'w', encoding='utf-8') as out:
        out.write("请为以下RSS文章生成每日摘要。每篇提炼100-200字，要求一针见血，准确精炼，有价值。格式如任务要求。\n\n")
        
        # AI
        out.write("## 🤖 AI 前沿\n\n")
        for i, item in enumerate(data.get("🤖 AI", [])[:targets["🤖 AI"]]):
            out.write(f"标题: {item['title']}\n来源: {item['source']}\n链接: {item['link']}\n原摘要: {item.get('summary', '无')}\n\n")
            
        # Tech
        out.write("## 💻 技术动态\n\n")
        tech_count = 0
        for item in data.get("🌐 Tech Communities", [])[:5]:
            out.write(f"标题: {item['title']}\n来源: {item['source']}\n链接: {item['link']}\n原摘要: {item.get('summary', '无')}\n\n")
            tech_count += 1
            
        for item in data.get("📰 Tech News", [])[:5]:
            out.write(f"标题: {item['title']}\n来源: {item['source']}\n链接: {item['link']}\n原摘要: {item.get('summary', '无')}\n\n")
            tech_count += 1
            
        # GitHub
        out.write("## ⭐ GitHub Trends\n\n")
        for i, item in enumerate(data.get("⭐ GitHub Trends", [])[:targets["⭐ GitHub Trends"]]):
            out.write(f"标题: {item['title']}\n来源: {item['source']}\n链接: {item['link']}\n原摘要: {item.get('summary', '无')}\n\n")
            
        # Product Hunt
        out.write("## 🔥 Product Hunt\n\n")
        for i, item in enumerate(data.get("🔥 Product Hunt", [])[:targets["🔥 Product Hunt"]]):
            out.write(f"标题: {item['title']}\n来源: {item['source']}\n链接: {item['link']}\n原摘要: {item.get('summary', '无')}\n\n")
            
        # Money (if any)
        out.write("## 💰 投资理财\n\n")
        for i, item in enumerate(data.get("💰 投资理财", [])[:targets["💰 投资理财"]]):
            out.write(f"标题: {item['title']}\n来源: {item['source']}\n链接: {item['link']}\n原摘要: {item.get('summary', '无')}\n\n")

if __name__ == "__main__":
    process()
