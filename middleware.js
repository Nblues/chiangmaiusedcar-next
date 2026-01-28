/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { NextResponse } from 'next/server';

export function middleware(request) {
  // In development, skip middleware entirely to avoid breaking HMR/WebSocket
  // and to keep debugging predictable.
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  // Never touch Next.js HMR WebSocket / upgrade requests.
  // If middleware runs on these, dev HMR can break in subtle ways.
  const isWebSocketUpgrade = request.headers.get('upgrade')?.toLowerCase() === 'websocket';
  if (isWebSocketUpgrade || request.nextUrl.pathname === '/_next/webpack-hmr') {
    return NextResponse.next();
  }

  // Do not override HTML caching here; let Next/Vercel determine caching semantics
  // based on SSR/SSG/ISR and response headers configured in next.config.js.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude Next.js internals and common static files
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|robots.txt|sitemap.xml|sitemap-0.xml|sitemap-images.xml|manifest.json|site.webmanifest|browserconfig.xml|offline.html|sw.js|sw-dev.js|sw-advanced.js|sw-images.js).*)',
  ],
};
