/**
 * URL Helper Utilities for Clean and Pretty URLs
 * เชียงใหม่รถมือสอง - ครูหนึ่งรถสวย
 */

import { createPrettyUrl, getCarSlug } from './carSlug.mjs';

// Slug logic lives in carSlug.mjs (shared with the sitemap scripts); re-exported for existing imports.
export { createPrettyUrl, getCarSlug };

/**
 * สร้าง Short URL สำหรับแชร์
 * @param {string} handle - Car handle
 * @returns {string} Short URL for sharing
 *
 * @example
 * Output: "https://www.chiangmaiusedcar.com/car/isuzu-d-max-2014"
 */
export function createShortShareUrl(handle) {
  const prettyHandle = createPrettyUrl(handle);
  return `https://www.chiangmaiusedcar.com/car/${prettyHandle}`;
}

/**
 * Clean a URL for sharing/copying:
 * - strips hash
 * - removes common tracking params (fbclid/utm/etc.)
 * - preserves origin + pathname (and any essential query params if present)
 */
export function cleanShareUrl(inputUrl) {
  const raw = String(inputUrl || '').trim();
  if (!raw) return '';

  try {
    const parsed = new URL(raw);
    parsed.hash = '';
    const removeKeys = [
      'fbclid',
      'gclid',
      'dclid',
      'wbraid',
      'gbraid',
      'msclkid',
      'igshid',
      'mc_cid',
      'mc_eid',
    ];

    for (const key of removeKeys) {
      parsed.searchParams.delete(key);
    }
    // Remove all utm_* params
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (/^utm_/i.test(key)) parsed.searchParams.delete(key);
    }

    // Avoid trailing '?' when params removed
    const search = parsed.searchParams.toString();
    return `${parsed.origin}${parsed.pathname}${search ? `?${search}` : ''}`;
  } catch {
    // Not a full URL; best-effort remove hash/tracking-ish query
    return raw.split('#')[0];
  }
}

/**
 * สร้าง Share Text สำหรับ Social Media
 * @param {object} car - Car data
 * @returns {string} Share text with emoji
 */
export function createShareText(car = {}) {
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
  return /[\u0E00-\u0E7F]/.test(handle) || /%E0%B8/i.test(handle);
}
