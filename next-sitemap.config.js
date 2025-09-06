module.exports = {
  siteUrl: process.env.SITE_URL || 'https://chiangmaiusedcar.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api*', '/_next*', '/secret*', '/private*', '/drafts*', '/admin*'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api*', '/admin*'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://chiangmaiusedcar.com/sitemap-0.xml',
      'https://chiangmaiusedcar.com/sitemap-cars.xml',
      'https://chiangmaiusedcar.com/sitemap-images.xml',
    ],
  },
  exclude: [
    '/api*',
    '/_next*',
    '/secret*',
    '/private*',
    '/drafts*',
    '/404',
    '/500',
    '/_document',
    '/_app',
    '/_error',
  ],
  additionalPaths: async config => [
    await config.transform(config, '/'),
    await config.transform(config, '/all-cars'),
    await config.transform(config, '/contact'),
    await config.transform(config, '/about'),
    await config.transform(config, '/promotion'),
    await config.transform(config, '/credit-check'),
    await config.transform(config, '/payment-calculator'),
  ],
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
    } else if (['/all-cars', '/contact', '/promotion'].includes(path)) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (['/about', '/credit-check', '/payment-calculator'].includes(path)) {
      priority = 0.8;
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
