/**
 * Analytics API endpoint for performance monitoring
 * Receives and processes performance metrics from the client
 */

import { safeFetch } from '../../lib/safeFetch';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Accept both text/plain (from sendBeacon) and application/json
    let raw = req.body;
    let metrics = raw;
    if (typeof raw === 'string') {
      try {
        metrics = JSON.parse(raw);
      } catch {
        metrics = { _raw: raw };
      }
    }

    // Validate metrics data
    if (!metrics || typeof metrics !== 'object') {
      return res.status(400).json({ error: 'Invalid metrics data' });
    }

    // Add server-side timestamp
    const xfwd = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    const clientIp = Array.isArray(xfwd)
      ? xfwd[0]
      : xfwd || (req.socket && req.socket.remoteAddress) || 'unknown';

    const processedMetrics = {
      ...metrics,
      serverTimestamp: new Date().toISOString(),
      ip: clientIp,
      userAgent: req.headers['user-agent'],
    };

    // In production, you would send this to your analytics service
    // For now, we'll just log it (in development) or store it
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('📊 Performance Metrics:', JSON.stringify(processedMetrics, null, 2));
    } else {
      // In production, send to analytics service
      // Examples: Google Analytics, Vercel Analytics, DataDog, etc.
      await sendToAnalyticsService(processedMetrics);
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Metrics received',
      timestamp: processedMetrics.serverTimestamp,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Analytics API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process metrics',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '128kb',
    },
    externalResolver: true,
  },
  runtime: 'nodejs',
};

/**
 * Send metrics to external analytics service using safeFetch
 */
async function sendToAnalyticsService(metrics) {
  // Example integrations with timeout and error handling:

  // 1. Vercel Analytics (if using Vercel)
  if (process.env.VERCEL_ANALYTICS_ID) {
    try {
      await safeFetch('https://vitals.vercel-analytics.com/v1/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      });
    } catch (error) {
      // Safe fallback - don't block SSR
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Vercel Analytics error:', error.message);
      }
    }
  }

  // 2. Google Analytics 4 (Measurement Protocol)
  if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
    const gaEndpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`;

    try {
      await safeFetch(gaEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: metrics.clientId || 'anonymous',
          events: [
            {
              name: 'performance_metric',
              params: metrics,
            },
          ],
        }),
      });
    } catch (error) {
      // Safe fallback - don't block SSR
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Google Analytics error:', error.message);
      }
    }
  }

  // 3. Custom analytics service
  if (process.env.CUSTOM_ANALYTICS_ENDPOINT && process.env.CUSTOM_ANALYTICS_TOKEN) {
    try {
      await safeFetch(process.env.CUSTOM_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CUSTOM_ANALYTICS_TOKEN}`,
        },
        body: JSON.stringify(metrics),
      });
    } catch (error) {
      // Safe fallback - don't block SSR
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Custom Analytics error:', error.message);
      }
    }
  }

  // For now, just log in production (you can remove this when you have real analytics)
  if (process.env.NODE_ENV === 'production') {
    const isWebVitalWarning = metrics && metrics.type === 'web-vital-warning';
    const isCls = isWebVitalWarning && metrics.name === 'CLS';

    // eslint-disable-next-line no-console
    console.log('📊 Performance metrics logged:', {
      type: metrics.type,
      name: isWebVitalWarning ? metrics.name : undefined,
      value: isWebVitalWarning ? metrics.value : undefined,
      rating: isWebVitalWarning ? metrics.rating : undefined,
      threshold: isWebVitalWarning ? metrics.threshold : undefined,
      exceeded: isWebVitalWarning ? metrics.exceeded : undefined,
      clsLargestShiftTarget: isCls ? metrics.attribution?.largestShiftTarget : undefined,
      clsLargestShiftValue: isCls ? metrics.attribution?.largestShiftValue : undefined,
      timestamp: metrics.serverTimestamp,
      url: metrics.url,
    });
  }
}
