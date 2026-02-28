// 使用 npx playwright 执行，需要安装依赖
// 先检查并安装 playwright
const { execSync } = require('child_process');
try {
  execSync('npm list playwright', { stdio: 'ignore' });
} catch (e) {
  console.log('📦 安装 playwright...');
  execSync('npm install playwright', { stdio: 'inherit', cwd: '/root/.openclaw/workspace-g' });
}

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 启动浏览器...');
  
  const browser = await chromium.launch({
    headless: true, // 无头模式（服务器环境）
    args: ['--window-size=1920,1080']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  // 截图保存目录
  const screenshotDir = '/root/.openclaw/workspace-g/docs/drama-land-screenshots';
  const fs = require('fs');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  try {
    // 1. 登录页面
    console.log('📝 访问登录页面...');
    await page.goto('https://cn.drama.land/zh-cn/auth/login', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(screenshotDir, '01-login.png'), fullPage: true });
    
    // 2. 填写登录表单
    console.log('🔑 填写登录信息...');
    await page.fill('input[type="email"], input[name="email"]', '1181348296@qq.com');
    await page.fill('input[type="password"], input[name="password"]', 'zxcvb123');
    await page.screenshot({ path: path.join(screenshotDir, '02-login-filled.png'), fullPage: true });
    
    // 3. 点击登录按钮
    console.log('✅ 提交登录...');
    await page.click('button[type="submit"], button:has-text("登录"), button:has-text("Login")');
    await page.waitForTimeout(3000); // 等待登录完成
    await page.screenshot({ path: path.join(screenshotDir, '03-logged-in.png'), fullPage: true });
    
    // 4. 访问 Canvas 页面
    console.log('🎨 访问 Canvas 页面...');
    const canvasUrl = 'https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes';
    await page.goto(canvasUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000); // 等待页面加载
    await page.screenshot({ path: path.join(screenshotDir, '04-canvas-full.png'), fullPage: true });
    
    // 5. 截图左侧导航栏
    console.log('📍 截图左侧导航栏...');
    const leftNav = await page.$('aside, nav, [class*="sidebar"], [class*="nav"], [class*="left"]');
    if (leftNav) {
      await leftNav.screenshot({ path: path.join(screenshotDir, '05-left-nav.png') });
    }
    
    // 6. 截图右侧 DetailPanel
    console.log('📋 截图右侧 DetailPanel...');
    const rightPanel = await page.$('aside[class*="right"], [class*="detail"], [class*="panel"], [class*="properties"]');
    if (rightPanel) {
      await rightPanel.screenshot({ path: path.join(screenshotDir, '06-right-panel.png') });
    }
    
    // 7. 截图节点卡片
    console.log('📦 截图节点卡片...');
    const nodeCard = await page.$('[class*="node"], [class*="card"], [data-node-id]');
    if (nodeCard) {
      await nodeCard.screenshot({ path: path.join(screenshotDir, '07-node-card.png') });
    }
    
    // 8. 获取关键 CSS 样式
    console.log('💅 提取 CSS 样式...');
    const cssStyles = await page.evaluate(() => {
      const styles = {};
      
      // 左侧导航
      const leftNav = document.querySelector('aside, nav, [class*="sidebar"]');
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
      const nodeCard = document.querySelector('[class*="node"], [class*="card"]');
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
      const rightPanel = document.querySelector('aside[class*="right"], [class*="detail"], [class*="panel"]');
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
    
    // 保存 CSS 样式到文件
    fs.writeFileSync(
      path.join(screenshotDir, 'css-styles.json'),
      JSON.stringify(cssStyles, null, 2)
    );
    console.log('✅ CSS 样式已保存');
    
    // 9. 访问首页
    console.log('🏠 访问首页...');
    await page.goto('https://cn.drama.land/zh-cn', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '08-homepage.png'), fullPage: true });
    
    // 10. 访问存档页
    console.log('📁 访问存档页...');
    await page.goto('https://cn.drama.land/zh-cn/archive', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '09-archive.png'), fullPage: true });
    
    // 11. 访问资产页
    console.log('🎬 访问资产页...');
    await page.goto('https://cn.drama.land/zh-cn/assets', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(screenshotDir, '10-assets.png'), fullPage: true });
    
    console.log('✅ 所有截图完成！');
    console.log(`📂 截图保存目录：${screenshotDir}`);
    
    // 输出报告
    const report = `
# Drama.Land UI 设计参考报告

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
    console.error('❌ 错误:', error);
    await page.screenshot({ path: path.join(screenshotDir, 'error.png') });
  } finally {
    console.log('👋 关闭浏览器...');
    await browser.close();
  }
})();
