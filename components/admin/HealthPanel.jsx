import React, { useState, useEffect } from 'react';

export default function HealthPanel() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = status => {
    if (status?.includes('✅')) return 'bg-green-100 text-green-800 border-green-200';
    if (status?.includes('❌')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-primary to-blue-600 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-prompt">🏥 สถานะระบบ</h2>
          <p className="text-sm text-white/80 mt-1">System Health Monitoring</p>
        </div>
        <button
          onClick={checkHealth}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 text-sm font-semibold"
        >
          🔄 รีเฟรช
        </button>
      </div>

      <div className="p-6">
        {health && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                    ✅
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-semibold">ระบบปกติ</p>
                    <p className="text-2xl font-bold text-green-800">
                      {health.summary?.healthy || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl">
                    ❌
                  </div>
                  <div>
                    <p className="text-sm text-red-600 font-semibold">มีปัญหา</p>
                    <p className="text-2xl font-bold text-red-800">{health.summary?.issues || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
                    📊
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-semibold">ทั้งหมด</p>
                    <p className="text-2xl font-bold text-blue-800">{health.summary?.total || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 mb-3 font-prompt">รายละเอียดบริการ:</h3>

              {health.services &&
                Object.entries(health.services).map(([serviceName, serviceData]) => (
                  <div
                    key={serviceName}
                    className={`border rounded-lg p-4 ${getStatusColor(serviceData.status)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg capitalize font-prompt">
                        {serviceName}
                      </h4>
                      <span className="text-2xl">{serviceData.status}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-3">
                      {Object.entries(serviceData).map(([key, value]) => {
                        if (key === 'status') return null;
                        return (
                          <div key={key} className="flex justify-between">
                            <span className="font-semibold capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-gray-700">{value?.toString() || '-'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>

            {/* Last Check */}
            {lastCheck && (
              <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                ตรวจสอบล่าสุด: {lastCheck.toLocaleString('th-TH')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
