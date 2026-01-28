// pages/api/csp-report.js - CSP Report-Only endpoint (collect violations safely)

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    try {
      let data = '';
      req.setEncoding('utf8');
      req.on('data', chunk => {
        data += chunk;
        // Basic safeguard against unexpected payload sizes.
        if (data.length > 1024 * 1024) {
          reject(new Error('Payload too large'));
          req.destroy();
        }
      });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeReports(parsed) {
  if (!parsed) return [];

  // Legacy CSP format: {"csp-report": {...}}
  if (parsed['csp-report'] && typeof parsed['csp-report'] === 'object') {
    return [{ type: 'csp-report', body: parsed['csp-report'] }];
  }

  // Reporting API format: [{type, url, body, user_agent}, ...]
  if (Array.isArray(parsed)) {
    return parsed
      .filter(r => r && typeof r === 'object')
      .map(r => ({
        type: r.type || 'report',
        url: r.url,
        body: r.body,
        user_agent: r.user_agent,
      }));
  }

  // Best-effort fallback
  return [{ type: 'report', body: parsed }];
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CSP reports are sent as POST.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  // Never cache report responses.
  res.setHeader('Cache-Control', 'no-store');

  try {
    const raw = await readRawBody(req);
    const parsed = safeJsonParse(raw);
    const reports = normalizeReports(parsed);

    // Keep logs minimal: do not log request headers/cookies.
    // CSP reports are generally non-PII (blocked-uri, violated-directive, etc.),
    // but we still avoid printing huge payloads.
    if (reports.length > 0) {
      const sample = reports.slice(0, 5);
      console.warn('[csp-report] violations:', JSON.stringify(sample));
    }

    // Optional: forward to Sentry when configured.
    try {
      const Sentry = await import('@sentry/nextjs');
      if (typeof Sentry.captureMessage === 'function' && reports.length > 0) {
        Sentry.captureMessage('CSP violation report', {
          level: 'warning',
          extra: { reports: reports.slice(0, 20) },
        });
      }
    } catch {
      // ignore if Sentry isn't configured in the current environment
    }

    // 204 No Content is recommended for reporting endpoints.
    res.status(204).end();
  } catch (error) {
    // Do not reveal details; still return 204 to avoid retry storms.
    console.warn('[csp-report] error:', error?.message || String(error));
    res.status(204).end();
  }
}
