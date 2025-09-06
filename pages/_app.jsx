import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import ErrorBoundary from '../components/ErrorBoundary';

// Import Analytics dynamically and only on client-side
const VercelAnalytics = dynamic(() => import('@vercel/analytics/react').then(m => m.Analytics), {
  ssr: false,
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Service Worker Registration - DISABLED FOR DEVELOPMENT
    // Explicitly disabled for all environments to prevent offline caching issues
    const isPWAEnabled = false; // Force disabled
    const isProduction = process.env.NODE_ENV === 'production';
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const isNotLocal =
      typeof window !== 'undefined' &&
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1') &&
      !window.location.hostname.includes('dev');

    if (isPWAEnabled && isProduction && isSecure && isNotLocal && 'serviceWorker' in navigator) {
      console.warn('Attempting Service Worker registration...');

      const registerServiceWorker = () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.warn('Service Worker registered successfully:', registration);
          })
          .catch(error => {
            console.warn('Service Worker registration failed:', error);
          });
      };

      // Register after a delay to ensure document is fully ready
      setTimeout(registerServiceWorker, 2000);
    } else {
      console.warn('Service Worker registration skipped:', {
        isPWAEnabled,
        isProduction,
        isSecure,
        isNotLocal,
        hasServiceWorker: 'serviceWorker' in navigator,
      });

      // Unregister any existing service workers in development
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
            console.warn('Unregistered service worker:', registration);
          }
        });
      }
    }

    // ป้องกัน router errors และ handle route changes ที่ถูกยกเลิก
    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
        console.warn(`Route to ${url} was cancelled`);
        return;
      }
      console.error('Route change error:', err);
    };

    const handleRouteChangeStart = url => {
      console.warn('Route change started:', url);
    };

    const handleRouteChangeComplete = url => {
      console.warn('Route change completed:', url);
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
    <ErrorBoundary>
      <div className="relative z-0 min-h-screen flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1" suppressHydrationWarning>
          {getLayout(<Component {...pageProps} />)}
        </main>
        <Footer />
      </div>
      {/* Components */}
      <CookieConsent />
      <PWAInstallPrompt />
      {/* Vercel Analytics - client-only */}
      <VercelAnalytics />
      <GoogleAnalytics gaId="G-81DK266FDR" />
    </ErrorBoundary>
  );
}
