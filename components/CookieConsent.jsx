import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // ตรวจสอบว่าผู้ใช้ได้ยอมรับคุกกี้แล้วหรือไม่
    const consent = localStorage.getItem('cookie-consent');
    const consentTimestamp = localStorage.getItem('cookie-consent-timestamp');

    if (!consent) {
      // แสดง popup หลังจาก 3 วินาที พร้อมอนิเมชั่นเลื่อนขึ้น
      const timer = setTimeout(() => {
        setShowConsent(true);
        // ใช้ timeout เล็กน้อยเพื่อให้ DOM update ก่อน แล้วเริ่มอนิเมชั่น
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (consent === 'accepted' && consentTimestamp) {
      // ตรวจสอบว่าคุกกี้หมดอายุหรือไม่ (30 วัน)
      const consentDate = new Date(parseInt(consentTimestamp));
      const now = new Date();
      const daysDiff = (now - consentDate) / (1000 * 60 * 60 * 24);

      if (daysDiff >= 30) {
        // คุกกี้หมดอายุแล้ว ลบและแสดงอีกครั้ง
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-timestamp');

        const timer = setTimeout(() => {
          setShowConsent(true);
          setTimeout(() => {
            setIsVisible(true);
          }, 50);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isClient]);

  const acceptCookies = () => {
    if (!isClient) return;

    // บันทึกการยอมรับพร้อม timestamp
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString());

    // อนิเมชั่นเลื่อนลงก่อนซ่อน
    setIsVisible(false);
    setTimeout(() => {
      setShowConsent(false);
    }, 300);
  };

  const rejectCookies = () => {
    if (!isClient) return;

    // บันทึกการปฏิเสธ (ไม่ตั้ง timestamp เพื่อให้ถามอีกครั้งในเซสชั่นใหม่)
    localStorage.setItem('cookie-consent', 'rejected');

    // อนิเมชั่นเลื่อนลงก่อนซ่อน
    setIsVisible(false);
    setTimeout(() => {
      setShowConsent(false);
    }, 300);
  };

  if (!isClient || !showConsent) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-70 font-prompt transform transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* ข้อความและข้อมูล */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🍪</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ
                </h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  เว็บไซต์ของเราใช้คุกกี้เพื่อช่วยในการวิเคราะห์การใช้งาน ปรับปรุงประสิทธิภาพ
                  และให้บริการที่ดีขึ้น การใช้งานเว็บไซต์ต่อไปถือว่าท่านยอมรับการใช้คุกกี้
                </p>

                <div className="text-xs text-gray-500">
                  อ่านเพิ่มเติมได้ที่{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:text-primary-600 underline"
                  >
                    นโยบายความเป็นส่วนตัว
                  </Link>{' '}
                  และ{' '}
                  <Link
                    href="/terms-of-service"
                    className="text-primary hover:text-primary-600 underline"
                  >
                    เงื่อนไขการใช้งาน
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ปุ่มควบคุม */}
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptCookies}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
              >
                ยอมรับทั้งหมด
              </button>

              <button
                onClick={rejectCookies}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-colors duration-200 text-sm"
              >
                ปฏิเสธ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
