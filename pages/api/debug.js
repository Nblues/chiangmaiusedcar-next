export default function handler(req, res) {
  try {
    const debug = {
      method: req.method,
      url: req.url,
      headers: Object.keys(req.headers || {}),
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        hasShopifyDomain: !!process.env.SHOPIFY_DOMAIN,
        hasShopifyToken: !!process.env.SHOPIFY_STOREFRONT_TOKEN,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json({ status: 'ok', debug });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack,
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
