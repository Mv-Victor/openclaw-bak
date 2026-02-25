# 情绪驱动短剧生成 - 三版对比实验任务书

## 背景
huobao-drama 现有分镜生成流程缺少情绪节奏控制和镜头语法规则。
`pkg/shotgrammar/grammar.go` 已有初版镜头语法库但未集成。
目标：通过三版对比验证情绪编排引擎的价值。

## 测试剧本
`/root/.openclaw/workspace-g/emotion-experiment/test-scenario.md`
《最后一通电话》7场戏，情绪弧线：平静→不安→紧张→愤怒→悲伤→坚定→释然

---

## 任务分工

### G（总指挥）负责
1. ✅ 测试剧本设计（已完成）
2. ✅ 镜头语法库设计（`pkg/shotgrammar/grammar.go` 已有初版）
3. 情绪编排引擎架构设计（版本C的核心模块）
4. 三版对比评审和质量收口

### 啾啾（执行）负责

#### Phase 1: 版本A基准采集
1. 在 huobao-drama master 分支，用现有 `GetStoryboardSystemPrompt()` 对测试剧本生成分镜
2. 记录每场输出的 shot_type, angle, movement, image_prompt, emotion, emotion_intensity
3. 输出保存到 `/root/.openclaw/workspace-g/emotion-experiment/version-a-output.json`

#### Phase 2: 版本B - 镜头语法库集成
1. 从 `feature/shot-grammar-motion-prompt` 分支创建新分支 `experiment/emotion-v2`
2. 改造 `application/services/storyboard_generation_service.go`（或对应的分镜生成逻辑）：
   - 分镜生成后，用 `shotgrammar.GetShotRule()` 校验/增强镜头选择
   - 将 `ShotRule.MotionHint` 注入到 video_prompt 生成中
   - 将 `ShotRule.PacingBeat` 和 `ShotRule.Transition` 写入分镜元数据
3. 对同一测试剧本生成分镜，输出到 `version-b-output.json`

#### Phase 3: 版本C - 情绪编排引擎
1. 创建分支 `experiment/emotion-v3`（基于v2）
2. 新建 `pkg/emotionarc/engine.go`，实现：
   - `AnalyzeEmotionArc(storyboards []Storyboard) []EmotionBeat` - 分析跨镜头情绪弧线
   - `EnrichWithEmotion(storyboard *Storyboard, beat *EmotionBeat)` - 用情绪节拍驱动镜头选择
3. EmotionBeat 结构：
   ```go
   type EmotionBeat struct {
       ShotIndex      int
       Emotion        string
       Intensity      int      // -1 ~ 3
       TensionDelta   int      // 相对上一拍的张力变化
       IsInflection   bool     // 是否情绪拐点
       SuggestedPace  string   // slow/normal/fast/burst
       BGMCueHint     string   // BGM 提示
       TransitionHint string   // 转场提示
   }
   ```
4. 集成到分镜生成流程：先跑情绪分析 → 再用 EmotionProfile 驱动 shotgrammar 选择
5. 对同一测试剧本生成分镜，输出到 `version-c-output.json`

---

## 关键文件路径
- 镜头语法库: `/root/huobao-drama/pkg/shotgrammar/grammar.go`
- 分镜生成提示词: `/root/huobao-drama/application/services/prompt_i18n.go` → `GetStoryboardSystemPrompt()`
- Storyboard 模型: `/root/huobao-drama/domain/models/drama.go` → `type Storyboard struct`
- Toonflow Motion Prompt 参考: `/root/Toonflow-app/src/routes/storyboard/generateVideoPrompt.ts`
- 分镜生成服务: `/root/huobao-drama/application/services/script_generation_service.go`

## 验收标准
- 三版输出格式统一，可直接对比
- 版本B的镜头选择应比A更符合影视语法
- 版本C的情绪弧线应连贯，镜头语言应匹配情绪变化
- 每版输出附带简要自评
