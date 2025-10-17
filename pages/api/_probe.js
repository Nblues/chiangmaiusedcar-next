/* eslint-disable linebreak-style */
export default function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const headers = (req && req.headers) || {};
    const data = {
      ok: true,
      t: Date.now(),
      host: headers.host || null,
      forwardedHost: headers['x-forwarded-host'] || null,
      vercelId: headers['x-vercel-id'] || null,
      vercelUrl: process.env.VERCEL_URL || null,
      nodeEnv: process.env.NODE_ENV || null,
      projectHint: 'chiangmaiusedcar-next',
    };
    return res.status(200).json(data);
  } catch (err) {
    try {
      return res.status(200).json({ ok: false, error: err?.message || 'probe-failed' });
    } catch {
      res.statusCode = 200;
      res.end('{"ok":false,"error":"probe-failed-serialize"}');
    }
  }
}
