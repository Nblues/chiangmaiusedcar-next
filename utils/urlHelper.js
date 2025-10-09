/**
 * URL Helper Utilities for Clean and Pretty URLs
 * เชียงใหม่รถมือสอง - ครูหนึ่งรถสวย
 */

/**
 * สร้าง Pretty URL โดยลบคำภาษาไทยและอักขระพิเศษออก
 * @param {string} handle - Shopify handle ที่มีภาษาไทย encoded
 * @returns {string} URL ที่สะอาดและสั้นกว่า
 * 
 * @example
 * Input:  "isuzu-d-max-v-cross-3-0-ddi-vgs-turbo-4x4-mt-ปี-2014"
 * Output: "isuzu-d-max-v-cross-3-0-ddi-vgs-turbo-4x4-mt-2014"
 */
export function createPrettyUrl(handle) {
  if (!handle) return '';
  
  // ลบคำภาษาไทยที่ไม่จำเป็นออก (เช่น "ปี")
  const thaiWords = ['ปี', 'รุ่น', 'ปีนี้', 'ปีนั้น'];
  let cleanHandle = handle;
  
  thaiWords.forEach(word => {
    // ลบทั้งแบบ encoded และแบบไม่ encoded
    cleanHandle = cleanHandle.replace(new RegExp(`-${word}-`, 'g'), '-');
    cleanHandle = cleanHandle.replace(new RegExp(`-${encodeURIComponent(word)}-`, 'gi'), '-');
  });
  
  // ลบ dash ซ้ำซ้อน
  cleanHandle = cleanHandle.replace(/-+/g, '-');
  
  // ลบ dash ที่ท้าย
  cleanHandle = cleanHandle.replace(/-$/, '');
  
  return cleanHandle;
}

/**
 * สร้าง Short URL สำหรับ Social Sharing
 * @param {string} handle - Car handle
 * @param {object} car - Car data
 * @returns {string} Short URL
 * 
 * @example
 * Output: "https://www.chiangmaiusedcar.com/car/isuzu-d-max-2014"
 */
export function createShortShareUrl(handle, car) {
  const prettyHandle = createPrettyUrl(handle);
  return `https://www.chiangmaiusedcar.com/car/${prettyHandle}`;
}

/**
 * สร้าง Share Text สำหรับ Social Media
 * @param {object} car - Car data
 * @returns {string} Share text with emoji
 */
export function createShareText(car) {
  const brand = car?.vendor || car?.brand || '';
  const model = car?.model || '';
  const year = car?.year || '';
  const price = car?.price?.amount ? formatPrice(car.price.amount) : '';
  
  // สร้างข้อความแชร์ที่สั้นและน่าสนใจ
  let text = `🚗 ${brand} ${model}`;
  if (year) text += ` ${year}`;
  if (price) text += ` 💰 ${price} บาท`;
  text += ` | ครูหนึ่งรถสวย`;
  
  return text;
}

/**
 * Format ราคาแบบสั้น
 */
function formatPrice(amount) {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}k`;
  }
  return amount.toLocaleString('th-TH');
}

/**
 * ตรวจสอบว่า handle มีภาษาไทยหรือไม่
 */
export function hasThaiInUrl(handle) {
  // Check for Thai Unicode range or encoded Thai
  return /[\u0E00-\u0E7F]/.test(handle) || /%E0%B8/.test(handle);
}
