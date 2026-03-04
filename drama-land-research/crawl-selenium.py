from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import time
import json

# Chrome 配置
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--window-size=1920,1080')

print('[Step 1] 启动浏览器...')
driver = webdriver.Chrome(options=chrome_options)
driver.set_page_load_timeout(120)
wait = WebDriverWait(driver, 30)

try:
    print('[Step 2] 访问首页...')
    driver.get('https://cn.drama.land')
    time.sleep(3)
    driver.save_screenshot('screenshots-selenium/step1-homepage.png')
    print('✓ 首页截图已保存')
    
    print('[Step 3] 查找并点击登录按钮...')
    # 尝试多种方式查找登录按钮
    login_button = None
    try:
        login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), '登录') or contains(text(), 'Login') or contains(text(), '注册/登录')]")))
    except:
        try:
            login_button = driver.find_element(By.XPATH, "//a[contains(text(), '登录') or contains(text(), 'Login')]")
        except:
            print('⚠ 未找到登录按钮，尝试直接访问登录页面')
    
    if login_button:
        login_button.click()
        time.sleep(3)
        driver.save_screenshot('screenshots-selenium/step2-login-modal.png')
        print('✓ 登录模态框截图已保存')
        
        print('[Step 4] 填写登录表单...')
        # 查找邮箱输入框
        email_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@type='email' or contains(@placeholder, 'email') or contains(@placeholder, '邮箱')]")))
        email_input.clear()
        email_input.send_keys('1181348296@qq.com')
        
        # 查找密码输入框
        password_input = driver.find_element(By.XPATH, "//input[@type='password' or contains(@placeholder, 'password') or contains(@placeholder, '密码')]")
        password_input.clear()
        password_input.send_keys('zxcvb123')
        
        time.sleep(2)
        driver.save_screenshot('screenshots-selenium/step3-login-filled.png')
        print('✓ 表单填写截图已保存')
        
        print('[Step 5] 提交登录...')
        # 查找提交按钮
        submit_button = driver.find_element(By.XPATH, "//button[@type='submit' or (contains(text(), '登录') and not(contains(text(), '注册')))]")
        submit_button.click()
        
        time.sleep(8)
        driver.save_screenshot('screenshots-selenium/step4-after-login.png')
        print('✓ 登录后截图已保存')
    
    print('[Step 6] 访问画布页面...')
    driver.get('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes')
    time.sleep(5)
    driver.save_screenshot('screenshots-selenium/step5-canvas.png')
    print('✓ 画布页面截图已保存')
    
    print('[Step 7] 提取所有可点击元素...')
    elements = driver.find_elements(By.XPATH, "//button | //a | //*[@role='button'] | //*[@role='tab']")
    clickable_elements = []
    
    for idx, el in enumerate(elements):
        try:
            if el.is_displayed():
                text = el.text.strip()[:100]
                if text:
                    clickable_elements.append({
                        'index': idx,
                        'text': text,
                        'tag': el.tag_name,
                        'class': el.get_attribute('class')[:200] if el.get_attribute('class') else '',
                        'id': el.get_attribute('id') or '',
                        'role': el.get_attribute('role') or ''
                    })
        except:
            pass
    
    print(f'找到 {len(clickable_elements)} 个可点击元素')
    
    with open('data-selenium/clickable-elements.json', 'w', encoding='utf-8') as f:
        json.dump(clickable_elements, f, ensure_ascii=False, indent=2)
    
    # 输出关键元素
    print('\n关键可点击元素:')
    keywords = ['基础', '剧集', '角色', '规划', '设定', '梗概', '世界观', '封面']
    for el in clickable_elements:
        if any(kw in el['text'] for kw in keywords):
            print(f"  [{el['index']}] {el['text']} ({el['tag']})")
    
    print('\n[完成] Selenium 登录和元素提取完成')

except Exception as e:
    print(f'❌ 错误: {e}')
    driver.save_screenshot('screenshots-selenium/error.png')

finally:
    driver.quit()
