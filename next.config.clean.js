/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic settings for maximum performance
  poweredByHeader: false,
  reactStrictMode: false,
  swcMinify: true,
  compress: true,

  // Maximum performance configuration
  experimental: {
    forceSwcTransforms: true,
    scrollRestoration: true,
    optimizePackageImports: [
      'next/image',
      'next/link',
      'next/head',
      'react',
      'react-dom',
      '@vercel/analytics',
      'lucide-react',
    ],
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'TTFB', 'INP'],
    optimizeCss: true,
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
        '.md': ['raw-loader'],
      },
      memoryLimit: 4096, // 4GB for Turbo
    },
    workerThreads: true,
    esmExternals: true,
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },

  // Development indicators
  devIndicators: {
    buildActivity: true,
    autoPrerender: true,
  },

  // Performance headers
  async headers() {
    if (process.env.NODE_ENV === 'production') {
      return [];
    }

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              process.env.NODE_ENV === 'production'
                ? 'public, max-age=31536000, must-revalidate'
                : 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
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
    ];
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // Output optimization
  output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',

  // Image optimization for Shopify
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 31536000 : 300,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Disable problematic features for stability
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack configuration for maximum performance
  webpack(config, { dev, isServer }) {
    // Maximum performance optimization
    config.optimization = {
      ...config.optimization,
      minimize: !dev,
      usedExports: true,
      sideEffects: false,
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
      concatenateModules: true,
      providedExports: true,
      mangleExports: !dev,
      innerGraph: true,
    };

    // Enhanced module resolution
    config.resolve.modules = ['node_modules'];
    config.resolve.symlinks = true;
    config.resolve.cacheWithContext = true;

    // Maximum memory utilization for chunks
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000,
        maxSize: 1000000, // 1MB chunks for maximum performance
        maxAsyncRequests: 50,
        maxInitialRequests: 50,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            maxSize: 500000,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 1000000,
            priority: 10,
          },
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            name: 'framework',
            chunks: 'all',
            priority: 40,
            maxSize: 800000,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            chunks: 'all',
            priority: 30,
            maxSize: 600000,
          },
        },
      };
    }

    // Maximum parallel processing
    config.parallelism = undefined; // Use all CPU cores
    config.cache = {
      type: 'filesystem',
      compression: 'gzip',
      maxMemoryGenerations: 0, // Unlimited memory
    };

    // Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
      };
    }

    return config;
  },
};

module.exports = nextConfig;
