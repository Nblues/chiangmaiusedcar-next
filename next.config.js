/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance & SEO optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  generateEtags: true,
  swcMinify: true,

  // Webpack configuration to prevent .html import issues and bundle optimization
  webpack: (config, { isServer, webpack }) => {
    config.module.rules.push({
      test: /\.html$/i,
      type: 'asset/source', // Treat .html files as string assets instead of modules
    });

    // Prevent Html component from being incorrectly bundled in shared chunks
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/document': false, // Disable next/document on client side to prevent Html import issues
      };
    }

    // Add plugin to ignore Html-related warnings during build
    config.plugins.push(
      new webpack.DefinePlugin({
        __NEXT_IGNORE_HTML_ERRORS__: JSON.stringify(true),
      })
    );

    // Bundle optimization - split chunks intelligently
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }

    // Bundle analyzer (conditionally)
    if (process.env.ANALYZE === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: `./analyze/${isServer ? 'server' : 'client'}.html`,
        })
      );
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
        hostname: 'kn-goodcar.myshopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.myshopify.com',
        pathname: '/**',
      },
      // Add specific trusted domains instead of wildcard for security
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false, // Disable for security unless specifically needed
    contentDispositionType: 'inline',
    loader: 'default',
    path: '/_next/image',
    unoptimized: false,
  },

  // Headers for 2025 cache strategy - aggressive fresh content + enhanced security
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
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      {
        key: 'Permissions-Policy',
        value:
          'camera=(), microphone=(), geolocation=(self), payment=(), usb=(), magnetometer=(), gyroscope=(), speaker=()',
      },
      // Enhanced Content Security Policy
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.vercel-analytics.com",
          "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
          "font-src 'self' fonts.gstatic.com",
          "img-src 'self' data: blob: *.shopify.com *.myshopify.com cdn.shopify.com files.myshopify.com images.unsplash.com",
          "connect-src 'self' *.shopify.com *.myshopify.com *.vercel-analytics.com *.google-analytics.com",
          "frame-src 'self' *.facebook.com *.line.me",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          'upgrade-insecure-requests',
        ].join('; '),
      },
      // Force fresh content for HTML pages
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
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
        ],
      },
      {
        source: '/sw-images.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*).webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'image/webp',
          },
        ],
      },
      {
        source: '/apple-touch-icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Disable problematic features during build
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // Internationalization support (prepared for future)
  i18n: {
    locales: ['th', 'en'],
    defaultLocale: 'th',
    localeDetection: false, // Disable auto-detection for now
  },

  // Enhanced experimental config for 2025
  experimental: {
    esmExternals: 'loose',
    optimizeCss: true,
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    // Enable future features
    serverComponentsExternalPackages: ['shopify-api-node'],
  },

  // Web vitals monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Output configuration for static export (if needed)
  // output: 'standalone', // Disabled for Windows symlink compatibility

  // Optimize for Vercel deployment
  trailingSlash: false,
};

module.exports = nextConfig;
