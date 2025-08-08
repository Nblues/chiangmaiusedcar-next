/**
 * Image optimization utilities สำหรับ Shopify CDN
 */

/**
 * ปรับขนาดรูป Shopify URL
 * @param {string} url - Shopify image URL
 * @param {number} width - ความกว้างที่ต้องการ
 * @param {number} height - ความสูงที่ต้องการ (optional)
 * @param {string} format - รูปแบบไฟล์ (webp, jpg, png)
 * @returns {string} - URL ที่ปรับขนาดแล้ว
 */
export function getOptimizedShopifyImage(url, width, height = null, format = 'webp') {
  if (!url || !url.includes('cdn.shopify.com')) {
    return url; // คืนค่า URL เดิมถ้าไม่ใช่ Shopify
  }

  try {
    // ลบ parameter เก่าออก
    const cleanUrl = url.split('?')[0];

    // สร้าง parameters ใหม่
    const params = new URLSearchParams();

    // เพิ่มความกว้าง
    if (width) {
      params.append('width', width);
    }

    // เพิ่มความสูง (ถ้ามี)
    if (height) {
      params.append('height', height);
    }

    // เพิ่มรูปแบบไฟล์
    if (format && format !== 'original') {
      params.append('format', format);
    }

    // เพิ่มคุณภาพ
    params.append('quality', '75');

    return `${cleanUrl}?${params.toString()}`;
  } catch (error) {
    console.warn('Error optimizing Shopify image:', error);
    return url;
  }
}

/**
 * สร้าง srcSet สำหรับ responsive images
 * @param {string} url - Shopify image URL
 * @param {array} sizes - array ของ width ที่ต้องการ
 * @returns {string} - srcSet string
 */
export function generateSrcSet(url, sizes = [640, 750, 828, 1080, 1200, 1920]) {
  if (!url || !url.includes('cdn.shopify.com')) {
    return '';
  }

  return sizes.map(size => `${getOptimizedShopifyImage(url, size)} ${size}w`).join(', ');
}

/**
 * สร้าง thumbnail URL ที่เหมาะสม
 * @param {string} url - Shopify image URL
 * @param {number} size - ขนาด thumbnail (default: 80px)
 * @returns {string} - thumbnail URL
 */
export function getThumbnailUrl(url, size = 80) {
  return getOptimizedShopifyImage(url, size, size, 'webp');
}

/**
 * สร้าง main image URL ที่เหมาะสมสำหรับหน้ารายละเอียด
 * @param {string} url - Shopify image URL
 * @param {boolean} isMobile - เป็น mobile หรือไม่
 * @returns {string} - optimized main image URL
 */
export function getMainImageUrl(url, isMobile = false) {
  const width = isMobile ? 640 : 1200;
  return getOptimizedShopifyImage(url, width, null, 'webp');
}

/**
 * สร้าง blur placeholder สำหรับรูป
 * @param {string} url - Shopify image URL
 * @returns {string} - tiny blur placeholder URL
 */
export function getBlurPlaceholder(url) {
  return getOptimizedShopifyImage(url, 10, 10, 'jpg');
}
