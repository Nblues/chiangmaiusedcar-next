/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

/**
 * Car Status Store - Vercel KV (Redis) Implementation
 * 
 * ใช้ Vercel KV เป็น primary storage สำหรับสถานะรถ
 * - ข้อมูลถาวร 100% (ไม่หายแม้ Vercel restart)
 * - ไม่ต้องพึ่ง Shopify Metafields
 * - Global Edge Network (เร็วมาก!)
 * 
 * Key format: car:{shopifyProductId}
 * Value: { status: "available" | "reserved", updatedAt: "ISO8601" }
 */

import { kv } from '@vercel/kv';

const CAR_STATUS_PREFIX = 'car:';

/**
 * ตรวจสอบว่า KV พร้อมใช้งานหรือไม่
 * @returns {boolean}
 */
function isKVAvailable() {
  return !!(
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  );
}

/**
 * อ่านสถานะรถทั้งหมด
 * @returns {Promise<Object>} { [carId]: { status, updatedAt } }
 */
export async function readCarStatuses() {
  // ถ้า KV ยังไม่พร้อม ให้ return empty object
  if (!isKVAvailable()) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('⚠️ KV not available, returning empty statuses');
    }
    return {};
  }

  try {
    // Scan all keys with prefix "car:"
    const keys = await kv.keys(`${CAR_STATUS_PREFIX}*`);
    
    if (!keys || keys.length === 0) {
      return {};
    }

    // Get all values in parallel
    const values = await Promise.all(
      keys.map(key => kv.get(key))
    );

    // Build statuses object
    const statuses = {};
    keys.forEach((key, index) => {
      const carId = key.replace(CAR_STATUS_PREFIX, '');
      statuses[carId] = values[index] || { status: 'available' };
    });

    return statuses;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Failed to read car statuses from KV:', error);
    }
    // Fallback to empty object
    return {};
  }
}

/**
 * อ่านสถานะรถคันเดียว
 * @param {string} carId - Shopify Product ID
 * @returns {Promise<Object>} { status, updatedAt }
 */
export async function readCarStatus(carId) {
  if (!carId) return { status: 'available' };

  // ถ้า KV ยังไม่พร้อม ให้ return default status
  if (!isKVAvailable()) {
    return { status: 'available' };
  }

  try {
    const key = `${CAR_STATUS_PREFIX}${carId}`;
    const data = await kv.get(key);
    
    return data || { status: 'available' };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`Failed to read car status for ${carId}:`, error);
    }
    return { status: 'available' };
  }
}

/**
 * เขียนสถานะรถทั้งหมด (ไม่แนะนำให้ใช้ ใช้ updateCarStatus แทน)
 * @param {Object} statuses - { [carId]: { status, updatedAt } }
 * @returns {Promise<string>} Storage type indicator
 */
export async function writeCarStatuses(statuses) {
  try {
    const promises = Object.entries(statuses).map(([carId, data]) => {
      const key = `${CAR_STATUS_PREFIX}${carId}`;
      return kv.set(key, data);
    });

    await Promise.all(promises);
    return 'vercel-kv';
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Failed to write car statuses to KV:', error);
    }
    throw error;
  }
}

/**
 * อัปเดตสถานะรถคันเดียว
 * @param {string} carId - Shopify Product ID
 * @param {string} status - "available" | "reserved"
 * @returns {Promise<Object>} { statusRecord, storage: 'vercel-kv' }
 */
export async function updateCarStatus(carId, status) {
  if (!carId) throw new Error('carId is required');
  if (!['available', 'reserved'].includes(status)) {
    throw new Error('status must be "available" or "reserved"');
  }

  const statusRecord = {
    status,
    updatedAt: new Date().toISOString(),
  };

  // ถ้า KV ยังไม่พร้อม ให้ return warning แต่ไม่ throw error
  if (!isKVAvailable()) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('⚠️ KV not available, status update will not persist');
    }
    return {
      statusRecord,
      storage: 'memory-only',
      warning: 'KV not available - changes will not persist',
    };
  }

  try {
    const key = `${CAR_STATUS_PREFIX}${carId}`;
    await kv.set(key, statusRecord);

    return {
      statusRecord,
      storage: 'vercel-kv',
    };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`Failed to update car status for ${carId}:`, error);
    }
    throw error;
  }
}

/**
 * ลบสถานะรถคันเดียว
 * @param {string} carId - Shopify Product ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteCarStatus(carId) {
  if (!carId) return false;

  try {
    const key = `${CAR_STATUS_PREFIX}${carId}`;
    await kv.del(key);
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete car status for ${carId}:`, error);
    }
    return false;
  }
}
