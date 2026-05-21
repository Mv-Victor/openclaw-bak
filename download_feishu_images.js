const fs = require('fs');
const path = require('path');

const appId = 'cli_a911acc747381bdf';
const appSecret = 'IJOkyQFspOE87NboV65JQdpg4UD181UI';

async function getTenantToken() {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  });
  const data = await response.json();
  return data.tenant_access_token;
}

async function downloadImage(token, imageKey, outputPath) {
  const response = await fetch(`https://open.feishu.cn/open-apis/im/v1/images/${imageKey}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to download image: ${response.status} ${text}`);
  }
  
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

(async () => {
  const token = await getTenantToken();
  const images = [
    { key: 'img_v3_02vq_ff4f66ae-dea2-453b-835d-6452bd1163fg', file: '1.jpg' },
    { key: 'img_v3_02vq_2c981035-6b96-4630-8104-ecb30ac9daeg', file: '2.jpg' }
  ];
  
  const outputDir = '/root/dreamX/doc/sale/flight-ticket-cheap-times';
  
  for (const img of images) {
    try {
      await downloadImage(token, img.key, path.join(outputDir, img.file));
      console.log(`Downloaded ${img.file}`);
    } catch (err) {
      console.error(`Failed to download ${img.file}:`, err.message);
    }
  }
})();
