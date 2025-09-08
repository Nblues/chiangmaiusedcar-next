import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  const isFB =
    ua.includes('facebookexternalhit') ||
    ua.includes('facebot') ||
    ua.includes('whatsapp') ||
    ua.includes('twitterbot') ||
    ua.includes('telegrambot');

  // Create response
  const response = NextResponse.next();

  // 2025 Cache Management Headers
  const pathname = req.nextUrl.pathname;
  const isStaticAsset =
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/favicon') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg');

  const isServiceWorker = pathname.includes('sw.js') || pathname.includes('sw-images.js');
  const isManifest = pathname.includes('manifest.json') || pathname.includes('browserconfig.xml');
  const isSitemap = pathname.includes('sitemap') || pathname.includes('robots.txt');

  if (isStaticAsset && !isServiceWorker && !isManifest) {
    // Static assets: Long cache with immutable
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('X-Content-Type-Options', 'nosniff');
  } else if (isServiceWorker || isManifest) {
    // Service workers and manifests: No cache for immediate updates
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    response.headers.set('Service-Worker-Allowed', '/');
  } else if (isSitemap) {
    // Sitemaps: Short cache for SEO freshness
    response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  } else {
    // HTML pages: No cache for always fresh content (2025 standard)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Timestamp', Date.now().toString());
  }

  // Security headers for 2025
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  // HSTS for production
  if (req.nextUrl.hostname !== 'localhost') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // ถ้าเป็นบอท FB/Social ให้ปล่อยผ่านหน้า public ทั้งหมด ห้าม redirect ไปหน้าอื่น
  if (isFB) {
    // Remove cache headers for social bots to ensure fresh content
    response.headers.delete('Cache-Control');
    response.headers.delete('Pragma');
    response.headers.delete('Expires');
    response.headers.set('X-Robots-Tag', 'index, follow');
    return response;
  }

  // *** ใส่ logic redirect เดิมของโปรเจคหลังจากนี้ ***
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|static|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
