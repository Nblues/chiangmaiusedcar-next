export const COOKIE_CONSENT_VERSION = '2026-01';
export const COOKIE_CONSENT_NAME = 'cmuc_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'cmuc:cookie-consent';

// 180 days is a common retention window; bump version to re-prompt when policy changes.
const DEFAULT_MAX_AGE_DAYS = 180;

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getCookieValue(name) {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookie of cookies) {
    const [rawKey, ...rest] = cookie.split('=');
    const key = rawKey?.trim();
    if (!key) continue;
    if (key === name) return rest.join('=').trim();
  }
  return null;
}

function setCookie(name, value, maxAgeSeconds) {
  if (typeof document === 'undefined') return;
  const secure = typeof location !== 'undefined' && location.protocol === 'https:';
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}`,
    'Path=/',
    'SameSite=Lax',
  ];
  if (secure) parts.push('Secure');
  document.cookie = parts.join('; ');
}

function deleteCookie(name) {
  setCookie(name, '', 0);
}

function normalizeConsent(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const v = raw.v;
  const ts = Number(raw.ts);
  const maxAgeDays = Number(raw.maxAgeDays) || DEFAULT_MAX_AGE_DAYS;

  if (!v || !Number.isFinite(ts)) return null;

  const now = Date.now();
  const ageMs = now - ts;
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  if (ageMs < 0 || ageMs > maxAgeMs) return { expired: true };

  return {
    v,
    ts,
    maxAgeDays,
    essential: true,
    analytics: Boolean(raw.analytics),
    marketing: Boolean(raw.marketing),
  };
}

export function readCookieConsent() {
  if (typeof window === 'undefined') return null;

  // Legacy migration: older builds stored a simple string + timestamp.
  // Preserve user choice so we don't re-prompt unnecessarily.
  try {
    const legacy = localStorage.getItem('cookie-consent');
    if (legacy === 'accepted' || legacy === 'rejected') {
      const legacyTsRaw = localStorage.getItem('cookie-consent-timestamp');
      const legacyTs = Number(legacyTsRaw);
      const ts = Number.isFinite(legacyTs) ? legacyTs : Date.now();

      const migrated = {
        v: COOKIE_CONSENT_VERSION,
        ts,
        maxAgeDays: DEFAULT_MAX_AGE_DAYS,
        essential: true,
        analytics: legacy === 'accepted',
        marketing: legacy === 'accepted',
      };

      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookie-consent-timestamp');

      localStorage.setItem(COOKIE_CONSENT_NAME, JSON.stringify(migrated));
      const maxAgeSeconds = DEFAULT_MAX_AGE_DAYS * 24 * 60 * 60;
      setCookie(COOKIE_CONSENT_NAME, JSON.stringify(migrated), maxAgeSeconds);
      return migrated;
    }
  } catch {
    // ignore
  }

  const fromLs = safeJsonParse(localStorage.getItem(COOKIE_CONSENT_NAME) || '');
  const fromCookieRaw = getCookieValue(COOKIE_CONSENT_NAME);
  const fromCookie = fromCookieRaw ? safeJsonParse(decodeURIComponent(fromCookieRaw)) : null;

  const normalized = normalizeConsent(fromLs) || normalizeConsent(fromCookie);
  if (!normalized) return null;

  if (normalized.expired) {
    localStorage.removeItem(COOKIE_CONSENT_NAME);
    deleteCookie(COOKIE_CONSENT_NAME);
    return null;
  }

  if (normalized.v !== COOKIE_CONSENT_VERSION) return null;
  return normalized;
}

export function writeCookieConsent({ analytics, marketing, maxAgeDays } = {}) {
  if (typeof window === 'undefined') return null;

  const consent = {
    v: COOKIE_CONSENT_VERSION,
    ts: Date.now(),
    maxAgeDays: Number(maxAgeDays) || DEFAULT_MAX_AGE_DAYS,
    essential: true,
    analytics: Boolean(analytics),
    marketing: Boolean(marketing),
  };

  const json = JSON.stringify(consent);
  localStorage.setItem(COOKIE_CONSENT_NAME, json);

  const maxAgeSeconds = consent.maxAgeDays * 24 * 60 * 60;
  setCookie(COOKIE_CONSENT_NAME, json, maxAgeSeconds);

  try {
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: consent }));
  } catch {
    // ignore
  }

  return consent;
}

export function onCookieConsentChange(handler) {
  if (typeof window === 'undefined') return () => {};
  const listener = evt => {
    try {
      handler?.(evt?.detail || null);
    } catch {
      // ignore
    }
  };
  window.addEventListener(COOKIE_CONSENT_EVENT, listener);
  return () => window.removeEventListener(COOKIE_CONSENT_EVENT, listener);
}
