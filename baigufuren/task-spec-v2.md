# 《白骨夫人》三版对比实验 - 完整任务规格

## 目标
用 huobao-drama 的完整功能端到端跑通《白骨夫人》短剧生成，产出三个版本的视频文件进行对比。

## API 配置
- 文生视频/文生图 API：https://poloai.top
- Token：sk-vPYI81WXaBK95LE9TGPRWMVlpQ6YOOkKCKopNTtiFWROBxPW
- API 文档：https://poloapi.apifox.cn/395701558e0
- 文本生成（剧本/分镜）：使用 models.json 中的 claude 系列模型

## 三个版本

### 版本A：基准版（master 分支）
- 使用 master 分支现有逻辑
- 完整流程：创建项目 → 输入剧本 → AI生成分镜 → 生成image_prompt → 文生图 → 生成video_prompt → 文生视频 → 合并视频
- 不做任何代码改动

### 版本B：镜头语法库 + Motion Prompt（新分支）
- 基于 master 创建新分支 feature/baigufuren-shotgrammar
- 集成 pkg/shotgrammar 到分镜生成流程
- 集成 pkg/motionprompt 增强 video_prompt
- 不包含情绪编排引擎
- 同样跑完整流程产出视频

### 版本C：+ 情绪编排引擎（新分支）
- 基于版本B分支创建 feature/baigufuren-emotion
- 集成 pkg/emotionengine
- 情绪弧线驱动镜头选择、BGM、时长、转场
- 同样跑完整流程产出视频

## 执行阶段

### Phase 0：环境准备
1. 确认 huobao-drama 能编译运行（go build）
2. 配置 AI provider：
   - text provider: claude（models.json）
   - image provider: poloai（配置 API key）
   - video provider: poloai（配置 API key + sora-2-guan 模型）
3. 启动后端服务 + 前端
4. 确认 API 可用（curl 测试 poloai）

### Phase 1：版本A - 基准
1. git checkout master
2. 启动服务
3. 通过 API/前端创建项目《白骨夫人》
4. 输入原文作为剧本
5. AI 生成分镜（7场）
6. 批量生成 image_prompt → 文生图
7. 批量生成 video_prompt → 文生视频
8. 合并视频文件
9. 保存所有产出到 /root/.openclaw/workspace-g/baigufuren/version-a/

### Phase 2：版本B - 镜头语法库
1. git checkout -b feature/baigufuren-shotgrammar master
2. 修改 storyboard_service.go：集成 shotgrammar 规则匹配
3. 修改 generateVideoPrompt：集成 motionprompt 引擎
4. git commit
5. 重启服务，同样流程跑一遍
6. 保存产出到 /root/.openclaw/workspace-g/baigufuren/version-b/

### Phase 3：版本C - 情绪编排引擎
1. git checkout -b feature/baigufuren-emotion feature/baigufuren-shotgrammar
2. 修改分镜生成：先分析情绪弧线，再驱动镜头选择
3. 集成 emotionengine 到 storyboard_service
4. git commit
5. 重启服务，同样流程跑一遍
6. 保存产出到 /root/.openclaw/workspace-g/baigufuren/version-c/

### Phase 4：对比报告
1. 三版视频文件对比
2. 逐场分镜参数对比
3. 生成对比报告

## 产出物
每个版本目录下应包含：
- storyboards.json（分镜数据）
- images/（文生图结果）
- videos/（文生视频结果）
- merged-video.mp4（合并后的完整视频）
- prompts.json（所有 prompt 记录）

## 注意事项
- 每个阶段完成后立即汇报给 G，由 G 评审后汇报栋少
- 视频文件是必须产出的，不能只有 prompt
- 如果 API 调用失败要记录错误并重试
- 三个版本使用同一个剧本输入，确保对比公平
