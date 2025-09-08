import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import ClientOnly from '../components/ClientOnly';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { cacheManager } from '../lib/cache';
import '../styles/globals.css';

// Web Vitals reporting function
export function reportWebVitals(metric) {
  // Dynamic import to avoid blocking main bundle
  import('../lib/performance').then(({ checkWebVitals }) => {
    checkWebVitals(metric);
  });
}

export default function MyApp({ Component, pageProps }) {
  // 2025 Cache Management: Always fresh content strategy
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize performance observer
      import('../lib/performance').then(({ initPerformanceObserver }) => {
        initPerformanceObserver();
      });

      // Clear old caches on app start
      cacheManager.clearAllCaches().then(() => {
        // Start update checker for continuous freshness
        const checkInterval = cacheManager.startUpdateChecker();

        // Cleanup on unmount
        return () => {
          if (checkInterval) clearInterval(checkInterval);
        };
      });

      // Listen for service worker messages (production only)
      if ('serviceWorker' in navigator) {
        if (process.env.NODE_ENV === 'development') {
          // Unregister service worker in development
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.unregister();
            });
          });
        } else {
          // Production service worker registration
          navigator.serviceWorker.addEventListener('message', event => {
            if (event.data?.type === 'CACHE_UPDATED') {
              cacheManager.notifyUpdateAvailable();
            }
          });

          // Register service worker with update handling
          navigator.serviceWorker
            .register('/sw.js', {
              scope: '/',
              updateViaCache: 'none', // Never cache the service worker itself
            })
            .then(registration => {
              // Check for updates immediately
              registration.update();

              // Setup update detection
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                  newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      cacheManager.notifyUpdateAvailable();
                    }
                  });
                }
              });
            })
            .catch(error => {
              console.warn('SW registration failed:', error);
            });
        }
      }

      // Request notification permission for update alerts
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Performance monitoring
      if (window.performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
              const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
              const fromCache = navigation.transferSize === 0;

              // Track cache performance without console.log
              if (process.env.NODE_ENV === 'development') {
                window.cachePerformance = {
                  loadTime: `${Math.round(loadTime)}ms`,
                  fromCache,
                  timestamp: new Date().toISOString(),
                };
              }
            }
          }, 1000);
        });
      }

      // Preload critical resources
      const criticalResources = ['/favicon.webp', '/herobanner/chiangmaiusedcar.webp'];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = cacheManager.cacheBustUrl(resource);
        link.as = resource.endsWith('.webp') ? 'image' : 'fetch';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
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
        {page}
        <ClientOnly>
          <Footer />
        </ClientOnly>
        <ClientOnly>
          <CookieConsent />
        </ClientOnly>
        <ClientOnly>
          <PWAInstallPrompt />
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
