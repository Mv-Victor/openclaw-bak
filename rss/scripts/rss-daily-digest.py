#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RSS 每日摘要 - 栋少专属
每天早上 9 点自动抓取 AI/技术/投资领域内容并推送
"""

import feedparser
import json
from datetime import datetime, timedelta
from pathlib import Path

# 配置
OPML_FILE = "/root/.openclaw/workspace-g/rss/feeder-dongshao.opml"
OUTPUT_DIR = "/root/.openclaw/workspace-g/rss/daily"
MAX_ITEMS_PER_CATEGORY = 5  # 每类最多保留 5 条

# 分类配置（只关注 AI、技术、投资）
CATEGORIES = {
    "🤖 AI 前沿": ["🤖 AI", "🧠 AI/ML 中文博客"],
    "💻 技术动态": ["🌐 Tech Communities", "📰 Tech News", "🏢 Big Tech Engineering", "🇨🇳 中文技术博客", "📈 Trends"],
    "💰 投资理财": ["💰 投资理财"],
}

def parse_opml(opml_path):
    """解析 OPML 文件，返回分类和订阅源"""
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

def fetch_feed(url, title):
    """抓取单个 RSS 源"""
    try:
        feed = feedparser.parse(url)
        items = []
        for entry in feed.entries[:10]:  # 每个源最多取 10 条
            published = entry.get("published", entry.get("updated", ""))
            items.append({
                "title": entry.get("title", "无标题"),
                "link": entry.get("link", ""),
                "published": published,
                "source": title,
                "summary": entry.get("summary", "")[:200] if entry.get("summary") else ""
            })
        return items
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

def fetch_all_feeds(feeds):
    """抓取所有订阅源"""
    all_items = {}
    for category, sources in feeds.items():
        all_items[category] = []
        for source in sources:
            items = fetch_feed(source["url"], source["title"])
            all_items[category].extend(items)
        # 按时间排序，取最新
        all_items[category].sort(key=lambda x: x.get("published", ""), reverse=True)
        all_items[category] = all_items[category][:MAX_ITEMS_PER_CATEGORY * len(sources)]
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
        
        if category_items:
            digest += f"## {main_category}\n\n"
            for item in category_items[:15]:  # 每大类最多 15 条
                digest += f"### {item['title']}\n"
                digest += f"- 📌 来源：{item['source']}\n"
                if item['link']:
                    digest += f"- 🔗 [阅读原文]({item['link']})\n"
                if item['summary']:
                    digest += f"- 📝 {item['summary']}...\n"
                digest += "\n"
            digest += "---\n\n"
    
    return digest

def main():
    """主函数"""
    # 创建输出目录
    OUTPUT_DIR_PATH = Path(OUTPUT_DIR)
    OUTPUT_DIR_PATH.mkdir(parents=True, exist_ok=True)
    
    # 日期
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    # 解析 OPML
    print(f"解析 OPML: {OPML_FILE}")
    feeds = parse_opml(OPML_FILE)
    print(f"找到 {len(feeds)} 个分类")
    
    # 抓取内容
    print("开始抓取 RSS 内容...")
    items = fetch_all_feeds(feeds)
    
    # 生成摘要
    digest = format_daily_digest(items, date_str)
    
    # 保存文件
    output_file = OUTPUT_DIR_PATH / f"daily-{date_str}.md"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(digest)
    
    print(f"✅ 摘要已保存：{output_file}")
    print(f"📊 统计：")
    for cat, cat_items in items.items():
        print(f"  - {cat}: {len(cat_items)} 条")
    
    # 输出 JSON 供后续推送使用
    json_file = OUTPUT_DIR_PATH / f"daily-{date_str}.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    
    return str(output_file)

if __name__ == "__main__":
    main()
