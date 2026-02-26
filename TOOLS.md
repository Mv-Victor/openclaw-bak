# TOOLS.md - Local Notes

## Setup

- Shared LLM config with main agent (啾啾)
- Model: xchai/claude-opus-4-6
- Provider: xchai.xyz (Anthropic Messages API 兼容)

## 工具权限

### G 常用工具
- `sessions_send` — 跨 Agent 派工和通信
- `sessions_list` — 查看活跃 session
- `sessions_spawn` — 派生子任务
- `memory_search` / `memory_get` — 记忆检索
- `gateway` — 配置管理（谨慎使用）
- `cron` — 定时任务管理
- `web_fetch` — 网页内容获取
- `exec` — Shell 命令执行

### G 不常用的工具
- 代码编写类工具 → 优先派工给啾啾
- 内容创作类工具 → 优先派工给啾啾

## 自动备份

- Git 备份: `git@github.com:Mv-Victor/openclaw-bak.git` 分支 `G`
- 脚本: `scripts/auto-backup.sh`
- 频率: 每 5 分钟
