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
  
  // 截图保存目录
  const screenshotDir = '/root/.openclaw/workspace-g/docs/drama-land-screenshots';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  try {
    // 1. 访问登录页面
    console.log('📝 访问登录页面...');
    await page.goto('https://cn.drama.land/zh-cn/auth/login', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '01-login.png'), fullPage: true });
    console.log('✅ 登录页面截图完成');
    
    // 2. 关闭可能的遮罩层/弹窗
    console.log('🚫 关闭遮罩层/弹窗...');
    await page.evaluate(() => {
      // 关闭常见遮罩层
      const selectors = [
        '.modal', '.overlay', '.popup', '.dialog', '.ant-modal',
        '[class*="modal"]', '[class*="overlay"]', '[class*="popup"]',
        '[aria-modal="true"]', '[role="dialog"]'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.display = 'none';
          el.remove();
        });
      });
    });
    await page.waitForTimeout(1000);
    
    // 3. 填写登录表单
    console.log('🔑 填写登录信息...');
    
    // 尝试多种选择器
    const emailSelector = 'input[type="email"], input[name="email"], input[placeholder*="邮箱"], input[placeholder*="email"]';
    const passwordSelector = 'input[type="password"], input[name="password"], input[placeholder*="密码"], input[placeholder*="password"]';
    
    const emailInput = await page.$(emailSelector);
    const passwordInput = await page.$(passwordSelector);
    
    if (!emailInput || !passwordInput) {
      console.log('⚠️ 未找到登录表单，截图查看...');
      await page.screenshot({ path: path.join(screenshotDir, '01-login-debug.png'), fullPage: true });
      const html = await page.content();
      fs.writeFileSync(path.join(screenshotDir, 'login-page.html'), html);
      throw new Error('未找到登录表单输入框');
    }
    
    await emailInput.fill('1181348296@qq.com');
    await passwordInput.fill('zxcvb123');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '02-login-filled.png'), fullPage: true });
    console.log('✅ 登录信息填写完成');
    
    // 4. 点击登录按钮
    console.log('✅ 提交登录...');
    const loginButton = await page.$('button[type="submit"], button:has-text("登录"), button:has-text("Login"), input[type="submit"]');
    if (loginButton) {
      await loginButton.click();
    } else {
      console.log('⚠️ 未找到登录按钮，尝试回车提交...');
      await passwordInput.press('Enter');
    }
    
    // 等待登录完成
    console.log('⏳ 等待登录完成...');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(screenshotDir, '03-logged-in.png'), fullPage: true });
    
    // 检查是否登录成功（通过 URL 或页面元素）
    const currentUrl = page.url();
    console.log(`📍 当前 URL: ${currentUrl}`);
    
    if (currentUrl.includes('/auth/login') || currentUrl.includes('/login')) {
      console.log('⚠️ 可能登录失败，仍在登录页');
      // 尝试再次登录
      console.log('🔄 尝试再次登录...');
      await page.waitForTimeout(2000);
      const loginButton2 = await page.$('button[type="submit"], button:has-text("登录")');
      if (loginButton2) {
        await loginButton2.click();
        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(screenshotDir, '03-logged-in-retry.png'), fullPage: true });
      }
    }
    
    // 5. 访问 Canvas 页面
    console.log('🎨 访问 Canvas 页面...');
    const canvasUrl = 'https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes';
    await page.goto(canvasUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(8000); // 等待页面加载
    await page.screenshot({ path: path.join(screenshotDir, '04-canvas-full.png'), fullPage: true });
    console.log('✅ Canvas 页面截图完成');
    
    // 关闭可能的遮罩层
    await page.evaluate(() => {
      document.querySelectorAll('.modal, .overlay, .popup, .ant-modal, [class*="modal"], [aria-modal="true"]').forEach(el => {
        el.style.display = 'none';
      });
    });
    
    // 6. 截图左侧导航栏
    console.log('📍 截图左侧导航栏...');
    const leftNavSelectors = ['aside', 'nav', '[class*="sidebar"]', '[class*="nav"]', '[class*="left"]', '[class*="drawer"]'];
    let leftNav = null;
    for (const sel of leftNavSelectors) {
      leftNav = await page.$(sel);
      if (leftNav) break;
    }
    if (leftNav) {
      await leftNav.screenshot({ path: path.join(screenshotDir, '05-left-nav.png') });
      console.log('✅ 左侧导航栏截图完成');
    } else {
      console.log('⚠️ 未找到左侧导航栏');
    }
    
    // 7. 截图右侧 DetailPanel
    console.log('📋 截图右侧 DetailPanel...');
    const rightPanelSelectors = ['aside[class*="right"]', '[class*="detail"]', '[class*="panel"]', '[class*="properties"]', '[class*="inspector"]'];
    let rightPanel = null;
    for (const sel of rightPanelSelectors) {
      rightPanel = await page.$(sel);
      if (rightPanel) break;
    }
    if (rightPanel) {
      await rightPanel.screenshot({ path: path.join(screenshotDir, '06-right-panel.png') });
      console.log('✅ 右侧 DetailPanel 截图完成');
    } else {
      console.log('⚠️ 未找到右侧 DetailPanel');
    }
    
    // 8. 截图节点卡片
    console.log('📦 截图节点卡片...');
    const nodeSelectors = ['[class*="node"]', '[class*="card"]', '[data-node-id]', '[class*="workflow-node"]'];
    let nodeCard = null;
    for (const sel of nodeSelectors) {
      nodeCard = await page.$(sel);
      if (nodeCard) break;
    }
    if (nodeCard) {
      await nodeCard.screenshot({ path: path.join(screenshotDir, '07-node-card.png') });
      console.log('✅ 节点卡片截图完成');
    } else {
      console.log('⚠️ 未找到节点卡片');
    }
    
    // 9. 获取关键 CSS 样式
    console.log('💅 提取 CSS 样式...');
    const cssStyles = await page.evaluate(() => {
      const styles = {};
      
      // 左侧导航
      const leftNav = document.querySelector('aside, nav, [class*="sidebar"], [class*="nav"], [class*="left"], [class*="drawer"]');
      if (leftNav) {
        const computed = window.getComputedStyle(leftNav);
        styles.leftNav = {
          width: computed.width,
          background: computed.background,
          boxShadow: computed.boxShadow,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
        };
      }
      
      // 节点卡片
      const nodeCard = document.querySelector('[class*="node"], [class*="card"], [data-node-id]');
      if (nodeCard) {
        const computed = window.getComputedStyle(nodeCard);
        styles.nodeCard = {
          boxShadow: computed.boxShadow,
          borderRadius: computed.borderRadius,
          border: computed.border,
          background: computed.background,
          padding: computed.padding,
        };
      }
      
      // 右侧面板
      const rightPanel = document.querySelector('aside[class*="right"], [class*="detail"], [class*="panel"], [class*="properties"], [class*="inspector"]');
      if (rightPanel) {
        const computed = window.getComputedStyle(rightPanel);
        styles.rightPanel = {
          width: computed.width,
          padding: computed.padding,
          background: computed.background,
        };
      }
      
      return styles;
    });
    
    fs.writeFileSync(
      path.join(screenshotDir, 'css-styles.json'),
      JSON.stringify(cssStyles, null, 2)
    );
    console.log('✅ CSS 样式已保存');
    
    // 10. 访问首页
    console.log('🏠 访问首页...');
    await page.goto('https://cn.drama.land/zh-cn', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '08-homepage.png'), fullPage: true });
    console.log('✅ 首页截图完成');
    
    // 11. 访问存档页
    console.log('📁 访问存档页...');
    await page.goto('https://cn.drama.land/zh-cn/archive', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '09-archive.png'), fullPage: true });
    console.log('✅ 存档页截图完成');
    
    // 12. 访问资产页
    console.log('🎬 访问资产页...');
    await page.goto('https://cn.drama.land/zh-cn/assets', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '10-assets.png'), fullPage: true });
    console.log('✅ 资产页截图完成');
    
    console.log('✅ 所有截图完成！');
    console.log(`📂 截图保存目录：${screenshotDir}`);
    
    // 输出报告
    const report = `# Drama.Land UI 设计参考报告

**截图时间**: ${new Date().toISOString()}
**截图目录**: ${screenshotDir}

## 截图清单

| 文件 | 描述 |
|------|------|
| 01-login.png | 登录页面 |
| 02-login-filled.png | 登录表单填写后 |
| 03-logged-in.png | 登录后主页 |
| 04-canvas-full.png | Canvas 画布完整页面 |
| 05-left-nav.png | 左侧导航栏特写 |
| 06-right-panel.png | 右侧 DetailPanel 特写 |
| 07-node-card.png | 节点卡片特写 |
| 08-homepage.png | 首页 |
| 09-archive.png | 存档页 |
| 10-assets.png | 资产页 |

## CSS 关键样式

\`\`\`json
${JSON.stringify(cssStyles, null, 2)}
\`\`\`

## UI 设计要点

### 左侧导航栏
- 宽度：${cssStyles.leftNav?.width || '待确认'}
- 背景：${cssStyles.leftNav?.background || '待确认'}
- 阴影：${cssStyles.leftNav?.boxShadow || '待确认'}

### 节点卡片
- 阴影：${cssStyles.nodeCard?.boxShadow || '待确认'}
- 圆角：${cssStyles.nodeCard?.borderRadius || '待确认'}
- 边框：${cssStyles.nodeCard?.border || '待确认'}

### 右侧 DetailPanel
- 宽度：${cssStyles.rightPanel?.width || '待确认'}
- 内边距：${cssStyles.rightPanel?.padding || '待确认'}
`;
    
    fs.writeFileSync(
      path.join(screenshotDir, 'ui-design-report.md'),
      report
    );
    console.log('✅ 报告已生成');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({ path: path.join(screenshotDir, `error-${Date.now()}.png`) });
    
    // 保存调试信息
    const debugInfo = {
      error: error.message,
      stack: error.stack,
      url: page.url(),
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(screenshotDir, `error-debug-${Date.now()}.json`),
      JSON.stringify(debugInfo, null, 2)
    );
  } finally {
    console.log('👋 关闭浏览器...');
    await browser.close();
  }
})();
