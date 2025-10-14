import React, { useState } from 'react';

export default function SEOPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submitToIndexNow = async url => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkOGPreview = async url => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/og-preview?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <h2 className="text-xl font-bold font-prompt">🔍 SEO Management Tools</h2>
          <p className="text-sm text-white/80 mt-1">เครื่องมือจัดการ SEO และ Social Sharing</p>
        </div>

        <div className="p-6 space-y-6">
          {/* IndexNow Section */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-3 font-prompt">
              📡 IndexNow Submission
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ส่ง URL ไปยัง search engines (Bing, Yandex, Naver) ให้ index ทันที
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => submitToIndexNow('https://www.chiangmaiusedcar.com/')}
                disabled={loading}
                className="btn-primary py-3"
              >
                Submit หน้าแรก
              </button>
              <button
                onClick={() => submitToIndexNow('https://www.chiangmaiusedcar.com/all-cars')}
                disabled={loading}
                className="btn-primary py-3"
              >
                Submit รายการรถ
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* OG Preview Section */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-3 font-prompt">
              👁️ Open Graph Preview
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ตรวจสอบ meta tags สำหรับการแชร์บน Social Media
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => checkOGPreview('/')}
                disabled={loading}
                className="btn-secondary py-3"
              >
                Preview หน้าแรก
              </button>
              <button
                onClick={() => checkOGPreview('/all-cars')}
                disabled={loading}
                className="btn-secondary py-3"
              >
                Preview รายการรถ
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Sitemap Links */}
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-3 font-prompt">🗺️ Sitemaps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <p className="font-semibold text-gray-800">Sitemap Index</p>
                <p className="text-sm text-gray-600">/sitemap.xml</p>
              </a>
              <a
                href="/sitemap-cars.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <p className="font-semibold text-gray-800">Cars Sitemap</p>
                <p className="text-sm text-gray-600">/sitemap-cars.xml</p>
              </a>
              <a
                href="/sitemap-images.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <p className="font-semibold text-gray-800">Images Sitemap</p>
                <p className="text-sm text-gray-600">/sitemap-images.xml</p>
              </a>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
              >
                <p className="font-semibold text-gray-800">Robots.txt</p>
                <p className="text-sm text-gray-600">/robots.txt</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div
          className={`rounded-lg shadow-sm overflow-hidden ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className={`px-6 py-4 ${result.success ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            <h3 className="font-bold font-prompt">
              {result.success ? '✅ สำเร็จ!' : '❌ เกิดข้อผิดพลาด'}
            </h3>
          </div>
          <div className="p-6">
            <pre className="bg-white p-4 rounded border border-gray-200 overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
