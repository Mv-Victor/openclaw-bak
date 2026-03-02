#!/usr/bin/env python3
"""
小红书爆款笔记采集与分析系统 v2
修正 mcporter 调用语法
"""

import json
import subprocess
import time
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Set

WORKSPACE = Path("/root/.openclaw/workspace-g")
DATA_DIR = WORKSPACE / "xiaohongshu-data"
TODAY = datetime.now().strftime("%Y-%m-%d")
OUTPUT_FILE = DATA_DIR / f"{TODAY}.jsonl"
CRAWLED_IDS_FILE = DATA_DIR / "crawled_ids.txt"

# 搜索关键词（按受众分类）
KEYWORDS = {
    "job_hunting": [
        "秋招", "春招", "大厂", "计算机求职", "校招offer", "面试经验"
    ],
    "ai_side_hustle": [
        "AI副业", "AI赚钱", "ChatGPT变现", "Claude", "Cursor",
        "AI agent", "openclaw", "AI自动化", "AI开发", "API对接"
    ],
    "ai_video_editing": [
        "AI剪辑", "短视频制作", "剪映教程", "视频工具", "自动剪辑"
    ]
}

def load_crawled_ids() -> Set[str]:
    """加载已爬取的笔记ID"""
    if CRAWLED_IDS_FILE.exists():
        return set(line.strip() for line in CRAWLED_IDS_FILE.read_text().strip().split('\n') if line.strip())
    return set()

def save_crawled_id(note_id: str):
    """保存已爬取的笔记ID"""
    with CRAWLED_IDS_FILE.open('a') as f:
        f.write(f"{note_id}\n")

def search_notes(keyword: str) -> List[Dict]:
    """搜索小红书笔记"""
    # 修正：直接传递命令，不需要额外转义
    cmd = ['mcporter', 'call', f'xiaohongshu.search_feeds(keyword: "{keyword}")']
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            print(f"  ⚠️  搜索失败: {keyword}")
            return []
        
        data = json.loads(result.stdout)
        return data.get('feeds', [])
    except Exception as e:
        print(f"  ⚠️  搜索异常: {keyword} - {e}")
        return []

def get_note_detail(note_id: str, xsec_token: str) -> Dict:
    """获取笔记详情"""
    cmd = ['mcporter', 'call', f'xiaohongshu.get_feed_detail(feed_id: "{note_id}", xsec_token: "{xsec_token}")']
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            return {}
        
        return json.loads(result.stdout)
    except Exception:
        return {}

def parse_count(count_str: str) -> int:
    """解析互动数"""
    if not count_str:
        return 0
    
    count_str = count_str.strip()
    
    if '万' in count_str:
        num = float(count_str.replace('万', ''))
        return int(num * 10000)
    
    try:
        return int(count_str)
    except ValueError:
        return 0

def crawl_notes(min_comments: int = 100, target_count: int = 100):
    """爬取笔记"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    crawled_ids = load_crawled_ids()
    collected = []
    
    print(f"🚀 开始采集 {TODAY} 的小红书爆款笔记...")
    print(f"   筛选条件: 评论数 > {min_comments}")
    print(f"   目标数量: {target_count} 篇\n")
    
    for category, keywords in KEYWORDS.items():
        print(f"📂 分类: {category}")
        
        for keyword in keywords:
            print(f"  🔍 搜索: {keyword}")
            
            feeds = search_notes(keyword)
            print(f"     找到 {len(feeds)} 篇笔记")
            
            for feed in feeds:
                note_id = feed.get('id')
                if not note_id or note_id in crawled_ids:
                    continue
                
                note_card = feed.get('noteCard', {})
                interact_info = note_card.get('interactInfo', {})
                
                comments = parse_count(interact_info.get('commentCount', '0'))
                
                if comments < min_comments:
                    continue
                
                # 获取详情
                xsec_token = feed.get('xsecToken', '')
                detail = get_note_detail(note_id, xsec_token)
                
                if detail:
                    detail['_keyword'] = keyword
                    collected.append(detail)
                    save_crawled_id(note_id)
                    crawled_ids.add(note_id)
                    
                    title = note_card.get('displayTitle', '(无标题)')[:30]
                    print(f"  ✓ {note_id} | 评论{comments} | {title}")
                    
                    # 保存到JSONL
                    with OUTPUT_FILE.open('a') as f:
                        f.write(json.dumps(detail, ensure_ascii=False) + '\n')
                
                if len(collected) >= target_count:
                    break
            
            time.sleep(2)  # 限流
        
        if len(collected) >= target_count:
            break
    
    print(f"\n✅ 采集完成，今日新增 {len(collected)} 篇笔记")
    print(f"   数据保存至: {OUTPUT_FILE}")
    
    return collected

if __name__ == '__main__':
    crawl_notes(min_comments=100, target_count=100)
