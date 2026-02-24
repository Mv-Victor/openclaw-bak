---
name: ui-ux-pro-max
description: >
  UI/UX设计智能助手。当用户提到"UI设计"、"UX设计"、"界面设计"、"落地页"、
  "设计系统"、"配色方案"、"前端UI"、"landing page"时触发。
  支持多平台多框架的专业UI/UX设计指导，含设计系统生成、配色、排版等。
---

# UI UX Pro Max

An AI skill that provides design intelligence for building professional UI/UX across multiple platforms and frameworks.

## When to Activate

Activate when the user asks about:
- UI/UX design, build, create, implement, review, fix, improve
- Landing page design
- Design system generation
- Color palette, typography, style recommendations
- Frontend UI best practices

## Prerequisites

Python 3.x (already installed at python3.12)

## How to Use

### Step 1: Analyze User Requirements

Extract from user request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`

### Step 2: Generate Design System (REQUIRED)

Always start with `--design-system`:

```bash
python3.12 /root/.openclaw/workspace/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

Persist for cross-session use:
```bash
python3.12 /root/.openclaw/workspace/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

### Step 3: Supplement with Detailed Searches

```bash
python3.12 /root/.openclaw/workspace/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

Available domains: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`, `react`, `web`, `prompt`

### Step 4: Stack Guidelines

```bash
python3.12 /root/.openclaw/workspace/skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```

Available stacks: `html-tailwind` (default), `react`, `nextjs`, `vue`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`

## Quick Reference

| Domain | Use For | Example |
|--------|---------|---------|
| `product` | Product type recommendations | SaaS, e-commerce, portfolio |
| `style` | UI styles, effects | glassmorphism, minimalism |
| `typography` | Font pairings | elegant, playful, modern |
| `color` | Color palettes | saas, healthcare, beauty |
| `landing` | Page structure, CTA | hero, testimonial, pricing |
| `chart` | Chart types | trend, comparison, funnel |
| `ux` | Best practices | animation, accessibility |

## Pre-Delivery Checklist

- No emojis as icons (use SVG: Heroicons/Lucide)
- `cursor-pointer` on all clickable elements
- Hover states with smooth transitions (150-300ms)
- Light mode text contrast 4.5:1 minimum
- Focus states visible for keyboard nav
- `prefers-reduced-motion` respected
- Responsive: 375px, 768px, 1024px, 1440px
