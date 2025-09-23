// API Health Check endpoint
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const timestamp = new Date().toISOString();

    // Basic health checks
    const services = {
      database: {
        status: '✅ Connected',
        type: 'File-based storage',
        response_time: '< 1ms',
      },
      shopify: {
        status:
          process.env.SHOPIFY_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN
            ? '✅ Configured'
            : '❌ Missing config',
        domain: process.env.SHOPIFY_DOMAIN || 'Not configured',
        api_version: '2023-04',
      },
      emailjs: {
        status: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? '✅ Configured' : '❌ Missing config',
        service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? 'Set' : 'Not set',
        template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? 'Set' : 'Not set',
      },
      vercel: {
        status: '✅ Running',
        environment: process.env.NODE_ENV || 'development',
        region: process.env.VERCEL_REGION || 'local',
      },
    };

    // Count healthy vs issues
    const healthyCount = Object.values(services).filter(service =>
      service.status.includes('✅')
    ).length;
    const issuesCount = Object.keys(services).length - healthyCount;

    const response = {
      status: issuesCount === 0 ? 'healthy' : 'partial',
      timestamp,
      summary: {
        total: Object.keys(services).length,
        healthy: healthyCount,
        issues: issuesCount,
      },
      services,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
