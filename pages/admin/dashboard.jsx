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
      description="เธฃเธฐเธเธเธเธฑเธ”เธเธฒเธฃเธซเธฅเธฑเธเธเนเธฒเธเธชเธณเธซเธฃเธฑเธเน€เธงเนเธเนเธเธ•เนเธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข"
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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</p>
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

      <div className="min-h-screen bg-gray-100">
        {/* Modern Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="sr-only">Admin Dashboard - เธฃเธฐเธเธเธเธฑเธ”เธเธฒเธฃเธซเธฅเธฑเธเธเนเธฒเธ</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                  <svg
                    className="w-5 h-5 text-white"
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
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-prompt leading-tight">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">เธ เธฒเธเธฃเธงเธกเธฃเธฐเธเธ</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right mr-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    เธเธฑเธเธเธตเธเธนเนเธ”เธนเนเธฅ
                  </p>
                  <p className="text-sm font-semibold text-gray-900 leading-none mt-1">
                    {username}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 text-sm font-medium border border-red-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">เธญเธญเธเธเธฒเธเธฃเธฐเธเธ</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Quick Actions Dashboard */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 font-prompt mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full inline-block"></span>
              เน€เธกเธเธนเธเธฑเธ”เธเธฒเธฃเธซเธฅเธฑเธ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Manage Cars Card */}
              

              {/* Valuation Dashboard Card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => router.push('/admin/valuation')}
                className="group relative cursor-pointer overflow-hidden bg-white border border-gray-100 hover:border-purple-500/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-prompt text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                  ประเมินราคากลางรถ
                </h3>
                <p className="text-sm text-gray-500">
                  วิเคราะห์โครงสร้างราคารถด้วย AI, เช็คราคาอ้างอิงจากตลาด
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>

              {/* View Website Card */}
              <div role="button" tabIndex={0} onClick={() => router.push('/')}
                className="group relative overflow-hidden bg-white border border-gray-100 hover:border-accent/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-orange-50 text-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-prompt text-gray-900 mb-1 group-hover:text-accent transition-colors">
                  เธ”เธนเธซเธเนเธฒเน€เธงเนเธเนเธเธ•เนเธเธฃเธดเธ
                </h3>
                <p className="text-sm text-gray-500">
                  เธเธฅเธฑเธเนเธเธขเธฑเธเธซเธเนเธฒเธฃเนเธฒเธเธซเธฅเธฑเธเธเธญเธเธฅเธนเธเธเนเธฒ เน€เธเธทเนเธญเธ”เธนเธเธฒเธฃเนเธชเธ”เธเธเธฅ
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div></div>

              {/* Guide Card */}
              <div role="button" tabIndex={0} onClick={() => window.open('/admin/access-guide', '_blank')}
                className="group relative overflow-hidden bg-white border border-gray-100 hover:border-green-500/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 text-left flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold font-prompt text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                  เธเธนเนเธกเธทเธญเนเธเนเธเธฒเธ
                </h3>
                <p className="text-sm text-gray-500">
                  เธงเธดเธเธตเธเธฒเธฃเนเธเนเธเธฒเธเธฃเธฐเธเธเธซเธฅเธฑเธเธเนเธฒเธเนเธฅเธฐเธเธนเนเธกเธทเธญเธชเธณเธซเธฃเธฑเธเนเธญเธ”เธกเธดเธ
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div></div>
            </div>
          </div>

          {/* Modern 2025 Dashboard */}
          <ToolsPanel />
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
    <main id="main" role="main">
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



