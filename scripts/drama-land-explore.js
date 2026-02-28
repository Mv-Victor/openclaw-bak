const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 启动浏览器 (headless)...');
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-gpu'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    bypassCSP: true,
    storageState: { cookies: [], origins: [] } // 清空状态
  });
  
  const page = await context.newPage();
  
  const screenshotDir = '/root/.openclaw/workspace-g/docs/drama-land-screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  try {
    // 1. 访问首页
    console.log('📝 访问 Drama.Land 首页...');
    await page.goto('https://cn.drama.land/zh-cn', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(screenshotDir, '00-homepage.png'), fullPage: true });
    console.log('✅ 首页截图完成');
    
    // 保存 HTML
    fs.writeFileSync(path.join(screenshotDir, '00-homepage.html'), await page.content());
    
    // 2. 点击登录按钮（右上角）
    console.log('🔑 点击登录按钮...');
    const loginButton = await page.$('button:has-text("注册/登录"), button:has-text("登录"), a:has-text("登录")');
    if (loginButton) {
      await loginButton.click();
      console.log('✅ 已点击登录按钮');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(screenshotDir, '01-login-modal.png'), fullPage: true });
    } else {
      console.log('⚠️ 未找到登录按钮，尝试导航栏...');
      // 尝试找导航中的登录链接
      const navLinks = await page.$$eval('nav a, nav button', links => 
        links.map(l => ({ text: l.textContent, href: l.href }))
      );
      console.log('导航链接:', navLinks);
    }
    
    // 3. 检查是否有登录弹窗
    const modalVisible = await page.isVisible('[role="dialog"], .modal, [aria-modal="true"]').catch(() => false);
    if (modalVisible) {
      console.log('✅ 检测到登录弹窗');
      
      // 查找邮箱输入框
      const emailInput = await page.$('input[type="email"], input[name="email"], input[placeholder*="邮"]');
      const passwordInput = await page.$('input[type="password"], input[name="password"], input[placeholder*="密"]');
      
      if (emailInput && passwordInput) {
        console.log('🔑 填写登录信息...');
        await emailInput.fill('1181348296@qq.com');
        await page.waitForTimeout(500);
        await passwordInput.fill('zxcvb123');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotDir, '02-login-filled.png'), fullPage: true });
        
        // 点击登录
        console.log('✅ 提交登录...');
        const submitButton = await page.$('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
        if (submitButton) {
          await submitButton.click();
        } else {
          await passwordInput.press('Enter');
        }
        
        // 等待登录
        console.log('⏳ 等待登录完成...');
        await page.waitForTimeout(8000);
        await page.screenshot({ path: path.join(screenshotDir, '03-after-login.png'), fullPage: true });
        console.log(`📍 登录后 URL: ${page.url()}`);
      }
    }
    
    // 4. 访问 Canvas 页面
    console.log('🎨 访问 Canvas 页面...');
    const canvasUrl = 'https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes';
    await page.goto(canvasUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(10000); // 等待 React 加载
    await page.screenshot({ path: path.join(screenshotDir, '04-canvas-full.png'), fullPage: true });
    console.log('✅ Canvas 页面截图完成');
    
    // 保存 Canvas HTML
    fs.writeFileSync(path.join(screenshotDir, '04-canvas-full.html'), await page.content());
    
    // 5. 提取 UI 结构信息
    console.log('📐 提取 UI 结构...');
    const uiStructure = await page.evaluate(() => {
      const info = {
        url: window.location.href,
        title: document.title,
        layout: {},
        nodes: [],
        styles: {}
      };
      
      // 查找主要布局区域
      const main = document.querySelector('main, [role="main"], .main, #main');
      if (main) {
        const rect = main.getBoundingClientRect();
        info.layout.main = {
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y
        };
      }
      
      // 查找左侧导航
      const leftNav = document.querySelector('aside:first-child, nav:first-child, [class*="sidebar"], [class*="nav"]');
      if (leftNav) {
        const rect = leftNav.getBoundingClientRect();
        const computed = window.getComputedStyle(leftNav);
        info.layout.leftNav = {
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
          position: computed.position,
          background: computed.background,
          boxShadow: computed.boxShadow,
          borderRadius: computed.borderRadius
        };
      }
      
      // 查找右侧面板
      const rightPanel = document.querySelector('aside:last-child, [class*="detail"], [class*="panel"], [class*="properties"]');
      if (rightPanel) {
        const rect = rightPanel.getBoundingClientRect();
        const computed = window.getComputedStyle(rightPanel);
        info.layout.rightPanel = {
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
          position: computed.position,
          background: computed.background,
          padding: computed.padding
        };
      }
      
      // 查找节点卡片
      const nodes = document.querySelectorAll('[class*="node"], [class*="card"], [data-node-id]');
      nodes.forEach((node, i) => {
        if (i < 5) { // 最多 5 个
          const rect = node.getBoundingClientRect();
          const computed = window.getComputedStyle(node);
          info.nodes.push({
            type: node.className,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            boxShadow: computed.boxShadow,
            borderRadius: computed.borderRadius,
            border: computed.border,
            background: computed.background
          });
        }
      });
      
      return info;
    });
    
    fs.writeFileSync(
      path.join(screenshotDir, '05-ui-structure.json'),
      JSON.stringify(uiStructure, null, 2)
    );
    console.log('✅ UI 结构已保存');
    
    // 6. 访问项目列表页
    console.log('📁 访问项目列表页...');
    await page.goto('https://cn.drama.land/zh-cn/projects', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(screenshotDir, '06-projects.png'), fullPage: true });
    console.log('✅ 项目列表页截图完成');
    
    // 7. 访问资产页
    console.log('🎬 访问资产页...');
    await page.goto('https://cn.drama.land/zh-cn/assets', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(screenshotDir, '07-assets.png'), fullPage: true });
    console.log('✅ 资产页截图完成');
    
    console.log('✅ 所有截图完成！');
    console.log(`📂 截图保存目录：${screenshotDir}`);
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({ path: path.join(screenshotDir, `error-${Date.now()}.png`) });
    fs.writeFileSync(
      path.join(screenshotDir, `error-${Date.now()}.json`),
      JSON.stringify({ error: error.message, stack: error.stack, url: page.url() }, null, 2)
    );
  } finally {
    console.log('👋 关闭浏览器...');
    await browser.close();
  }
})();
