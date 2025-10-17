import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // We need the raw body to verify Shopify HMAC
  },
};

// Read raw request body as Buffer
async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    try {
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

function verifyShopifyHmac(rawBody, headerHmac, secret) {
  if (!headerHmac || !secret) return false;
  try {
    const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
    const a = Buffer.from(computed, 'utf8');
    const b = Buffer.from(headerHmac, 'utf8');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function revalidatePaths(res, handle, locales = ['th', 'en']) {
  try {
    if (typeof res.revalidate !== 'function') return;
    // Always revalidate core listing pages
    await res.revalidate('/');
    await res.revalidate('/all-cars');

    // Revalidate car detail page for default (no prefix) and locale-prefixed routes
    if (handle) {
      await res.revalidate(`/car/${encodeURIComponent(handle)}`);
      for (const locale of locales) {
        await res.revalidate(`/${locale}/car/${encodeURIComponent(handle)}`);
      }
    }
  } catch {
    // Best-effort; do not throw
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Basic anti-cache
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  const topic = req.headers['x-shopify-topic'];
  const shopDomain = req.headers['x-shopify-shop-domain'];
  const headerHmac = req.headers['x-shopify-hmac-sha256'];

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET || '';

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (e) {
    return res.status(400).json({ success: false, error: 'Invalid body' });
  }

  // Verify HMAC
  const valid = verifyShopifyHmac(rawBody, headerHmac, secret);
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Invalid HMAC' });
  }

  // Parse payload
  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ success: false, error: 'Malformed JSON' });
  }

  // Try to extract handle and id
  const handle = payload?.handle || payload?.product?.handle || null;
  const productId = payload?.id || payload?.product?.id || null;

  // Revalidate relevant pages
  await revalidatePaths(res, handle);

  // Respond quickly to avoid webhook retries
  return res.status(200).json({
    success: true,
    topic,
    shop: shopDomain,
    handle: handle || undefined,
    productId: productId || undefined,
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
