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

### 第二步：生成小红书爆款文案（一图多句）

根据事件描述，**先写完整的 6-10 句爆款脚本**，再分配到图片上。参考小红书爆文笔记创作skill [references/redbook_script_creator.md](references/redbook_script_creator.md)

**⚠️ 重要：不要一图一句！一张图可以配多句字幕（快切），节奏要有变化。**

#### 文案创作流程

1. **写完整脚本**（6-10 句），遵循情绪递进框架：
   - Hook（1-2句）：吸引注意力，制造悬念
   - 爆料（2-3句）：核心信息，数据冲击
   - 利益点（2-3句）：与观众相关的价值
   - 引导（1-2句）：间接引导，不直接导流第三方平台

2. **分配到图片**：根据内容相关性把句子分配到对应图片
   - 每张图 1-3 句字幕
   - 高潮部分可以快切（每句 1.5-2s）
   - 铺垫部分可以慢一点（每句 2.5-3s）

3. **文案规范**：
   - 每句字幕**必须单行**，不超过 14 个中文字符
   - 小红书爆款风格：夸张、情绪化、引发共鸣
   - 适当使用 emoji（1-2 个即可）
   - **不能出现"上脉脉/去脉脉/脉脉搜"等直接导流表述**
   - 正确做法：正文自然植入品牌词（"刷脉脉看到"/"某脉上早有爆料"）

### 第二步 B：情绪分析 + 素材召回

从脚本中提取情绪标签，从素材库召回匹配的表情包和 BGM。

#### 素材库位置
- SQLite 数据库：`/root/dreamX/doc/crawler/media_library.db`
- 表情包目录：`/root/dreamX/doc/memes/`
- BGM 目录：`/root/dreamX/doc/bgm/`

#### 召回流程

```
输入：视频事件描述 + 脚本文案
  ↓
Step 1: 情绪分析
  从脚本提取情绪标签（吐槽、委屈、搞笑、震惊、离谱、无语、愤怒、欢快、可爱、害羞）
  提取关键实体（公司名、事件关键词）
  ↓
Step 2: 表情包召回（多路召回 + 排序）
  路径A: 情绪标签匹配 → tags.tag_value
  路径B: 角色适配 → 根据情绪找关联角色
  路径C: 梗描述语义匹配 → memes.meme_desc LIKE '%关键词%'
  路径D: 标签交集 → tags 字段匹配
  合并去重 → 按匹配度打分排序 → 取 Top N
  ↓
Step 3: BGM 召回
  路径A: 情绪标签匹配 → tags.tag_value
  路径B: 角色关联 → character_bgm_match
  路径C: 波形适配 → 根据视频时长找合适高潮片段的 BGM
  排序：情绪匹配度 × 波形适配度 → 取 Top 1
  ↓
Step 4: 高潮片段截取
  根据视频节奏（字幕高潮点）对齐 BGM 的 climax_ranges
```

#### 打分公式
- 表情包得分 = 0.4×情绪匹配 + 0.3×角色适配 + 0.2×关键词命中 + 0.1×新鲜度（未用过加分）
- BGM得分 = 0.4×情绪匹配 + 0.3×波形适配 + 0.2×角色关联 + 0.1×时长适配

#### SQL 查询示例

```sql
-- 按情绪召回表情包
SELECT m.*, GROUP_CONCAT(t.tag_value) as moods
FROM memes m
JOIN tags t ON t.resource_id = m.id AND t.resource_type = 'meme' AND t.tag_type = 'mood'
WHERE t.tag_value IN ('吐槽', '委屈', '搞笑')
GROUP BY m.id
ORDER BY COUNT(DISTINCT t.tag_value) DESC
LIMIT 5;

-- 按情绪召回 BGM
SELECT b.*, GROUP_CONCAT(t.tag_value) as moods
FROM bgms b
JOIN tags t ON t.resource_id = b.id AND t.resource_type = 'bgm' AND t.tag_type = 'mood'
WHERE t.tag_value IN ('吐槽', '搞笑')
GROUP BY b.id
ORDER BY COUNT(DISTINCT t.tag_value) DESC
LIMIT 3;
```

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

### 第四步：计算分镜时长（一图多句版）

**核心规则：每句字幕时长 = 字数 × 0.2s，单图时长 = 该图所有字幕时长之和**

```
图1 配 2 句字幕：
  "拼多多春节加班" = 7字 → 7 × 0.2 = 1.4s → 取整 1500ms（最低限制）
  "员工直接崩溃了" = 7字 → 7 × 0.2 = 1.4s → 取整 1500ms
  图1 总时长 = 1500 + 1500 = 3000ms

图2 配 3 句字幕（高潮快切）：
  "年终奖直接砍半" = 7字 → 1500ms
  "加班到凌晨三点" = 7字 → 1500ms
  "还不让请假" = 5字 → 1500ms（最低限制）
  图2 总时长 = 1500 + 1500 + 1500 = 4500ms
```

- 单句最短不低于 1500ms（快切节奏）
- 单句最长不超过 4000ms
- 单图最长不超过 10000ms
- 总时长 = 所有图片时长之和
- 背景音乐 duration = 总时长
- 每句字幕的 startTime = 前面所有字幕时长累加

### 第五步：构建 VideoProject

参考 [references/api-guide.md](references/api-guide.md) 了解完整 API 接口。

#### 字幕样式规范

```java
new TextStyle()
    .setFontSize(8)           // 字号 8
    .setBold(true)
    .setTextAlign(1)          // 居中
    .setFontName("抖音美好体")
    .setFillColor("#FFDE00")  // 黄色填充
    .setStrokeColor("#000000") // 黑色描边
    .setStrokeWidth(60)       // 描边粗细 60
```

- 字幕位置：`positionX=0, positionY=750`（底部居中，正值=下方）
- `asSubtitle=true`
- 缩放 130%：`zoomX=13000, zoomY=13000`（万分比）

#### 水印样式规范

```java
new TextStyle()
    .setFontSize(6)           // 字号 6（比字幕小）
    .setBold(true)
    .setTextAlign(1)          // 居中
    .setFontName("抖音美好体")
    .setFillColor("#FFFFFF")  // 白色填充
    .setStrokeColor("#D61400") // 红色描边
    .setStrokeWidth(60)       // 描边粗细 60
```

- 水印位置：`positionX=0, positionY=-800`（顶部区域）
- 水印覆盖整个视频时长
- 水印内容一般为品牌名或账号名

#### 图片设置

- `zoomX=10000, zoomY=10000`（100% 缩放）
- `positionX=0, positionY=0`（居中）

#### 音频设置

- 背景音乐：`volume=-30`（降低音量避免盖过配音）
- 配音音频：`volume=0`（原音量）
- 背景音乐建议加淡入淡出：`fadeInDuration=1000, fadeOutDuration=1000`

#### 配音音频

每条配音作为独立音频 segment，startTime 与对应字幕对齐。

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
- 背景音乐：从素材库召回，或使用 `bgm.mp3`
- 配音文件：`voiceover_1.mp3`, `voiceover_2.mp3`, ...
- 表情包：从素材库召回，作为独立图片 segment 插入分镜
- 使用 `file://` 本地路径，不依赖外部 CDN

### 素材库

- 表情包库：`/root/dreamX/doc/memes/`（按情绪分类子目录）
- BGM 库：`/root/dreamX/doc/bgm/`（按风格分类子目录）
- 元数据库：`/root/dreamX/doc/crawler/media_library.db`（SQLite）
- 爬取脚本：`/root/dreamX/doc/crawler/crawl_media.py`（python3.12 运行）
- 状态查询：`python3.12 /root/dreamX/doc/crawler/status.py`

### 表情包在视频中的使用方式

表情包作为独立的图片 segment 插入到分镜中：
- 在情绪高潮点插入 1-2 个表情包（如震惊、吐槽时刻）
- 表情包时长：1000-2000ms（快闪）
- 表情包位置：全屏覆盖或角落小图
- 全屏：`zoomX=10000, zoomY=10000, positionX=0, positionY=0`
- 角落：`zoomX=3000, zoomY=3000, positionX=3000, positionY=-2000`（右上角）

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
