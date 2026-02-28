# DreamX Studio 代码评审报告

**评审时间:** 2026-02-28 13:03 (UTC)  
**评审范围:** HEAD~5..HEAD (最近 5 次提交)  
**评审人:** G (总指挥/智库)

---

## 📊 总体评分：8.7/10

| 维度 | 评分 | 说明 |
|------|------|------|
| React Flow 规范 | 9.0/10 | 使用规范，连接验证逻辑清晰 |
| 组件化程度 | 9.5/10 | ui/ 组件复用良好，DetailSection 统一 |
| UI 对齐 Drama.Land | 8.5/10 | 整体风格一致，细节需优化 |
| TypeScript 类型 | 8.0/10 | 类型基本完整，部分断言可优化 |
| 性能优化 | 8.0/10 | 关键组件已 memo，部分可优化 |

---

## ✅ 亮点

### 1. Props 命名统一 (P1 已修复)
- 所有 Detail 组件统一使用 `_nodeData` / `_updateNode` / `onNodeComplete`
- 命名约定一致，符合内部规范
- 参考：`storybible-detail.tsx`, `checkpoint-detail.tsx` 等 7 个组件

### 2. 默认值常量集中管理
- 创建 `src/lib/defaults.ts` 统一管理默认数据
- 避免各组件重复定义 Mock 数据
- 常量命名规范：`DEFAULT_*_DATA`

### 3. React Flow 使用规范
- `isValidConnection` 实现从上到下的顺序连接验证
- `connectionLineStyle` 根据连接状态动态变色（绿/红）
- 视口和节点位置持久化到 localStorage
- 防抖保存 (`VIEWPORT_SAVE_DEBOUNCE_MS = 500`)

### 4. 组件化程度高
- 统一使用 `DetailSection` 包裹各区块
- `Button`, `Badge`, `StatusBadge`, `SegmentedControl` 复用良好
- 样式变量使用 CSS Variables (`var(--drama-*)`)

---

## ⚠️ 问题与改进建议

### P1 - 高优先级

#### 1. CheckPointDetail 类型断言过度使用
**位置:** `src/components/canvas/details/checkpoint-detail.tsx:34-52`

```typescript
// 当前代码
value={(data.language || 'zh-CN') as 'zh-CN' | 'en-US'}
value={(data.rating || 'PG') as 'PG' | 'PG-13' | 'R'}
```

**问题:** 使用 `as` 断言绕过类型检查，运行时可能传入非法值

**建议:**
```typescript
// 方案 A: 使用类型守卫
const getLanguage = (): 'zh-CN' | 'en-US' => {
  const lang = data.language;
  return lang === 'zh-CN' || lang === 'en-US' ? lang : 'zh-CN';
};

// 方案 B: 在 DEFAULT_CHECKPOINT_DATA 中确保类型
const DEFAULT_CHECKPOINT_DATA: CheckPointData = {
  language: 'zh-CN' as const,  // 使用 as const 确保字面量类型
  rating: 'PG' as const,
  // ...
};
```

**修复优先级:** P1  
**预计工作量:** 15 分钟

---

#### 2. SceneDesignDetail / SegmentDesignDetail 未使用 defaults.ts
**位置:** 
- `src/components/canvas/details/scenedesign-detail.tsx:14-18`
- `src/components/canvas/details/segmentdesign-detail.tsx:14-18`

**问题:** 组件内部定义 `DEFAULT_*_DATA`，与 `src/lib/defaults.ts` 重复

**建议:**
```typescript
// 移除组件内的 DEFAULT_*_DATA
// 改为从 defaults.ts 导入
import { DEFAULT_SCENE_DESIGN_DATA, DEFAULT_SEGMENT_DESIGN_DATA } from '@/lib/defaults';
```

**修复优先级:** P1  
**预计工作量:** 10 分钟

---

#### 3. StoryBibleDetail 硬编码 Mock 数据
**位置:** `src/components/canvas/details/storybible-detail.tsx:14-33`

**问题:** `STORY_BIBLE_MOCK_DATA` 硬编码在组件内，无法复用

**建议:**
```typescript
// 移动到 src/lib/defaults.ts 或 src/mock/story-bible-mock.ts
export const STORY_BIBLE_OPTIONS = [
  { id: 1, title: '命运交织', genre: '奇幻 / 爱情', ... },
  // ...
];

// 组件内导入使用
import { STORY_BIBLE_OPTIONS } from '@/lib/defaults';
```

**修复优先级:** P2  
**预计工作量:** 15 分钟

---

### P2 - 中优先级

#### 4. CharacterPackDetail 依赖 useProjectStore 但未处理空状态
**位置:** `src/components/canvas/details/characterpack-detail.tsx:24-32`

**问题:** 
- `useEffect` 中检查 `voices.length === 0` 才加载
- 但如果 `loadVoices()` 失败，无错误处理
- `characters` 为空时只显示"暂无角色数据"，无重试机制

**建议:**
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (voices.length === 0 && !loading) {
    setLoading(true);
    loadVoices().catch((err) => {
      setError(err.message || '加载失败');
    }).finally(() => {
      setLoading(false);
    });
  }
}, [voices.length, loadVoices, loading]);
```

**修复优先级:** P2  
**预计工作量:** 20 分钟

---

#### 5. PlanningCenterDetail 硬编码 mockEpisodes
**位置:** `src/components/canvas/details/planningcenter-detail.tsx:28-35`

**问题:** Mock 数据硬编码在组件内

**建议:** 移动到 `src/mock/planning-center-mock.ts` 或 `src/lib/defaults.ts`

**修复优先级:** P2  
**预计工作量:** 10 分钟

---

#### 6. ScriptDetail 假设 episodes[0] 存在
**位置:** `src/components/canvas/details/script-detail.tsx:24`

**问题:** 
```typescript
const episode = episodes[0];  // 可能 undefined
if (!episode) { /* 处理空状态 */ }
```
虽然有检查，但类型系统不知道 `episode` 在检查后非空

**建议:**
```typescript
const episode = episodes[0];
if (!episode) {
  return <EmptyState />;
}
// 此时 episode 类型仍包含 undefined，需要断言或重构
```

**更优方案:**
```typescript
const episode = episodes.at(0);  // 返回 T | undefined
if (!episode) {
  return <EmptyState />;
}
// TypeScript 仍然不知道 episode 非空，需要:
const safeEpisode = episode!;  // 或使用类型守卫
```

**修复优先级:** P2  
**预计工作量:** 10 分钟

---

### P3 - 低优先级

#### 7. canvas/page.tsx 初始加载逻辑复杂
**位置:** `src/app/projects/[projectId]/canvas/page.tsx:88-120`

**问题:** 
- `initialLoadRef` 控制首次加载
- 但 `useEffect` 依赖 `[projectId]`，切换项目时可能行为不一致
- localStorage 恢复逻辑与 `initialNodes` 合并逻辑有潜在竞态

**建议:** 简化为单一数据源，优先使用 localStorage，无缓存时使用 `initialNodes`

**修复优先级:** P3  
**预计工作量:** 45 分钟

---

#### 8. 性能优化：未使用的 React.memo
**位置:** 多个 Detail 组件

**现状:**
- ✅ `CheckPointDetail` - 已使用 `React.memo`
- ✅ `CharacterPackDetail` - 已使用 `React.memo`
- ❌ `StoryBibleDetail` - 未使用
- ❌ `PlanningCenterDetail` - 未使用
- ❌ `ScriptDetail` - 未使用
- ❌ `SceneDesignDetail` - 未使用
- ❌ `SegmentDesignDetail` - 未使用
- ❌ `ComposeDetail` - 未使用

**建议:** 为所有 Detail 组件添加 `React.memo`，避免父组件重渲染时不必要的子组件渲染

**修复优先级:** P3  
**预计工作量:** 20 分钟

---

#### 9. CSS 变量命名不一致
**位置:** 多个组件

**问题:**
```typescript
// checkpoint-detail.tsx
style={{ background: 'var(--bg-white-10)' }}

// storybible-detail.tsx
style={{ background: 'var(--drama-bg-white-5)' }}
style={{ border: 'var(--drama-border)' }}

// scenedesign-detail.tsx
className="border border-white/10 bg-white/5"
```

**建议:** 统一使用 `--drama-*` 前缀，或在 `tailwind.config.ts` 中定义 theme 扩展

**修复优先级:** P3  
**预计工作量:** 30 分钟

---

## 🎨 UI 对齐 Drama.Land 检查

基于 https://drama.land/ 的视觉风格对比：

### ✅ 已对齐
- 主色调：红色系 (`#C0031C`, `#FF4D4D`)
- 深色背景：`bg-black`, `bg-white/5`
- 边框样式：`border-white/10`
- 字体层级：`text-xs`, `text-[10px]`
- 圆角：`rounded-lg`, `rounded-md`

### ⚠️ 需优化
1. **SegmentedControl 选中态** - 建议使用 Drama.Land 的红色高亮而非默认样式
2. **Slider 轨道样式** - 当前使用 `background: 'var(--bg-white-10)'`，建议统一为 `--drama-slider-track`
3. **Badge 变体** - `variant="default"` 应使用 Drama.Land 红色，检查是否一致

---

## 📋 行动清单

### 啾啾待办

| 优先级 | 任务 | 预计时间 |
|--------|------|----------|
| P1 | 修复 CheckPointDetail 类型断言 | 15 min |
| P1 | 统一 SceneDesign/SegmentDesign 使用 defaults.ts | 10 min |
| P2 | CharacterPackDetail 添加错误处理 | 20 min |
| P2 | ScriptDetail 优化类型安全 | 10 min |
| P2 | 移动 Mock 数据到独立文件 | 25 min |
| P3 | 为剩余 Detail 组件添加 React.memo | 20 min |
| P3 | 统一 CSS 变量命名 | 30 min |

**总预计工作量:** ~2 小时

---

## 📝 评审结论

**当前状态:** 可上线，但建议修复 P1 问题后再发布

**整体质量:** 良好。最近 P1 修复（Props 统一、默认值常量）显著提升了代码一致性。主要剩余问题是类型安全和代码组织，不影响功能但影响长期可维护性。

**下一步:**
1. 优先修复 P1 类型断言问题（15 分钟）
2. 统一 Mock 数据管理（25 分钟）
3. 可选：P2/P3 问题放入下个迭代

---

*评审完成时间：2026-02-28 13:03 (UTC)*  
*下次评审建议：修复 P1 问题后重新评审*
