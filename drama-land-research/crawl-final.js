const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('[1/10] 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(120000);
  
  console.log('[2/10] 访问首页...');
  await page.goto('https://cn.drama.land', { waitUntil: 'networkidle2', timeout: 120000 });
  await sleep(5000);
  await page.screenshot({ path: 'screenshots-final/01-homepage.png', fullPage: true });
  console.log('✓ 截图: 01-homepage.png');
  
  console.log('[3/10] 查找登录按钮...');
  const pageContent = await page.content();
  fs.writeFileSync('data-final/homepage.html', pageContent);
  
  // 提取所有按钮文本
  const allButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).map((btn, idx) => ({
      idx,
      text: btn.textContent.trim(),
      tag: btn.tagName,
      visible: btn.offsetParent !== null
    }));
  });
  
  console.log('所有按钮:', JSON.stringify(allButtons.filter(b => b.visible).slice(0, 20), null, 2));
  
  const loginButtonIdx = allButtons.findIndex(b => 
    b.visible && (b.text.includes('登录') || b.text.includes('Login') || b.text.includes('注册'))
  );
  
  if (loginButtonIdx === -1) {
    console.log('❌ 未找到登录按钮');
    await browser.close();
    return;
  }
  
  console.log(`[4/10] 点击登录按钮 (索引 ${loginButtonIdx}: "${allButtons[loginButtonIdx].text}")...`);
  await page.evaluate((idx) => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    buttons[idx].click();
  }, loginButtonIdx);
  
  await sleep(5000);
  await page.screenshot({ path: 'screenshots-final/02-after-click-login.png', fullPage: true });
  console.log('✓ 截图: 02-after-click-login.png');
  
  console.log('[5/10] 查找输入框...');
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map((input, idx) => ({
      idx,
      type: input.type,
      placeholder: input.placeholder,
      name: input.name,
      visible: input.offsetParent !== null
    }));
  });
  
  console.log('所有输入框:', JSON.stringify(inputs.filter(i => i.visible), null, 2));
  
  const emailIdx = inputs.findIndex(i => i.visible && (i.type === 'email' || i.placeholder?.toLowerCase().includes('email')));
  const passwordIdx = inputs.findIndex(i => i.visible && i.type === 'password');
  
  if (emailIdx === -1 || passwordIdx === -1) {
    console.log('❌ 未找到输入框');
    await browser.close();
    return;
  }
  
  console.log(`[6/10] 填写邮箱 (索引 ${emailIdx})...`);
  await page.evaluate((idx) => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs[idx].focus();
    inputs[idx].value = '1181348296@qq.com';
    inputs[idx].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[idx].dispatchEvent(new Event('change', { bubbles: true }));
    inputs[idx].dispatchEvent(new Event('blur', { bubbles: true }));
  }, emailIdx);
  
  await sleep(1000);
  
  console.log(`[7/10] 填写密码 (索引 ${passwordIdx})...`);
  await page.evaluate((idx) => {
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs[idx].focus();
    inputs[idx].value = 'zxcvb123';
    inputs[idx].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[idx].dispatchEvent(new Event('change', { bubbles: true }));
    inputs[idx].dispatchEvent(new Event('blur', { bubbles: true }));
  }, passwordIdx);
  
  await sleep(2000);
  await page.screenshot({ path: 'screenshots-final/03-form-filled.png', fullPage: true });
  console.log('✓ 截图: 03-form-filled.png');
  
  console.log('[8/10] 查找提交按钮...');
  const submitButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map((btn, idx) => ({
      idx,
      text: btn.textContent.trim(),
      type: btn.type,
      visible: btn.offsetParent !== null
    }));
  });
  
  console.log('所有提交按钮:', JSON.stringify(submitButtons.filter(b => b.visible && b.text.includes('登录')), null, 2));
  
  const submitIdx = submitButtons.findIndex(b => 
    b.visible && b.text.includes('登录') && !b.text.includes('注册')
  );
  
  if (submitIdx === -1) {
    console.log('❌ 未找到提交按钮');
    await browser.close();
    return;
  }
  
  console.log(`[9/10] 点击提交按钮 (索引 ${submitIdx}: "${submitButtons[submitIdx].text}")...`);
  await page.evaluate((idx) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    buttons[idx].click();
  }, submitIdx);
  
  await sleep(10000);
  await page.screenshot({ path: 'screenshots-final/04-after-submit.png', fullPage: true });
  console.log('✓ 截图: 04-after-submit.png');
  
  console.log('[10/10] 访问画布页面...');
  await page.goto('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes', {
    waitUntil: 'networkidle2',
    timeout: 120000
  });
  await sleep(5000);
  await page.screenshot({ path: 'screenshots-final/05-canvas.png', fullPage: true });
  console.log('✓ 截图: 05-canvas.png');
  
  // 提取可点击元素
  const clickable = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a, [role="button"], [role="tab"]')).map((el, idx) => ({
      idx,
      text: el.textContent.trim().substring(0, 100),
      tag: el.tagName,
      visible: el.offsetParent !== null
    })).filter(el => el.visible && el.text);
  });
  
  fs.writeFileSync('data-final/canvas-clickable.json', JSON.stringify(clickable, null, 2));
  console.log(`✓ 提取 ${clickable.length} 个可点击元素`);
  
  // 输出关键元素
  const keywords = ['基础', '剧集', '角色', '规划', '设定', '梗概', '世界观'];
  console.log('\n关键元素:');
  clickable.forEach(el => {
    if (keywords.some(kw => el.text.includes(kw))) {
      console.log(`  [${el.idx}] ${el.text}`);
    }
  });
  
  console.log('\n✅ 完成！');
  await browser.close();
}

main().catch(err => {
  console.error('❌ 错误:', err);
  process.exit(1);
});
