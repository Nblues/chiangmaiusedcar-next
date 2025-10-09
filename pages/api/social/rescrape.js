/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
// API: POST /api/social/rescrape
// Re-scrape Facebook Open Graph cache for one or all car detail URLs.
// Security: Requires ?secret=... matching process.env.RESCRAPE_SECRET
// Config:
//   - FACEBOOK_GRAPH_ACCESS_TOKEN (App/Page Access Token with permissions to scrape URLs)

import { getAllCars } from '../../../lib/shopify.mjs';

const SITE = 'https://www.chiangmaiusedcar.com';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const { secret, handle, limit } = req.query;
    if (!process.env.RESCRAPE_SECRET || secret !== process.env.RESCRAPE_SECRET) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const accessToken = process.env.FACEBOOK_GRAPH_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({
        ok: false,
        error: 'FACEBOOK_GRAPH_ACCESS_TOKEN is not configured',
      });
    }

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
      try {
        // Facebook Graph API re-scrape endpoint
        const api = `https://graph.facebook.com/?id=${encodeURIComponent(
          url
        )}&scrape=true&access_token=${encodeURIComponent(accessToken)}`;
        
        const r = await fetch(api, { method: 'POST' });
        const text = await r.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }
        results.push({ url, status: r.status, data });
      } catch (err) {
        results.push({ url, error: err?.message || String(err) });
      }

      // gentle throttle to avoid rate limits
      // eslint-disable-next-line no-await-in-loop
      await sleep(250);
    }

    return res.status(200).json({ ok: true, count: results.length, results });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error?.message || 'Unknown error' });
  }
}
