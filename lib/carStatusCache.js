/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */

/**
 * Client-side cache for car statuses to reduce API calls and avoid KV rate limits
 * Cache duration: 5 minutes (300 seconds)
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();
let lastFetchTime = 0;

/**
 * Get cached car statuses if still valid
 * @param {string[]} ids - Array of car IDs
 * @returns {Object|null} Cached statuses or null if expired/missing
 */
export function getCachedStatuses(ids) {
  const now = Date.now();
  
  // Check if cache is still valid
  if (now - lastFetchTime > CACHE_DURATION) {
    cache.clear();
    return null;
  }

  // Check if we have all requested IDs
  const hasAllIds = ids.every(id => cache.has(id));
  if (!hasAllIds) {
    return null;
  }

  // Return cached data
  const result = {};
  ids.forEach(id => {
    result[id] = cache.get(id);
  });
  
  return result;
}

/**
 * Store car statuses in cache
 * @param {Object} statuses - Status object { carId: { status, updatedAt } }
 */
export function setCachedStatuses(statuses) {
  lastFetchTime = Date.now();
  
  Object.entries(statuses).forEach(([id, status]) => {
    cache.set(id, status);
  });
}

/**
 * Invalidate cache (force refetch on next request)
 */
export function invalidateCache() {
  cache.clear();
  lastFetchTime = 0;
}

/**
 * Debounce helper for visibility change refetch
 */
let visibilityDebounceTimer = null;

export function debounceVisibilityRefetch(callback, delay = 3000) {
  return () => {
    clearTimeout(visibilityDebounceTimer);
    visibilityDebounceTimer = setTimeout(callback, delay);
  };
}
