import React, { useState, useEffect } from 'react';
import { useCacheManager } from '../lib/cache';

export default function CacheDashboard() {
  const { cacheInfo, isClearing, clearCaches, forceReload, triggerRevalidation, isPWA } =
    useCacheManager();

  const [isRevalidating, setIsRevalidating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [swStatus, setSwStatus] = useState('checking...');

  useEffect(() => {
    setLastUpdate(new Date().toLocaleString('th-TH'));
    checkServiceWorkerStatus();
  }, [cacheInfo]);

  const checkServiceWorkerStatus = async () => {
    if (!('serviceWorker' in navigator)) {
      setSwStatus('not-supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration('/');
      if (registration) {
        if (registration.active) {
          setSwStatus('active');
        } else if (registration.installing) {
          setSwStatus('installing');
        } else if (registration.waiting) {
          setSwStatus('waiting');
        } else {
          setSwStatus('registered');
        }
      } else {
        setSwStatus('not-registered');
      }
    } catch (error) {
      setSwStatus('error');
    }
  };

  const handleServiceWorkerAction = async action => {
    if (!('serviceWorker' in navigator)) {
      alert('❌ เบราว์เซอร์ไม่รองรับ Service Worker');
      return;
    }

    try {
      switch (action) {
        case 'register':
          const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
          const swFile = isDev ? '/sw-dev.js' : '/sw.js';
          await navigator.serviceWorker.register(swFile, { scope: '/' });
          alert('✅ ลงทะเบียน Service Worker สำเร็จ');
          break;

        case 'unregister':
          const registration = await navigator.serviceWorker.getRegistration('/');
          if (registration) {
            await registration.unregister();
            alert('✅ ยกเลิกการลงทะเบียน Service Worker สำเร็จ');
          } else {
            alert('⚠️ ไม่พบ Service Worker ที่ลงทะเบียน');
          }
          break;

        case 'update':
          const reg = await navigator.serviceWorker.getRegistration('/');
          if (reg) {
            await reg.update();
            alert('✅ อัปเดต Service Worker สำเร็จ');
          } else {
            alert('⚠️ ไม่พบ Service Worker ที่จะอัปเดต');
          }
          break;
      }

      setTimeout(checkServiceWorkerStatus, 1000);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const getSwStatusText = () => {
    switch (swStatus) {
      case 'active':
        return '✅ ทำงาน';
      case 'installing':
        return '🔧 กำลังติดตั้ง';
      case 'waiting':
        return '⏳ รอการเปิดใช้งาน';
      case 'registered':
        return '📋 ลงทะเบียนแล้ว';
      case 'not-registered':
        return '❌ ไม่ได้ลงทะเบียน';
      case 'not-supported':
        return '❌ ไม่รองรับ';
      case 'error':
        return '❌ ข้อผิดพลาด';
      default:
        return '🔍 กำลังตรวจสอบ...';
    }
  };

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
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border max-w-sm z-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Cache Dashboard</h3>
        <span className="text-xs text-gray-500">{isPWA ? '📱 PWA' : '🌐 Web'}</span>
      </div>

      {/* Cache Info */}
      <div className="space-y-2 mb-4">
        <div className="text-xs">
          <strong>Service Worker:</strong> {getSwStatusText()}
        </div>
        <div className="text-xs">
          <strong>Last Update:</strong> {lastUpdate || 'N/A'}
        </div>
        <div className="text-xs">
          <strong>Storage:</strong>{' '}
          {cacheInfo?.localStorage && cacheInfo?.sessionStorage ? '✅' : '❌'}
        </div>
        <div className="text-xs">
          <strong>PWA Mode:</strong> {isPWA ? '📱 Yes' : '🌐 No'}
        </div>
      </div>

      {/* Service Worker Controls */}
      {swStatus !== 'not-supported' && (
        <div className="space-y-1 mb-4">
          <div className="text-xs font-semibold text-gray-700">Service Worker:</div>
          <div className="flex gap-1">
            {swStatus === 'not-registered' && (
              <button
                onClick={() => handleServiceWorkerAction('register')}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                📋 Register
              </button>
            )}
            {['active', 'registered', 'waiting'].includes(swStatus) && (
              <>
                <button
                  onClick={() => handleServiceWorkerAction('update')}
                  className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  🔄 Update
                </button>
                <button
                  onClick={() => handleServiceWorkerAction('unregister')}
                  className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  🗑️ Remove
                </button>
              </>
            )}
          </div>
        </div>
      )}

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

        <a
          href="/test-sw.html"
          target="_blank"
          className="block w-full text-center px-3 py-2 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
        >
          🔧 SW Test Center
        </a>

        <a
          href="/debug-console.html"
          target="_blank"
          className="block w-full text-center px-3 py-2 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
        >
          🐛 Console Debug
        </a>

        <a
          href="/console-errors-explained.html"
          target="_blank"
          className="block w-full text-center px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          📖 Error Explanations
        </a>

        <a
          href="/test-manifest.html"
          target="_blank"
          className="block w-full text-center px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          📋 Manifest Test
        </a>
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
