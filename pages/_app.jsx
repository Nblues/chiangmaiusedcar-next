import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Prompt } from 'next/font/google';
import ClientOnly from '../components/ClientOnly';
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { onCookieConsentChange, readCookieConsent } from '../utils/cookieConsent';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  // Match Tailwind font weights used across the site (e.g. font-medium=500, font-semibold=600, font-extrabold=800)
  weight: ['400', '500', '600', '700', '800'],
  display: 'optional',
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  preload: true,
  variable: '--font-prompt',
});

// Dynamic imports keep heavy UI out of the initial bundle and avoid hydration mismatches
const Footer = dynamic(() => import('../components/Footer'), { ssr: false, loading: () => null });
const CookieConsent = dynamic(() => import('../components/CookieConsent'), {
  ssr: false,
  loading: () => null,
});
const FacebookPixel = dynamic(() => import('../components/FacebookPixel'), {
  ssr: false,
  loading: () => null,
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const path = router?.asPath || router?.pathname || '';
  const isAdminRoute = path.startsWith('/admin');

  const [cookieConsent, setCookieConsent] = useState(null);

  // Defer Vercel analytics tooling so it doesn't compete with hydration/bootup.
  const [VercelTools, setVercelTools] = useState(null);

  // User Timing: measure app start -> hydrated (shows up under "User Timings" in Lighthouse)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.performance?.mark) {
        window.performance.mark('app:hydrated');
        if (window.performance.measure) {
          window.performance.measure('app:before-hydration', 'app:start', 'app:hydrated');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // User Timing: measure route transitions (helps correlate long tasks with navigation)
  useEffect(() => {
    if (!router?.events || typeof window === 'undefined') return;

    const markStart = url => {
      try {
        window.performance?.mark?.('route:start');
        window.performance?.mark?.(`route:start:${url}`);
      } catch {
        // ignore
      }
    };

    const markDone = url => {
      try {
        window.performance?.mark?.('route:complete');
        window.performance?.mark?.(`route:complete:${url}`);
        window.performance?.measure?.('route:duration', 'route:start', 'route:complete');
      } catch {
        // ignore
      }
    };

    router.events.on('routeChangeStart', markStart);
    router.events.on('routeChangeComplete', markDone);
    router.events.on('routeChangeError', markDone);
    return () => {
      router.events.off('routeChangeStart', markStart);
      router.events.off('routeChangeComplete', markDone);
      router.events.off('routeChangeError', markDone);
    };
  }, [router]);

  // Initialize performance monitoring (Web Vitals + custom observers) without competing with hydration.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const run = () => {
      import('../lib/performance')
        .then(mod => {
          if (typeof mod.initPerformanceObserver === 'function') {
            mod.initPerformanceObserver();
          }
        })
        .catch(() => {
          // silent fail - performance monitoring is non-critical
        });
    };

    let idleId;
    let timeoutId;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(run, 0);
    }

    return () => {
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  // Read stored cookie consent + react to changes from the banner.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setCookieConsent(readCookieConsent());
    return onCookieConsentChange(next => setCookieConsent(next));
  }, []);

  // Defer Vercel Analytics + Speed Insights into an idle-loaded async chunk.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') return;
    if (isAdminRoute) return;
    if (!cookieConsent?.analytics) return;

    let cancelled = false;

    const run = () => {
      Promise.all([import('@vercel/analytics/react'), import('@vercel/speed-insights/next')])
        .then(([analyticsMod, speedMod]) => {
          if (cancelled) return;
          const Analytics = analyticsMod?.Analytics;
          const SpeedInsights = speedMod?.SpeedInsights;
          if (!Analytics && !SpeedInsights) return;

          setVercelTools(() => {
            return function VercelToolsLoaded() {
              return (
                <>
                  {Analytics ? <Analytics /> : null}
                  {SpeedInsights ? <SpeedInsights /> : null}
                </>
              );
            };
          });
        })
        .catch(() => {
          // silent fail
        });
    };

    let idleId;
    let timeoutId;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(run, { timeout: 4000 });
    } else {
      timeoutId = window.setTimeout(run, 1500);
    }

    return () => {
      cancelled = true;
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isAdminRoute, cookieConsent?.analytics]);

  // Defer non-critical client-only runtime guards to an async chunk
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cleanup;
    const run = () => {
      import('../lib/clientRuntime')
        .then(mod => {
          if (typeof mod.initClientRuntime === 'function') {
            cleanup = mod.initClientRuntime();
          }
        })
        .catch(() => {
          // silent fail - compatibility guards are non-critical
        });
    };

    let idleId;
    let timeoutId;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(run, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(run, 0);
    }

    return () => {
      if (cleanup) cleanup();
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  // Defer service worker registration so it doesn't compete with hydration
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const run = () => {
      import('../lib/clientRuntime')
        .then(mod => {
          if (typeof mod.registerServiceWorker === 'function') {
            mod.registerServiceWorker();
          }
        })
        .catch(() => {
          // silent fail
        });
    };

    let idleId;
    let timeoutId;
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(run, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(run, 1000);
    }

    return () => {
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  // Check if page has a custom layout
  const getLayout =
    Component.getLayout ||
    (page => {
      // Default layout for public pages
      return (
        <div className={`${prompt.variable} font-prompt`}>
          <Navbar />
          <main id="main" role="main">
            {page}
          </main>
          <ClientOnly>
            <Footer />
          </ClientOnly>
          {!isAdminRoute && (
            <ClientOnly>
              <CookieConsent />
            </ClientOnly>
          )}
        </div>
      );
    });

  return (
    <>
      <ErrorBoundary>{getLayout(<Component {...pageProps} />)}</ErrorBoundary>
      {VercelTools ? <VercelTools /> : null}
      {!isAdminRoute && process.env.NODE_ENV === 'production' && cookieConsent?.marketing ? (
        <FacebookPixel />
      ) : null}
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
