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
        disallow: ['/admin*', '/api*', '/_next*', '/secret*', '/private*', '/drafts*'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://chiangmaiusedcar.com/sitemap-0.xml',
      'https://chiangmaiusedcar.com/sitemap-images.xml',
    ],
  },
  exclude: ['/admin*', '/api*', '/_next*', '/secret*', '/private*', '/drafts*', '/404', '/500'],
  transform: async (config, path) => {
    // กำหนด priority ตามประเภทหน้า
    let priority = 0.7;
    let changefreq = 'daily';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/car/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.startsWith('/blog/')) {
      priority = 0.6;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
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
