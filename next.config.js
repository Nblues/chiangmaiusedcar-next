/* eslint-disable */
const path = require('path');

const isWindows = process.platform === 'win32';

// Turbopack warning prevention: when running `next dev --turbo`, Next.js warns if a
// webpack config is present. Keep webpack config for production builds, but omit it
// in Turbopack dev.
const isTurbopackDev =
  process.env.TURBOPACK === '1' ||
  process.env.NEXT_TURBOPACK === '1' ||
  (typeof process.env.npm_lifecycle_script === 'string' &&
    process.env.npm_lifecycle_script.includes('next dev') &&
    process.env.npm_lifecycle_script.includes('--turbo'));

const isLowMemoryDev =
  process.env.LOW_MEMORY_DEV === 'true' ||
  process.env.LOW_MEMORY_BUILD === 'true' ||
  process.env.LOW_MEMORY === 'true';
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
  analyzerMode: 'static',
  generateStatsFile: true,
  reportFilename: ({ isServer }) => (isServer ? 'analyze/server.html' : 'analyze/client.html'),
  statsFilename: ({ isServer }) =>
    isServer ? 'analyze/server-stats.json' : 'analyze/client-stats.json',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance & SEO optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // On some Windows setups, Next's internal tracing can intermittently fail when writing
  // to `.next\\trace` (EPERM). Using a distinct distDir on win32 avoids that collision.
  // Vercel/Linux keeps the default `.next` output directory.
  distDir: isWindows ? '.next-win' : '.next',
  // Enable compression for self-host/localhost. Vercel already compresses at the edge.
  compress: process.env.VERCEL ? false : true,
  generateEtags: true,
  swcMinify: process.env.NEXT_DISABLE_SWC === '1' ? false : true,

  // SWC Transform - Target modern browsers (ES2020+) to reduce polyfills
  // This removes unnecessary polyfills for Array.at, Array.flat, Object.fromEntries, etc.
  experimental: {
    esmExternals: true,
    scrollRestoration: true,
    serverComponentsExternalPackages: ['shopify-api-node'],
    // Prevent Jest worker errors in development
    ...(process.env.NODE_ENV === 'development' && {
      workerThreads: false,
      cpus: 1,
    }),
    // Low-memory build mode (useful on Windows where V8 can OOM during deserialization)
    ...(process.env.LOW_MEMORY_BUILD === 'true' && {
      workerThreads: false,
      cpus: 1,
    }),
  },

  // Asset prefix for Cloudflare CDN
  // Removed assetPrefix to fix static file loading

  // Enhanced TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
    // Use absolute Windows-native path to avoid TS path assertion (C:/... vs C:\\...)
    tsconfigPath: path.join(__dirname, 'tsconfig.json'),
  },

  // Enhanced ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during production build
    dirs: ['pages', 'components', 'lib', 'utils'],
  },

  // Webpack configuration for bundle optimization and HMR
  ...(isTurbopackDev
    ? {}
    : {
        webpack: (config, { dev, isServer }) => {
          // Memory optimization - เพิ่ม cache และลด memory footprint
          if (dev) {
            config.cache = {
              type: 'filesystem',
              maxMemoryGenerations: 1, // ลดเหลือ 1 เพื่อประหยัด memory
              buildDependencies: {
                config: [__filename],
              },
            };

            // Only apply aggressive dev bundling overrides when explicitly requested.
            // Disabling splitChunks makes `main.js` huge and increases JS parse/eval time,
            // which can distort Lighthouse/TBT in development.
            if (isLowMemoryDev) {
              config.optimization = {
                ...config.optimization,
                minimize: false,
                runtimeChunk: false,
                splitChunks: false,
                removeAvailableModules: false,
                removeEmptyChunks: false,
                mergeDuplicateChunks: false,
              };

              // ลด parallelism เพื่อประหยัด memory
              config.parallelism = 1;
            }
          }

          // Production CSS optimization - Remove unused CSS
          if (!dev && !isServer) {
            config.optimization = {
              ...config.optimization,
              usedExports: true,
              sideEffects: false,
              minimize: true,
            };
          }

          // Existing webpack configuration
          if (!isServer) {
            config.resolve.fallback = {
              ...config.resolve.fallback,
              fs: false,
              path: false,
              os: false,
            };
          }

          // Optimize file watching for Windows dev server
          if (dev && !isServer) {
            config.watchOptions = {
              poll: 1000, // ลด polling frequency
              aggregateTimeout: 300,
              ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**', '**/public/**'],
            };
          }

          return config;
        },
      }),

  // Dev server configuration for stable WebSocket connection

  // Dev server configuration for stable WebSocket connection
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000, // ลดเป็น 25 วินาที
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 1, // เก็บแค่ 1 หน้าเพื่อประหยัด memory
  },

  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // Environment variables validation
  env: {
    CUSTOM_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_BUILD_ENV: process.env.NODE_ENV || 'development',
  },

  // Image optimization - ใช้ Shopify CDN (ไม่ใช่ Cloudflare)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kn-goodcar.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.myshopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'chiangmaiusedcar.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.chiangmaiusedcar.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache 60 วินาที
    dangerouslyAllowSVG: false,
    contentDispositionType: 'inline',
    // ปิด Next.js Image Optimization เพื่อหลีกเลี่ยง Vercel 402 Payment Required
    unoptimized: true,
    // Disable image optimization worker to prevent Jest worker errors
    loader: 'custom',
    loaderFile: './lib/imageLoader.js',
  },

  // Headers for deployment and performance - Enhanced 2025
  async headers() {
    // Sanitize SITE_URL to avoid CR/LF or trailing spaces breaking CORS headers
    const cleanSiteUrl = (() => {
      const raw = process.env.SITE_URL || 'https://www.chiangmaiusedcar.com';
      return typeof raw === 'string' ? raw.replace(/\r/g, '').replace(/\n/g, '').trim() : raw;
    })();

    const baseSiteUrl = (() => {
      const s = typeof cleanSiteUrl === 'string' ? cleanSiteUrl : 'https://www.chiangmaiusedcar.com';
      return s.replace(/\/+$/g, '');
    })();
    const cspReportPath = '/api/csp-report';
    const cspReportUrl = `${baseSiteUrl}${cspReportPath}`;
    const reportGroup = 'csp';
    const reportToValue = JSON.stringify({
      group: reportGroup,
      max_age: 10886400, // 18 weeks
      endpoints: [{ url: cspReportUrl }],
    });
    const cspValue = [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.vercel-analytics.com va.vercel-scripts.com vercel.live *.vercel.live *.emailjs.com *.cloudflare.com challenges.cloudflare.com *.facebook.com *.facebook.net *.fbcdn.net *.shopify.com connect.facebook.net",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net *.cloudflare.com *.facebook.com *.shopify.com",
      "font-src 'self' fonts.gstatic.com cdn.jsdelivr.net data:",
      "img-src 'self' data: blob: *.shopify.com *.myshopify.com cdn.shopify.com files.myshopify.com images.unsplash.com *.cloudflare.com *.facebook.com *.facebook.net *.fbcdn.net",
      "connect-src 'self' *.shopify.com *.myshopify.com *.vercel-analytics.com *.google-analytics.com vercel.live *.vercel.live api.emailjs.com *.emailjs.com fonts.googleapis.com fonts.gstatic.com *.googleapis.com *.gstatic.com *.cloudflare.com *.facebook.com *.facebook.net connect.facebook.net",
      "frame-src 'self' *.facebook.com *.line.me *.google.com maps.google.com *.cloudflare.com challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' *.cloudflare.com *.facebook.com",
      "frame-ancestors 'self' *.facebook.com",
      "worker-src 'self' blob:",
    ].join('; ');

    // Report-Only: test a stricter policy safely (no user impact).
    // Start by removing 'unsafe-eval' and collecting real-world violations.
    const cspReportOnlyValue = [
      "default-src 'self' 'unsafe-inline' data: https:",
      "script-src 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.vercel-analytics.com va.vercel-scripts.com vercel.live *.vercel.live *.emailjs.com *.cloudflare.com challenges.cloudflare.com *.facebook.com *.facebook.net *.fbcdn.net *.shopify.com connect.facebook.net",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net *.cloudflare.com *.facebook.com *.shopify.com",
      "font-src 'self' fonts.gstatic.com cdn.jsdelivr.net data:",
      "img-src 'self' data: blob: *.shopify.com *.myshopify.com cdn.shopify.com files.myshopify.com images.unsplash.com *.cloudflare.com *.facebook.com *.facebook.net *.fbcdn.net",
      "connect-src 'self' *.shopify.com *.myshopify.com *.vercel-analytics.com *.google-analytics.com vercel.live *.vercel.live api.emailjs.com *.emailjs.com fonts.googleapis.com fonts.gstatic.com *.googleapis.com *.gstatic.com *.cloudflare.com *.facebook.com *.facebook.net connect.facebook.net",
      "frame-src 'self' *.facebook.com *.line.me *.google.com maps.google.com *.cloudflare.com challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' *.cloudflare.com *.facebook.com",
      "frame-ancestors 'self' *.facebook.com",
      "worker-src 'self' blob:",
      `report-uri ${cspReportPath}`,
      `report-to ${reportGroup}`,
    ].join('; ');

    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(self), payment=()',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      {
        key: 'X-Permitted-Cross-Domain-Policies',
        value: 'none',
      },
      {
        key: 'Server-Timing',
        value: 'total;dur=0',
      },
      // Performance & CDN Hints
      {
        key: 'Content-Security-Policy',
        value: cspValue,
      },
      // CSP reporting (safe hardening path)
      {
        key: 'Reporting-Endpoints',
        value: `${reportGroup}="${cspReportUrl}"`,
      },
      {
        key: 'Report-To',
        value: reportToValue,
      },
      {
        key: 'Content-Security-Policy-Report-Only',
        value: cspReportOnlyValue,
      },
    ];

    return [
      // Global headers
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Static assets - long-term caching
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      // Vercel Analytics & Monitoring Scripts - optimal caching
      {
        source: '/_vercel/insights/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        source: '/_vercel/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      // Public assets - medium-term caching
      {
        source: '/(.*\\.(?:js|css|woff2|woff|ttf|svg|png|jpg|jpeg|gif|webp|ico))$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      // Service Worker - must update immediately (avoid stale UI from old SW caches)
      // Placed after the generic static rules so it can override Cache-Control.
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        source: '/sw-dev.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      // API routes - cache policy by sensitivity (2026 best practice)
      // 1) Sensitive/admin/webhooks/revalidate: never cache
      {
        source: '/api/admin/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? cleanSiteUrl : 'http://localhost:3000',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With',
          },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
      {
        source: '/api/webhooks/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/api/revalidate',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/api/og-preview',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },

      // 2) Public GET endpoints: edge-cache with SWR (fast + resilient)
      {
        source: '/api/public/car-specs',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=0, s-maxage=600, stale-while-revalidate=86400, stale-if-error=86400',
          },
          { key: 'Vary', value: 'Accept-Encoding' },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? cleanSiteUrl : 'http://localhost:3000',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, X-Requested-With' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
      {
        source: '/api/public/car-status',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=0, s-maxage=600, stale-while-revalidate=86400, stale-if-error=86400',
          },
          { key: 'Vary', value: 'Accept-Encoding' },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? cleanSiteUrl : 'http://localhost:3000',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, X-Requested-With' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },

      // 3) OG image endpoint: cacheable (usually versioned via query)
      {
        source: '/api/og',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },

      // 4) Default API fallback: no-cache + CORS (safe)
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? cleanSiteUrl : 'http://localhost:3000',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With',
          },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },

  // Redirects for SEO and domain consistency
  async redirects() {
    return [
      // Legacy terms route -> canonical terms-of-service
      {
        source: '/terms',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/en/terms',
        destination: '/en/terms-of-service',
        permanent: true,
      },
      // Exclude static files from redirect
      {
        source: '/robots.txt',
        has: [
          {
            type: 'host',
            value: 'chiangmaiusedcar.com',
          },
        ],
        destination: 'https://www.chiangmaiusedcar.com/robots.txt',
        permanent: false, // Use 302 for static files
      },
      {
        source: '/sitemap.xml',
        has: [
          {
            type: 'host',
            value: 'chiangmaiusedcar.com',
          },
        ],
        destination: 'https://www.chiangmaiusedcar.com/sitemap.xml',
        permanent: false,
      },
      {
        source: '/sitemap-:path*.xml',
        has: [
          {
            type: 'host',
            value: 'chiangmaiusedcar.com',
          },
        ],
        destination: 'https://www.chiangmaiusedcar.com/sitemap-:path*.xml',
        permanent: false,
      },
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'chiangmaiusedcar.com',
          },
        ],
        destination: 'https://www.chiangmaiusedcar.com/:path*',
        permanent: true,
        statusCode: 301,
      },
    ];
  },

  // Internationalization support
  i18n: {
    locales: ['th', 'en'],
    defaultLocale: 'th',
    localeDetection: false,
  },

  // Production optimization
  // Enable production source maps so Lighthouse/devtools can provide better diagnostics.
  // Note: this makes `.map` files publicly reachable in production.
  productionBrowserSourceMaps: true,

  // Optimize for Vercel deployment
  trailingSlash: false,
};

module.exports = withBundleAnalyzer(nextConfig);
