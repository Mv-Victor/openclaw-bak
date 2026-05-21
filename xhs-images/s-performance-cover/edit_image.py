#!/usr/bin/env python3
import json
import base64
import requests
import sys

# 读取配置
with open('/root/.openclaw/workspace/skills/lnapi-image-gen/config.json') as f:
    config = json.load(f)
    api_key = config['apiKey']

# 读取原图并转为 base64
with open('01-cover-s-performance-v2.png', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

# 构建请求
payload = {
    "model": "gemini-3.1-flash-image-preview",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Add decorative elements around the letter S in this image: sparkles, stars, glow effect, flower-style decorative text (Hua Zi), colorful stickers. Make the S stand out with bright highlights, neon glow, and eye-catching decorations. Keep all other elements unchanged."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{image_data}"
                    }
                }
            ]
        }
    ],
    "max_tokens": 4096
}

print("=== 调用 LN API 图片编辑功能 ===")
print(f"原图大小: {len(image_data)} bytes (base64)")

# 调用 API
response = requests.post(
    "https://lnapi.com/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    },
    json=payload,
    proxies={
        "http": "http://127.0.0.1:1081",
        "https": "http://127.0.0.1:1081"
    },
    timeout=180
)

print(f"状态码: {response.status_code}")

# 保存响应
with open('response-edit-v1.json', 'w') as f:
    json.dump(response.json(), f, indent=2)

print(json.dumps(response.json(), indent=2))

# 如果返回了图片，保存
result = response.json()
if 'choices' in result and len(result['choices']) > 0:
    content = result['choices'][0]['message']['content']
    print(f"\n返回内容类型: {type(content)}")
    print(f"返回内容: {content[:200] if isinstance(content, str) else content}")
