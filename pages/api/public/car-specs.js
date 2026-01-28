import { getCarSpecsByHandles } from '../../../lib/shopify.mjs';

function safeDecode(value) {
  try {
    return decodeURIComponent(String(value));
  } catch {
    return String(value);
  }
}

function normalizeHandle(value) {
  const s = safeDecode(value).trim();
  return s;
}

export default async function handler(req, res) {
  try {
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
    if (req.method === 'GET' && canonicalCsv && canonicalCsv !== requestedCsv) {
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
