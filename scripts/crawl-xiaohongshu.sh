#!/bin/bash
# 小红书爆款笔记采集脚本
# 每日爬取100篇高质量笔记，去重存储

WORKSPACE="/root/.openclaw/workspace-g"
DATA_DIR="$WORKSPACE/xiaohongshu-data"
TODAY=$(date +%Y-%m-%d)
OUTPUT_FILE="$DATA_DIR/$TODAY.jsonl"
CRAWLED_IDS="$DATA_DIR/crawled_ids.txt"

mkdir -p "$DATA_DIR"
touch "$CRAWLED_IDS"

# 搜索关键词列表
KEYWORDS=(
  "计算机求职 大厂"
  "秋招 offer"
  "春招 面试"
  "AI副业 赚钱"
  "ChatGPT 变现"
  "AI工具 搞钱"
  "AI剪辑 教程"
  "短视频制作"
  "剪映 技巧"
)

echo "开始采集 $TODAY 的小红书爆款笔记..."

for keyword in "${KEYWORDS[@]}"; do
  echo "搜索关键词: $keyword"
  
  # 调用小红书搜索API
  result=$(mcporter call "xiaohongshu.search_feeds(keyword: \"$keyword\")" 2>&1)
  
  # 提取评论>100的笔记
  echo "$result" | jq -c '.feeds[] | select(.noteCard.interactInfo.commentCount != "" and (.noteCard.interactInfo.commentCount | tonumber? // (.noteCard.interactInfo.commentCount | gsub("[^0-9]"; "") | tonumber) > 100))' 2>/dev/null | while read -r note; do
    note_id=$(echo "$note" | jq -r '.id')
    
    # 去重检查
    if grep -q "^$note_id$" "$CRAWLED_IDS"; then
      echo "  跳过重复笔记: $note_id"
      continue
    fi
    
    # 获取详细内容
    xsec_token=$(echo "$note" | jq -r '.xsecToken')
    detail=$(mcporter call "xiaohongshu.get_feed_detail(feed_id: \"$note_id\", xsec_token: \"$xsec_token\")" 2>&1)
    
    # 保存到JSONL
    echo "$detail" >> "$OUTPUT_FILE"
    echo "$note_id" >> "$CRAWLED_IDS"
    
    echo "  ✓ 采集笔记: $note_id"
    
    # 限流
    sleep 2
  done
done

# 统计
total=$(wc -l < "$OUTPUT_FILE" 2>/dev/null || echo 0)
echo "采集完成，今日新增 $total 篇笔记"
echo "数据保存至: $OUTPUT_FILE"
