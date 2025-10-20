import React, { useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import ClientOnly from '../components/ClientOnly';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FacebookPixel from '../components/FacebookPixel';
import '../styles/globals.css';
import '../styles/interactive-editor.css';

// Lazy load non-critical components to reduce initial bundle size
const CookieConsent = lazy(() => import('../components/CookieConsent'));

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const path = router?.asPath || router?.pathname || '';
  const isAdminRoute = path.startsWith('/admin');
  // Initialize performance monitoring (Web Vitals + custom observers) without blocking main bundle
  useEffect(() => {
    // Dynamic import to avoid increasing initial bundle size
    import('../lib/performance')
      .then(mod => {
        if (typeof mod.initPerformanceObserver === 'function') {
          mod.initPerformanceObserver();
        }
      })
      .catch(() => {
        // silent fail - performance monitoring is non-critical
      });
  }, []);

  // Enhanced error handling for Facebook In-App Browser and Vercel issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Detect Facebook In-App Browser
      const userAgent = navigator.userAgent || '';
      const isFacebookApp =
        userAgent.includes('FBAN') || userAgent.includes('FBAV') || userAgent.includes('FB_IAB');
      const isMessenger =
        userAgent.includes('MessengerForiOS') || userAgent.includes('MessengerLiteForiOS');
      const isInAppBrowser = isFacebookApp || isMessenger || userAgent.includes('Instagram');

      // Handle uncaught errors from third-party scripts and browsers
      const handleError = event => {
        // Ignore errors from third-party scripts that don't affect our app
        if (
          event.error &&
          (event.error.message?.includes('semalt') ||
            event.error.message?.includes('Object.keys') ||
            event.error.message?.includes('cloudflare') ||
            event.error.message?.includes('Code 705') ||
            event.error.message?.includes('Script error') ||
            event.error.message?.includes('Non-Error promise rejection') ||
            event.filename?.includes('content.js') ||
            event.filename?.includes('cloudflare') ||
            event.filename?.includes('facebook') ||
            event.filename?.includes('vercel-scripts') ||
            event.filename?.includes('vercel-analytics'))
        ) {
          event.preventDefault();
          return true;
        }

        // Suppress network errors from analytics scripts (408, 503, etc.)
        if (
          event.target?.src?.includes('vercel-scripts') ||
          event.target?.src?.includes('vercel-analytics')
        ) {
          event.preventDefault();
          return true;
        }
      };

      const handleUnhandledRejection = event => {
        // Handle unhandled promise rejections
        if (
          event.reason?.message?.includes('semalt') ||
          event.reason?.message?.includes('cloudflare') ||
          event.reason?.message?.includes('Code 705') ||
          event.reason?.message?.includes('facebook') ||
          event.reason?.message?.includes('Script error')
        ) {
          event.preventDefault();
          return true;
        }
      };

      // Enhanced Cloudflare and Vercel challenge completion handler
      const handleVerificationChallenge = () => {
        // Handle Cloudflare challenges
        if (window.location.search.includes('cf_chl_jschl_tk')) {
          setTimeout(() => {
            if (window.location.search.includes('cf_chl_jschl_tk')) {
              window.location.reload();
            }
          }, 3000);
        }

        // Handle Vercel protection redirects
        if (window.location.search.includes('_vercel_protection')) {
          setTimeout(() => {
            const cleanUrl = window.location.href.split('?')[0];
            window.history.replaceState({}, '', cleanUrl);
          }, 1000);
        }
      };

      // Facebook In-App Browser specific handling
      const handleFacebookBrowser = () => {
        if (isInAppBrowser) {
          // Add compatibility markers for Facebook browsers
          document.documentElement.setAttribute('data-fb-browser', 'true');

          // Force enable features that FB browser might restrict
          try {
            // Test and enable localStorage
            localStorage.setItem('fb_test', '1');
            localStorage.removeItem('fb_test');
          } catch {
            // Fallback for storage restrictions - silent fail
          }

          // Add external browser suggestion for complex pages
          if (
            window.location.pathname.includes('/all-cars') ||
            window.location.pathname.includes('/car/') ||
            window.location.pathname.includes('/contact')
          ) {
            setTimeout(() => {
              if (!sessionStorage.getItem('fb_notice_shown')) {
                sessionStorage.setItem('fb_notice_shown', '1');
                // Notice will be added by cloudflare-compat.js
              }
            }, 2000);
          }
        }
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('load', handleVerificationChallenge);

      // Run Facebook browser handling immediately
      handleFacebookBrowser();

      // Enhanced user agent compatibility for various browsers
      if (
        navigator.userAgent.includes('Chrome') ||
        navigator.userAgent.includes('Safari') ||
        isFacebookApp ||
        isMessenger
      ) {
        document.documentElement.style.setProperty('--webkit-appearance', 'none');
      }

      // Add viewport meta tag fix for mobile browsers
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport && (isFacebookApp || isMessenger)) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('load', handleVerificationChallenge);
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
    (page => {
      // Default layout for public pages
      return (
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
          {!isAdminRoute && (
            <ClientOnly>
              <Suspense fallback={<div className="skeleton animate-pulse bg-gray-200 h-12"></div>}>
                <CookieConsent />
              </Suspense>
            </ClientOnly>
          )}
        </>
      );
    });

  return (
    <>
      <Head>
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//cdn.shopify.com" />
        <link rel="dns-prefetch" href="//kn-goodcar.com" />
        <link rel="dns-prefetch" href="//vercel-analytics.com" />

        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />

        {/* Font optimization: Using @fontsource/prompt instead of preload */}
      </Head>
      {getLayout(<Component {...pageProps} />)}
      <Analytics />
      <FacebookPixel />
    </>
  );
}

// Report web vitals for better SEO performance monitoring
export function reportWebVitals(metric) {
  if (typeof window === 'undefined') return;

  // Optional dev logging
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Web Vitals:', metric);
  }

  // Delegate to performance helper (dynamic import keeps it out of main bundle)
  import('../lib/performance')
    .then(({ checkWebVitals }) => {
      if (typeof checkWebVitals === 'function') {
        checkWebVitals(metric);
      }
    })
    .catch(() => {
      // Fallback to GA if available
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }
    });
}
