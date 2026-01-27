/* eslint-disable prettier/prettier */
/**
 * Client runtime guards & compatibility helpers.
 *
 * Intentionally split from pages/_app.jsx so the initial bundle stays smaller.
 */

export function initClientRuntime() {
  if (typeof window === 'undefined') return () => {};

  // Detect Facebook/Instagram in-app browsers
  const userAgent = navigator.userAgent || '';
  const isFacebookApp =
    userAgent.includes('FBAN') || userAgent.includes('FBAV') || userAgent.includes('FB_IAB');
  const isMessenger =
    userAgent.includes('MessengerForiOS') || userAgent.includes('MessengerLiteForiOS');
  const isInAppBrowser = isFacebookApp || isMessenger || userAgent.includes('Instagram');

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

    return undefined;
  };

  const handleUnhandledRejection = event => {
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

    return undefined;
  };

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

  const handleFacebookBrowser = () => {
    if (!isInAppBrowser) return;

    document.documentElement.setAttribute('data-fb-browser', 'true');

    // Test/enable localStorage (some in-app browsers restrict it)
    try {
      localStorage.setItem('fb_test', '1');
      localStorage.removeItem('fb_test');
    } catch {
      // silent
    }

    // Add external browser suggestion for complex pages (handled by cloudflare-compat.js)
    if (
      window.location.pathname.includes('/all-cars') ||
      window.location.pathname.includes('/car/') ||
      window.location.pathname.includes('/contact')
    ) {
      setTimeout(() => {
        if (!sessionStorage.getItem('fb_notice_shown')) {
          sessionStorage.setItem('fb_notice_shown', '1');
        }
      }, 2000);
    }
  };

  // Install handlers
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Ensure challenge handler runs even if we attach after load
  if (document.readyState === 'complete') {
    handleVerificationChallenge();
  } else {
    window.addEventListener('load', handleVerificationChallenge);
  }

  handleFacebookBrowser();

  // Enhanced user agent compatibility for various browsers
  if (
    userAgent.includes('Chrome') ||
    userAgent.includes('Safari') ||
    isFacebookApp ||
    isMessenger
  ) {
    document.documentElement.style.setProperty('--webkit-appearance', 'none');
  }

  // Viewport meta tag fix for Facebook/Messenger
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

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  const isProd = process.env.NODE_ENV === 'production';
  const isDev = process.env.NODE_ENV === 'development';
  const enableDevSw = process.env.NEXT_PUBLIC_ENABLE_DEV_SW === 'true';

  // In development, a service worker can easily cause confusing "Network error" pages
  // due to caching/interception while HMR is restarting. Default to OFF.
  if (!isProd && !enableDevSw) {
    // Best-effort cleanup of any previously registered SW + caches.
    navigator.serviceWorker
      .getRegistrations()
      .then(regs => Promise.all(regs.map(r => r.unregister())))
      .catch(() => {
        // ignore
      });

    if ('caches' in window) {
      caches
        .keys()
        .then(keys => Promise.all(keys.map(k => caches.delete(k))))
        .catch(() => {
          // ignore
        });
    }

    if (isDev) {
      // eslint-disable-next-line no-console
      console.log('🧹 Dev SW disabled: unregistered service worker(s) and cleared caches');
    }

    return;
  }

  const swFile = isProd ? '/sw.js' : '/sw-dev.js';

  navigator.serviceWorker
    .register(swFile, { scope: '/' })
    .then(registration => {
      // Ask the browser to check for an updated SW ASAP
      if (typeof registration.update === 'function') {
        registration.update().catch(() => {
          // ignore
        });
      }

      // If a new SW is waiting, activate it immediately
      if (registration.waiting) {
        registration.waiting.postMessage({ action: 'skipWaiting' });
      }

      if (isDev) {
        // eslint-disable-next-line no-console
        console.log('✅ Service Worker registered successfully:', registration.scope);
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.log('🔄 New service worker content available');
            }
          }
        });
      });
    })
    .catch(error => {
      // eslint-disable-next-line no-console
      console.warn('⚠️ SW registration failed:', error);
    });
}
