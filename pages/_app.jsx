import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Service Worker Registration for PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // ป้องกัน router errors และ handle route changes ที่ถูกยกเลิก
    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
        console.log(`Route to ${url} was cancelled`);
        return;
      }
      console.error('Route change error:', err);
    };

    const handleRouteChangeStart = url => {
      console.log('Route change started:', url);
    };

    const handleRouteChangeComplete = url => {
      console.log('Route change completed:', url);
    };

    router.events.on('routeChangeError', handleRouteChangeError);
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeError', handleRouteChangeError);
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // รองรับ layout แบบเฉพาะหน้าถ้ามี
  const getLayout = Component.getLayout || (page => page);

  return (
    <>
      <div className="relative z-0 min-h-screen flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{getLayout(<Component {...pageProps} />)}</main>
        <Footer />
      </div>

      {/* Components */}
      <CookieConsent />
      <PWAInstallPrompt />

      <Analytics />
      <GoogleAnalytics gaId="G-81DK266FDR" />
    </>
  );
}
