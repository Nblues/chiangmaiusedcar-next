import https from 'node:https';
import { URL } from 'node:url';

export async function fetchJsonWithTimeout(url, options) {
  const {
    timeout = 3000,
    headers = {},
    method = 'POST',
    body = null,
    validateJson = true,
    maxBytes = 5 * 1024 * 1024,
    maxRedirects = 0,
  } = options || {};

  // Server-only: Storefront/Admin tokens must not be used client-side.
  if (typeof window !== 'undefined') {
    throw new Error('Shopify GraphQL fetch is server-only');
  }

  // IMPORTANT:
  // Using Node's built-in fetch (undici) can crash on Windows for some Shopify API versions.
  // We use node:https to avoid that class of issues.
  const requestOnce = targetUrl => {
    const u = new URL(targetUrl);
    const payload = body ? JSON.stringify(body) : '';
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'identity',
      ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      ...headers,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          method,
          hostname: u.hostname,
          path: `${u.pathname}${u.search}`,
          headers: requestHeaders,
        },
        res => {
          const statusCode = res.statusCode || 0;
          const statusMessage = res.statusMessage || '';
          const location = res.headers?.location || null;

          let bytes = 0;
          const chunks = [];

          res.on('data', chunk => {
            bytes += chunk.length;
            if (maxBytes && bytes > maxBytes) {
              req.destroy(new Error(`Response too large (${bytes} bytes)`));
              return;
            }
            chunks.push(chunk);
          });

          res.on('end', () => {
            const text = Buffer.concat(chunks).toString('utf8');
            resolve({ statusCode, statusMessage, location, text });
          });
        }
      );

      req.on('error', reject);

      req.setTimeout(timeout, () => {
        req.destroy(new Error(`Request timeout after ${timeout}ms`));
      });

      if (payload) req.write(payload);
      req.end();
    });
  };

  let currentUrl = url;
  let redirectsLeft = Math.max(0, Number(maxRedirects) || 0);

  // Follow redirects only when explicitly enabled.
  // Keep method/headers/body the same; Shopify redirects are typically host normalization.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { statusCode, statusMessage, location, text } = await requestOnce(currentUrl);

    if ([301, 302, 307, 308].includes(statusCode) && location && redirectsLeft > 0) {
      currentUrl = new URL(location, currentUrl).toString();
      redirectsLeft -= 1;
      continue;
    }

    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(
        `HTTP ${statusCode}: ${statusMessage}${text ? ` - ${text.slice(0, 300)}` : ''}`
      );
    }

    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      throw new Error(`Invalid JSON response: ${(e && e.message) || 'parse error'}`);
    }

    if (validateJson && (data === null || data === undefined)) {
      throw new Error('Invalid JSON response: null or undefined');
    }

    return data;
  }
}
