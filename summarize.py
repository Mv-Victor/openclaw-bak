import json

def process_file():
    try:
        with open('/root/.openclaw/workspace-g/rss/daily/daily-2026-04-20.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Count and output stats for each category
        for category, items in data.items():
            print(f"{category}: {len(items)} items")
            
        # Format the top items for each requested category
        # 🤖 AI 前沿：最多 8 条
        # 💻 技术动态：最多 10 条
        # ⭐ GitHub Trends：最多 10 条
        # 🔥 Product Hunt：最多 10 条
        # 💰 投资理财：最多 5 条
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    process_file()
