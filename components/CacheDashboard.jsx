import React, { useState, useEffect } from 'react';
import { useCacheManager } from '../lib/cache';

export default function CacheDashboard() {
  const { cacheInfo, isClearing, clearCaches, forceReload, triggerRevalidation, isPWA } =
    useCacheManager();

  const [isRevalidating, setIsRevalidating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    setLastUpdate(new Date().toLocaleString('th-TH'));
  }, [cacheInfo]);

  const handleRevalidation = async () => {
    setIsRevalidating(true);
    try {
      const success = await triggerRevalidation('dev-secret');
      if (success) {
        alert('✅ Revalidation สำเร็จ! หน้าเว็บจะอัปเดตเนื้อหาใหม่');
      } else {
        alert('❌ Revalidation ล้มเหลว กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsRevalidating(false);
    }
  };

  const handleClearCaches = async () => {
    if (confirm('🗑️ คุณต้องการลบ cache ทั้งหมดใช่หรือไม่?\nเว็บไซต์จะโหลดใหม่หลังจากลบ cache')) {
      const success = await clearCaches();
      if (success) {
        setTimeout(() => {
          forceReload();
        }, 1000);
      }
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // ไม่แสดงใน production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Cache Dashboard</h3>
        <span className="text-xs text-gray-500">{isPWA ? '📱 PWA' : '🌐 Web'}</span>
      </div>

      {/* Cache Info */}
      <div className="space-y-2 mb-4">
        <div className="text-xs">
          <strong>Service Worker:</strong> {cacheInfo?.serviceWorkerStatus || 'Loading...'}
        </div>
        <div className="text-xs">
          <strong>Last Update:</strong> {lastUpdate || 'N/A'}
        </div>
        <div className="text-xs">
          <strong>Storage:</strong>{' '}
          {cacheInfo?.localStorage && cacheInfo?.sessionStorage ? '✅' : '❌'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleRevalidation}
          disabled={isRevalidating}
          className="w-full px-3 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRevalidating ? '🔄 Revalidating...' : '🔄 Force Revalidate'}
        </button>

        <button
          onClick={handleClearCaches}
          disabled={isClearing}
          className="w-full px-3 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isClearing ? '🗑️ Clearing...' : '🗑️ Clear All Caches'}
        </button>

        <button
          onClick={forceReload}
          className="w-full px-3 py-2 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          🔄 Force Reload
        </button>
      </div>

      {/* Cache Info Details */}
      {cacheInfo && (
        <div className="mt-4 pt-4 border-t">
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-600">Technical Details</summary>
            <div className="mt-2 space-y-1 text-gray-500">
              <div>SW: {cacheInfo.hasServiceWorker ? '✅' : '❌'}</div>
              <div>LS: {cacheInfo.localStorage ? '✅' : '❌'}</div>
              <div>SS: {cacheInfo.sessionStorage ? '✅' : '❌'}</div>
              <div>IDB: {cacheInfo.indexedDB ? '✅' : '❌'}</div>
              {cacheInfo.serviceWorkerScope && <div>Scope: {cacheInfo.serviceWorkerScope}</div>}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
