#!/bin/bash
# G workspace auto-backup script
# Runs every 5 minutes via cron

WORKSPACE="/root/.openclaw/workspace-g"
cd "$WORKSPACE" || exit 1

# Check if there are any changes
if git diff --quiet HEAD 2>/dev/null && git diff --cached --quiet HEAD 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    # No changes, skip
    exit 0
fi

# Stage all changes
git add -A

# Analyze changes for commit message
TIMESTAMP=$(TZ='Asia/Shanghai' date '+%Y-%m-%d %H:%M:%S CST')
DATE_TAG=$(TZ='Asia/Shanghai' date '+%Y%m%d_%H%M')

# Collect change summary
ADDED=$(git diff --cached --name-only --diff-filter=A | head -10)
MODIFIED=$(git diff --cached --name-only --diff-filter=M | head -10)
DELETED=$(git diff --cached --name-only --diff-filter=D | head -10)

# Build tags
TAGS=""
if echo "$ADDED $MODIFIED" | grep -q "memory/"; then TAGS="$TAGS [memory]"; fi
if echo "$ADDED $MODIFIED" | grep -q "skills/"; then TAGS="$TAGS [skills]"; fi
if echo "$ADDED $MODIFIED" | grep -q "SOUL.md\|USER.md\|AGENTS.md\|IDENTITY.md"; then TAGS="$TAGS [config]"; fi
if echo "$ADDED $MODIFIED" | grep -q "MEMORY.md"; then TAGS="$TAGS [long-term-memory]"; fi
if echo "$ADDED $MODIFIED" | grep -q "TOOLS.md"; then TAGS="$TAGS [tools]"; fi
if echo "$ADDED $MODIFIED" | grep -q "scripts/"; then TAGS="$TAGS [scripts]"; fi
if [ -z "$TAGS" ]; then TAGS=" [misc]"; fi

# Build summary title
SUMMARY=""
if [ -n "$ADDED" ]; then
    ADD_COUNT=$(echo "$ADDED" | wc -l | tr -d ' ')
    FIRST_ADD=$(echo "$ADDED" | head -1 | xargs basename 2>/dev/null)
    SUMMARY="新增${ADD_COUNT}个文件(${FIRST_ADD}等)"
fi
if [ -n "$MODIFIED" ]; then
    MOD_COUNT=$(echo "$MODIFIED" | wc -l | tr -d ' ')
    FIRST_MOD=$(echo "$MODIFIED" | head -1 | xargs basename 2>/dev/null)
    if [ -n "$SUMMARY" ]; then SUMMARY="$SUMMARY, "; fi
    SUMMARY="${SUMMARY}修改${MOD_COUNT}个文件(${FIRST_MOD}等)"
fi
if [ -n "$DELETED" ]; then
    DEL_COUNT=$(echo "$DELETED" | wc -l | tr -d ' ')
    if [ -n "$SUMMARY" ]; then SUMMARY="$SUMMARY, "; fi
    SUMMARY="${SUMMARY}删除${DEL_COUNT}个文件"
fi

# Commit
COMMIT_MSG="[$DATE_TAG]${TAGS} $SUMMARY

时间: $TIMESTAMP
---
$(git diff --cached --stat | tail -5)"

git commit -m "$COMMIT_MSG"

# Push to remote G branch
git push origin G 2>&1 || echo "Push failed, will retry next cycle"
