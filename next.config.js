/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

// Avoid mutating globals at config-load time to prevent SSR bundle issues

const nextConfig = {
  // Performance & SEO optimizations
  poweredByHeader: false,
  reactStrictMode: true, // Always enable for better development experience
  compress: true,
  generateEtags: true,
  swcMinify: true, // Available in Next.js 14

  // Environment variables validation
  env: {
    CUSTOM_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_BUILD_ENV: process.env.NODE_ENV || 'development',
  },

  // Bundle optimization - reduce imports to only what's used
  experimental: {
    // Next.js 2025 features
    serverComponentsExternalPackages: ['sharp'],
    webVitalsAttribution: ['CLS', 'LCP'],
    optimizePackageImports: ['lucide-react', 'date-fns'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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

  // Headers for better caching and SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=()',
          },
        ],
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
        source: '/site.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
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
    ignoreDuringBuilds: true, // ปิดชั่วคราวเพื่อทดสอบ build
  },
  typescript: {
    ignoreBuildErrors: false, // Keep type checking for code quality
  },

  // Webpack optimization for better performance and stability
  webpack(config, { dev, isServer }) {
    // Reduce disk usage: disable persistent filesystem cache in production
    if (!dev) {
      config.cache = false;
    }
    // Critical fix for 'self is not defined' error ใน vendors.js
    if (isServer) {
      // ใช้ DefinePlugin เพื่อแทนที่ self ด้วย global เฉพาะใน server
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.DefinePlugin({
          self: 'global',
          'typeof self': '"object"',
          'self.webpackChunk_N_E': 'global.webpackChunk_N_E || []',
        })
      );

      // ปิด source maps ใน server เพื่อป้องกัน webpack runtime errors
      config.devtool = false;

      // เพิ่ม webpack optimization สำหรับ server bundle
      config.optimization = {
        ...config.optimization,
        minimize: false, // ปิด minification ใน server เพื่อป้องกัน runtime errors
        splitChunks: false, // ปิด chunk splitting ใน server
      };

      // Node.js fallbacks สำหรับ server environment
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        util: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    // Bundle analyzer (when ANALYZE=true)
    if (process.env.ANALYZE === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html',
        })
      );
    }

    // Fix Fast Refresh issues - but keep CSS compilation working
    if (dev && !isServer) {
      // Keep webpack cache for CSS but invalidate JS modules
      config.cache = {
        type: 'memory',
      };

      // Ensure modules are properly reloaded
      config.optimization.moduleIds = 'named';
      config.optimization.chunkIds = 'named';
    }

    // Production optimizations
    if (!dev) {
      if (!isServer) {
        // Apply aggressive chunk splitting only on the client build
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                priority: 10,
                reuseExistingChunk: true,
              },
              common: {
                name: 'common',
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          },
        };
      } else {
        // Ensure server build does NOT create shared vendor chunks
        config.optimization = {
          ...config.optimization,
          splitChunks: false,
          minimize: false,
        };
      }
    }

    // Resolve fallbacks for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Optimize for Vercel deployment
  trailingSlash: false,

  // Redirects for SEO (optional)
  async redirects() {
    return [
      // Redirect old paths to new structure if needed
      {
        source: '/cars/:handle',
        destination: '/car/:handle',
        permanent: true,
      },
    ];
  },

  // Rewrites for API optimization (optional)
  async rewrites() {
    return [
      {
        source: '/api/shopify/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Enable output file tracing for Vercel (Next.js 14)
  outputFileTracing: true,

  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,

  // Bundle size optimization
  onDemandEntries: {
    // Keep pages in memory for 60 seconds
    maxInactiveAge: 60 * 1000,
    // Keep at most 5 pages in memory
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;
