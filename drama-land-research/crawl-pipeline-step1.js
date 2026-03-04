const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const SCREENSHOTS_DIR = './screenshots-pipeline';
const DATA_DIR = './data-pipeline';

[SCREENSHOTS_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('[Step 1] 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(120000);
  page.setDefaultNavigationTimeout(120000);
  
  // 记录网络请求
  const requests = [];
  const responses = [];
  
  page.on('request', req => {
    requests.push({
      url: req.url(),
      method: req.method(),
      headers: req.headers(),
      postData: req.postData()
    });
  });
  
  page.on('response', async res => {
    try {
      const contentType = res.headers()['content-type'] || '';
      let body = null;
      if (contentType.includes('json')) {
        body = await res.json().catch(() => null);
      }
      responses.push({
        url: res.url(),
        status: res.status(),
        headers: res.headers(),
        body
      });
    } catch (e) {
      // ignore
    }
  });
  
  console.log('[Step 2] 访问首页...');
  await page.goto('https://cn.drama.land', { 
    waitUntil: 'networkidle2',
    timeout: 120000 
  });
  await sleep(3000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/step1-homepage.png`, fullPage: true });
  console.log('✓ 首页截图已保存: step1-homepage.png');
  
  // 提取页面文本，用于调试
  const pageText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(`${DATA_DIR}/step1-homepage-text.txt`, pageText);
  console.log('✓ 首页文本已保存');
  
  console.log('[Step 3] 查找登录按钮...');
  // 提取所有可能的登录按钮
  const loginButtons = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    return buttons.map((btn, idx) => ({
      index: idx,
      text: btn.textContent.trim(),
      tag: btn.tagName,
      className: btn.className,
      id: btn.id
    })).filter(btn => 
      btn.text.includes('登录') || 
      btn.text.includes('Login') || 
      btn.text.includes('Sign in') ||
      btn.text.toLowerCase().includes('login')
    );
  });
  
  console.log('找到的登录按钮:', JSON.stringify(loginButtons, null, 2));
  fs.writeFileSync(`${DATA_DIR}/step2-login-buttons.json`, JSON.stringify(loginButtons, null, 2));
  
  if (loginButtons.length === 0) {
    console.log('⚠ 未找到登录按钮，尝试直接访问画布页面（可能已登录）');
  } else {
    console.log(`[Step 4] 点击登录按钮（索引 ${loginButtons[0].index}）...`);
    const clicked = await page.evaluate((idx) => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      if (buttons[idx]) {
        buttons[idx].click();
        return true;
      }
      return false;
    }, loginButtons[0].index);
    
    if (clicked) {
      await sleep(3000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/step2-login-modal.png`, fullPage: true });
      console.log('✓ 登录模态框截图已保存: step2-login-modal.png');
      
      // 查找邮箱和密码输入框
      console.log('[Step 5] 查找输入框...');
      const inputs = await page.evaluate(() => {
        const allInputs = Array.from(document.querySelectorAll('input'));
        return allInputs.map((input, idx) => ({
          index: idx,
          type: input.type,
          name: input.name,
          placeholder: input.placeholder,
          id: input.id
        }));
      });
      
      console.log('找到的输入框:', JSON.stringify(inputs, null, 2));
      fs.writeFileSync(`${DATA_DIR}/step3-inputs.json`, JSON.stringify(inputs, null, 2));
      
      const emailInput = inputs.find(i => i.type === 'email' || i.name === 'email' || i.placeholder?.toLowerCase().includes('email'));
      const passwordInput = inputs.find(i => i.type === 'password' || i.name === 'password');
      
      if (emailInput && passwordInput) {
        console.log('[Step 6] 填写登录表单...');
        await page.evaluate((emailIdx, passwordIdx) => {
          const allInputs = Array.from(document.querySelectorAll('input'));
          allInputs[emailIdx].value = '1181348296@qq.com';
          allInputs[emailIdx].dispatchEvent(new Event('input', { bubbles: true }));
          allInputs[passwordIdx].value = 'zxcvb123';
          allInputs[passwordIdx].dispatchEvent(new Event('input', { bubbles: true }));
        }, emailInput.index, passwordInput.index);
        
        await sleep(1000);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/step3-login-filled.png`, fullPage: true });
        console.log('✓ 表单填写截图已保存: step3-login-filled.png');
        
        console.log('[Step 7] 查找提交按钮...');
        const submitButtons = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.map((btn, idx) => ({
            index: idx,
            text: btn.textContent.trim(),
            type: btn.type,
            className: btn.className
          })).filter(btn => 
            btn.text.includes('登录') || 
            btn.text.includes('Login') || 
            btn.type === 'submit'
          );
        });
        
        console.log('找到的提交按钮:', JSON.stringify(submitButtons, null, 2));
        
        if (submitButtons.length > 0) {
          console.log('[Step 8] 点击提交按钮...');
          await page.evaluate((idx) => {
            const buttons = Array.from(document.querySelectorAll('button'));
            if (buttons[idx]) {
              buttons[idx].click();
            }
          }, submitButtons[0].index);
          
          await sleep(5000);
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/step4-after-login.png`, fullPage: true });
          console.log('✓ 登录后截图已保存: step4-after-login.png');
        }
      }
    }
  }
  
  console.log('[Step 9] 访问画布页面...');
  await page.goto('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes', {
    waitUntil: 'networkidle2',
    timeout: 120000
  });
  await sleep(5000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/step5-canvas-initial.png`, fullPage: true });
  console.log('✓ 画布初始截图已保存: step5-canvas-initial.png');
  
  // 提取画布页面的所有可点击元素
  console.log('[Step 10] 提取画布页面的可点击元素...');
  const clickableElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, a, [role="button"], [onclick]'));
    return elements.map((el, idx) => ({
      index: idx,
      text: el.textContent.trim().substring(0, 50),
      tag: el.tagName,
      className: el.className,
      id: el.id,
      role: el.getAttribute('role'),
      ariaLabel: el.getAttribute('aria-label')
    })).filter(el => el.text.length > 0 && el.text.length < 50);
  });
  
  console.log(`找到 ${clickableElements.length} 个可点击元素`);
  fs.writeFileSync(`${DATA_DIR}/step6-clickable-elements.json`, JSON.stringify(clickableElements, null, 2));
  console.log('✓ 可点击元素列表已保存');
  
  // 保存网络数据
  console.log('[Step 11] 保存网络数据...');
  fs.writeFileSync(`${DATA_DIR}/requests.json`, JSON.stringify(requests, null, 2));
  fs.writeFileSync(`${DATA_DIR}/responses.json`, JSON.stringify(responses, null, 2));
  console.log('✓ 网络数据已保存');
  
  console.log('[完成] 第一阶段完成，等待分析截图...');
  await browser.close();
}

main().catch(console.error);
