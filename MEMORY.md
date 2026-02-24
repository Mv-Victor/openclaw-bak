# MEMORY.md - G 长期记忆

## 栋少信息
- 快手电商 Java 架构师
- 副业：AI 剪辑、AI 漫剧
- 时区：GMT+8
- 沟通渠道：飞书 DM + 群聊

## 多 Agent 协作系统
- G（总指挥/军师/智库）+ 啾啾（工程师/创作官）
- 单 Gateway，独立 workspace，飞书双账号
- G workspace: `/root/.openclaw/workspace-g`
- 啾啾 workspace: `/root/.openclaw/workspace`
- Git 备份：`git@github.com:Mv-Victor/openclaw-bak.git` 分支 `G`，5 分钟自动备份

## AI 短剧生成平台（2026-02-24 启动）

### 业务方向
- 三种变现模式：SaaS Bot、成品视频交付、代运营
- 新方向：短剧生成，IP 角色库 + 按行业垂类建素材库
- 核心壁垒：AI 生成短剧 + 一键导出剪映/Capcut 工程文件

### API 资源
- Polo API token: sk-vPYI81WXaBK95LE9TGPRWMVlpQ6YOOkKCKopNTtiFWROBxPW
- 基础 URL: https://poloai.top
- 支持：Sora-2、豆包、Veo、可灵、万相、Flux 等

### 技术选型
- 主体：huobao-drama（Go+Vue3，`/root/huobao-drama/`）
- 参考：Toonflow-app 的 Agent 分镜拆解逻辑（`/root/Toonflow-app/`）
- 核心开发：Timeline → Capcut draft_content.json 导出模块

### 开源项目路径
- `/root/huobao-drama/` - Go+Vue3 全栈短剧平台（推荐主体）
- `/root/Toonflow-app/` - Node.js AI Agent 分镜生成
- `/root/Toonflow-web/` - 前端，参考价值有限
