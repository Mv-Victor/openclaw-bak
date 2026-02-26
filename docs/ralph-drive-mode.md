# Ralph 驱动模式设计文档

## 问题根因

### 空转问题
1. `systemEvent` 类型 cron 只是"提醒"，不是"驱动"——agent 收到提醒后没有活跃上下文就直接 ack
2. `agentTurn` + `isolated` 方向对了，但遇到阻塞时不会跳过，卡在同一个 story 空转
3. 阻塞检查重复 12 次（3+ 小时），没有任何实质推进

### Ralph 模式的核心差异
- 状态持久化在文件（prd.json + progress.txt），不依赖 session 上下文
- 每次迭代从文件读状态，自主决定下一步
- 有明确的停止条件和阻塞跳过机制

## 修复方案

### 1. Cron 类型：统一用 `agentTurn` + `isolated`
- 每次触发都是全新 session，从文件读状态
- 不依赖 session 上下文，Gateway 重启不影响

### 2. 阻塞跳过机制
- 遇到阻塞的 story，标记 `blocked: true` + `blockedReason`
- 跳过阻塞的 story，尝试推进后续不依赖它的 story
- 如果所有未完成 story 都被阻塞，汇报一次后停止（不重复汇报）

### 3. 防空转规则
- 每次迭代必须有实质推进或明确的新阻塞
- 如果连续 N 次无进展，自动 disable cron 并汇报
- progress.txt 中记录每次迭代的实际产出

### 4. Timeout 调整
- 复杂任务 timeout 从 300s 提升到 600s
- 简单检查类任务保持 300s

## 标准 prd.json 字段扩展

```json
{
  "passes": false,
  "blocked": false,
  "blockedReason": "",
  "blockedSince": "",
  "dependsOn": ["BG-001"]
}
```

## 标准 agentTurn prompt 模板

```
你是 Ralph 自主执行循环。每次被唤醒时：

1. 读取 <project_dir>/prd.json 获取任务列表
2. 读取 <project_dir>/progress.txt 获取历史进度和 Codebase Patterns
3. 找到最高优先级的 passes=false 且 blocked=false 的 story
4. 如果该 story 的依赖（dependsOn）未完成，标记为 blocked 并跳过
5. 执行该 story
6. 完成后更新 prd.json（passes=true）
7. 追加进度到 progress.txt
8. 在飞书群中汇报进度

阻塞处理：
- 遇到无法自行解决的问题，标记 blocked=true + blockedReason
- 跳过阻塞 story，尝试下一个不被阻塞的 story
- 如果所有 story 都 blocked 或 passes=true，回复 BLOCKED_ALL 或 COMPLETE
- 不要重复汇报已知的阻塞（检查 progress.txt 最后一条记录）

防空转：
- 每次必须有实质性推进或发现新阻塞
- 如果与上次迭代相比无任何变化，回复 NO_PROGRESS
```
