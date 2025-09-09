import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Cache busting timestamp for 2025 standards
  const buildTime = process.env.CUSTOM_BUILD_TIME || new Date().toISOString();
  const cacheVersion = `v=${encodeURIComponent(buildTime)}`;

  return (
    <Html lang="th">
      <Head>
        {/* Default viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* 2025 Cache Control Meta Tags */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="cache-bust" content={buildTime} />

        {/* Force browser refresh on updates */}
        <meta name="last-modified" content={buildTime} />
        <meta name="etag" content={`"${buildTime}"`} />

        {/* Favicon Settings - Enhanced for Google Search with cache busting */}
        <link rel="icon" type="image/x-icon" href={`/favicon.ico?${cacheVersion}`} />
        <link rel="icon" type="image/webp" href={`/favicon.webp?${cacheVersion}`} />
        <link rel="shortcut icon" href={`/favicon.ico?${cacheVersion}`} />

        {/* Preload favicon for faster loading */}
        <link rel="preload" href={`/favicon.webp?${cacheVersion}`} as="image" type="image/webp" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href={`/favicon.webp?${cacheVersion}`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`/favicon.webp?${cacheVersion}`} />

        {/* Android/Chrome Icons */}
        <link rel="icon" sizes="192x192" href={`/favicon.webp?${cacheVersion}`} />
        <link rel="icon" sizes="512x512" href={`/favicon.webp?${cacheVersion}`} />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content={`/favicon.webp?${cacheVersion}`} />
        <meta name="msapplication-TileColor" content="#ff5252" />
        <meta name="msapplication-config" content={`/browserconfig.xml?${cacheVersion}`} />

        {/* PWA Manifest with cache busting */}
        <link rel="manifest" href={`/manifest.json?${cacheVersion}`} />

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
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="//cdn.shopify.com" />
        <link rel="dns-prefetch" href="//files.myshopify.com" />

        {/* 2025 Performance Optimization */}
        <link rel="dns-prefetch" href="//vercel.com" />
        <link rel="dns-prefetch" href="//analytics.vercel.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Critical resource preconnections */}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://files.myshopify.com" />

        {/* Preload critical CSS */}
        <link
          rel="preload"
          href="/_next/static/css/app.css"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />

        {/* Critical font preloading */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/prompt/v9/jizaRExUiTo99u79D0-ExdGM.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
