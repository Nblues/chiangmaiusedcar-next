import React, { useState } from 'react';

export default function CachePanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRevalidate = async (paths, force = false) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET || 'dev-secret',
          paths: paths || ['/', '/all-cars', '/about', '/contact', '/promotion'],
          force,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'รีเฟรชหน้าหลัก',
      description: 'อัปเดตเนื้อหาหน้าแรก',
      icon: '🏠',
      action: () => handleRevalidate(['/'], false),
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'รีเฟรชรายการรถ',
      description: 'อัปเดตหน้ารถทั้งหมด',
      icon: '🚗',
      action: () => handleRevalidate(['/all-cars'], false),
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'รีเฟรชทุกหน้า',
      description: 'อัปเดตเนื้อหาทั้งเว็บ',
      icon: '🔄',
      action: () => handleRevalidate(null, false),
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'บังคับรีเฟรช',
      description: 'ล้าง cache ทั้งหมดแล้ว rebuild',
      icon: '⚡',
      action: () => handleRevalidate(null, true),
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <h2 className="text-xl font-bold font-prompt">🗄️ จัดการ Cache & Revalidation</h2>
          <p className="text-sm text-white/80 mt-1">ควบคุมการอัปเดตเนื้อหาและ cache ของเว็บไซต์</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                disabled={loading}
                className={`relative overflow-hidden rounded-lg p-6 text-left transition-all duration-200 transform hover:scale-105 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 pointer-events-none`}
                ></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{action.icon}</div>
                  <h3 className="font-bold text-lg font-prompt mb-1 text-gray-800">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </button>
            ))}
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
            {result.success ? (
              <div className="space-y-3">
                <p className="text-green-800 font-semibold">{result.message}</p>
                {result.revalidated && (
                  <div className="mt-4 space-y-2">
                    <p className="font-semibold text-gray-700">ผลลัพธ์:</p>
                    {result.revalidated.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded border border-green-200"
                      >
                        <span className="font-mono text-sm text-gray-700">{item.path}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'revalidated' || item.status === 'force-revalidated'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'skipped'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-800 font-semibold">{result.error || result.message}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex gap-3">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2 font-prompt">ข้อมูลการใช้งาน</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>รีเฟรชหน้าหลัก:</strong> อัปเดตข้อมูลหน้าแรกทันที
              </li>
              <li>
                • <strong>รีเฟรชรายการรถ:</strong> อัปเดตรายการรถทั้งหมด
              </li>
              <li>
                • <strong>รีเฟรชทุกหน้า:</strong> อัปเดตเนื้อหาทุกหน้าที่เปลี่ยนแปลง
              </li>
              <li>
                • <strong>บังคับรีเฟรช:</strong> ล้าง cache ทั้งหมดและสร้างใหม่ (ใช้เวลานาน)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
