/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Never touch Next.js HMR WebSocket / upgrade requests.
  // If middleware runs on these, dev HMR can break in subtle ways.
  const isWebSocketUpgrade = request.headers.get('upgrade')?.toLowerCase() === 'websocket';
  if (isWebSocketUpgrade || request.nextUrl.pathname === '/_next/webpack-hmr') {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Homepage: disable browser cache, keep CDN cache for fast TTFB
  if (request.nextUrl.pathname === '/') {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, must-revalidate, s-maxage=600, stale-while-revalidate=86400'
    );
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
    response.headers.set('Vercel-CDN-Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
  }

  // Car detail pages: disable browser cache, keep longer CDN cache
  if (request.nextUrl.pathname.startsWith('/car/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, must-revalidate, s-maxage=3600, stale-while-revalidate=86400'
    );
    response.headers.set(
      'CDN-Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );
    response.headers.set('Vercel-CDN-Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  }

  // Listing and static pages: disable browser cache, keep CDN cache
  if (
    request.nextUrl.pathname === '/all-cars' ||
    request.nextUrl.pathname === '/promotion' ||
    request.nextUrl.pathname === '/about'
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, must-revalidate, s-maxage=1800, stale-while-revalidate=86400'
    );
    response.headers.set(
      'CDN-Cache-Control',
      'public, s-maxage=1800, stale-while-revalidate=86400'
    );
    response.headers.set('Vercel-CDN-Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack-hmr (dev HMR websocket)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)',
  ],
};
