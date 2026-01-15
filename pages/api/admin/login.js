/**
 * Admin Login API
 * POST /api/admin/login
 */

import {
  authenticate,
  createSessionCookie,
  createCsrfCookie,
  getClientIp,
  hasSecureAdminConfig,
} from '../../../middleware/adminAuth';
import { rateLimit } from '../../../lib/rateLimit';

// Ensure Node.js runtime and JSON body parsing
export const config = { runtime: 'nodejs', api: { bodyParser: true, externalResolver: true } };

const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LOGIN_LIMIT = 5;

export default async function handler(req, res) {
  let stage = 'start';
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
    // Enforce secure admin credentials in production
    if (!hasSecureAdminConfig()) {
      return res.status(500).json({
        success: false,
        error: 'Admin credentials not configured for production',
      });
    }

    stage = 'rate-limit-check';
    const ip = getClientIp(req);
    const limiter = await rateLimit(`admin:login:${ip}`, {
      windowMs: LOGIN_WINDOW_MS,
      limit: LOGIN_LIMIT,
    });
    if (!limiter.ok) {
      return res.status(429).json({
        success: false,
        error: 'Too many attempts. Please try again later.',
        retryAfterSec: Math.ceil((limiter.resetAt - Date.now()) / 1000),
      });
    }

    // Parse body safely (avoid destructuring undefined)
    stage = 'parse-body';
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = null;
      }
    }
    const username = typeof body?.username === 'string' ? body.username.trim() : body?.username;
    const password = body?.password;

    // Validate input
    stage = 'validate-input';
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password required',
      });
    }

    // Authenticate
    stage = 'authenticate';
    const token = authenticate(username, password);

    if (!token) {
      // Add delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Set session cookie
    stage = 'set-cookies';
    // Also issue a CSRF cookie for subsequent state-changing requests
    res.setHeader('Set-Cookie', [createSessionCookie(token), createCsrfCookie()]);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { username },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', stage, error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      stage,
    });
  }
}
