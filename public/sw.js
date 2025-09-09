// Service Worker สำหรับการจัดการแคชตามมาตรฐานสากล 2025
// Cache Strategy: Stale-While-Revalidate + Network First สำหรับเนื้อหาล่าสุด

const CACHE_VERSION = 'v2025-1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// กำหนดรายการไฟล์ที่ต้อง cache
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.webp',
  // '/_next/static/css/main.css', // ถ้ามีไฟล์ css หลักให้ใส่ชื่อไฟล์
  // '/_next/static/chunks/framework.js', // ถ้ามีไฟล์ js หลักให้ใส่ชื่อไฟล์
];

// กำหนด strategy สำหรับแต่ละประเภทไฟล์
const CACHE_STRATEGIES = {
  // HTML pages: Network First (เนื้อหาล่าสุดเสมอ)
  pages: 'networkFirst',
  // Static assets: Cache First (ประสิทธิภาพสูง)
  static: 'cacheFirst',
  // Images: Stale While Revalidate (แสดงเร็ว + อัปเดตเบื้องหลัง)
  images: 'staleWhileRevalidate',
  // API: Network Only (ข้อมูลสดใหม่เสมอ)
  api: 'networkOnly',
};
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
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll(STATIC_ASSETS);
      
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
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE) {
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
          payload: { version: CACHE_VERSION, timestamp: Date.now() }
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
          const cache = await caches.open(DYNAMIC_CACHE);
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
