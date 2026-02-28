const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 启动浏览器...');
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    bypassCSP: true
  });
  
  const page = await context.newPage();
  
  const screenshotDir = '/root/.openclaw/workspace-g/docs/drama-land-screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  try {
    // 1. 访问登录页面 - 不等待 networkidle
    console.log('📝 访问登录页面...');
    await page.goto('https://cn.drama.land/zh-cn/auth/login', { 
      waitUntil: 'commit',
      timeout: 30000 
    });
    
    // 等待页面稳定
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(screenshotDir, '01-login.png'), fullPage: true });
    console.log('✅ 登录页面截图完成');
    
    // 保存 HTML 用于调试
    const html = await page.content();
    fs.writeFileSync(path.join(screenshotDir, 'login-page.html'), html);
    console.log('✅ HTML 已保存');
    
    // 打印页面标题和 URL
    const title = await page.title();
    console.log(`📍 页面标题：${title}`);
    console.log(`📍 当前 URL: ${page.url()}`);
    
    // 2. 尝试找到登录表单
    console.log('🔍 查找登录表单...');
    
    // 列出所有输入框
    const inputs = await page.$$eval('input', inputs => 
      inputs.map(i => ({
        type: i.type,
        name: i.name,
        placeholder: i.placeholder,
        class: i.className
      }))
    );
    console.log('📋 找到的输入框:', JSON.stringify(inputs, null, 2));
    
    // 列出所有按钮
    const buttons = await page.$$eval('button, input[type="submit"]', btns => 
      btns.map(b => ({
        text: b.textContent,
        type: b.type,
        class: b.className
      }))
    );
    console.log('📋 找到的按钮:', JSON.stringify(buttons, null, 2));
    
    // 3. 尝试登录
    const emailSelectors = ['input[type="email"]', 'input[name="email"]', 'input[placeholder*="邮"]', 'input[placeholder*="邮"]', '#email'];
    const passwordSelectors = ['input[type="password"]', 'input[name="password"]', 'input[placeholder*="密"]', '#password'];
    
    let emailInput = null;
    let passwordInput = null;
    
    for (const sel of emailSelectors) {
      emailInput = await page.$(sel);
      if (emailInput) {
        console.log(`✅ 找到邮箱输入框：${sel}`);
        break;
      }
    }
    
    for (const sel of passwordSelectors) {
      passwordInput = await page.$(sel);
      if (passwordInput) {
        console.log(`✅ 找到密码输入框：${sel}`);
        break;
      }
    }
    
    if (!emailInput || !passwordInput) {
      console.log('⚠️ 未找到标准登录表单，尝试通用选择器...');
      emailInput = await page.$('input[type="text"], input:not([type])');
      passwordInput = await page.$('input[type="password"]');
    }
    
    if (emailInput && passwordInput) {
      console.log('🔑 填写登录信息...');
      await emailInput.fill('1181348296@qq.com');
      await page.waitForTimeout(500);
      await passwordInput.fill('zxcvb123');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotDir, '02-login-filled.png'), fullPage: true });
      console.log('✅ 登录信息填写完成');
      
      // 点击登录按钮
      console.log('✅ 提交登录...');
      const loginButton = await page.$('button[type="submit"], button:has-text("登录"), button:has-text("Login"), input[type="submit"]');
      if (loginButton) {
        await loginButton.click();
        console.log('✅ 点击登录按钮');
      } else {
        console.log('⚠️ 未找到登录按钮，尝试回车...');
        await passwordInput.press('Enter');
      }
      
      // 等待导航
      console.log('⏳ 等待登录完成...');
      try {
        await page.waitForNavigation({ waitUntil: 'commit', timeout: 15000 });
        console.log('✅ 导航完成');
      } catch (e) {
        console.log('⚠️ 等待导航超时，可能已登录或使用 SPA 路由');
      }
      
      await page.waitForTimeout(5000);
      await page.screenshot({ path: path.join(screenshotDir, '03-logged-in.png'), fullPage: true });
      console.log(`📍 登录后 URL: ${page.url()}`);
      
      // 检查是否仍在登录页
      if (page.url().includes('/login') || page.url().includes('/auth')) {
        console.log('⚠️ 可能登录失败，仍在登录页');
      } else {
        console.log('✅ 登录成功！');
      }
    } else {
      console.log('❌ 未找到登录表单输入框');
    }
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({ path: path.join(screenshotDir, `error-${Date.now()}.png`) });
  } finally {
    console.log('👋 关闭浏览器...');
    await browser.close();
  }
})();
