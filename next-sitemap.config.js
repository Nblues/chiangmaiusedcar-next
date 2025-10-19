module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.chiangmaiusedcar.com',
  generateRobotsTxt: true, // เปิด auto-generate robots.txt
  generateIndexSitemap: true,
  sitemapSize: 7000,
  // Bing 2025: changefreq and priority are ignored - removed to reduce sitemap size
  autoLastmod: true, // Use true lastmod from content, not sitemap generation time

  // Enhanced robots.txt with 2025 AI bot support
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api*',
          '/_next*',
          '/secret*',
          '/private*',
          '/drafts*',
          '/admin*',
          '/keyword-audit',
          '/api-dashboard',
          '/license',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api*', '/admin*', '/keyword-audit', '/api-dashboard', '/license'],
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
      // AI Crawlers 2025
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/all-cars', '/car/*', '/about', '/contact'],
        disallow: ['/api*', '/admin*', '/keyword-audit', '/api-dashboard', '/license'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/all-cars', '/car/*', '/about', '/contact'],
        disallow: ['/api*', '/admin*', '/keyword-audit', '/api-dashboard', '/license'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bard',
        allow: ['/', '/all-cars', '/car/*', '/about', '/contact'],
        disallow: ['/api*', '/admin*', '/keyword-audit', '/api-dashboard', '/license'],
        crawlDelay: 1,
      },
      // Social Commerce
      {
        userAgent: 'Instagram',
        allow: ['/', '/car/*'],
        disallow: ['/api*', '/keyword-audit', '/api-dashboard', '/license'],
        crawlDelay: 3,
      },
      {
        userAgent: 'TikTokBot',
        allow: ['/', '/car/*'],
        disallow: ['/api*', '/keyword-audit', '/api-dashboard', '/license'],
        crawlDelay: 3,
      },
    ],
    additionalSitemaps: [
      'https://www.chiangmaiusedcar.com/sitemap-0.xml',
      'https://www.chiangmaiusedcar.com/sitemap-cars.xml',
      'https://www.chiangmaiusedcar.com/sitemap-images.xml',
    ],
    // Add host directive for consistency
    host: 'https://www.chiangmaiusedcar.com',
    // 2025 enhancement: crawl delay for different bots
    transformRobotsTxt: async (config, robotsTxt) => {
      // Fix broken sitemap URLs and add comments
      return (
        robotsTxt
          .replace('User-agent: *', `# Enhanced for AI Crawlers 2025\nUser-agent: *`)
          // Fix broken URLs (remove newlines in the middle of URLs)
          .replace(/Sitemap:\s*([^\n]*)\n\s*\/([^\n]+)/g, 'Sitemap: $1/$2')
          // Fix URLs without path - add /sitemap.xml
          .replace(/Sitemap:\s+(https?:\/\/[^/\s]+)\s*$/gm, 'Sitemap: $1/sitemap.xml')
          // Replace localhost with production URL
          .replace(/http:\/\/localhost:3000/g, 'https://www.chiangmaiusedcar.com')
          // Fix non-www URLs to use www
          .replace(/https:\/\/chiangmaiusedcar\.com(?!\/)/g, 'https://www.chiangmaiusedcar.com')
          // Add comment before each sitemap
          .replace(/\nSitemap:/g, '\n\n# Additional XML Sitemaps\nSitemap:')
      );
    },
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
    '/payment-calculator-new',
    '/admin*',
  ],

  // Dynamic paths generation including cars
  additionalPaths: async config => {
    const paths = [];

    // Static pages - Bing 2025: only lastmod matters, not priority/changefreq
    const staticPages = [
      { path: '/', lastmod: new Date().toISOString() }, // Always fresh
      { path: '/all-cars', lastmod: new Date().toISOString() }, // Daily car updates
      { path: '/contact', lastmod: '2025-10-02T00:00:00+00:00' }, // Static content
      { path: '/about', lastmod: '2025-10-02T00:00:00+00:00' }, // Static content
      { path: '/promotion', lastmod: new Date().toISOString() }, // Frequently updated
      { path: '/credit-check', lastmod: '2025-10-02T00:00:00+00:00' }, // Static content
      { path: '/payment-calculator', lastmod: '2025-10-02T00:00:00+00:00' }, // Static content
    ];

    // Add static pages
    for (const page of staticPages) {
      paths.push(await config.transform(config, page.path, page));
    }

    // Dynamic car URLs (if cars data is available)
    try {
      // Use ESM-compatible dynamic import to load Shopify helper in Node 20
      const { getAllCars } = await import('./lib/shopify.mjs');
      const cars = await getAllCars();

      for (const car of cars) {
        if (car.handle) {
          // Bing 2025: Use real updatedAt from Shopify for accurate freshness signals
          const lastModified = car.updatedAt || new Date().toISOString();
          paths.push(
            await config.transform(config, `/car/${car.handle}`, {
              lastmod: lastModified,
            })
          );
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('Warning: Could not load cars for sitemap generation:', error?.message);
      }
    }

    return paths;
  },
  // Bing 2025 compliant transform: only lastmod matters for AI-powered crawling
  transform: async (config, path, options = {}) => {
    // Use provided lastmod or fallback to current time
    const lastmod = options.lastmod || new Date().toISOString();

    // Ensure ISO 8601 format with timezone (Bing recommendation)
    const formattedLastmod = new Date(lastmod).toISOString();

    return {
      loc: path,
      lastmod: formattedLastmod, // Only field that matters for Bing 2025
      // Removed: changefreq (ignored by Bing)
      // Removed: priority (ignored by Bing)
      alternateRefs: [
        {
          href: `https://www.chiangmaiusedcar.com${path}`,
          hreflang: 'th',
        },
        {
          href: `https://www.chiangmaiusedcar.com${path}`,
          hreflang: 'th-TH',
        },
      ],
      images: undefined, // Prevents undefined URLs
    };
  },
};
