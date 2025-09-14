import React, { useEffect, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import ClientOnly from '../components/ClientOnly';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

// Lazy load non-critical components to reduce initial bundle size
const CookieConsent = lazy(() => import('../components/CookieConsent'));
const PWAInstallPrompt = lazy(() => import('../components/PWAInstallPrompt'));

export default function MyApp({ Component, pageProps }) {
  // Global error handling for third-party scripts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Handle uncaught errors from third-party scripts
      const handleError = event => {
        // Ignore errors from third-party scripts that don't affect our app
        if (
          event.error &&
          (event.error.message?.includes('semalt') ||
            event.error.message?.includes('Object.keys') ||
            event.filename?.includes('content.js'))
        ) {
          event.preventDefault();
          console.warn('Third-party script error suppressed:', event.error.message);
          return true;
        }
      };

      const handleUnhandledRejection = event => {
        // Handle unhandled promise rejections
        if (event.reason?.message?.includes('semalt')) {
          event.preventDefault();
          console.warn('Third-party promise rejection suppressed:', event.reason.message);
          return true;
        }
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  // Service worker registration with fixed variables
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Choose appropriate service worker for environment
      const swFile = process.env.NODE_ENV === 'production' ? '/sw.js' : '/sw-dev.js';

      navigator.serviceWorker
        .register(swFile, {
          scope: '/',
        })
        .then(registration => {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('✅ Service Worker registered successfully:', registration.scope);
          }

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('🔄 New service worker content available');
                  }
                }
              });
            }
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.warn('⚠️ SW registration failed:', error);
        });
    }
  }, []);

  // Check if page has a custom layout
  const getLayout =
    Component.getLayout ||
    (page => (
      <>
        <ClientOnly
          fallback={
            <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-orange-500 h-16"></nav>
          }
        >
          <Navbar />
        </ClientOnly>
        <main id="main" role="main">
          {page}
        </main>
        <ClientOnly>
          <Footer />
        </ClientOnly>
        <ClientOnly>
          <Suspense fallback={<div style={{ display: 'none' }}></div>}>
            <CookieConsent />
          </Suspense>
        </ClientOnly>
        <ClientOnly>
          <Suspense fallback={<div style={{ display: 'none' }}></div>}>
            <PWAInstallPrompt />
          </Suspense>
        </ClientOnly>
      </>
    ));

  return (
    <>
      {getLayout(<Component {...pageProps} />)}
      <Analytics />
    </>
  );
}
