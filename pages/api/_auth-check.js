// Simple endpoint to verify API authentication headers work
import { verifyApiAuth, getApiAuthEnvState, canonicalizeForSignature } from '../../lib/apiAuth';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const result = verifyApiAuth(req, { requireHmac: true });
  if (!result.ok) {
    const debug = req.headers['x-debug'] === '1' && process.env.NODE_ENV !== 'production';
    if (debug) {
      const body =
        typeof req.body === 'string' ? req.body : req.body ? JSON.stringify(req.body) : '';
      const canonical = canonicalizeForSignature(req, body);
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized',
        reason: result.reason,
        env: getApiAuthEnvState(),
        debug: { url: req.url, method: req.method, canonical },
      });
    }
    return res.status(401).json({ ok: false, error: 'Unauthorized', reason: result.reason });
  }
  return res.status(200).json({ ok: true, ts: Date.now(), env: getApiAuthEnvState() });
}
