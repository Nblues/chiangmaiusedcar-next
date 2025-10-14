// pages/api/revalidate.js - ISR Cache Revalidation API
// มาตรฐานสากล 2025: On-demand revalidation สำหรับเนื้อหาล่าสุด

import { isAuthenticated } from '../../middleware/adminAuth';

export default async function handler(req, res) {
  // ตั้งค่า headers ป้องกัน cache
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Timestamp', Date.now().toString());

  // รองรับเฉพาะ POST และ GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Only POST and GET methods are supported',
    });
  }

  try {
    // ตรวจสอบ secret token หรือ authentication
    const { secret, paths, force } = req.method === 'POST' ? req.body : req.query;
    const expectedSecret = process.env.REVALIDATE_SECRET || 'dev-secret';

    // Allow with correct secret OR admin authentication
    const hasValidSecret = process.env.NODE_ENV === 'development' || secret === expectedSecret;
    const isAdmin = isAuthenticated(req);

    if (!hasValidSecret && !isAdmin) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Revalidation secret or admin authentication required',
      });
    }

    // รายการหน้าที่ต้อง revalidate (ตามมาตรฐาน Next.js ISR)
    const defaultPaths = [
      '/', // หน้าหลัก
      '/all-cars', // หน้ารถทั้งหมด
      '/about', // เกี่ยวกับเรา
      '/contact', // ติดต่อ
      '/promotion', // โปรโมชั่น
    ];

    const pathsToRevalidate = paths ? (Array.isArray(paths) ? paths : [paths]) : defaultPaths;

    // บังคับ revalidate หรือ smart revalidation
    const revalidationResults = [];

    for (const path of pathsToRevalidate) {
      try {
        if (force === 'true' || force === true) {
          // Force revalidation - ลบ cache แล้ว rebuild
          await res.revalidate(path);
          revalidationResults.push({
            path,
            status: 'force-revalidated',
            timestamp: new Date().toISOString(),
          });
        } else {
          // Smart revalidation - ตรวจสอบก่อนว่าควร revalidate หรือไม่
          const lastModified = await getPageLastModified(path);
          const shouldRevalidate = shouldRevalidatePage(path, lastModified);

          if (shouldRevalidate) {
            await res.revalidate(path);
            revalidationResults.push({
              path,
              status: 'revalidated',
              timestamp: new Date().toISOString(),
              reason: 'content-changed',
            });
          } else {
            revalidationResults.push({
              path,
              status: 'skipped',
              timestamp: new Date().toISOString(),
              reason: 'no-changes-detected',
            });
          }
        }
      } catch (pathError) {
        revalidationResults.push({
          path,
          status: 'error',
          error: pathError.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Dynamic paths revalidation (car detail pages)
    if (paths && paths.includes('/car/[handle]')) {
      try {
        // Skip car-specific revalidation to avoid blocking network calls in API
        // Individual car pages will be revalidated on-demand when visited
        revalidationResults.push({
          path: '/car/[handle]',
          status: 'deferred',
          message: 'Car pages will be revalidated on-demand when visited',
          timestamp: new Date().toISOString(),
        });
      } catch (carError) {
        revalidationResults.push({
          path: '/car/[handle]',
          status: 'error',
          error: carError.message,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Response ตามมาตรฐาน
    res.status(200).json({
      success: true,
      revalidated: revalidationResults,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      buildTime: process.env.CUSTOM_BUILD_TIME,
      message: `Revalidated ${revalidationResults.length} paths successfully`,
    });
  } catch (error) {
    console.error('❌ Revalidation error:', error);

    res.status(500).json({
      success: false,
      error: 'Revalidation failed',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * ตรวจสอบว่าควร revalidate หน้าหรือไม่
 */
function shouldRevalidatePage(path, lastModified) {
  // ตรวจสอบจาก timestamp หรือเงื่อนไขอื่นๆ
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  // หน้าหลักและรายการรถ: revalidate ทุก 5 นาที
  if (path === '/' || path === '/all-cars') {
    return !lastModified || now - lastModified > fiveMinutes;
  }

  // หน้าอื่นๆ: revalidate ทุก 30 นาที
  const thirtyMinutes = 30 * 60 * 1000;
  return !lastModified || now - lastModified > thirtyMinutes;
}

/**
 * ดึงเวลาที่หน้าถูกแก้ไขครั้งสุดท้าย
 */
async function getPageLastModified(path) {
  try {
    // ใน production อาจใช้ redis หรือ database
    // สำหรับ development ใช้ memory cache
    const cacheKey = `page-modified-${path}`;

    if (typeof global[cacheKey] !== 'undefined') {
      return global[cacheKey];
    }

    // Default to current time if no cache
    return Date.now();
  } catch (error) {
    console.warn('Could not get page last modified time:', error);
    return null;
  }
}
