const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const SCREENSHOTS_DIR = './screenshots-pipeline';
const DATA_DIR = './data-pipeline';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 从第一次成功登录的数据中提取的 token
const AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjJjMjdhZmY1YzlkNGU1MzVkNWRjMmMwNWM1YTE2N2FlMmY1NjgxYzIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHJhbWEtbGFuZC1zdHVkaW8iLCJhdWQiOiJkcmFtYS1sYW5kLXN0dWRpbyIsImF1dGhfdGltZSI6MTc3MjM0MzM2OCwidXNlcl9pZCI6IkZMUDZZZzBCS1poTzVmZHk5V3J6Z2FRS0E4RjIiLCJzdWIiOiJGTFA2WWcwQktaaE81ZmR5OVdyemdhUUtBOEYyIiwiaWF0IjoxNzcyMzQzMzY4LCJleHAiOjE3NzIzNDY5NjgsImVtYWlsIjoiMTE4MTM0ODI5NkBxcS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiMTE4MTM0ODI5NkBxcS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.WlisyoG9m5XhthJQ34MhCHHOppC3u-olTJPdXyclNFzQ_KLt_VZscyDlkTMzvAFFEaOF147XGDdSP37i5kNV5mc49f98eoDsEnRGEap-yZ7zxbH7DPOyPxp-wz3sqjkHtwoGG1-gwM6nKpTBcpPCk4IpJwv6PfB43X2INQM4L4Gl5WQpnwKI0db48fWJCk-lwzf9GtmdxZx6zhRmTLbZe1L57-WlLnVr9ChUjom8qqzHvI4E0NBFuie_Jt-jsFtGIajqzzMdahOC5DtbFQu8QY6vVyJTBEGuZJ5jim4MXqgcc-jO2-xbI6GQn5ybbiuJgp1XQGOak2HL7eNzib4O2Q';

async function main() {
  console.log('[Step 1] 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(120000);
  
  console.log('[Step 2] 设置认证 Cookie...');
  await page.goto('https://cn.drama.land');
  
  // 设置 localStorage 中的 Firebase token
  await page.evaluate((token) => {
    localStorage.setItem('firebase:authUser:AIzaSyATZ4HbOMgbFVPH4e9SAzGT0ph9kv77Hak:[DEFAULT]', JSON.stringify({
      uid: 'FLP6Yg0BKZhO5fdy9WrzgaQKA8F2',
      email: '1181348296@qq.com',
      stsTokenManager: {
        accessToken: token,
        expirationTime: Date.now() + 3600000
      }
    }));
  }, AUTH_TOKEN);
  
  console.log('[Step 3] 访问画布页面（已认证）...');
  await page.goto('https://cn.drama.land/zh-cn/canvas?projectId=bfd3f19f-8bd8-403b-8408-e016367d5c9b&seriesId=a875a8a4-e879-4e37-80ff-e3ebedb744f0&projectType=multi_episodes', {
    waitUntil: 'networkidle2',
    timeout: 120000
  });
  await sleep(5000);
  await page.screenshot({ path: `${SCREENSHOTS_DIR}/step6-canvas-authenticated.png`, fullPage: true });
  console.log('✓ 画布页面（已认证）截图: step6-canvas-authenticated.png');
  
  console.log('[Step 4] 提取所有可点击元素...');
  const clickableElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, a, [role="button"], [role="tab"], div[class*="cursor-pointer"], span[class*="cursor-pointer"]'));
    return elements.map((el, idx) => {
      const rect = el.getBoundingClientRect();
      return {
        index: idx,
        text: el.textContent.trim().substring(0, 100),
        tag: el.tagName,
        className: el.className.substring(0, 200),
        id: el.id,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        visible: rect.width > 0 && rect.height > 0 && rect.x >= 0 && rect.y >= 0,
        position: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) }
      };
    }).filter(el => el.visible && el.text.length > 0);
  });
  
  console.log(`找到 ${clickableElements.length} 个可点击元素`);
  fs.writeFileSync(`${DATA_DIR}/step7-canvas-authenticated-elements.json`, JSON.stringify(clickableElements, null, 2));
  
  // 输出关键元素
  console.log('\n关键可点击元素:');
  const keywords = ['基础', '剧集', '角色', '规划', '设定', '梗概', '世界观', '封面'];
  clickableElements.forEach(el => {
    if (keywords.some(kw => el.text.includes(kw))) {
      console.log(`  [${el.index}] ${el.text} (${el.tag}, pos: ${el.position.x},${el.position.y})`);
    }
  });
  
  console.log('\n[完成] 已认证状态下的元素提取完成');
  await browser.close();
}

main().catch(console.error);
