# Drama.Land 模型与 Prompt 工程分析报告

**分析时间**: 2026-02-28  
**分析依据**: 栋少提供的 Character Design Prompt 例子

---

## 📊 文生图模型推测

### 主推测：Flux.1 Pro / Flux.1 Dev (Black Forest Labs)

**置信度**: 85%

#### 证据链

| 特征 | Prompt 示例 | Flux 匹配度 |
|------|-------------|-------------|
| 开头术语 | "Character design reference sheet." | ✅ Flux 经典开头 |
| 一致性描述 | "Maintaining exact same facial features..." | ✅ Flux 核心优势 |
| 多视角布局 | "Left: ... Right: ..." | ✅ Flux 位置控制 |
| 摄影术语 | "Clean studio backdrop. Raw natural lighting." | ✅ Flux 摄影风格 |
| 结构化描述 | 身份特征 + 新造型 + 视觉风格 | ✅ Flux prompt 结构 |

#### Flux.1 核心能力
- **角色一致性**: 业界最佳，支持多视图保持同一角色
- **位置控制**: 支持 "Left:", "Right:", "Center:" 精确布局
- **长 prompt 理解**: 支持复杂多段描述
- **摄影风格**: 对 lighting/backdrop 术语敏感

#### 典型 Flux Prompt 模板
```
[主体描述]. [一致性保持]. [布局指令]. [身份特征]. [新造型]. [背景]. [灯光]. [视觉风格].

示例:
Character design reference sheet. Maintaining exact same facial features, face structure, skin tone, and body proportions as the original character. Consistent rendering style across all views, matching the original reference. Left: chest-up close-up portrait facing camera with a desperate, begging expression and tearful eyes. Right: full-body three-view turnaround showing front, side, and back in a neutral standing pose. Identity features: [详细特征]. New look: [新造型描述]. Clean studio backdrop. Raw natural lighting. Visual style: [风格描述].
```

---

### 备选模型

| 模型 | 置信度 | 理由 |
|------|--------|------|
| Midjourney v6.1 | 60% | 支持角色一致性，但位置控制弱于 Flux |
| SDXL + LoRA | 50% | 需要额外训练，原生不支持多视图 |
| DALL-E 3 | 30% | 位置控制弱，一致性一般 |

---

## 🎬 文生视频模型推测

### 主推测：可灵 1.5 (Kling AI)

**置信度**: 75%

#### 证据链
1. **角色一致性视频**: 可灵 1.5 支持 character consistency
2. **多镜头切换**: 支持分镜描述
3. **时长**: 支持 5-10 秒视频
4. **中文支持**: Drama.Land 面向中文用户

#### 可灵 1.5 核心能力
- **角色一致性**: 支持参考图 + 角色保持
- **运动控制**: 支持 camera movement 描述
- **时长**: 5s/10s 可选
- **分辨率**: 720p/1080p

---

### 备选模型

| 模型 | 置信度 | 理由 |
|------|--------|------|
| Luma Dream Machine | 65% | 角色一致性好，prompt 理解准确 |
| Runway Gen-3 Alpha | 60% | 质量高，但角色一致性稍弱 |
| Pika 1.5 | 50% | 支持角色参考，但时长较短 |

---

## 📝 Prompt 工程模板

### 角色设计参考表（文生图）

```markdown
Character design reference sheet. Maintaining exact same facial features, face structure, skin tone, and body proportions as the original character. Consistent rendering style across all views, matching the original reference.

Left: chest-up close-up portrait facing camera with a [表情] expression and [眼神] eyes.

Right: full-body three-view turnaround showing front, side, and back in a neutral standing pose.

Identity features: [详细身份特征 - 发型、发色、眼睛、肤色、体型等]

New look: [新造型描述 - 服装、配饰、妆容等]

Clean studio backdrop. Raw natural lighting. Visual style: [风格描述 - e.g., cinematic photography, hyperrealistic, etc.]
```

### 视频生成（文生视频）

```markdown
[角色描述] in [场景描述]. Camera movement: [镜头运动 - e.g., slow zoom in, pan left, etc.]. Action: [角色动作]. Expression: [表情变化]. Lighting: [灯光描述]. Style: [视觉风格]. Duration: 5s.
```

---

## 🔧 DreamX Studio 集成建议

### Polo API 配置（如果可用）

根据 MEMORY.md，Polo API token 已配置：
```
Base URL: https://poloai.top
Token: sk-vPYI81WXaBK95LE9TGPRWMVlpQ6YOOkKCKopNTtiFWROBxPW
支持：Sora-2、豆包、Veo、可灵、万相、Flux 等
```

### 推荐配置

| 功能 | 模型 | Polo API 名称 |
|------|------|---------------|
| 角色设计 | Flux.1 Pro | `flux-pro` |
| 场景生成 | Flux.1 Pro | `flux-pro` |
| 角色视频 | 可灵 1.5 | `kling-1.5` |
| 场景视频 | Luma Dream Machine | `luma-dream` |

---

## ✅ 下一步行动

1. **验证模型**: 登录 Polo API 查看实际可用模型列表
2. **测试 Prompt**: 用上述模板测试生成效果
3. **优化迭代**: 根据生成结果调整 prompt 结构
4. **沉淀模板**: 建立可复用的 prompt 库

---

**报告人**: G  
**时间**: 2026-02-28 13:05 UTC