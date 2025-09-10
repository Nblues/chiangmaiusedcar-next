/**
 * Site Location Utilities
 *
 * จัดการพิกัดของร้านจาก config/site-location.json
 * รองรับ fallback ไปยังค่าเดิมจาก business.js ถ้าพิกัดไม่ถูกต้อง
 *
 * Note: ใน browser environment จะใช้ค่าจาก business.js เท่านั้น
 * การอ่านไฟล์ config จะทำงานเฉพาะใน server-side หรือ build time
 */

import { BUSINESS_INFO } from '../config/business.js';

// Interface สำหรับตำแหน่งไซต์
export interface SiteLocation {
  lat: number;
  lng: number;
  source: string;
  updated?: string;
  original_url?: string;
}

// Cache สำหรับป้องกันการอ่านไฟล์บ่อย
let locationCache: SiteLocation | null = null;
let lastReadTime = 0;
const CACHE_DURATION = 30000; // 30 วินาที

/**
 * ตรวจสอบความถูกต้องของพิกัด
 */
function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    lat !== 0 &&
    lng !== 0
  );
}

/**
 * อ่านพิกัดจากไฟล์ config (เฉพาะ server-side)
 */
function readLocationConfig(): SiteLocation | null {
  // ตรวจสอบว่าอยู่ใน server environment หรือไม่
  if (typeof window !== 'undefined') {
    // อยู่ใน browser - ไม่สามารถอ่านไฟล์ได้
    return null;
  }

  try {
    // Dynamic import สำหรับ Node.js modules
    const fs = require('fs');
    const path = require('path');

    const configPath = path.resolve(process.cwd(), 'config', 'site-location.json');

    if (!fs.existsSync(configPath)) {
      return null;
    }

    const content = fs.readFileSync(configPath, 'utf8');
    const location = JSON.parse(content) as SiteLocation;

    // ตรวจสอบความถูกต้องของข้อมูล
    if (!isValidCoordinates(location.lat, location.lng)) {
      // eslint-disable-next-line no-console
      console.warn(`⚠️  พิกัดในไฟล์ config ไม่ถูกต้อง: lat=${location.lat}, lng=${location.lng}`);
      return null;
    }

    return location;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`⚠️  ไม่สามารถอ่านไฟล์ site-location.json: ${error}`);
    return null;
  }
} /**
 * ดึงพิกัดของร้าน
 *
 * 1. ลองอ่านจาก config/site-location.json ก่อน
 * 2. ถ้าไม่ได้หรือไม่ถูกต้อง ใช้ค่าจาก business.js
 *
 * @returns พิกัดร้าน { lat, lng }
 */
export function getSiteLocation(): { lat: number; lng: number } {
  const now = Date.now();

  // ใช้ cache ถ้ายังไม่หมดอายุ
  if (locationCache && now - lastReadTime < CACHE_DURATION) {
    return { lat: locationCache.lat, lng: locationCache.lng };
  }

  // พยายามอ่านจากไฟล์ config
  const configLocation = readLocationConfig();

  if (configLocation) {
    // อัปเดต cache
    locationCache = configLocation;
    lastReadTime = now;

    return { lat: configLocation.lat, lng: configLocation.lng };
  }

  // ถ้าไม่ได้ ใช้ค่าจาก business.js
  const fallbackLocation = {
    lat: BUSINESS_INFO.coordinates.latitude,
    lng: BUSINESS_INFO.coordinates.longitude,
  };

  // สร้าง cache สำหรับ fallback
  locationCache = {
    lat: fallbackLocation.lat,
    lng: fallbackLocation.lng,
    source: 'business.js (fallback)',
  };
  lastReadTime = now;

  // eslint-disable-next-line no-console
  console.log(
    `📍 ใช้พิกัด fallback จาก business.js: lat=${fallbackLocation.lat}, lng=${fallbackLocation.lng}`
  );

  return fallbackLocation;
}

/**
 * สร้าง Google Maps embed URL
 */
export function createMapEmbedUrl(zoom = 17): string {
  const { lat, lng } = getSiteLocation();
  return `https://www.google.com/maps?hl=th&q=${lat},${lng}&z=${zoom}&output=embed`;
}

/**
 * สร้าง Google Maps URL สำหรับเปิดในแอป/เบราว์เซอร์
 */
export function createMapOpenUrl(): string {
  const { lat, lng } = getSiteLocation();
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * สร้าง Google Maps direction URL
 */
export function createMapDirectionUrl(): string {
  const { lat, lng } = getSiteLocation();
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * ล้าง cache (ใช้สำหรับทดสอบหรือบังคับอัปเดต)
 */
export function clearLocationCache(): void {
  locationCache = null;
  lastReadTime = 0;
}

/**
 * ดึงข้อมูลตำแหน่งแบบเต็ม (รวม metadata)
 */
export function getSiteLocationWithMetadata(): SiteLocation {
  const now = Date.now();

  // ใช้ cache ถ้ายังไม่หมดอายุ
  if (locationCache && now - lastReadTime < CACHE_DURATION) {
    return locationCache;
  }

  // พยายามอ่านจากไฟล์ config
  const configLocation = readLocationConfig();

  if (configLocation) {
    locationCache = configLocation;
    lastReadTime = now;
    return configLocation;
  }

  // ถ้าไม่ได้ ใช้ค่าจาก business.js
  const fallbackLocation: SiteLocation = {
    lat: BUSINESS_INFO.coordinates.latitude,
    lng: BUSINESS_INFO.coordinates.longitude,
    source: 'business.js (fallback)',
    updated: new Date().toISOString(),
  };

  locationCache = fallbackLocation;
  lastReadTime = now;

  return fallbackLocation;
}
