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

  const { pathname } = req.nextUrl;

  // Admin Protection - ป้องกันการเข้าถึงหน้า Admin
  if (pathname.startsWith('/admin')) {
    const userAgent = req.headers.get('user-agent') || '';

    // บล็อค Search Engine Bots
    const botPatterns = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegram/i,
      /crawler/i,
      /spider/i,
      /bot/i,
    ];

    const isBot = botPatterns.some(pattern => pattern.test(userAgent));

    if (isBot) {
      return new NextResponse('Access Denied', { status: 403 });
    }

    // เพิ่ม headers เพื่อป้องกัน indexing สำหรับหน้า admin
    const adminResponse = NextResponse.next();
    adminResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    adminResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    adminResponse.headers.set('Pragma', 'no-cache');
    adminResponse.headers.set('Expires', '0');

    return adminResponse;
  }

  // Create response
  const response = NextResponse.next();

  // 2025 Cache Management Headers
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
    // HTML pages: Optimized cache for better performance (2025 standard)
    response.headers.set(
      'Cache-Control',
      'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
    );
    response.headers.set('X-Timestamp', Date.now().toString());
    // Add performance headers
    response.headers.set('Server-Timing', 'middleware;dur=0');
    response.headers.set('X-Response-Time', Date.now().toString());
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

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!_next|api|static|assets|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
