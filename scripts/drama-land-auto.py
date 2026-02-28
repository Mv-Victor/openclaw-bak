#!/usr/bin/env python3
"""
Drama.Land 自动化探索脚本
使用 Playwright + pyautogui 登录并探索 Drama.Land 功能
"""

import asyncio
from playwright.async_api import async_playwright
import json
import os
from datetime import datetime

SCREENSHOT_DIR = "/root/.openclaw/workspace-g/docs/drama-land-screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

async def main():
    print("🚀 启动 Playwright...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--window-size=1920,1080',
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox'
            ]
        )
        
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            bypass_csp=True
        )
        
        page = await context.new_page()
        
        # 启用 Network 监听
        api_requests = []
        page.on('request', lambda request: api_requests.append({
            'url': request.url,
            'method': request.method,
            'time': datetime.now().isoformat()
        }))
        
        page.on('response', lambda response: print(f"📡 Response: {response.status} {response.url}"))
        
        try:
            # 1. 访问首页
            print("📝 访问 Drama.Land 首页...")
            await page.goto('https://cn.drama.land/zh-cn',
                wait_until='domcontentloaded',
                timeout=30000
            )
            await page.wait_for_timeout(5000)
            await page.screenshot(path=f'{SCREENSHOT_DIR}/00-homepage.png', full_page=True)
            print("✅ 首页截图完成")
            
            # 保存 HTML
            html = await page.content()
            with open(f'{SCREENSHOT_DIR}/00-homepage.html', 'w') as f:
                f.write(html)
            
            # 2. 关闭欢迎弹窗（如果有）
            print("🚫 检查欢迎弹窗...")
            # 尝试多种选择器
            popup_selectors = [
                'div.z-\\[200\\]',
                '[class*="welcome"]',
                '[class*="popup"]',
                '[aria-modal="true"]',
                '[role="dialog"]',
                '.modal',
                '.overlay'
            ]
            welcome_popup = None
            for sel in popup_selectors:
                try:
                    welcome_popup = await page.query_selector(sel)
                    if welcome_popup:
                        print(f"✅ 检测到欢迎弹窗：{sel}")
                        break
                except:
                    pass
            
            if welcome_popup:
                print("🚫 关闭弹窗...")
                # 尝试移除弹窗
                await page.evaluate('''() => {
                    const selectors = [
                        'div.z-\\[200\\]',
                        '[class*="welcome"]',
                        '[class*="popup"]',
                        '[aria-modal="true"]',
                        '[role="dialog"]',
                        '.modal',
                        '.overlay'
                    ];
                    selectors.forEach(sel => {
                        document.querySelectorAll(sel).forEach(el => el.remove());
                    });
                }''')
                await page.wait_for_timeout(2000)
                await page.screenshot(path=f'{SCREENSHOT_DIR}/00b-after-popup.png', full_page=True)
                print("✅ 弹窗已移除")
            else:
                print("ℹ️ 未检测到欢迎弹窗")
            
            # 3. 点击登录按钮
            print("🔑 寻找登录按钮...")
            
            # 尝试多种选择器
            login_selectors = [
                'button:has-text("登录")',
                'button:has-text("注册/登录")',
                'a:has-text("登录")',
                '[class*="login"]',
                '[class*="auth"]'
            ]
            
            login_button = None
            for selector in login_selectors:
                try:
                    login_button = await page.query_selector(selector)
                    if login_button:
                        print(f"✅ 找到登录按钮：{selector}")
                        break
                except:
                    pass
            
            if login_button:
                await login_button.click()
                print("✅ 已点击登录按钮")
                await page.wait_for_timeout(3000)
                await page.screenshot(path=f'{SCREENSHOT_DIR}/01-after-login-click.png', full_page=True)
                
                # 等待登录弹窗
                await page.wait_for_timeout(3000)
                
                # 3. 填写登录表单
                print("🔑 寻找登录表单...")
                
                email_input = await page.query_selector('input[type="email"], input[name="email"], input[placeholder*="邮"]')
                password_input = await page.query_selector('input[type="password"], input[name="password"], input[placeholder*="密"]')
                
                if email_input and password_input:
                    print("📝 填写登录信息...")
                    await email_input.fill('1181348296@qq.com')
                    await page.wait_for_timeout(500)
                    await password_input.fill('zxcvb123')
                    await page.wait_for_timeout(1000)
                    await page.screenshot(path=f'{SCREENSHOT_DIR}/02-login-filled.png', full_page=True)
                    
                    # 点击登录
                    print("✅ 提交登录...")
                    submit_button = await page.query_selector('button[type="submit"], button:has-text("登录")')
                    if submit_button:
                        await submit_button.click()
                    else:
                        await password_input.press('Enter')
                    
                    # 等待登录
                    print("⏳ 等待登录完成...")
                    await page.wait_for_timeout(10000)
                    await page.screenshot(path=f'{SCREENSHOT_DIR}/03-after-login.png', full_page=True)
                    print(f"📍 登录后 URL: {page.url}")
                else:
                    print("⚠️ 未找到登录表单输入框")
                    # 保存调试信息
                    debug_info = await page.evaluate('''() => {
                        return {
                            inputs: Array.from(document.querySelectorAll('input')).map(i => ({
                                type: i.type,
                                name: i.name,
                                placeholder: i.placeholder,
                                class: i.className
                            })),
                            buttons: Array.from(document.querySelectorAll('button')).map(b => ({
                                text: b.textContent,
                                class: b.className
                            }))
                        }
                    }''')
                    with open(f'{SCREENSHOT_DIR}/debug-login-form.json', 'w') as f:
                        json.dump(debug_info, f, indent=2, ensure_ascii=False)
            else:
                print("⚠️ 未找到登录按钮")
            
            # 4. 访问 Canvas 页面
            print("🎨 访问 Canvas 页面...")
            canvas_url = 'https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes'
            await page.goto(canvas_url,
                wait_until='domcontentloaded',
                timeout=30000
            )
            await page.wait_for_timeout(10000)
            await page.screenshot(path=f'{SCREENSHOT_DIR}/04-canvas-full.png', full_page=True)
            print("✅ Canvas 页面截图完成")
            
            # 保存 Canvas HTML
            html = await page.content()
            with open(f'{SCREENSHOT_DIR}/04-canvas-full.html', 'w') as f:
                f.write(html)
            
            # 5. 提取 UI 结构
            print("📐 提取 UI 结构...")
            ui_structure = await page.evaluate('''() => {
                const info = {
                    url: window.location.href,
                    title: document.title,
                    layout: {},
                    nodes: []
                };
                
                // 左侧导航
                const leftNav = document.querySelector('aside:first-child, nav:first-child, [class*="sidebar"]');
                if (leftNav) {
                    const rect = leftNav.getBoundingClientRect();
                    const style = window.getComputedStyle(leftNav);
                    info.layout.leftNav = {
                        width: rect.width,
                        height: rect.height,
                        x: rect.x,
                        y: rect.y,
                        background: style.background,
                        boxShadow: style.boxShadow,
                        borderRadius: style.borderRadius
                    };
                }
                
                // 右侧面板
                const rightPanel = document.querySelector('aside:last-child, [class*="detail"], [class*="panel"]');
                if (rightPanel) {
                    const rect = rightPanel.getBoundingClientRect();
                    const style = window.getComputedStyle(rightPanel);
                    info.layout.rightPanel = {
                        width: rect.width,
                        height: rect.height,
                        x: rect.x,
                        y: rect.y,
                        background: style.background,
                        padding: style.padding
                    };
                }
                
                // 节点卡片
                const nodes = document.querySelectorAll('[class*="node"], [class*="card"]');
                nodes.forEach((node, i) => {
                    if (i < 5) {
                        const rect = node.getBoundingClientRect();
                        const style = window.getComputedStyle(node);
                        info.nodes.push({
                            class: node.className,
                            width: rect.width,
                            height: rect.height,
                            boxShadow: style.boxShadow,
                            borderRadius: style.borderRadius,
                            border: style.border,
                            background: style.background
                        });
                    }
                });
                
                return info;
            }''')
            
            with open(f'{SCREENSHOT_DIR}/05-ui-structure.json', 'w') as f:
                json.dump(ui_structure, f, indent=2, ensure_ascii=False)
            print("✅ UI 结构已保存")
            
            # 6. 访问项目列表
            print("📁 访问项目列表...")
            await page.goto('https://cn.drama.land/zh-cn/projects',
                wait_until='domcontentloaded',
                timeout=30000
            )
            await page.wait_for_timeout(5000)
            await page.screenshot(path=f'{SCREENSHOT_DIR}/06-projects.png', full_page=True)
            
            # 7. 访问资产页
            print("🎬 访问资产页...")
            await page.goto('https://cn.drama.land/zh-cn/assets',
                wait_until='domcontentloaded',
                timeout=30000
            )
            await page.wait_for_timeout(5000)
            await page.screenshot(path=f'{SCREENSHOT_DIR}/07-assets.png', full_page=True)
            
            # 保存 API 请求记录
            print("📡 保存 API 请求记录...")
            with open(f'{SCREENSHOT_DIR}/08-api-requests.json', 'w') as f:
                json.dump(api_requests, f, indent=2, ensure_ascii=False)
            
            print("✅ 所有截图完成！")
            print(f"📂 截图保存目录：{SCREENSHOT_DIR}")
            
        except Exception as e:
            print(f"❌ 错误：{e}")
            await page.screenshot(path=f'{SCREENSHOT_DIR}/error-{datetime.now().strftime("%Y%m%d-%H%M%S")}.png')
            
        finally:
            print("👋 关闭浏览器...")
            await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
