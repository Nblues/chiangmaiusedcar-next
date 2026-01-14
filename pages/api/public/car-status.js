/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { readCarStatuses, readCarStatusesByIds } from '../../../lib/carStatusStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Reduce KV request quota usage by allowing short-lived CDN caching.
  // - Browser: effectively no cache (max-age=0)
  // - CDN (Vercel): cache briefly and serve stale while revalidating
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');

  try {
    const idsParam = Array.isArray(req.query.ids) ? req.query.ids[0] : req.query.ids;
    const wantIds =
      typeof idsParam === 'string' && idsParam.length > 0
        ? idsParam
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .sort()
        : null;

    let statuses = {};
    try {
      statuses = wantIds ? await readCarStatusesByIds(wantIds) : await readCarStatuses();
    } catch (kvError) {
      // Fallback: return empty statuses if KV fails (dev mode without KV)
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('KV unavailable, returning empty statuses:', kvError.message);
      }
      statuses = {};
    }

    const filtered = wantIds
      ? Object.fromEntries(wantIds.map(id => [id, statuses[id] || undefined]))
      : statuses;

    return res.status(200).json({ ok: true, statuses: filtered });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('car-status API error:', error);
    }
    return res.status(500).json({ ok: false, error: 'Failed to read statuses' });
  }
}
