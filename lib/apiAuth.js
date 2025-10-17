// lib/apiAuth.js
// Lightweight API authentication helpers (API key + optional HMAC signature)
// Allows programmatic access to selected APIs while keeping admin session for dashboard.

import crypto from 'crypto';
import { isAuthenticated } from '../middleware/adminAuth';

function sanitizeEnv(value, fallback) {
  const v = value !== undefined ? value : fallback;
  if (typeof v !== 'string') return v;
  return v.replace(/\r/g, '').replace(/\n/g, '').trim();
}

function getApiKeyEnv() {
  try {
    const key = process.env[String('API_KEY')];
    return sanitizeEnv(key || '', '');
  } catch {
    return '';
  }
}

function getApiSecretEnv() {
  try {
    const key = process.env[String('API_SECRET')];
    return sanitizeEnv(key || '', '');
  } catch {
    return '';
  }
}

function timingSafeEqual(a, b) {
  try {
    const aBuf = Buffer.from(String(a));
    const bBuf = Buffer.from(String(b));
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

function parseTimestamp(ts) {
  if (!ts) return null;
  // Accept ms epoch, s epoch, or ISO string
  if (/^\d{13}$/.test(ts)) return new Date(Number(ts));
  if (/^\d{10}$/.test(ts)) return new Date(Number(ts) * 1000);
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isFresh(tsHeader, skewMs = 5 * 60 * 1000) {
  const d = parseTimestamp(String(tsHeader || ''));
  if (!d) return false;
  const now = Date.now();
  const t = d.getTime();
  return Math.abs(now - t) <= skewMs;
}

export function canonicalizeForSignature(req, bodyText) {
  const method = (req.method || 'GET').toUpperCase();
  // Use only path + query for URL component
  const url = req.url || '/api';
  const payload = typeof bodyText === 'string' ? bodyText : '';
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
  const ts = String(req.headers['x-timestamp'] || req.headers['X-Timestamp'] || '');
  return `${method}\n${url}\n${ts}\n${payloadHash}`;
}

function sign(text, secret) {
  return crypto.createHmac('sha256', secret).update(text).digest('hex');
}

function extractApiKey(req) {
  const h = req.headers || {};
  const fromHeader = h['x-api-key'] || h['X-API-Key'];
  const auth = h.authorization || h.Authorization;
  if (fromHeader) return String(fromHeader);
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7);
  return '';
}

function getBodyText(req) {
  // Next.js API routes usually have parsed req.body already
  const body = req.body;
  if (typeof body === 'string') return body;
  if (body && typeof body === 'object') {
    try {
      return JSON.stringify(body);
    } catch {
      return '';
    }
  }
  return '';
}

export function verifyApiAuth(req, opts = {}) {
  const { requireHmac = false } = opts;
  const providedKey = extractApiKey(req);
  const timestamp = req.headers['x-timestamp'] || req.headers['X-Timestamp'];
  const API_KEY = getApiKeyEnv();
  const API_SECRET = getApiSecretEnv();

  if (!API_KEY) {
    return { ok: false, reason: 'API key not configured' };
  }
  if (!providedKey || !timingSafeEqual(providedKey, API_KEY)) {
    return { ok: false, reason: 'Invalid API key' };
  }
  if (!isFresh(timestamp)) {
    return { ok: false, reason: 'Stale or invalid timestamp' };
  }

  // If API secret is set or HMAC is required, verify signature
  const mustHmac = requireHmac || Boolean(API_SECRET);
  if (mustHmac) {
    if (!API_SECRET) return { ok: false, reason: 'API secret not configured' };
    const sigHeader = req.headers['x-signature'] || req.headers['X-Signature'];
    if (!sigHeader) return { ok: false, reason: 'Missing signature' };
    const bodyText = getBodyText(req);
    const canonical = canonicalizeForSignature(req, bodyText);
    const expected = sign(canonical, API_SECRET);
    if (!timingSafeEqual(sigHeader, expected)) {
      return { ok: false, reason: 'Invalid signature' };
    }
  }

  return { ok: true, reason: 'ok' };
}

export function withApiAuth(handler, opts = {}) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    const result = verifyApiAuth(req, opts);
    if (!result.ok) {
      res.setHeader(
        'WWW-Authenticate',
        'APIKey realm="chiangmaiusedcar", headers="X-API-Key, X-Timestamp, X-Signature"'
      );
      return res.status(401).json({ success: false, error: 'Unauthorized', reason: result.reason });
    }
    req.apiAuth = { mode: 'api', method: req.method };
    return handler(req, res);
  };
}

export function withSessionOrApiAuth(handler, opts = {}) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    if (isAuthenticated(req)) {
      req.auth = { mode: 'session' };
      return handler(req, res);
    }
    const result = verifyApiAuth(req, opts);
    if (!result.ok) {
      res.setHeader(
        'WWW-Authenticate',
        'APIKey realm="chiangmaiusedcar", headers="X-API-Key, X-Timestamp, X-Signature"'
      );
      return res.status(401).json({ success: false, error: 'Unauthorized', reason: result.reason });
    }
    req.auth = { mode: 'api' };
    return handler(req, res);
  };
}

export function getApiAuthEnvState() {
  return {
    hasApiKey: Boolean(getApiKeyEnv()),
    hasApiSecret: Boolean(getApiSecretEnv()),
  };
}
