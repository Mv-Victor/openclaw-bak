import json
import urllib.request
import ssl
import json
import os
import time

API_KEY = "sk-KHIfZFZh5ke7U6mME6qUAizCxG1uZQfwbrKB9iq6ShB8ufpq"
API_URL = "https://xchai.xyz/v1/messages"

with open("selected_rss.json", "r") as f:
    data = json.load(f)

def get_summary(text):
    if not text or len(text) < 10:
        return "无内容"
        
    payload = {
        "model": "claude-sonnet-4-6",
        "max_tokens": 150,
        "system": "你是一个 AI 摘要助手。请将以下内容精炼、准确地总结在100字以内，直接给出结论。",
        "messages": [
            {"role": "user", "content": text[:1000]}
        ]
    }
    
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01"
    }
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        req = urllib.request.Request(API_URL, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
        response = urllib.request.urlopen(req, context=ctx, timeout=10)
        result = json.loads(response.read().decode('utf-8'))
        return result['content'][0]['text'].strip()
    except Exception as e:
        print(f"Error calling API: {e}")
        return text[:100] + "..."

output_md = "📰 RSS 每日摘要推送\n\n"

for category, items in data.items():
    output_md += f"## {category}\n\n"
    for i, item in enumerate(items, 1):
        print(f"Summarizing {category} - {item['title']}...")
        title = item.get('title', '无标题')
        link = item.get('link', '')
        source = item.get('source', '未知')
        
        # fallback to summary if web fetch is too complex here
        content_to_summarize = item.get('summary', '')
        if not content_to_summarize:
            content_to_summarize = title
            
        summary = get_summary(content_to_summarize)
        
        output_md += f"{i}. {title}\n"
        output_md += f"来源: {source}\n"
        output_md += f"总结: {summary}\n"
        output_md += f"链接: {link}\n\n"

with open("final_summary.md", "w") as f:
    f.write(output_md)
    
print("Done. Saved to final_summary.md")
