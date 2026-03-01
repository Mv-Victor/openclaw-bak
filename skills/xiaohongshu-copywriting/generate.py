#!/usr/bin/env python3
"""
小红书爆款文案生成器
基于每日采集的真实爆款案例，自动生成高互动笔记
"""

import json
import random
from pathlib import Path
from datetime import datetime

# 标题公式库
TITLE_TEMPLATES = {
    "对比测评型": [
        "{A} vs {B} vs {C}，{维度}测评",
        "{A}和{B}哪个更{形容词}？实测对比",
    ],
    "数字具体型": [
        "{时间}，投{数字1}家，面{数字2}家，{数字3}个{结果}",
        "{数字}天从{起点}到{终点}，{结果}",
    ],
    "情绪共鸣型": [
        "{动作}了{对象}，现在感觉{情绪}",
        "{场景}后，我{情绪}了...",
    ],
    "悬念问句型": [
        "{公司}{事件}？{夸张描述}？",
        "{场景}，你{动词}了吗？",
    ],
}

# 情绪词库
EMOTION_WORDS = {
    "焦虑": ["危", "被时代抛弃", "寒气入骨", "破防了", "天塌了"],
    "羡慕": ["羡慕麻了", "酸了", "赢麻了", "泼天富贵", "打工人天花板"],
    "愤怒": ["离谱", "太狠毒", "抽象", "不是？", "炸裂"],
    "悬念": ["五味杂陈", "疯狂", "接近", "开始了", "要变天"],
}

# 动词库
ACTION_VERBS = {
    "正向": ["飞升", "空降", "狂招", "抢疯", "赢麻", "起飞"],
    "负向": ["被撵跑", "跑路", "被逼", "危", "泡汤", "打骨折"],
    "中性": ["退出", "干掉", "离开", "测评", "排名", "对比"],
}

# 标签库
TAGS = {
    "基础": ["#大厂", "#求职", "#打工人"],
    "求职": ["#秋招", "#春招", "#面试", "#offer"],
    "AI": ["#AI", "#ChatGPT", "#Cursor", "#Claude"],
    "副业": ["#AI副业", "#副业赚钱", "#睡后收入", "#OpenClaw"],
    "剪辑": ["#AI剪辑", "#短视频", "#剪映", "#自动化"],
}


def generate_title(direction: str, template_type: str, **kwargs) -> str:
    """生成标题"""
    templates = TITLE_TEMPLATES.get(template_type, [])
    if not templates:
        return ""
    
    template = random.choice(templates)
    
    try:
        title = template.format(**kwargs)
        # 确保15字以内
        if len(title) > 15:
            title = title[:15] + "..."
        return title
    except KeyError:
        return ""


def generate_content(direction: str, topic: str, angle: str) -> dict:
    """生成完整文案"""
    
    # 根据方向选择情绪词
    emotion_type = {
        "求职": "焦虑",
        "AI副业": "羡慕",
        "AI剪辑": "悬念",
    }.get(direction, "焦虑")
    
    emotion = random.choice(EMOTION_WORDS[emotion_type])
    
    # 生成标题
    if angle == "数字冲击":
        title = generate_title(
            direction, "数字具体型",
            时间="28天", 数字1="152", 数字2="33", 数字3="4", 结果="50k offer"
        )
    elif angle == "对比":
        title = generate_title(
            direction, "对比测评型",
            A="字节", B="阿里", C="腾讯", 维度="打工体验"
        )
    else:
        title = generate_title(
            direction, "情绪共鸣型",
            动作="拒", 对象="一圈人才计划", 情绪=emotion
        )
    
    # 生成正文（4步框架）
    content = f"""① 事件陈述
{topic}

② 独家角度
（根据具体热点填充）

③ 利益点
这个方向的好处是：
- 技术门槛低
- 成本可控
- 可复制
- 有睡后收入

④ 情绪/引导
你怎么看？评论区聊聊～
"""
    
    # 生成标签
    tags = TAGS["基础"].copy()
    if direction == "求职":
        tags.extend(TAGS["求职"][:3])
    elif direction == "AI副业":
        tags.extend(TAGS["副业"][:3])
    elif direction == "AI剪辑":
        tags.extend(TAGS["剪辑"][:3])
    
    # 配图建议
    images = [
        "聊天记录截图",
        "数据对比图",
        "招聘信息截图",
        "文字卡片（金句）",
        "工具界面",
        "收入截图（打码）",
    ]
    
    return {
        "title": title,
        "content": content,
        "tags": tags,
        "images": images[:6],
        "emotion": emotion,
    }


def main():
    """示例：生成AI副业文案"""
    result = generate_content(
        direction="AI副业",
        topic="用Claude API开发自动化工具赚钱",
        angle="数字冲击"
    )
    
    print("=" * 50)
    print("小红书爆款文案生成结果")
    print("=" * 50)
    print(f"\n标题：{result['title']}")
    print(f"\n正文：\n{result['content']}")
    print(f"\n标签：{' '.join(result['tags'])}")
    print(f"\n配图建议：")
    for i, img in enumerate(result['images'], 1):
        print(f"  {i}. {img}")
    print(f"\n情绪词：{result['emotion']}")
    print("=" * 50)


if __name__ == "__main__":
    main()
