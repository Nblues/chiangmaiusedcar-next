import React, { useState } from 'react';

export default function ModernToolsPanel() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});

  const runTool = async (toolId, endpoint, method = 'GET', body = null) => {
    setLoading(prev => ({ ...prev, [toolId]: true }));
    setResults(prev => ({ ...prev, [toolId]: null }));

    try {
      const options = { method, credentials: 'include' };
      if (body) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      setResults(prev => ({ ...prev, [toolId]: data }));
    } catch (error) {
      setResults(prev => ({ ...prev, [toolId]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [toolId]: false }));
    }
  };

  const toolCategories = [
    {
      id: 'monitoring',
      title: 'ตรวจสอบระบบ',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      tools: [
        {
          id: 'health',
          name: 'Health Check',
          description: 'ตรวจสอบสถานะระบบทั้งหมด',
          endpoint: '/api/health',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          ),
        },
        {
          id: 'test-shopify',
          name: 'ทดสอบ Shopify',
          description: 'เชื่อมต่อ Shopify API',
          endpoint: '/api/test-shopify',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
        },
        {
          id: 'test-email',
          name: 'ทดสอบอีเมล',
          description: 'ระบบส่งอีเมล EmailJS',
          endpoint: '/api/test-email',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: 'cache',
      title: 'จัดการแคช',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
          />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      tools: [
        {
          id: 'cache-no-cache',
          name: 'No Cache Policy',
          description: 'เนื้อหาล่าสุดเสมอ (HTML)',
          endpoint: '/api/cache-control?type=no-cache',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          ),
        },
        {
          id: 'cache-static',
          name: 'Static Assets',
          description: 'Cache CSS/JS/Fonts นาน',
          endpoint: '/api/cache-control?type=static&maxAge=31536000',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          ),
        },
        {
          id: 'cache-images',
          name: 'Images Cache',
          description: 'Cache รูปภาพ 30 วัน',
          endpoint: '/api/cache-control?type=images&maxAge=2592000',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: 'seo',
      title: 'SEO & Indexing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      tools: [
        {
          id: 'indexnow-home',
          name: 'IndexNow: หน้าแรก',
          description: 'ส่งหน้าแรกไป Search Engines',
          endpoint: '/api/indexnow',
          method: 'POST',
          body: { url: 'https://www.chiangmaiusedcar.com/' },
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          ),
        },
        {
          id: 'indexnow-cars',
          name: 'IndexNow: รายการรถ',
          description: 'ส่งหน้ารถทั้งหมด',
          endpoint: '/api/indexnow',
          method: 'POST',
          body: { url: 'https://www.chiangmaiusedcar.com/all-cars' },
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              />
            </svg>
          ),
        },
        {
          id: 'og-preview',
          name: 'OG Preview',
          description: 'ตรวจสอบ Open Graph tags',
          endpoint: '/api/og-preview?url=/',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: 'social',
      title: 'Social Media',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      ),
      color: 'from-pink-500 to-pink-600',
      tools: [
        {
          id: 'facebook-rescrape',
          name: 'Facebook Re-scrape',
          description: 'รีเฟรช OG cache ของ Facebook',
          endpoint:
            '/api/social/rescrape?secret=' + (process.env.NEXT_PUBLIC_RESCRAPE_SECRET || ''),
          method: 'POST',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: 'debug',
      title: 'Debug & Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      tools: [
        {
          id: 'debug-env',
          name: 'Environment Vars',
          description: 'ตรวจสอบ ENV variables',
          endpoint: '/api/debug-env',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ),
        },
        {
          id: 'analytics-test',
          name: 'Analytics Test',
          description: 'ทดสอบ performance metrics',
          endpoint: '/api/analytics',
          method: 'POST',
          body: {
            type: 'test',
            timestamp: new Date().toISOString(),
            url: '/admin/dashboard',
          },
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  const toggleCategory = categoryId => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="space-y-3">
      {toolCategories.map(category => (
        <div
          key={category.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          {/* Category Header - Clickable */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r hover:opacity-90 transition-opacity"
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm text-white`}>
                {category.icon}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white font-prompt text-sm">{category.title}</h3>
                <p className="text-xs text-white text-opacity-80">
                  {category.tools.length} เครื่องมือ
                </p>
              </div>
            </div>
            <div className="text-white">
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {/* Tools Grid - Collapsible */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              expandedCategory === category.id
                ? 'max-h-[2000px] opacity-100'
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.tools.map(tool => (
                <div key={tool.id} className="group">
                  <button
                    onClick={() => runTool(tool.id, tool.endpoint, tool.method, tool.body)}
                    disabled={loading[tool.id]}
                    className={`w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all text-left ${
                      loading[tool.id]
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-sm hover:border-primary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary bg-opacity-10 rounded-lg text-primary group-hover:bg-opacity-20 transition-colors flex-shrink-0">
                        {tool.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm font-prompt truncate">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Result Badge */}
                  {results[tool.id] && (
                    <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-semibold ${
                            results[tool.id].success === false ||
                            results[tool.id].error ||
                            results[tool.id].ok === false
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {results[tool.id].success === false ||
                          results[tool.id].error ||
                          results[tool.id].ok === false
                            ? '✕ ล้มเหลว'
                            : '✓ สำเร็จ'}
                        </span>
                        <details className="text-xs text-gray-600">
                          <summary className="cursor-pointer hover:text-primary">
                            รายละเอียด
                          </summary>
                          <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto max-h-32">
                            {JSON.stringify(results[tool.id], null, 2)}
                          </pre>
                        </details>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Quick Links Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-gray-800 mb-3 font-prompt text-sm flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          ลิงก์ที่เกี่ยวข้อง
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Sitemap', url: '/sitemap.xml' },
            { name: 'Robots.txt', url: '/robots.txt' },
            { name: 'Cars Sitemap', url: '/sitemap-cars.xml' },
            { name: 'Images Sitemap', url: '/sitemap-images.xml' },
          ].map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:text-primary hover:border-primary transition-colors text-center"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
