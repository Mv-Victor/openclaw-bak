#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RSS 每日摘要 - 栋少专属
每天早上 9 点自动抓取 AI/技术/投资领域内容并推送
"""

import feedparser
import json
import requests
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import socket
import re

# 配置
OPML_FILE = "/root/.openclaw/workspace-g/rss/feeder-dongshao.opml"
OUTPUT_DIR = "/root/.openclaw/workspace-g/rss/daily"
TIMEOUT = 10
MAX_WORKERS = 10

# 每个分类的条目数量
CATEGORY_LIMITS = {
    "🤖 AI 前沿": 8,
    "💻 技术动态": 10,
    "🔥 Product Hunt": 5,
    "⭐ GitHub Trends": 5,
    "💰 投资理财": 5,
}

socket.setdefaulttimeout(TIMEOUT)

# 分类配置
CATEGORIES = {
    "🤖 AI 前沿": ["🤖 AI", "🧠 AI/ML 中文博客"],
    "💻 技术动态": ["🌐 Tech Communities", "📰 Tech News", "🏢 Big Tech Engineering", "🇨🇳 中文技术博客"],
    "🔥 Product Hunt": ["Product Hunt"],
    "⭐ GitHub Trends": ["GitHub Trending Daily", "GitHub Trending Weekly"],
    "💰 投资理财": ["💰 投资理财"],
}

def parse_opml(opml_path):
    """解析 OPML 文件"""
    import xml.etree.ElementTree as ET
    tree = ET.parse(opml_path)
    root = tree.getroot()
    
    feeds = {}
    for outline in root.findall(".//outline[@title]"):
        category = outline.get("title", "Uncategorized")
        feeds[category] = []
        for feed in outline.findall("outline[@xmlUrl]"):
            feeds[category].append({
                "title": feed.get("title", ""),
                "url": feed.get("xmlUrl", "")
            })
    return feeds

def fetch_github_trends():
    """直接从 GitHub 抓取 Trending（替代 RSSHub）"""
    try:
        print("  抓取: GitHub Trends (直接抓取)")
        url = "https://github.com/trending"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            print(f"  ✗ GitHub Trends: HTTP {response.status_code}")
            return []
        
        # 简单解析 HTML
        items = []
        lines = response.text.split('\n')
        
        for i, line in enumerate(lines):
            if 'h2 class="h3 lh-condensed"' in line or 'class="h3 lh-condensed"' in line:
                # 提取仓库名
                repo_match = re.search(r'href="(/[^"]+)"', lines[i+1] if i+1 < len(lines) else '')
                if repo_match:
                    repo_path = repo_match.group(1)
                    repo_name = repo_path.strip('/')
                    
                    # 查找描述
                    desc = ""
                    for j in range(i, min(i+20, len(lines))):
                        if '<p class="col-9' in lines[j]:
                            desc_match = re.search(r'>(.*?)</p>', lines[j])
                            if desc_match:
                                desc = desc_match.group(1).strip()
                                desc = re.sub(r'<[^>]+>', '', desc)
                                break
                    
                    items.append({
                        "title": repo_name,
                        "link": f"https://github.com{repo_path}",
                        "published": datetime.now().isoformat(),
                        "source": "GitHub Trends",
                        "summary": desc[:200] if desc else "GitHub trending repository"
                    })
                    
                    if len(items) >= 10:
                        break
        
        print(f"  ✓ GitHub Trends: {len(items)} 条")
        return items
    except Exception as e:
        print(f"  ✗ GitHub Trends: {e}")
        return []

def fetch_feed(url, title):
    """抓取单个 RSS 源"""
    try:
        print(f"  抓取: {title}")
        
        # GitHub Trends 特殊处理
        if "github/trending" in url:
            items = fetch_github_trends()
            # 返回时使用源标题作为分类键
            return (title, items)
        
        feed = feedparser.parse(url)
        items = []
        
        for entry in feed.entries[:10]:
            published = entry.get("published", entry.get("updated", ""))
            
            # 提取摘要
            summary = ""
            if entry.get("summary"):
                summary = entry.get("summary", "")
            elif entry.get("description"):
                summary = entry.get("description", "")
            
            # 清理 HTML
            summary = re.sub(r'<[^>]+>', '', summary)
            summary = summary.strip()[:500]
            
            items.append({
                "title": entry.get("title", "无标题"),
                "link": entry.get("link", ""),
                "published": published,
                "source": title,
                "summary": summary
            })
        
        print(f"  ✓ {title}: {len(items)} 条")
        return (title, items)
    except Exception as e:
        print(f"  ✗ {title}: {e}")
        return (title, [])

def fetch_all_feeds(feeds):
    """并发抓取所有订阅源"""
    all_items = {}
    
    # 准备任务
    tasks = []
    for category, sources in feeds.items():
        for source in sources:
            tasks.append(source)
    
    # 并发执行
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_source = {
            executor.submit(fetch_feed, source["url"], source["title"]): source
            for source in tasks
        }
        
        for future in as_completed(future_to_source):
            try:
                source_title, items = future.result()
                # 使用源标题作为键
                all_items[source_title] = items
            except Exception as e:
                print(f"  ✗ 处理失败: {e}")
    
    return all_items

def format_daily_digest(items, date_str):
    """格式化每日摘要"""
    digest = f"# 📰 每日 RSS 摘要 - {date_str}\n\n"
    digest += f"_生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M')}_\n\n"
    
    # 按大类分组
    for main_category, sub_categories in CATEGORIES.items():
        category_items = []
        for sub_cat in sub_categories:
            if sub_cat in items:
                category_items.extend(items[sub_cat])
        
        # 去重
        seen_titles = set()
        unique_items = []
        for item in category_items:
            if item['title'] not in seen_titles:
                seen_titles.add(item['title'])
                unique_items.append(item)
        
        # 限制数量
        limit = CATEGORY_LIMITS.get(main_category, 10)
        unique_items = unique_items[:limit]
        
        if unique_items:
            digest += f"## {main_category} ({len(unique_items)} 条)\n\n"
            for idx, item in enumerate(unique_items, 1):
                digest += f"### {idx}. {item['title']}\n\n"
                digest += f"**来源**: {item['source']}\n\n"
                if item['summary']:
                    digest += f"**摘要**: {item['summary']}\n\n"
                if item['link']:
                    digest += f"**链接**: {item['link']}\n\n"
                digest += "---\n\n"
    
    return digest

def main():
    """主函数"""
    OUTPUT_DIR_PATH = Path(OUTPUT_DIR)
    OUTPUT_DIR_PATH.mkdir(parents=True, exist_ok=True)
    
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    print(f"解析 OPML: {OPML_FILE}")
    feeds = parse_opml(OPML_FILE)
    print(f"找到 {len(feeds)} 个分类")
    
    print("开始抓取 RSS 内容...")
    items = fetch_all_feeds(feeds)
    
    digest = format_daily_digest(items, date_str)
    
    output_file = OUTPUT_DIR_PATH / f"daily-{date_str}.md"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(digest)
    
    print(f"\n✅ 摘要已保存：{output_file}")
    print(f"📊 统计：")
    for main_cat, limit in CATEGORY_LIMITS.items():
        print(f"  - {main_cat}: 最多 {limit} 条")
    
    json_file = OUTPUT_DIR_PATH / f"daily-{date_str}.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    
    return str(output_file)

if __name__ == "__main__":
    main()
