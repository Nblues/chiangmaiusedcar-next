/**
 * Debug Login API - For testing only
 * POST /api/admin/debug-login
 */

export const config = { runtime: 'nodejs', api: { bodyParser: true, externalResolver: true } };

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow GET for quick probing (temporary diagnostic)
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      method: req.method,
      note: 'Use POST with JSON { username, password } to compare',
      headers: {
        host: req.headers.host,
        'content-type': req.headers['content-type'] || null,
        'user-agent': req.headers['user-agent'] || null,
      },
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', method: req.method });
  }

  // Parse body if needed
  let body = req.body;
  const contentType = req.headers['content-type'] || '';
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON', details: err.message });
    }
  }
  if (!body && contentType.includes('application/json')) {
    // Body parser might have failed or body was empty
    return res.status(400).json({ error: 'Empty JSON body', contentType });
  }

  const { username, password } = body;

  // Show what we're comparing (without exposing full password)
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;

  // Local sanitize (mirror of middleware behavior) for diagnostics only
  const sanitize = v =>
    typeof v === 'string' ? v.replace(/\r/g, '').replace(/\n/g, '').trim() : v;
  const sanitizedUsername = sanitize(envUsername);
  const sanitizedPassword = sanitize(envPassword);

  // Detailed character comparison
  const receivedBytes = password ? Buffer.from(password).toString('hex') : '';
  const expectedBytes = envPassword ? Buffer.from(envPassword).toString('hex') : '';

  return res.status(200).json({
    received: {
      username: username,
      usernameLength: username?.length || 0,
      password: password?.substring(0, 5) + '***',
      passwordLength: password?.length || 0,
      passwordHex: receivedBytes.substring(0, 20) + '...',
    },
    expected: {
      username: envUsername || 'NOT_SET',
      usernameLength: envUsername?.length || 0,
      password: envPassword?.substring(0, 5) + '***',
      passwordLength: envPassword?.length || 0,
      passwordHex: expectedBytes.substring(0, 20) + '...',
      hasWhitespace:
        envPassword?.includes(' ') || envPassword?.includes('\n') || envPassword?.includes('\r'),
      hasSessionSecret: !!sessionSecret,
    },
    expectedSanitized: {
      username: sanitizedUsername || 'NOT_SET',
      usernameLength: sanitizedUsername?.length || 0,
      password: sanitizedPassword ? sanitizedPassword.substring(0, 5) + '***' : undefined,
      passwordLength: sanitizedPassword?.length || 0,
      hasWhitespace: sanitizedPassword
        ? sanitizedPassword.includes(' ') ||
          sanitizedPassword.includes('\n') ||
          sanitizedPassword.includes('\r')
        : false,
    },
    match: {
      username: username === envUsername,
      password: password === envPassword,
      exactMatch: username === envUsername && password === envPassword,
      // What login() will use after deployment with sanitization
      sanitizedExactMatch: username === sanitizedUsername && password === sanitizedPassword,
    },
    debug: {
      nodeEnv: process.env.NODE_ENV,
      allEnvVarsPresent: !!(envUsername && envPassword && sessionSecret),
    },
  });
}
