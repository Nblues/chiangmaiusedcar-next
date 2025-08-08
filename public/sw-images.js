// Service Worker สำหรับ Cache รูปภาพ
const CACHE_NAME = 'car-images-v1';
const IMAGE_CACHE_SIZE = 50; // จำกัดจำนวนรูปที่เก็บ

// รายการ URL ที่ต้องการ cache
const CACHE_URLS = ['/cover.jpg', '/logo/logo_main.webp'];

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
  // จัดการเฉพาะ request รูปภาพ
  if (
    event.request.destination === 'image' ||
    event.request.url.includes('cdn.shopify.com') ||
    event.request.url.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            // พบใน cache แล้ว ส่งคืนทันที
            return cachedResponse;
          }

          // ไม่พบใน cache ให้ fetch และบันทึกลง cache
          return fetch(event.request)
            .then(networkResponse => {
              // ตรวจสอบว่า response ถูกต้อง
              if (networkResponse && networkResponse.status === 200) {
                // จำกัดขนาด cache
                cache.keys().then(keys => {
                  if (keys.length >= IMAGE_CACHE_SIZE) {
                    // ลบรูปเก่าสุด
                    cache.delete(keys[0]);
                  }
                });

                // Clone response เพื่อบันทึกใน cache
                const responseToCache = networkResponse.clone();
                cache.put(event.request, responseToCache);
              }

              return networkResponse;
            })
            .catch(() => {
              // ถ้า network ล้มเหลว ให้ส่ง placeholder
              if (event.request.destination === 'image') {
                return new Response(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
                    '<rect width="400" height="300" fill="#f3f4f6"/>' +
                    '<text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">รูปภาพไม่พร้อมใช้งาน</text>' +
                    '</svg>',
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
            });
        });
      })
    );
  }
});

// ฟังก์ชันสำหรับ preload รูปภาพ
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'PRELOAD_IMAGES') {
    const imageUrls = event.data.urls;

    caches.open(CACHE_NAME).then(cache => {
      imageUrls.forEach(url => {
        fetch(url)
          .then(response => {
            if (response && response.status === 200) {
              cache.put(url, response.clone());
            }
          })
          .catch(err => {
            console.log('Preload failed for:', url);
          });
      });
    });
  }
});
