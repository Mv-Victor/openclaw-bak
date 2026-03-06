---
name: dreamx-docker-video
description: 使用 Docker 镜像生产营销视频。适合客户环境部署，通过 Docker 容器调用 API 生成剪映工程文件。当用户提到"Docker 剪辑"、"镜像生成视频"、"容器化视频制作"时触发。
---

# DreamX Docker 视频生成

## 概述

这是 DreamX AI 剪辑项目的 Docker 镜像版本，专为客户环境部署设计。

## 参考实现

完整的智能剪辑流程参考实现：
- **脚本位置**: `references/test-full-video.sh`
- **功能**: 完整演示从素材准备到视频生成的全流程
- **使用方法**: 
  ```bash
  cd /root/.openclaw/workspace/skills/dreamx-docker-video
  ./references/test-full-video.sh
  ```

该脚本包含了：
1. 小红书爆款文案生成
2. TTS 配音生成
3. 表情包和 BGM 素材召回
4. 分镜时长计算
5. API 调用构建 VideoProject
6. 剪映工程生成和 COS 上传
基于完整的智能剪辑流程，支持自动生成小红书爆款文案、情绪分析、素材召回、TTS 配音和剪映工程生成。

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
- 镜像名称：`registry.cn-hangzhou.aliyuncs.com/aha_pocket/history_version:dreamx-video-v1.0.2`
- 镜像大小：2.17GB（包含完整素材库：756 个表情包 + 76 个 BGM）
- 构建位置：`/root/dreamX/`
- 分支：`delivery/minimal-v1`

## 核心流程

用户发素材 → 生成小红书爆款文案 → 情绪分析 + 素材召回 → TTS 配音 → 计算分镜时长 → 调用 API 构建 VideoProject → build 生成剪映工程 → zip → COS 上传 → 返回下载链接

### 第一步：部署 Docker 服务

```bash
# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/aha_pocket/history_version:dreamx-video-v1.0.2

# 启动容器
docker run -d \
  --name dreamx-video \
  -p 8081:17026 \
  -e COS_APP_ID=$COS_APP_ID \
  -e COS_SECRET_ID=$COS_SECRET_ID \
  -e COS_SECRET_KEY=$COS_SECRET_KEY \
  -e COS_REGION=$COS_REGION \
  -e COS_BUCKET=$COS_BUCKET \
  -v /root/dreamX/doc:/app/doc \
  registry.cn-hangzhou.aliyuncs.com/aha_pocket/history_version:dreamx-video-v1.0.2

# 检查服务状态（等待 5 秒启动）
sleep 5 && curl http://localhost:8081/actuator/health
```

### 第二步：生成小红书爆款文案

根据事件描述，生成 6-10 句爆款文案，遵循情绪递进框架：

#### 文案创作框架
1. **Hook（1-2 句）**：吸引注意力，制造悬念
   - 例："千问砸 30 亿请喝奶茶"
   
2. **爆料（2-3 句）**：核心信息，数据冲击
   - 例："全国人民疯狂涌入"、"服务器直接炸了"
   
3. **利益点（2-3 句）**：与观众相关的价值
   - 例："APP 崩了一整天"、"运维小哥连夜加班"
   
4. **引导（1-2 句）**：间接引导，不直接导流
   - 例："这波属实格局打开了"、"网上全是讨论帖"

#### 文案规范
- 每句单行，不超过 14 个中文字符
- 小红书爆款风格：夸张、情绪化、引发共鸣
- 适当使用 emoji（1-2 个即可）
- **不能出现直接导流表述**（如"上 XX 搜"）

#### 示例脚本（大家都在涨薪）

```
1. 大家真的都在涨薪吗？
2. 真相可能和你想的不一样
3. 大厂平均涨薪 15%
4. 中小厂普遍冻结薪资
5. 技术岗涨薪最多
6. 运营岗基本没动
7. 想涨薪先看这 3 点
8. 评论区有详细攻略
```

### 第三步：TTS 配音生成

使用 edge-tts 生成配音（容器内执行）：

```bash
docker exec dreamx-video edge-tts \
  --voice zh-CN-YunjianNeural \
  --text "大家真的都在涨薪吗" \
  --write-media /app/doc/sale/dajiazhangxin/voiceover_1.mp3
```

**注意**：由于不挂载 doc 目录，需要在容器内生成 TTS 或提前复制素材到容器内。

### 第四步：情绪分析 + 素材召回

根据文案情绪召回匹配的表情包和 BGM：

```javascript
// 情绪分析
const mood = analyzeMood(script); // 吐槽 + 震惊 + 实用

// 素材召回
const meme = recallMeme(mood); // cat_shocked（震惊猫）
const bgm = recallBGM(mood); // happy/Smile_1076.mp3
```

### 第五步：计算分镜时长

**核心原则**：图片时长 = 该图所有字幕时长之和

```javascript
// 字幕时长计算
const subtitleDuration = text.length * 200; // 每字 200ms
const minDuration = 1500; // 最短 1.5 秒
const maxDuration = 4000; // 最长 4 秒

// 图片时长
const imageDuration = subtitles.reduce((sum, sub) => sum + sub.duration, 0);
```

**分镜示例**：
```
图 1 (0-3500ms): 字幕 1(500-2000) + 字幕 2(2000-4000)
图 2 (3500-7000ms): 字幕 3(4000-5500) + 字幕 4(5500-7500)
图 3 (7000-10500ms): 表情包 (7000-8500) + 字幕 5(7500-9000) + 字幕 6(9000-10500)
图 4 (10500-14000ms): 字幕 7(11000-12500) + 字幕 8(12500-14000)
总时长：14000ms
```

### 第六步：调用 API 构建 VideoProject

**关键：API 参数格式必须正确！**

#### ✅ 正确的 API 参数格式

```bash
# 添加字幕（底部居中）
curl -X POST http://localhost:8081/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "text": "字幕内容",
    "startTime": 500,
    "duration": 1500,
    "positionX": 0,
    "positionY": -750,
    "asSubtitle": true,
    "style": {
      "fontSize": 8,
      "fillColor": "#FFDE00",
      "strokeColor": "#000000",
      "strokeWidth": 60,
      "bold": true,
      "textAlign": 1,
      "fontName": "抖音美好体"
    }
  }'

# 添加水印（顶部居中）
curl -X POST http://localhost:8081/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "text": "AI 热点速递",
    "startTime": 0,
    "duration": 14000,
    "positionX": 0,
    "positionY": 800,
    "asSubtitle": false,
    "style": {
      "fontSize": 6,
      "fillColor": "#FFFFFF",
      "strokeColor": "#D61400",
      "strokeWidth": 60,
      "bold": true,
      "textAlign": 1,
      "fontName": "抖音美好体"
    }
  }'
```

#### ❌ 错误的 API 参数格式

```json
// 错误 1：扁平化参数（不会被接收）
{
  "fontSize": 8,
  "fontColor": "#FFDE00",
  "strokeColor": "#000000",
  "strokeWidth": 60
}

// 错误 2：位置参数搞反坐标系
{
  "positionY": 750,  // ❌ 这是顶部，应该是 -750（底部）
  "positionY": -800  // ❌ 这是底部，应该是 800（顶部）
}
```

### 第七步：构建剪映工程

```bash
curl -X POST http://localhost:8081/api/project/build \
  -H "Content-Type: application/json" \
  -d '{"projectId": 1}'
```

### 第八步：COS 上传

构建完成后自动上传到 COS，返回下载链接。
```
1. 热心脉友总结了
2. 年底 100 个急招高薪岗
3. 年薪 50 万起跳
4. 远程办公 + 六险一金
5. 这待遇谁不心动
6. 岗位列表我放评论区了
```

### 第三步：情绪分析 + 素材召回

从脚本中提取情绪标签，从素材库召回匹配的表情包和 BGM。

#### 情绪标签提取
从脚本文案中提取情绪：
- 吐槽、委屈、搞笑、震惊、离谱、无语、愤怒、欢快、可爱、害羞

#### 表情包召回
从 `/app/doc/memes/` 目录按情绪召回：
```bash
# 查看可用表情包分类
docker exec dreamx-video ls /app/doc/memes/

# 示例：震惊情绪
docker exec dreamx-video ls /app/doc/memes/cat_shocked/
```

#### BGM 召回
从 `/app/doc/bgm/` 目录按情绪召回：
```bash
# 查看可用 BGM 分类
docker exec dreamx-video ls /app/doc/bgm/

# 示例：欢快风格
docker exec dreamx-video ls /app/doc/bgm/happy/
```

### 第四步：TTS 配音

使用 `edge-tts` 为每条字幕生成配音音频：

```bash
# 在 Docker 容器内执行
docker exec dreamx-video edge-tts \
  --voice zh-CN-YunjianNeural \
  --text "热心脉友总结了" \
  --write-media /app/doc/sale/renxinmaiyou/voiceover_1.mp3

docker exec dreamx-video edge-tts \
  --voice zh-CN-YunjianNeural \
  --text "年底 100 个急招高薪岗" \
  --write-media /app/doc/sale/renxinmaiyou/voiceover_2.mp3
```

可用中文语音：
- `zh-CN-YunjianNeural` — 男声，激情（推荐营销视频）
- `zh-CN-XiaoxiaoNeural` — 女声，温暖
- `zh-CN-YunxiNeural` — 男声，阳光
- `zh-CN-XiaoyiNeural` — 女声，活泼

### 第五步：计算分镜时长

**核心规则**：每句字幕时长 = 字数 × 0.2s，单图时长 = 该图所有字幕时长之和

示例计算：
```
图 1 配 2 句字幕：
  "热心脉友总结了" = 7 字 → 7 × 0.2 = 1.4s → 取整 1500ms（最低限制）
  "年底 100 个急招高薪岗" = 10 字 → 10 × 0.2 = 2.0s → 2000ms
  图 1 总时长 = 1500 + 2000 = 3500ms

图 2 配 2 句字幕：
  "年薪 50 万起跳" = 6 字 → 1500ms（最低限制）
  "远程办公 + 六险一金" = 9 字 → 2000ms
  图 2 总时长 = 1500 + 2000 = 3500ms
```

- 单句最短不低于 1500ms（快切节奏）
- 单句最长不超过 4000ms
- 单图最长不超过 10000ms
- 总时长 = 所有图片时长之和

### 第六步：调用 API 构建视频

#### 6.1 创建项目

```bash
BASE_URL="http://localhost:8081"

curl -X POST $BASE_URL/api/project \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "projectName": "热心脉友年底 100 个急招高薪岗",
    "width": 1080,
    "height": 1920
  }'
```

#### 6.2 添加图片（按分镜时间顺序）

**⚠️ 重要：必须严格按分镜时间顺序添加图片和表情包**

正确顺序：图 1 → 图 2 → 表情包 1 → 图 3 → 表情包 2

```bash
# 图 1（封面）
curl -X POST $BASE_URL/api/project/image \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "imageId": 700101,
    "imageUrl": "file:///app/doc/sale/renxinmaiyou/1.jpg",
    "startTime": 0,
    "duration": 3500,
    "zoomX": 10000,
    "zoomY": 10000,
    "positionX": 0,
    "positionY": 0
  }'

# 图 2
curl -X POST $BASE_URL/api/project/image \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "imageId": 700102,
    "imageUrl": "file:///app/doc/sale/renxinmaiyou/2.jpg",
    "startTime": 3500,
    "duration": 3500,
    "zoomX": 10000,
    "zoomY": 10000,
    "positionX": 0,
    "positionY": 0
  }'

# 表情包 1（情绪高潮点插入）
curl -X POST $BASE_URL/api/project/image \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "imageId": 700103,
    "imageUrl": "file:///app/doc/memes/cat_shocked/Omg_Cat_Scared_Kitty_GIF_oFvXciCA8px11faKJS.gif",
    "startTime": 7000,
    "duration": 1500,
    "zoomX": 8000,
    "zoomY": 8000,
    "positionX": 540,
    "positionY": 960
  }'
```

#### 6.3 添加字幕

```bash
# 字幕 1
curl -X POST $BASE_URL/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "textId": 700201,
    "text": "热心脉友总结了",
    "startTime": 500,
    "duration": 1500,
    "fontSize": 8,
    "fontColor": "#FFDE00",
    "positionX": 0,
    "positionY": 750,
    "asSubtitle": true,
    "bold": true,
    "textAlign": 1,
    "fontName": "抖音美好体",
    "strokeColor": "#000000",
    "strokeWidth": 60
  }'

# 字幕 2
curl -X POST $BASE_URL/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "textId": 700202,
    "text": "年底 100 个急招高薪岗",
    "startTime": 2000,
    "duration": 2000,
    "fontSize": 8,
    "fontColor": "#FFDE00",
    "positionX": 0,
    "positionY": 750,
    "asSubtitle": true,
    "bold": true,
    "textAlign": 1,
    "fontName": "抖音美好体",
    "strokeColor": "#000000",
    "strokeWidth": 60
  }'
```

#### 6.4 添加配音

**⚠️ 重要：配音音频必须设置 materialTimeStart 和 materialTimeEnd**

```bash
# 配音 1
curl -X POST $BASE_URL/api/project/audio \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "audioId": 700301,
    "audioUrl": "file:///app/doc/sale/renxinmaiyou/voiceover_1.mp3",
    "startTime": 500,
    "duration": 1500,
    "materialTimeStart": 0,
    "materialTimeEnd": 1500,
    "volume": 0
  }'

# 配音 2
curl -X POST $BASE_URL/api/project/audio \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "audioId": 700302,
    "audioUrl": "file:///app/doc/sale/renxinmaiyou/voiceover_2.mp3",
    "startTime": 2000,
    "duration": 2000,
    "materialTimeStart": 0,
    "materialTimeEnd": 2000,
    "volume": 0
  }'
```

#### 6.5 添加 BGM

```bash
curl -X POST $BASE_URL/api/project/audio \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "audioId": 700401,
    "audioUrl": "file:///app/doc/bgm/happy/Smile_1076.mp3",
    "startTime": 0,
    "duration": 30000,
    "volume": -30,
    "fadeInDuration": 1000,
    "fadeOutDuration": 1000
  }'
```

#### 6.6 添加水印

```bash
curl -X POST $BASE_URL/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 700001,
    "textId": 700501,
    "text": "AI 热点速递",
    "startTime": 0,
    "duration": 30000,
    "fontSize": 6,
    "fontColor": "#FFFFFF",
    "positionX": 0,
    "positionY": -800,
    "bold": true,
    "textAlign": 1,
    "fontName": "抖音美好体",
    "strokeColor": "#D61400",
    "strokeWidth": 60
  }'
```

#### 6.7 构建剪映工程

```bash
curl -X POST $BASE_URL/api/project/build \
  -H "Content-Type: application/json" \
  -d '{"projectId": 700001}'
```

返回示例：
```json
{
  "code": 0,
  "data": 291646597433917441,
  "tid": null
}
```

### 第七步：获取下载链接

构建成功后，服务会自动上传到 COS 并返回下载链接：

```json
{
  "taskId": 291646597433917441,
  "videoId": 700001,
  "jyZipUrl": "",
  "status": 0
}
```

下载链接永久有效，可直接用于剪映导入。

## 字幕样式规范

### 正文字幕
- 字号：8
- 颜色：黄色填充 `#FFDE00` + 黑色描边 `#000000`
- 描边粗细：60
- 位置：`positionX=0, positionY=750`（底部居中）
- `asSubtitle=true`

### 水印
- 字号：6（比字幕小）
- 颜色：白色填充 `#FFFFFF` + 红色描边 `#D61400`
- 描边粗细：60
- 位置：`positionX=0, positionY=-800`（顶部居中）
- 覆盖整个视频时长

## 素材管理

### 素材目录结构
```
/app/doc/
├── sale/
│   └── <事件名>/
│       ├── 1.jpg          # 图片素材（按分镜顺序）
│       ├── 2.jpg
│       ├── voiceover_1.mp3  # TTS 配音
│       └── voiceover_2.mp3
├── memes/                 # 表情包库（756 个）
│   ├── cat_shocked/
│   ├── cat_funny/
│   └── ...
└── bgm/                   # BGM 库（76 个）
    ├── happy/
    ├── chill/
    └── ...
```

### 素材库说明
- 表情包：756 个，按情绪分类（震惊、搞笑、吐槽等）
- BGM：76 个，按风格分类（欢快、舒缓、激情等）
- 所有素材已打包到 Docker 镜像中

## 注意事项

### ⚠️ 坐标系（❗ 重要）

**Y 轴坐标系：上正下负，中心为 0**

- **顶部居中**：`positionY = 800`（正值=上方）
- **底部居中**：`positionY = -750`（负值=下方）
- **水平居中**：`positionX = 0`

**常见错误**：
```json
// ❌ 错误：位置搞反了
{
  "positionY": 750,   // 这是顶部！应该是 -750（底部）
  "positionY": -800   // 这是底部！应该是 800（顶部）
}

// ✅ 正确
{
  "positionY": -750,  // 字幕在底部
  "positionY": 800    // 水印在顶部
}
```

### ⚠️ API 参数格式（❗ 重要）

**必须使用 `style` 对象格式传递样式参数！**

```json
// ❌ 错误：扁平化参数（不会被接收）
{
  "fontSize": 8,
  "fontColor": "#FFDE00",
  "strokeColor": "#000000",
  "strokeWidth": 60
}

// ✅ 正确：使用 style 对象
{
  "style": {
    "fontSize": 8,
    "fillColor": "#FFDE00",
    "strokeColor": "#000000",
    "strokeWidth": 60,
    "bold": true,
    "textAlign": 1,
    "fontName": "抖音美好体"
  }
}
```

### 分镜设计原则（❗ 重要）

1. **图片时长 = 该图所有字幕时长之和**
   - 文字必须读完才切图，不能字没说完就切换
   - 示例：图 1 配 2 句字幕（1500ms + 2000ms），则图 1 时长 = 3500ms

2. **字幕时长计算**
   - 每句字幕时长 = 字数 × 0.2s
   - 单句最短：1500ms（快切节奏）
   - 单句最长：4000ms
   - 单图最长：10000ms

3. **字幕位置规范**
   - **正文字幕**：底部中央 `positionY=-750`（负值=下方）
   - **水印**：顶部中央 `positionY=800`（正值=上方）
   - 不要搞反！

4. **字幕样式规范**
   - 字号：8
   - 填充色：黄色 `#FFDE00`
   - 描边色：黑色 `#000000`
   - 描边粗细：60
   - 字体：抖音美好体
   - `asSubtitle=true`

5. **水印样式规范**
   - 字号：6（比字幕小）
   - 填充色：白色 `#FFFFFF`
   - 描边色：红色 `#D61400`
   - 描边粗细：60
   - 字体：抖音美好体
   - `asSubtitle=false`

6. **BGM 时长**
   - BGM 时长必须与图片总时长一致
   - 不能图片结束了 BGM 还在播放
   - 示例：3 张图总时长 10500ms，则 BGM duration = 10500ms

7. **水印时长**
   - 水印时长必须与图片总时长一致
   - 不能图片结束了水印还在

8. **表情包插入位置**
   - 在情绪高潮点/转折点插入，不要都放末尾
   - 示例：说到"这待遇谁不心动"时（情绪高潮），插入震惊猫表情包
   - 表情包时长：1000-2000ms（快闪）

9. **素材添加顺序**
   - 必须严格按分镜时间顺序添加图片和表情包
   - 正确顺序：图 1 → 图 2 → 表情包 1 → 图 3
   - 错误顺序：图 1 → 图 2 → 图 3 → 表情包 1（会导致轨道错乱）

10. **配音音频设置**
    - 必须设置 `materialTimeStart` 和 `materialTimeEnd`
    - 否则 build 时会 NPE（空指针异常）

### 其他注意事项

1. **素材路径**：必须使用 `file://` 协议，指向容器内路径（`/app/doc/...`）
2. **音量控制**：BGM 建议 `-30`（降低音量避免盖过配音），配音建议 `0`
3. **COS 配置**：确保环境变量正确，Bucket 有公有读权限

## 故障排查

### 查看容器日志
```bash
docker logs -f dreamx-video
```

### 检查服务状态
```bash
curl http://localhost:8081/actuator/health
```

### 验证素材文件
```bash
# 检查表情包
docker exec dreamx-video ls /app/doc/memes/cat_shocked/

# 检查 BGM
docker exec dreamx-video ls /app/doc/bgm/happy/

# 检查用户素材
docker exec dreamx-video ls /app/doc/sale/renxinmaiyou/
```

### 重启容器
```bash
docker restart dreamx-video
sleep 5  # 等待服务启动
```

## 完整示例脚本

参考[references/test-full-video.sh](references/test-full-video.sh)或创建一个完整的 bash 脚本自动化整个流程。
