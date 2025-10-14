import React, { useState } from 'react';

export default function QuickActions() {
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});

  const runAction = async (actionId, endpoint, method = 'GET') => {
    setLoading(prev => ({ ...prev, [actionId]: true }));
    setResults(prev => ({ ...prev, [actionId]: null }));

    try {
      const response = await fetch(endpoint, {
        method,
        credentials: 'include',
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, [actionId]: data }));
    } catch (error) {
      setResults(prev => ({ ...prev, [actionId]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [actionId]: false }));
    }
  };

  const actions = [
    {
      id: 'test-shopify',
      title: '🛒 Test Shopify',
      description: 'ทดสอบการเชื่อมต่อ Shopify API',
      endpoint: '/api/test-shopify',
      color: 'from-green-400 to-green-500',
    },
    {
      id: 'test-email',
      title: '📧 Test Email',
      description: 'ทดสอบระบบส่ง Email',
      endpoint: '/api/test-email',
      color: 'from-blue-400 to-blue-500',
    },
    {
      id: 'check-health',
      title: '🏥 Health Check',
      description: 'ตรวจสอบสถานะระบบทั้งหมด',
      endpoint: '/api/health',
      color: 'from-purple-400 to-purple-500',
    },
    {
      id: 'debug-env',
      title: '🔧 Debug Environment',
      description: 'ตรวจสอบ environment variables',
      endpoint: '/api/debug-env',
      color: 'from-orange-400 to-orange-500',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <h2 className="text-xl font-bold font-prompt">⚡ Quick Actions</h2>
        <p className="text-sm text-white/80 mt-1">เครื่องมือทดสอบระบบอย่างรวดเร็ว</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map(action => (
            <div key={action.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => runAction(action.id, action.endpoint)}
                disabled={loading[action.id]}
                className={`w-full p-4 text-left transition-all duration-200 relative ${
                  loading[action.id] ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 pointer-events-none`}
                ></div>
                <div className="relative z-10">
                  <h3 className="font-bold text-lg font-prompt text-gray-800 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </button>

              {/* Result Display */}
              {results[action.id] && (
                <div
                  className={`p-4 border-t ${
                    results[action.id].success === false
                      ? 'bg-red-50 border-red-200'
                      : 'bg-green-50 border-green-200'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold mb-2 ${
                      results[action.id].success === false ? 'text-red-800' : 'text-green-800'
                    }`}
                  >
                    {results[action.id].success === false ? '❌ ล้มเหลว' : '✅ สำเร็จ'}
                  </p>
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                      ดูรายละเอียด
                    </summary>
                    <pre className="mt-2 p-2 bg-white rounded border border-gray-200 overflow-x-auto">
                      {JSON.stringify(results[action.id], null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
