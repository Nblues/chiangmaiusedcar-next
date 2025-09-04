import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Skip middleware for static files and Next.js internal paths
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Skip all files with extensions
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Add performance hints for CDN connections
  // Preconnect to Shopify CDN for faster image loading
  response.headers.set(
    'Link',
    [
      '<https://cdn.shopify.com>; rel=preconnect; crossorigin',
      '</_next/static/>; rel=preload; as=script',
      '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
      '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
    ].join(', ')
  );

  // Add Early Hints for critical resources
  if (pathname === '/') {
    response.headers.set(
      'Link',
      [
        '</styles/globals.css>; rel=preload; as=style',
        '</_next/static/css/app.css>; rel=preload; as=style',
        '<https://cdn.shopify.com>; rel=preconnect; crossorigin',
      ].join(', ')
    );
  }

  // Block known AI/crawling bots from admin areas
  const blockedBots = [
    'ChatGPT',
    'Claude',
    'anthropic',
    'CCBot',
    'AI2Bot',
    'OpenAI',
    'GPTBot',
    'Google-Extended',
    'Bard',
    'BingPreview',
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
  ];

  const isBot = blockedBots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));

  // Lightweight bot protection (don't impact performance)
  if (pathname.startsWith('/admin') && isBot) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Basic security for admin routes without heavy processing
  if (pathname.startsWith('/admin')) {
    // Simple pattern check without complex processing
    const isSuspicious = /bot|crawler|spider|scraper|automated|curl|wget|python|node\.js/i.test(userAgent);

    if (isSuspicious) {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     * - static folder
     * - api routes
     * - files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|static/|api/).*)',
  ],
};
