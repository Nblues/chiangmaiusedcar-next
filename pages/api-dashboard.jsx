// pages/api-dashboard.jsx
// หน้าแดชบอร์ดสำหรับตรวจสอบการเชื่อมต่อ API ต่างๆ

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '../components/SEO';
import { safeAPIFetch } from '../lib/safeFetch';

export default function APIDashboard() {
  const [healthData, setHealthData] = useState(null);
  const [shopifyData, setShopifyData] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthCheck = async () => {
    const data = await safeAPIFetch('/api/health', {
      fallback: { error: 'Health check API unavailable' },
    });
    setHealthData(data);
  };

  const fetchShopifyTest = async () => {
    const data = await safeAPIFetch('/api/test-shopify?limit=3', {
      fallback: { error: 'Shopify test API unavailable' },
    });
    setShopifyData(data);
  };

  const fetchEmailTest = async () => {
    const data = await safeAPIFetch('/api/test-email', {
      method: 'POST',
      body: { testEmail: 'admin@chiangmaiusedcar.com' },
      fallback: { error: 'Email test API unavailable' },
    });
    setEmailData(data);
  };

  useEffect(() => {
    const runTests = async () => {
      setLoading(true);
      await Promise.all([fetchHealthCheck(), fetchShopifyTest(), fetchEmailTest()]);
      setLoading(false);
    };

    runTests();
  }, []);

  const refreshTests = () => {
    setHealthData(null);
    setShopifyData(null);
    setEmailData(null);
    const runTests = async () => {
      setLoading(true);
      await Promise.all([fetchHealthCheck(), fetchShopifyTest(), fetchEmailTest()]);
      setLoading(false);
    };
    runTests();
  };

  return (
    <>
      <SEO
        title="API Dashboard - ระบบตรวจสอบการเชื่อมต่อ"
        description="แดชบอร์ดตรวจสอบสถานะการเชื่อมต่อ API ต่างๆ ของระบบรถมือสองเชียงใหม่ ครูหนึ่งรถสวย"
        url="/api-dashboard"
        image="/herobanner/api-dashboard.webp"
        noindex={true}
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-8 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-prompt font-bold text-gray-900">API Dashboard</h1>
                <p className="text-gray-600 mt-2">ตรวจสอบการเชื่อมต่อ API และบริการต่างๆ</p>
              </div>
              <button
                type="button"
                onClick={refreshTests}
                disabled={loading}
                className="bg-primary hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {loading ? 'กำลังทดสอบ...' : 'รีเฟรช'}
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-4 text-lg text-gray-600">กำลังทดสอบการเชื่อมต่อ...</span>
              </div>
            </div>
          )}

          {/* Health Check */}
          {healthData && (
            <div className="bg-white shadow rounded-lg mb-8 p-6">
              <h2 className="text-xl font-prompt font-semibold mb-4">🏥 Health Check</h2>
              {healthData.error ? (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-800">❌ ข้อผิดพลาด: {healthData.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        healthData.status === 'healthy'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {healthData.status === 'healthy' ? '✅ สุขภาพดี' : '⚠️ มีปัญหาบางส่วน'}
                    </span>
                    <span className="text-gray-500 text-sm">{healthData.timestamp}</span>
                  </div>

                  {healthData.summary && (
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {healthData.summary.total}
                        </div>
                        <div className="text-sm text-gray-600">บริการทั้งหมด</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {healthData.summary.healthy}
                        </div>
                        <div className="text-sm text-gray-600">ทำงานปกติ</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {healthData.summary.issues}
                        </div>
                        <div className="text-sm text-gray-600">มีปัญหา</div>
                      </div>
                    </div>
                  )}

                  {healthData.services && (
                    <div className="space-y-3">
                      {Object.entries(healthData.services).map(([service, data]) => (
                        <div key={service} className="border rounded p-3">
                          <h3 className="font-medium capitalize mb-2">{service}</h3>
                          <div className="text-sm space-y-1">
                            {typeof data === 'object' &&
                              Object.entries(data).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-600">{key}:</span>
                                  <span
                                    className={
                                      typeof value === 'string' && value.includes('✅')
                                        ? 'text-green-600'
                                        : typeof value === 'string' && value.includes('❌')
                                          ? 'text-red-600'
                                          : 'text-gray-900'
                                    }
                                  >
                                    {value}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Shopify Test */}
          {shopifyData && (
            <div className="bg-white shadow rounded-lg mb-8 p-6">
              <h2 className="text-xl font-prompt font-semibold mb-4">🛒 Shopify API Test</h2>
              {shopifyData.error || !shopifyData.success ? (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-800">❌ การเชื่อมต่อ Shopify ล้มเหลว</p>
                  <p className="text-red-600 text-sm mt-1">
                    {shopifyData.error || 'Unknown error'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <p className="text-green-800">✅ เชื่อมต่อ Shopify สำเร็จ</p>
                    <p className="text-green-600 text-sm">
                      ดึงข้อมูลรถ {shopifyData.totalCars} คัน
                    </p>
                  </div>

                  {shopifyData.metadata && (
                    <div className="bg-gray-50 rounded p-4">
                      <h3 className="font-medium mb-2">ข้อมูลการเชื่อมต่อ</h3>
                      <div className="text-sm space-y-1">
                        <div>Domain: {shopifyData.metadata.domain}</div>
                        <div>API Version: {shopifyData.metadata.apiVersion}</div>
                        <div>Token: {shopifyData.metadata.hasToken ? '✅ มี' : '❌ ไม่มี'}</div>
                      </div>
                    </div>
                  )}

                  {shopifyData.cars && shopifyData.cars.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">ตัวอย่างข้อมูลรถ</h3>
                      <div className="space-y-3">
                        {shopifyData.cars.slice(0, 2).map((car, index) => (
                          <div key={index} className="border rounded p-3">
                            <div className="font-medium">{car.title}</div>
                            <div className="text-sm text-gray-600">
                              {car.specs.brand} {car.specs.model} {car.specs.year}
                            </div>
                            <div className="text-sm font-medium text-accent">
                              {car.price.formatted}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Email Test */}
          {emailData && (
            <div className="bg-white shadow rounded-lg mb-8 p-6">
              <h2 className="text-xl font-prompt font-semibold mb-4">📧 EmailJS Configuration</h2>
              {emailData.error || !emailData.success ? (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <p className="text-red-800">❌ EmailJS configuration ไม่สมบูรณ์</p>
                  <p className="text-red-600 text-sm mt-1">
                    {emailData.error || 'Configuration missing'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <p className="text-green-800">✅ EmailJS configuration สมบูรณ์</p>
                    <p className="text-green-600 text-sm">{emailData.message}</p>
                  </div>

                  {emailData.config && (
                    <div className="bg-gray-50 rounded p-4">
                      <h3 className="font-medium mb-2">การตั้งค่า EmailJS</h3>
                      <div className="text-sm space-y-1">
                        {Object.entries(emailData.config).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600">{key}:</span>
                            <span
                              className={value.includes('✅') ? 'text-green-600' : 'text-red-600'}
                            >
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {emailData.note && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <p className="text-blue-800 text-sm">💡 {emailData.note}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-prompt font-semibold mb-4">🔗 Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/" className="p-4 border rounded hover:bg-gray-50 transition-colors">
                <div className="font-medium">กลับหน้าหลัก</div>
                <div className="text-sm text-gray-600">หน้าเว็บไซต์</div>
              </Link>
              <button
                type="button"
                onClick={refreshTests}
                disabled={loading}
                className="p-4 border rounded hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
              >
                <div className="font-medium">รีเฟรชข้อมูล</div>
                <div className="text-sm text-gray-600">ทดสอบการเชื่อมต่ออีกครั้ง</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// SSR for real-time API monitoring and system status
export async function getServerSideProps() {
  if (process.env.NODE_ENV === 'production') {
    return { notFound: true };
  }
  return {
    props: {},
  };
}
