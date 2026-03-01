import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import CarCard from '../components/CarCard';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify.mjs';
import { readCarStatuses } from '../lib/carStatusStore.js';
import { getCachedStatuses, setCachedStatuses } from '../lib/carStatusCache';
import { scheduleAfterLoadThenIdle } from '../utils/scheduler';
import { mergeCarSpecs } from '../lib/mergeCarSpecs';

async function safeFetchJson(url, fetchOptions = {}, timeoutMs = 8000) {
  let timeoutId;
  const controller = new AbortController();
  try {
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const resp = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    let data;
    try {
      data = await resp.json();
    } catch {
      data = null;
    }

    return { ok: resp.ok, status: resp.status, data };
  } catch (error) {
    return { ok: false, status: 0, data: null, error };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function normalizeQueryString(input, maxLen) {
  return String(input || '')
    .trim()
    .slice(0, maxLen);
}

function normalizePriceRange(input) {
  const value = String(input || 'all');
  if (value === 'all') return 'all';
  // allow forms like 100000-200000 or 700000
  if (/^\d+(?:-\d+)?$/.test(value)) return value;
  return 'all';
}

function normalizeBrand(input) {
  const value = normalizeQueryString(input, 40);
  return value ? value : 'all';
}

function normalizePageNumber(input) {
  const pg = parseInt(String(input || '1'), 10);
  return Number.isFinite(pg) && pg > 0 ? pg : 1;
}

export default function AllCars({
  cars,
  totalCount,
  totalPages,
  initialSearchTerm,
  initialPriceRange,
  initialBrandFilter,
  initialPage,
  structuredDataJson,
  shopifyError,
  seoAllCars,
  allCarsFaqs,
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [brandFilter, setBrandFilter] = useState(initialBrandFilter);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [liveStatuses, setLiveStatuses] = useState(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    const img = heroImgRef.current;
    if (!img) return;

    // React/ESLint disagree on `fetchPriority` vs `fetchpriority`.
    // Set it imperatively so browsers get the hint without React warnings.
    try {
      img.setAttribute('fetchpriority', 'high');
    } catch {
      // ignore
    }

    try {
      img.setAttribute('fetchpriority', 'high');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'development') return;

    const onUnhandled = event => {
      const reason = event?.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : typeof reason?.message === 'string'
            ? reason.message
            : '';

      if (
        message.includes('Failed to fetch') ||
        message.includes('NetworkError when attempting to fetch resource')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', onUnhandled);
    return () => window.removeEventListener('unhandledrejection', onUnhandled);
  }, []);

  // Keep state in sync when user lands via router navigation (client-side) to a URL with params
  useEffect(() => {
    if (!router?.isReady) return;
    const q = router.query || {};
    const nextSearch = q.search ? normalizeQueryString(q.search, 120) : '';
    const nextPrice = q.price ? normalizePriceRange(q.price) : 'all';
    const nextBrand = q.brand ? normalizeBrand(q.brand) : 'all';
    const nextPage = q.page ? normalizePageNumber(q.page) : 1;

    setSearchTerm(prev => (prev === nextSearch ? prev : nextSearch));
    setPriceRange(prev => (prev === nextPrice ? prev : nextPrice));
    setBrandFilter(prev => (prev === nextBrand ? prev : nextBrand));
    setCurrentPage(prev => (prev === nextPage ? prev : nextPage));
  }, [router?.isReady, router?.query]);

  // SSR already provides only current page cars + totalCount/totalPages.
  // Keep client work minimal to reduce hydration cost (TBT).
  const safeTotalPages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;
  const safePage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const currentCars = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);
  const currentIds = useMemo(() => currentCars.map(c => c.id).filter(Boolean), [currentCars]);
  const currentCarsWithLive = useMemo(() => {
    if (!liveStatuses) return currentCars;
    try {
      return currentCars.map(c => {
        const s = liveStatuses[c.id]?.status;
        return s ? { ...c, status: s } : c;
      });
    } catch {
      return currentCars;
    }
  }, [currentCars, liveStatuses]);

  // Fetch latest statuses for current page cars on mount and page/filter change (with cache)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!currentIds || currentIds.length === 0) return;

    let cancelled = false;

    // Defer non-critical fetch to reduce main-thread contention during initial render.
    let cleanup = () => {};

    // Apply cached statuses immediately (no network / minimal work)
    try {
      const cached = getCachedStatuses(currentIds);
      if (cached) {
        if (!cancelled) setLiveStatuses(cached);
      }
    } catch {
      // ignore
    }

    const fetchStatuses = async () => {
      try {
        // Check cache first
        const cached = getCachedStatuses(currentIds);
        if (cached) return;

        const qs = new URLSearchParams({ ids: currentIds.join(',') });
        const result = await safeFetchJson(
          `/api/public/car-status?${qs.toString()}`,
          {
            cache: 'no-store',
            credentials: 'same-origin',
          },
          6000
        );

        if (!result.ok) {
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn(
              `car-status fetch failed (status=${result.status || 'n/a'})`,
              result?.error?.message || ''
            );
          }
          return;
        }

        const data = result.data;
        if (!cancelled && data?.ok && data.statuses) {
          setCachedStatuses(data.statuses);
          setLiveStatuses(data.statuses);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('Failed to fetch car statuses:', error?.message);
        }
        // Silently fail - don't break the page on fetch error
      }
    };

    // Only run network fetch after the page load event and when the browser is idle.
    // This reduces TBT and avoids Lighthouse observing in-flight API calls during page load.
    cleanup = scheduleAfterLoadThenIdle(
      () => {
        fetchStatuses().catch(() => {});
      },
      { timeout: 5000, fallbackDelayMs: 3500 }
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [currentIds]);

  // Enrich specs for current page cards by calling the same API as the car detail page.
  // For stability on paginated pages (2+), allow limited retries when a handle returns
  // empty/incomplete specs (e.g. transient Admin fallback failures).
  // Removed heavy car-specs polling fetch loop for performance.

  // Determine if current view is filtered (query params affecting list)
  const isFiltered = useMemo(() => {
    const hasSearch = !!(searchTerm && String(searchTerm).trim());
    const hasPrice = priceRange !== 'all';
    const hasBrand = brandFilter !== 'all';
    return hasSearch || hasPrice || hasBrand;
  }, [searchTerm, priceRange, brandFilter]);

  // Canonical URL for SEO component
  const seoPath = useMemo(() => {
    // filtered pages are intentionally non-indexed and canonicalized to the base catalog
    if (isFiltered) return '/all-cars';
    return safePage > 1 ? `/all-cars?page=${safePage}` : '/all-cars';
  }, [isFiltered, safePage]);

  // ฟังก์ชันสำหรับสร้างลิงก์ SEO-friendly
  const getPageUrl = page => {
    const params = new URLSearchParams();
    const term = String(searchTerm || '')
      .trim()
      .slice(0, 120);
    if (term) params.set('search', term);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (brandFilter !== 'all') params.set('brand', brandFilter);
    if (page > 1) params.set('page', page.toString());

    const queryString = params.toString();
    return queryString ? `/all-cars?${queryString}` : '/all-cars';
  };

  // ฟังก์ชันสำหรับเปลี่ยนหน้าแบบ smooth navigation
  const handlePageChange = (page, event) => {
    event.preventDefault();
    if (!Number.isFinite(page) || page < 1 || page > safeTotalPages) return;

    setCurrentPage(page);
    try {
      const newUrl = getPageUrl(page);
      // ใช้ shallow routing และไม่ scroll เหมือนปุ่มรีวิว
      router.push(newUrl, undefined, {
        shallow: false,
        scroll: false,
      });
    } catch {
      // Silent error handling for production
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // แสดงหน้าสูงสุด 5 หน้า

    let startPage = Math.max(1, safePage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // ปรับให้แสดงครบ 5 หน้าถ้าเป็นไปได้
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // เริ่มการเรนเดอร์หน้า

  return (
    <div className="min-h-screen">
      <SEO
        title={`${seoAllCars.titleBase}${safeTotalPages > 1 && safePage > 1 ? ` หน้า ${safePage}` : ''} | ครูหนึ่งรถสวย`}
        description={`ดูรถยนต์มือสองคุณภาพดีทั้งหมด ${Number.isFinite(totalCount) ? totalCount : 0} คัน ในเชียงใหม่และภาคเหนือ คัดสรรทุกคัน ฟรีดาวน์ 0% รับประกัน 1 ปี ส่งฟรีทั่วไทย Toyota Honda Nissan Mazda นัดหมายดูรถโทร 094-064-9018`}
        url={seoPath}
        image={`https://www.chiangmaiusedcar.com/api/og?src=${encodeURIComponent(
          '/herobanner/heroallcars-1400w.webp'
        )}&w=1200&h=630`}
        type="website"
        pageType="all-cars"
        noindex={isFiltered}
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'รถมือสองทั้งหมด', url: '/all-cars' },
        ]}
        structuredData={structuredDataJson || null}
      />

      <Head>
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//cdn.shopify.com" />

        <link
          rel="preload"
          as="image"
          media="(max-width: 767px)"
          href="/herobanner/heroallcars-640w.webp"
          imageSrcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w"
          imageSizes="100vw"
          fetchPriority="high"
        />

        <link
          rel="preload"
          as="image"
          media="(min-width: 768px)"
          href="/herobanner/heroallcars-1024w.webp"
          imageSrcSet="/herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1400w.webp 1400w"
          imageSizes="100vw"
          fetchPriority="high"
        />
      </Head>

      {process.env.NODE_ENV === 'development' && shopifyError && currentCars.length === 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-4" aria-label="Dev Shopify error">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-prompt">
            <div className="font-bold text-red-900">Dev: ดึงข้อมูลรถจาก Shopify ไม่สำเร็จ</div>
            <div className="mt-1 text-sm text-red-800">
              ตรวจสอบไฟล์ <span className="font-semibold">.env.local</span> ว่ามี{' '}
              <span className="font-semibold">SHOPIFY_DOMAIN</span> และ{' '}
              <span className="font-semibold">SHOPIFY_STOREFRONT_TOKEN</span> แล้วรันใหม่ด้วย{' '}
              <span className="font-semibold">pnpm dev</span>
            </div>
            <div className="mt-1 text-xs text-red-700/80">รายละเอียด: {shopifyError}</div>
          </div>
        </section>
      )}

      {/* Pagination Link Tags for SEO */}
      {totalPages > 1 && !isFiltered && (
        <Head>
          {safePage > 1 && (
            <link rel="prev" href={`https://www.chiangmaiusedcar.com${getPageUrl(safePage - 1)}`} />
          )}
          {safePage < totalPages && (
            <link rel="next" href={`https://www.chiangmaiusedcar.com${getPageUrl(safePage + 1)}`} />
          )}
        </Head>
      )}

      {/* Hero Banner - 2025 Modern Design */}
      <section
        className="relative w-full bg-[#f8f9fa] flex justify-center"
        aria-label="รถมือสองทั้งหมด - ครูหนึ่งรถสวย"
      >
        {/* Container สำหรับรูปภาพที่ปรับอัตราส่วนตามภาพจริง (1400/474) ในทุกอุปกรณ์ */}
        <div className="relative w-full max-w-[1400px] aspect-[1400/474]">
          <div className="absolute inset-0" aria-hidden="true">
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w"
                sizes="100vw"
              />
              <source
                media="(min-width: 768px)"
                srcSet="/herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1400w.webp 1400w"
                sizes="100vw"
              />
              <img
                ref={heroImgRef}
                src="/herobanner/heroallcars-1024w.webp"
                srcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1400w.webp 1400w"
                sizes="100vw"
                alt=""
                className="w-full h-full object-cover object-top"
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </div>

          {/* Dark overlay for better text readability (mobile + desktop) */}
          <div className="absolute inset-0 bg-black/35 sm:bg-black/40"></div>

          {/* Content over banner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 font-prompt text-white mt-0 md:mt-4"
                style={{
                  textShadow:
                    '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                รถมือสองเชียงใหม่ คุณภาพดีทั้งหมด
              </h1>
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <p
                  className="text-xs sm:text-sm md:text-lg lg:text-xl font-prompt text-white font-bold"
                  style={{
                    textShadow:
                      '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  รถคุณภาพดี {Number.isFinite(totalCount) ? totalCount : 0} คัน พร้อมส่งมอบ
                </p>
                {safeTotalPages > 1 && (
                  <p
                    className="text-xs sm:text-xs md:text-sm lg:text-base font-prompt text-white font-semibold"
                    style={{
                      textShadow:
                        '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    หน้า {safePage}/{safeTotalPages}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-gray-200 -mt-0">
        <div className="max-w-7xl mx-auto px-6">
          <nav
            aria-label="เส้นทางปัจจุบัน"
            className="flex items-center gap-2 text-sm text-gray-600 font-prompt"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              หน้าแรก
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-primary font-medium" aria-current="page">
              รถทั้งหมด
            </span>
          </nav>

          <div className="mt-4 rounded-2xl border border-orange-500 bg-white px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-sm text-gray-950 font-semibold font-prompt">
                รายการลงประกาศรถทั้งหมดของทางร้าน พร้อมข้อมูลติดต่อ
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/used-cars-chiang-mai"
                  className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
                >
                  ฝากขายราคาดี
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  นัดดูรถ / ติดต่อ
                </Link>
              </div>
            </div>

            <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-xs text-gray-700 font-prompt">หรือเลือกดูตามยี่ห้อรถ:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { slug: 'toyota', label: 'Toyota' },
                  { slug: 'honda', label: 'Honda' },
                  { slug: 'isuzu', label: 'Isuzu' },
                  { slug: 'nissan', label: 'Nissan' },
                  { slug: 'mazda', label: 'Mazda' },
                  { slug: 'mitsubishi', label: 'Mitsubishi' },
                ].map(item => (
                  <Link
                    key={item.slug}
                    href={`/used-cars-chiang-mai-brand/${item.slug}`}
                    className="inline-flex items-center justify-center rounded-full border border-orange-400 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-orange-50 hover:border-orange-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section
        className="py-8 md:py-12 bg-white border-t border-gray-200"
        aria-label="รายการรถมือสองทั้งหมด"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-5 ipadpro:px-3 lg:px-6">
          {!Number.isFinite(totalCount) || totalCount === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-2 font-prompt">
                ไม่พบรถมือสองเชียงใหม่ในหน้าต่างนี้
              </h2>
              <p className="text-gray-500 font-prompt">
                เรามีรถบ้านมือสองคุณภาพดีเข้ามาใหม่ทุกวัน
                ลองเปลี่ยนเงื่อนไขการค้นหาหรือติดต่อเราโดยตรง
              </p>
            </div>
          ) : (
            <>
              {/* Cards Grid - standardized layout */}
              <div className="car-grid grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
                {currentCarsWithLive.map((car, index) => {
                  const mergedCar = mergeCarSpecs(car, null);
                  return <CarCard key={car.id} car={mergedCar} priority={index < 2} />;
                })}
              </div>

              {/* Pagination - Production Style (เหมือนเว็บไซต์จริง) */}
              {safeTotalPages > 1 && (
                <div className="mt-8 md:mt-12 flex flex-col items-center">
                  <nav
                    aria-label="การแบ่งหน้า"
                    className="flex items-center justify-center space-x-2"
                  >
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={e => (currentPage > 1 ? handlePageChange(currentPage - 1, e) : null)}
                      disabled={currentPage <= 1}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        currentPage > 1
                          ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      aria-label="ไปหน้าก่อนหน้า"
                    >
                      ← ก่อนหน้า
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {generatePageNumbers().map(page => (
                        <button
                          key={page}
                          type="button"
                          onClick={e => handlePageChange(page, e)}
                          className={`w-10 h-10 text-sm font-medium rounded-lg border transition-colors ${
                            page === currentPage
                              ? 'bg-primary border-primary text-white'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          aria-label={`ไปหน้าที่ ${page}`}
                          aria-current={page === currentPage ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={e =>
                        currentPage < safeTotalPages ? handlePageChange(currentPage + 1, e) : null
                      }
                      disabled={currentPage >= safeTotalPages}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        currentPage < safeTotalPages
                          ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      aria-label="ไปหน้าถัดไป"
                    >
                      ถัดไป →
                    </button>
                  </nav>

                  {/* Page Info */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      หน้า <span className="font-medium text-primary">{currentPage}</span> จาก{' '}
                      <span className="font-medium text-primary">{safeTotalPages}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* FAQ (AEO) - visible content to match FAQPage schema */}
              {!isFiltered && allCarsFaqs?.length > 0 && (
                <section className="mt-10 md:mt-14" aria-labelledby="faq-allcars-heading">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
                    <h2
                      id="faq-allcars-heading"
                      className="text-lg sm:text-xl font-bold text-gray-900 font-prompt"
                    >
                      คำถามที่พบบ่อย (FAQ)
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 font-prompt">
                      คำตอบสั้นๆ ก่อนตัดสินใจดูรถและนัดหมาย
                    </p>

                    <div className="mt-4 space-y-3">
                      {allCarsFaqs.map(item => (
                        <details
                          key={item.q}
                          className="group rounded-2xl border border-gray-200 bg-white px-4 py-3"
                        >
                          <summary className="cursor-pointer list-none font-semibold text-gray-900 font-prompt flex items-start justify-between gap-3">
                            <span>{item.q}</span>
                            <span className="text-gray-400 group-open:rotate-180 transition-transform">
                              ▾
                            </span>
                          </summary>
                          <div className="mt-2 text-sm text-gray-700 font-prompt leading-relaxed">
                            {item.a}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// SSR for all-cars to ensure Google sees correct catalog HTML for query params
// (pagination/filter/noindex/canonical) without relying on client-side JS.
export async function getServerSideProps(context) {
  // Server-only modules – kept out of the client bundle via require()
  const { SEO_KEYWORD_MAP } = require('../config/seo-keyword-map');
  const { ALL_CARS_FAQS, buildFaqPageJsonLd } = require('../lib/seo/faq.js');

  const enableServerTiming =
    process.env.NODE_ENV === 'development' || process.env.ENABLE_SERVER_TIMING === '1';

  const marks = [];
  const mark = name => {
    if (!enableServerTiming) return;
    marks.push({ name, at: Date.now() });
  };
  const duration = (start, end) => {
    if (!enableServerTiming) return null;
    const a = marks.find(m => m.name === start)?.at;
    const b = marks.find(m => m.name === end)?.at;
    if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
    const d = b - a;
    return d >= 0 ? d : null;
  };

  mark('ssr:start');
  let cars = [];
  let shopifyError = null;
  try {
    // Run both fetches in parallel to reduce SSR latency (~500-800ms saved)
    mark('getAllCars:start');
    mark('readCarStatuses:start');
    let fetchError = null;
    const [result, carStatuses] = await Promise.all([
      getAllCars().catch(e => {
        fetchError = e;
        return [];
      }),
      readCarStatuses().catch(() => ({})),
    ]);
    mark('getAllCars:end');
    mark('readCarStatuses:end');
    if (fetchError) throw fetchError;
    cars = Array.isArray(result) ? result : [];

    // ลดขนาดข้อมูลโดยเก็บเฉพาะฟิลด์ที่จำเป็น
    cars = cars.map(car => ({
      id: car.id,
      handle: car.handle,
      title: car.title,
      vendor: car.vendor,
      tags: car.tags,
      price: car.price,
      // Keep quick specs for CarCard (ปี/ไมล์/เกียร์/เชื้อเพลิง/ขับเคลื่อน)
      year: car.year,
      mileage: car.mileage,
      transmission: car.transmission,
      drivetrain: car.drivetrain || car.drive_type || car.wheel_drive,
      drive_type: car.drive_type || car.drivetrain || car.wheel_drive,
      installment: car.installment,
      fuelType: car.fuelType || car.fuel_type,
      fuel_type: car.fuel_type || car.fuelType,
      // Keep metaobject-backed display labels for cards (ประเภทรถ/ประเภทตัวถัง)
      // so mobile Safari doesn't depend on deferred client enrichment to show them.
      category: car.category,
      body_type: car.body_type,
      images: car.images?.slice(0, 1) || [], // เก็บแค่รูปแรกสำหรับ listing
      availableForSale: car.availableForSale,
      status: carStatuses[car.id]?.status || 'available', // Add status from file
    }));

    // แสดงรถทั้งหมดที่มีจริง ไม่จำกัดจำนวน
  } catch (error) {
    // Silent error handling for production - ให้ UI แสดงข้อมูลว่างแทน
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('getServerSideProps(/all-cars) error:', error);
      shopifyError = error?.message || 'unknown error';
    }
    cars = [];
  }

  mark('ssr:data:end');

  const q = context?.query || {};
  const initialSearchTerm = q.search ? normalizeQueryString(q.search, 120) : '';
  const initialPriceRange = q.price ? normalizePriceRange(q.price) : 'all';
  const initialBrandFilter = q.brand ? normalizeBrand(q.brand) : 'all';
  const initialPage = q.page ? normalizePageNumber(q.page) : 1;

  // Apply filtering/pagination on the server to reduce client hydration cost (TBT)
  const carsPerPage = 8;
  mark('ssr:filtering:start');
  let filtered = Array.isArray(cars) ? cars : [];

  if (initialSearchTerm) {
    const term = String(initialSearchTerm).toLowerCase();
    filtered = filtered.filter(car => {
      const title = String(car?.title || '').toLowerCase();
      const vendor = String(car?.vendor || '').toLowerCase();
      const tags = Array.isArray(car?.tags) ? car.tags : [];
      return (
        title.includes(term) ||
        vendor.includes(term) ||
        tags.some(tag => {
          return String(tag || '')
            .toLowerCase()
            .includes(term);
        })
      );
    });
  }

  if (initialPriceRange !== 'all') {
    const [minRaw, maxRaw] = String(initialPriceRange).split('-');
    const min = Number(minRaw);
    const hasMax = typeof maxRaw !== 'undefined';
    const max = hasMax ? Number(maxRaw) : undefined;
    const validMin = Number.isFinite(min) && min >= 0;
    const validMax = !hasMax || (Number.isFinite(max) && max >= min);
    if (validMin && validMax) {
      filtered = filtered.filter(car => {
        const price = Number(car?.price?.amount ?? 0);
        if (!Number.isFinite(price)) return false;
        return hasMax ? price >= min && price <= max : price >= min;
      });
    }
  }

  if (initialBrandFilter !== 'all') {
    const bf = String(initialBrandFilter).toLowerCase();
    filtered = filtered.filter(car => {
      const title = String(car?.title || '').toLowerCase();
      const vendor = String(car?.vendor || '').toLowerCase();
      return title.includes(bf) || vendor.includes(bf);
    });
  }

  mark('ssr:filtering:end');

  const totalCount = filtered.length;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / carsPerPage) : 1;
  const safePage = Math.min(Math.max(1, initialPage), totalPages);
  const startIndex = (safePage - 1) * carsPerPage;
  let pageCars = filtered.slice(startIndex, startIndex + carsPerPage);

  // Precompute JSON-LD for SEO on the server (lightweight) so the client doesn’t rebuild
  // a large graph during hydration. Skip on filtered pages because they are noindex.
  let structuredDataJson = null;
  try {
    const hasSearch = !!(initialSearchTerm && String(initialSearchTerm).trim());
    const hasPrice = initialPriceRange !== 'all';
    const hasBrand = initialBrandFilter !== 'all';
    const isFiltered = hasSearch || hasPrice || hasBrand;

    if (!isFiltered) {
      const seoPath = safePage > 1 ? `/all-cars?page=${safePage}` : '/all-cars';

      const collectionSchema = {
        '@type': 'CollectionPage',
        name: `รถมือสองทั้งหมด${totalPages > 1 ? ` - หน้า ${safePage}` : ''}`,
        description: `รถมือสองคุณภาพดี ${Number.isFinite(totalCount) ? totalCount : 0} คัน พร้อมส่งมอบ`,
        url: `https://www.chiangmaiusedcar.com/all-cars${safePage > 1 ? `?page=${safePage}` : ''}`,
        mainEntity: {
          '@type': 'ItemList',
          name: 'รายการรถมือสอง',
          numberOfItems: pageCars.length,
          itemListElement: pageCars.map((car, index) => {
            const carUrl = car?.handle
              ? `https://www.chiangmaiusedcar.com/car/${car.handle}`
              : 'https://www.chiangmaiusedcar.com/all-cars';

            const imageUrl = car?.images?.[0]?.url
              ? car.images[0].url.startsWith('/')
                ? `https://www.chiangmaiusedcar.com${car.images[0].url}`
                : car.images[0].url
              : 'https://www.chiangmaiusedcar.com/herobanner/allusedcars.webp';

            return {
              '@type': 'ListItem',
              position: startIndex + index + 1,
              url: carUrl,
              name: car?.title || 'รถมือสอง',
              image: imageUrl,
            };
          }),
        },
        publisher: {
          '@type': 'AutoDealer',
          name: 'ครูหนึ่งรถสวย',
          url: 'https://www.chiangmaiusedcar.com',
        },
      };

      const faq = buildFaqPageJsonLd({
        url: seoPath,
        faqs: ALL_CARS_FAQS,
      });
      const { ['@context']: ctx, ...faqNode } = faq;
      void ctx;

      structuredDataJson = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [collectionSchema, faqNode],
      });
    }
  } catch {
    structuredDataJson = null;
  }

  mark('ssr:end');

  // Note: do not enrich specs during SSR.
  // Extra Shopify calls here significantly slow down pagination (page 1..n).
  // Client-side enrichment (deferred) fills any remaining spec gaps.

  // Cache hints: allow CDN to cache briefly while keeping inventory reasonably fresh
  if (context?.res?.setHeader) {
    context.res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');

    if (enableServerTiming) {
      const tGetAll = duration('getAllCars:start', 'getAllCars:end');
      const tStatuses = duration('readCarStatuses:start', 'readCarStatuses:end');
      const tFilter = duration('ssr:filtering:start', 'ssr:filtering:end');
      const tTotal = duration('ssr:start', 'ssr:end');

      const parts = [];
      if (Number.isFinite(tTotal)) parts.push(`ssr;dur=${tTotal}`);
      if (Number.isFinite(tGetAll)) parts.push(`shopify_allcars;dur=${tGetAll}`);
      if (Number.isFinite(tStatuses)) parts.push(`car_statuses;dur=${tStatuses}`);
      if (Number.isFinite(tFilter)) parts.push(`filtering;dur=${tFilter}`);

      if (parts.length > 0) {
        context.res.setHeader('Server-Timing', parts.join(', '));
      }
    }
  }

  return {
    props: {
      cars: pageCars,
      totalCount,
      totalPages,
      initialSearchTerm,
      initialPriceRange,
      initialBrandFilter,
      initialPage: safePage,
      structuredDataJson,
      shopifyError,
      seoAllCars: SEO_KEYWORD_MAP.allCars,
      allCarsFaqs: ALL_CARS_FAQS,
    },
  };
}
