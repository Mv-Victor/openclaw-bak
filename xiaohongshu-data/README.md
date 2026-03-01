# 小红书爆款笔记采集与分析系统

## 功能

1. **每日自动采集**: 爬取100篇高质量笔记（评论>100）
2. **去重机制**: 记录已爬取的 feed_id，避免重复
3. **分类存储**: 按日期存储 JSONL 格式数据
4. **自动分析**: 生成每日分析报告

## 使用方法

### 手动执行
```bash
cd /root/.openclaw/workspace-g
python3 scripts/crawl-xiaohongshu.py
```

### 定时任务（每日凌晨2点执行）
```bash
openclaw cron add --schedule "0 2 * * *" --task "cd /root/.openclaw/workspace-g && python3 scripts/crawl-xiaohongshu.py"
```

## 数据结构

```
xiaohongshu-data/
├── 2026-03-02.jsonl          # 每日采集的原始数据
├── 2026-03-02-analysis.md    # 每日分析报告
├── crawled_ids.txt           # 已爬取的笔记ID（去重）
└── ...
```

## 筛选标准

- **评论数**: > 100（点赞可刷，评论更真实）
- **目标数量**: 每日100篇
- **分类**: 求职/AI副业/AI剪辑

## 下一步

1. 持续采集7天数据
2. 基于数据训练文案生成模型
3. 开发 `xiaohongshu-copywriting` skill
