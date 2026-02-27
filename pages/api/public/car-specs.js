import { getCarSpecsByHandles } from '../../../lib/shopify.mjs';
import { rateLimit } from '../../../lib/rateLimit';

function safeDecode(value) {
  try {
    return decodeURIComponent(String(value));
  } catch {
    return String(value);
  }
}

function normalizeHandle(value) {
  const raw = safeDecode(value).trim().toLowerCase();
  // Shopify handles are typically lowercase a-z0-9-
  const safe = raw.replace(/[^a-z0-9-]/g, '');
  return safe.slice(0, 80);
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      res.status(405).json({ ok: false, error: 'method_not_allowed' });
      return;
    }

    // Basic abuse protection: rate limit by IP (protect Shopify upstream)
    const xfwd = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    const clientIp = Array.isArray(xfwd)
      ? xfwd[0]
      : xfwd || (req.socket && req.socket.remoteAddress) || 'unknown';

    const rl = await rateLimit(`public:car-specs:${clientIp}`, {
      limit: 300,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.ok) {
      res.setHeader('Retry-After', String(Math.ceil((rl.resetAt - Date.now()) / 1000)));
      res.status(429).json({ ok: false, error: 'too_many_requests' });
      return;
    }

    const raw = req?.query?.handles;
    const handlesRaw = Array.isArray(raw) ? raw.join(',') : String(raw || '');

    const requestedHandles = handlesRaw
      .split(',')
      .map(h => normalizeHandle(h))
      .filter(Boolean)
      .slice(0, 50);

    // Canonicalize for caching: unique + sorted handles.
    // This reduces cache-misses when clients send the same set in different orders.
    const canonicalHandles = Array.from(new Set(requestedHandles)).sort();

    if (requestedHandles.length === 0) {
      res.status(400).json({ ok: false, error: 'missing_handles' });
      return;
    }

    const requestedCsv = requestedHandles.join(',');
    const canonicalCsv = canonicalHandles.join(',');

    // Redirect GET requests to the canonical URL so the CDN caches one key.
    if (canonicalCsv && canonicalCsv !== requestedCsv) {
      const params = new URLSearchParams({ handles: canonicalCsv });
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      res.redirect(308, `/api/public/car-specs?${params.toString()}`);
      return;
    }

    const rawSpecs = await getCarSpecsByHandles(canonicalHandles);
    const specs = canonicalHandles.reduce((acc, h) => {
      acc[h] = (rawSpecs && rawSpecs[h]) || {};
      return acc;
    }, {});

    if (res?.setHeader) {
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    }

    res.status(200).json({ ok: true, specs });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('car-specs error:', error);
    }
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
}
