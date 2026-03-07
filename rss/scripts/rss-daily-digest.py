#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RSS 每日摘要 - 栋少专属
每天早上 9 点自动抓取 AI/技术/投资领域内容并推送
带智能摘要功能
"""

import feedparser
import json
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import socket

# 配置
OPML_FILE = "/root/.openclaw/workspace-g/rss/feeder-dongshao.opml"
OUTPUT_DIR = "/root/.openclaw/workspace-g/rss/daily"
TIMEOUT = 10  # 每个 RSS 源超时时间（秒）
MAX_WORKERS = 10  # 并发数

# 每个分类的条目数量
CATEGORY_LIMITS = {
    "🤖 AI 前沿": 8,
    "💻 技术动态": 10,
    "💰 投资理财": 5,
}

# 设置全局超时
socket.setdefaulttimeout(TIMEOUT)

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
    """抓取单个 RSS 源（带超时）"""
    try:
        print(f"  抓取: {title}")
        feed = feedparser.parse(url)
        items = []
        for entry in feed.entries[:10]:  # 每个源最多取 10 条
            published = entry.get("published", entry.get("updated", ""))
            
            # 提取摘要（优先使用 summary，其次 description）
            summary = ""
            if entry.get("summary"):
                summary = entry.get("summary", "")
            elif entry.get("description"):
                summary = entry.get("description", "")
            
            # 清理 HTML 标签
            import re
            summary = re.sub(r'<[^>]+>', '', summary)
            summary = summary.strip()[:500]  # 限制长度
            
            items.append({
                "title": entry.get("title", "无标题"),
                "link": entry.get("link", ""),
                "published": published,
                "source": title,
                "summary": summary
            })
        print(f"  ✓ {title}: {len(items)} 条")
        return items
    except Exception as e:
        print(f"  ✗ {title}: {e}")
        return []

def fetch_all_feeds(feeds):
    """并发抓取所有订阅源"""
    all_items = {}
    
    # 准备所有任务
    tasks = []
    for category, sources in feeds.items():
        all_items[category] = []
        for source in sources:
            tasks.append((category, source))
    
    # 并发执行
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_task = {
            executor.submit(fetch_feed, source["url"], source["title"]): (category, source)
            for category, source in tasks
        }
        
        for future in as_completed(future_to_task):
            category, source = future_to_task[future]
            try:
                items = future.result()
                all_items[category].extend(items)
            except Exception as e:
                print(f"  ✗ {source['title']}: {e}")
    
    # 按时间排序
    for category in all_items:
        all_items[category].sort(key=lambda x: x.get("published", ""), reverse=True)
    
    return all_items

def format_daily_digest(items, date_str):
    """格式化每日摘要"""
    digest = f"# 📰 每日 RSS 摘要 - {date_str}\n\n"
    digest += f"_生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M')}_\n\n"
    digest += f"_注：本摘要由 AI 自动抓取并整理，每个分类精选最新内容_\n\n"
    
    # 按大类分组
    for main_category, sub_categories in CATEGORIES.items():
        category_items = []
        for sub_cat in sub_categories:
            if sub_cat in items:
                category_items.extend(items[sub_cat])
        
        # 去重（按标题）
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
    
    print(f"\n✅ 摘要已保存：{output_file}")
    print(f"📊 统计：")
    for main_cat, limit in CATEGORY_LIMITS.items():
        print(f"  - {main_cat}: 最多 {limit} 条")
    
    # 输出 JSON 供后续推送使用
    json_file = OUTPUT_DIR_PATH / f"daily-{date_str}.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    
    return str(output_file)

if __name__ == "__main__":
    main()
