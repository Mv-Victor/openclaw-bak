# DreamX Studio — 设计文档汇总

> 版本：v1.0 | 日期：2026-02-26 | 作者：啾啾

---

## 文档列表

| 文档 | 说明 | 状态 |
|------|------|------|
| [01-page-interaction-design.md](./01-page-interaction-design.md) | 页面交互设计 | ✅ 完成 |
| [02-api-design.md](./02-api-design.md) | API 接口设计 | ✅ 完成 |
| [03-data-model-design.md](./03-data-model-design.md) | 数据模型设计 | ✅ 完成 |
| [04-workflow-design.md](./04-workflow-design.md) | 创作工作流设计 | 🚧 待完成 |
| [05-tech-architecture.md](./05-tech-architecture.md) | 技术架构设计 | 🚧 待完成 |

---

## 核心设计要点

### 五种创作模式

| 模式 | 说明 | 优先级 |
|------|------|--------|
| 📕 小红书图文转视频 | 图文笔记→爆款文案→营销视频（DreamX 独有） | P0 |
| 📹 单集视频 | 单集短视频创作，适合抖音/快手 | P1 |
| 🎬 连续剧集 | 多集连续剧，DAG 工作流 | P2 |
| 📝 剧本模式 | 导入已有剧本，跳过 AI 编剧 | P3 |
| 🎵 音乐 MV | 音乐驱动的视觉创作 | P3 |

### 技术栈

**前端：**
- Next.js 14 App Router
- React Flow（画布式创作）
- Zustand + Immer（状态管理）
- Tailwind CSS + Radix UI
- next-intl（国际化）

**后端：**
- FastAPI（Python，async 原生）
- PostgreSQL（主库）
- Redis（缓存 + 任务队列）
- Celery（批量生成任务）
- COS/S3（对象存储）

**AI 能力：**
- 剧本解析引擎（LLM 驱动）
- 角色一致性系统（6 层身份锚点）
- 视觉风格库（107 种预置）
- 配音库（151 个角色音色）
- 视频生成（Kling/Seedance/可灵多模型）

### 核心差异化

1. **五模式全覆盖** — Drama.Land 四种 + 小红书图文转视频（主打）
2. **画布式 + 时间线双视图** — 创作阶段用画布，制作阶段用时间线
3. **角色一致性系统** — 学 Moyin 的 6 层身份锚点
4. **Java 服务 API 桥接** — DreamX 剪映工程生成等已有能力不重写，通过 HTTP API 调用
5. **FaaS 部署** — 快速迭代，Serverless 弹性伸缩，成本可控

---

## 与 G 设计文档的对齐

G 的 workspace-g 已有设计文档：
- `/root/.openclaw/workspace-g/dreamx/README.md`
- `/root/.openclaw/workspace-g/dreamx/api-design.md`
- `/root/.openclaw/workspace-g/dreamx/data-model.md`
- `/root/.openclaw/workspace-g/dreamx/pages-design.md`
- `/root/.openclaw/workspace-g/dreamx/workflow-design.md`

本套文档与 G 的设计保持一致，补充了：
- 更详细的页面交互细节（聊天面板、属性面板、时间线视图）
- 小红书专属 API 接口设计
- 完整的数据模型 Schema（PostgreSQL）
- 性能优化策略（索引、分区、缓存）

---

## 下一步

1. **评审设计文档** — G 评审后确认
2. **补充工作流设计** — 04-workflow-design.md
3. **补充技术架构** — 05-tech-architecture.md
4. **MVP 开发** — P0 小红书模式优先（3.5 周）

---

## 文件位置

```
/root/.openclaw/workspace/docs/dreamx-studio/
├── README.md                      # 本文档
├── 01-page-interaction-design.md  # 页面交互设计
├── 02-api-design.md               # API 接口设计
├── 03-data-model-design.md        # 数据模型设计
├── 04-workflow-design.md          # 创作工作流设计（待完成）
└── 05-tech-architecture.md        # 技术架构设计（待完成）
```
