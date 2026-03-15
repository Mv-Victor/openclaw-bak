# 直播自动切片方案设计与实现

**版本**: v1.0  
**日期**: 2026-03-15  
**作者**: G（总指挥/军师/智库）

---

## 一、需求概述

设计一套支持 **抖音** 和 **B 站** 的直播自动切片系统，要求：
1. 无需 GPU 即可运行（兼容低配服务器）
2. 自动录制直播
3. 自动识别高能片段并切片
4. 自动生成标题和封面
5. 自动上传至对应平台

---

## 二、技术调研总结

### 2.1 auto-slicing 项目 - vedit MCP Service 实现

**项目地址**: https://github.com/zakahan/auto-slicing

#### 核心架构
```
auto-slicing
├── src/
│   ├── processor/        # 各模块入口
│   ├── main.py           # 主流程
│   └── .env              # 配置（火山方舟 API）
└── vedit-mcp/            # 视频编辑 MCP 服务
    ├── vedit_mcp.py      # MCP 服务实现
    └── requirements.txt
```

#### vedit-mcp 实现细节

**技术栈**:
- Python 3.11-3.12
- MCP SDK (`mcp.server.fastmcp.FastMCP`)
- ffmpeg（底层视频操作）
- loguru（日志）

**核心工具** (MCP Tools):
```python
# 1. 视频切片
@mcp.tool()
def clip_video_tool(
    original_video_path: str,
    task_id: str,
    start_time: int,
    stop_time: int,
    title: str
) -> dict

# 2. 视频合并
@mcp.tool()
def merge_videos_tool(
    video_paths: list[str],
    task_id: str
) -> dict

# 3. 添加音频
@mcp.tool()
def add_audio_to_video(
    video_path: str,
    audio_path: str,
    output_path: str,
    start_time: int = 0,
    audio_duration: int = None
) -> tuple[bool, str]
```

**路径管理策略**:
- 所有路径基于 `KB_DIR` 基准目录
- 避免 LLM 生成错误路径
- 目录结构:
  ```
  KB_DIR/
  ├── raw/          # 原始视频
  ├── clip/         # 切片临时文件
  ├── merge/        # 合并临时文件
  ├── add/          # 添加素材
  └── result/       # 最终结果
  ```

**ffmpeg 命令示例**:
```bash
# 切片（流复制，无重编码）
ffmpeg -y -ss {start} -to {stop} -i {input} -c copy {output}

# 合并
ffmpeg -y -f concat -safe 0 -i list.txt -c copy {output}

# 添加背景音乐
ffmpeg -i {video} -i {audio} -filter_complex \
  '[0:a]volume=1[a1];[1:a]volume=1[a2];[a1][a2]amix=inputs=2[aout]' \
  -map '0:v' -map '[aout]' -c:v copy -c:a aac {output}
```

#### ASR 方案
- **本地模型**: SenseVoiceSmall + VAD (modelscope)
- **API 方案**: 火山方舟平台
- **说话人分离**: TODO（游戏回、看视频回等多声音场景）

---

### 2.2 bilive 项目 - 无 GPU 直播切片方案

**项目地址**: https://github.com/timerring/bilive

#### 无 GPU 配置方案

**1. ASR 字幕识别** (`bilive.toml`):
```toml
[asr]
# 方案 A: 完全禁用（最快，无字幕）
asr_method = "none"

# 方案 B: API 模式（推荐，无 GPU 依赖）
asr_method = "api"
whisper_api_key = "your-groq-api-key"  # https://console.groq.com/keys
# 限制：40MB/30 分钟，7200 秒/20 次/小时

# 方案 C: 本地部署（需要 NVIDIA GPU）
asr_method = "deploy"
inference_model = "small"  # 需要 2.7GB 显存
```

**2. 自动切片** (`bilive.toml`):
```toml
[slice]
auto_slice = true
slice_duration = 60          # 切片时长（秒），建议≤300
slice_num = 2                # 切片数量
slice_overlap = 30           # 重叠时长（秒）
slice_step = 1               # 滑动窗口步长（秒）
min_video_size = 200         # 最小视频大小（MB）

# MLLM 标题生成（全部为 API，无需 GPU）
mllm_model = "qwen"          # qwen/gemini/zhipu/sensenova
qwen_api_key = ""
```

**3. 处理模式** (`bilive.toml`):
```toml
[model]
# pipeline: 最快，ASR 与渲染并行（推荐 API 模式）
# append: 串行执行，比 pipeline 慢 25%，显存要求低
# merge: 等待录制完成再处理，效率最低
model_type = "append"
```

#### 核心算法：弹幕密度滑动窗口

**项目地址**: https://github.com/timerring/auto-slice-video

**CPU 实现** (`sliding_cpu.py`):
```python
def find_dense_periods_cpu(timestamps, window_size, top_n, max_overlap, step):
    """
    滑动窗口计算弹幕密度
    
    性能：3 万条弹幕约 33 秒（GPU 仅需 2 秒，16.5 倍差距）
    但 CPU 完全可用，无需 GPU
    """
    # 1. 统计每个时间点的弹幕数
    time_counts = defaultdict(int)
    for time in timestamps:
        time_counts[time] += 1
    
    # 2. 滑动窗口计算密度
    density_periods = []
    sorted_times = sorted(time_counts.keys())
    for i in range(0, len(sorted_times), step):
        start_time = sorted_times[i]
        end_time = start_time + window_size
        current_density = sum(
            count for time, count in time_counts.items()
            if start_time <= time < end_time
        )
        density_periods.append((start_time, current_density))
    
    # 3. 排序并过滤重叠
    density_periods.sort(key=lambda x: x[1], reverse=True)
    filtered_periods = []
    for start_time, density in density_periods:
        valid = True
        for selected_start, _ in filtered_periods:
            overlap = min(selected_start + window_size, start_time + window_size) \
                    - max(selected_start, start_time)
            if overlap > max_overlap:
                valid = False
                break
        if valid:
            filtered_periods.append((int(start_time), density))
            if len(filtered_periods) == top_n:
                break
    
    return filtered_periods
```

**切片执行** (`slice_video.py`):
```python
def slice_video(video_path, output_path, start_time, duration):
    """使用 ffmpeg 切片（流复制，无重编码）"""
    cmd = [
        'ffmpeg', '-y',
        '-ss', str(start_time),
        '-t', str(duration),
        '-i', video_path,
        '-c', 'copy',  # 关键：流复制，速度快
        output_path
    ]
    subprocess.run(cmd, check=True)
```

#### 硬件要求（无 GPU 版本）
| 配置项 | 最低要求 | 推荐配置 |
|--------|---------|---------|
| CPU | 单核 | 4 核+ |
| 内存 | 2GB | 8GB+ |
| 硬盘 | 30GB | 100GB+ |
| 带宽 | 3Mbps | 50Mbps+ |
| GPU | **不需要** | **不需要** |

**实测环境**:
- Oracle Cloud ARM: 1 核 Neoverse-N1, 4GB 内存 ✅
- Alicloud x64: 2 核 Intel Xeon, 2GB 内存 ✅
- 10 年前的电脑 ✅

---

## 三、整合方案设计

### 3.1 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Live Slicing System                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                     │
│  │  抖音录制     │      │   B 站录制     │                     │
│  │  (yt-dlp)    │      │   (blrec)    │                     │
│  └──────┬───────┘      └──────┬───────┘                     │
│         │                     │                              │
│         └──────────┬──────────┘                              │
│                    │                                         │
│                    ▼                                         │
│         ┌─────────────────────┐                             │
│         │   统一录制管理器      │                             │
│         │  (recording_manager)│                             │
│         └──────────┬──────────┘                             │
│                    │                                         │
│         ┌──────────┴──────────┐                             │
│         ▼                     ▼                              │
│  ┌─────────────┐       ┌─────────────┐                      │
│  │  弹幕/评论   │       │   ASR 字幕   │                      │
│  │  密度分析    │       │  (Groq API) │                      │
│  └──────┬──────┘       └──────┬──────┘                      │
│         │                     │                              │
│         └──────────┬──────────┘                              │
│                    │                                         │
│                    ▼                                         │
│         ┌─────────────────────┐                             │
│         │  高能片段检测引擎     │                             │
│         │ (dense_period_finder)│                            │
│         └──────────┬──────────┘                             │
│                    │                                         │
│                    ▼                                         │
│         ┌─────────────────────┐                             │
│         │   视频切片服务       │                             │
│         │   (vedit-mcp)       │                             │
│         └──────────┬──────────┘                             │
│                    │                                         │
│         ┌──────────┴──────────┐                             │
│         ▼                     ▼                              │
│  ┌─────────────┐       ┌─────────────┐                      │
│  │  MLLM 标题   │       │  封面生成    │                      │
│  │  (Qwen API) │       │ (Minimax)   │                      │
│  └──────┬──────┘       └──────┬──────┘                      │
│         │                     │                              │
│         └──────────┬──────────┘                              │
│                    │                                         │
│                    ▼                                         │
│         ┌─────────────────────┐                             │
│         │   统一上传服务       │                             │
│         │  (upload_manager)   │                             │
│         └──────────┬──────────┘                             │
│                    │                                         │
│         ┌──────────┴──────────┐                             │
│         ▼                     ▼                              │
│  ┌─────────────┐       ┌─────────────┐                      │
│  │   抖音上传   │       │   B 站上传    │                      │
│  │ (Douyin API)│       │ (bilitool)  │                      │
│  └─────────────┘       └─────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 技术选型

| 模块 | 技术方案 | 说明 |
|------|---------|------|
| **抖音录制** | yt-dlp | 支持抖音直播录制，无需 GPU |
| **B 站录制** | blrec | bilive 子模块，成熟稳定 |
| **弹幕获取** | B 站：blrec 内置<br>抖音：Web 爬虫 | 抖音弹幕需自行实现 |
| **ASR 字幕** | Groq API (whisper-large-v3-turbo) | Free tier: 40MB/30min |
| **高能检测** | 弹幕密度滑动窗口 (CPU) | 无需 GPU，3 万条/33 秒 |
| **视频切片** | vedit-mcp (ffmpeg) | 流复制，无重编码 |
| **标题生成** | Qwen-2.5-72B-Instruct API | 火山方舟/阿里云 |
| **封面生成** | Minimax image-01 API | 图生图，风格转换 |
| **B 站上传** | bilitool | bilive 子模块，支持多 P |
| **抖音上传** | 抖音开放平台 API / 网页自动化 | 需进一步调研 |

### 3.3 核心模块设计

#### 模块 1: 统一录制管理器 (`recording_manager.py`)

```python
import asyncio
import yt_dlp
from blrec.task import Task as BlrecTask

class RecordingManager:
    def __init__(self, config):
        self.config = config
        self.tasks = {}
    
    async def start_douyin(self, room_url, output_dir):
        """启动抖音直播录制"""
        ydl_opts = {
            'format': 'best',
            'outtmpl': f'{output_dir}/%(id)s.%(ext)s',
            'hls_prefer_native': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([room_url])
    
    async def start_bilibili(self, room_id, output_dir):
        """启动 B 站直播录制"""
        task = BlrecTask(room_id, output_dir)
        await task.start()
        return task
    
    async def stop_all(self):
        """停止所有录制任务"""
        for task in self.tasks.values():
            await task.stop()
```

#### 模块 2: 弹幕密度分析 (`danmaku_analyzer.py`)

```python
from collections import defaultdict
from typing import List, Tuple

class DanmakuAnalyzer:
    def __init__(self, window_size=60, top_n=3, max_overlap=30, step=1):
        self.window_size = window_size  # 窗口大小（秒）
        self.top_n = top_n              # 返回 top N 个片段
        self.max_overlap = max_overlap  # 最大重叠（秒）
        self.step = step                # 步长（秒）
    
    def parse_ass_timestamps(self, ass_path: str) -> List[float]:
        """解析 ASS 弹幕文件时间戳"""
        timestamps = []
        with open(ass_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('Dialogue:'):
                    parts = line.split(',')
                    start_time = self._parse_ass_time(parts[1].strip())
                    timestamps.append(start_time)
        return timestamps
    
    def _parse_ass_time(self, time_str: str) -> float:
        """转换 ASS 时间格式为秒"""
        h, m, s = time_str.split(':')
        s, ms = s.split('.')
        return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
    
    def find_dense_periods(self, timestamps: List[float]) -> List[Tuple[int, int]]:
        """查找弹幕密集时间段（CPU 实现）"""
        # 统计每个时间点的弹幕数
        time_counts = defaultdict(int)
        for t in timestamps:
            time_counts[t] += 1
        
        # 滑动窗口计算密度
        density_periods = []
        sorted_times = sorted(time_counts.keys())
        
        for i in range(0, len(sorted_times), self.step):
            start = sorted_times[i]
            end = start + self.window_size
            density = sum(c for t, c in time_counts.items() if start <= t < end)
            density_periods.append((start, density))
        
        # 排序并过滤重叠
        density_periods.sort(key=lambda x: x[1], reverse=True)
        
        filtered = []
        for start, density in density_periods:
            valid = True
            for sel_start, _ in filtered:
                overlap = min(sel_start + self.window_size, start + self.window_size) \
                        - max(sel_start, start)
                if overlap > self.max_overlap:
                    valid = False
                    break
            if valid:
                filtered.append((int(start), density))
                if len(filtered) == self.top_n:
                    break
        
        return filtered
```

#### 模块 3: 视频切片服务 (`video_slicer.py`)

```python
import subprocess
import os
from pathlib import Path

class VideoSlicer:
    def __init__(self, kb_dir: str):
        self.kb_dir = Path(kb_dir)
        self.clip_dir = self.kb_dir / 'clip'
        self.result_dir = self.kb_dir / 'result'
    
    def slice(self, video_path: str, start_time: int, duration: int, title: str) -> str:
        """切片视频（流复制，无重编码）"""
        video_path = self.kb_dir / video_path
        output_path = self.clip_dir / f'{title}.mp4'
        
        cmd = [
            'ffmpeg', '-y',
            '-ss', str(start_time),
            '-t', str(duration),
            '-i', str(video_path),
            '-c', 'copy',  # 关键：流复制
            str(output_path)
        ]
        
        subprocess.run(cmd, check=True)
        return str(output_path)
    
    def merge(self, video_paths: list, output_name: str) -> str:
        """合并多个视频"""
        # 创建临时文件列表
        list_file = self.kb_dir / 'temp_list.txt'
        with open(list_file, 'w') as f:
            for path in video_paths:
                f.write(f"file '{path}'\n")
        
        output_path = self.result_dir / f'{output_name}.mp4'
        
        cmd = [
            'ffmpeg', '-y',
            '-f', 'concat',
            '-safe', '0',
            '-i', str(list_file),
            '-c', 'copy',
            str(output_path)
        ]
        
        subprocess.run(cmd, check=True)
        os.remove(list_file)
        return str(output_path)
```

#### 模块 4: MLLM 标题生成 (`title_generator.py`)

```python
import requests

class TitleGenerator:
    def __init__(self, api_key: str, model='qwen'):
        self.api_key = api_key
        self.model = model
        self.api_base = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    
    def generate(self, video_info: dict, danmaku_highlights: list) -> str:
        """生成视频标题"""
        prompt = f"""
你是专业的视频标题生成助手。请根据以下信息生成一个吸引人的视频标题：

主播：{video_info.get('artist', '未知')}
直播日期：{video_info.get('date', '未知')}
直播内容：{video_info.get('description', '未知')}

弹幕高能片段：
{chr(10).join(danmaku_highlights)}

要求：
1. 标题长度 20-30 字
2. 包含关键词和情绪点
3. 不要有 emoji
4. 只返回标题，不要其他内容
"""
        
        response = requests.post(
            f'{self.api_base}/chat/completions',
            headers={'Authorization': f'Bearer {self.api_key}'},
            json={
                'model': 'qwen-plus',
                'messages': [{'role': 'user', 'content': prompt}]
            }
        )
        
        return response.json()['choices'][0]['message']['content'].strip()
```

#### 模块 5: 统一上传服务 (`upload_manager.py`)

```python
import subprocess
import json

class UploadManager:
    def __init__(self, config):
        self.config = config
    
    async def upload_to_bilibili(self, video_path: str, title: str, desc: str):
        """上传到 B 站"""
        # 使用 bilitool
        cmd = [
            'bilitool', 'upload',
            '-f', video_path,
            '-t', title,
            '-d', desc,
            '--tid', str(self.config['bili_tid'])
        ]
        subprocess.run(cmd, check=True)
    
    async def upload_to_douyin(self, video_path: str, title: str, desc: str):
        """上传到抖音"""
        # 方案 A: 抖音开放平台 API（需要企业资质）
        # 方案 B: 网页自动化（selenium/playwright）
        # TODO: 实现抖音上传
        pass
```

---

## 四、实施路线图

### Phase 1: 基础框架搭建（预计 3 天）

**Day 1**: 项目初始化
- [ ] 创建项目结构
- [ ] 配置依赖（requirements.txt）
- [ ] 实现配置管理（config.yaml）

**Day 2**: 录制模块
- [ ] 集成 yt-dlp（抖音录制）
- [ ] 集成 blrec（B 站录制）
- [ ] 实现统一录制管理器

**Day 3**: 弹幕处理
- [ ] B 站弹幕解析（ASS 格式）
- [ ] 抖音评论/弹幕爬取（需调研）
- [ ] 实现弹幕密度分析引擎

### Phase 2: 核心功能开发（预计 5 天）

**Day 4-5**: 视频切片
- [ ] 集成 vedit-mcp
- [ ] 实现 ffmpeg 切片服务
- [ ] 实现视频合并功能

**Day 6**: ASR 字幕
- [ ] 集成 Groq API（whisper）
- [ ] 实现字幕渲染（可选）

**Day 7-8**: 标题与封面
- [ ] 集成 Qwen API（标题生成）
- [ ] 集成 Minimax API（封面生成）
- [ ] 实现 prompt 模板

### Phase 3: 上传与部署（预计 4 天）

**Day 9-10**: 上传模块
- [ ] 集成 bilitool（B 站上传）
- [ ] 调研抖音上传方案
- [ ] 实现统一上传服务

**Day 11**: 配置与测试
- [ ] 编写配置文件模板
- [ ] 端到端测试
- [ ] 性能优化

**Day 12**: 部署
- [ ] Docker 镜像构建
- [ ] 部署文档
- [ ] 监控与日志

---

## 五、关键技术点

### 5.1 无 GPU 性能优化

1. **ffmpeg 流复制**: `-c copy` 避免重编码
2. **滑动窗口步长**: 增大 step 减少计算量（1 秒→5 秒）
3. **并发处理**: ASR 与弹幕分析并行
4. **API 限流处理**: Groq free tier 需控制视频分段≤30 分钟

### 5.2 抖音弹幕获取方案

**挑战**: 抖音无公开弹幕 API

**可选方案**:
1. **Web 爬虫**: 使用 playwright 模拟浏览器获取直播评论
2. **第三方 API**: 调研是否有商业 API 服务
3. **降级方案**: 仅基于视频内容分析（画面变化、音频能量）

**推荐**: 先实现 B 站完整版，抖音采用降级方案（仅 ASR+ 画面分析）

### 5.3 成本控制

| 项目 | 免费额度 | 单价 | 建议 |
|------|---------|------|------|
| Groq Whisper | 7200 秒/小时 | $0 | 充分利用 |
| Qwen API | - | ¥0.004/1K tokens | 标题生成成本低 |
| Minimax | - | 按量计费 | 封面生成可选 |
| 火山方舟 | 新用户赠送 | 按量计费 | 备用方案 |

---

## 六、项目结构建议

```
live-slicing-system/
├── config/
│   ├── config.yaml          # 主配置
│   └── platforms/
│       ├── douyin.yaml      # 抖音配置
│       └── bilibili.yaml    # B 站配置
├── src/
│   ├── recording/
│   │   ├── __init__.py
│   │   ├── manager.py       # 统一录制管理器
│   │   ├── douyin.py        # 抖音录制
│   │   └── bilibili.py      # B 站录制
│   ├── analysis/
│   │   ├── __init__.py
│   │   ├── danmaku.py       # 弹幕分析
│   │   ├── asr.py           # ASR 字幕
│   │   └── dense_finder.py  # 高能检测
│   ├── editing/
│   │   ├── __init__.py
│   │   ├── slicer.py        # 视频切片
│   │   └── merger.py        # 视频合并
│   ├── generation/
│   │   ├── __init__.py
│   │   ├── title.py         # 标题生成
│   │   └── cover.py         # 封面生成
│   ├── upload/
│   │   ├── __init__.py
│   │   ├── manager.py       # 统一上传
│   │   ├── bilibili.py      # B 站上传
│   │   └── douyin.py        # 抖音上传
│   └── main.py              # 主入口
├── tests/
│   ├── test_danmaku.py
│   ├── test_slicer.py
│   └── test_upload.py
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## 七、风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 抖音弹幕无法获取 | 中 | 降级为仅 ASR+ 画面分析 |
| Groq API 限流 | 中 | 分段录制≤30 分钟，或付费升级 |
| 抖音上传 API 限制 | 高 | 优先实现 B 站，抖音采用网页自动化 |
| 低配服务器性能不足 | 低 | 增大滑动窗口步长，减少并发 |
| 直播流不稳定 | 中 | blrec 支持自动重连和分段合并 |

---

## 八、下一步行动

### 立即执行（建议派工给啾啾）

1. **创建项目骨架**
   ```bash
   mkdir -p live-slicing-system/{config,src/{recording,analysis,editing,generation,upload},tests}
   ```

2. **编写配置文件模板**
   - config.yaml
   - requirements.txt

3. **实现弹幕密度分析模块**（核心算法，可独立测试）

4. **搭建端到端测试流程**
   - 录制 → 分析 → 切片 → 生成标题 → 上传

### 需要栋少决策

1. **抖音上传方案**: 是否有抖音开放平台企业账号？
2. **API 预算**: 是否愿意为 Groq/阿里云 API 付费？
3. **优先级**: B 站优先还是抖音 B 站并行？

---

## 九、参考资料

1. auto-slicing: https://github.com/zakahan/auto-slicing
2. vedit-mcp: https://github.com/zakahan/vedit-mcp
3. bilive: https://github.com/timerring/bilive
4. auto-slice-video: https://github.com/timerring/auto-slice-video
5. bilitool: https://github.com/timerring/bilitool
6. blrec: https://github.com/acgnhiki/blrec
7. Groq Whisper API: https://console.groq.com/keys
8. agent-reach: https://github.com/Panniantong/agent-reach

---

**文档版本**: v1.0  
**最后更新**: 2026-03-15 12:30 GMT+8
