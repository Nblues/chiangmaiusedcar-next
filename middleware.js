import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Add aggressive edge caching headers for homepage to improve TTFB
  if (request.nextUrl.pathname === '/') {
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, s-maxage=600, stale-while-revalidate=86400'
    );
    response.headers.set('CDN-Cache-Control', 'public, max-age=600, stale-while-revalidate=86400');
    response.headers.set('Vercel-CDN-Cache-Control', 'max-age=600, stale-while-revalidate=86400');
  }

  // Add cache headers for car listing pages
  if (request.nextUrl.pathname.startsWith('/car/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400'
    );
    response.headers.set(
      'CDN-Cache-Control',
      'public, max-age=3600, stale-while-revalidate=86400'
    );
  }

  // Add cache headers for static pages
  if (
    request.nextUrl.pathname === '/all-cars' ||
    request.nextUrl.pathname === '/promotion' ||
    request.nextUrl.pathname === '/about'
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=600, s-maxage=1800, stale-while-revalidate=86400'
    );
    response.headers.set(
      'CDN-Cache-Control',
      'public, max-age=1800, stale-while-revalidate=86400'
    );
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
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
