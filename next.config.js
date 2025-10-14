/* eslint-disable */
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
  compress: false, // Let Vercel handle compression (Brotli + Gzip)
  generateEtags: true,
  swcMinify: true,

  // Modern JavaScript - Aggressive optimization for modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Asset prefix for Cloudflare CDN
  // Removed assetPrefix to fix static file loading

  // Enhanced TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // Enhanced ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during production build
    dirs: ['pages', 'components', 'lib', 'utils'],
  },

  // Webpack configuration for bundle optimization and HMR
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

      // ลด memory usage ใน dev mode
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
        key: 'Link',
        value: [
          '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
          '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
          '<https://cdn.shopify.com>; rel=preconnect; crossorigin',
          '<https://images.unsplash.com>; rel=preconnect; crossorigin',
          '<https://va.vercel-scripts.com>; rel=preconnect; crossorigin',
        ].join(', '),
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.vercel-analytics.com va.vercel-scripts.com *.emailjs.com *.cloudflare.com challenges.cloudflare.com *.facebook.com *.facebook.net *.fbcdn.net *.shopify.com connect.facebook.net",
          "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net *.cloudflare.com *.facebook.com *.shopify.com",
          "font-src 'self' fonts.gstatic.com cdn.jsdelivr.net data:",
          "img-src 'self' data: blob: *.shopify.com *.myshopify.com cdn.shopify.com files.myshopify.com images.unsplash.com *.cloudflare.com *.facebook.com *.facebook.net *.fbcdn.net",
          "connect-src 'self' *.shopify.com *.myshopify.com *.vercel-analytics.com *.google-analytics.com api.emailjs.com *.emailjs.com fonts.googleapis.com fonts.gstatic.com *.googleapis.com *.gstatic.com *.cloudflare.com *.facebook.com *.facebook.net connect.facebook.net",
          "frame-src 'self' *.facebook.com *.line.me *.google.com maps.google.com *.cloudflare.com challenges.cloudflare.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self' *.cloudflare.com *.facebook.com",
          "frame-ancestors 'self' *.facebook.com",
          "worker-src 'self' blob:",
        ].join('; '),
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
      // HTML pages - short-term caching with revalidation
      {
        source: '/((?!api|_next/static).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding, Accept',
          },
        ],
      },
      // API routes - no caching + CORS
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value:
              process.env.NODE_ENV === 'production'
                ? process.env.SITE_URL || 'https://www.chiangmaiusedcar.com'
                : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
    ];
  },

  // Redirects for SEO and domain consistency
  async redirects() {
    return [
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
      // Legacy article management paths -> new admin dashboard
      {
        source: '/admin/articles',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/admin/articles/new',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/admin/articles/:path*',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },

  // Internationalization support
  i18n: {
    locales: ['th', 'en'],
    defaultLocale: 'th',
    localeDetection: false,
  },

  // Enhanced experimental config - 2025 standards + Core Web Vitals optimization
  experimental: {
    esmExternals: 'loose',
    scrollRestoration: true,
    serverComponentsExternalPackages: ['shopify-api-node'],
    // Prevent Jest worker errors in development
    ...(process.env.NODE_ENV === 'development' && {
      workerThreads: false,
      cpus: 1,
    }),
  },

  // Production optimization
  productionBrowserSourceMaps: false,
  distDir: '.next',

  // Optimize for Vercel deployment
  trailingSlash: false,
};

module.exports = withBundleAnalyzer(nextConfig);
