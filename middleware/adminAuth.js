/**
 * Admin Authentication Middleware (2025)
 * - Cookie-based session with HMAC signature and expiration
 * - CSRF protection via double-submit cookie
 * - Secure cookie flags (HttpOnly, Secure, SameSite=Strict)
 */

import { serialize, parse } from 'cookie';
import crypto from 'crypto';

// Helpers to sanitize env strings (remove CR/LF and trim)
function sanitizeEnv(value, fallback) {
  const v = value !== undefined ? value : fallback;
  if (typeof v !== 'string') return v;
  // Remove CR and LF anywhere, then trim spaces
  return v.replace(/\r/g, '').replace(/\n/g, '').trim();
}

// Configuration (env-driven, sanitized)
const ADMIN_USERNAME = sanitizeEnv(process.env.ADMIN_USERNAME, 'admin');
const ADMIN_PASSWORD = sanitizeEnv(process.env.ADMIN_PASSWORD, 'changeme123');
const SESSION_SECRET = sanitizeEnv(
  process.env.SESSION_SECRET,
  'default-secret-change-in-production'
);

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'changeme123';
const DEFAULT_SESSION_SECRET = 'default-secret-change-in-production';

function isSecureConfig() {
  if (process.env.NODE_ENV !== 'production') return true;
  const secureUsername = ADMIN_USERNAME !== DEFAULT_ADMIN_USERNAME;
  const securePassword = ADMIN_PASSWORD !== DEFAULT_ADMIN_PASSWORD;
  const secureSecret = SESSION_SECRET !== DEFAULT_SESSION_SECRET;
  return secureUsername && securePassword && secureSecret;
}

// Light telemetry if sanitation occurred (no secrets printed)
try {
  const rawU = process.env.ADMIN_USERNAME || '';
  const rawP = process.env.ADMIN_PASSWORD || '';
  const rawS = process.env.SESSION_SECRET || '';
  if (/\r|\n|\s$/.test(rawU)) {
    if (typeof process.emitWarning === 'function') {
      process.emitWarning('ADMIN_USERNAME had trailing whitespace; sanitized');
    }
  }
  if (/\r|\n|\s$/.test(rawP)) {
    if (typeof process.emitWarning === 'function') {
      process.emitWarning('ADMIN_PASSWORD had trailing whitespace; sanitized');
    }
  }
  if (/\r|\n|\s$/.test(rawS)) {
    if (typeof process.emitWarning === 'function') {
      process.emitWarning('SESSION_SECRET had trailing whitespace; sanitized');
    }
  }
} catch {
  // Optional telemetry only; ignore any failures
  if (typeof process.emitWarning === 'function') {
    process.emitWarning('Sanitization telemetry suppressed due to error');
  }
}
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CSRF_DURATION = 2 * 60 * 60 * 1000; // 2 hours

// Utils
function hmac(data) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
}

function generateSessionToken(username) {
  const timestamp = Date.now();
  const data = `${username}:${timestamp}`;
  const signature = hmac(data);
  return `${Buffer.from(data).toString('base64')}.${signature}`;
}

function verifySessionToken(token) {
  try {
    if (!token) return null;
    const [dataBase64, signature] = token.split('.');
    if (!dataBase64 || !signature) return null;
    const data = Buffer.from(dataBase64, 'base64').toString('utf-8');
    const [username, timestampStr] = data.split(':');
    const timestamp = parseInt(timestampStr, 10);
    if (!username || Number.isNaN(timestamp)) return null;

    // Expiration check
    if (Date.now() - timestamp > SESSION_DURATION) return null;

    // Signature check
    if (hmac(data) !== signature) return null;

    return { username, timestamp };
  } catch {
    return null;
  }
}

export function isAuthenticated(req) {
  if (!isSecureConfig()) return false;
  const cookies = parse(req.headers.cookie || '');
  // Support both legacy and __Host- prefixed cookie names
  const sessionToken = cookies['__Host-admin_session'] || cookies.admin_session;
  const session = verifySessionToken(sessionToken);
  if (!session) return false;
  req.adminSession = session;
  return true;
}

export function authenticate(username, password) {
  if (!isSecureConfig()) return null;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return generateSessionToken(username);
  }
  return null;
}

export function hasSecureAdminConfig() {
  return isSecureConfig();
}

export function requireAuth(handler) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    if (!isAuthenticated(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    return handler(req, res);
  };
}

function getSessionCookieName() {
  // Use strict cookie prefix in production for better security
  return process.env.NODE_ENV === 'production' ? '__Host-admin_session' : 'admin_session';
}

export function createSessionCookie(token) {
  return serialize(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: Math.floor(SESSION_DURATION / 1000),
    path: '/',
  });
}

export function clearSessionCookie() {
  return serialize(getSessionCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

// CSRF (double-submit cookie)
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function getCsrfTokenFromCookies(req) {
  const cookies = parse(req.headers.cookie || '');
  const name = process.env.NODE_ENV === 'production' ? '__Host-csrfToken' : 'csrfToken';
  return cookies[name] || '';
}

export function createCsrfCookie(value) {
  const token = value || generateCsrfToken();
  const name = process.env.NODE_ENV === 'production' ? '__Host-csrfToken' : 'csrfToken';
  return serialize(name, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: Math.floor(CSRF_DURATION / 1000),
    path: '/',
  });
}

export function clearCsrfCookie() {
  const name = process.env.NODE_ENV === 'production' ? '__Host-csrfToken' : 'csrfToken';
  return serialize(name, '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export function verifyCsrf(req) {
  const method = (req.method || 'GET').toUpperCase();
  const unsafe = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!unsafe.includes(method)) return true;
  const headerToken = (req.headers['x-csrf-token'] || req.headers['X-CSRF-Token'] || '').toString();
  const cookieToken = getCsrfTokenFromCookies(req);
  return Boolean(headerToken) && headerToken === cookieToken;
}

export function getClientIp(req) {
  try {
    const xfwd = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
    if (Array.isArray(xfwd) && xfwd.length > 0) return xfwd[0];
    if (typeof xfwd === 'string' && xfwd.length > 0) return xfwd.split(',')[0].trim();
    return req.socket?.remoteAddress || 'unknown';
  } catch {
    return 'unknown';
  }
}
