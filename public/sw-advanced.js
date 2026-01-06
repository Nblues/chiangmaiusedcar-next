// Service Worker สำหรับการจัดการแคชตามมาตรฐานสากล 2025
// Cache Strategy: Stale-While-Revalidate + Network First สำหรับเนื้อหาล่าสุด

const CACHE_VERSION = 'v2026-1.0.1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// กำหนดรายการไฟล์ที่ต้อง cache
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.webp',
  '/favicon.png',
  '/favicon.ico',
  '/logo/logo_favicon.webp',
];

// Cache configuration
const CACHE_CONFIG = {
  maxAge: {
    static: 365 * 24 * 60 * 60, // 1 year
    dynamic: 7 * 24 * 60 * 60, // 1 week
    images: 30 * 24 * 60 * 60, // 30 days
  },
  maxEntries: {
    dynamic: 100,
    images: 200,
  },
};

self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing version', CACHE_VERSION);

  event.waitUntil(
    (async () => {
      try {
        // ลบ cache เก่าก่อนสร้างใหม่
        await clearOldCaches();

        // สร้าง static cache
        const staticCache = await caches.open(STATIC_CACHE);

        // เพิ่มไฟล์พื้นฐานที่จำเป็น
        await staticCache.addAll(STATIC_ASSETS);

        console.log('✅ Service Worker: Static cache created');

        // Force activation ทันที
        self.skipWaiting();
      } catch (error) {
        console.error('❌ Service Worker: Installation failed', error);
      }
    })()
  );
});

self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating version', CACHE_VERSION);

  event.waitUntil(
    (async () => {
      try {
        // ลบ cache เก่าทั้งหมด
        await clearOldCaches();

        // Claim ทุก client ทันที
        await self.clients.claim();

        console.log('✅ Service Worker: Activated and claimed all clients');
      } catch (error) {
        console.error('❌ Service Worker: Activation failed', error);
      }
    })()
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // ปล่อยผ่าน requests ที่ไม่ต้องการ cache
  if (shouldSkipCache(request)) {
    return;
  }

  // เลือก strategy ตามประเภทไฟล์
  const strategy = getStrategy(request);

  event.respondWith(handleRequest(request, strategy));
});

// Message handler สำหรับการควบคุมจาก client
self.addEventListener('message', event => {
  const { type, data } = event.data || {};

  switch (type) {
    case 'CLEAR_CACHE':
      event.waitUntil(clearAllCaches());
      break;

    case 'UPDATE_CACHE':
      event.waitUntil(updateCache(data?.paths || ['/']));
      break;

    case 'GET_CACHE_INFO':
      event.waitUntil(
        getCacheInfo().then(info => {
          event.ports[0]?.postMessage(info);
        })
      );
      break;

    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    default:
      console.log('🤷 Service Worker: Unknown message type', type);
  }
});

/**
 * จัดการ request ตาม strategy ที่กำหนด
 */
async function handleRequest(request, strategy) {
  try {
    switch (strategy) {
      case 'networkFirst':
        return await networkFirst(request);

      case 'cacheFirst':
        return await cacheFirst(request);

      case 'staleWhileRevalidate':
        return await staleWhileRevalidate(request);

      case 'networkOnly':
        return await networkOnly(request);

      default:
        return await fetch(request);
    }
  } catch (error) {
    console.error('❌ Service Worker: Request failed', error);
    return await getOfflineResponse(request);
  }
}

/**
 * Network First Strategy - เนื้อหาล่าสุดจาก network ก่อน
 */
async function networkFirst(request) {
  try {
    // พยายาม fetch จาก network ก่อน
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // บันทึกลง cache สำหรับครั้งต่อไป
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error('Network response not ok');
  } catch (error) {
    // หาก network ล้มเหลว ใช้จาก cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

/**
 * Cache First Strategy - หาจาก cache ก่อน เพื่อความเร็ว
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // หาใน cache ไม่เจอ ไป fetch จาก network
  const networkResponse = await fetch(request);

  if (networkResponse.ok) {
    const cache = await caches.open(getAppropriateCache(request));
    cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

/**
 * Stale While Revalidate - แสดง cache ทันที + อัปเดตเบื้องหลัง
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  // Fetch ใหม่เบื้องหลัง (ไม่ต้องรอ)
  const networkPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        const cache = caches.open(getAppropriateCache(request));
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(error => {
      console.warn('Background fetch failed:', error);
    });

  // ส่งคืน cache ทันที หรือรอ network หากไม่มี cache
  return cachedResponse || networkPromise;
}

/**
 * Network Only - ไม่ cache เลย (สำหรับ API)
 */
async function networkOnly(request) {
  return await fetch(request);
}

/**
 * กำหนดว่าควรข้าม cache หรือไม่
 */
function shouldSkipCache(request) {
  const url = new URL(request.url);

  return (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/revalidate') ||
    url.pathname.startsWith('/api/analytics') ||
    url.search.includes('no-cache') ||
    url.search.includes('_refresh')
  );
}

/**
 * เลือก strategy ตามประเภทไฟล์
 */
function getStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // API calls
  if (pathname.startsWith('/api/')) {
    return 'networkOnly';
  }

  // Static assets
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.includes('.css') ||
    pathname.includes('.js') ||
    pathname.includes('.woff') ||
    pathname.includes('.ico')
  ) {
    return 'cacheFirst';
  }

  // Images
  if (
    pathname.includes('.webp') ||
    pathname.includes('.jpg') ||
    pathname.includes('.png') ||
    pathname.includes('.svg') ||
    url.hostname.includes('shopify.com')
  ) {
    return 'staleWhileRevalidate';
  }

  // HTML pages
  return 'networkFirst';
}

/**
 * เลือก cache ที่เหมาะสม
 */
function getAppropriateCache(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (
    pathname.includes('.webp') ||
    pathname.includes('.jpg') ||
    pathname.includes('.png') ||
    pathname.includes('.svg') ||
    url.hostname.includes('shopify.com')
  ) {
    return IMAGE_CACHE;
  }

  if (
    pathname.startsWith('/_next/static/') ||
    pathname.includes('.css') ||
    pathname.includes('.js')
  ) {
    return STATIC_CACHE;
  }

  return DYNAMIC_CACHE;
}

/**
 * ลบ cache เก่าทั้งหมด
 */
async function clearOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(
    name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE
  );

  await Promise.all(oldCaches.map(name => caches.delete(name)));

  if (oldCaches.length > 0) {
    console.log('🗑️ Service Worker: Deleted old caches', oldCaches);
  }
}

/**
 * ลบ cache ทั้งหมด
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('🗑️ Service Worker: All caches cleared');
}

/**
 * อัปเดต cache สำหรับ paths ที่กำหนด
 */
async function updateCache(paths) {
  const cache = await caches.open(DYNAMIC_CACHE);

  for (const path of paths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        await cache.put(path, response);
        console.log('📦 Service Worker: Updated cache for', path);
      }
    } catch (error) {
      console.warn('⚠️ Service Worker: Failed to update cache for', path, error);
    }
  }
}

/**
 * ดึงข้อมูล cache
 */
async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const info = {
    version: CACHE_VERSION,
    caches: [],
    totalSize: 0,
  };

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    info.caches.push({
      name: cacheName,
      entries: keys.length,
    });
  }

  return info;
}

/**
 * Response สำหรับเมื่อ offline
 */
async function getOfflineResponse(request) {
  const url = new URL(request.url);

  // สำหรับ HTML pages แสดงหน้า offline
  if (request.headers.get('accept')?.includes('text/html')) {
    return (
      (await caches.match('/offline.html')) ||
      new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      })
    );
  }

  // สำหรับ images แสดงภาพ placeholder
  if (request.headers.get('accept')?.includes('image/')) {
    return new Response(null, {
      status: 503,
      statusText: 'Image unavailable offline',
    });
  }

  // Default response
  return new Response('Service unavailable', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' },
  });
}

console.log('🚀 Service Worker: Loaded version', CACHE_VERSION);
