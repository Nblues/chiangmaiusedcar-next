/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force port 3000 for development
  env: {
    PORT: '3000',
  },
  
  // Optimize development performance
  experimental: {
    // Reduce memory usage
    optimizePackageImports: ['react-icons', 'lodash'],
  },
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Faster compilation
    webpack: (config, { dev }) => {
      if (dev) {
        // Reduce webpack memory usage
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        };
      }
      return config;
    },
  }),
  
  // Image optimization
  images: {
    domains: ['cdn.shopify.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Reduce build output
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
}

module.exports = nextConfig
