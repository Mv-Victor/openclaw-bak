# 小红书爆款文案生成 Skill

## 目录结构

```
xiaohongshu-copywriting/
├── SKILL.md              # Skill 主文档
├── generate.py           # 文案生成脚本
├── examples/             # 示例文案
│   ├── job-hunting.md    # 求职方向示例
│   ├── ai-side-hustle.md # AI副业方向示例
│   └── ai-video-editing.md # AI剪辑方向示例
└── templates/            # 模板库
    ├── titles.json       # 标题模板
    ├── emotions.json     # 情绪词库
    └── tags.json         # 标签库
```

## 快速开始

### 1. 生成文案

```bash
cd /root/.openclaw/workspace-g/skills/xiaohongshu-copywriting
python3 generate.py
```

### 2. 查看示例

```bash
cat examples/ai-side-hustle.md
```

### 3. 每日更新

每天早上8:30自动采集100篇爆款笔记后，会自动更新：
- 标题模板库
- 情绪词库
- 案例库

## 核心能力

1. **标题生成**：7种爆款公式，15字以内
2. **正文创作**：4步框架，400-600字
3. **配图建议**：6-9张，类型推荐
4. **标签推荐**：5-8个，含必带标签

## 三大受众方向

- **求职/大厂**：焦虑情绪 + 数字冲击
- **AI副业**：利益驱动 + 可复制性（含OpenClaw）
- **AI剪辑**：效率提升 + 变现路径

## 数据来源

- 每日采集：100篇笔记（评论>100）
- 当前样本：19篇（含评论2180超级案例）
- 更新频率：每日8:30自动更新

## 版本

- **当前版本**：v1.0.0
- **最后更新**：2026-03-02
- **下次更新**：2026-03-03（采集100篇后）
