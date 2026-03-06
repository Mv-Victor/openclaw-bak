# Web Crawler Skill

整合 Agent Reach + FlareSolverr + Scrapling 的网页爬虫技能。

## 触发条件

当用户提到：
- "爬取网页"
- "抓取数据"
- "爬虫"
- "scrape"
- "crawl"
- "提取网页内容"
- "批量抓取"
- "反反爬虫"

## 核心能力

### 1. 简单网页读取（优先）
使用 Jina Reader 快速读取任意网页：
```bash
curl -s "https://r.jina.ai/URL" -H "Accept: text/markdown"
```

### 2. 反反爬虫（FlareSolverr）
处理 Cloudflare、Akamai 等防护：
```bash
# 启动 FlareSolverr 服务
cd /root/.openclaw/workspace-g/FlareSolverr
python3 src/main.py --port 8191

# 调用示例（Python）
import requests

response = requests.post('http://localhost:8191/v1', json={
    "cmd": "request.get",
    "url": "https://example.com",
    "maxTimeout": 60000
})
print(response.json()['solution']['response'])
```

### 3. 现代爬虫框架（Scrapling）
复杂网页抓取、数据提取：
```python
from scrapling import Fetcher

fetcher = Fetcher()
page = fetcher.get('https://example.com')

# CSS 选择器
titles = page.css('h1.title::text').getall()

# XPath
links = page.xpath('//a/@href').getall()

# 自动重试、代理支持
fetcher = Fetcher(auto_retry=True, proxy='http://proxy:port')
```

## 使用策略（按顺序尝试）

### Level 1: Agent Reach（最简单）
```bash
# 任意网页
curl -s "https://r.jina.ai/URL"

# 搜索
curl -s "https://s.jina.ai/query"
```

**适用场景**：普通网页、无防护、快速读取

### Level 2: FlareSolverr（有防护）
```python
import requests

def fetch_with_flaresolverr(url):
    response = requests.post('http://localhost:8191/v1', json={
        "cmd": "request.get",
        "url": url,
        "maxTimeout": 60000
    })
    if response.json()['status'] == 'ok':
        return response.json()['solution']['response']
    raise Exception("FlareSolverr failed")
```

**适用场景**：Cloudflare 保护、Akamai、DDoS-Guard

### Level 3: Scrapling（复杂抓取）
```python
from scrapling import Fetcher

def scrape_with_scrapling(url, selector=None):
    fetcher = Fetcher(auto_retry=True, headless=True)
    page = fetcher.get(url)
    
    if selector:
        return page.css(selector).getall()
    return page.text
```

**适用场景**：动态内容、需要 JS 渲染、复杂数据提取

## 快速开始

### 安装检查
```bash
# 检查 Scrapling
python3 -c "from scrapling import Fetcher; print('Scrapling OK')"

# 检查 FlareSolverr
ls /root/.openclaw/workspace-g/FlareSolverr/src/main.py

# 检查 Agent Reach
agent-reach doctor
```

### 启动 FlareSolverr 服务
```bash
cd /root/.openclaw/workspace-g/FlareSolverr
nohup python3 src/main.py --port 8191 > /tmp/flaresolverr.log 2>&1 &
```

## 示例用法

### 示例 1: 读取普通网页
```bash
curl -s "https://r.jina.ai/https://github.com/trending"
```

### 示例 2: 爬取 Cloudflare 保护的网站
```python
import requests

response = requests.post('http://localhost:8191/v1', json={
    "cmd": "request.get",
    "url": "https://protected-site.com"
})
html = response.json()['solution']['response']
```

### 示例 3: 批量抓取数据
```python
from scrapling import Fetcher

urls = ['https://site.com/page1', 'https://site.com/page2']
fetcher = Fetcher(auto_retry=True)

for url in urls:
    page = fetcher.get(url)
    title = page.css('h1::text').get()
    print(f"{title}: {url}")
```

## 故障排查

### Jina Reader 失败
- 检查 URL 是否可公开访问
- 尝试 FlareSolverr

### FlareSolverr 失败
- 确保服务运行：`curl http://localhost:8191/health`
- 检查日志：`cat /tmp/flaresolverr.log`
- 增加 timeout：`"maxTimeout": 120000`

### Scrapling 失败
- 检查选择器是否正确
- 尝试 headless=False 调试
- 添加 proxy 如果 IP 被封锁

## 配置代理（可选）

```bash
# 配置到 Agent Reach
agent-reach configure proxy http://user:pass@ip:port

# Scrapling 使用代理
fetcher = Fetcher(proxy='http://user:pass@ip:port')

# FlareSolverr 使用代理
response = requests.post('http://localhost:8191/v1', json={
    "cmd": "request.get",
    "url": "https://example.com",
    "proxy": "http://user:pass@ip:port"
})
```

## 注意事项

1. **优先使用 Agent Reach** — 最简单，无需额外配置
2. **遇到防护用 FlareSolverr** — 先启动服务再调用
3. **复杂抓取用 Scrapling** — 支持 JS 渲染、自动重试
4. **遵守 robots.txt** — 尊重网站规则
5. **控制频率** — 避免被封 IP
6. **费用控制** — 不要做无意义的重复调用
