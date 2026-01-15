import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    // Cache busting timestamp (used in meta tags)
    const buildTime = process.env.CUSTOM_BUILD_TIME || new Date().toISOString();

    // Use Next.js i18n locale to set correct <html lang> (affects SSR output like en.html)
    const locale = this.props?.__NEXT_DATA__?.locale || 'th';
    const htmlLang = locale === 'en' ? 'en' : 'th';

    return (
      <Html lang={htmlLang}>
        <Head>
          {/* Essential HTML5 Meta Tags for SEO 100/100 */}
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* 🚀 LCP Optimization: Preload hero image using responsive candidates */}
          {/* Use imagesrcset/imagesizes so the browser preloads the same file it will actually render */}
          {/* eslint-disable-next-line react/no-unknown-property */}
          <link
            rel="preload"
            as="image"
            href="/herobanner/cnxcar-828w.webp"
            type="image/webp"
            imageSrcSet="/herobanner/cnxcar-640w.webp 640w, /herobanner/cnxcar-828w.webp 828w, /herobanner/cnxcar-1024w.webp 1024w, /herobanner/cnxcar-1400w.webp 1400w"
            imageSizes="100vw"
          />

          {/* User Timing: mark earliest possible app start (for hydration measurements) */}
          <script
            dangerouslySetInnerHTML={{
              __html:
                ";(function(){try{if(window.performance&&performance.mark){performance.mark('app:start');}}catch(e){}})();",
            }}
          />

          {/* DNS Prefetch & Preconnect for Performance */}
          <link rel="dns-prefetch" href="https://cdn.shopify.com" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://vercel.com" />
          <link rel="dns-prefetch" href="https://analytics.vercel.com" />
          <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://files.myshopify.com" crossOrigin="anonymous" />

          {/* Facebook In-App Browser Compatibility */}
          <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          {/* 2025 Cache Control Meta Tags - Relaxed for Cloudflare */}
          <meta httpEquiv="Cache-Control" content="public, max-age=3600" />
          <meta httpEquiv="Pragma" content="public" />
          <meta name="cache-bust" content={buildTime} />

          {/* Force browser refresh on updates */}
          <meta name="last-modified" content={buildTime} />
          <meta name="etag" content={`"${buildTime}"`} />

          {/* Favicon Settings - 2025 Standards optimized for performance */}
          {/* ⭐ ลำดับสำคัญ: ICO ก่อน (รองรับทุก browser) แล้วค่อย PNG/SVG */}

          {/* 1. Primary: ICO สำหรับ compatibility สูงสุด + cache bust */}
          <link rel="icon" href={`/favicon.ico?v=${buildTime}`} />
          <link rel="shortcut icon" href={`/favicon.ico?v=${buildTime}`} />

          {/* 2. Multi-size PNG icons สำหรับ browsers ที่รองรับ */}
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`/favicon-16x16.png?v=${buildTime}`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`/favicon-32x32.png?v=${buildTime}`}
          />
          <link rel="icon" type="image/png" sizes="48x48" href={`/favicon-48.png?v=${buildTime}`} />
          <link rel="icon" type="image/png" sizes="96x96" href={`/favicon-96.png?v=${buildTime}`} />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href={`/android-chrome-192x192.png?v=${buildTime}`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href={`/android-chrome-512x512.png?v=${buildTime}`}
          />

          {/* 3. Vector favicon (modern browsers) */}
          <link rel="icon" type="image/svg+xml" href={`/favicon.svg?v=${buildTime}`} />

          {/* 3. Vector favicon (modern browsers) */}
          <link rel="icon" type="image/svg+xml" href={`/favicon.svg?v=${buildTime}`} />

          {/* 4. Apple Touch Icon (standard filename) */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`/apple-touch-icon.png?v=${buildTime}`}
          />

          {/* Safari pinned tab (best-effort using existing SVG) */}
          <link rel="mask-icon" href={`/favicon.svg?v=${buildTime}`} color="#1a237e" />

          {/* Microsoft Tiles - Windows Start Menu */}
          <meta name="msapplication-TileImage" content={`/mstile-150x150.png?v=${buildTime}`} />
          <meta name="msapplication-TileColor" content="#1a237e" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* 2025 Search Engine Favicon Optimization */}
          <meta name="msapplication-square70x70logo" content={`/mstile-70x70.png?v=${buildTime}`} />
          <meta
            name="msapplication-square150x150logo"
            content={`/mstile-150x150.png?v=${buildTime}`}
          />
          <meta
            name="msapplication-wide310x150logo"
            content={`/mstile-310x150.png?v=${buildTime}`}
          />
          <meta
            name="msapplication-square310x310logo"
            content={`/mstile-310x310.png?v=${buildTime}`}
          />

          {/* PWA Manifest - เพิ่ม cache bust */}
          <link rel="manifest" href={`/manifest.json?v=${buildTime}`} />

          {/* PWA Meta Tags - 2025 Standards */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="ครูหนึ่งรถสวย" />

          {/* PWA Theme */}
          <meta name="theme-color" content="#1a237e" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#1a237e" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a237e" />

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
          {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
            <meta
              name="google-site-verification"
              content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
            />
          )}

          {/* Critical CSS for LCP - Inline to avoid render blocking */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            /* Hero banner styles - Critical for LCP */
            header.relative { position: relative; width: 100%; height: auto; display: flex; align-items: center; justify-content: center; }
            .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
            .from-orange-100 { --tw-gradient-from: #ffedd5; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(255, 237, 213, 0)); }
            .to-blue-100 { --tw-gradient-to: #dbeafe; }
            .aspect-video { aspect-ratio: 16 / 9; }
            .object-contain { object-fit: contain; }
            .w-full { width: 100%; }
            .h-auto { height: auto; }
            .max-w-\\[1400px\\] { max-width: 1400px; }
            .mx-auto { margin-left: auto; margin-right: auto; }
          `,
            }}
          />

          {/* Note: Prompt font is loaded via @fontsource/prompt in globals.css */}
          {/* Font preload is handled automatically by Next.js for @fontsource packages */}
          {/* LCP preload has been moved to the top for better browser hint processing */}

          {/* Facebook Pixel - Lazy loaded via component in _app.jsx for better performance */}
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

          {/* Browser compatibility script: only needed inside in-app browsers (FB/IG/Line/Messenger).
              Keep it out of <Head> so it doesn't delay first paint / LCP discovery. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var ua=navigator.userAgent||'';if(!/FBAN|FBAV|FB_IAB|Messenger|Instagram|Line/i.test(ua))return;var load=function(){try{var s=document.createElement('script');s.src='/browser-compat.js';s.async=true;document.head.appendChild(s);}catch(e){}};if('requestIdleCallback'in window){window.requestIdleCallback(load,{timeout:2000});}else if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(load,0);},{once:true});}else{setTimeout(load,0);}}catch(e){}})();`,
            }}
          />
        </body>
      </Html>
    );
  }
}
