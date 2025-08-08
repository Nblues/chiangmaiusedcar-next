import React, { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if running as PWA
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // ตรวจสอบว่าได้ติดตั้งแล้วหรือไม่
    const isInstalled = localStorage.getItem('pwa-installed') === 'true';
    if (isInstalled || isStandaloneMode) {
      return; // ไม่แสดงถ้าติดตั้งแล้ว
    }

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = e => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt after 30 seconds
      setTimeout(() => {
        if (!localStorage.getItem('pwa-installed')) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      localStorage.setItem('pwa-installed', 'true');
      setShowInstallPrompt(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS, show prompt after 30 seconds if not already installed
    if (iOS && !isStandaloneMode && !isInstalled) {
      setTimeout(() => {
        if (!localStorage.getItem('pwa-installed')) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    }

    // ตรวจสอบการเปลี่ยนแปลงสถานะ standalone (เมื่อผู้ใช้ถอนการติดตั้ง)
    const checkStandaloneChange = () => {
      const currentStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

      if (!currentStandalone && localStorage.getItem('pwa-installed') === 'true') {
        // ถ้าเคยติดตั้งแต่ตอนนี้ไม่ใช่ standalone mode แสดงว่าถูกถอนการติดตั้ง
        localStorage.removeItem('pwa-installed');
        setIsStandalone(false);
      }
    };

    // ตรวจสอบทุก 5 วินาที
    const checkInterval = setInterval(checkStandaloneChange, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(checkInterval);
    };
  }, [isClient]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      if (outcome === 'accepted') {
        // บันทึกว่าผู้ใช้ติดตั้งแล้ว
        localStorage.setItem('pwa-installed', 'true');
      }

      // Clear the deferredPrompt variable
      setDeferredPrompt(null);
    } else {
      // สำหรับ iOS หรือกรณีอื่นๆ ที่ไม่มี deferredPrompt
      localStorage.setItem('pwa-installed', 'true');
    }

    // Hide the prompt
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session only
    if (isClient) {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

  // Don't show if already installed, dismissed for this session, or not client
  const isInstalled = isClient && localStorage.getItem('pwa-installed') === 'true';
  const isDismissedThisSession = isClient && sessionStorage.getItem('pwa-prompt-dismissed');

  if (!isClient || isStandalone || isInstalled || isDismissedThisSession || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 font-prompt">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🚗</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 mb-2">ติดตั้งแอพ ครูหนึ่งรถสวย</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              ติดตั้งแอพบนหน้าจอของคุณเพื่อเข้าถึงได้รวดเร็ว ดูรถใหม่ได้ทันที!
            </p>

            {isIOS ? (
              // iOS Instructions
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>วิธีติดตั้งบน iPhone/iPad:</strong>
                  <br />
                  1. แตะปุ่ม{' '}
                  <span className="inline-flex items-center px-1 py-0.5 bg-blue-200 rounded text-blue-900">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>{' '}
                  แชร์ ด้านล่างหน้าจอ
                  <br />
                  2. เลื่อนลงแล้วแตะ{' '}
                  <span className="font-semibold">&quot;เพิ่มที่หน้าจอหลัก&quot;</span>
                  <br />
                  3. แตะ <span className="font-semibold">&quot;เพิ่ม&quot;</span> เพื่อยืนยัน
                </p>
              </div>
            ) : (
              // Android/Desktop Instructions
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-green-800">
                  แตะ <strong>&quot;ติดตั้งแอพ&quot;</strong> เพื่อเพิ่มไอคอนบนหน้าจอของคุณ
                </p>
              </div>
            )}

            <div className="flex gap-2">
              {!isIOS && deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  ติดตั้งแอพ
                </button>
              ) : null}

              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
              >
                {isIOS ? 'ปิด' : 'ไว้ทีหลัง'}
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
            aria-label="ปิด"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
