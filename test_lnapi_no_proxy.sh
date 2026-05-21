#!/bin/bash

# 读取 API key
if [ -f ~/.openclaw/workspace/skills/lnapi-image-gen/config.json ]; then
  API_KEY=$(jq -r '.apiKey' ~/.openclaw/workspace/skills/lnapi-image-gen/config.json)
else
  echo "❌ Config not found"
  exit 1
fi

echo "=== 测试 LN API (禁用代理) ==="
echo "API Key: ${API_KEY:0:10}..."
echo ""

# 禁用代理
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY

# 测试文生图
curl --connect-timeout 10 --max-time 180 \
  -X POST "https://api.lnapi.com/v1/images/generations" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image-preview-2k",
    "prompt": "一只可爱的橘猫，坐在阳光下，温暖的色调",
    "n": 1,
    "size": "1024x1536"
  }'
