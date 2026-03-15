# bilive 高能检测实现详解

**项目**: https://github.com/timerring/bilive  
**子模块**: https://github.com/timerring/auto-slice-video

---

## 一、bilive 高能检测架构

### 核心原理

bilive 的高能检测基于 **弹幕密度分析**，核心思想：
> 弹幕越密集的时间段 = 观众情绪越激烈 = 高能片段

### 技术栈

```
blrec (录制) → 弹幕 XML → DanmakuConvert (转 ASS) → auto-slice-video (密度分析) → ffmpeg (切片)
```

---

## 二、弹幕数据获取

### 1. blrec 录制模块

bilive 使用 [blrec](https://github.com/acgnhiki/blrec) 作为录制引擎：

```toml
# settings.toml
[[tasks]]
room_id = 123456
out_dir = "/path/to/output"
duration_limit = 1800  # 30 分钟分段
```

**blrec 自动生成**:
- 视频文件: `{room_id}_{timestamp}.flv`
- 弹幕文件: `{room_id}_{timestamp}.xml`

### 2. 弹幕 XML 格式

B 站弹幕 XML 示例：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<i>
  <d p="15.23,1,25,16777215,1234567890,0,abc123,0">哈哈哈笑死</d>
  <d p="15.45,1,25,16777215,1234567891,0,def456,0">666</d>
  <d p="16.12,1,25,16777215,1234567892,0,ghi789,0">卧槽牛逼</d>
  <!-- p 属性: 时间,模式,字号,颜色,时间戳,弹幕池,用户ID,弹幕ID -->
</i>
```

### 3. DanmakuConvert 转换

bilive 使用自己开源的 [DanmakuConvert](https://github.com/timerring/DanmakuConvert) 将 XML 转为 ASS：

```python
from DanmakuConvert import Danmaku2ASS

Danmaku2ASS(
    input_file='danmaku.xml',
    output_file='danmaku.ass',
    stage_width=1920,
    stage_height=1080
)
```

**ASS 格式示例**:
```
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:15.23,0:00:20.23,Default,,0,0,0,,哈哈哈笑死
Dialogue: 0,0:00:15.45,0:00:20.45,Default,,0,0,0,,666
Dialogue: 0,0:00:16.12,0:00:21.12,Default,,0,0,0,,卧槽牛逼
```

---

## 三、高能检测算法（auto-slice-video）

### 核心代码结构

```
auto-slice-video/
├── autosv/
│   ├── __init__.py
│   ├── autosv.py              # 主入口
│   ├── calculate/
│   │   ├── selection.py       # GPU/CPU 选择器
│   │   ├── sliding_cpu.py     # CPU 实现 ⭐
│   │   └── sliding_gpu.py     # GPU 实现（可选）
│   └── slice/
│       └── slice_video.py     # ffmpeg 切片
```

### 1. 主流程 (`autosv.py`)

```python
def slice_video_by_danmaku(
    ass_path,           # 弹幕 ASS 文件
    video_path,         # 视频文件
    duration=60,        # 切片时长（秒）
    top_n=1,            # 返回 top N 个片段
    max_overlap=30,     # 最大重叠（秒）
    step=1              # 滑动窗口步长（秒）
):
    # 1. 解析 ASS 文件，提取时间戳
    timestamps = extract_timestamps(ass_path)
    
    # 2. 滑动窗口找高能片段
    dense_periods = find_dense_periods(
        timestamps, duration, top_n, max_overlap, step
    )
    
    # 3. ffmpeg 切片
    slices_path = []
    for start_time, density in dense_periods:
        output = f"{start_time}s_{video_name}"
        slice_video(video_path, output, start_time, duration)
        slices_path.append(output)
    
    return slices_path
```

### 2. 时间戳提取 (`autosv.py`)

```python
def parse_time(time_str):
    """
    转换 ASS 时间格式为秒
    输入: "0:00:15.23"
    输出: 15.23
    """
    h, m, s = time_str.split(":")
    s, ms = s.split(".")
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000

def extract_timestamps(file_path):
    """
    从 ASS 文件提取所有弹幕的开始时间
    """
    timestamps = []
    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            if line.startswith("Dialogue:"):
                parts = line.split(",")
                start_time = parse_time(parts[1].strip())
                timestamps.append(start_time)
    return timestamps
```

**示例输出**:
```python
timestamps = [15.23, 15.45, 16.12, 18.34, 19.01, ...]
# 每个数字代表一条弹幕的出现时间（秒）
```

### 3. GPU/CPU 自动选择 (`selection.py`)

```python
def check_cuda_available():
    """检查 CUDA 是否可用"""
    try:
        subprocess.run(
            ["nvcc", "-V"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        return False

USE_GPU = check_cuda_available()
if USE_GPU:
    try:
        from .sliding_gpu import find_dense_periods_gpu
    except ImportError:
        USE_GPU = False

def find_dense_periods(log, timestamps, window_size, top_n, max_overlap, step):
    """根据 GPU 可用性选择实现"""
    if USE_GPU:
        log.info("Using GPU implementation")
        return find_dense_periods_gpu(timestamps, window_size, top_n, max_overlap, step)
    
    log.info("Using CPU implementation")
    return find_dense_periods_cpu(timestamps, window_size, top_n, max_overlap, step)
```

### 4. CPU 实现（核心算法）(`sliding_cpu.py`)

```python
from collections import defaultdict

def find_dense_periods_cpu(timestamps, window_size, top_n, max_overlap, step):
    """
    滑动窗口计算弹幕密度
    
    参数:
        timestamps: 弹幕时间戳列表 [15.23, 15.45, 16.12, ...]
        window_size: 窗口大小（秒），如 60
        top_n: 返回 top N 个片段
        max_overlap: 最大重叠（秒），如 30
        step: 步长（秒），如 1
    
    返回:
        [(start_time, density), ...] 按密度降序
    """
    
    # 步骤 1: 统计每个时间点的弹幕数量
    time_counts = defaultdict(int)
    for time in timestamps:
        time_counts[time] += 1
    
    # 示例: time_counts = {15.23: 1, 15.45: 1, 16.12: 1, ...}
    
    # 步骤 2: 滑动窗口计算密度
    density_periods = []
    sorted_times = sorted(time_counts.keys())
    
    for i in range(0, len(sorted_times), step):
        start_time = sorted_times[i]
        end_time = start_time + window_size
        
        # 统计窗口内的弹幕总数
        current_density = sum(
            count
            for time, count in time_counts.items()
            if start_time <= time < end_time
        )
        
        density_periods.append((start_time, current_density))
    
    # 示例: density_periods = [(0, 50), (1, 52), (2, 48), ...]
    
    # 步骤 3: 按密度降序排序
    density_periods.sort(key=lambda x: x[1], reverse=True)
    
    # 步骤 4: 过滤重叠片段
    if max_overlap is None:
        return density_periods[:top_n]
    
    filtered_periods = []
    for start_time, density in density_periods:
        # 检查与已选片段的重叠
        valid_period = True
        for selected_start, _ in filtered_periods:
            # 计算重叠时长
            overlap = min(selected_start + window_size, start_time + window_size) \
                    - max(selected_start, start_time)
            
            if overlap > max_overlap:
                valid_period = False
                break
        
        if valid_period:
            filtered_periods.append((int(start_time), density))
            if len(filtered_periods) == top_n:
                break
    
    return filtered_periods
```

**算法图解**:

```
时间轴:  0s -------- 60s -------- 120s -------- 180s
弹幕:    |||||||     ||||||||||   |||           ||||||
         ↑           ↑            ↑             ↑
         密度=7      密度=10      密度=3        密度=6

窗口 1 (0-60s):   密度 = 7
窗口 2 (1-61s):   密度 = 8
窗口 3 (2-62s):   密度 = 9
...
窗口 60 (60-120s): 密度 = 10  ← 最高密度

排序后: [(60, 10), (2, 9), (1, 8), (0, 7), ...]

过滤重叠 (max_overlap=30):
- 选中 (60, 10)
- 检查 (2, 9): 与 (60, 10) 重叠 = min(60+60, 2+60) - max(60, 2) = 62 - 60 = 2s < 30s ✓
- 选中 (2, 9)
- 检查 (1, 8): 与 (2, 9) 重叠 = min(2+60, 1+60) - max(2, 1) = 61 - 2 = 59s > 30s ✗

最终: [(60, 10), (2, 9)]
```

### 5. GPU 实现（可选）(`sliding_gpu.py`)

```python
import numpy as np
from numba import cuda

@cuda.jit
def compute_density_kernel(timestamps, window_size, step, densities):
    """CUDA 核函数：并行计算每个窗口的密度"""
    idx = cuda.grid(1)
    if idx < densities.shape[0]:
        start = idx * step
        end = start + window_size
        count = 0
        for t in timestamps:
            if start <= t < end:
                count += 1
        densities[idx] = count

def find_dense_periods_gpu(timestamps, window_size, top_n, max_overlap, step):
    """GPU 加速版本"""
    timestamps_gpu = cuda.to_device(np.array(timestamps))
    num_windows = (int(max(timestamps)) - int(min(timestamps))) // step
    densities = np.zeros(num_windows, dtype=np.int32)
    densities_gpu = cuda.to_device(densities)
    
    threads_per_block = 256
    blocks_per_grid = (num_windows + threads_per_block - 1) // threads_per_block
    
    compute_density_kernel[blocks_per_grid, threads_per_block](
        timestamps_gpu, window_size, step, densities_gpu
    )
    
    densities = densities_gpu.copy_to_host()
    # 后续处理同 CPU 版本
    ...
```

**性能对比**:
- CPU: 3 万条弹幕约 33 秒
- GPU: 3 万条弹幕约 2 秒（16.5 倍加速）
- 显存占用: 约 55 MB

---

## 四、视频切片 (`slice_video.py`)

```python
import subprocess

def slice_video(video_path, output_path, start_time, duration):
    """
    使用 ffmpeg 切片（流复制，无重编码）
    
    参数:
        video_path: 输入视频
        output_path: 输出路径
        start_time: 开始时间（秒）
        duration: 时长（秒）
    """
    cmd = [
        'ffmpeg',
        '-y',                    # 覆盖已存在文件
        '-ss', str(start_time),  # 开始时间
        '-t', str(duration),     # 时长
        '-i', video_path,        # 输入
        '-c', 'copy',            # ⭐ 流复制，无重编码
        output_path
    ]
    
    subprocess.run(cmd, check=True)
```

**关键参数**:
- `-c copy`: 流复制，不重新编码，速度快（秒级）
- `-ss` 在 `-i` 前: 快速定位（但可能不精确）
- `-ss` 在 `-i` 后: 精确定位（但较慢）

---

## 五、bilive 集成流程

### 配置文件 (`bilive.toml`)

```toml
[slice]
auto_slice = true           # 启用自动切片
slice_duration = 60         # 切片时长 60 秒
slice_num = 2               # 切 2 个片段
slice_overlap = 30          # 最大重叠 30 秒
slice_step = 1              # 步长 1 秒
min_video_size = 200        # 最小视频 200MB（防止切短片段）
```

### 主流程 (`src/slice/autoslice.py`)

```python
from auto_slice_video import slice_video_by_danmaku

def process_video(video_path, danmaku_path, config):
    """bilive 切片流程"""
    
    # 1. 检查视频大小
    if os.path.getsize(video_path) < config['min_video_size'] * 1024 * 1024:
        log.info("视频太小，跳过切片")
        return []
    
    # 2. 调用 auto-slice-video
    slices = slice_video_by_danmaku(
        ass_path=danmaku_path,
        video_path=video_path,
        duration=config['slice_duration'],
        top_n=config['slice_num'],
        max_overlap=config['slice_overlap'],
        step=config['slice_step']
    )
    
    # 3. 生成标题（MLLM）
    titles = []
    for slice_path in slices:
        title = generate_title_with_mllm(slice_path, config)
        titles.append(title)
    
    # 4. 生成封面（可选）
    covers = []
    if config.get('generate_cover'):
        for slice_path in slices:
            cover = generate_cover(slice_path, config)
            covers.append(cover)
    
    return list(zip(slices, titles, covers))
```

---

## 六、实际案例

### 输入

- 视频: `123456_20260315_120000.flv` (2 小时直播)
- 弹幕: `123456_20260315_120000.xml` (3 万条弹幕)

### 配置

```toml
slice_duration = 300  # 5 分钟片段
slice_num = 3         # 切 3 个
slice_overlap = 60    # 最大重叠 1 分钟
slice_step = 5        # 步长 5 秒（加速）
```

### 执行

```bash
python -m autosv \
  -a 123456_20260315_120000.ass \
  -v 123456_20260315_120000.flv \
  -d 300 -n 3 --overlap 60 --step 5
```

### 输出

```
[INFO] autosv v0.0.3
[INFO] Using CPU implementation
[INFO] The dense periods and their count are:
[INFO] Start from 3600 to 3900 seconds with the count is 1250
[INFO] Slice the /path/3600s_123456_20260315_120000.flv done.
[INFO] Start from 5400 to 5700 seconds with the count is 1180
[INFO] Slice the /path/5400s_123456_20260315_120000.flv done.
[INFO] Start from 1200 to 1500 seconds with the count is 1050
[INFO] Slice the /path/1200s_123456_20260315_120000.flv done.
```

生成文件:
- `3600s_123456_20260315_120000.flv` (1 小时处，弹幕密度 1250)
- `5400s_123456_20260315_120000.flv` (1.5 小时处，弹幕密度 1180)
- `1200s_123456_20260315_120000.flv` (20 分钟处，弹幕密度 1050)

---

## 七、优缺点分析

### 优点

1. **准确性高**: 弹幕密度直接反映观众情绪
2. **无需 GPU**: CPU 实现完全可用（3 万条/33 秒）
3. **可配置**: 窗口大小、重叠、步长均可调
4. **成熟稳定**: bilive 已在生产环境验证

### 缺点

1. **依赖弹幕**: 抖音无弹幕数据，无法直接复用
2. **冷门直播**: 弹幕少的直播效果差
3. **延迟发送**: 观众延迟发弹幕会影响准确性

### 抖音适配建议

由于抖音无弹幕数据，可以：

1. **降级方案**: 用 ASR 语速 + 情绪词替代弹幕密度
2. **混合方案**: ASR + 音频能量 + 画面变化
3. **固定切片**: 每 N 分钟切一段，让 MLLM 筛选

---

## 八、关键代码路径

| 功能 | 文件路径 |
|------|---------|
| 主入口 | `auto-slice-video/autosv/autosv.py` |
| CPU 算法 | `auto-slice-video/autosv/calculate/sliding_cpu.py` |
| GPU 算法 | `auto-slice-video/autosv/calculate/sliding_gpu.py` |
| 切片执行 | `auto-slice-video/autosv/slice/slice_video.py` |
| bilive 集成 | `bilive/src/slice/autoslice.py` |
| 弹幕转换 | `bilive/src/danmaku/DanmakuConvert/` |

---

## 九、总结

bilive 的高能检测核心是 **弹幕密度滑动窗口算法**：

1. **数据源**: blrec 录制的弹幕 XML
2. **预处理**: DanmakuConvert 转 ASS
3. **核心算法**: 滑动窗口统计弹幕数量
4. **优化**: GPU 加速（可选）
5. **切片**: ffmpeg 流复制

**关键参数**:
- `window_size`: 窗口大小（如 60 秒）
- `top_n`: 返回 top N 个片段
- `max_overlap`: 最大重叠（如 30 秒）
- `step`: 步长（如 1 秒，可增大加速）

**性能**:
- CPU: 3 万条弹幕约 33 秒
- GPU: 3 万条弹幕约 2 秒
- 硬件: 1 核 CPU + 2GB 内存即可

**抖音适配**: 由于无弹幕数据，需要用 ASR 或其他方式替代。
