/**
 * Development Service Worker - Minimal functionality
 * Disabled offline features for development
 */

const CACHE_NAME = 'dev-cache-v1';

// Minimal caching for development
const FILES_TO_CACHE = ['/', '/logo/logo_main.png'];

// Install event - minimal setup
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event - network first, no offline fallback
self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Return network response directly in development
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(e.request).then(response => {
          if (response) {
            return response;
          }
          // Return minimal error response (no offline page)
          return new Response('Development mode - Network error', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});
