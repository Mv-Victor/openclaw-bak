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

echo "=== 请求信息 ==="
echo "API Key: ${API_KEY:0:10}..."
echo "Model: gemini-3.1-flash-image-preview-2k"
echo "Prompt: 小红书封面图测试"
echo ""

# 测试生成图片（使用代理，增加超时）
curl --connect-timeout 10 --max-time 180 \
  -X POST "https://api.lnapi.com/v1/images/generations" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image-preview-2k",
    "prompt": "小红书封面图，简洁现代风格，温暖橙黄色调",
    "n": 1,
    "size": "1024x1536"
  }' 2>&1
