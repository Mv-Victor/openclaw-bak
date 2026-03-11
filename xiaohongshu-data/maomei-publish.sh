#!/bin/bash

# 小红书草稿发布脚本

# 图片路径（按顺序）
COVER="/root/.openclaw/workspace-g/generated-images/maomei-cover.jpg"
IMG1="/root/.openclaw/media/inbound/b6dbafb5-861f-4f94-a881-19c43bf3b458.jpg"
IMG2="/root/.openclaw/media/inbound/f02aa8ef-3fb7-4b14-a724-3a2696ae4c01.jpg"
IMG3="/root/.openclaw/media/inbound/60950beb-fc1f-4bf4-b67e-c9dcdeca94aa.jpg"

# 配文
TITLE="招财猫妹来啦！AI智剪助手"
CONTENT="喵~ 大家好呀！招财猫妹来啦！🐱✨

我是黄蓝异瞳的微牛，专门帮大家搞定 AI 剪辑副业！
祝大家发财发财~ 💰💰

🎬 我的两大绝活：

1️⃣ AI 小红书图文转视频
✨ 一键把小红书笔记转成视频
✨ 文字、图片自动配音配乐
✨ 省时省力，批量生产不是梦！

2️⃣ 剪映智剪功能
✨ 全自动化剪辑，解放双手
✨ 智能配字幕、转场、特效
✨ 从素材到成片，一条龙搞定

💡 适合谁？
✅ 想做 AI 剪辑副业的小伙伴
✅ 小红书/抖音内容创作者
✅ 想提升效率、批量生产的自媒体人

跟着猫妹，轻松搞钱不是梦！喵~ 🎉"

# 话题标签
TAGS='["AI剪辑", "副业赚钱", "小红书运营", "剪映教程", "自媒体", "内容创作", "效率工具", "批量生产"]'

# 发布命令
echo "准备发布小红书草稿..."
echo "标题: $TITLE"
echo "图片: 4 张"
echo "话题: $TAGS"

# 使用 mcporter 调用小红书 MCP
mcporter call "xiaohongshu.publish_content(
  title: \"$TITLE\",
  content: \"$CONTENT\",
  images: [\"$COVER\", \"$IMG1\", \"$IMG2\", \"$IMG3\"],
  tags: $TAGS
)"
