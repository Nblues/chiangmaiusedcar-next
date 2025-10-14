import { isAuthenticated, createCsrfCookie } from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    });
  }

  // Refresh/issue CSRF cookie on verify
  res.setHeader('Set-Cookie', createCsrfCookie());

  return res.status(200).json({
    success: true,
    user: {
      username: req.adminSession?.username || 'admin',
      timestamp: req.adminSession?.timestamp,
    },
  });
}
