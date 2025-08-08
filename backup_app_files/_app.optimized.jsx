import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';

// Import components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import PWAInstallPrompt from '../components/PWAInstallPrompt';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization
    if (initialized.current) return;
    initialized.current = true;

    // Basic initialization
    console.log('App initialized with maximum performance');

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.error('SW registration failed:', error);
        });
    }

    // Google Analytics Consent Mode
    window.gtag =
      window.gtag ||
      function () {
        (window.dataLayer = window.dataLayer || []).push(arguments);
      };

    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });

    // Router event handlers for performance monitoring
    const handleRouteStart = url => {
      console.log(`Route change started to: ${url}`);
    };

    const handleRouteComplete = url => {
      console.log(`Route change completed to: ${url}`);
    };

    const handleRouteError = (err, url) => {
      console.error(`Route change error to ${url}:`, err);
    };

    // Add router event listeners
    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('routeChangeError', handleRouteError);

    // Cleanup function
    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteComplete);
      router.events.off('routeChangeError', handleRouteError);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Component {...pageProps} />
      </main>
      <Footer />
      <CookieConsent />
      <PWAInstallPrompt />
      <Analytics />
      <GoogleAnalytics gaId="G-81DK266FDR" />
    </div>
  );
}

// Enhanced Web Vitals function with performance monitoring
export function reportWebVitals(metric) {
  const { name, value, id, delta } = metric;

  // Log all metrics in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(value),
      delta: Math.round(delta),
      id,
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && window.gtag) {
    window.gtag('event', name, {
      custom_parameter_1: Math.round(value),
      custom_parameter_2: id,
    });
  }
}

export default MyApp;
