import json

with open('/root/.openclaw/workspace-g/rss/daily/daily-2026-04-12.json', 'r') as f:
    data = json.load(f)

print("AI 前沿 (max 8):")
if '🤖 AI' in data:
    for item in data['🤖 AI'][:8]:
        print(f"- {item['title']} ({item['source']})")
        print(f"  {item['link']}")
        print(f"  {item.get('summary', '无')[:100]}...")

print("\n技术动态 (max 10):")
if '🌐 Tech Communities' in data:
    for item in data['🌐 Tech Communities'][:10]:
        print(f"- {item['title']} ({item['source']})")
        print(f"  {item['link']}")
        print(f"  {item.get('summary', '无')[:100]}...")

print("\nGitHub Trends (max 10):")
if '⭐ GitHub Trends' in data:
    for item in data['⭐ GitHub Trends'][:10]:
        print(f"- {item['title']} ({item['source']})")
        print(f"  {item['link']}")
        print(f"  {item.get('summary', '无')[:100]}...")

print("\nProduct Hunt (max 10):")
if '🔥 Product Hunt' in data:
    for item in data['🔥 Product Hunt'][:10]:
        print(f"- {item['title']} ({item['source']})")
        print(f"  {item['link']}")
        print(f"  {item.get('summary', '无')[:100]}...")

print("\n投资理财 (max 5):")
if '💰 Finance & Investment' in data:
    for item in data['💰 Finance & Investment'][:5]:
        print(f"- {item['title']} ({item['source']})")
        print(f"  {item['link']}")
        print(f"  {item.get('summary', '无')[:100]}...")
elif '📈 商业与投资' in data:
    for item in data['📈 商业与投资'][:5]:
        print(f"- {item['title']} ({item['source']})")
        print(f"  {item['link']}")
        print(f"  {item.get('summary', '无')[:100]}...")
