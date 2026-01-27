module.exports = {
  // When building on Windows we emit Next build artifacts to a different distDir
  // for stability; next-sitemap must read manifests from the same directory.
  sourceDir: process.platform === 'win32' ? '.next-win' : '.next',
  // Sanitize siteUrl to avoid trailing spaces/slashes causing invalid URLs in sitemaps
  siteUrl: String(process.env.SITE_URL || 'https://www.chiangmaiusedcar.com')
    .trim()
    .replace(/\/+$/g, ''),
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
          '/_next/data/*',
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
        disallow: [
          '/api*',
          '/_next/data/*',
          '/admin*',
          '/keyword-audit',
          '/api-dashboard',
          '/license',
        ],
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
        allow: [
          '/',
          '/all-cars',
          '/car/*',
          '/used-cars-chiang-mai',
          '/used-cars-chiang-mai-brand/*',
          '/about',
          '/contact',
        ],
        disallow: ['/api*', '/admin*', '/keyword-audit', '/api-dashboard', '/license'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/all-cars',
          '/car/*',
          '/used-cars-chiang-mai',
          '/used-cars-chiang-mai-brand/*',
          '/about',
          '/contact',
        ],
        disallow: ['/api*', '/admin*', '/keyword-audit', '/api-dashboard', '/license'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bard',
        allow: [
          '/',
          '/all-cars',
          '/car/*',
          '/used-cars-chiang-mai',
          '/used-cars-chiang-mai-brand/*',
          '/about',
          '/contact',
        ],
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
    additionalSitemaps: ['https://www.chiangmaiusedcar.com/sitemap-images.xml'],
    // Add host directive for consistency
    host: 'www.chiangmaiusedcar.com',
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
    // i18n: Exclude locale-prefixed routes from sitemap entries.
    // We publish the default-locale URL as <loc> and provide /en variants via hreflang alternates.
    '/en*',
    '/404',
    '/500',
    '/_document',
    '/_app',
    '/_error',
    '/payment-calculator-new',
    '/terms',
    '/admin*',
    '/keyword-audit',
    '/test-social-images',
    '/api-dashboard',
    '/license',
  ],

  // Dynamic paths generation including cars
  additionalPaths: async config => {
    const paths = [];

    // Static pages - Bing 2025: only lastmod matters, not priority/changefreq
    const staticPages = [
      { path: '/', lastmod: new Date().toISOString() }, // Always fresh
      { path: '/used-cars-chiang-mai', lastmod: new Date().toISOString() }, // Primary organic landing
      { path: '/used-cars-chiang-mai-brand/toyota', lastmod: new Date().toISOString() },
      { path: '/used-cars-chiang-mai-brand/honda', lastmod: new Date().toISOString() },
      { path: '/used-cars-chiang-mai-brand/isuzu', lastmod: new Date().toISOString() },
      { path: '/used-cars-chiang-mai-brand/nissan', lastmod: new Date().toISOString() },
      { path: '/used-cars-chiang-mai-brand/mazda', lastmod: new Date().toISOString() },
      { path: '/used-cars-chiang-mai-brand/mitsubishi', lastmod: new Date().toISOString() },
      { path: '/used-cars-chiang-mai-brand/ford', lastmod: new Date().toISOString() },
      { path: '/contact', lastmod: '2025-10-02T00:00:00+00:00' }, // Static content
      { path: '/about', lastmod: '2025-10-02T00:00:00+00:00' }, // Static content
      { path: '/promotion', lastmod: new Date().toISOString() }, // Frequently updated
      { path: '/credit-check', lastmod: '2025-10-02T00:00:00+00:00' }, // Static content
      { path: '/payment-calculator', lastmod: '2025-10-02T00:00:00+00:00' }, // Static content
      { path: '/terms-of-service', lastmod: new Date().toISOString() }, // Terms & image license
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

      const carsPerPage = 8; // Must match pages/all-cars.jsx
      const totalPages = Math.ceil((cars?.length || 0) / carsPerPage);
      const lastModifiedAllCars = (() => {
        try {
          let latestTs = 0;
          for (const car of cars || []) {
            const ts = car?.updatedAt ? new Date(car.updatedAt).getTime() : 0;
            if (Number.isFinite(ts) && ts > latestTs) latestTs = ts;
          }
          return latestTs > 0 ? new Date(latestTs).toISOString() : new Date().toISOString();
        } catch {
          return new Date().toISOString();
        }
      })();

      // Brand landing pagination pages (page 2..N)
      // NOTE: We keep page=1 as static entries above; this only adds deeper pages for discovery.
      const brandConfigs = [
        { slug: 'toyota', tokens: ['toyota'] },
        { slug: 'honda', tokens: ['honda'] },
        { slug: 'isuzu', tokens: ['isuzu'] },
        { slug: 'nissan', tokens: ['nissan'] },
        { slug: 'mazda', tokens: ['mazda'] },
        { slug: 'mitsubishi', tokens: ['mitsubishi'] },
        { slug: 'ford', tokens: ['ford'] },
      ];
      const brandPerPage = 24; // Must match pages/used-cars-chiang-mai-brand/[brand].jsx
      const maxBrandPagesInSitemap = 100;

      for (const brand of brandConfigs) {
        const tokens = brand.tokens || [];
        const brandCars = (cars || []).filter(car => {
          const hay = `${car?.vendor || ''} ${car?.brand || ''} ${car?.title || ''}`.toLowerCase();
          return tokens.some(t => hay.includes(t));
        });

        const brandTotalPages = Math.ceil((brandCars.length || 0) / brandPerPage);
        const cappedBrandTotalPages = Math.min(brandTotalPages, maxBrandPagesInSitemap);
        if (cappedBrandTotalPages <= 1) continue;

        const brandLastmod = (() => {
          try {
            let latestTs = 0;
            for (const car of brandCars) {
              const ts = car?.updatedAt ? new Date(car.updatedAt).getTime() : 0;
              if (Number.isFinite(ts) && ts > latestTs) latestTs = ts;
            }
            return latestTs > 0 ? new Date(latestTs).toISOString() : lastModifiedAllCars;
          } catch {
            return lastModifiedAllCars;
          }
        })();

        for (let page = 2; page <= cappedBrandTotalPages; page += 1) {
          paths.push(
            await config.transform(
              config,
              `/used-cars-chiang-mai-brand/${brand.slug}?page=${page}`,
              {
                lastmod: brandLastmod,
              }
            )
          );
        }
      }

      // Catalog page + pagination pages (page 2..N)
      paths.push(
        await config.transform(config, '/all-cars', {
          lastmod: lastModifiedAllCars,
        })
      );

      // NOTE: Sitemap can include query URLs, but avoid generating an excessive number.
      const maxCatalogPagesInSitemap = 500;
      const cappedTotalPages = Math.min(totalPages, maxCatalogPagesInSitemap);

      if (cappedTotalPages > 1) {
        for (let page = 2; page <= cappedTotalPages; page += 1) {
          paths.push(
            await config.transform(config, `/all-cars?page=${page}`, {
              lastmod: lastModifiedAllCars,
            })
          );
        }
      }

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

      // Fallback: ensure catalog page exists even if Shopify fetch fails
      paths.push(
        await config.transform(config, '/all-cars', { lastmod: new Date().toISOString() })
      );
    }

    return paths;
  },
  // Bing 2025 compliant transform: only lastmod matters for AI-powered crawling
  transform: async (config, path, options = {}) => {
    // Use provided lastmod or fallback to current time
    const lastmod = options.lastmod || new Date().toISOString();

    // Ensure ISO 8601 format with timezone (Bing recommendation)
    const formattedLastmod = new Date(lastmod).toISOString();

    // Percent-encode non-ASCII characters (Thai/emoji) for sitemap URL validity.
    // encodeURI preserves URL path separators while encoding characters like spaces/emoji.
    const encodedPath = (() => {
      try {
        return encodeURI(path);
      } catch {
        return path;
      }
    })();

    return {
      loc: encodedPath,
      lastmod: formattedLastmod, // Only field that matters for Bing 2025
      // Removed: changefreq (ignored by Bing)
      // Removed: priority (ignored by Bing)
      // NOTE: next-sitemap treats alternateRefs.href as a base URL and appends the loc/path.
      // Keep these as bases to avoid duplicated paths (e.g. /all-cars/all-cars).
      alternateRefs: [
        {
          href: 'https://www.chiangmaiusedcar.com',
          hreflang: 'th',
        },
        {
          href: 'https://www.chiangmaiusedcar.com',
          hreflang: 'th-TH',
        },
        {
          href: 'https://www.chiangmaiusedcar.com/en',
          hreflang: 'en',
        },
        {
          href: 'https://www.chiangmaiusedcar.com/en',
          hreflang: 'en-US',
        },
        {
          href: 'https://www.chiangmaiusedcar.com',
          hreflang: 'x-default',
        },
      ],
      images: undefined, // Prevents undefined URLs
    };
  },
};
