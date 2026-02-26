#!/bin/bash
# Memory cold archive script
# Moves daily memory files older than 7 days to archive/
# Runs for both G and 啾啾 workspaces

archive_workspace() {
    local WORKSPACE="$1"
    local MEMORY_DIR="$WORKSPACE/memory"
    local ARCHIVE_DIR="$WORKSPACE/archive"
    
    mkdir -p "$ARCHIVE_DIR"
    
    # Get date 7 days ago
    CUTOFF=$(date -d '7 days ago' '+%Y-%m-%d')
    
    for f in "$MEMORY_DIR"/????-??-??.md; do
        [ -f "$f" ] || continue
        FILENAME=$(basename "$f" .md)
        
        # Compare date strings (lexicographic works for YYYY-MM-DD)
        if [[ "$FILENAME" < "$CUTOFF" ]]; then
            mv "$f" "$ARCHIVE_DIR/"
            echo "Archived: $f → $ARCHIVE_DIR/$FILENAME.md"
        fi
    done
}

echo "=== Memory Archive $(TZ='Asia/Shanghai' date '+%Y-%m-%d %H:%M CST') ==="

# Archive G workspace
echo "--- G workspace ---"
archive_workspace "/root/.openclaw/workspace-g"

# Archive 啾啾 workspace
echo "--- 啾啾 workspace ---"
archive_workspace "/root/.openclaw/workspace"

echo "=== Done ==="
