const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = './screenshots';
const DATA_DIR = './data';

// 确保目录存在
[SCREENSHOTS_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // 记录所有网络请求
  const requests = [];
  page.on('request', req => {
    requests.push({
      url: req.url(),
      method: req.method(),
      headers: req.headers(),
      postData: req.postData()
    });
  });
  
  const responses = [];
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
  await page.goto('https://cn.drama.land', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  await sleep(3000); // 等待 JS 渲染
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-homepage.png`, fullPage: true });
  await sleep(2000);
  
  console.log('登录...');
  // 查找登录入口
  const loginBtn = await page.locator('text=/登录|Login|Sign in/i').first();
  if (await loginBtn.count() > 0) {
    await loginBtn.click();
    await sleep(1000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/02-login-modal.png` });
    
    // 填写邮箱密码
    await page.fill('input[type="email"], input[name="email"]', '1181348296@qq.com');
    await page.fill('input[type="password"], input[name="password"]', 'zxcvb123');
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-login-filled.png` });
    
    // 点击登录按钮
    await page.locator('button:has-text("登录"), button:has-text("Login"), button[type="submit"]').first().click();
    await sleep(3000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-after-login.png`, fullPage: true });
  }
  
  console.log('访问画布页面...');
  await page.goto('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  await sleep(3000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/05-canvas-main.png`, fullPage: true });
  
  console.log('访问具体 episode...');
  await page.goto('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes&episodeId=03bffdbc-1775-4a93-9da8-16c00ead6f69', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  await sleep(3000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/06-canvas-episode.png`, fullPage: true });
  
  // 点击角色卡片查看详情
  console.log('查看角色详情...');
  try {
    const characterCards = await page.locator('[class*="character"], [class*="Character"], img[alt*="character"]').all();
    if (characterCards.length > 0) {
      await characterCards[0].click();
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-character-detail.png`, fullPage: true });
    }
  } catch (e) {
    console.log('角色详情点击失败，跳过:', e.message);
  }
  
  // 尝试访问项目列表
  console.log('访问项目列表...');
  await page.goto('https://cn.drama.land/zh-cn/projects', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  await sleep(2000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/08-projects-list.png`, fullPage: true });
  
  // 尝试访问视觉风格库
  console.log('查找视觉风格库...');
  const styleBtn = await page.locator('text=/风格|Style|Visual/i').first();
  if (await styleBtn.count() > 0) {
    await styleBtn.click();
    await sleep(2000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/09-visual-styles.png`, fullPage: true });
  }
  
  // 尝试访问配音库
  console.log('查找配音库...');
  const voiceBtn = await page.locator('text=/配音|Voice|Audio/i').first();
  if (await voiceBtn.count() > 0) {
    await voiceBtn.click();
    await sleep(2000);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/10-voice-library.png`, fullPage: true });
  }
  
  // 保存网络请求数据
  console.log('保存网络请求数据...');
  fs.writeFileSync(`${DATA_DIR}/requests.json`, JSON.stringify(requests, null, 2));
  fs.writeFileSync(`${DATA_DIR}/responses.json`, JSON.stringify(responses, null, 2));
  
  // 提取页面技术栈信息
  console.log('提取技术栈信息...');
  const techStack = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
    const frameworks = {
      react: scripts.some(s => s.includes('react')),
      vue: scripts.some(s => s.includes('vue')),
      next: scripts.some(s => s.includes('next') || s.includes('_next')),
      nuxt: scripts.some(s => s.includes('nuxt')),
      webpack: scripts.some(s => s.includes('webpack')),
      vite: scripts.some(s => s.includes('vite'))
    };
    return {
      scripts: scripts.slice(0, 20),
      frameworks,
      meta: Array.from(document.querySelectorAll('meta')).map(m => ({
        name: m.name || m.property,
        content: m.content
      }))
    };
  });
  fs.writeFileSync(`${DATA_DIR}/tech-stack.json`, JSON.stringify(techStack, null, 2));
  
  console.log('完成！');
  await browser.close();
}

main().catch(console.error);
