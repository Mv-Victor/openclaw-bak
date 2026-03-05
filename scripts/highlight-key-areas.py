#!/usr/bin/env python3
"""
自动识别图片关键区域并用红色方框圈选
使用 Claude 的视觉能力分析图片，然后用 PIL 绘制方框
"""

import sys
import json
from PIL import Image, ImageDraw

def draw_boxes(image_path, boxes, output_path):
    """在图片上绘制红色方框"""
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    
    for box in boxes:
        # box 格式: {"x": x, "y": y, "width": w, "height": h, "label": "描述"}
        x, y, w, h = box['x'], box['y'], box['width'], box['height']
        # 绘制红色方框，线宽 3
        draw.rectangle([x, y, x+w, y+h], outline='red', width=3)
    
    img.save(output_path)
    print(f"已保存到: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("用法: python highlight-key-areas.py <输入图片> <输出图片> [boxes.json]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    # 如果提供了 boxes.json，直接使用
    if len(sys.argv) >= 4:
        with open(sys.argv[3], 'r') as f:
            boxes = json.load(f)
        draw_boxes(input_path, boxes, output_path)
    else:
        print("需要提供 boxes.json 文件，格式:")
        print('[{"x": 100, "y": 100, "width": 200, "height": 150, "label": "标题"}]')
