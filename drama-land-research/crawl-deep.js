const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = './screenshots-deep';
const DATA_DIR = './data-deep';

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
  
  console.log('访问首页并登录...');
  await page.goto('https://cn.drama.land', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  await sleep(3000);
  
  // 登录
  try {
    const loginBtn = await page.locator('text=/登录|Login|Sign in/i').first();
    if (await loginBtn.count() > 0) {
      await loginBtn.click();
      await sleep(1000);
      
      await page.fill('input[type="email"], input[name="email"]', '1181348296@qq.com');
      await page.fill('input[type="password"], input[name="password"]', 'zxcvb123');
      await page.locator('button:has-text("登录"), button:has-text("Login"), button[type="submit"]').first().click();
      await sleep(3000);
    }
  } catch (e) {
    console.log('登录失败，继续:', e.message);
  }
  
  console.log('访问画布页面...');
  await page.goto('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000 
  });
  await sleep(5000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/01-canvas-initial.png`, fullPage: true });
  
  // 深度交互：基础信息
  console.log('点击基础信息...');
  try {
    const basicInfoBtn = await page.locator('text=/基础信息|基础设定|Basic Info/i').first();
    if (await basicInfoBtn.count() > 0) {
      await basicInfoBtn.click();
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/02-basic-info-panel.png`, fullPage: true });
      
      // 查找子选项：基础设定、剧集设定
      const tabs = await page.locator('[role="tab"], button, a').all();
      for (let i = 0; i < Math.min(tabs.length, 10); i++) {
        try {
          const text = await tabs[i].textContent();
          if (text && (text.includes('基础设定') || text.includes('剧集设定') || text.includes('设定'))) {
            console.log(`点击: ${text}`);
            await tabs[i].click();
            await sleep(2000);
            await page.screenshot({ path: `${SCREENSHOTS_DIR}/03-${text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.png`, fullPage: true });
          }
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (e) {
    console.log('基础信息交互失败:', e.message);
  }
  
  // 深度交互：剧集设定
  console.log('查找剧集设定...');
  try {
    const episodeSettingBtn = await page.locator('text=/剧集设定|Episode Setting/i').first();
    if (await episodeSettingBtn.count() > 0) {
      await episodeSettingBtn.click();
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/04-episode-setting-panel.png`, fullPage: true });
      
      // 查找子选项：梗概、设定、世界观
      const subTabs = await page.locator('text=/梗概|设定|世界观|Synopsis|Setting|Worldview/i').all();
      for (let i = 0; i < subTabs.length; i++) {
        try {
          const text = await subTabs[i].textContent();
          console.log(`点击: ${text}`);
          await subTabs[i].click();
          await sleep(2000);
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/05-${text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.png`, fullPage: true });
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (e) {
    console.log('剧集设定交互失败:', e.message);
  }
  
  // 深度交互：角色集
  console.log('查找角色集...');
  try {
    const characterBtn = await page.locator('text=/角色集|角色|Character/i').first();
    if (await characterBtn.count() > 0) {
      await characterBtn.click();
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/06-character-list.png`, fullPage: true });
      
      // 点击第一个角色查看详情
      const characterCards = await page.locator('[class*="character"], [data-testid*="character"], img[alt*="character"]').all();
      if (characterCards.length > 0) {
        try {
          await characterCards[0].click({ timeout: 5000 });
          await sleep(2000);
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/07-character-detail.png`, fullPage: true });
        } catch (e) {
          console.log('角色详情点击失败:', e.message);
        }
      }
    }
  } catch (e) {
    console.log('角色集交互失败:', e.message);
  }
  
  // 深度交互：规划中心
  console.log('查找规划中心...');
  try {
    const planningBtn = await page.locator('text=/规划中心|规划|Planning/i').first();
    if (await planningBtn.count() > 0) {
      await planningBtn.click();
      await sleep(2000);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/08-planning-center.png`, fullPage: true });
      
      // 查找封面、剧集信息
      const planningItems = await page.locator('text=/封面|剧集信息|Cover|Episode Info/i').all();
      for (let i = 0; i < planningItems.length; i++) {
        try {
          const text = await planningItems[i].textContent();
          console.log(`点击: ${text}`);
          await planningItems[i].click();
          await sleep(2000);
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/09-${text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.png`, fullPage: true });
        } catch (e) {
          // ignore
        }
      }
    }
  } catch (e) {
    console.log('规划中心交互失败:', e.message);
  }
  
  // 遍历所有可见的按钮和链接
  console.log('遍历所有交互元素...');
  try {
    const allButtons = await page.locator('button, a, [role="button"]').all();
    console.log(`找到 ${allButtons.length} 个交互元素`);
    
    for (let i = 0; i < Math.min(allButtons.length, 50); i++) {
      try {
        const text = await allButtons[i].textContent();
        const isVisible = await allButtons[i].isVisible();
        if (isVisible && text && text.trim().length > 0 && text.trim().length < 50) {
          console.log(`尝试点击: ${text.trim()}`);
          await allButtons[i].click({ timeout: 3000 });
          await sleep(1500);
          await page.screenshot({ path: `${SCREENSHOTS_DIR}/10-interaction-${i}-${text.trim().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').substring(0, 30)}.png`, fullPage: true });
        }
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    console.log('遍历交互元素失败:', e.message);
  }
  
  // 保存网络请求数据
  console.log('保存网络请求数据...');
  fs.writeFileSync(`${DATA_DIR}/requests.json`, JSON.stringify(requests, null, 2));
  fs.writeFileSync(`${DATA_DIR}/responses.json`, JSON.stringify(responses, null, 2));
  
  // 提取页面所有文本内容
  console.log('提取页面文本内容...');
  const pageText = await page.evaluate(() => {
    return document.body.innerText;
  });
  fs.writeFileSync(`${DATA_DIR}/page-text.txt`, pageText);
  
  // 提取所有表单字段
  console.log('提取表单字段...');
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
