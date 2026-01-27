import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { readCookieConsent, writeCookieConsent } from '../utils/cookieConsent';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // 2026-style: versioned consent with long-lived storage.
    // If consent exists (and matches current version), don't re-prompt.
    const consent = readCookieConsent();
    if (consent) return;

    // Show banner after a short delay (avoid competing with hydration)
    const timer = setTimeout(() => {
      setShowConsent(true);
      setTimeout(() => setIsVisible(true), 50);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isClient]);

  const acceptAllCookies = () => {
    if (!isClient) return;

    // Consent for analytics + marketing cookies
    writeCookieConsent({ analytics: true, marketing: true });

    // อนิเมชั่นเลื่อนลงก่อนซ่อน
    setIsVisible(false);
    setTimeout(() => {
      setShowConsent(false);
    }, 300);
  };

  const acceptEssentialOnly = () => {
    if (!isClient) return;

    // Essential-only: no analytics/marketing. Still remember choice to avoid re-prompting.
    writeCookieConsent({ analytics: false, marketing: false });

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
                <h3 className="font-extrabold text-gray-950 mb-2 text-lg sm:text-xl leading-snug">
                  เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ
                </h3>
                <p className="text-gray-900/90 text-[13px] sm:text-sm mb-3 leading-relaxed">
                  เราใช้คุกกี้ที่จำเป็นต่อการทำงานของเว็บไซต์ และ (ถ้าท่านยินยอม) คุกกี้เพื่อ
                  วิเคราะห์การใช้งาน/การตลาด เพื่อปรับปรุงบริการให้ดียิ่งขึ้น
                </p>

                <div className="text-xs text-gray-700">
                  อ่านเพิ่มเติมได้ที่{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-primary font-semibold underline decoration-2 underline-offset-2 hover:text-primary-600"
                  >
                    นโยบายความเป็นส่วนตัว
                  </Link>{' '}
                  และ{' '}
                  <Link
                    href="/terms-of-service"
                    className="text-primary font-semibold underline decoration-2 underline-offset-2 hover:text-primary-600"
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
                onClick={acceptAllCookies}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
              >
                ยอมรับทั้งหมด
              </button>

              <button
                onClick={acceptEssentialOnly}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition-colors duration-200 text-sm"
              >
                ยอมรับเฉพาะที่จำเป็น
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
