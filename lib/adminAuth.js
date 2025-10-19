/**
 * Admin Authentication Middleware
 * Simple password-based authentication for admin dashboard
 */

import crypto from 'crypto';

// Admin credentials (in production, use environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || hashPassword('admin123');

/**
 * Hash password using SHA-256
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(username, password) {
  const passwordHash = hashPassword(password);
  return username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH;
}

/**
 * Check if user is authenticated (from session/cookie)
 */
export function isAuthenticated(req) {
  // Check for auth token in cookies or headers
  const authToken = req.cookies?.adminToken || req.headers?.authorization?.replace('Bearer ', '');

  if (!authToken) {
    return false;
  }

  try {
    // Verify token (simple implementation - in production use JWT)
    const expectedToken = process.env.ADMIN_SESSION_SECRET || 'default-secret-change-in-production';
    return authToken === hashPassword(expectedToken);
  } catch {
    return false;
  }
}

/**
 * Middleware to protect admin routes
 */
export function requireAdmin(handler) {
  return async (req, res) => {
    // Check authentication
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Admin authentication required',
      });
    }

    // Call the actual handler
    return handler(req, res);
  };
}

/**
 * Generate auth token
 */
export function generateAuthToken() {
  const secret = process.env.ADMIN_SESSION_SECRET || 'default-secret-change-in-production';
  return hashPassword(secret);
}
