#!/bin/bash

# 读取 API key
if [ -f ~/.openclaw/workspace/skills/lnapi-image-gen/config.json ]; then
  API_KEY=$(jq -r '.apiKey' ~/.openclaw/workspace/skills/lnapi-image-gen/config.json)
elif [ -n "$LNAPI_API_KEY" ]; then
  API_KEY="$LNAPI_API_KEY"
else
  echo "❌ LNAPI_API_KEY not found"
  exit 1
fi

echo "Testing LN API with key: ${API_KEY:0:10}..."

# 测试生成图片
curl -v -X POST "https://api.lnapi.com/v1/images/generations" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image-preview-2k",
    "prompt": "一只可爱的猫",
    "n": 1,
    "size": "1024x1024"
  }' 2>&1
