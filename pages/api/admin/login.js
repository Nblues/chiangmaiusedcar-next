/**
 * Admin Login API
 * POST /api/admin/login
 */

import {
  authenticate,
  createSessionCookie,
  createCsrfCookie,
  getClientIp,
} from '../../../middleware/adminAuth';

// Simple in-memory rate limiter per IP
const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5; // per window
function isRateLimited(ip) {
  const now = Date.now();
  const rec = attempts.get(ip) || { count: 0, first: now };
  if (now - rec.first > WINDOW_MS) {
    // reset window
    attempts.set(ip, { count: 0, first: now });
    return false;
  }
  return rec.count >= MAX_ATTEMPTS;
}
function incr(ip) {
  const now = Date.now();
  const rec = attempts.get(ip) || { count: 0, first: now };
  if (now - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
  } else {
    attempts.set(ip, { count: rec.count + 1, first: rec.first });
  }
}

export default async function handler(req, res) {
  // Set no-cache headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Preflight support
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return res
        .status(429)
        .json({ success: false, error: 'Too many attempts. Please try again later.' });
    }

    // Parse body safely (avoid destructuring undefined)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = null;
      }
    }
    const username = body?.username;
    const password = body?.password;

    // Validate input
    if (!username || !password) {
      incr(ip);
      return res.status(400).json({
        success: false,
        error: 'Username and password required',
      });
    }

  // Authenticate
  const token = authenticate(username, password);

    if (!token) {
      // Add delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
      incr(ip);

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Set session cookie
    // Also issue a CSRF cookie for subsequent state-changing requests
    res.setHeader('Set-Cookie', [createSessionCookie(token), createCsrfCookie()]);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { username },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
