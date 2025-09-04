import './globals.css';
import { Prompt } from 'next/font/google';
import { GoogleTagManager } from '@next/third-parties/google';

// Optimized font loading with subset and display swap
const prompt = Prompt({ 
  subsets: ['latin', 'thai'], 
  display: 'swap', 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt',
  preload: true,
});

export const metadata = {
  title: {
    default: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่คุณภาพ',
    template: '%s | ครูหนึ่งรถสวย - รถมือสองเชียงใหม่',
  },
  description: 'รถมือสองคุณภาพ ราคาดี บริการเป็นกันเอง ตรวจสอบสภาพรถทุกคัน รับประกันคุณภาพ ผ่อนง่าย ดาวน์น้อย เชียงใหม่',
  keywords: 'รถมือสอง เชียงใหม่, รถยนต์มือสอง, ขายรถ, ซื้อรถ, รถดีมีคุณภาพ, ครูหนึ่งรถสวย',
  openGraph: {
    title: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่คุณภาพ',
    description: 'รถมือสองคุณภาพ ราคาดี บริการเป็นกันเอง ตรวจสอบสภาพรถทุกคัน',
    url: 'https://chiangmaiusedcar.com',
    siteName: 'ครูหนึ่งรถสวย',
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่คุณภาพ',
    description: 'รถมือสองคุณภาพ ราคาดี บริการเป็นกันเอง',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="th" className={prompt.variable}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for additional performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Viewport meta for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1a237e" />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`font-prompt ${prompt.className}`}>
        {/* Main content */}
        {children}
        
        {/* Google Tag Manager - loaded via @next/third-parties for optimal performance */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
      </body>
    </html>
  );
}
