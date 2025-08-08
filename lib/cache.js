// lib/cache.js - Cache management utilities

/**
 * Cache management for browser and service worker
 */
export class CacheManager {
  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.hasServiceWorker = this.isClient && 'serviceWorker' in navigator;
  }

  /**
   * Clear all browser caches
   */
  async clearAllCaches() {
    if (!this.isClient) return false;

    try {
      const promises = [];

      // Clear service worker caches
      if (this.hasServiceWorker && navigator.serviceWorker.controller) {
        promises.push(
          new Promise(resolve => {
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
            resolve();
          })
        );
      }

      // Clear browser storage
      if (window.localStorage) {
        promises.push(Promise.resolve(localStorage.clear()));
      }

      if (window.sessionStorage) {
        promises.push(Promise.resolve(sessionStorage.clear()));
      }

      // Clear IndexedDB (if any)
      if (window.indexedDB) {
        promises.push(this.clearIndexedDB());
      }

      await Promise.all(promises);
      console.log('✅ All caches cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Error clearing caches:', error);
      return false;
    }
  }

  /**
   * Clear IndexedDB databases
   */
  async clearIndexedDB() {
    try {
      const databases = await indexedDB.databases();
      const deletePromises = databases.map(db => {
        return new Promise((resolve, reject) => {
          const deleteReq = indexedDB.deleteDatabase(db.name);
          deleteReq.onsuccess = () => resolve();
          deleteReq.onerror = () => reject(deleteReq.error);
        });
      });
      await Promise.all(deletePromises);
      console.log('✅ IndexedDB cleared');
    } catch (error) {
      console.warn('⚠️ Could not clear IndexedDB:', error);
    }
  }

  /**
   * Force reload page with cache bypass
   */
  forceReload() {
    if (!this.isClient) return;

    // เพิ่ม timestamp เพื่อบังคับให้โหลดใหม่
    const url = new URL(window.location);
    url.searchParams.set('_t', Date.now());
    window.location.href = url.toString();
  }

  /**
   * Check if app is running as PWA
   */
  isPWA() {
    if (!this.isClient) return false;

    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  /**
   * Get cache status information
   */
  async getCacheInfo() {
    if (!this.isClient) return null;

    const info = {
      isPWA: this.isPWA(),
      hasServiceWorker: this.hasServiceWorker,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
      serviceWorkerStatus: 'not-available',
    };

    if (this.hasServiceWorker) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        info.serviceWorkerStatus = registration.active ? 'active' : 'inactive';
        info.serviceWorkerScope = registration.scope;
      }
    }

    return info;
  }

  /**
   * Set cache headers for responses
   */
  static getCacheHeaders(maxAge = 0, mustRevalidate = true) {
    const headers = {};

    if (maxAge > 0) {
      headers['Cache-Control'] =
        `public, max-age=${maxAge}${mustRevalidate ? ', must-revalidate' : ''}`;
    } else {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate, max-age=0';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    return headers;
  }

  /**
   * Trigger ISR revalidation
   */
  async triggerRevalidation(secret = 'dev-secret') {
    if (!this.isClient) return false;

    try {
      const response = await fetch(`/api/revalidate?secret=${secret}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret }),
      });

      const result = await response.json();
      console.log('🔄 Revalidation result:', result);

      return response.ok;
    } catch (error) {
      console.error('❌ Revalidation failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const cacheManager = new CacheManager();

/**
 * Hook for cache management in React components
 */
export function useCacheManager() {
  const [cacheInfo, setCacheInfo] = React.useState(null);
  const [isClearing, setIsClearing] = React.useState(false);

  React.useEffect(() => {
    cacheManager.getCacheInfo().then(setCacheInfo);
  }, []);

  const clearCaches = React.useCallback(async () => {
    setIsClearing(true);
    try {
      const success = await cacheManager.clearAllCaches();
      if (success) {
        // Refresh cache info
        const newInfo = await cacheManager.getCacheInfo();
        setCacheInfo(newInfo);
      }
      return success;
    } finally {
      setIsClearing(false);
    }
  }, []);

  const forceReload = React.useCallback(() => {
    cacheManager.forceReload();
  }, []);

  const triggerRevalidation = React.useCallback(async secret => {
    return await cacheManager.triggerRevalidation(secret);
  }, []);

  return {
    cacheInfo,
    isClearing,
    clearCaches,
    forceReload,
    triggerRevalidation,
    isPWA: cacheManager.isPWA(),
  };
}

// Development helpers
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // เพิ่มฟังก์ชันใน window object สำหรับ debugging
  window.cacheManager = cacheManager;
  window.clearAllCaches = () => cacheManager.clearAllCaches();
  window.getCacheInfo = () => cacheManager.getCacheInfo();
  window.triggerRevalidation = secret => cacheManager.triggerRevalidation(secret);

  console.log('🛠️ Development cache tools available:');
  console.log('  - window.clearAllCaches()');
  console.log('  - window.getCacheInfo()');
  console.log('  - window.triggerRevalidation(secret)');
  console.log('  - window.cacheManager');
}

export default cacheManager;
