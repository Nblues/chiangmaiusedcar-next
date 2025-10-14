/**
 * Admin Logout API
 * POST /api/admin/logout
 */

import {
  clearSessionCookie,
  clearCsrfCookie,
  verifyCsrf,
  isAuthenticated,
} from '../../../middleware/adminAuth';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  // Must be authenticated
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  // CSRF check for state-changing action
  if (!verifyCsrf(req)) {
    return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
  }

  // Clear session and CSRF cookies
  res.setHeader('Set-Cookie', [clearSessionCookie(), clearCsrfCookie()]);

  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
}
