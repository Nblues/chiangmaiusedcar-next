/**
 * Shopify Image Optimizer
 * ปรับขนาดและแปลง format รูปภาพจาก Shopify CDN ฟรี
 * ไม่ต้องใช้ Vercel Image Optimization (ประหยัดค่าใช้จ่าย)
 */

/**
 * ปรับขนาดรูปจาก Shopify CDN
 * @param {string} url - URL รูปภาพจาก Shopify
 * @param {number} width - ความกว้างที่ต้องการ (px)
 * @param {string} format - รูปแบบ (webp, jpg, png)
 * @returns {string} - URL ที่ปรับขนาดแล้ว
 */
export function optimizeShopifyImage(url, width = 1200, format = 'webp') {
  // ตรวจสอบ URL
  if (!url || typeof url !== 'string') {
    return '/herobanner/chiangmaiusedcar.webp'; // Fallback
  }

  // ถ้าไม่ใช่ Shopify CDN ให้คืนค่าเดิม
  if (!url.includes('cdn.shopify.com') && !url.includes('myshopify.com')) {
    return url;
  }

  // ถ้ามี query params อยู่แล้ว
  const separator = url.includes('?') ? '&' : '?';

  // เพิ่ม width และ format parameters
  return `${url}${separator}width=${width}&format=${format}`;
}

/**
 * สร้าง srcset สำหรับ responsive images
 * @param {string} url - URL รูปภาพต้นฉบับ
 * @param {array} widths - Array ของความกว้างที่ต้องการ [640, 1024, 1920]
 * @param {string} format - รูปแบบ (webp, jpg, png)
 * @returns {string} - srcset attribute string
 */
export function generateSrcSet(url, widths = [640, 1024, 1920], format = 'webp') {
  if (!url || typeof url !== 'string') {
    return '';
  }

  return widths.map(width => `${optimizeShopifyImage(url, width, format)} ${width}w`).join(', ');
}

/**
 * คำนวณ sizes attribute สำหรับ responsive images
 * @param {string} type - ประเภทรูป ('hero', 'card', 'thumbnail', 'gallery')
 * @returns {string} - sizes attribute string
 */
export function generateSizes(type = 'default') {
  const sizeMap = {
    // รูปใหญ่เต็มหน้าจอ (หน้ารายละเอียดรถ)
    hero: '(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px',

    // การ์ดรถ (หน้ารายการรถ)
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',

    // Thumbnail เล็กๆ (gallery)
    thumbnail: '(max-width: 640px) 200px, (max-width: 1024px) 150px, 200px',

    // Gallery รูปขนาดกลาง
    gallery: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',

    // Default
    default: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
  };

  return sizeMap[type] || sizeMap.default;
}

/**
 * ตรวจสอบว่า browser รองรับ WebP หรือไม่
 * @returns {boolean}
 */
export function supportsWebP() {
  if (typeof window === 'undefined') {
    return false; // SSR
  }

  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    // WebP feature detection
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  return false;
}

/**
 * เลือก format ที่เหมาะสม (WebP หรือ JPG)
 * @returns {string} - 'webp' หรือ 'jpg'
 */
export function getBestFormat() {
  return supportsWebP() ? 'webp' : 'jpg';
}

/**
 * Blur placeholder สำหรับ loading state
 * Base64 encoded 8x8 pixel gray image
 */
export const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

/**
 * ตัวอย่างการใช้งาน
 *
 * // Basic usage
 * <img src={optimizeShopifyImage(car.image, 1200)} />
 *
 * // With srcset
 * <img
 *   src={optimizeShopifyImage(car.image, 1200)}
 *   srcSet={generateSrcSet(car.image, [640, 1024, 1920])}
 *   sizes={generateSizes('card')}
 * />
 *
 * // With Next.js Image
 * <Image
 *   src={optimizeShopifyImage(car.image, 1920)}
 *   width={1920}
 *   height={1440}
 *   alt={car.title}
 *   loading="lazy"
 * />
 */
