/**
 * Proxy API for TikTok CDN images.
 * TikTok blocks direct hotlinking from external domains in browsers,
 * so we fetch images server-side and forward them to the client.
 */

const ALLOWED_HOSTNAMES = [
  'p16-common-sign.tiktokcdn-us.com',
  'p19-common-sign.tiktokcdn-us.com',
  'p16-sign.tiktokcdn-us.com',
  'p19-sign.tiktokcdn-us.com',
  'p77-sign.tiktokcdn-us.com',
  'p16-amd-va.tiktokcdn.com',
  'p19-amd-va.tiktokcdn.com',
  'p16-sg.tiktokcdn.com',
  'p19-sg.tiktokcdn.com',
  'p16-pu.tiktokcdn.com',
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (
    parsed.protocol !== 'https:' ||
    !(
      parsed.hostname.endsWith('.tiktokcdn-us.com') ||
      parsed.hostname.endsWith('.tiktokcdn.com') ||
      parsed.hostname.endsWith('.tiktok.com') ||
      ALLOWED_HOSTNAMES.includes(parsed.hostname)
    )
  ) {
    return res.status(403).json({ error: 'Domain not allowed' });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; chiangmaiusedcar-bot/1.0)',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream error' });
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const originalBuffer = Buffer.from(await upstream.arrayBuffer());

    let outputBuffer = originalBuffer;
    let finalContentType = contentType;

    // Use Sharp to optimize and resize TikTok covers
    // Mobile view is roughly 237x421, desktop max is 315x560.
    try {
      const sharp = (await import('sharp')).default;
      outputBuffer = await sharp(originalBuffer)
        .resize({ width: 360, withoutEnlargement: true })
        .webp({ quality: 65, effort: 4 })
        .toBuffer();
      finalContentType = 'image/webp';
    } catch (sharpError) {
      console.error('TikTok API Sharp processing error:', sharpError);
    }

    // Cache on Vercel CDN and browser for 1 year (31536000 seconds)
    res.setHeader('Content-Type', finalContentType);
    res.setHeader(
      'Cache-Control',
      'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400'
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(outputBuffer);
  } catch (error) {
    console.error('TikTok API fetch error:', error);
    return res.status(502).json({ error: 'Failed to fetch image' });
  }
}
