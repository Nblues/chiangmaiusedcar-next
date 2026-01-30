/**
 * Cron Job - Warm /all-cars cache
 *
 * Goal: reduce Document request latency by ensuring the all-cars catalog
 * cache (Vercel KV) is warm before real users / Lighthouse hit the page.
 *
 * Protect with CRON_SECRET (Bearer) like other cron routes.
 */

import { getAllCars } from '../../../lib/shopify.mjs';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  const startedAt = Date.now();

  try {
    const cars = await getAllCars();
    const ms = Date.now() - startedAt;

    return res.status(200).json({
      success: true,
      warmed: {
        count: Array.isArray(cars) ? cars.length : 0,
        durationMs: ms,
      },
      message: 'All-cars cache warm completed',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Warm all-cars cache error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'unknown error',
      durationMs: Date.now() - startedAt,
    });
  }
}
