/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force port 3000 for development
  env: {
    PORT: '3000',
    SITE_URL: process.env.SITE_URL || 'https://chiangmaiusedcar.com',
  },

  // Optimize development performance
  experimental: {
    // Type-safe routes
    typedRoutes: true,
    // ลบ serverActions ออก เพราะ Next.js 14 มีอยู่แล้ว
    optimizePackageImports: ['react-icons', 'lodash'],
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'kn-goodcar.com' },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Reduce build output
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,
  trailingSlash: false,
  reactStrictMode: true,

  // Custom webpack configuration
  webpack(config, { dev, isServer }) {
    // Return config without modifications for now
    return config;
  },
};

module.exports = nextConfig;
