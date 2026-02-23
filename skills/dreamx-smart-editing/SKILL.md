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

用户发素材 → 生成分镜脚本 → 调用 API 构建 VideoProject → build 生成剪映工程 → zip → COS 上传 → 返回永久下载链接

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
- 每张图对应一段字幕（2-3 句话，控制在 15 字以内/句）
- 开头要有 hook（吸引注意力）
- 结尾要有 call to action
- 适当使用 emoji 增强表现力

### 第三步：构建 VideoProject JSON

参考 [references/api-guide.md](references/api-guide.md) 了解完整 API 接口。

核心结构：
```json
{
  "id": "<projectId>",
  "canvas": {"width": 1080, "height": 1920},
  "scripts": [{
    "segments": [
      // 图片 segments + 音频 segment + 文字 segments
    ]
  }]
}
```

关键点：
- 每张图片一个 segment，时长根据音频总时长平均分配
- 音频 segment 覆盖整个时间轴
- 文字 segment 与对应图片时间对齐
- 图片 startTime 依次递增，不要重叠

### 第四步：调用 API 构建

通过 Spring Boot 测试或直接构造 VideoProject JSON，调用 build 流程：

```java
// 测试类模式（推荐）
videoProjectService.buildProject(new BuildProjectRequest().setProjectId(projectId));
```

或通过 HTTP API：
```
POST /api/project/build
{"projectId": "<id>"}
```

### 第五步：交付结果

返回给用户：
- COS 永久下载链接
- 任务 ID
- 分镜字幕文案（可直接用于小红书笔记）

## 素材管理

- 素材目录：`/root/dreamX/doc/sale/<事件名>/`
- 图片命名：`1.jpg`, `2.jpg`, ... 按分镜顺序
- 音频命名：`bgm.mp3`
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
