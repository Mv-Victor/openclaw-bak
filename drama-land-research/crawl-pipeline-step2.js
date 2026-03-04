const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const SCREENSHOTS_DIR = './screenshots-pipeline';
const DATA_DIR = './data-pipeline';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('[Step 1] 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(120000);
  
  console.log('[Step 2] 访问首页并点击登录...');
  await page.goto('https://cn.drama.land', { waitUntil: 'networkidle2', timeout: 120000 });
  await sleep(3000);
  
  // 点击"注册/登录"按钮（index 4）
  const loginClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const loginBtn = buttons.find(btn => btn.textContent.includes('注册/登录') || btn.textContent.includes('登录'));
    if (loginBtn) {
      loginBtn.click();
      return true;
    }
    return false;
  });
  
  if (!loginClicked) {
    console.log('⚠ 未找到登录按钮');
    await browser.close();
    return;
  }
  
  await sleep(3000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/step2-login-modal.png` });
  console.log('✓ 登录模态框截图: step2-login-modal.png');
  
  console.log('[Step 3] 填写登录表单...');
  // 查找并填写邮箱
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const emailInput = inputs.find(i => i.type === 'email' || i.placeholder?.toLowerCase().includes('email') || i.placeholder?.includes('邮箱'));
    const passwordInput = inputs.find(i => i.type === 'password' || i.placeholder?.toLowerCase().includes('password') || i.placeholder?.includes('密码'));
    
    if (emailInput) {
      emailInput.value = '1181348296@qq.com';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    if (passwordInput) {
      passwordInput.value = 'zxcvb123';
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    return { email: !!emailInput, password: !!passwordInput };
  });
  
  await sleep(2000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/step3-login-filled.png` });
  console.log('✓ 表单填写截图: step3-login-filled.png');
  
  console.log('[Step 4] 提交登录...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(btn => 
      (btn.textContent.includes('登录') || btn.textContent.includes('Login')) && 
      !btn.textContent.includes('注册')
    );
    if (submitBtn) {
      submitBtn.click();
    }
  });
  
  await sleep(8000); // 等待登录完成
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/step4-after-login.png`, fullPage: true });
  console.log('✓ 登录后截图: step4-after-login.png');
  
  console.log('[Step 5] 访问画布页面（已登录）...');
  await page.goto('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes', {
    waitUntil: 'networkidle2',
    timeout: 120000
  });
  await sleep(5000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/step5-canvas-logged-in.png`, fullPage: true });
  console.log('✓ 画布页面（已登录）截图: step5-canvas-logged-in.png');
  
  console.log('[Step 6] 提取画布页面的所有可点击元素...');
  const clickableElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, a, [role="button"], [role="tab"], div[class*="cursor-pointer"]'));
    return elements.map((el, idx) => {
      const rect = el.getBoundingClientRect();
      return {
        index: idx,
        text: el.textContent.trim().substring(0, 100),
        tag: el.tagName,
        className: el.className.substring(0, 200),
        id: el.id,
        role: el.getAttribute('role'),
        visible: rect.width > 0 && rect.height > 0,
        position: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }
      };
    }).filter(el => el.visible && el.text.length > 0 && el.text.length < 100);
  });
  
  console.log(`找到 ${clickableElements.length} 个可点击元素`);
  fs.writeFileSync(`${DATA_DIR}/step6-canvas-clickable-elements.json`, JSON.stringify(clickableElements, null, 2));
  console.log('✓ 可点击元素列表已保存');
  
  // 输出前20个元素供分析
  console.log('\n前20个可点击元素:');
  clickableElements.slice(0, 20).forEach(el => {
    console.log(`  [${el.index}] ${el.text} (${el.tag})`);
  });
  
  console.log('\n[完成] 第二阶段完成，等待分析可点击元素...');
  await browser.close();
}

main().catch(console.error);
