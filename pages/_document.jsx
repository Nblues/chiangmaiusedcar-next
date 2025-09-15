import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Cache busting timestamp for 2025 standards
  const buildTime = process.env.CUSTOM_BUILD_TIME || new Date().toISOString();
  const cacheVersion = `v=${encodeURIComponent(buildTime)}`;

  return (
    <Html lang="th">
      <Head>
        {/* Essential HTML5 Meta Tags for SEO 100/100 */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* 2025 Cache Control Meta Tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="cache-bust" content={buildTime} />

        {/* Force browser refresh on updates */}
        <meta name="last-modified" content={buildTime} />
        <meta name="etag" content={`"${buildTime}"`} />

        {/* Favicon Settings - 2025 Standards using favicon.webp */}
        <link rel="icon" type="image/webp" href="/favicon.webp" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.webp" />

        {/* Multi-size WebP icons for better SEO - 2025 Requirements */}
        <link rel="icon" type="image/webp" sizes="16x16" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="32x32" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="48x48" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="96x96" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="144x144" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="192x192" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="256x256" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="384x384" href="/favicon.webp" />
        <link rel="icon" type="image/webp" sizes="512x512" href="/favicon.webp" />

        {/* Apple Touch Icons - 2025 Standards */}
        <link rel="apple-touch-icon" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="57x57" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.webp" />

        {/* Android/Chrome Icons - 2025 PWA Standards */}
        <link rel="icon" sizes="192x192" href="/favicon.webp" />
        <link rel="icon" sizes="512x512" href="/favicon.webp" />

        {/* Microsoft Tiles - 2025 Edge Standards */}
        <meta name="msapplication-TileImage" content="/favicon.webp" />
        <meta name="msapplication-TileColor" content="#1a237e" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* 2025 Search Engine Favicon Optimization */}
        <meta name="msapplication-square70x70logo" content="/favicon.webp" />
        <meta name="msapplication-square150x150logo" content="/favicon.webp" />
        <meta name="msapplication-wide310x150logo" content="/favicon.webp" />
        <meta name="msapplication-square310x310logo" content="/favicon.webp" />

        {/* PWA Manifest with cache busting - 2025 Standards */}
        <link rel="manifest" href={`/manifest.json?${cacheVersion}`} />
        <link rel="manifest" href={`/site.webmanifest?${cacheVersion}`} />

        {/* PWA Meta Tags - 2025 Standards */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ครูหนึ่งรถสวย" />

        {/* PWA Theme */}
        <meta name="theme-color" content="#ff5252" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ff5252" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#ff5252" />

        {/* Enhanced Google Search Console & SEO */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="bingbot" content="index, follow" />

        {/* Site Verification */}
        <meta name="google-site-verification" content="your-google-verification-code" />

        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="//cdn.shopify.com" />
        <link rel="dns-prefetch" href="//files.myshopify.com" />

        {/* 2025 Performance Optimization */}
        <link rel="dns-prefetch" href="//vercel.com" />
        <link rel="dns-prefetch" href="//analytics.vercel.com" />

        {/* Critical resource preconnections */}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://files.myshopify.com" />
      </Head>
      <body>
        {/* Skip link for accessibility */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-2 focus:bg-white focus:text-primary focus:shadow-lg focus:border focus:border-primary focus:rounded"
        >
          ข้ามไปยังเนื้อหา
        </a>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
