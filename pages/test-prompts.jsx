import React, { useState } from 'react';
import SEO from '../components/SEO';

export default function TestPrompts() {
  const [resetCookies, setResetCookies] = useState(0);
  const [resetPWA, setResetPWA] = useState(0);

  const handleResetCookies = () => {
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-timestamp');
    setResetCookies(prev => prev + 1);
    window.location.reload();
  };

  const handleResetPWA = () => {
    localStorage.removeItem('pwa-installed');
    sessionStorage.removeItem('pwa-prompt-dismissed');
    setResetPWA(prev => prev + 1);
    window.location.reload();
  };

  return (
    <>
      <SEO
        title="ทดสอบ Cookie Consent และ PWA Install - ครูหนึ่งรถสวย"
        description="หน้าทดสอบสำหรับ Cookie Consent และ PWA Install Prompt"
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 font-prompt text-center">
              ทดสอบ Cookie Consent และ PWA Install
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Cookie Consent Testing */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4 font-prompt">
                  🍪 Cookie Consent
                </h2>

                <div className="space-y-4 text-sm text-blue-800">
                  <div className="bg-white p-3 rounded border">
                    <strong>คุณสมบัติ:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>แสดงหลังจาก 3 วินาที</li>
                      <li>อนิเมชั่นเลื่อนขึ้นอย่างนุ่มนวล</li>
                      <li>หากยินยอมจะไม่แสดงอีกเป็นเวลา 30 วัน</li>
                      <li>หากปฏิเสธจะไม่แสดงในเซสชั่นนี้</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <strong>สถานะปัจจุบัน:</strong>
                    <p className="mt-1">
                      Cookie Consent:{' '}
                      {typeof window !== 'undefined'
                        ? localStorage.getItem('cookie-consent') || 'ยังไม่ตั้งค่า'
                        : 'Loading...'}
                    </p>
                    {typeof window !== 'undefined' &&
                      localStorage.getItem('cookie-consent-timestamp') && (
                        <p>
                          วันที่ยินยอม:{' '}
                          {new Date(
                            parseInt(localStorage.getItem('cookie-consent-timestamp'))
                          ).toLocaleString('th-TH')}
                        </p>
                      )}
                  </div>

                  <button
                    onClick={handleResetCookies}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    รีเซ็ต Cookie Consent
                  </button>
                </div>
              </div>

              {/* PWA Install Testing */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 mb-4 font-prompt">
                  📱 PWA Install Prompt
                </h2>

                <div className="space-y-4 text-sm text-green-800">
                  <div className="bg-white p-3 rounded border">
                    <strong>คุณสมบัติ:</strong>
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                      <li>แสดงหลังจาก 30 วินาที</li>
                      <li>หากติดตั้งแล้วจะไม่แสดงอีก</li>
                      <li>หากถอนการติดตั้งจะแสดงอีกครั้ง</li>
                      <li>หากปิดจะไม่แสดงในเซสชั่นนี้</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <strong>สถานะปัจจุบัน:</strong>
                    <p className="mt-1">
                      PWA Installed:{' '}
                      {typeof window !== 'undefined'
                        ? localStorage.getItem('pwa-installed') || 'ไม่ได้ติดตั้ง'
                        : 'Loading...'}
                    </p>
                    <p>
                      Session Dismissed:{' '}
                      {typeof window !== 'undefined'
                        ? sessionStorage.getItem('pwa-prompt-dismissed') || 'ไม่ได้ปิด'
                        : 'Loading...'}
                    </p>
                    <p>
                      Standalone Mode:{' '}
                      {typeof window !== 'undefined'
                        ? window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone === true
                          ? 'Yes'
                          : 'No'
                        : 'Loading...'}
                    </p>
                  </div>

                  <button
                    onClick={handleResetPWA}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    รีเซ็ต PWA Status
                  </button>
                </div>
              </div>
            </div>

            {/* การทดสอบ */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4 font-prompt">
                📋 วิธีทดสอบ
              </h3>

              <div className="space-y-3 text-sm text-yellow-800">
                <div>
                  <strong>Cookie Consent:</strong>
                  <ol className="mt-1 space-y-1 list-decimal list-inside ml-4">
                    <li>กดปุ่ม "รีเซ็ต Cookie Consent"</li>
                    <li>รอ 3 วินาที จะเห็น popup เลื่อนขึ้นมาจากด้านล่าง</li>
                    <li>ทดสอบกดปุ่ม "ยอมรับทั้งหมด" หรือ "ปฏิเสธ"</li>
                    <li>popup จะเลื่อนลงและหายไป</li>
                  </ol>
                </div>

                <div>
                  <strong>PWA Install:</strong>
                  <ol className="mt-1 space-y-1 list-decimal list-inside ml-4">
                    <li>กดปุ่ม "รีเซ็ต PWA Status"</li>
                    <li>รอ 30 วินาที จะเห็น popup ติดตั้งแอพ</li>
                    <li>ทดสอบกดปุ่ม "ติดตั้งแอพ" หรือ "ไว้ทีหลัง"</li>
                    <li>popup จะหายไปและจำสถานะ</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* กลับหน้าแรก */}
            <div className="mt-8 text-center">
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors font-prompt"
              >
                ← กลับหน้าแรก
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Render คอมโพเนนต์ที่ต้องทดสอบ - เฉพาะในหน้านี้ */}
      {/* CookieConsent และ PWAInstallPrompt จะถูกโหลดจาก _app.jsx อัตโนมัติ */}
    </>
  );
}
