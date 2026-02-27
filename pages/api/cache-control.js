// pages/api/cache-control.js - API สำหรับการจัดการ cache headers ตามมาตรฐานสากล

import { isAuthenticated } from '../../middleware/adminAuth';

export default function handler(req, res) {
  const { method, query } = req;
  const { type = 'no-cache', maxAge = 0, resource } = query;

  const isProd = process.env.NODE_ENV === 'production';

  // ตั้งค่า CORS headers
  if (isProd) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.chiangmaiusedcar.com');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // In production, this endpoint is an admin tool. Hide it from unauthenticated callers.
  if (isProd && !isAuthenticated(req)) {
    return res.status(404).json({ success: false, error: 'Not found' });
  }

  // ตรวจสอบ authentication สำหรับการเปลี่ยนแปลง cache settings
  if (method === 'POST' || method === 'PUT') {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'กรุณา login ก่อนเปลี่ยนแปลง cache settings',
      });
    }
  }

  try {
    let cacheHeaders = {};
    let description = '';

    switch (type) {
      case 'no-cache':
        // สำหรับ HTML pages - เนื้อหาล่าสุดเสมอ
        cacheHeaders = {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
          'X-Timestamp': Date.now().toString(),
        };
        description = 'ไม่มีการ cache - เนื้อหาล่าสุดเสมอ (HTML pages)';
        break;

      case 'static': {
        // สำหรับ static assets - cache นาน
        const staticMaxAge = parseInt(maxAge) || 31536000; // 1 year default
        cacheHeaders = {
          'Cache-Control': `public, max-age=${staticMaxAge}, immutable`,
          'X-Content-Type-Options': 'nosniff',
        };
        description = `Cache static assets เป็นเวลา ${staticMaxAge} วินาที`;
        break;
      }

      case 'images': {
        // สำหรับ images - stale-while-revalidate
        const imageMaxAge = parseInt(maxAge) || 2592000; // 30 days default
        cacheHeaders = {
          'Cache-Control': `public, max-age=${imageMaxAge}, stale-while-revalidate=86400`,
          'X-Content-Type-Options': 'nosniff',
        };
        description = `Cache images เป็นเวลา ${imageMaxAge} วินาที พร้อม background revalidation`;
        break;
      }

      case 'api': {
        // สำหรับ API responses - short cache หรือ no cache
        const apiMaxAge = parseInt(maxAge) || 0;
        if (apiMaxAge > 0) {
          cacheHeaders = {
            'Cache-Control': `public, max-age=${apiMaxAge}, must-revalidate`,
            'X-Content-Type-Options': 'nosniff',
          };
          description = `Cache API response เป็นเวลา ${apiMaxAge} วินาที`;
        } else {
          cacheHeaders = {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          };
          description = 'ไม่ cache API response';
        }
        break;
      }

      case 'short': {
        // สำหรับ short-term cache (sitemaps, feeds)
        const shortMaxAge = parseInt(maxAge) || 3600; // 1 hour default
        cacheHeaders = {
          'Cache-Control': `public, max-age=${shortMaxAge}, must-revalidate`,
        };
        description = `Cache ระยะสั้น ${shortMaxAge} วินาที`;
        break;
      }

      case 'sw': {
        // สำหรับ Service Worker - ไม่ cache เพื่ออัปเดตทันที
        cacheHeaders = {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'Service-Worker-Allowed': '/',
        };
        description = 'Service Worker - อัปเดตทันที';
        break;
      }

      default:
        throw new Error(`Unknown cache type: ${type}`);
    }

    // ใส่ headers ทั้งหมด
    Object.entries(cacheHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // ส่งผลลัพธ์
    res.status(200).json({
      success: true,
      type,
      maxAge: parseInt(maxAge) || 0,
      resource,
      headers: cacheHeaders,
      description,
      timestamp: new Date().toISOString(),
      recommendations: getCacheRecommendations(type),
    });
  } catch (error) {
    console.error('Cache control API error:', error);

    // ตั้งค่า no-cache สำหรับ error response
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(400).json({
      success: false,
      error: 'Invalid cache configuration',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * แนะนำการตั้งค่า cache สำหรับแต่ละประเภท
 */
function getCacheRecommendations(type) {
  const recommendations = {
    'no-cache': {
      use: 'HTML pages, dynamic content, user-specific content',
      benefits: 'เนื้อหาล่าสุดเสมอ, ป้องกัน stale content',
      considerations: 'การโหลดช้ากว่า, bandwidth สูงกว่า',
      examples: ['/', '/all-cars', '/car/[handle]', '/contact'],
    },
    static: {
      use: 'CSS, JS, fonts, static images ที่ไม่เปลี่ยนแปลง',
      benefits: 'โหลดเร็วมาก, ประหยัด bandwidth',
      considerations: 'ต้องใช้ versioning สำหรับการอัปเดต',
      examples: ['/_next/static/', '.css', '.js', '.woff2', 'favicon.ico'],
    },
    images: {
      use: 'Product images, hero banners, user-generated content',
      benefits: 'แสดงเร็ว + อัปเดตเบื้องหลัง',
      considerations: 'อาจแสดง outdated images ชั่วคราว',
      examples: ['*.webp', '*.jpg', '*.png', 'Shopify CDN images'],
    },
    api: {
      use: 'API responses, dynamic data',
      benefits: 'ลดภาระ server, ตอบสนองเร็วขึ้น',
      considerations: 'ต้องจัดการ invalidation อย่างระมัดระวัง',
      examples: ['/api/health (short)', '/api/cars (medium)', '/api/user (no-cache)'],
    },
    short: {
      use: 'Sitemaps, RSS feeds, regularly updated content',
      benefits: 'ลด server load แต่ยังคงความสด',
      considerations: 'อัปเดตล่าช้าได้ตาม interval',
      examples: ['/sitemap.xml', '/robots.txt', '/api/feed'],
    },
    sw: {
      use: 'Service Workers, PWA manifests',
      benefits: 'อัปเดต SW ทันทีเมื่อมีเวอร์ชันใหม่',
      considerations: 'จำเป็นสำหรับ PWA functionality',
      examples: ['/sw.js', '/manifest.json', '/browserconfig.xml'],
    },
  };

  return recommendations[type] || null;
}
