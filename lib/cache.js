// lib/cache.js - Cache management utilities for 2025 Standards

/**
 * Cache management for browser and service worker
 * 2025 Standards: Always fresh content, aggressive cache busting
 */
export class CacheManager {
  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.hasServiceWorker = this.isClient && 'serviceWorker' in navigator;
    this.buildTime = process.env.CUSTOM_BUILD_TIME || new Date().toISOString();
    this.updateCheckInterval = null;
  }

  /**
   * Get cache version with timestamp for 2025 cache busting
   */
  getCacheVersion() {
    return `v=${encodeURIComponent(this.buildTime)}&t=${Date.now()}`;
  }

  /**
   * Generate cache-busted URL for any resource
   */
  cacheBustUrl(url) {
    if (!this.isClient || !url) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${this.getCacheVersion()}`;
  }

  /**
   * Force immediate refresh for critical updates (2025 standard)
   */
  async forceRefresh() {
    if (!this.isClient) return false;

    try {
      // 1. Clear all browser caches aggressively
      await this.clearAllCaches();

      // 2. Unregister service workers to force fresh registration
      if (this.hasServiceWorker) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // 3. Force reload with cache bypass
      window.location.href =
        window.location.href +
        (window.location.href.includes('?') ? '&' : '?') +
        '_refresh=' +
        Date.now();

      return true;
    } catch (error) {
      console.error('❌ Force refresh failed:', error);
      return false;
    }
  }

  /**
   * Start continuous update checker (every 30 seconds)
   */
  startUpdateChecker() {
    if (!this.isClient) return;

    const checkForUpdates = async () => {
      try {
        // Check service worker updates
        if (this.hasServiceWorker) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.update();

            // Listen for new service worker
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content available
                    this.notifyUpdateAvailable();
                  }
                });
              }
            });
          }
        }

        // Check for new app version via timestamp
        const response = await fetch('/api/health?' + this.getCacheVersion(), {
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
        });

        if (response.ok) {
          await response.json(); // Check server response without storing
          const lastVersion = localStorage.getItem('app-last-check');
          const currentTime = Date.now().toString();

          if (lastVersion && Math.abs(parseInt(currentTime) - parseInt(lastVersion)) > 300000) {
            // 5 minutes
            this.notifyUpdateAvailable();
          }

          localStorage.setItem('app-last-check', currentTime);
        }
      } catch (error) {
        console.warn('Update check failed:', error);
      }
    };

    // Initial check
    checkForUpdates();

    // Setup interval
    this.updateCheckInterval = setInterval(checkForUpdates, 30000);

    return this.updateCheckInterval;
  }

  /**
   * Notify user of available updates
   */
  notifyUpdateAvailable() {
    if (!this.isClient) return;

    // Create native notification if possible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('เว็บไซต์มีอัปเดต', {
        body: 'มีเนื้อหาใหม่พร้อมให้ดู คลิกเพื่อรีเฟรช',
        icon: '/favicon.webp',
        badge: '/favicon.webp',
        tag: 'update-available',
        renotify: true,
      });
    } else {
      // Fallback to confirm dialog
      if (confirm('🔄 เว็บไซต์มีการอัปเดตใหม่\nคลิก OK เพื่อดูเนื้อหาล่าสุด')) {
        this.forceRefresh();
      }
    }
  }

  /**
   * Clear all browser caches (enhanced for 2025)
   */
  async clearAllCaches() {
    if (!this.isClient) return false;

    try {
      const promises = [];

      // Clear service worker caches
      if ('caches' in window) {
        promises.push(
          caches.keys().then(names => Promise.all(names.map(name => caches.delete(name))))
        );
      }

      // Clear browser storage (preserve saved cars)
      if (window.localStorage) {
        const savedCars = localStorage.getItem('savedCars');
        localStorage.clear();
        if (savedCars) localStorage.setItem('savedCars', savedCars);
      }

      if (window.sessionStorage) {
        sessionStorage.clear();
      }

      // Clear IndexedDB
      if (window.indexedDB) {
        promises.push(this.clearIndexedDB());
      }

      await Promise.all(promises);
      // eslint-disable-next-line no-console
      console.log('✅ All caches cleared for fresh content');
      return true;
    } catch (error) {
      console.error('❌ Error clearing caches:', error);
      return false;
    }
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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

  // eslint-disable-next-line no-console
  console.log('🛠️ Development cache tools available:');
  // eslint-disable-next-line no-console
  console.log('  - window.clearAllCaches()');
  // eslint-disable-next-line no-console
  console.log('  - window.getCacheInfo()');
  // eslint-disable-next-line no-console
  console.log('  - window.triggerRevalidation(secret)');
  // eslint-disable-next-line no-console
  console.log('  - window.cacheManager');
}

export default cacheManager;
