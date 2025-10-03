// ฟังก์ชั่นแปลง Shopify CDN URL เป็น Cloudflare CDN URL
export const getCloudflareImageUrl = shopifyUrl => {
  if (!shopifyUrl) return '';

  // ถ้าเป็น URL ที่ผ่าน Cloudflare อยู่แล้วให้คืนค่าเดิม
  if (shopifyUrl.includes('imagedelivery.net') || shopifyUrl.includes('chiangmaiusedcar.com')) {
    return shopifyUrl;
  }

  // แปลง Shopify CDN URL เป็น path สำหรับ Cloudflare Worker
  try {
    const url = new URL(shopifyUrl);
    const path = url.pathname.replace('/s/files/1/', '');
    return `https://chiangmaiusedcar.com/cdn-proxy/${path}`;
  } catch (e) {
    console.error('Invalid URL:', shopifyUrl);
    return shopifyUrl;
  }
};

// ฟังก์ชั่นแปลง public folder URL เป็น Cloudflare CDN URL
export const getCloudflarePublicUrl = publicPath => {
  if (!publicPath) return '';

  // ถ้าเป็น URL เต็มให้คืนค่าเดิม
  if (publicPath.startsWith('http')) {
    return publicPath;
  }

  // แปลง public path เป็น Cloudflare CDN URL
  return `https://chiangmaiusedcar.com${publicPath}`;
};
