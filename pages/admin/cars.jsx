import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SEO from '../../components/SEO';

function AdminCarsManagement() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, available, reserved
  const [isUpdating, setIsUpdating] = useState({});

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include',
        });

        if (response.ok) {
          setIsAuthenticated(true);
          fetchCars();
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch all cars from Shopify
  const fetchCars = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };

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
      // console.log('📤 Sending request:', { carId, status: newStatus });

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

        // ✅ Fetch fresh data from API to sync with file storage
        await fetchCars();
        return true;
      }

      // Non-OK path
      const error = await safeParseJson(response);
      // eslint-disable-next-line no-console
      console.error('❌ Error response:', response.status, error);
      return { status: response.status, error };
    };

    try {
      let result = await doRequest();
      // If CSRF issue or unauthorized, try to refresh CSRF via /api/admin/verify then retry once
      if (result && result.status && (result.status === 401 || result.status === 403)) {
        try {
          // Refresh session/CSRF cookie
          await fetch('/api/admin/verify', { credentials: 'include' });
        } catch {
          // ignore
        }
        // Retry once
        result = await doRequest();
      }

      if (result !== true) {
        const msg = typeof result?.error?.error === 'string' ? result.error.error : 'Unknown error';
        alert(`ไม่สามารถเปลี่ยนสถานะได้: ${msg}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Network/Fetch error:', error);
      alert(`ไม่สามารถเปลี่ยนสถานะได้: ${error.message || 'Network error'}`);
    } finally {
      setIsUpdating(prev => ({ ...prev, [carId]: false }));
    }
  };

  // Safe JSON parse helper
  async function safeParseJson(response) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

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

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <SEO
        title="จัดการรถ | Admin Dashboard"
        description="ระบบจัดการสถานะรถยนต์มือสอง"
        robots="noindex, nofollow"
      />

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-blue-700 shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="กลับไป Dashboard"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white font-prompt">จัดการรถทั้งหมด</h1>
                  <p className="text-sm text-white/80">ระบบจัดการสถานะรถยนต์</p>
                </div>
              </div>
              <button
                onClick={fetchCars}
                className="btn-primary flex items-center gap-2"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                รีเฟรช
              </button>
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <label className="form-label" htmlFor="searchCars">
                  ค้นหารถ
                </label>
                <input
                  type="text"
                  id="searchCars"
                  className="form-input w-full"
                  placeholder="ค้นหาจากยี่ห้อ รุ่น หรือชื่อ..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-64">
                <label className="form-label" htmlFor="filterStatus">
                  กรองตามสถานะ
                </label>
                <select
                  id="filterStatus"
                  className="form-select w-full"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="available">พร้อมขาย</option>
                  <option value="reserved">จองแล้ว</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">ทั้งหมด:</span>
                <span className="font-semibold text-gray-900">{cars.length} คัน</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-600">พร้อมขาย:</span>
                <span className="font-semibold text-green-600">
                  {cars.filter(c => c.status === 'available').length} คัน
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-gray-600">จองแล้ว:</span>
                <span className="font-semibold text-red-600">
                  {cars.filter(c => c.status === 'reserved').length} คัน
                </span>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredCars.map(car => (
                <div
                  key={car.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Car Image */}
                  <div className="relative h-48 bg-gray-200">
                    {car.image ? (
                      <Image
                        src={car.image}
                        alt={car.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg
                          className="w-16 h-16 text-gray-400"
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

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          car.status === 'available'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {car.status === 'available' ? '✓ พร้อมขาย' : '✕ จองแล้ว'}
                      </span>
                    </div>
                  </div>

                  {/* Car Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 font-prompt line-clamp-2 mb-2">
                      {car.title}
                    </h3>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {car.brand && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">ยี่ห้อ:</span>
                          <span>{car.brand}</span>
                        </div>
                      )}
                      {car.model && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">รุ่น:</span>
                          <span>{car.model}</span>
                        </div>
                      )}
                      {car.year && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">ปี:</span>
                          <span>{car.year}</span>
                        </div>
                      )}
                      {car.price && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">ราคา:</span>
                          <span className="text-accent font-semibold">
                            {parseInt(car.price).toLocaleString()} บาท
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Toggle Switch */}
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">สถานะ:</span>
                        <label
                          className="cursor-pointer"
                          aria-label="Toggle car reservation status"
                        >
                          <input
                            type="checkbox"
                            checked={car.status === 'reserved'}
                            onChange={() => {
                              if (!isUpdating[car.id]) {
                                toggleCarStatus(car.id, car.status);
                              }
                            }}
                            disabled={isUpdating[car.id]}
                            className="sr-only peer"
                            aria-label={`สถานะ${car.title}: ${car.status === 'available' ? 'พร้อมขาย' : 'จองแล้ว'}`}
                          />
                          <div
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 ${
                              car.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                            } ${isUpdating[car.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                car.status === 'available' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {car.status === 'available'
                          ? 'คลิกเพื่อเปลี่ยนเป็นจองแล้ว'
                          : 'คลิกเพื่อเปลี่ยนเป็นพร้อมขาย'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminCarsManagement;
