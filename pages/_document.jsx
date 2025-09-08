import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        {/* Favicon Settings */}
        <link rel="icon" type="image/webp" href="/favicon.webp" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.webp" />

        {/* Android/Chrome Icons */}
        <link rel="icon" sizes="192x192" href="/favicon.webp" />
        <link rel="icon" sizes="512x512" href="/favicon.webp" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/favicon.webp" />
        <meta name="msapplication-TileColor" content="#ff5252" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* PWA Theme */}
        <meta name="theme-color" content="#ff5252" />

        {/* Google Search Console & SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
