# GROUP_MEMORY.md - 群聊长期记忆

_只保留群里可复用且安全的信息，不混入私聊内容。_

## 协作架构（2026-02-26 确认）

### 多 Agent 协作系统
- G（总指挥/军师/智库）+ 啾啾（工程师/创作官）
- 单 Gateway，飞书双账号，独立 workspace
- G 全局监听，啾啾 @触发

### 群聊 Session Keys

#### 群 oc_0af53fdfca746166d27a102fc843f207
- G: `agent:g:feishu:group:oc_0af53fdfca746166d27a102fc843f207`
- 啾啾: `agent:main:feishu:group:oc_0af53fdfca746166d27a102fc843f207`

#### 群 oc_c77988450ccd8ae6f30dc77d62038204
- G: `agent:g:feishu:group:oc_c77988450ccd8ae6f30dc77d62038204`
- 啾啾: `agent:main:feishu:group:oc_c77988450ccd8ae6f30dc77d62038204`

### 协作流程
```
栋少群里提需求 → G 响应并拆解 → G sessions_send 派工给啾啾
→ 啾啾执行 → 啾啾 sessions_send 回报给 G → G 群里回复栋少
```

### Gateway 配置要点（2026-02-26 加固）
- `maxPingPongTurns: 0` — 压制 Agent 间无意义来回
- `dmScope: per-account-channel-peer` — 三维会话隔离
- `mentionPatterns` 已补全：G=[G,@G,总指挥,军师,智库], 啾啾=[啾啾,@啾啾,工程师,创作官]

## API 配置

### PoloAI（视频生成）
- base_url: https://poloai.top
- 可用模型: `sora-2`, `sora-2-guan`（2026-02-26 验证通过）
- 图片模型全部不可用（gpt-image-1, dall-e-3, flux 等均无 channel）

### xchai.xyz（文本生成）
- 支持 OpenAI chat completions 兼容格式
- 模型: `claude-opus-4-6`

## 沉淀的经验

### 内存管理
- 服务器 3.6G 内存，drama-server 容易被 OOM kill
- 启动前先 `echo 3 > /proc/sys/vm/drop_caches`
- Go 路径: `/usr/local/go/bin/go`（已加入 ~/.bashrc）

### huobao-drama 项目
- 路径: `/root/huobao-drama`
- 入口: `main.go`，端口: 5678
- AI 配置通过 REST API 管理: `POST /api/v1/ai-configs`
- 分镜批量图片: `POST /api/v1/images/episode/:episode_id/batch`
- 分镜批量视频: `POST /api/v1/videos/episode/:episode_id/batch`
