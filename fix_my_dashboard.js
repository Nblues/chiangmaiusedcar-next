const fs = require('fs');
const content = \
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SEO from '../../components/SEO';
import { isAuthenticated } from '../../middleware/adminAuth';

// Lazy load admin components
const ToolsPanel = dynamic(() => import('../../components/admin/ToolsPanel'), { ssr: false });

// Main dashboard component
function AdminDashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');

  const seo = (
    <SEO
      title="Admin Dashboard"
      description="ระบบจดการหลงบานสำหรบเวบไซตครหนงรถสวย"
      url="/admin/dashboard"
      noindex={true}
    />
  );

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUsername(data.user?.username || 'Admin');
        } else {
          // Not authenticated - redirect to login
          router.push('/admin/login');
        }
      } catch {
        // Network error or server down - redirect to login
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/admin/login');
    } catch {
      // Silent fail - just redirect
      router.push('/admin/login');
    }
  };

  if (isLoading) {
    return (
      <>
        {seo}
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-prompt antialiased">
          <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-700 font-medium">กำลงโหลดเขาสระบบ...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isLoggedIn) {
    return <>{seo}</>;
  }

  return (
    <>
      {seo}

      <div className="min-h-screen bg-slate-50 font-prompt antialiased text-slate-800">
        {/* Modern Header - crisp borders and shadows */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="sr-only">Admin Dashboard - ระบบจดการหลงบาน</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center shadow-md border border-blue-800/10">
                  <svg
                    className="w-6 h-6 text-white drop-shadow-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    แอดมนแดชบอรด
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">แผงควบคมระบบจดการขอมล</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right mr-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    บญชผดแลระบบ
                  </p>
                  <p className="text-sm font-bold text-slate-900 leading-none mt-1">
                    \
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 rounded-xl hover:shadow-sm transition-all duration-200 text-sm font-bold border border-slate-200 hover:border-red-200 group"
                >
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline tracking-wide">ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Quick Actions Dashboard */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3 tracking-tight">
              <span className="w-2 h-6 bg-primary rounded-full inline-block shadow-sm"></span>
              เมนทางลด (Quick Actions)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              
              {/* Valuation Dashboard Card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => router.push('/admin/valuation')}
                className="group relative cursor-pointer overflow-hidden bg-white border border-slate-200 hover:border-purple-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-purple-100">
                  <svg className="w-7 h-7 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors tracking-tight">
                  ประเมนราคากลางรถ
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  วเคราะหโครงสรางราคารถดวย AI, เชคราคาอางองจากตลาด
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>

              {/* View Website Card */}
              <div role="button" tabIndex={0} onClick={() => router.push('/')}
                className="group relative cursor-pointer overflow-hidden bg-white border border-slate-200 hover:border-orange-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-orange-100">
                  <svg className="w-7 h-7 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors tracking-tight">
                  ดหนาเวบไซตจรง
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  กลบไปยงหนาแรกของเวบไซต เพอดลกษณะการแสดงผลจรงทลกคาเหน
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>

              {/* Guide Card */}
              <div role="button" tabIndex={0} onClick={() => window.open('/admin/access-guide', '_blank')}
                className="group relative cursor-pointer overflow-hidden bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col items-start"
              >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-emerald-100">
                  <svg className="w-7 h-7 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors tracking-tight">
                  คมอการใชงาน
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  เรยนรวธการทำงานของระบบ แนะนำการจดการรถยนตและเครองมอตาง
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
            </div>
          </div>

          {/* Modern 2025 Dashboard Tools Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 mb-8 transform transition-all duration-300">
             <ToolsPanel />
          </div>
        </div>
      </div>
    </>
  );
}

// Set displayName for admin layout detection
AdminDashboard.displayName = 'AdminDashboard';

// Use custom layout (minimal, no Navbar/Footer/PWA)
AdminDashboard.getLayout = function getLayout(page) {
  return (
    <main id="main" role="main" className="antialiased bg-slate-50">
      {page}
    </main>
  );
};

export default AdminDashboard;

export async function getServerSideProps({ req }) {
  if (!isAuthenticated(req)) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}
\;

fs.writeFileSync('pages/admin/dashboard.jsx', content.trim() + '\n', 'utf8');
