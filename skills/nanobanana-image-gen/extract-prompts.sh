#!/bin/bash
# 从 awesome-nano-banana-pro-prompts 仓库提取 prompts 并整合到本地

REPO_PATH="/tmp/awesome-nano-banana-pro-prompts"
OUTPUT_DIR="/root/.openclaw/workspace-g/skills/nanobanana-image-gen"

echo "开始提取 Nano Banana Pro prompts..."

# 确保仓库是最新的
cd "$REPO_PATH" && git pull

# 复制中文 README 作为完整参考
cp "$REPO_PATH/README_zh.md" "$OUTPUT_DIR/awesome-prompts-full.md"

echo "✅ 已复制完整 prompts 库到 awesome-prompts-full.md"
echo "📊 统计信息："
echo "  - 总 prompts 数: $(grep -c "^### No\." "$OUTPUT_DIR/awesome-prompts-full.md")"
echo "  - 精选 prompts: $(grep -c "Featured" "$OUTPUT_DIR/awesome-prompts-full.md")"

# 提取分类信息
echo ""
echo "📋 主要分类："
grep -A 1 "^  - \[" "$REPO_PATH/README_zh.md" | head -30

echo ""
echo "✅ 提取完成！"
echo "📁 输出位置: $OUTPUT_DIR/"
echo "📄 文件列表:"
ls -lh "$OUTPUT_DIR/"*.md
