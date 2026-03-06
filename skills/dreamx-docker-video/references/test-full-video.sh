#!/bin/bash
BASE_URL="http://localhost:8081"

# 1. 创建项目
echo "=== 1. 创建项目：热心脉友年底 100 个急招高薪岗 ==="
curl -s -X POST $BASE_URL/api/project \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 600001,
    "projectName": "热心脉友年底 100 个急招高薪岗",
    "width": 1080,
    "height": 1920
  }' | jq '.data.id'
echo ""

# 2. 添加图片 1（封面）
echo "=== 2. 添加图片 1（封面）==="
curl -s -X POST $BASE_URL/api/project/image \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 600001,
    "imageId": 600101,
    "imageUrl": "file:///app/doc/sale/renxinmaiyou/ff67ea75-aa14-48b8-b85a-5bf955392a38.jpg",
    "startTime": 0,
    "duration": 4000,
    "zoomX": 10000,
    "zoomY": 10000,
    "positionX": 0,
    "positionY": 0
  }' | jq '.data.id'
echo ""

# 3. 添加字幕 1
echo "=== 3. 添加字幕 1 ==="
curl -s -X POST $BASE_URL/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 600001,
    "textId": 600201,
    "text": "热心脉友总结了",
    "startTime": 500,
    "duration": 3000,
    "fontSize": 48,
    "fontColor": "#FFFFFF",
    "positionX": 540,
    "positionY": 300
  }' | jq '.data.id'
echo ""

# 4. 添加字幕 2
echo "=== 4. 添加字幕 2 ==="
curl -s -X POST $BASE_URL/api/project/text \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 600001,
    "textId": 600202,
    "text": "年底 100 个急招高薪岗",
    "startTime": 1000,
    "duration": 3000,
    "fontSize": 56,
    "fontColor": "#FFD700",
    "positionX": 540,
    "positionY": 500
  }' | jq '.data.id'
echo ""

# 5. 添加表情包（震惊猫）
echo "=== 5. 添加表情包（震惊猫）==="
curl -s -X POST $BASE_URL/api/project/image \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 600001,
    "imageId": 600102,
    "imageUrl": "file:///app/doc/memes/cat_shocked/Omg_Cat_Scared_Kitty_GIF_oFvXciCA8px11faKJS.gif",
    "startTime": 4000,
    "duration": 2000,
    "zoomX": 8000,
    "zoomY": 8000,
    "positionX": 540,
    "positionY": 960
  }' | jq '.data.id'
echo ""

# 6. 添加 BGM
echo "=== 6. 添加 BGM ==="
curl -s -X POST $BASE_URL/api/project/audio \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 600001,
    "audioId": 600301,
    "audioUrl": "file:///app/doc/bgm/happy/Smile_1076.mp3",
    "startTime": 0,
    "duration": 30000,
    "volume": 50
  }' | jq '.data.id'
echo ""

# 7. 构建视频
echo "=== 7. 构建剪映工程 ==="
curl -s -X POST $BASE_URL/api/project/build \
  -H "Content-Type: application/json" \
  -d '{"projectId": 600001}' | jq '.'
echo ""
