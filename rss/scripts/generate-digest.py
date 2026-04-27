import json
import urllib.request
import urllib.error
import re
from xml.sax.saxutils import unescape

def fetch_content(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=10)
        html = response.read().decode('utf-8', errors='ignore')
        # Very simple extraction: just get title and first few paragraphs of text
        text = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.IGNORECASE|re.DOTALL)
        text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE|re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = unescape(text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text[:3000] # Limit to 3000 chars for prompt
    except Exception as e:
        return ""

def process_items():
    with open('/root/.openclaw/workspace-g/rss/daily/daily-2026-04-27.json', 'r') as f:
        data = json.load(f)
        
    ai = data.get('🤖 AI', [])[:8]
    tech = data.get('🌐 Tech Communities', [])[:10]
    gh = data.get('⭐ GitHub Trends', [])[:10]
    ph = data.get('🔥 Product Hunt', [])[:10]
    money = data.get('💰 投资理财', [])[:5]
    
    all_items = {
        '🤖 AI 前沿': ai,
        '💻 技术动态': tech,
        '⭐ GitHub Trends': gh,
        '🔥 Product Hunt': ph,
        '💰 投资理财': money
    }
    
    with open('/root/.openclaw/workspace-g/rss/daily/digest-items.json', 'w') as f:
        json.dump(all_items, f, ensure_ascii=False, indent=2)

process_items()
