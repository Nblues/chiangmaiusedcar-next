/**
 * Service Worker for Chiangmai Used Car Website
 * Custom implementation for PWA functionality
 * Created specifically for this project
 */

const APP_PREFIX = 'ChiangmaiUsedCar_';
const VERSION = 'v2025.9.8_' + Date.now(); // Dynamic versioning for 2025
const CACHE_NAME = APP_PREFIX + VERSION;
const UPDATE_CHECK_INTERVAL = 30000; // Check for updates every 30 seconds

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

// Install event with aggressive cache clearing
self.addEventListener('install', e => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(FILES_TO_CACHE);
      
      // Force immediate activation for updates
      await self.skipWaiting();
    })(),
  );
});

// Activate event with complete cache cleanup
self.addEventListener('activate', e => {
  e.waitUntil(
    (async () => {
      // Remove ALL old caches aggressively
      const keyList = await caches.keys();
      await Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
      
      // Claim all clients immediately
      await self.clients.claim();
      
      // Notify all clients of update
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'CACHE_UPDATED',
          payload: { version: VERSION, timestamp: Date.now() }
        });
      });
    })(),
  );
});

// Fetch event with network-first strategy for 2025
self.addEventListener('fetch', e => {
  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Check if request matches our cache routes
  const shouldCache = CACHE_ROUTES.some(pattern => pattern.test(e.request.url));

  e.respondWith(
    (async () => {
      try {
        // Network-first strategy for always fresh content
        const networkResponse = await fetch(e.request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200 && shouldCache) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(e.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // Network failed, try cache as fallback only
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
  if (e.tag === 'sync-cars') {
    e.waitUntil(syncCarsData());
  }
});

// Helper function for syncing
async function syncCarsData() {
  try {
    // Add your sync logic here
  } catch (error) {
    // Sync failed silently
  }
}

// Message event for cache management
self.addEventListener('message', e => {
  if (e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
