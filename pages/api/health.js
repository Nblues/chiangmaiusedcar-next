export default function handler(req, res) {
  try {
    // ตรวจสอบ environment variables สำคัญ
    const requiredEnvs = {
      SHOPIFY_DOMAIN: process.env.SHOPIFY_DOMAIN,
      SHOPIFY_STOREFRONT_TOKEN: process.env.SHOPIFY_STOREFRONT_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
    };

    const missingEnvs = Object.entries(requiredEnvs)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      shopify_connected: !!(process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN),
      missing_envs: missingEnvs,
    };

    if (missingEnvs.length > 0) {
      status.status = 'degraded';
      return res.status(200).json(status);
    }

    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
}
