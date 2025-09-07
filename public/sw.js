/**
 * Service Worker for Chiangmai Used Car Website
 * Custom implementation for PWA functionality
 * Created specifically for this project
 */

const APP_PREFIX = 'ChiangmaiUsedCar_';
const VERSION = 'v1.0.0';
const CACHE_NAME = APP_PREFIX + VERSION;

// Assets to cache on install
const FILES_TO_CACHE = [
  '/',
  '/offline.html',
  '/all-cars',
  '/logo/logo_main.png',
  '/herobanner/chiangmaiusedcar.webp'
];

// Routes that should be cached with network-first strategy
const CACHE_ROUTES = [
  /^\/all-cars.*$/,
  /^\/car\/.*$/,
  /^\/_next\/data\/.*\/all-cars\.json.*$/,
  /^\/_next\/static\/.*$/
];

// Install event
self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[ServiceWorker] Caching app shell');
      await cache.addAll(FILES_TO_CACHE);
    })(),
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    (async () => {
      // Remove old caches
      const keyList = await caches.keys();
      await Promise.all(
        keyList.map(key => {
          if (key.indexOf(APP_PREFIX) === 0 && key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }),
      );
    })(),
  );
  self.clients.claim();
});

// Fetch event with enhanced caching for pagination
self.addEventListener('fetch', e => {
  console.log('[ServiceWorker] Fetch', e.request.url);

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Check if request matches our cache routes
  const shouldCache = CACHE_ROUTES.some(pattern => pattern.test(e.request.url));

  e.respondWith(
    (async () => {
      try {
        // For pagination and car data, use stale-while-revalidate strategy
        if (shouldCache) {
          const cachedResponse = await caches.match(e.request);
          
          // Return cached response immediately if available
          if (cachedResponse) {
            // Revalidate in background
            fetch(e.request).then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(e.request, networkResponse.clone());
                });
              }
            }).catch(err => console.log('[ServiceWorker] Background fetch failed:', err));
            
            return cachedResponse;
          }
        }

        // Try network first
        const networkResponse = await fetch(e.request);

        // Cache successful responses for our routes
        if (networkResponse && networkResponse.status === 200 && shouldCache) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(e.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(e.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        // Both failed, return offline page for navigation requests
        if (e.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }

        // Return a basic error response
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })(),
  );
});

// Background sync for offline functionality
self.addEventListener('sync', e => {
  console.log('[ServiceWorker] Sync', e.tag);
  if (e.tag === 'sync-cars') {
    e.waitUntil(syncCarsData());
  }
});

// Helper function for syncing
async function syncCarsData() {
  try {
    console.log('[ServiceWorker] Syncing cars data...');
    // Add your sync logic here
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
  }
}

// Message event for cache management
self.addEventListener('message', e => {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
