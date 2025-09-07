export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    const { token } = req.body || {};
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ ok: false, error: 'Server not configured' });
    }
    if (!token) {
      return res.status(400).json({ ok: false, error: 'Missing token' });
    }
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await r.json();
    if (!data.success || (typeof data.score === 'number' && data.score < 0.5)) {
      return res.status(400).json({ ok: false, error: 'Invalid captcha' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Verification failed' });
  }
}
