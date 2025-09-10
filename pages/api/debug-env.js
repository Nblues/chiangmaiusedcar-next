// Debug API to check environment variables in production
export default function handler(req, res) {
  // Only allow in development or specific conditions
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not allowed in production' });
  }

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    SHOPIFY_DOMAIN: process.env.SHOPIFY_DOMAIN ? '✅ SET' : '❌ NOT SET',
    SHOPIFY_STOREFRONT_TOKEN: process.env.SHOPIFY_STOREFRONT_TOKEN ? '✅ SET' : '❌ NOT SET',
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      ? '✅ SET'
      : '❌ NOT SET',
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      ? '✅ SET'
      : '❌ NOT SET',
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      ? '✅ SET'
      : '❌ NOT SET',
    SITE_URL: process.env.SITE_URL ? '✅ SET' : '❌ NOT SET',
  };

  // For NEXT_PUBLIC_ variables, also check on client side
  const clientVars = {
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'NOT SET',
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'NOT SET',
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'SET' : 'NOT SET',
  };

  res.status(200).json({
    envVars,
    clientVars,
    timestamp: new Date().toISOString(),
  });
}
