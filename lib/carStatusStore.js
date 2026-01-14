/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

/**
 * Car Status Store - Vercel KV (Redis) Implementation with Memory Fallback
 *
 * ใช้ Vercel KV เป็น primary storage สำหรับสถานะรถ
 * - ข้อมูลถาวร 100% (ไม่หายแม้ Vercel restart)
 * - ไม่ต้องพึ่ง Shopify Metafields
 * - Global Edge Network (เร็วมาก!)
 *
 * Fallback: ใช้ memory cache ถ้า KV ไม่พร้อม (rate limit, outage)
 * - ข้อมูลเก็บไว้ในการใช้งาน session
 * - ใช้เวลาชั่วคราวจนกว่า KV จะพร้อมใช้งาน
 *
 * Key format: car:{shopifyProductId}
 * Value: { status: "available" | "reserved", updatedAt: "ISO8601" }
 */

import { kv } from '@vercel/kv';

// In-memory fallback cache (session-based)
const memoryCache = new Map();

// Normalize KV env variables in case the provider applied a custom prefix twice (e.g., KV_KV_REST_API_URL)
const normalizeEnv = () => {
  const pairs = [
    ['KV_KV_REST_API_URL', 'KV_REST_API_URL'],
    ['KV_KV_REST_API_TOKEN', 'KV_REST_API_TOKEN'],
    ['KV_KV_URL', 'KV_URL'],
  ];
  for (const [src, dst] of pairs) {
    if (!process.env[dst] && process.env[src]) {
      process.env[dst] = process.env[src];
    }
  }
};

normalizeEnv();

const CAR_STATUS_PREFIX = 'car:';
// Aggregated map to avoid expensive key scans (KEYS/SCAN) on Upstash/Vercel KV
// Shape: { [carId]: { status: 'available'|'reserved', updatedAt: string } }
const CAR_STATUSES_MAP_KEY = 'car:statuses';

// In-process cache to reduce KV request quota usage.
// Useful for build-time SSG/ISR (many pages calling readCarStatuses) and warm serverless instances.
// Set KV_STATUS_MAP_CACHE_TTL_MS=0 to disable.
const KV_STATUS_MAP_CACHE_TTL_MS = Math.max(
  0,
  Number(process.env.KV_STATUS_MAP_CACHE_TTL_MS || 30_000)
);
let statusMapCache = null;
let statusMapCacheFetchedAt = 0;
let statusMapInFlight = null;

let lastKvAvailable = null;
let didWarnKvDisabledInDev = false;

function isKVEnabled() {
  // Avoid consuming Upstash/Vercel KV request quotas during local development.
  // Opt-in by setting ENABLE_KV_IN_DEV=1 (or true) if you explicitly want KV in dev.
  if (process.env.NODE_ENV === 'development') {
    const flag = String(process.env.ENABLE_KV_IN_DEV || '').toLowerCase();
    return flag === '1' || flag === 'true' || flag === 'yes';
  }
  return true;
}

function reportKvAvailability(available) {
  if (process.env.NODE_ENV !== 'development') return;
  if (lastKvAvailable === available) return;
  lastKvAvailable = available;
  // eslint-disable-next-line no-console
  console.log(
    available
      ? '✅ KV Available: Ready to use Vercel KV for car statuses'
      : '⚠️  KV Not Available: Car statuses will only be stored in memory (not persistent)'
  );
}

const isPlainObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

async function readStatusMapFromKV() {
  const now = Date.now();

  if (
    KV_STATUS_MAP_CACHE_TTL_MS > 0 &&
    statusMapCache &&
    now - statusMapCacheFetchedAt < KV_STATUS_MAP_CACHE_TTL_MS
  ) {
    return statusMapCache;
  }

  if (statusMapInFlight) {
    return statusMapInFlight;
  }

  statusMapInFlight = (async () => {
    const data = await kv.get(CAR_STATUSES_MAP_KEY);
    const next = isPlainObject(data) ? data : {};
    statusMapCache = next;
    statusMapCacheFetchedAt = Date.now();
    return next;
  })();

  try {
    return await statusMapInFlight;
  } finally {
    statusMapInFlight = null;
  }
}

async function writeStatusMapToKV(map) {
  // Keep payload reasonably small and predictable
  const safe = isPlainObject(map) ? map : {};
  await kv.set(CAR_STATUSES_MAP_KEY, safe);

  // Keep in-process cache coherent after writes.
  statusMapCache = safe;
  statusMapCacheFetchedAt = Date.now();
  statusMapInFlight = null;
}

/**
 * ตรวจสอบว่า KV พร้อมใช้งานหรือไม่
 * @returns {boolean}
 */
function isKVAvailable() {
  if (!isKVEnabled()) {
    reportKvAvailability(false);
    return false;
  }

  const available = !!(
    // Vercel KV default
    (
      (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      // Upstash legacy names
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
      // Some setups expose KV_URL only (token baked into URL)
      process.env.KV_URL
    )
  );

  reportKvAvailability(available);

  return available;
}

/**
 * อ่านสถานะรถทั้งหมด
 * @returns {Promise<Object>} { [carId]: { status, updatedAt } }
 */
export async function readCarStatuses() {
  // ถ้า KV ยังไม่พร้อม ให้ fallback เป็น memory cache (ถ้ามี)
  if (!isKVAvailable()) {
    if (process.env.NODE_ENV === 'development' && !didWarnKvDisabledInDev) {
      didWarnKvDisabledInDev = true;
      // eslint-disable-next-line no-console
      console.warn(
        'ℹ️ KV is disabled in development to avoid Upstash/Vercel KV rate limits. ' +
          'Set ENABLE_KV_IN_DEV=1 if you want to use KV locally.'
      );
    }
    if (memoryCache.size === 0) return {};
    const cached = {};
    memoryCache.forEach((value, key) => {
      cached[key] = value;
    });
    return cached;
  }

  try {
    // Fast path: read aggregated map (no key scans)
    const statuses = await readStatusMapFromKV();

    // Populate memory cache
    Object.entries(statuses).forEach(([carId, record]) => {
      if (record) memoryCache.set(carId, record);
    });

    return statuses;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('⚠️ KV read error, falling back to memory cache:', error.message);
    }
    // Fallback to memory cache if available
    if (memoryCache.size > 0) {
      const fallback = {};
      memoryCache.forEach((value, key) => {
        fallback[key] = value;
      });
      return fallback;
    }
    // Return empty object if no cache
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

  // Prefer memory cache for immediate consistency after updates
  const cached = memoryCache.get(String(carId));
  if (cached) return cached;

  // ถ้า KV ยังไม่พร้อม ให้ return default status
  if (!isKVAvailable()) {
    return { status: 'available' };
  }

  try {
    const map = await readStatusMapFromKV();
    const record = map?.[String(carId)];
    if (record) {
      memoryCache.set(String(carId), record);
      return record;
    }

    // Lazy migrate from legacy per-car key (if exists)
    const legacyKey = `${CAR_STATUS_PREFIX}${carId}`;
    const legacy = await kv.get(legacyKey);
    if (legacy && typeof legacy === 'object') {
      const next = { ...map, [String(carId)]: legacy };
      await writeStatusMapToKV(next);
      memoryCache.set(String(carId), legacy);
      return legacy;
    }

    return { status: 'available' };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`Failed to read car status for ${carId}:`, error);
    }
    return { status: 'available' };
  }
}

/**
 * อ่านสถานะรถเฉพาะบางคัน (หลีกเลี่ยงการ scan keys)
 * @param {string[]} carIds
 * @returns {Promise<Object>} { [carId]: { status, updatedAt } }
 */
export async function readCarStatusesByIds(carIds) {
  const ids = Array.isArray(carIds)
    ? carIds
        .map(String)
        .map(s => s.trim())
        .filter(Boolean)
    : [];
  if (ids.length === 0) return {};

  // Always serve from memory cache when present
  const fromCache = {};
  ids.forEach(id => {
    const cached = memoryCache.get(id);
    if (cached) fromCache[id] = cached;
  });

  if (!isKVAvailable()) {
    return fromCache;
  }

  try {
    const map = await readStatusMapFromKV();

    const result = { ...fromCache };
    const missing = [];

    ids.forEach(id => {
      if (result[id]) return;
      const rec = map?.[id];
      if (rec) {
        result[id] = rec;
        memoryCache.set(id, rec);
      } else {
        missing.push(id);
      }
    });

    // Lazy migrate missing entries from legacy keys (per-car) without scanning
    if (missing.length > 0) {
      const legacyValues = await Promise.all(
        missing.map(id => kv.get(`${CAR_STATUS_PREFIX}${id}`).catch(() => null))
      );

      let didMutate = false;
      const nextMap = { ...map };
      missing.forEach((id, idx) => {
        const legacy = legacyValues[idx];
        if (legacy && typeof legacy === 'object') {
          result[id] = legacy;
          memoryCache.set(id, legacy);
          nextMap[id] = legacy;
          didMutate = true;
        }
      });

      if (didMutate) {
        await writeStatusMapToKV(nextMap);
      }
    }

    return result;
  } catch {
    return fromCache;
  }
}

/**
 * เขียนสถานะรถทั้งหมด (ไม่แนะนำให้ใช้ ใช้ updateCarStatus แทน)
 * @param {Object} statuses - { [carId]: { status, updatedAt } }
 * @returns {Promise<string>} Storage type indicator
 */
export async function writeCarStatuses(statuses) {
  try {
    await writeStatusMapToKV(statuses);

    // Update memory cache
    if (isPlainObject(statuses)) {
      Object.entries(statuses).forEach(([carId, record]) => {
        if (record) memoryCache.set(String(carId), record);
      });
    }
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

  // Always update memory cache first (fast path)
  memoryCache.set(String(carId), statusRecord);

  // ถ้า KV ยังไม่พร้อม ให้ใช้ memory cache แต่ return warning
  if (!isKVAvailable()) {
    const warning = '⚠️ KV not available, using memory cache (session-only)';
    if (process.env.NODE_ENV === 'development' && !didWarnKvDisabledInDev) {
      didWarnKvDisabledInDev = true;
      // eslint-disable-next-line no-console
      console.warn(
        'ℹ️ KV is disabled in development to avoid Upstash/Vercel KV rate limits. ' +
          'Set ENABLE_KV_IN_DEV=1 if you want to use KV locally.'
      );
    }
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`${warning} (carId: ${carId}, status: ${status})`);
    }
    return {
      statusRecord,
      storage: 'memory-only',
      warning,
    };
  }

  try {
    const map = await readStatusMapFromKV();
    const next = { ...map, [String(carId)]: statusRecord };
    await writeStatusMapToKV(next);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`✅ Car status updated: ${carId} → ${status} (KV map + memory)`);
    }

    return { statusRecord, storage: 'vercel-kv' };
  } catch (error) {
    // KV failed, but memory cache is already updated - that's our fallback
    const warning = `⚠️ KV update failed, using memory cache: ${error.message}`;
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(warning);
    }
    return {
      statusRecord,
      storage: 'memory-only',
      warning,
    };
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
    const map = await readStatusMapFromKV();
    if (map && map[String(carId)]) {
      const next = { ...map };
      delete next[String(carId)];
      await writeStatusMapToKV(next);
    }
    memoryCache.delete(String(carId));
    return true;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`Failed to delete car status for ${carId}:`, error);
    }
    return false;
  }
}
