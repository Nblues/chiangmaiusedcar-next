import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import { rateLimit } from '../../lib/rateLimit';

// Force Node.js runtime - sharp requires native binaries unavailable on Edge Runtime
export const config = {
  runtime: 'nodejs',
  api: { bodyParser: false },
};

const DEFAULT_W = 1200;
const DEFAULT_H = 630;

const ALLOWED_REMOTE_HOSTS = new Set([
  'cdn.shopify.com',
  'www.chiangmaiusedcar.com',
  'chiangmaiusedcar.com',
]);

function clampInt(value, { min, max, fallback }) {
  const n = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function isSafeLocalSrc(src) {
  if (typeof src !== 'string') return false;
  if (!src.startsWith('/')) return false;
  if (src.includes('\\')) return false;
  if (src.includes('..')) return false;
  if (src.startsWith('/api/')) return false;
  return true;
}

async function readLocalPublicFile(srcPath) {
  const publicRoot = path.join(process.cwd(), 'public');
  const relativePath = srcPath.replace(/^\/+/, '');
  const filePath = path.join(publicRoot, relativePath);
  return fs.readFile(filePath);
}

async function fetchRemoteBuffer(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        // Social bots often send minimal UAs; use a normal UA to avoid edge blocks.
        'user-agent':
          'Mozilla/5.0 (compatible; ChiangMaiUsedCarBot/1.0; +https://www.chiangmaiusedcar.com)',
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const message = text ? text.slice(0, 200) : '';
      const err = new Error(
        `Upstream fetch failed: HTTP ${res.status}${message ? ` - ${message}` : ''}`
      );
      err.statusCode = 502;
      throw err;
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  // Rate limit: 30 requests per 10 minutes per IP
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  const rl = await rateLimit(`og:${ip}`, { limit: 30, windowMs: 10 * 60 * 1000 });
  if (!rl.ok) {
    res.setHeader('Retry-After', String(Math.ceil((rl.resetAt - Date.now()) / 1000)));
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  try {
    const { src } = req.query;
    const w = clampInt(req.query.w, { min: 200, max: 2000, fallback: DEFAULT_W });
    const h = clampInt(req.query.h, { min: 200, max: 2000, fallback: DEFAULT_H });

    if (!src || typeof src !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing src query param' });
    }

    let inputBuffer;

    if (isSafeLocalSrc(src)) {
      inputBuffer = await readLocalPublicFile(src);
    } else {
      let parsed;
      try {
        parsed = new URL(src);
      } catch {
        return res.status(400).json({
          ok: false,
          error: 'src must be an absolute URL or a safe local path starting with /',
        });
      }

      if (!ALLOWED_REMOTE_HOSTS.has(parsed.hostname)) {
        return res
          .status(400)
          .json({ ok: false, error: `src host not allowed: ${parsed.hostname}` });
      }

      inputBuffer = await fetchRemoteBuffer(parsed.toString());
    }

    const output = await sharp(inputBuffer)
      .resize({
        width: w,
        height: h,
        fit: 'cover',
        position: 'centre',
      })
      // JPEG is the safest for FB/LINE/Twitter.
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400'
    );

    return res.status(200).send(output);
  } catch (error) {
    const status = Number.isFinite(error?.statusCode) ? error.statusCode : 500;
    // eslint-disable-next-line no-console
    console.error('OG image API error:', error);
    return res.status(status).json({ ok: false, error: String(error?.message || error) });
  }
}
