/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance & SEO optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compress: false, // Let Vercel handle compression (Brotli + Gzip)
  generateEtags: true,
  swcMinify: true,

  // Enhanced TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // Enhanced ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'utils'],
  },

  // Webpack configuration for bundle optimization
  // WebSocket HMR Configuration
  webpack: (config, { dev, isServer }) => {
    // Existing webpack configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // HMR WebSocket configuration for development
    if (dev && !isServer) {
      config.devServer = {
        ...config.devServer,
        hot: true,
        liveReload: true,
        client: {
          webSocketURL: 'ws://localhost:3000/_next/webpack-hmr',
          overlay: {
            errors: true,
            warnings: false,
          },
          reconnect: 3,
        },
      };

      // Ensure HMR WebSocket endpoint is properly configured
      if (config.devServer) {
        config.devServer.allowedHosts = 'all';
        config.devServer.headers = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        };
      }
    }

    return config;
  },

  // Environment variables validation
  env: {
    CUSTOM_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_BUILD_ENV: process.env.NODE_ENV || 'development',
  },

  // Image optimization - enhanced for speed and security
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
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 180, 192, 256, 320, 384, 512],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: false,
    contentDispositionType: 'inline',
    loader: 'default',
    path: '/_next/image',
    unoptimized: false,
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
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Server-Timing',
        value: 'total;dur=0',
      },
      // Performance & CDN Hints
      {
        key: 'Link',
        value: [
          '</fonts.googleapis.com>; rel=preconnect; crossorigin',
          '</fonts.gstatic.com>; rel=preconnect; crossorigin',
          '</cdn.shopify.com>; rel=preconnect; crossorigin',
          '</images.unsplash.com>; rel=preconnect; crossorigin',
          '</va.vercel-scripts.com>; rel=preconnect; crossorigin',
        ].join(', '),
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data:",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.vercel-analytics.com va.vercel-scripts.com *.emailjs.com *.cloudflare.com challenges.cloudflare.com *.facebook.com *.fbcdn.net",
          "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net *.cloudflare.com *.facebook.com",
          "font-src 'self' fonts.gstatic.com cdn.jsdelivr.net data:",
          "img-src 'self' data: blob: *.shopify.com *.myshopify.com cdn.shopify.com files.myshopify.com images.unsplash.com *.cloudflare.com *.facebook.com *.fbcdn.net",
          "connect-src 'self' *.shopify.com *.myshopify.com *.vercel-analytics.com *.google-analytics.com api.emailjs.com *.emailjs.com fonts.googleapis.com fonts.gstatic.com *.googleapis.com *.gstatic.com *.cloudflare.com *.facebook.com",
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
          {
            key: 'ETag',
            value: `"${Date.now()}"`,
          },
        ],
      },
      // API routes - no caching
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
        ],
      },
    ];
  },

  // Redirects for SEO and domain consistency - DISABLED for performance
  async redirects() {
    return [
      // Temporary disabled to avoid redirect delays
      // {
      //   source: '/(.*)',
      //   has: [
      //     {
      //       type: 'host',
      //       value: 'chiangmaiusedcar.com',
      //     },
      //   ],
      //   destination: 'https://www.chiangmaiusedcar.com/:path*',
      //   permanent: true,
      //   statusCode: 301,
      // },
    ];
  },

  // Internationalization support
  i18n: {
    locales: ['th', 'en'],
    defaultLocale: 'th',
    localeDetection: false,
  },

  // Enhanced experimental config - 2025 standards + TBT optimization
  experimental: {
    esmExternals: 'loose',
    optimizeCss: true,
    scrollRestoration: true,
    serverComponentsExternalPackages: ['shopify-api-node'],
    optimizePackageImports: [
      '@headlessui/react',
      'framer-motion',
      '@vercel/analytics',
      'react-dom',
    ],
    // Reduce Total Blocking Time
    turbo: {
      rules: {
        '*.{js,jsx,ts,tsx}': {
          loaders: ['swc-loader'],
          options: {
            jsc: {
              target: 'es2020',
              loose: true,
              externalHelpers: true,
            },
            minify: true,
          },
        },
      },
    },
  },

  // Production optimization
  productionBrowserSourceMaps: false,
  distDir: '.next',

  // Optimize for Vercel deployment
  trailingSlash: false,
};

module.exports = nextConfig;
