const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const SCREENSHOTS_DIR = './screenshots-puppeteer';
const DATA_DIR = './data-puppeteer';

[SCREENSHOTS_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('启动浏览器...');
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
  
  // 设置更长的超时
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
  
  console.log('访问首页...');
  try {
    await page.goto('https://cn.drama.land', { 
      waitUntil: 'networkidle2',
      timeout: 120000 
    });
    await sleep(3000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/00-homepage.png`, fullPage: true });
  } catch (e) {
    console.log('首页访问失败，尝试继续:', e.message);
  }
  
  console.log('登录...');
  try {
    // 查找登录按钮（使用 CSS 选择器）
    await page.waitForSelector('button, a', { timeout: 10000 });
    
    // 尝试多种方式查找登录按钮
    const loginBtn = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const loginButton = buttons.find(btn => 
        btn.textContent.includes('登录') || 
        btn.textContent.includes('Login') ||
        btn.textContent.includes('Sign in')
      );
      if (loginButton) {
        loginButton.click();
        return true;
      }
      return false;
    });
    
    if (loginBtn) {
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-login-modal.png` });
      
      // 填写表单
      await page.type('input[type="email"], input[name="email"]', '1181348296@qq.com');
      await page.type('input[type="password"], input[name="password"]', 'zxcvb123');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/02-login-filled.png` });
      
      // 提交
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const submitBtn = buttons.find(btn => 
          btn.textContent.includes('登录') || 
          btn.textContent.includes('Login') ||
          btn.type === 'submit'
        );
        if (submitBtn) submitBtn.click();
      });
      await sleep(5000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-after-login.png`, fullPage: true });
    }
  } catch (e) {
    console.log('登录失败，尝试继续:', e.message);
  }
  
  console.log('访问画布页面...');
  try {
    await page.goto('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes', {
      waitUntil: 'networkidle2',
      timeout: 120000
    });
    await sleep(5000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-canvas-initial.png`, fullPage: true });
  } catch (e) {
    console.log('画布页面访问失败:', e.message);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-canvas-error.png`, fullPage: true });
  }
  
  // 深度交互：基础信息
  console.log('查找并点击基础信息...');
  try {
    const clicked = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, div, span'));
      const basicInfoBtn = elements.find(el => el.textContent.includes('基础信息'));
      if (basicInfoBtn) {
        basicInfoBtn.click();
        return true;
      }
      return false;
    });
    
    if (clicked) {
      await sleep(3000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/05-basic-info.png`, fullPage: true });
      
      // 基础设定
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, span'));
        const btn = elements.find(el => el.textContent.includes('基础设定'));
        if (btn) btn.click();
      });
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/06-basic-setting.png`, fullPage: true });
      
      // 剧集设定
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, span'));
        const btn = elements.find(el => el.textContent.includes('剧集设定'));
        if (btn) btn.click();
      });
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-episode-setting.png`, fullPage: true });
      
      // 梗概
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, span'));
        const btn = elements.find(el => el.textContent === '梗概' || el.textContent.includes('梗概'));
        if (btn) btn.click();
      });
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/08-synopsis.png`, fullPage: true });
      
      // 设定
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, span'));
        const btn = elements.find(el => el.textContent === '设定');
        if (btn) btn.click();
      });
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/09-setting.png`, fullPage: true });
      
      // 世界观
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, span'));
        const btn = elements.find(el => el.textContent.includes('世界观'));
        if (btn) btn.click();
      });
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/10-worldview.png`, fullPage: true });
    }
  } catch (e) {
    console.log('基础信息交互失败:', e.message);
  }
  
  // 深度交互：角色集
  console.log('查找并点击角色集...');
  try {
    const clicked = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, div, span'));
      const btn = elements.find(el => el.textContent.includes('角色集') || el.textContent.includes('角色'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    
    if (clicked) {
      await sleep(3000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/11-character-list.png`, fullPage: true });
      
      // 点击第一个角色
      const characterCards = await page.$$('[class*="character"], [data-testid*="character"]');
      if (characterCards.length > 0) {
        await characterCards[0].click();
        await sleep(3000);
        await page.screenshot({ path: `${SCREENSHOTS_DIR}/12-character-detail.png`, fullPage: true });
      }
    }
  } catch (e) {
    console.log('角色集交互失败:', e.message);
  }
  
  // 深度交互：规划中心
  console.log('查找并点击规划中心...');
  try {
    const clicked = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('button, div, span'));
      const btn = elements.find(el => el.textContent.includes('规划中心') || el.textContent.includes('规划'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    
    if (clicked) {
      await sleep(3000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/13-planning-center.png`, fullPage: true });
      
      // 封面
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, span'));
        const btn = elements.find(el => el.textContent.includes('封面'));
        if (btn) btn.click();
      });
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/14-cover.png`, fullPage: true });
      
      // 剧集信息
      await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, div, span'));
        const btn = elements.find(el => el.textContent.includes('剧集信息'));
        if (btn) btn.click();
      });
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/15-episode-info.png`, fullPage: true });
    }
  } catch (e) {
    console.log('规划中心交互失败:', e.message);
  }
  
  // 保存数据
  console.log('保存网络数据...');
  fs.writeFileSync(`${DATA_DIR}/requests.json`, JSON.stringify(requests, null, 2));
  fs.writeFileSync(`${DATA_DIR}/responses.json`, JSON.stringify(responses, null, 2));
  
  // 提取页面文本
  const pageText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(`${DATA_DIR}/page-text.txt`, pageText);
  
  // 提取表单字段
  const formFields = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    return inputs.map(input => ({
      type: input.type || input.tagName.toLowerCase(),
      name: input.name,
      placeholder: input.placeholder,
      label: input.labels?.[0]?.textContent || '',
      value: input.value
    }));
  });
  fs.writeFileSync(`${DATA_DIR}/form-fields.json`, JSON.stringify(formFields, null, 2));
  
  console.log('完成！');
  await browser.close();
}

main().catch(console.error);
