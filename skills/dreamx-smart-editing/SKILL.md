---
name: dreamx-smart-editing
description: DreamX 智能剪辑技能。用于 AI 驱动的营销视频制作：接收图片+音频+事件描述，自动生成分镜脚本、小红书爆款文案字幕、剪映工程文件，上传 COS 并返回下载链接。当用户提到"剪辑"、"营销视频"、"小红书视频"、"剪映"、"视频制作"、"AI剪辑"、"dreamX"时触发。
---

# DreamX 智能剪辑

## 项目位置

- 代码仓库：`/root/dreamX/`
- Git：`git@github.com:Mv-Victor/dreamX.git`，分支 `feat/oss-local-file`
- 技术栈：Java 21 + Maven 3.9.9 + Spring Boot 3.5.8
- 模块：duo-server-base, duo-video-base, duo-video-jy, duo-video-api

## 核心流程

用户发素材 → 生成小红书爆款文案 → TTS 配音 → 调用 API 构建 VideoProject → build 生成剪映工程 → zip → COS 上传 → 返回永久下载链接

### 第一步：接收素材并立即反馈

用户发来图片+音频+事件描述时，**第一时间**回复子任务信息：
- 任务名称（基于事件描述）
- 任务 ID（生成唯一 ID）
- 任务状态（处理中）

不要等全部完成再回复。先确认收到，再异步处理。

### 第二步：生成小红书爆款文案

根据事件描述，生成具有煽动性的小红书营销爆文作为分镜字幕话术。

文案要求：
- 小红书爆款风格：夸张、情绪化、引发共鸣
- 每张图对应一段字幕，**必须单行**，不超过视频宽度
- 1080p 宽度下，字号 8 + 缩放 130% 时，单行建议不超过 14 个中文字符
- 开头要有 hook（吸引注意力）
- 结尾要有 call to action
- 适当使用 emoji 增强表现力（但不要过多，1-2 个即可）

### 第三步：TTS 配音

使用 `edge-tts` 为每条字幕生成配音音频：

```bash
edge-tts --voice zh-CN-YunjianNeural --text "字幕内容" --write-media /path/to/voiceover_1.mp3
```

可用中文语音：
- `zh-CN-YunjianNeural` — 男声，激情（推荐营销视频）
- `zh-CN-XiaoxiaoNeural` — 女声，温暖
- `zh-CN-YunxiNeural` — 男声，阳光
- `zh-CN-XiaoyiNeural` — 女声，活泼

配音文件保存到素材目录：`voiceover_1.mp3`, `voiceover_2.mp3`, ...

### 第四步：计算分镜时长

**核心规则：单图时长 = 字幕字数 × 0.2s**

```
字幕"快手年终奖开奖了发的真多" = 12字 → 12 × 0.2 = 2.4s → 取整 2400ms
```

- 最短不低于 2000ms
- 最长不超过 8000ms
- 总时长 = 所有分镜时长之和
- 背景音乐 duration = 总时长

### 第五步：构建 VideoProject

参考 [references/api-guide.md](references/api-guide.md) 了解完整 API 接口。

#### 字幕样式规范

```java
new TextStyle()
    .setFontSize(8)           // 字号 8
    .setBold(true)
    .setTextAlign(1)          // 居中
    .setFontName("抖音美好体")
    .setFillColor("#FFFFFF")  // 白色填充
    .setStrokeColor("#000000") // 黑色描边
    .setStrokeWidth(10)       // 描边宽度
```

- 字幕位置：`positionX=0, positionY=-750`（底部居中）
- `asSubtitle=true`
- 缩放 130%：`zoomX=13000, zoomY=13000`（万分比）

#### 图片设置

- `zoomX=10000, zoomY=10000`（100% 缩放）
- `positionX=0, positionY=0`（居中）

#### 音频设置

- 背景音乐：`volume=-30`（降低音量避免盖过配音）
- 配音音频：`volume=0`（原音量）
- 背景音乐建议加淡入淡出：`fadeInDuration=1000, fadeOutDuration=1000`

#### 配音音频

每条配音作为独立音频 segment，startTime 与对应图片对齐。

### 第六步：调用 build 并交付

```
POST /api/project/build
{"projectId": "<id>"}
```

返回给用户：
- COS 永久下载链接
- 任务 ID
- 分镜字幕文案（可直接用于小红书笔记）

## 素材管理

- 素材目录：`/root/dreamX/doc/sale/<事件名>/`
- 图片命名：`1.jpg`, `2.jpg`, ... 按分镜顺序
- 背景音乐：`bgm.mp3`
- 配音文件：`voiceover_1.mp3`, `voiceover_2.mp3`, ...
- 使用 `file://` 本地路径，不依赖外部 CDN

## COS 配置

- 密钥通过环境变量读取：`COS_APP_ID`, `COS_SECRET_ID`, `COS_SECRET_KEY`, `COS_REGION`, `COS_BUCKET`
- 本地密钥文件：`/root/dreamX/.env.cos`（运行前 `source .env.cos`）
- 上传后生成公有读直接 URL（永久有效，无签名）

## Git 规范

- **按功能点提交**：每完成一个功能点单独 commit，不要攒一堆改动一次提交
- **commit message 格式**：`feat: <功能描述>` / `fix: <修复描述>`
- **及时 push**：改完就推，不要积压
- **不提交密钥**：yaml 里用 `${ENV_VAR}` 引用，密钥放 `.env.cos`
- **不提交日志**：`logs/` 目录在 `.gitignore` 中
- **不提交编译产物**：`target/` 目录在 `.gitignore` 中

## 注意事项

- 剪映工程不支持在线 URL 素材，所有素材必须下载到本地后用本地路径
- `StorageServiceImpl` 支持 `file://` URL 直接文件复制
- 转场效果（transition）需要对应的资源 ID，如果没有可用资源就不加转场
- 音频淡入淡出：`AddAudioRequest` 支持 `fadeInDuration`/`fadeOutDuration` 参数（毫秒）
- 编译命令：`cd /root/dreamX && mvn clean install -DskipTests`
- 运行测试：先 `source /root/dreamX/.env.cos`，再 `mvn test -pl duo-video-api`
- TTS 工具：`edge-tts`（已安装），支持多种中文语音
