/**
 * Test Environment Variables API
 * GET /api/test-env
 * ใช้สำหรับตรวจสอบว่า env vars ถูกโหลดหรือไม่
 */

export default function handler(req, res) {
  // Never expose environment inspection endpoints in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  const hasShopifyDomain = !!process.env.SHOPIFY_DOMAIN;
  const hasStorefrontToken = !!process.env.SHOPIFY_STOREFRONT_TOKEN;
  const hasShopifyApiVersion = !!process.env.SHOPIFY_API_VERSION;

  const hasAltStorefrontApi = !!(process.env.Storefront_API || process.env.STOREFRONT_API);
  const hasAltApiShopify = !!(process.env.API_shopify || process.env.API_SHOPIFY);

  const hasShopifyAdminDomain = !!process.env.SHOPIFY_ADMIN_DOMAIN;
  const hasShopifyAdminToken = !!process.env.SHOPIFY_ADMIN_TOKEN;
  const hasShopifyAdminApiVersion = !!process.env.SHOPIFY_ADMIN_API_VERSION;

  const hasAdmin = !!process.env.ADMIN_USERNAME;
  const hasPassword = !!process.env.ADMIN_PASSWORD;
  const hasSecret = !!process.env.SESSION_SECRET;

  // ไม่แสดงค่าจริง เพื่อความปลอดภัย
  const result = {
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    variables: {
      ADMIN_USERNAME: hasAdmin ? '✅ Set' : '❌ Not set',
      ADMIN_PASSWORD: hasPassword ? '✅ Set' : '❌ Not set',
      SESSION_SECRET: hasSecret ? '✅ Set' : '❌ Not set',

      SHOPIFY_DOMAIN: hasShopifyDomain ? '✅ Set' : '❌ Not set',
      SHOPIFY_STOREFRONT_TOKEN: hasStorefrontToken ? '✅ Set' : '❌ Not set',
      SHOPIFY_API_VERSION: hasShopifyApiVersion ? '✅ Set' : '❌ Not set',

      Storefront_API: hasAltStorefrontApi ? '✅ Set' : '❌ Not set',
      API_shopify: hasAltApiShopify ? '✅ Set' : '❌ Not set',

      SHOPIFY_ADMIN_DOMAIN: hasShopifyAdminDomain ? '✅ Set' : '❌ Not set',
      SHOPIFY_ADMIN_TOKEN: hasShopifyAdminToken ? '✅ Set' : '❌ Not set',
      SHOPIFY_ADMIN_API_VERSION: hasShopifyAdminApiVersion ? '✅ Set' : '❌ Not set',
    },
    // แสดง 3 ตัวอักษรแรกเพื่อยืนยัน
    preview: {
      username: process.env.ADMIN_USERNAME
        ? process.env.ADMIN_USERNAME.substring(0, 3) + '...'
        : 'none',
      usernameLength: process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME.length : 0,
      secretLength: process.env.SESSION_SECRET ? process.env.SESSION_SECRET.length : 0,
      storefrontTokenLength: process.env.SHOPIFY_STOREFRONT_TOKEN
        ? process.env.SHOPIFY_STOREFRONT_TOKEN.length
        : 0,
      storefrontApiLength: process.env.Storefront_API ? process.env.Storefront_API.length : 0,
      apiShopifyLength: process.env.API_shopify ? process.env.API_shopify.length : 0,
      adminTokenLength: process.env.SHOPIFY_ADMIN_TOKEN
        ? process.env.SHOPIFY_ADMIN_TOKEN.length
        : 0,
    },
  };

  return res.status(200).json(result);
}
