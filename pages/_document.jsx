import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        {/* SEO Meta */}
        <meta charSet="utf-8" />

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />

        {/* Mobile optimization - viewport ใส่ใน _app.jsx แล้ว */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ครูหนึ่งรถสวย" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Favicons and Icons */}
        <link rel="icon" href="/logo/logo_main.png" />
        <link rel="apple-touch-icon" href="/logo/logo_main.png" />
        <link rel="shortcut icon" href="/logo/logo_main.png" />

        {/* Theme color for mobile browser bar */}
        <meta name="theme-color" content="#FFB200" />
        <meta name="msapplication-TileColor" content="#FFB200" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* DNS Prefetch for faster loading */}
        <link rel="dns-prefetch" href="//cdn.shopify.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//googletagmanager.com" />

        {/* Preload critical images - WebP format for better performance */}
        <link rel="preload" href="/herobanner/kn2carbanner.webp" as="image" type="image/webp" />
        <link rel="preload" href="/logo/logo_main.webp" as="image" type="image/webp" />
        {/* Fallback for browsers that don't support WebP */}
        <link rel="preload" href="/herobanner/kn2carbanner.png" as="image" type="image/png" />
        <link rel="preload" href="/logo/logo_main.png" as="image" type="image/png" />

        {/* Google Fonts: Prompt with performance optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="true" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/sitemap.xml" />
        <link rel="prefetch" href="/robots.txt" />
      </Head>
      <body className="bg-white text-black dark:bg-black dark:text-white font-prompt">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
