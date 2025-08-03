import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        {/* SEO Meta */}
        <meta charSet="utf-8" />

        {/* Theme color for mobile browser bar */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

        {/* Preload logo & banner */}
        <link rel="preload" href="/logo.webp" as="image" type="image/webp" />
        <link rel="preload" href="/herobanner/kn2carsbanner.png" as="image" type="image/png" />

        {/* Google Fonts: Prompt */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="true" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-white text-black dark:bg-black dark:text-white font-prompt">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
