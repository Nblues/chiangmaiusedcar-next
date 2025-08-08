/**
 * Shopify Image Optimization Utilities (Test Module)
 * ใช้ Shopify CDN parameters เพื่อปรับปรุงประสิทธิภาพการโหลดรูป
 */

/**
 * ปรับปรุง URL รูปจาก Shopify CDN ด้วยการปรับขนาดและคุณภาพ
 * @param {string} url - URL รูปต้นฉบับจาก Shopify
 * @param {number} width - ความกว้างที่ต้องการ (px)
 * @param {number} height - ความสูงที่ต้องการ (px) - optional
 * @param {string} format - รูปแบบไฟล์ที่ต้องการ (webp, jpg, png)
 * @param {number} quality - คุณภาพรูป (1-100)
 * @returns {string} URL ที่ปรับปรุงแล้ว
 */
export function getOptimizedShopifyImage(url, width, height = null, format = 'webp', quality = 75) {
  if (!url || typeof url !== 'string') return url;

  try {
    // ตรวจสอบว่าเป็น Shopify CDN URL หรือไม่
    if (!url.includes('cdn.shopify.com')) return url;

    // สร้าง parameters สำหรับ Shopify CDN
    const params = new URLSearchParams();

    // ขนาดรูป
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());

    // คุณภาพและรูปแบบ
    if (quality && quality !== 75) params.append('quality', quality.toString());
    if (format && format !== 'jpg') params.append('format', format);

    // Crop mode สำหรับ responsive images
    if (width && height) {
      params.append('crop', 'center');
    }

    // เพิ่ม parameters เข้า URL
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  } catch (error) {
    console.warn('Image optimization error:', error);
    return url;
  }
}

/**
 * สร้าง URL สำหรับรูป thumbnail
 * @param {string} url - URL รูปต้นฉบับ
 * @param {number} size - ขนาด thumbnail (px)
 * @param {number} quality - คุณภาพรูป (1-100)
 * @returns {string} URL thumbnail ที่ปรับปรุงแล้ว
 */
export function getThumbnailUrl(url, size = 150, quality = 40) {
  return getOptimizedShopifyImage(url, size, size, 'webp', quality);
}

/**
 * สร้าง URL สำหรับรูปหลัก (main image)
 * @param {string} url - URL รูปต้นฉบับ
 * @param {number} width - ความกว้างสูงสุด
 * @param {number} quality - คุณภาพรูป
 * @returns {string} URL รูปหลักที่ปรับปรุงแล้ว
 */
export function getMainImageUrl(url, width = 800, quality = 75) {
  return getOptimizedShopifyImage(url, width, null, 'webp', quality);
}

/**
 * สร้าง placeholder blur สำหรับรูป
 * @param {string} url - URL รูปต้นฉบับ
 * @returns {string} URL สำหรับ blur placeholder
 */
export function getBlurPlaceholder(url) {
  return getOptimizedShopifyImage(url, 20, 20, 'jpg', 20);
}

// ทดสอบ
const sampleUrl = 'https://cdn.shopify.com/s/files/1/0001/2345/files/nissan-almera.jpg';
console.log('Original URL:', sampleUrl);
console.log('Main Image URL (quality 75):', getMainImageUrl(sampleUrl));
console.log('Desktop Thumbnail (80px, quality 40):', getThumbnailUrl(sampleUrl, 80));
console.log('Mobile Thumbnail (64px, quality 35):', getThumbnailUrl(sampleUrl, 64));
