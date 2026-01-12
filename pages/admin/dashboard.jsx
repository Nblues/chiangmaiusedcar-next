import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import SEO from '../../components/SEO';

// Lazy load admin components
const ToolsPanel = dynamic(() => import('../../components/admin/ToolsPanel'), { ssr: false });

// Main dashboard component
function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');

  const seo = (
    <SEO
      title="Admin Dashboard"
      description="ระบบจัดการหลังบ้านสำหรับเว็บไซต์ครูหนึ่งรถสวย"
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
          setIsAuthenticated(true);
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
            <p className="mt-4 text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return <>{seo}</>;
  }

  return (
    <>
      {seo}

      <div className="min-h-screen bg-gray-100">
        {/* Modern Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="absolute -left-[9999px] w-[1px] h-[1px] overflow-hidden">
              Admin Dashboard - ระบบจัดการหลังบ้าน
            </h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6 text-white"
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
                  <h1 className="text-xl font-bold text-primary font-prompt">Admin Dashboard</h1>
                  <p className="text-xs text-gray-500">ครูหนึ่งรถสวย - ระบบจัดการ</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-gray-500">ผู้ดูแลระบบ</p>
                  <p className="text-sm font-semibold text-primary">{username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/cars')}
              className="group relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="text-left text-white">
                  <h3 className="text-lg font-bold font-prompt mb-1 text-white">จัดการรถทั้งหมด</h3>
                  <p className="text-sm opacity-90 text-white/90">จัดการสถานะรถยนต์</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => router.push('/')}
              className="group relative overflow-hidden bg-gradient-to-br from-accent to-orange-600 hover:from-orange-600 hover:to-accent text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-bold font-prompt mb-1">ดูหน้าเว็บไซต์</h3>
                  <p className="text-sm opacity-90">เข้าสู่หน้าบ้าน</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </div>
            </button>

            <button
              onClick={() => window.open('/admin/access-guide', '_blank')}
              className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-700 hover:from-green-700 hover:to-green-500 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-bold font-prompt mb-1">คู่มือใช้งาน</h3>
                  <p className="text-sm opacity-90">วิธีการใช้งานระบบ</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </button>
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
