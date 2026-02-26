# TOOLS.md - Local Notes

## LLM 配置

- Provider: xchai.xyz (Anthropic Messages API 兼容)
- Model: xchai/claude-opus-4-6
- 与 G 共享同一 LLM 配置

## 工具权限

### 啾啾常用工具
- `exec` — Shell 命令执行（代码编译、测试、部署）
- `read` / `write` / `edit` — 文件操作（代码实现核心）
- `web_fetch` — 网页内容获取
- `browser` — 浏览器自动化
- `sessions_send` — 跨 Agent 通信（向 G 汇报）
- `memory_search` / `memory_get` — 记忆检索
- `cron` — 定时任务管理
- `tts` — 文本转语音

### 飞书工具
- `feishu_doc` — 飞书文档读写
- `feishu_drive` — 飞书云盘操作
- `feishu_wiki` — 飞书知识库
- `feishu_bitable_*` — 飞书多维表格

### 啾啾不常用的工具
- `gateway` — 配置管理（谨慎使用，重大变更先报 G）

## 自动备份

- Git 备份: 独立 git repo `/root/.openclaw/workspace`
- 冷归档: `scripts/archive-memory.sh`（每日凌晨 3 点，归档 7 天以上 daily memory）

## 环境信息

- 服务器内存: 3.6G（注意 OOM）
- Go: `/usr/local/go/bin/go` v1.22.0
- Node: v22.22.0
- Gateway 端口: 18789
