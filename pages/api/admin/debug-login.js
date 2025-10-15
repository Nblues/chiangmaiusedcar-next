/**
 * Debug Login API - For testing only
 * POST /api/admin/debug-login
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body if needed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  const { username, password } = body;

  // Show what we're comparing (without exposing full password)
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;

  return res.status(200).json({
    received: {
      username: username,
      usernameLength: username?.length || 0,
      passwordLength: password?.length || 0,
    },
    expected: {
      username: envUsername,
      usernameLength: envUsername?.length || 0,
      passwordLength: envPassword?.length || 0,
      hasWhitespace: envPassword?.includes(' ') || envPassword?.includes('\\n') || envPassword?.includes('\\r'),
    },
    match: {
      username: username === envUsername,
      password: password === envPassword,
    },
    nodeEnv: process.env.NODE_ENV,
  });
}
