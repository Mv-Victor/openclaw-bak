#!/usr/bin/env python3
"""
小红书爆款笔记采集与分析系统
每日爬取100篇高质量笔记，去重存储，持续沉淀经验
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
ANALYSIS_FILE = DATA_DIR / f"{TODAY}-analysis.md"

# 搜索关键词（3个受众方向）
KEYWORDS = {
    "job_hunting": [
        "秋招", "春招", "大厂", "计算机求职", "校招offer", 
        "面试经验", "求职攻略", "互联网公司", "技术岗位"
    ],
    "ai_side_hustle": [
        "AI副业", "AI赚钱", "ChatGPT变现", "AI工具", 
        "副业收入", "AI自媒体", "AI开发", "睡后收入"
    ],
    "ai_video_editing": [
        "AI剪辑", "短视频制作", "剪映教程", "视频剪辑", 
        "AI视频", "自动剪辑", "视频工具", "剪辑技巧"
    ]
}

def load_crawled_ids() -> Set[str]:
    """加载已爬取的笔记ID"""
    if CRAWLED_IDS_FILE.exists():
        return set(CRAWLED_IDS_FILE.read_text().strip().split('\n'))
    return set()

def save_crawled_id(note_id: str):
    """保存已爬取的笔记ID"""
    with CRAWLED_IDS_FILE.open('a') as f:
        f.write(f"{note_id}\n")

def search_notes(keyword: str) -> List[Dict]:
    """搜索小红书笔记"""
    cmd = f'mcporter call \'xiaohongshu.search_feeds(keyword: "{keyword}")\''
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    
    if result.returncode != 0:
        print(f"  ⚠️  搜索失败: {keyword}")
        return []
    
    try:
        data = json.loads(result.stdout)
        return data.get('feeds', [])
    except json.JSONDecodeError:
        return []

def get_note_detail(note_id: str, xsec_token: str) -> Dict:
    """获取笔记详情"""
    cmd = f'mcporter call \'xiaohongshu.get_feed_detail(feed_id: "{note_id}", xsec_token: "{xsec_token}")\''
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    
    if result.returncode != 0:
        return {}
    
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        return {}

def parse_count(count_str: str) -> int:
    """解析互动数（处理"1.5万"等格式）"""
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
                    detail['_category'] = category
                    detail['_keyword'] = keyword
                    collected.append(detail)
                    save_crawled_id(note_id)
                    crawled_ids.add(note_id)
                    
                    title = note_card.get('displayTitle', '(无标题)')[:30]
                    print(f"    ✓ {note_id} | 评论{comments} | {title}")
                    
                    # 保存到JSONL
                    with OUTPUT_FILE.open('a') as f:
                        f.write(json.dumps(detail, ensure_ascii=False) + '\n')
                    
                    if len(collected) >= target_count:
                        break
                
                time.sleep(2)  # 限流
            
            if len(collected) >= target_count:
                break
        
        if len(collected) >= target_count:
            break
    
    print(f"\n✅ 采集完成，今日新增 {len(collected)} 篇笔记")
    print(f"   数据保存至: {OUTPUT_FILE}")
    
    return collected

def analyze_notes(notes: List[Dict]):
    """分析笔记，提取爆款要素"""
    if not notes:
        print("⚠️  无数据可分析")
        return
    
    analysis = {
        'date': TODAY,
        'total': len(notes),
        'by_category': {},
        'top_titles': [],
        'top_tags': {},
        'insights': []
    }
    
    # 按分类统计
    for note in notes:
        category = note.get('_category', 'unknown')
        if category not in analysis['by_category']:
            analysis['by_category'][category] = 0
        analysis['by_category'][category] += 1
        
        # 提取标题
        note_data = note.get('data', {}).get('note', {})
        title = note_data.get('title', '')
        interact = note_data.get('interactInfo', {})
        
        if title:
            analysis['top_titles'].append({
                'title': title,
                'likes': interact.get('likedCount', '0'),
                'comments': interact.get('commentCount', '0'),
                'collects': interact.get('collectedCount', '0')
            })
    
    # 生成分析报告
    report = f"""# 小红书爆款笔记分析报告

**日期**: {TODAY}  
**采集数量**: {len(notes)} 篇  
**筛选标准**: 评论数 > 100

---

## 分类统计

"""
    
    for cat, count in analysis['by_category'].items():
        report += f"- **{cat}**: {count} 篇\n"
    
    report += "\n---\n\n## 高互动笔记\n\n"
    
    for item in analysis['top_titles'][:20]:
        report += f"### {item['title']}\n"
        report += f"- 点赞: {item['likes']} | 评论: {item['comments']} | 收藏: {item['collects']}\n\n"
    
    ANALYSIS_FILE.write_text(report, encoding='utf-8')
    print(f"📊 分析报告已生成: {ANALYSIS_FILE}")

if __name__ == '__main__':
    notes = crawl_notes(min_comments=100, target_count=100)
    analyze_notes(notes)
