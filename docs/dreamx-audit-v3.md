# DreamX Studio 第三轮审核报告 - 组件化重构

**审核时间**: 2026-02-28 01:20
**审核人**: G
**问题来源**: 栋少反馈"代码里一坨都是直接 html 返回的，没有使用组件库"

---

## 问题分析

### 1. 重复 Section 组件（8 个文件重复定义）

**现状** - 每个 detail 文件都定义了相同的 Section 组件：
```tsx
const Section = ({ icon: Icon, label, children }: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  children: React.ReactNode 
}) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-2.5">
      <Icon className="h-4 w-4 text-white/40" />
      <span className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</span>
    </div>
    {children}
  </div>
);
```

**问题**：
- ❌ 8 个文件重复定义相同代码
- ❌ 没有抽取到 `src/components/ui/`
- ❌ 代码复用率 0%

**解决方案**：
```tsx
// src/components/ui/detail-section.tsx
'use client';

import { ReactNode } from 'react';

interface DetailSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
  className?: string;
}

export function DetailSection({ icon: Icon, label, children, className }: DetailSectionProps) {
  return (
    <div className={cn('mb-5', className)}>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="h-4 w-4 text-white/40" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</span>
      </div>
      {children}
    </div>
  );
}
```

---

### 2. 按钮没有使用 Button 组件

**现状** - 全是手写 button + inline style：
```tsx
<button
  className="flex-1 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
  style={{ background: 'rgba(192,3,28,0.20)', color: '#FF4D4D' }}
>
  <Sparkles className="h-3.5 w-3.5" />
  确认并继续
</button>
```

**问题**：
- ❌ `src/components/ui/button.tsx` 已存在但使用率 < 10%
- ❌ 大量重复的 className 和 style
- ❌ 没有利用 variant/size props
- ❌ 样式不统一（有些用 style，有些用 className）

**解决方案**：
```tsx
// 应该这样写
<Button variant="default" size="sm" className="w-full">
  <Sparkles className="h-3.5 w-3.5" />
  确认并继续
</Button>

// 或者 outline 按钮
<Button variant="outline" size="sm" className="w-full">
  <RefreshCw className="h-3.5 w-3.5" />
  重新生成
</Button>
```

**需要改造的文件**：
- `checkpoint-detail.tsx` - 1 个按钮
- `characterpack-detail.tsx` - 3 个按钮
- `script-detail.tsx` - 2 个按钮
- `storybible-detail.tsx` - 2 个按钮
- `planningcenter-detail.tsx` - 3 个按钮
- `scenedesign-detail.tsx` - 2 个按钮
- `segmentdesign-detail.tsx` - 2 个按钮
- `compose-detail.tsx` - 2 个按钮

---

### 3. Badge 组件未使用

**现状** - 大量手写 badge：
```tsx
<span className="text-[10px] px-1.5 py-0.5 rounded" style={{ 
  background: 'rgba(192,3,28,0.20)', 
  color: '#FF4D4D' 
}}>
  主角
</span>
```

**问题**：
- ❌ `src/components/ui/badge.tsx` 已存在但使用率 < 5%
- ❌ 手写 badge 样式不统一

**解决方案**：
```tsx
// 应该这样写
<Badge variant="default">主角</Badge>
<Badge variant="secondary">配角</Badge>
<Badge variant="outline">场景 01</Badge>
```

---

### 4. 卡片组件未使用

**现状** - 手写卡片：
```tsx
<div className="rounded-lg border border-white/10 bg-white/5 p-3">
  ...
</div>
```

**问题**：
- ❌ `src/components/ui/card.tsx` 已存在但未使用
- ❌ 重复的 className

**解决方案**：
```tsx
<Card className="p-3">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
```

---

### 5. Input/Textarea 组件未使用

**现状** - 手写 input：
```tsx
<input
  type="range"
  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
  style={{ background: 'rgba(255,255,255,0.10)' }}
/>
```

**问题**：
- ❌ `src/components/ui/input.tsx` 和 `textarea.tsx` 已存在
- ❌ 没有统一样式

---

## 改造清单

### P1 - 抽取通用组件
- [ ] 创建 `src/components/ui/detail-section.tsx`
- [ ] 创建 `src/components/ui/detail-card.tsx`（可选）
- [ ] 创建 `src/components/ui/status-badge.tsx`（状态 badge）

### P1 - 重构详情面板
- [ ] `checkpoint-detail.tsx` - 使用 DetailSection + Button + Badge
- [ ] `characterpack-detail.tsx` - 使用 DetailSection + Button + Badge + Card
- [ ] `script-detail.tsx` - 使用 DetailSection + Button + Badge
- [ ] `storybible-detail.tsx` - 使用 DetailSection + Button + Card
- [ ] `planningcenter-detail.tsx` - 使用 DetailSection + Button + Card + Tabs
- [ ] `scenedesign-detail.tsx` - 使用 DetailSection + Button + Badge
- [ ] `segmentdesign-detail.tsx` - 使用 DetailSection + Button + Badge
- [ ] `compose-detail.tsx` - 使用 DetailSection + Button + Card

### P2 - 其他页面
- [ ] `page.tsx`（首页） - 使用 Button + Badge
- [ ] `projects/page.tsx` - 使用 Button + Badge + Card
- [ ] `showcases/page.tsx` - 使用 Button + Badge + Card

---

## 验收标准

1. **代码复用率**：
   - Section 组件：100% 使用 `ui/detail-section.tsx`
   - Button 组件：使用率 > 80%
   - Badge 组件：使用率 > 80%
   - Card 组件：使用率 > 50%

2. **代码行数减少**：
   - 每个 detail 文件减少 20-30 行重复代码
   - 总代码量减少 150-200 行

3. **样式统一性**：
   - 所有按钮样式一致
   - 所有 badge 样式一致
   - 所有卡片样式一致

4. **Build 质量**：
   - 零错误
   - 零警告

---

## 预期收益

- **可维护性**：修改一处样式，全局生效
- **一致性**：避免手写 style 导致的视觉差异
- **开发效率**：组件复用，减少重复代码
- **代码审查**：更容易发现样式问题

---

## 下一步

1. 啾啾优先完成 **P1 通用组件抽取**
2. 然后重构 **8 个详情面板**
3. G 验收代码质量和组件使用率
4. 循环迭代直到达标
