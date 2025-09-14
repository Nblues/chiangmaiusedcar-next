/**
 * Development Service Worker - Enhanced with better error handling
 * Optimized for development environment
 */

const CACHE_NAME = 'dev-cache-v1.1';

// Essential files for development
const FILES_TO_CACHE = ['/', '/logo/logo_main.png', '/favicon.webp', '/manifest.json'];

// Install event - setup development cache
self.addEventListener('install', e => {
  /* eslint-disable no-console */
  console.log('🔧 [DEV] Service Worker installing...');

  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('✅ [DEV] Service Worker installed successfully');
        return self.skipWaiting(); // Take control immediately
      })
      .catch(error => {
        console.error('❌ [DEV] Service Worker installation failed:', error);
      })
  );
  /* eslint-enable no-console */
});

// Activate event - clean old caches and take control
self.addEventListener('activate', e => {
  /* eslint-disable no-console */
  console.log('🔄 [DEV] Service Worker activating...');

  e.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME) {
              console.log('🗑️ [DEV] Deleting old cache:', key);
              return caches.delete(key);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim(),
    ]).then(() => {
      console.log('✅ [DEV] Service Worker activated and ready');
    })
  );
  /* eslint-enable no-console */
});

// Fetch event - network first strategy for development
self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  // Skip external requests and API calls
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Clone response for caching if successful
        if (response.ok && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(e.request).then(response => {
          if (response) {
            // eslint-disable-next-line no-console
            console.log('📦 [DEV] Serving from cache:', e.request.url);
            return response;
          }
          // Return minimal error response for development
          return new Response('Development mode - Network error', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});

// Message handler for development tools
self.addEventListener('message', event => {
  const { data } = event;

  if (data && data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (data && data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_NAME, mode: 'development' });
  }
});
