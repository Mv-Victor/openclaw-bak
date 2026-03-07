# RSS 每日摘要定时任务配置

## 📋 任务说明

**执行时间**: 每天早上 9:00 (Asia/Shanghai)  
**执行内容**: 抓取 RSS 订阅内容，按 AI/技术/投资分类整理，推送给栋少

## 🔧 添加 Cron 任务

### 方式一：使用 OpenClaw CLI

```bash
openclaw cron add --name "RSS 每日摘要推送" \
  --schedule "0 9 * * *" \
  --timezone "Asia/Shanghai" \
  --payload-kind "agentTurn" \
  --payload-message "执行 RSS 每日摘要任务：
1. 运行 /root/.openclaw/workspace-g/rss/scripts/rss-daily-digest.py 抓取内容
2. 读取生成的 daily-YYYY-MM-DD.md 文件
3. 按 AI/技术/投资 分类整理
4. 通过飞书推送给栋少（ou_cb2118fc7fe59bf7009135bec4514e34）" \
  --session-target "isolated"
```

### 方式二：直接编辑 openclaw.json

在 `cron.jobs` 数组中添加：

```json
{
  "id": "rss-daily-digest",
  "name": "RSS 每日摘要推送",
  "enabled": true,
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * *",
    "tz": "Asia/Shanghai"
  },
  "payload": {
    "kind": "agentTurn",
    "message": "执行 RSS 每日摘要任务：\n1. 运行 /root/.openclaw/workspace-g/rss/scripts/rss-daily-digest.py 抓取内容\n2. 读取生成的 daily-YYYY-MM-DD.md 文件\n3. 按 AI/技术/投资 分类整理\n4. 通过飞书推送给栋少",
    "timeoutSeconds": 300
  },
  "sessionTarget": "isolated"
}
```

然后重启 Gateway：
```bash
openclaw gateway restart
```

### 方式三：手动执行脚本

测试脚本：
```bash
cd /root/.openclaw/workspace-g
python3 rss/scripts/rss-daily-digest.py
```

输出位置：
- Markdown: `/root/.openclaw/workspace-g/rss/daily/daily-YYYY-MM-DD.md`
- JSON: `/root/.openclaw/workspace-g/rss/daily/daily-YYYY-MM-DD.json`

## 📊 订阅源配置

**OPML 文件**: `/root/.openclaw/workspace-g/rss/feeder-dongshao.opml`

**分类结构**:
- 🤖 AI (10 个): OpenAI, DeepMind, arXiv, Hugging Face 等
- 🌐 Tech Communities (5 个): Hacker News, V2EX, LinuxDo
- 📰 Tech News (6 个): TechCrunch, The Verge, Wired, MIT TR, ITHome, 36Kr
- 🏢 Big Tech Engineering (7 个): GitHub, Netflix, AWS, Cloudflare, Vercel, Stripe, Meta
- 📈 Trends (3 个): GitHub Trends Daily/Weekly, Product Hunt
- 🇨🇳 中文技术博客 (10 个): 阮一峰，酷壳，GeekPlux, DIYgod 等
- 🧠 AI/ML 中文博客 (2 个): 深度强化学习，physixfan
- 💰 投资理财 (3 个): 口木，张琪灵，知足常乐

**总计**: 46 个订阅源

## 📬 推送格式

每天早上 9 点推送内容包含：

```
📰 每日 RSS 摘要 - YYYY-MM-DD

🤖 AI 前沿 (5 条)
- 标题 1 [来源] [链接]
- 标题 2 [来源] [链接]
...

💻 技术动态 (10 条)
- 标题 1 [来源] [链接]
...

💰 投资理财 (3 条)
- 标题 1 [来源] [链接]
...
```

## 🛠️ 脚本依赖

```bash
pip3 install feedparser
```

已安装 ✅

---

**创建时间**: 2026-03-07  
**维护**: OpenClaw Agent G
