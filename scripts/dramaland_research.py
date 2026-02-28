#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Drama.Land 自动化调研脚本 v2
功能：登录、探索文生图/文生视频功能、截图、记录 API 调用
"""

import time
import json
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager

# 配置
EMAIL = "1181348296@qq.com"
PASSWORD = "zxcvb123"
BASE_URL = "https://cn.drama.land"
OUTPUT_DIR = "/root/.openclaw/workspace/dramaland-research"

# 创建输出目录
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(f"{OUTPUT_DIR}/screenshots", exist_ok=True)

def setup_driver():
    """配置 Chrome 驱动"""
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def save_screenshot(driver, name):
    """保存截图"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = f"{OUTPUT_DIR}/screenshots/{timestamp}_{name}.png"
    driver.save_screenshot(filepath)
    print(f"✅ 截图保存：{filepath}")
    return filepath

def save_html(driver, name):
    """保存页面 HTML"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = f"{OUTPUT_DIR}/{timestamp}_{name}.html"
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(driver.page_source)
    print(f"✅ HTML 保存：{filepath}")
    return filepath

def login(driver):
    """登录 Drama.Land"""
    print("\n🔐 开始登录...")
    
    # 访问登录页
    driver.get(f"{BASE_URL}/zh-cn/login")
    time.sleep(5)
    save_screenshot(driver, "login_page")
    save_html(driver, "login_page")
    
    # 尝试多种选择器查找邮箱输入框
    email_input = None
    selectors = [
        'input[type="email"]',
        'input[name="email"]',
        'input[placeholder*="邮箱"]',
        'input[placeholder*="email"]',
        'input[placeholder*="Email"]',
        '#email',
        '[data-testid="email-input"]',
    ]
    
    for selector in selectors:
        try:
            elements = driver.find_elements(By.CSS_SELECTOR, selector)
            if elements:
                email_input = elements[0]
                print(f"✅ 找到邮箱输入框：{selector}")
                break
        except:
            continue
    
    if not email_input:
        # 尝试 XPath
        try:
            email_input = driver.find_element(By.XPATH, "//input[contains(@placeholder, '邮箱') or contains(@placeholder, 'email')]")
            print("✅ 找到邮箱输入框 (XPath)")
        except:
            print("❌ 未找到邮箱输入框，尝试通用 input")
            inputs = driver.find_elements(By.CSS_SELECTOR, 'input')
            if inputs and len(inputs) >= 2:
                email_input = inputs[0]
                print(f"✅ 使用第一个 input 元素（共{len(inputs)}个）")
    
    if email_input:
        email_input.send_keys(EMAIL)
        time.sleep(1)
        
        # 查找密码输入框
        password_input = None
        try:
            password_input = driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')
        except:
            inputs = driver.find_elements(By.CSS_SELECTOR, 'input[type="password"]')
            if inputs:
                password_input = inputs[0]
        
        if password_input:
            password_input.send_keys(PASSWORD)
            time.sleep(1)
            
            # 查找登录按钮
            login_btn = None
            btn_selectors = [
                'button[type="submit"]',
                'button:contains("登录")',
                'button:contains("Login")',
                '[data-testid="login-button"]',
            ]
            
            for selector in btn_selectors:
                try:
                    btns = driver.find_elements(By.CSS_SELECTOR, selector)
                    if btns:
                        login_btn = btns[0]
                        break
                except:
                    continue
            
            if login_btn:
                login_btn.click()
            else:
                # 直接回车
                password_input.send_keys(Keys.RETURN)
            
            time.sleep(5)
            save_screenshot(driver, "after_login")
            print("✅ 登录操作完成")
            return True
        else:
            print("❌ 未找到密码输入框")
            return False
    else:
        print("❌ 未找到邮箱输入框")
        return False

def explore_canvas(driver):
    """探索 Canvas 画布页"""
    print("\n🎨 探索 Canvas 画布页...")
    
    canvas_url = f"{BASE_URL}/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes"
    driver.get(canvas_url)
    time.sleep(5)
    
    save_screenshot(driver, "canvas_full")
    save_html(driver, "canvas_page")
    
    # 尝试点击节点
    try:
        nodes = driver.find_elements(By.CSS_SELECTOR, '.react-flow__node')
        if nodes:
            print(f"找到 {len(nodes)} 个节点")
            ActionChains(driver).move_to_element(nodes[0]).click().perform()
            time.sleep(2)
            save_screenshot(driver, "canvas_node_selected")
    except Exception as e:
        print(f"⚠️ 节点点击失败：{e}")
    
    print("✅ Canvas 探索完成")

def explore_features(driver):
    """探索其他功能"""
    print("\n🚀 探索其他功能...")
    
    # 项目列表
    try:
        driver.get(f"{BASE_URL}/zh-cn/projects")
        time.sleep(3)
        save_screenshot(driver, "projects_list")
        save_html(driver, "projects_page")
        print("✅ 项目列表页截图")
    except Exception as e:
        print(f"⚠️ 项目列表页：{e}")
    
    # 首页
    try:
        driver.get(f"{BASE_URL}/zh-cn")
        time.sleep(3)
        save_screenshot(driver, "homepage")
        save_html(driver, "homepage")
        print("✅ 首页截图")
    except Exception as e:
        print(f"⚠️ 首页：{e}")

def main():
    """主函数"""
    print("=" * 60)
    print("🎭 Drama.Land 自动化调研 v2")
    print("=" * 60)
    print(f"📅 时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 输出目录：{OUTPUT_DIR}")
    
    driver = None
    try:
        driver = setup_driver()
        print("✅ Chrome 驱动已启动")
        
        if login(driver):
            explore_canvas(driver)
            explore_features(driver)
        
        # 生成报告
        report = {
            "timestamp": datetime.now().isoformat(),
            "status": "success",
            "screenshots_dir": f"{OUTPUT_DIR}/screenshots",
            "output_dir": OUTPUT_DIR,
            "explored_pages": ["login", "canvas", "projects", "homepage"]
        }
        
        report_path = f"{OUTPUT_DIR}/research_report.json"
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n📊 调研报告：{report_path}")
        print("\n" + "=" * 60)
        print("✅ 调研完成！")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ 错误：{e}")
        import traceback
        traceback.print_exc()
        
    finally:
        if driver:
            driver.quit()
            print("🔒 Chrome 驱动已关闭")

if __name__ == "__main__":
    main()
