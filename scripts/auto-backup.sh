#!/bin/bash
# Auto backup workspace to git
# Runs every 5 minutes via cron

WORKSPACE="/root/.openclaw/workspace"
cd "$WORKSPACE" || exit 1

# Check if there are any changes
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    exit 0  # Nothing to commit
fi

# Build commit message
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Collect changed files for tags
CHANGED=$(git diff --name-only 2>/dev/null)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null)
STAGED=$(git diff --cached --name-only 2>/dev/null)
ALL_CHANGES=$(echo -e "${CHANGED}\n${UNTRACKED}\n${STAGED}" | grep -v '^$' | sort -u)

# Generate summary and tags
FILE_COUNT=$(echo "$ALL_CHANGES" | wc -l | tr -d ' ')
DIRS=$(echo "$ALL_CHANGES" | xargs -I{} dirname {} | sort -u | tr '\n' ',' | sed 's/,$//')
TAGS=""

echo "$ALL_CHANGES" | grep -q "^memory/" && TAGS="${TAGS} #memory"
echo "$ALL_CHANGES" | grep -q "^skills/" && TAGS="${TAGS} #skills"
echo "$ALL_CHANGES" | grep -q "SOUL.md\|USER.md\|IDENTITY.md\|AGENTS.md" && TAGS="${TAGS} #config"
echo "$ALL_CHANGES" | grep -q "MEMORY.md" && TAGS="${TAGS} #long-term-memory"
echo "$ALL_CHANGES" | grep -q "TOOLS.md" && TAGS="${TAGS} #tools"
echo "$ALL_CHANGES" | grep -q "HEARTBEAT.md" && TAGS="${TAGS} #heartbeat"
echo "$ALL_CHANGES" | grep -q "^scripts/" && TAGS="${TAGS} #scripts"

[ -z "$TAGS" ] && TAGS=" #update"

SUMMARY="${FILE_COUNT}个文件变更 [${DIRS}]"

git add -A
git commit -m "${TIMESTAMP} | ${SUMMARY} |${TAGS}"
git push origin master 2>/dev/null
