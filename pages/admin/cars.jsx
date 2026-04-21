import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import A11yImage from '../../components/A11yImage';
import SEO from '../../components/SEO';
import { isAuthenticated } from '../../middleware/adminAuth';

function AdminCarsManagement() {
    const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, available, reserved
  const [isUpdating, setIsUpdating] = useState({});

  const seo = (
    <SEO
      title="จัดการรถยนต์ (Admin)"
      description="ระบบจัดการรถยนต์หลังบ้าน ครูหนึ่งรถสวย"
      url="/admin/cars"
      noindex={true}
    />
  );

  // Fetch all cars from Shopify
  const fetchCars = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const response = await fetch('/api/admin/cars/list', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCars(data.cars || []);
        setFilteredCars(data.cars || []);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch cars:', error);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include',
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (response.ok) {
          setIsAuthenticated(true);
          fetchCars();
        } else {
          // eslint-disable-next-line no-console
          console.warn('Auth check failed:', response.status);
          router.push('/admin/login');
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Toggle car availability status
  const toggleCarStatus = async (carId, currentStatus) => {
    setIsUpdating(prev => ({ ...prev, [carId]: true }));

    // eslint-disable-next-line no-console
    console.log('🔄 Toggling car status:', { carId, currentStatus });

    // ตรวจสอบว่า currentStatus เป็น undefined หรือไม่
    if (!currentStatus) {
      // eslint-disable-next-line no-console
      console.error(
        '❌ currentStatus is undefined! Car data:',
        cars.find(c => c.id === carId)
      );
      alert('ไม่สามารถเปลี่ยนสถานะได้: ไม่พบสถานะปัจจุบัน');
      setIsUpdating(prev => ({ ...prev, [carId]: false }));
      return;
    }
    const doRequest = async () => {
      const newStatus = currentStatus === 'available' ? 'reserved' : 'available';

      const getCookie = name => {
        if (typeof document === 'undefined') return '';
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : '';
      };
      const csrfToken = getCookie('__Host-csrfToken') || getCookie('csrfToken');

      // eslint-disable-next-line no-console
      console.log('📤 Sending request:', {
        url: '/api/admin/cars/toggle-status',
        carId,
        newStatus,
        csrfToken: csrfToken ? 'Present' : 'Missing',
      });

      const response = await fetch('/api/admin/cars/toggle-status', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          carId,
          status: newStatus,
        }),
      });

      // eslint-disable-next-line no-console
      console.log('📥 Response status:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line no-console
        console.log('✅ Success:', data);

        // Update local state
        setCars(prevCars =>
          prevCars.map(car =>
            car.id === carId
              ? {
                  ...car,
                  status: newStatus,
                }
              : car
          )
        );

        // Update filtered cars
        setFilteredCars(prevCars =>
          prevCars.map(car =>
            car.id === carId
              ? {
                  ...car,
                  status: newStatus,
                }
              : car
          )
        );

        // ✅ Fetch fresh data from API to sync with file storage (silent fetch to avoid screen flash)
        await fetchCars(false);
        return true;
      }

      // Non-OK path
      let errorData = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: 'Invalid server response' };
      }

      // eslint-disable-next-line no-console
      console.error('❌ Error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      return { status: response.status, error: errorData };
    };

    try {
      let result = await doRequest();

      // If CSRF issue or unauthorized, try to refresh CSRF via /api/admin/verify then retry once
      if (result && result.status && (result.status === 401 || result.status === 403)) {
        // eslint-disable-next-line no-console
        console.warn('🔄 Auth issue detected, refreshing CSRF and retrying...');
        try {
          // Refresh session/CSRF cookie
          await fetch('/api/admin/verify', { credentials: 'include' });
        } catch {
          // ignore refresh error
        }
        // Retry once
        result = await doRequest();
      }

      if (result !== true) {
        // Extract error message
        let errorMsg = 'Unknown error';
        if (result?.error?.error) {
          errorMsg = result.error.error;
        } else if (result?.error?.message) {
          errorMsg = result.error.message;
        } else if (result?.status) {
          errorMsg = `HTTP ${result.status}: ${result.error?.details || 'Request failed'}`;
        }

        // eslint-disable-next-line no-console
        console.error('Final error message:', errorMsg);
        alert(`ไม่สามารถเปลี่ยนสถานะได้:\n${errorMsg}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Network/Fetch error:', error);
      alert(`ไม่สามารถเปลี่ยนสถานะได้:\n${error.message || 'ข้อผิดพลาดในการเชื่อมต่อ'}`);
    } finally {
      setIsUpdating(prev => ({ ...prev, [carId]: false }));
    }
  };

  // Filter cars based on search and status
  useEffect(() => {
    let filtered = [...cars];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(car => car.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        car =>
          car.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.model?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCars(filtered);
  }, [searchQuery, filterStatus, cars]);

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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="sr-only">จัดการรถทั้งหมด - Admin Dashboard</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all duration-200 border border-gray-200 shadow-sm"
                  title="กลับไป Dashboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl items-center justify-center shadow-md">
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-prompt leading-tight">
                      จัดการคลังรถยนต์
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">
                      ระบบควบคุมสถานะสินค้า
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => fetchCars(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-blue-800 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium text-sm"
                disabled={isLoading}
              >
                <svg
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {isLoading ? 'กำลังรีเฟรช...' : 'รีเฟรชข้อมูล'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Advanced Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 transition-all">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Box */}
              <div className="flex-1 relative group">
                <label className="sr-only" htmlFor="searchCars">
                  ค้นหารถ
                </label>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="searchCars"
                  name="searchCars"
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm transition-all text-gray-900 placeholder-gray-400"
                  placeholder="ค้นหาชื่อรถ, ยี่ห้อ, หรือรุ่น..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-56 relative group">
                <label className="sr-only" htmlFor="filterStatus">
                  กรองตามสถานะ
                </label>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                  <svg
                    className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <select
                  id="filterStatus"
                  name="filterStatus"
                  className="block w-full pl-10 pr-8 py-2.5 bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm transition-all text-gray-700 appearance-none font-medium"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">แสดงทุกสถานะ</option>
                  <option value="available">🟢 พร้อมขาย</option>
                  <option value="reserved">🔴 จองแล้ว</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Modern Stats */}
            <div className="mt-5 grid grid-cols-3 gap-3 md:gap-4 pt-5 border-t border-gray-100">
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex items-center justify-between border border-gray-100 transition-all hover:bg-gray-100/80">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">รถทั้งหมด</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">
                    {cars.length}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="bg-green-50/50 rounded-xl p-3 sm:p-4 flex items-center justify-between border border-green-100 transition-all hover:bg-green-50">
                <div>
                  <p className="text-xs text-green-600 font-medium mb-1">พร้อมขาย</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-700 leading-none">
                    {cars.filter(c => c.status === 'available').length}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="bg-red-50/50 rounded-xl p-3 sm:p-4 flex items-center justify-between border border-red-100 transition-all hover:bg-red-50">
                <div>
                  <p className="text-xs text-red-600 font-medium mb-1">จองแล้ว</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-700 leading-none">
                    {cars.filter(c => c.status === 'reserved').length}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-200 text-red-700 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลรถ...</p>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-gray-600">ไม่พบรถที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 whitespace-nowrap">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-2 sm:px-4 py-3 w-12 sm:w-16 text-center">
                        รูปภาพ
                      </th>
                      <th scope="col" className="px-2 sm:px-4 py-3 min-w-[150px] sm:min-w-[250px]">
                        ข้อมูลรถ
                      </th>
                      <th scope="col" className="px-4 py-3 hidden md:table-cell">
                        ยี่ห้อ / รุ่น
                      </th>
                      <th scope="col" className="px-4 py-3 text-center hidden sm:table-cell">
                        ปี
                      </th>
                      <th scope="col" className="px-2 sm:px-4 py-3 text-right">
                        ราคา
                      </th>
                      <th scope="col" className="px-2 sm:px-4 py-3 text-center">
                        จัดการสถานะ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map(car => (
                      <tr
                        key={car.id}
                        className="bg-white border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-2 sm:px-4 py-2">
                          <div className="relative w-12 h-9 sm:w-16 sm:h-12 rounded overflow-hidden bg-gray-200 shadow-sm mx-auto">
                            {car.image ? (
                              <A11yImage
                                src={car.image}
                                alt={car.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <svg
                                  className="w-4 h-4 sm:w-6 sm:h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-2">
                          <div
                            className="font-semibold text-gray-900 line-clamp-2 max-w-[150px] sm:max-w-[250px] whitespace-normal font-prompt text-xs sm:text-sm"
                            title={car.title}
                          >
                            {car.title}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                            ID: {String(car.id).slice(-6)}
                          </div>
                        </td>
                        <td className="px-4 py-2 hidden md:table-cell">
                          <div className="text-gray-900 font-medium text-xs sm:text-sm">
                            {car.brand || '-'}
                          </div>
                          <div
                            className="text-xs text-gray-500 truncate max-w-[120px]"
                            title={car.model}
                          >
                            {car.model || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center text-gray-700 hidden sm:table-cell">
                          {car.year || '-'}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-right">
                          <div className="text-accent font-bold text-xs sm:text-sm">
                            {car.price ? `${Number(car.price).toLocaleString()} ฿` : '-'}
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-2">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
                            <span
                              className={`inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold w-20 sm:w-24 shrink-0 ${
                                car.status === 'available'
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}
                            >
                              {car.status === 'available' ? 'พร้อมขาย' : 'จองแล้ว'}
                            </span>

                            <button
                              onClick={() => {
                                if (!isUpdating[car.id]) {
                                  toggleCarStatus(car.id, car.status);
                                }
                              }}
                              disabled={isUpdating[car.id]}
                              className={`relative inline-flex h-6 w-10 sm:h-7 sm:w-12 shrink-0 items-center rounded-full transition-all duration-300 shadow-inner ${
                                car.status === 'available'
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'bg-red-500 hover:bg-red-600'
                              } ${
                                isUpdating[car.id]
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'cursor-pointer focus:ring-2 focus:ring-primary focus:ring-offset-2'
                              }`}
                              title={
                                isUpdating[car.id] ? 'กำลังอัปเดต...' : 'คลิกเพื่อเปลี่ยนสถานะ'
                              }
                            >
                              <span
                                className={`h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow flex items-center justify-center text-[8px] sm:text-[10px] font-bold transition-all duration-300 ${
                                  car.status === 'available'
                                    ? 'translate-x-1 text-green-600'
                                    : 'translate-x-[16px] sm:translate-x-6 text-red-600'
                                }`}
                              >
                                {isUpdating[car.id] ? '⟳' : car.status === 'available' ? '✓' : '✕'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminCarsManagement;

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
