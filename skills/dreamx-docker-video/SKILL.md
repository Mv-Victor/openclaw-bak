---
name: dreamx-docker-video
description: 使用 Docker 镜像生产营销视频。适合客户环境部署，通过 Docker 容器调用 API 生成剪映工程文件。当用户提到"Docker 剪辑"、"镜像生成视频"、"容器化视频制作"时触发。
---

# DreamX Docker 视频生成

## 概述

这是 DreamX AI 剪辑项目的 Docker 镜像版本，专为客户环境部署设计。

## 前置条件

### 必需
- Docker 已安装
- OpenClaw 已部署
- Claude API Key 已配置
- 腾讯云 COS 账号（需要以下环境变量）：
  - `COS_APP_ID`
  - `COS_SECRET_ID`
  - `COS_SECRET_KEY`
  - `COS_REGION`
  - `COS_BUCKET`

### Docker 镜像
- 镜像名称：`dreamx-video:latest`
- 构建位置：`/root/dreamX/`
- 分支：`delivery/minimal-v1`

## 使用流程

### 第一步：确认 Docker 服务运行

```bash
# 检查 Docker 容器状态
docker ps | grep dreamx-video

# 如果未运行，启动容器
docker run -d \
  --name dreamx-video \
  -p 8080:8080 \
  -e COS_APP_ID=$COS_APP_ID \
  -e COS_SECRET_ID=$COS_SECRET_ID \
  -e COS_SECRET_KEY=$COS_SECRET_KEY \
  -e COS_REGION=$COS_REGION \
  -e COS_BUCKET=$COS_BUCKET \
  -v /path/to/materials:/app/doc \
  dreamx-video:latest
```

### 第二步：准备素材

素材目录结构：
```
materials/
├── sale/
│   └── event_name/
│       ├── 1.png          # 图片素材（按顺序命名）
│       ├── 2.png
│       ├── 3.png
│       ├── 4.png
│       └── bgm.mp3        # 背景音乐（可选）
├── memes/                 # 表情包库（可选）
└── bgm/                   # BGM 库（可选）
```

### 第三步：生成小红书文案

根据事件描述，生成 6-10 句爆款文案，遵循情绪递进框架：
- Hook（1-2句）：吸引注意力
- 爆料（2-3句）：核心信息
- 利益点（2-3句）：与观众相关的价值
- 引导（1-2句）：间接引导

**文案规范**：
- 每句单行，不超过 14 个中文字符
- 小红书爆款风格：夸张、情绪化
- 适当使用 emoji（1-2 个）
- 不能出现"上脉脉/去脉脉"等直接导流

### 第四步：TTS 配音

使用 `edge-tts` 为每条字幕生成配音：

```bash
# 在 Docker 容器内执行
docker exec dreamx-video edge-tts \
  --voice zh-CN-YunjianNeural \
  --text "字幕内容" \
  --write-media /app/doc/sale/event_name/voiceover_1.mp3
```

可用中文语音：
- `zh-CN-YunjianNeural` — 男声，激情（推荐）
- `zh-CN-XiaoxiaoNeural` — 女声，温暖
- `zh-CN-YunxiNeural` — 男声，阳光
- `zh-CN-XiaoyiNeural` — 女声，活泼

### 第五步：调用 API 构建视频

#### 5.1 创建项目

```bash
curl -X POST http://localhost:8080/api/project \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 200001,
    "projectName": "事件名称_小红书营销",
    "width": 1080,
    "height": 1920
  }'
```

#### 5.2 添加图片（按分镜顺序）

```bash
# 图1
curl -X POST http://localhost:8080/api/project/image \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 200001,
    "imageId": 200101,
    "imageUrl": "file:///app/doc/sale/event_name/1.png",
    "startTime": 0,
    "duration": 3000,
    "zoomX": 10000,
    "zoomY": 10000,
    "positionX": 0,
    "positionY": 0
  }'

# 图2
curl -X POST http://localhost:8080/api/project/image \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 200001,
    "imageId": 200102,
    "imageUrl": "file:///app/doc/sale/event_name/2.png",
    "startTime": 3000,
    "duration": 3000,
    "zoomX": 10000,
    "zoomY": 10000,
    "positionX": 0,
    "positionY": 0
  }'
```

#### 5.3 添加 BGM

```bash
curl -X POST http://localhost:8080/api/project/audio \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 200001,
    "audioId": 200201,
    "audioUrl": "file:///app/doc/sale/event_name/bgm.mp3",
    "startTime": 0,
    "duration": 12000,
    "volume": -30,
    "fadeInDuration": 1000,
    "fadeOutDuration": 1000
  }'
```

#### 5.4 添加配音

```bash
# 配音1
curl -X POST http://localhost:8080/api/project/audio \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 200001,
    "audioId": 200301,
    "audioUrl": "file:///app/doc/sale/event_name/voiceover_1.mp3",
    "startTime": 0,
    "duration": 2000,
    "materialTimeStart": 0,
    "materialTimeEnd": 2000,
    "volume": 0
  }'
```

#### 5.5 添加字幕

```bash
curl -X POST http://localhost:8080/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 200001,
    "text": "字幕内容",
    "startTime": 0,
    "duration": 2000,
    "positionX": 0,
    "positionY": 750,
    "asSubtitle": true,
    "style": {
      "fontSize": 8,
      "bold": true,
      "textAlign": 1,
      "fontName": "抖音美好体",
      "fillColor": "#FFDE00",
      "strokeColor": "#000000",
      "strokeWidth": 60
    }
  }'
```

#### 5.6 添加水印

```bash
curl -X POST http://localhost:8080/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 200001,
    "text": "品牌名称",
    "startTime": 0,
    "duration": 12000,
    "positionX": 0,
    "positionY": -800,
    "style": {
      "fontSize": 6,
      "bold": true,
      "textAlign": 1,
      "fontName": "抖音美好体",
      "fillColor": "#FFFFFF",
      "strokeColor": "#D61400",
      "strokeWidth": 60
    }
  }'
```

#### 5.7 构建视频

```bash
curl -X POST http://localhost:8080/api/project/build \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 200001
  }'
```

返回示例：
```json
{
  "code": 0,
  "data": 290956748376768513,
  "message": "success"
}
```

### 第六步：获取下载链接

构建成功后，会在 `tmp/task_0/<taskId>.json` 生成任务文件：

```bash
docker exec dreamx-video cat /app/tmp/task_0/290956748376768513.json
```

返回：
```json
{
  "taskId": 290956748376768513,
  "videoId": 200001,
  "jyZipUrl": "https://dreamx-xxx.cos.ap-shanghai.myqcloud.com/jy-projects/200001/200001.zip",
  "status": 0
}
```

## 时长计算规则

**核心规则**：每句字幕时长 = 字数 × 0.2s

- 单句最短：1500ms（快切节奏）
- 单句最长：4000ms
- 单图最长：10000ms
- 总时长 = 所有图片时长之和

示例：
```
"千问砸30亿请喝奶茶" = 10字 → 10 × 0.2 = 2.0s → 2000ms
"全国人民疯狂涌入" = 8字 → 8 × 0.2 = 1.6s → 1600ms
```

## 字幕样式规范

### 正文字幕
- 字号：8
- 颜色：黄色填充 `#FFDE00` + 黑色描边 `#000000`
- 描边粗细：60
- 位置：`positionY=750`（底部）

### 水印
- 字号：6
- 颜色：白色填充 `#FFFFFF` + 红色描边 `#D61400`
- 描边粗细：60
- 位置：`positionY=-800`（顶部）

## 注意事项

1. **素材路径**：必须使用 `file://` 协议，指向容器内路径
2. **添加顺序**：图片和表情包必须按分镜时间顺序添加
3. **配音音频**：必须设置 `materialTimeStart` 和 `materialTimeEnd`
4. **音量控制**：BGM 建议 `-30`，配音建议 `0`
5. **COS 配置**：确保环境变量正确，Bucket 有公有读权限

## 故障排查

### Docker 容器无法启动
```bash
# 查看日志
docker logs dreamx-video

# 检查端口占用
lsof -i :8080
```

### API 调用失败
```bash
# 检查服务健康状态
curl http://localhost:8080/actuator/health

# 查看容器日志
docker logs -f dreamx-video
```

### COS 上传失败
```bash
# 检查环境变量
docker exec dreamx-video env | grep COS

# 测试 COS 连接
docker exec dreamx-video curl https://${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com
```

## 完整示例

参考项目中的测试用例：
- `QianwenNaichaTest.java` — 千问奶茶事件
- `PddSpringV2Test.java` — 拼多多春节加班

## 技术支持

- 项目仓库：https://github.com/Mv-Victor/dreamX
- 分支：`delivery/minimal-v1`
- 联系方式：通过 OpenClaw 联系
