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
  const [showAllCars, setShowAllCars] = useState(false);
  const heroImgRef = useRef(null);

  useEffect(() => {
    // Delays rendering below-the-fold cards to free up main thread (better TBT)
    const timer = setTimeout(() => setShowAllCars(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const img = heroImgRef.current;
    if (!img) return;

    // React/ESLint disagree on `fetchPriority` vs `fetchPriority`.
    // Set it imperatively so browsers get the hint without React warnings.
    try {
      img.setAttribute('fetchPriority', 'high');
    } catch {
      // ignore
    }

    try {
      img.setAttribute('fetchPriority', 'high');
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
  const currentCars = useMemo(() => {
    const list = Array.isArray(cars) ? cars : [];
    return list.map(car => mergeCarSpecs(car, null));
  }, [cars]);

  const currentIds = useMemo(() => currentCars.map(c => c.id).filter(Boolean), [currentCars]);

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
  // Updated: Allow price and brand to be indexed
  const isFiltered = useMemo(() => {
    const hasSearch = !!(searchTerm && String(searchTerm).trim());
    const hasBrand = brandFilter !== 'all';
    const hasPrice = priceRange !== 'all';
    return hasSearch || hasBrand || hasPrice;
  }, [searchTerm, brandFilter, priceRange]);

  // Canonical URL for SEO component
  const seoPath = useMemo(() => {
    // filtered pages are intentionally non-indexed and canonicalized to the base catalog
    if (isFiltered) return '/all-cars';
    return safePage > 1 ? `/all-cars?page=${safePage}` : '/all-cars';
  }, [isFiltered, safePage]);

  // เธเธฑเธเธเนเธเธฑเธเธชเธณเธซเธฃเธฑเธเธชเธฃเนเธฒเธเธฅเธดเธเธเน SEO-friendly
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

  // เน€เธเธฅเธตเนเธขเธเธซเธเนเธฒเนเธฅเธฐเน€เธฅเธทเนเธญเธเนเธเธ—เธตเนเธเธธเธ”เน€เธฃเธดเนเธกเธ•เนเธเธเธญเธเธฃเธฒเธขเธเธฒเธฃเธฃเธ– (เนเธกเนเน€เธ”เนเธเธเธถเนเธเนเธเธเธเธชเธธเธ”เธ—เธตเนเนเธเธเน€เธเธญเธฃเน)
  const handlePaginationNav = (page, e) => {
    e.preventDefault();
    if (page === currentPage) return;

    // เน€เธฅเธทเนเธญเธเธซเธเนเธฒเนเธ (scroll: false เธเธดเธ”เธเธฒเธฃเน€เธ”เนเธเนเธเธเธเธชเธธเธ”เธญเธฑเธ•เนเธเธกเธฑเธ•เธดเธเธญเธ Next.js)
    router
      .push(getPageUrl(page), undefined, {
        scroll: false,
      })
      .then(() => {
        // เนเธเน requestAnimationFrame เธซเธฃเธทเธญ setTimeout เน€เธเธทเนเธญเธ”เธฑเธเนเธซเน DOM เน€เธฃเธเน€เธ”เธญเธฃเนเธฃเธ–เธเธธเธ”เนเธซเธกเนเน€เธชเธฃเนเธเธเนเธญเธ
        // เธ–เธถเธเธเธฐเธเธณเธเธงเธ“เธ•เธณเนเธซเธเนเธเนเธฅเธฐเน€เธฅเธทเนเธญเธเธเธญเธเธฃเธดเธเน
        setTimeout(() => {
          // เน€เธฅเธทเนเธญเธเนเธเธ—เธตเนเธ•เธฐเธเธฃเนเธฒเธฃเธ–เธเธฃเธดเธเน เนเธกเนเนเธเน block SEO เธ”เนเธฒเธเธเธ
          const grid = document.getElementById('cars-list-top');
          if (grid) {
            // เธซเธฑเธเธฅเธเธเธงเธฒเธกเธชเธนเธ navbar
            const y = grid.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: y, behavior: 'auto' });
          }
        }, 50);
      });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // เนเธชเธ”เธเธซเธเนเธฒเธชเธนเธเธชเธธเธ” 5 เธซเธเนเธฒ

    let startPage = Math.max(1, safePage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // เธเธฃเธฑเธเนเธซเนเนเธชเธ”เธเธเธฃเธ 5 เธซเธเนเธฒเธ–เนเธฒเน€เธเนเธเนเธเนเธ”เน
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // เน€เธฃเธดเนเธกเธเธฒเธฃเน€เธฃเธเน€เธ”เธญเธฃเนเธซเธเนเธฒ

  return (
    <div className="min-h-screen">
      {(() => {
        const getDynamicSEO = () => {
          let title = seoAllCars.titleBase;
          let isSpecific = false;
          const priceLabels = {
            '0-100000': 'เธฃเธฒเธเธฒเนเธกเนเน€เธเธดเธ 1 เนเธชเธ',
            '100000-200000': 'เธฃเธฒเธเธฒ 1-2 เนเธชเธ',
            '200000-300000': 'เธฃเธฒเธเธฒ 2-3 เนเธชเธ',
            '300000-400000': 'เธฃเธฒเธเธฒ 3-4 เนเธชเธ',
            '400000-500000': 'เธฃเธฒเธเธฒ 4-5 เนเธชเธ',
            '500000-600000': 'เธฃเธฒเธเธฒ 5-6 เนเธชเธ',
            '600000-700000': 'เธฃเธฒเธเธฒ 6-7 เนเธชเธ',
            700000: 'เธฃเธฒเธเธฒ 7 เนเธชเธเธเธถเนเธเนเธ',
          };
          const brandLabels = {
            toyota: 'เธฃเธ– Toyota',
            honda: 'เธฃเธ– Honda',
            nissan: 'เธฃเธ– Nissan',
            mazda: 'เธฃเธ– Mazda',
            mitsubishi: 'เธฃเธ– Mitsubishi',
            isuzu: 'เธฃเธ– Isuzu',
            ford: 'เธฃเธ– Ford',
          };
          let prefix = [];
          if (brandFilter && brandFilter !== 'all' && brandLabels[brandFilter]) {
            prefix.push(brandLabels[brandFilter]);
            isSpecific = true;
          } else {
            prefix.push('เธฃเธ–เธกเธทเธญเธชเธญเธ');
          }

          if (priceRange && priceRange !== 'all' && priceLabels[priceRange]) {
            prefix.push(priceLabels[priceRange]);
            isSpecific = true;
          }

          let desc =
            prefix.join(' ') +
            ' เธจเธนเธเธขเนเธฃเธงเธกเธฃเธ–เธเนเธฒเธเธกเธทเธญเน€เธ”เธตเธขเธงเนเธเธเธฑเธเธซเธงเธฑเธ”เน€เธเธตเธขเธเนเธซเธกเน เธชเธ เธฒเธเธ”เธต เธเธฃเธตเธ”เธฒเธงเธเน เธเธฃเนเธญเธกเธฃเธฑเธเธเธฃเธฐเธเธฑเธ 1 เธเธต';
          title =
            prefix.join(' ') + ' เน€เธเธตเธขเธเนเธซเธกเน เธชเธ เธฒเธเธ”เธต เธเธฃเธตเธ”เธฒเธงเธเน';

          return { title, desc, isSpecific };
        };
        const dynamicSEO = getDynamicSEO();

        return (
          <SEO
            title={
              dynamicSEO.isSpecific
                ? `${dynamicSEO.title}${safeTotalPages > 1 && safePage > 1 ? ` เธซเธเนเธฒ ${safePage}` : ''} | เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข`
                : `${seoAllCars.titleBase}${safeTotalPages > 1 && safePage > 1 ? ` เธซเธเนเธฒ ${safePage}` : ''} | เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข`
            }
            description={
              dynamicSEO.isSpecific
                ? dynamicSEO.desc + ' เนเธ—เธฃ 094-064-9018'
                : `เธ”เธนเธฃเธ–เธขเธเธ•เนเธกเธทเธญเธชเธญเธเธเธธเธ“เธ เธฒเธเธ”เธตเธ—เธฑเนเธเธซเธกเธ” ${Number.isFinite(totalCount) ? totalCount : 0} เธเธฑเธ เนเธเน€เธเธตเธขเธเนเธซเธกเนเนเธฅเธฐเธ เธฒเธเน€เธซเธเธทเธญ เธเธฑเธ”เธชเธฃเธฃเธ—เธธเธเธเธฑเธ เธเธฃเธตเธ”เธฒเธงเธเน 0% เธฃเธฑเธเธเธฃเธฐเธเธฑเธ 1 เธเธต เธชเนเธเธเธฃเธตเธ—เธฑเนเธงเนเธ—เธข Toyota Honda Nissan Mazda เธเธฑเธ”เธซเธกเธฒเธขเธ”เธนเธฃเธ–เนเธ—เธฃ 094-064-9018`
            }
            keywords={[
              seoAllCars.primary,
              ...seoAllCars.secondary,
              ...seoAllCars.longTail.slice(0, 5),
            ]}
            url={seoPath}
            image={`https://www.chiangmaiusedcar.com/api/og?src=${encodeURIComponent(
              '/herobanner/heroallcars-1400w.webp'
            )}&w=1200&h=630`}
            type="website"
            pageType="all-cars"
            noindex={isFiltered}
            breadcrumbs={[
              { name: 'เธซเธเนเธฒเนเธฃเธ', url: '/' },
              { name: 'เธฃเธ–เธกเธทเธญเธชเธญเธเธ—เธฑเนเธเธซเธกเธ”', url: '/all-cars' },
            ]}
            structuredData={structuredDataJson || null}
          />
        );
      })()}

      <Head>
        <link
          rel="preload"
          as="image"
          media="(max-width: 767px)"
          href="/herobanner/heroallcars-640w.webp"
          imageSrcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w"
          imageSizes="(max-width: 640px) 100vw, 640px"
          fetchPriority="high"
        />

        <link
          rel="preload"
          as="image"
          media="(min-width: 768px)"
          href="/herobanner/heroallcars-1024w.webp"
          imageSrcSet="/herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1400w.webp 1400w"
          imageSizes="(max-width: 1400px) 100vw, 1400px"
          fetchPriority="high"
        />
      </Head>

      {process.env.NODE_ENV === 'development' && shopifyError && currentCars.length === 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-4" aria-label="Dev Shopify error">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-prompt">
            <div className="font-bold text-red-900">
              Dev: เธ”เธถเธเธเนเธญเธกเธนเธฅเธฃเธ–เธเธฒเธ Shopify เนเธกเนเธชเธณเน€เธฃเนเธ
            </div>
            <div className="mt-1 text-sm text-red-800">
              เธ•เธฃเธงเธเธชเธญเธเนเธเธฅเน <span className="font-semibold">.env.local</span>{' '}
              เธงเนเธฒเธกเธต <span className="font-semibold">SHOPIFY_DOMAIN</span> เนเธฅเธฐ{' '}
              <span className="font-semibold">SHOPIFY_STOREFRONT_TOKEN</span>{' '}
              เนเธฅเนเธงเธฃเธฑเธเนเธซเธกเนเธ”เนเธงเธข{' '}
              <span className="font-semibold">pnpm dev</span>
            </div>
            <div className="mt-1 text-xs text-red-700/80">
              เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”: {shopifyError}
            </div>
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
        aria-label="เธฃเธ–เธกเธทเธญเธชเธญเธเธ—เธฑเนเธเธซเธกเธ” - เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข"
      >
        {/* Container เธชเธณเธซเธฃเธฑเธเธฃเธนเธเธ เธฒเธเธ—เธตเนเธเธฃเธฑเธเธญเธฑเธ•เธฃเธฒเธชเนเธงเธเธ•เธฒเธกเธ เธฒเธเธเธฃเธดเธ (1400/474) เนเธเธ—เธธเธเธญเธธเธเธเธฃเธ“เน */}
        <div className="relative w-full max-w-[1400px] aspect-[1400/474]">
          <div className="absolute inset-0" aria-hidden="true">
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w"
                sizes="(max-width: 640px) 100vw, 640px"
              />
              <source
                media="(min-width: 768px)"
                srcSet="/herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1400w.webp 1400w"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
              <img
                ref={heroImgRef}
                src="/herobanner/heroallcars-1024w.webp"
                srcSet="/herobanner/heroallcars-414w.webp 414w, /herobanner/heroallcars-640w.webp 640w, /herobanner/heroallcars-1024w.webp 1024w, /herobanner/heroallcars-1400w.webp 1400w"
                sizes="(max-width: 1400px) 100vw, 1400px"
                alt="เธฃเธงเธกเธฃเธ–เธขเธเธ•เนเธกเธทเธญเธชเธญเธเธเธธเธ“เธ เธฒเธเธ”เธต เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข เน€เธเธตเธขเธเนเธซเธกเน"
                className="w-full h-full object-cover object-top"
                decoding="async"
                loading="eager"
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
                {seoAllCars.h1 ||
                  'เธฃเธงเธกเธฃเธ–เธกเธทเธญเธชเธญเธเน€เธเธตเธขเธเนเธซเธกเน เธเธฃเธเธ—เธธเธเธขเธตเนเธซเนเธญ'}
              </h1>
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <p
                  className="text-xs sm:text-sm md:text-lg lg:text-xl font-prompt text-white font-bold"
                  style={{
                    textShadow:
                      '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  เธฃเธ–เธเธธเธ“เธ เธฒเธเธ”เธต {Number.isFinite(totalCount) ? totalCount : 0}{' '}
                  เธเธฑเธ เธเธฃเนเธญเธกเธชเนเธเธกเธญเธ
                </p>
                {safeTotalPages > 1 && (
                  <p
                    className="text-xs sm:text-xs md:text-sm lg:text-base font-prompt text-white font-semibold"
                    style={{
                      textShadow:
                        '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                    }}
                  >
                    เธซเธเนเธฒ {safePage}/{safeTotalPages}
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
          {/* เธเธธเนเธกเธขเนเธญเธเธเธฅเธฑเธ */}
          <div className="mb-3">
            <button
              onClick={() => {
                if (window.history.length > 2) {
                  router?.back();
                } else {
                  router.push('/');
                }
              }}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors focus:outline-none group font-prompt"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5 h-4 w-4 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              เธขเนเธญเธเธเธฅเธฑเธ
            </button>
          </div>

          <nav
            aria-label="เน€เธชเนเธเธ—เธฒเธเธเธฑเธเธเธธเธเธฑเธ"
            className="flex items-center gap-2 text-sm text-gray-600 font-prompt"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              เธซเธเนเธฒเนเธฃเธ
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-primary font-medium" aria-current="page">
              เธฃเธ–เธ—เธฑเนเธเธซเธกเธ”
            </span>
          </nav>

          <div className="mt-4 rounded-2xl border border-orange-500 bg-white px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-sm text-gray-950 font-semibold font-prompt">
                เธฃเธฒเธขเธเธฒเธฃเธฅเธเธเธฃเธฐเธเธฒเธจเธฃเธ–เธ—เธฑเนเธเธซเธกเธ”เธเธญเธเธ—เธฒเธเธฃเนเธฒเธ
                เธเธฃเนเธญเธกเธเนเธญเธกเธนเธฅเธ•เธดเธ”เธ•เนเธญ
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/used-cars-chiang-mai"
                  className="inline-flex items-center justify-center rounded-xl bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 transition-colors"
                >
                  เธเธฒเธเธเธฒเธขเธฃเธฒเธเธฒเธ”เธต
                </Link>
                <Link
                  href="/contact"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  เธเธฑเธ”เธ”เธนเธฃเธ– / เธ•เธดเธ”เธ•เนเธญ
                </Link>
              </div>
            </div>

            <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-xs text-gray-700 font-prompt">
                เธซเธฃเธทเธญเน€เธฅเธทเธญเธเธ”เธนเธ•เธฒเธกเธขเธตเนเธซเนเธญเธฃเธ–:
              </div>
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
        id="cars-grid-section"
        className="py-8 md:py-12 bg-white border-t border-gray-200"
        aria-label="เธฃเธฒเธขเธเธฒเธฃเธฃเธ–เธกเธทเธญเธชเธญเธเธ—เธฑเนเธเธซเธกเธ”"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-5 ipadpro:px-3 lg:px-6">
          {/* SEO Content: The Volume Up & Content Deep Strategy */}
          <div className="mb-8 p-6 md:p-8 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 shadow-sm relative overflow-hidden">
            {/* Background accent for premium feel */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-orange-100/50 rounded-full blur-2xl pointer-events-none"></div>

            {/* SEO Header (Short version for UX) */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-prompt mb-3 relative z-10">
              เธจเธนเธเธขเนเธฃเธงเธกเธฃเธ–เธกเธทเธญเธชเธญเธเน€เธเธตเธขเธเนเธซเธกเน
              เธเธธเธ“เธ เธฒเธเธ”เธต เธเธฑเธ”เน€เธเธฃเธ”เธเธฃเธตเน€เธกเธตเธขเธก
            </h2>
            <div className="text-sm md:text-base text-gray-600 font-prompt space-y-2 relative z-10 max-w-4xl">
              <p>
                เน€เธฃเธฒเธกเธตเธฃเธ–เธเธธเธ“เธ เธฒเธเธเธฃเนเธญเธกเนเธเนเธเธฒเธเนเธซเนเน€เธฅเธทเธญเธเธเธกเธกเธฒเธเธเธงเนเธฒ{' '}
                <strong className="text-accent text-lg">
                  {Number.isFinite(totalCount) ? totalCount : 0} เธเธฑเธ
                </strong>{' '}
                เธ—เธตเนเธเธฃเธญเธเธเธฅเธธเธกเธ—เธธเธเนเธฅเธเนเธชเนเธ•เธฅเน
                เธฃเธ–เธ—เธธเธเธเธฑเธเธเนเธฒเธเธเธฒเธฃเธ•เธฃเธงเธเน€เธเนเธเธชเธ เธฒเธ
                เนเธกเธฅเนเนเธ—เน เนเธเธฃเธเธชเธฃเนเธฒเธเน€เธ”เธดเธก
                เธเธฃเนเธญเธกเธเธฃเธดเธเธฒเธฃเธเธฑเธ”เนเธเนเธเธเธเน เธญเธเธธเธกเธฑเธ•เธดเนเธง
                เธเธฃเธตเธ”เธฒเธงเธเน 0%
              </p>
            </div>
          </div>

          {!Number.isFinite(totalCount) || totalCount === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">๐”</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-2 font-prompt">
                เนเธกเนเธเธเธฃเธ–เธกเธทเธญเธชเธญเธเน€เธเธตเธขเธเนเธซเธกเนเนเธเธซเธเนเธฒเธ•เนเธฒเธเธเธตเน
              </h2>
              <p className="text-gray-500 font-prompt">
                เน€เธฃเธฒเธกเธตเธฃเธ–เธเนเธฒเธเธกเธทเธญเธชเธญเธเธเธธเธ“เธ เธฒเธเธ”เธตเน€เธเนเธฒเธกเธฒเนเธซเธกเนเธ—เธธเธเธงเธฑเธ
                เธฅเธญเธเน€เธเธฅเธตเนเธขเธเน€เธเธทเนเธญเธเนเธเธเธฒเธฃเธเนเธเธซเธฒเธซเธฃเธทเธญเธ•เธดเธ”เธ•เนเธญเน€เธฃเธฒเนเธ”เธขเธ•เธฃเธ
              </p>
            </div>
          ) : (
            <>
              {/* เธเธธเธ”เธเธฑเธเธซเธกเธธเธ”เธชเธณเธซเธฃเธฑเธเธ”เนเธฒเธเธเธเธเธญเธเธฃเธฒเธขเธเธฒเธฃเธฃเธ–เธเธฃเธดเธเน (เนเธกเนเธฃเธงเธก text SEO เธ”เนเธฒเธเธเธ) */}
              <div id="cars-list-top" className="scroll-mt-24"></div>

              {/* Cards Grid - standardized layout */}
              <div className="car-grid grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
                {currentCars.map((car, index) => {
                  const isBelowFold = index >= 12;

                  if (isBelowFold && !showAllCars) {
                    return (
                      <div
                        key={`skeleton-${car.id}`}
                        className="h-[320px] w-full bg-gray-50 animate-pulse rounded-lg border border-gray-100"
                      ></div>
                    );
                  }

                  return (
                    <CarCard
                      key={car.id}
                      car={car}
                      liveStatus={liveStatuses?.[car.id]?.status}
                      priority={index < 2}
                    />
                  );
                })}
              </div>

              {/* Pagination - Production Style (เน€เธซเธกเธทเธญเธเน€เธงเนเธเนเธเธ•เนเธเธฃเธดเธ) */}
              {safeTotalPages > 1 && (
                <div className="mt-8 md:mt-12 flex flex-col items-center">
                  <nav
                    aria-label="เธเธฒเธฃเนเธเนเธเธซเธเนเธฒ"
                    className="flex items-center justify-center space-x-2"
                  >
                    {/* Previous Button */}
                    {currentPage > 1 ? (
                      <Link
                        href={getPageUrl(currentPage - 1)}
                        scroll={false}
                        className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                        aria-label="เนเธเธซเธเนเธฒเธเนเธญเธเธซเธเนเธฒ"
                        onClick={e => handlePaginationNav(currentPage - 1, e)}
                      >
                        โ เธเนเธญเธเธซเธเนเธฒ
                      </Link>
                    ) : (
                      <span
                        className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed flex items-center justify-center"
                        aria-hidden="true"
                      >
                        โ เธเนเธญเธเธซเธเนเธฒ
                      </span>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {generatePageNumbers().map(page => (
                        <Link
                          key={page}
                          href={getPageUrl(page)}
                          scroll={false}
                          className={`w-10 h-10 text-sm font-medium rounded-lg border transition-colors flex items-center justify-center ${
                            page === currentPage
                              ? 'bg-primary border-primary text-white cursor-default'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                          aria-label={`เนเธเธซเธเนเธฒเธ—เธตเน ${page}`}
                          aria-current={page === currentPage ? 'page' : undefined}
                          onClick={e => handlePaginationNav(page, e)}
                        >
                          {page}
                        </Link>
                      ))}
                    </div>

                    {/* Next Button */}
                    {currentPage < safeTotalPages ? (
                      <Link
                        href={getPageUrl(currentPage + 1)}
                        scroll={false}
                        className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                        aria-label="เนเธเธซเธเนเธฒเธ–เธฑเธ”เนเธ"
                        onClick={e => handlePaginationNav(currentPage + 1, e)}
                      >
                        เธ–เธฑเธ”เนเธ โ’
                      </Link>
                    ) : (
                      <span
                        className="px-3 py-2 text-sm font-medium rounded-lg border transition-colors bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed flex items-center justify-center"
                        aria-hidden="true"
                      >
                        เธ–เธฑเธ”เนเธ โ’
                      </span>
                    )}
                  </nav>

                  {/* Page Info */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      เธซเธเนเธฒ <span className="font-medium text-primary">{currentPage}</span>{' '}
                      เธเธฒเธ <span className="font-medium text-primary">{safeTotalPages}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* SEO Long Text - Moved to bottom for better UX and conversion */}
              <section className="mt-12 md:mt-16 mb-8" aria-labelledby="seo-about-heading">
                <div className="rounded-2xl bg-blue-50/40 border border-blue-100 p-6 md:p-8">
                  <h2
                    id="seo-about-heading"
                    className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 font-prompt mb-4"
                  >
                    เธ—เธณเนเธกเธ•เนเธญเธเน€เธฅเธทเธญเธเธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข
                    เธจเธนเธเธขเนเธฃเธงเธกเธฃเธ–เธกเธทเธญเธชเธญเธเน€เธเธตเธขเธเนเธซเธกเน?
                  </h2>
                  <div className="text-sm md:text-base text-gray-700 font-prompt space-y-4 leading-[1.8]">
                    <p className="text-left">
                      เธขเธดเธเธ”เธตเธ•เนเธญเธเธฃเธฑเธเธชเธนเน{' '}
                      <strong className="text-primary font-semibold">
                        เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข
                      </strong>{' '}
                      เธจเธนเธเธขเนเธฃเธงเธกเธฃเธ–เธกเธทเธญเธชเธญเธเน€เธเธตเธขเธเนเธซเธกเนเธ—เธตเนเนเธ”เนเธฃเธฑเธเธเธงเธฒเธกเนเธงเนเธงเธฒเธเนเธเธเธฒเธเธฅเธนเธเธเนเธฒเธ—เธฑเนเธงเธ เธฒเธเน€เธซเธเธทเธญ
                      เน€เธฃเธฒเธเธฑเธ”เธชเธฃเธฃเน€เธเธเธฒเธฐเธฃเธ–เธเนเธฒเธเธชเธ เธฒเธเธ”เธต
                      เนเธกเธฅเนเนเธ—เน เธเธฃเธฐเธงเธฑเธ•เธดเนเธชเธชเธฐเธญเธฒเธ”
                      เนเธเธฃเธเธชเธฃเนเธฒเธเน€เธ”เธดเธก
                      เนเธกเนเน€เธเธขเธกเธตเธเธฃเธฐเธงเธฑเธ•เธดเธเธเธซเธเธฑเธเธซเธฃเธทเธญเธเธกเธเนเธณ
                      เน€เธเธทเนเธญเธชเนเธเธกเธญเธเธเธงเธฒเธกเธกเธฑเนเธเนเธเธชเธนเธเธชเธธเธ”เนเธซเนเธเธฑเธเธเธธเธ“
                    </p>
                    <p className="text-left">
                      เนเธกเนเธงเนเธฒเธเธธเธ“เธเธณเธฅเธฑเธเธ•เธฒเธกเธซเธฒ{' '}
                      <strong>เธฃเธ–เน€เธเนเธเธเธฃเธฐเธซเธขเธฑเธ”เธเนเธณเธกเธฑเธ</strong>{' '}
                      <span className="text-gray-500 text-sm">(Toyota, Honda, Mazda)</span>,{' '}
                      <strong>
                        เธฃเธ–เธเธฃเธฐเธเธฐเธเธฑเธเธเธธเนเนเธเธฃเนเธเธ—เธเธ—เธฒเธเธชเธณเธซเธฃเธฑเธเธฅเธธเธขเธเธฒเธ
                      </strong>{' '}
                      <span className="text-gray-500 text-sm">(Isuzu, Nissan, Mitsubishi)</span>{' '}
                      เธซเธฃเธทเธญ
                      <strong>
                        เธฃเธ–เธญเน€เธเธเธเธฃเธฐเธชเธเธเน SUV เนเธเธเธเธฃเธญเธเธเธฃเธฑเธง
                      </strong>
                    </p>
                    <p className="text-left">
                      เธฃเธ–เธขเธเธ•เนเธกเธทเธญเธชเธญเธเธ—เธธเธเธเธฑเธเธเธญเธเน€เธฃเธฒเธเนเธฒเธเธเธฒเธฃเธ•เธฃเธงเธเน€เธเนเธเธชเธ เธฒเธเธญเธขเนเธฒเธเธฅเธฐเน€เธญเธตเธขเธ”เธเธฒเธเธเนเธฒเธเธเธนเนเน€เธเธตเนเธขเธงเธเธฒเธ
                      เธเธฃเนเธญเธกเธเธฒเธฃเธฃเธฑเธเธเธฃเธฐเธเธฑเธเน€เธเธฃเธทเนเธญเธเธขเธเธ•เนเนเธฅเธฐเน€เธเธตเธขเธฃเนเธซเธฅเธฑเธเธเธฒเธฃเธเธฒเธข
                      เน€เธฃเธฒเธกเธธเนเธเน€เธเนเธเธเธฒเธฃเนเธซเนเธเธฃเธดเธเธฒเธฃเธ—เธตเนเธเธทเนเธญเธชเธฑเธ•เธขเน
                      เนเธเธฃเนเธเนเธช
                      เธเธฃเนเธญเธกเนเธซเนเธเธณเธเธฃเธถเธเธฉเธฒเธ”เนเธฒเธเธเธฒเธฃเธเธฑเธ”เนเธเนเธเธเธเน
                    </p>
                    <p className="text-left">
                      <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1.5 rounded-md font-semibold my-2 shadow-sm">
                        เธญเธญเธเธฃเธ–เนเธ”เนเธ—เธธเธเธญเธฒเธเธตเธ เธเธฑเธ”เนเธเนเธเธเธเนเธเนเธฒเธข
                        เธญเธเธธเธกเธฑเธ•เธดเนเธง เธเธฃเธตเธ”เธฒเธงเธเน 0%
                      </span>
                      <br />
                      เนเธฅเธฐเธเธฃเธ“เธตเธฅเธนเธเธเนเธฒเธ•เนเธฒเธเธเธฑเธเธซเธงเธฑเธ”เน€เธฃเธฒเธกเธตเธเธฃเธดเธเธฒเธฃเธชเนเธเธฃเธ–เธเธฃเธตเธ–เธถเธเธซเธเนเธฒเธเนเธฒเธเธ—เนเธฒเธเธ—เธฑเนเธงเธเธฃเธฐเน€เธ—เธจเนเธ—เธข
                      เธซเธฒเธเธเธธเธ“เธเธณเธฅเธฑเธเธกเธญเธเธซเธฒเธฃเธ–เธขเธเธ•เนเนเธเธฃเธฒเธเธฒเธ—เธตเนเน€เธซเธกเธฒเธฐเธชเธก
                      เธเธธเนเธกเธเนเธฒเน€เธเธดเธเธ—เธธเธเธเธฒเธ—
                      เธฅเธญเธเน€เธฅเธทเธญเธเธเธกเธฃเธ–เธ—เธตเนเธญเธฑเธเน€เธ”เธ•เธฅเนเธฒเธชเธธเธ”เนเธฅเธฐเธ•เธดเธ”เธ•เนเธญเธ—เธตเธกเธเธฒเธเธเธญเธเน€เธฃเธฒเนเธ”เนเน€เธฅเธข
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ (AEO) - visible content to match FAQPage schema */}
              {!isFiltered && allCarsFaqs?.length > 0 && (
                <section className="mt-10 md:mt-14" aria-labelledby="faq-allcars-heading">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
                    <h2
                      id="faq-allcars-heading"
                      className="text-lg sm:text-xl font-bold text-gray-900 font-prompt"
                    >
                      เธเธณเธ–เธฒเธกเธ—เธตเนเธเธเธเนเธญเธข (FAQ)
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 font-prompt">
                      เธเธณเธ•เธญเธเธชเธฑเนเธเน
                      เธเนเธญเธเธ•เธฑเธ”เธชเธดเธเนเธเธ”เธนเธฃเธ–เนเธฅเธฐเธเธฑเธ”เธซเธกเธฒเธข
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
                              โ–พ
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
  // Server-only modules โ€“ kept out of the client bundle via require()
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

    // เธฅเธ”เธเธเธฒเธ”เธเนเธญเธกเธนเธฅเนเธ”เธขเน€เธเนเธเน€เธเธเธฒเธฐเธเธดเธฅเธ”เนเธ—เธตเนเธเธณเน€เธเนเธ
    cars = cars.map(car => ({
      id: car.id,
      handle: car.handle,
      title: car.title,
      vendor: car.vendor,
      tags: car.tags,
      price: car.price,
      // Keep quick specs for CarCard (เธเธต/เนเธกเธฅเน/เน€เธเธตเธขเธฃเน/เน€เธเธทเนเธญเน€เธเธฅเธดเธ/เธเธฑเธเน€เธเธฅเธทเนเธญเธ)
      year: car.year,
      mileage: car.mileage,
      transmission: car.transmission,
      drivetrain: car.drivetrain || car.drive_type || car.wheel_drive,
      drive_type: car.drive_type || car.drivetrain || car.wheel_drive,
      installment: car.installment,
      fuelType: car.fuelType || car.fuel_type,
      fuel_type: car.fuel_type || car.fuelType,
      // Keep metaobject-backed display labels for cards (เธเธฃเธฐเน€เธ เธ—เธฃเธ–/เธเธฃเธฐเน€เธ เธ—เธ•เธฑเธงเธ–เธฑเธ)
      // so mobile Safari doesn't depend on deferred client enrichment to show them.
      category: car.category,
      body_type: car.body_type,
      images: car.images?.slice(0, 1) || [], // เน€เธเนเธเนเธเนเธฃเธนเธเนเธฃเธเธชเธณเธซเธฃเธฑเธ listing
      availableForSale: car.availableForSale,
      status: carStatuses[car.id]?.status || 'available', // Add status from file
    }));

    // เนเธชเธ”เธเธฃเธ–เธ—เธฑเนเธเธซเธกเธ”เธ—เธตเนเธกเธตเธเธฃเธดเธ เนเธกเนเธเธณเธเธฑเธ”เธเธณเธเธงเธ
  } catch (error) {
    // Silent error handling for production - เนเธซเน UI เนเธชเธ”เธเธเนเธญเธกเธนเธฅเธงเนเธฒเธเนเธ—เธ
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
  const carsPerPage = 24;
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

  // Precompute JSON-LD for SEO on the server (lightweight) so the client doesnโ€t rebuild
  // a large graph during hydration. Skip on filtered pages because they are noindex.
  let structuredDataJson = null;
  try {
    const hasSearch = !!(initialSearchTerm && String(initialSearchTerm).trim());
    const hasPrice = initialPriceRange !== 'all';
    const hasBrand = initialBrandFilter !== 'all';
    const isFiltered = hasSearch || hasBrand || hasPrice; // Prevent duplicate indexing of filtered queries

    if (!isFiltered) {
      const seoPath = safePage > 1 ? `/all-cars?page=${safePage}` : '/all-cars';

      const topCarImages = pageCars
        .slice(0, 4)
        .map(c => c?.images?.[0]?.url)
        .filter(Boolean)
        .map(url => (url.startsWith('/') ? 'https://www.chiangmaiusedcar.com' + url : url));
      const collectionSchema = {
        '@context': 'https://schema.org',
        image: topCarImages.length > 0 ? topCarImages : undefined,
        '@type': 'CollectionPage',
        name: `เธฃเธ–เธกเธทเธญเธชเธญเธเธ—เธฑเนเธเธซเธกเธ”${totalPages > 1 ? ` - เธซเธเนเธฒ ${safePage}` : ''}`,
        description: `เธฃเธ–เธกเธทเธญเธชเธญเธเธเธธเธ“เธ เธฒเธเธ”เธต ${Number.isFinite(totalCount) ? totalCount : 0} เธเธฑเธ เธเธฃเนเธญเธกเธชเนเธเธกเธญเธ`,
        url: `https://www.chiangmaiusedcar.com/all-cars${safePage > 1 ? `?page=${safePage}` : ''}`,
        mainEntity: {
          '@type': 'ItemList',
          name: 'เธฃเธฒเธขเธเธฒเธฃเธฃเธ–เธกเธทเธญเธชเธญเธ',
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
              item: {
                '@type': 'Car',
                '@id': carUrl,
                url: carUrl,
                name: car?.title || 'เธฃเธ–เธกเธทเธญเธชเธญเธ',
                image: imageUrl,
                brand: car?.vendor ? { '@type': 'Brand', name: car.vendor } : undefined,
                modelDate: car?.year || undefined,
                vehicleTransmission: car?.transmission || undefined,
                mileageFromOdometer: car?.mileage
                  ? {
                      '@type': 'QuantitativeValue',
                      value:
                        typeof car.mileage === 'string'
                          ? Number(car.mileage.replace(/\\D/g, '')) || 0
                          : car.mileage,
                      unitCode: 'KMT',
                    }
                  : undefined,
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'THB',
                  price: car?.price?.amount || 0,
                  itemCondition: 'https://schema.org/UsedCondition',
                  availability: car?.availableForSale
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                  url: carUrl,
                  seller: {
                    '@type': 'AutoDealer',
                    name: 'เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข เน€เธเธตเธขเธเนเธซเธกเน',
                  },
                },
              },
            };
          }),
        },
        publisher: {
          '@type': 'AutoDealer',
          name: 'เธเธฃเธนเธซเธเธถเนเธเธฃเธ–เธชเธงเธข',
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
