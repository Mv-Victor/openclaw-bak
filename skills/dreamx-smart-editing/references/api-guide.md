# DreamX API 接口参考

## 模块架构

```
duo-server-base    → 基础工具（SnowflakeId、JSON、文件工具）
duo-video-base     → 视频工程模型 + Builder 模式 API
duo-video-jy       → 剪映工程文件生成器（JianyingBuilder）
duo-video-api      → Spring Boot REST API + COS 上传
```

## REST API 接口

Base URL: `http://localhost:17026/api/project`

### 创建工程
```
POST /api/project
{
  "projectId": 100001,        // 工程ID（long）
  "width": 1080,              // 画布宽
  "height": 1920              // 画布高
}
```

### 添加图片
```
POST /api/project/image
{
  "projectId": 100001,
  "imageId": 1001,            // 素材ID
  "imageUrl": "file:///path/to/1.jpg",
  "startTime": 0,             // 时间轴起始（毫秒）
  "duration": 3000,           // 持续时长（毫秒）
  "scriptIndex": 0,           // 分镜索引（默认0）
  "layoutIndex": null,        // 图层顺序
  "positionX": null,          // X坐标
  "positionY": null,          // Y坐标
  "width": null,              // 宽度
  "height": null,             // 高度
  "rotate": null,             // 旋转角度
  "speed": null,              // 播放速度
  "visible": null             // 是否可见
}
```

### 添加视频
```
POST /api/project/video
{
  "projectId": 100001,
  "videoId": 2001,
  "videoUrl": "file:///path/to/video.mp4",
  "startTime": 0,
  "duration": 5000,
  "scriptIndex": 0,
  "materialTimeStart": null,  // 素材裁剪起始
  "materialTimeEnd": null,    // 素材裁剪结束
  "materialStart": null,      // 素材起始偏移
  "layoutIndex": null,
  "positionX": null,
  "positionY": null,
  "width": null,
  "height": null,
  "rotate": null,
  "speed": null,
  "visible": null,
  "volume": null              // 音量（-100~100）
}
```

### 添加音频
```
POST /api/project/audio
{
  "projectId": 100001,
  "audioId": 3001,
  "audioUrl": "file:///path/to/bgm.mp3",
  "startTime": 0,
  "duration": 15000,
  "scriptIndex": 0,
  "materialTimeStart": null,
  "materialTimeEnd": null,
  "materialStart": null,
  "layoutIndex": null,
  "speed": null,
  "visible": null,
  "volume": null,
  "fadeInDuration": 1000,     // 淡入时长（毫秒）
  "fadeOutDuration": 1000     // 淡出时长（毫秒）
}
```

### 添加文本
```
POST /api/project/text
{
  "projectId": 100001,
  "text": "字幕内容",
  "startTime": 0,
  "duration": 3000,
  "scriptIndex": 0,
  "layoutIndex": null,
  "positionX": null,
  "positionY": null,
  "rotate": null,
  "asSubtitle": true,         // 作为字幕
  "fontFamily": null,         // 字体
  "fontSize": null,            // 字号
  "fontColor": null,           // 颜色（hex）
  "bold": null,
  "italic": null,
  "underline": null,
  "lineSpacing": null,
  "letterSpacing": null,
  "textAlign": null            // 对齐方式
}
```

### 添加文本模板
```
POST /api/project/text-template
{
  "projectId": 100001,
  "templateId": 5001,
  "texts": ["标题", "副标题"],
  "startTime": 0,
  "duration": 3000
}
```

### 添加贴纸
```
POST /api/project/sticker
{
  "projectId": 100001,
  "stickerId": 6001,
  "startTime": 0,
  "duration": 3000
}
```

### 添加视频特效
```
POST /api/project/video-effect
{
  "projectId": 100001,
  "effectId": 7001,
  "startTime": 0,
  "duration": 3000
}
```

### 添加人脸特效
```
POST /api/project/face-effect
{
  "projectId": 100001,
  "effectId": 8001,
  "startTime": 0,
  "duration": 3000
}
```

### 添加音效
```
POST /api/project/sound
{
  "projectId": 100001,
  "soundId": 9001,
  "startTime": 0,
  "duration": 1000
}
```

### 构建工程
```
POST /api/project/build
{
  "projectId": 100001
}
```
返回 taskId（long），构建流程：
1. 加载 VideoProject
2. JianyingBuilder.build() 生成剪映工程文件
3. zip 压缩
4. 上传 COS
5. 返回永久下载链接

## VideoProject JSON 直接构造

当不通过 REST API 而是直接构造 JSON 时，结构如下：

```json
{
  "id": 100001,
  "canvas": {"width": 1080, "height": 1920},
  "scripts": [{
    "segments": [
      {
        "id": 10001,
        "materialId": 1001,
        "type": "MATERIAL_TYPE_IMAGE",
        "videoTime": {"start": 0, "duration": 3000},
        "layoutIndex": 0
      },
      {
        "id": 10002,
        "materialId": 3001,
        "type": "MATERIAL_TYPE_AUDIO",
        "videoTime": {"start": 0, "duration": 15000},
        "layoutIndex": 1000
      },
      {
        "id": 10003,
        "materialId": 0,
        "type": "MATERIAL_TYPE_TEXT",
        "videoTime": {"start": 0, "duration": 3000},
        "layoutIndex": 2000
      }
    ],
    "materials": [
      {"id": 1001, "url": "file:///path/to/1.jpg", "type": "IMAGE"},
      {"id": 3001, "url": "file:///path/to/bgm.mp3", "type": "AUDIO"},
      {"id": 0, "type": "TEXT", "text": "字幕内容"}
    ]
  }]
}
```

## 支持的素材类型

| 类型 | MaterialTypeEnum | Builder |
|------|-----------------|---------|
| 图片 | MATERIAL_TYPE_IMAGE | ProjectImageBuilder |
| 视频 | MATERIAL_TYPE_VIDEO | ProjectVideoBuilder |
| 音频 | MATERIAL_TYPE_AUDIO | ProjectAudioBuilder |
| 文本 | MATERIAL_TYPE_TEXT | ProjectTextBuilder |
| 文本模板 | MATERIAL_TYPE_TEXT_TEMPLATE | ProjectTextTemplateBuilder |
| 贴纸 | MATERIAL_TYPE_STICKER | ProjectStickerBuilder |
| 视频特效 | MATERIAL_TYPE_VIDEO_EFFECT | ProjectVideoEffectBuilder |
| 人脸特效 | MATERIAL_TYPE_FACE_EFFECT | ProjectFaceEffectBuilder |
| 音效 | MATERIAL_TYPE_SOUND | ProjectSoundBuilder |
| 转场 | MATERIAL_TYPE_TRANSITION | TransitionMaterial |
| 遮罩 | MATERIAL_TYPE_MASK | ProjectMaskBuilder |
| LUT滤镜 | MATERIAL_TYPE_LUT | LutMaterial |
| 绿幕 | MATERIAL_TYPE_GREEN_BACKGROUND | ProjectGreenBackgroundBuilder |

## 文件路径

- 工程存储：`./tmp/projects/<projectId>.json`
- 资源缓存：`./tmp/rs/`
- 剪映输出：`./tmp/jy/<projectId>/`
- COS 上传路径：`jy-projects/<projectId>/<projectId>.zip`
