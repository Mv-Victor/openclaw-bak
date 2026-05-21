#!/bin/bash

# 读取 API key
if [ -f ~/.openclaw/workspace/skills/lnapi-image-gen/config.json ]; then
  API_KEY=$(jq -r '.apiKey' ~/.openclaw/workspace/skills/lnapi-image-gen/config.json)
else
  echo "❌ Config not found"
  exit 1
fi

echo "=== LN API 详细测试 ==="
echo "API Key: ${API_KEY:0:10}..."
echo "Proxy: http://127.0.0.1:1081"
echo ""

# 测试1: 检查代理
echo "【测试1】检查代理连接..."
curl -x http://127.0.0.1:1081 --connect-timeout 5 https://www.google.com -I 2>&1 | head -3
echo ""

# 测试2: 测试 LN API 域名解析
echo "【测试2】测试域名解析..."
curl -x http://127.0.0.1:1081 --connect-timeout 5 https://api.lnapi.com -I 2>&1 | head -5
echo ""

# 测试3: 详细 SSL 错误
echo "【测试3】详细 SSL 连接测试..."
curl -v -x http://127.0.0.1:1081 --connect-timeout 10 \
  -X POST "https://api.lnapi.com/v1/images/generations" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3.1-flash-image-preview-2k",
    "prompt": "test",
    "n": 1,
    "size": "1024x1536"
  }' 2>&1 | grep -A 5 -B 5 "SSL\|error\|failed"
echo ""

# 测试4: 检查 OpenSSL 版本
echo "【测试4】OpenSSL 版本..."
openssl version
echo ""

# 测试5: 检查 curl 版本
echo "【测试5】curl 版本..."
curl --version | head -2
