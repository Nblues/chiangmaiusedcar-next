module.exports = {
  siteUrl: process.env.SITE_URL || 'https://chiangmaiusedcar.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,

  // Enhanced robots.txt with consistent URLs
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
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'bingbot',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://chiangmaiusedcar.com/sitemap-0.xml',
      'https://chiangmaiusedcar.com/sitemap-cars.xml',
      'https://chiangmaiusedcar.com/sitemap-images.xml',
    ],
    // Add host directive for consistency
    host: 'https://chiangmaiusedcar.com',
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
    '/admin*',
  ],

  // Dynamic paths generation including cars
  additionalPaths: async config => {
    const paths = [];

    // Static pages with enhanced priority
    const staticPages = [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/all-cars', priority: 0.9, changefreq: 'daily' },
      { path: '/contact', priority: 0.9, changefreq: 'weekly' },
      { path: '/about', priority: 0.8, changefreq: 'monthly' },
      { path: '/promotion', priority: 0.9, changefreq: 'daily' },
      { path: '/credit-check', priority: 0.8, changefreq: 'weekly' },
      { path: '/payment-calculator', priority: 0.8, changefreq: 'weekly' },
    ];

    // Add static pages
    for (const page of staticPages) {
      paths.push(await config.transform(config, page.path, page));
    }

    // Dynamic car URLs (if cars data is available)
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getAllCars } = require('./lib/shopify');
      const cars = await getAllCars();

      for (const car of cars) {
        if (car.handle) {
          paths.push(
            await config.transform(config, `/car/${car.handle}`, {
              priority: 0.8,
              changefreq: 'weekly',
              lastmod: car.updatedAt || new Date().toISOString(),
            })
          );
        }
      }
    } catch (error) {
      console.warn('Warning: Could not load cars for sitemap generation:', error.message);
    }

    return paths;
  },
  // Enhanced transform function with better lastmod handling
  transform: async (config, path, options = {}) => {
    // Default values
    let priority = options.priority || 0.7;
    let changefreq = options.changefreq || 'daily';
    let lastmod = options.lastmod || new Date().toISOString();

    // Override based on path patterns
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
      lastmod,
      alternateRefs: [
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'th',
        },
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'th-TH',
        },
      ],
      // Enhanced metadata for better SEO
      images: path.startsWith('/car/')
        ? [
            {
              loc: `${config.siteUrl}/herobanner/chiangmaiusedcar.webp`,
              caption: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
            },
          ]
        : undefined,
    };
  },
};
