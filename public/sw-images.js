// Service Worker สำหรับ Cache รูปภาพ
// NOTE: Cache only safe GET image requests (Shopify CDN + first-party).
const CACHE_NAME = 'car-images-v2';
const IMAGE_CACHE_SIZE = 50; // จำกัดจำนวนรูปที่เก็บ

// รายการ URL ที่ต้องการ cache
const CACHE_URLS = ['/cover.jpg', '/logo/logo_main.png'];

const IMAGE_EXT_RE = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i;

function isAllowedImageUrl(url) {
  try {
    const u = new URL(url);

    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;

    // Never cache API/HTML-like endpoints
    if (u.pathname.startsWith('/api/')) return false;

    const host = u.hostname;
    const isFirstParty = host === self.location.hostname;
    const isShopify =
      host === 'cdn.shopify.com' ||
      host.endsWith('.cdn.shopify.com') ||
      host.endsWith('.myshopify.com');

    return isFirstParty || isShopify;
  } catch {
    return false;
  }
}

function isImageLikeRequest(request) {
  if (!request || request.method !== 'GET') return false;
  if (!isAllowedImageUrl(request.url)) return false;

  if (request.destination === 'image') return true;

  try {
    const u = new URL(request.url);
    return IMAGE_EXT_RE.test(u.pathname);
  } catch {
    return false;
  }
}

function isCacheableImageResponse(response) {
  // Cross-origin <img> fetches are often opaque (status 0) but still cacheable.
  return Boolean(response) && (response.ok || response.type === 'opaque');
}

async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  const deleteCount = keys.length - maxEntries;
  for (let i = 0; i < deleteCount; i += 1) {
    await cache.delete(keys[i]);
  }
}

function getImageFallbackResponse() {
  return new Response(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
      '<rect width="400" height="300" fill="#f3f4f6"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">รูปภาพไม่พร้อมใช้งาน</text>' +
      '</svg>',
    { headers: { 'Content-Type': 'image/svg+xml' } }
  );
}

// ติดตั้ง Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// เปิดใช้งาน Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // ลบ cache เก่า
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // เข้าควบคุม client ทันที
      self.clients.claim(),
    ])
  );
});

// ดัก fetch requests
self.addEventListener('fetch', event => {
  if (!isImageLikeRequest(event.request)) return;

  // Stale-while-revalidate:
  // - Return cached immediately if present
  // - Update cache in the background
  event.respondWith(
    (async () => {
      const request = event.request;
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);

      const fetchAndUpdate = (async () => {
        try {
          const networkResponse = await fetch(request);
          if (isCacheableImageResponse(networkResponse)) {
            await cache.put(request, networkResponse.clone());
            await trimCache(cache, IMAGE_CACHE_SIZE);
          }
          return networkResponse;
        } catch {
          return null;
        }
      })();

      if (cachedResponse) {
        event.waitUntil(fetchAndUpdate);
        return cachedResponse;
      }

      const networkResponse = await fetchAndUpdate;
      return networkResponse || getImageFallbackResponse();
    })()
  );
});

// ฟังก์ชันสำหรับ preload รูปภาพ
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PRELOAD_IMAGES') {
    const imageUrls = event.data.urls;

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

    caches.open(CACHE_NAME).then(cache => {
      imageUrls.forEach(url => {
        if (!isAllowedImageUrl(url)) return;
        const request = new Request(url, { method: 'GET', mode: 'no-cors' });
        fetch(request)
          .then(response => {
            if (isCacheableImageResponse(response)) {
              cache.put(request, response.clone()).then(() => trimCache(cache, IMAGE_CACHE_SIZE));
            }
          })
          .catch(() => {
            // eslint-disable-next-line no-console
            console.log('Preload failed for:', url);
          });
      });
    });
  }
});
