/**
 * Performance Metrics API
 * วัดประสิทธิภาพเว็บไซต์ - Response time, Memory usage, API latency
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const startTime = Date.now();

    // Collect performance metrics
    const metrics = {
      timestamp: new Date().toISOString(),
      server: {
        responseTime: Date.now() - startTime,
        uptime: process.uptime(),
        memoryUsage: {
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024),
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
      environment: process.env.NODE_ENV || 'development',
      region: process.env.VERCEL_REGION || 'local',
    };

    // Test API response time
    const apiStartTime = Date.now();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/health`,
        { timeout: 5000 }
      );
      metrics.api = {
        healthCheck: response.ok,
        responseTime: Date.now() - apiStartTime,
        status: response.status,
      };
    } catch (error) {
      metrics.api = {
        healthCheck: false,
        responseTime: Date.now() - apiStartTime,
        error: error.message,
      };
    }

    // Performance status
    const avgResponseTime = (metrics.server.responseTime + (metrics.api?.responseTime || 0)) / 2;
    metrics.status = {
      overall: avgResponseTime < 200 ? 'excellent' : avgResponseTime < 500 ? 'good' : 'poor',
      score: Math.max(0, 100 - Math.round(avgResponseTime / 10)),
    };

    res.status(200).json({
      success: true,
      metrics,
      message: 'Performance metrics retrieved successfully',
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve performance metrics',
    });
  }
}
