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
    let metrics = req.body;

    if (typeof metrics === 'string') {
      try {
        metrics = JSON.parse(metrics);
      } catch {
        return res.status(400).json({ error: 'Invalid metrics payload (not JSON)' });
      }
    }

    // Validate metrics data
    if (!metrics || typeof metrics !== 'object') {
      return res.status(400).json({ error: 'Invalid metrics data' });
    }

    // Add server-side timestamp
    const processedMetrics = {
      ...metrics,
      serverTimestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    // In production, you would send this to your analytics service
    // For now, we'll just log it (in development) or store it
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('📊 Performance Metrics:', JSON.stringify(processedMetrics, null, 2));
    }

    // Only forward to external analytics for the primary domain (avoid preview/staging)
    const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString();
    const isPrimaryDomain = /(^|\.)chiangmaiusedcar\.com$/i.test(host);

    if (isPrimaryDomain) {
      // Send to analytics service in background (completely non-blocking, no await)
      // We don't wait for this and don't care if it fails
      setImmediate(() => {
        sendToAnalyticsService(processedMetrics).catch(() => {
          // Silently ignore errors - analytics should never break the app
        });
      });
    }

    // Respond with success immediately (don't wait for external services)
    res.status(200).json({
      success: true,
      message: 'Metrics received',
      timestamp: processedMetrics.serverTimestamp,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Analytics API error:', error);

    // Still return success to not break client
    res.status(200).json({
      success: true,
      message: 'Metrics logged (with warnings)',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Send metrics to external analytics service using safeFetch
 * This runs in the background and should never throw errors
 */
async function sendToAnalyticsService(metrics) {
  // Skip if no analytics services are configured
  const hasAnalytics =
    process.env.VERCEL_ANALYTICS_ID ||
    (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) ||
    (process.env.CUSTOM_ANALYTICS_ENDPOINT && process.env.CUSTOM_ANALYTICS_TOKEN);

  if (!hasAnalytics) {
    // Just log in production if no analytics configured
    if (process.env.NODE_ENV === 'production') {
      // eslint-disable-next-line no-console
      console.log('📊 Metrics logged:', metrics.type, metrics.url);
    }
    return; // Exit early if no analytics configured
  }

  // All external calls wrapped in try-catch to prevent any errors from propagating
  const promises = [];

  // 1. Vercel Analytics (if using Vercel)
  if (process.env.VERCEL_ANALYTICS_ID) {
    promises.push(
      safeFetch('https://vitals.vercel-analytics.com/v1/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      }).catch(() => {}) // Silently ignore
    );
  }

  // 2. Google Analytics 4 (Measurement Protocol)
  if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
    const gaEndpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`;

    promises.push(
      safeFetch(gaEndpoint, {
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
      }).catch(() => {}) // Silently ignore
    );
  }

  // 3. Custom analytics service
  if (process.env.CUSTOM_ANALYTICS_ENDPOINT && process.env.CUSTOM_ANALYTICS_TOKEN) {
    promises.push(
      safeFetch(process.env.CUSTOM_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CUSTOM_ANALYTICS_TOKEN}`,
        },
        body: JSON.stringify(metrics),
      }).catch(() => {}) // Silently ignore
    );
  }

  // Fire all requests and don't wait for results
  if (promises.length > 0) {
    Promise.allSettled(promises).catch(() => {}); // Extra safety net
  }
}
