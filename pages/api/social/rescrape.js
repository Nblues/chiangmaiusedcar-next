/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
// API: POST /api/social/rescrape
// Note: Facebook Graph API requires valid access tokens for automated re-scraping.
// Without tokens, Facebook will automatically scrape URLs when they are shared.
//
// Alternative approach: This API returns URLs that should be manually re-scraped at:
// https://developers.facebook.com/tools/debug/
//
// Security: Requires ?secret=... matching process.env.RESCRAPE_SECRET

import { getAllCars } from '../../../lib/shopify.mjs';

const SITE = 'https://www.chiangmaiusedcar.com';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const { secret, handle, limit } = req.query;
    if (!process.env.RESCRAPE_SECRET || secret !== process.env.RESCRAPE_SECRET) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    // Note: Facebook requires access tokens for automated re-scraping via Graph API.
    // This endpoint returns URLs for manual re-scraping instead.

    let targets = [];
    if (handle && typeof handle === 'string') {
      // Single car URL
      targets = [`${SITE}/car/${encodeURIComponent(handle)}`];
    } else {
      // All cars
      const cars = await getAllCars();
      const safeCars = Array.isArray(cars) ? cars : [];
      targets = safeCars
        .filter(c => c?.handle)
        .map(c => `${SITE}/car/${c.handle}`)
        .slice(0, Math.max(0, Math.min(Number(limit) || 9999, 9999)));
    }

    const results = [];
    for (let i = 0; i < targets.length; i++) {
      const url = targets[i];
      results.push({
        url,
        debugger_url: `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}`,
        note: 'Visit debugger_url to manually re-scrape, or share this URL on Facebook to trigger automatic scraping',
      });
    }

    return res.status(200).json({
      ok: true,
      count: results.length,
      message:
        'Facebook requires access tokens for automated re-scraping. URLs generated for manual re-scraping or natural sharing.',
      results,
      instructions: {
        automated:
          'To enable automated re-scraping, add FACEBOOK_GRAPH_ACCESS_TOKEN to environment variables',
        manual: 'Visit each debugger_url or share URLs on Facebook to trigger cache refresh',
        debugger_tool: 'https://developers.facebook.com/tools/debug/',
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error?.message || 'Unknown error' });
  }
}
