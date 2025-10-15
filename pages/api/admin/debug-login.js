/**
 * Debug Login API - For testing only
 * POST /api/admin/debug-login
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

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
