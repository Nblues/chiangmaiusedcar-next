module.exports = {
  siteUrl: process.env.SITE_URL || 'https://chiangmaiusedcar.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/_next',
          '/secret',
          '/private/*',
          '/drafts',
        ],
      },
    ],
    additionalSitemaps: [
      'https://chiangmaiusedcar.com/sitemap.xml',
      'https://chiangmaiusedcar.com/server-sitemap.xml',
    ],
  },
  exclude: [
    '/admin',
    '/api',
    '/_next',
    '/secret',
    '/private/*',
    '/drafts',
  ],
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'th',
        },
      ],
    };
  },
};
