/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { readCarStatuses, readCarStatusesByIds } from '../../../lib/carStatusStore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Ensure no caching at browser or CDN for this API
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  try {
    const idsParam = Array.isArray(req.query.ids) ? req.query.ids[0] : req.query.ids;
    const wantIds =
      typeof idsParam === 'string' && idsParam.length > 0
        ? idsParam
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
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
