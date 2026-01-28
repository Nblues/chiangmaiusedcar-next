/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO.jsx';
import CarCard from '../components/CarCard';
import { getHomepageCars, getBrandCounts } from '../lib/shopify.mjs';
import { readCarStatuses } from '../lib/carStatusStore.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import A11yImage from '../components/A11yImage'; // Static import for LCP
import { SEO_KEYWORD_MAP } from '../config/seo-keyword-map';
import {
  getCachedStatuses,
  setCachedStatuses,
  debounceVisibilityRefetch,
} from '../lib/carStatusCache';
import { computeSchemaAvailability } from '../lib/carStatusUtils.js';
import { COMMON_OFFER_EXTENSIONS } from '../config/business';
import { buildFaqPageJsonLd } from '../lib/seo/faq';

const HOME_FAQS = [
  {
    q: 'ดาวน์ 0% จริงไหม?',
    a: 'จริง! ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชัน ตรวจสภาพครบถ้วน และตรวจสอบประวัติรถก่อนส่งมอบ',
  },
  {
    q: 'ติดเครดิตบูโรออกได้ไหม?',
    a: 'ได้! เรามีไฟแนนซ์หลากหลายแบบ แนะนำให้ทัก LINE หรือโทร 094-064-9018 เพื่อประเมินเบื้องต้น',
  },
  {
    q: 'มีรับประกันไหม?',
    a: 'รับประกันเครื่องยนต์และเกียร์ 1 ปีเต็ม ตรวจสภาพครบถ้วนก่อนส่งมอบ และมีบริการหลังการขาย',
  },
];

// Lazy load non-critical components to reduce TBT
const Breadcrumb = dynamic(() => import('../components/Breadcrumb'), {
  loading: () => null,
});
const SocialShareButtons = dynamic(() => import('../components/SocialShareButtons'), {
  ssr: false,
  loading: () => null,
});

// Split large below-the-fold reviews section into a separate chunk
const FacebookReviewsSection = dynamic(() => import('../components/FacebookReviewsSection'), {
  ssr: false,
  loading: () => null,
});

// Helper: format price safely for display and microdata using our safe utility
function getPriceInfo(amount) {
  try {
    const num = Number(amount);
    const valid = Number.isFinite(num) && num >= 0;
    return {
      valid,
      numeric: valid ? String(num) : undefined,
      // Specify locale to keep SSR/CSR consistent and avoid hydration churn
      display: valid ? num.toLocaleString('th-TH') : 'ติดต่อสอบถาม',
    };
  } catch {
    return {
      valid: false,
      numeric: undefined,
      display: 'ติดต่อสอบถาม',
    };
  }
}

function buildHomeItemListJsonLd(inputCars) {
  const site = 'https://www.chiangmaiusedcar.com';
  const cars = Array.isArray(inputCars) ? inputCars : [];
  const itemListElement = cars.slice(0, 10).map((car, index) => {
    const priceInfo = getPriceInfo(car?.price?.amount || 0);
    const handle = car?.handle;
    const carUrl = handle ? `${site}/car/${handle}` : site;

    const rawImage = car?.images?.[0]?.url;
    const imageUrl = rawImage
      ? rawImage.startsWith('http')
        ? rawImage
        : `${site}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
      : `${site}/herobanner/cnxcar.webp`;

    const vendorOrBrand = car?.vendor || car?.brand || car?.title?.split(' ')?.[0] || 'รถยนต์';
    const model = car?.model || car?.title || '';
    const year = car?.year || '';
    const title = car?.title || `${vendorOrBrand} ${model}`.trim();
    const availabilityValue = computeSchemaAvailability({
      status: car?.status,
      availableForSale: car?.availableForSale,
    });
    const inStock = availabilityValue === 'InStock';

    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        // Google Rich Results: Product is the supported type.
        // Keep vehicle context via additionalType.
        '@type': 'Product',
        additionalType: 'https://schema.org/Car',
        '@id': carUrl,
        name: title,
        description: `${vendorOrBrand} ${model} ${year} ราคา ${priceInfo.display} บาท`.trim(),
        brand: {
          '@type': 'Brand',
          name: vendorOrBrand,
        },
        sku: car?.id || handle,
        image: imageUrl,
        url: carUrl,
        offers: {
          '@type': 'Offer',
          price: priceInfo.numeric || '0',
          priceCurrency: 'THB',
          url: carUrl,
          itemCondition: 'https://schema.org/UsedCondition',
          availability: `https://schema.org/${availabilityValue}`,
          inventoryLevel: {
            '@type': 'QuantitativeValue',
            value: inStock ? 1 : 0,
            unitCode: 'EA',
          },
          seller: COMMON_OFFER_EXTENSIONS.seller,
          hasMerchantReturnPolicy: COMMON_OFFER_EXTENSIONS.hasMerchantReturnPolicy,
          shippingDetails: COMMON_OFFER_EXTENSIONS.shippingDetails,
        },
      },
    };
  });

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'รถมือสองแนะนำ',
    description: 'รถมือสองคุณภาพดีจากครูหนึ่งรถสวย',
    numberOfItems: cars.length,
    itemListElement,
  });
}

export default function Home({ cars, brandCounts, homeOgImage, homeItemListJsonLd }) {
  const seoHome = SEO_KEYWORD_MAP.home;
  const homeFaqSchema = useMemo(() => buildFaqPageJsonLd({ url: '/', faqs: HOME_FAQS }), []);

  // Helper function to get brand count with fallback to sample data
  const getBrandCount = useCallback(
    brandName => {
      const normalizedBrand = brandName.toLowerCase();

      // Use real data if available, otherwise use sample data
      if (brandCounts && Object.keys(brandCounts).length > 0) {
        const count = brandCounts[normalizedBrand] || 0;
        return count > 0 ? `${count} คัน` : '0 คัน';
      }

      // Fallback sample data
      const sampleCounts = {
        toyota: '50+ คัน',
        honda: '30+ คัน',
        nissan: '20+ คัน',
        mazda: '15+ คัน',
        mitsubishi: '10+ คัน',
        ford: '8+ คัน',
      };

      return sampleCounts[normalizedBrand] || '0 คัน';
    },
    [brandCounts]
  );

  // Facebook reviews: render only client
  const [showFbReviews, setShowFbReviews] = useState(false);
  const [liveStatuses, setLiveStatuses] = useState(null);
  const [specByHandle, setSpecByHandle] = useState({});
  const requestedSpecHandlesRef = useRef(new Set());

  const mergeSpecs = (car, extra) => {
    const next = { ...car };

    const has = v => v != null && String(v).trim() !== '';
    const carFuel = car?.fuelType || car?.fuel_type || car?.['fuel-type'];
    const extraFuel = extra?.fuelType || extra?.fuel_type || extra?.['fuel-type'];

    // Normalize fuel keys so all cards behave the same
    if (has(carFuel)) {
      if (!has(next.fuelType)) next.fuelType = carFuel;
      if (!has(next.fuel_type)) next.fuel_type = carFuel;
    }

    if (!extra) return next;

    if (!has(next.year) && has(extra.year)) next.year = extra.year;
    if (!has(next.mileage) && has(extra.mileage)) next.mileage = extra.mileage;
    if (!has(next.transmission) && has(extra.transmission)) next.transmission = extra.transmission;
    if (!has(carFuel) && has(extraFuel)) {
      next.fuelType = extra.fuelType || extraFuel;
      next.fuel_type = extra.fuel_type || extraFuel;
    }
    if (!has(next.installment) && has(extra.installment)) next.installment = extra.installment;

    if (!has(next.category) && has(extra.category)) next.category = extra.category;
    if (!has(next.body_type) && has(extra.body_type)) next.body_type = extra.body_type;

    return next;
  };

  // Defer non-critical share widget to reduce long tasks during hydration
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [socialShareUrl, setSocialShareUrl] = useState('');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  const router = useRouter();

  // Memoize expensive computations
  const safeCars = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);
  // Merge live statuses with SSR cars when available
  const carsWithLive = useMemo(() => {
    if (!liveStatuses) return safeCars;
    try {
      return safeCars.map(c => {
        const s = liveStatuses[c.id]?.status;
        return s ? { ...c, status: s } : c;
      });
    } catch {
      return safeCars;
    }
  }, [safeCars, liveStatuses]);
  // Precompute IDs for fetching statuses
  const ids = useMemo(() => safeCars.map(c => c.id).filter(Boolean), [safeCars]);

  // Enrich missing specs for the first 8 homepage cards (mileage/transmission/fuel/installment/category)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const list = Array.isArray(carsWithLive) ? carsWithLive.slice(0, 8) : [];
    if (list.length === 0) return;

    const needs = [];
    for (const car of list) {
      const handle = car?.handle;
      if (!handle) continue;
      if (requestedSpecHandlesRef.current.has(handle)) continue;

      const extra = specByHandle?.[handle];
      const merged = mergeSpecs(car, extra);

      const hasMileage = merged?.mileage != null && String(merged.mileage).trim() !== '';
      const hasTransmission =
        merged?.transmission != null && String(merged.transmission).trim() !== '';
      const fuel = merged?.fuelType || merged?.fuel_type;
      const hasFuel = fuel != null && String(fuel).trim() !== '';
      const hasInstallment =
        merged?.installment != null && String(merged.installment).trim() !== '';

      const hasCategory = merged?.category != null && String(merged.category).trim() !== '';

      if (!(hasMileage && hasTransmission && hasFuel && hasInstallment && hasCategory)) {
        needs.push(handle);
      }
    }

    if (needs.length === 0) return;
    needs.forEach(h => requestedSpecHandlesRef.current.add(h));

    const fetchSpecs = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const params = new URLSearchParams({ handles: needs.join(',') });
        const resp = await fetch(`/api/public/car-specs?${params.toString()}`, {
          cache: 'no-store',
          credentials: 'same-origin',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!resp.ok) {
          needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
          return;
        }
        const data = await resp.json();
        if (!data?.ok || !data?.specs) {
          needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
          return;
        }

        // If a handle wasn't returned, don't permanently block retries.
        const returned = new Set(Object.keys(data.specs || {}));
        for (const h of needs) {
          if (!returned.has(h)) requestedSpecHandlesRef.current.delete(h);
        }

        setSpecByHandle(prev => ({
          ...(prev || {}),
          ...data.specs,
        }));
      } catch (error) {
        needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('Failed to fetch car specs:', error?.message);
        }
      }
    };

    fetchSpecs().catch(() => {});
  }, [carsWithLive, specByHandle]);

  // NOTE: Always attach a catch when invoking async helpers inside effects,
  // timers, or event handlers to avoid "Unhandled Runtime Error" overlays
  // if a browser extension or network stack throws unexpectedly.

  // Memoize static data to prevent re-creation
  const brands = useMemo(
    () => ['all', 'toyota', 'honda', 'nissan', 'mazda', 'mitsubishi', 'isuzu', 'ford'],
    []
  );
  const priceRanges = useMemo(
    () => [
      { value: 'all', label: 'ทุกช่วงราคา' },
      { value: '0-100000', label: 'ต่ำกว่า 1 แสน' },
      { value: '100000-200000', label: '1-2 แสน' },
      { value: '200000-300000', label: '2-3 แสน' },
      { value: '300000-400000', label: '3-4 แสน' },
      { value: '400000-500000', label: '4-5 แสน' },
      { value: '500000-600000', label: '5-6 แสน' },
      { value: '600000-700000', label: '6-7 แสน' },
      { value: '700000', label: '7 แสนขึ้นไป' },
    ],
    []
  );

  // Optimize heavy functions with useCallback
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    const term = (searchTerm || '').trim().slice(0, 120);
    if (term) params.set('search', term);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (brandFilter !== 'all') params.set('brand', brandFilter);

    const queryString = params.toString();
    const url = queryString ? `/all-cars?${queryString}` : '/all-cars';
    router.push(url);
  }, [searchTerm, priceRange, brandFilter, router]);

  // Optimize useEffect - reduce blocking time with caching
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        // Only run in browser environment
        if (typeof window === 'undefined') return;
        if (!ids || ids.length === 0) return;

        // Check cache first
        const cached = getCachedStatuses(ids);
        if (cached) {
          setLiveStatuses(cached);
          return;
        }

        const qs = new URLSearchParams({ ids: ids.join(',') });
        const resp = await fetch(`/api/public/car-status?${qs.toString()}`, {
          cache: 'no-store',
        }).catch(err => {
          // Silently log and return null
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Failed to fetch car statuses:', err.message);
          }
          return null;
        });

        if (!resp || !resp.ok) return;
        const data = await resp.json().catch(() => null);
        if (data?.ok) {
          const statuses = data.statuses || {};
          setCachedStatuses(statuses);
          setLiveStatuses(statuses);
        }
      } catch (err) {
        // Silently handle any remaining errors
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Error in fetchStatuses:', err.message);
        }
      }
    };

    const runFetchStatuses = () => fetchStatuses().catch(() => {});

    // Re-fetch when returning to the tab to keep status fresh (debounced)
    let removeVis;
    if (typeof document !== 'undefined') {
      const fetchStatusesOnVisibility = async () => {
        try {
          // Only fetch when tab is visible and we're in browser
          if (typeof window === 'undefined') return;
          if (document.visibilityState !== 'visible') return;
          if (!ids || ids.length === 0) return;

          // Check cache first
          const cached = getCachedStatuses(ids);
          if (cached) {
            setLiveStatuses(cached);
            return;
          }

          const qs = new URLSearchParams({ ids: ids.join(',') });
          const resp = await fetch(`/api/public/car-status?${qs.toString()}`, {
            cache: 'no-store',
          }).catch(err => {
            // Silently log and return null
            if (process.env.NODE_ENV !== 'production') {
              console.warn('Failed to fetch car statuses on visibility:', err.message);
            }
            return null;
          });

          if (!resp || !resp.ok) return;
          const data = await resp.json().catch(() => null);
          if (data?.ok) {
            const statuses = data.statuses || {};
            setCachedStatuses(statuses);
            setLiveStatuses(statuses);
          }
        } catch (err) {
          // Silently handle any remaining errors
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Error in visibility fetchStatuses:', err.message);
          }
        }
      };

      // Debounce visibility refetch to 3 seconds
      const debouncedFetch = debounceVisibilityRefetch(
        () => fetchStatusesOnVisibility().catch(() => {}),
        3000
      );
      document.addEventListener('visibilitychange', debouncedFetch);
      removeVis = () => document.removeEventListener('visibilitychange', debouncedFetch);
    }

    // Defer live status fetch until *after* initial render/LCP window.
    // This helps reduce Lighthouse TBT variance while keeping UI/SEO unchanged.
    let timer;
    let idleCallback;
    if (typeof window !== 'undefined') {
      timer = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idleCallback = window.requestIdleCallback(() => {
            runFetchStatuses();
          });
        } else {
          runFetchStatuses();
        }
      }, 5500);
    }

    return () => {
      if (removeVis) removeVis();
      if (typeof window !== 'undefined') {
        if (timer) window.clearTimeout(timer);
        if (idleCallback && 'cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleCallback);
        }
      }
    };
  }, [ids]);

  // Load Facebook reviews only when the user is near that section.
  // This avoids loading a heavy client-only chunk during the initial render (helps LCP).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (showFbReviews) return;

    const anchor = document.getElementById('fb-reviews-anchor');
    if (!anchor) {
      const t = window.setTimeout(() => setShowFbReviews(true), 8000);
      return () => window.clearTimeout(t);
    }

    if (!('IntersectionObserver' in window)) {
      setShowFbReviews(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setShowFbReviews(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [showFbReviews]);

  // Load SocialShareButtons after the page is idle or when user interacts.
  // This prevents downloading/executing its chunk during the critical render/hydration window.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (showSocialShare) return;

    let done = false;
    let idleId;
    let timeoutId;

    const enable = () => {
      if (done) return;
      done = true;
      try {
        setSocialShareUrl(window.location.href);
      } catch {
        setSocialShareUrl('');
      }
      setShowSocialShare(true);
      cleanupListeners();
    };

    const onInteraction = () => enable();
    const events = ['scroll', 'click', 'touchstart', 'keydown'];

    const cleanupListeners = () => {
      for (const ev of events) {
        window.removeEventListener(ev, onInteraction);
      }
    };

    for (const ev of events) {
      window.addEventListener(ev, onInteraction, { passive: true, once: true });
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 3500 });
    } else {
      timeoutId = window.setTimeout(enable, 2000);
    }

    // Fallback safety net: always show within 8s even if idle callback doesn't fire.
    const hardTimeoutId = window.setTimeout(enable, 8000);

    return () => {
      cleanupListeners();
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
      window.clearTimeout(hardTimeoutId);
    };
  }, [showSocialShare]);

  return (
    <div>
      <SEO
        title={seoHome.title}
        description={seoHome.description}
        url="/"
        image={homeOgImage}
        type="website"
        pageType="home"
        breadcrumbs={[{ name: 'หน้าแรก', url: '/' }]}
        structuredData={homeFaqSchema}
      />

      <header className="relative w-full h-auto flex items-center justify-center bg-gradient-to-r from-orange-100 to-blue-100">
        <div className="relative w-full max-w-[1400px] mx-auto">
          {/* LCP Optimized: Native responsive img for critical hero banner */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <A11yImage
            src="/herobanner/cnxcar-828w.webp"
            srcSet="/herobanner/cnxcar-640w.webp 640w, /herobanner/cnxcar-828w.webp 828w, /herobanner/cnxcar-1024w.webp 1024w, /herobanner/cnxcar-1400w.webp 1400w"
            sizes="(max-width: 1400px) 100vw, 1400px"
            alt="ปกเว็บ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
            width={1400}
            height={467}
            className="w-full h-auto object-contain"
            priority
            decoding="async"
            optimizeImage={false}
          />
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      <section id="hero" className="relative">
        <div className="hero-card max-w-6xl w-[95%] mx-auto my-6 flex flex-col md:flex-row items-center gap-6 px-8 py-8 rounded-2xl border border-orange-300 bg-white/95 shadow-lg">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 font-prompt">
              รถยนต์มือสองเชียงใหม่
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-orange-700 mb-4 font-prompt">
              คุณภาพระดับพรีเมียม
            </h2>
            <p className="text-base leading-relaxed text-gray-900 font-prompt">
              ครูหนึ่งรถสวย แพลตฟอร์มออนไลน์ศูนย์รวมรถบ้านคุณภาพดีในภาคเหนือ คัดเฉพาะรถมือเดียว
              ตรวจสอบประวัติทุกคัน ฟรีดาวน์ ผ่อนถูก รับประกันหลังการขาย 1 ปี จัดส่งฟรีทั่วประเทศ
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[200px]">
            <Link
              href="/all-cars"
              prefetch={false}
              className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base bg-accent-800 text-white hover:bg-accent-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              เลือกซื้อรถยนต์
            </Link>
            <Link
              href="/used-cars-chiang-mai"
              prefetch={false}
              className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base border-2 border-orange-600 text-orange-700 hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ฝากขายได้ราคาดี
            </Link>
            <Link
              href="/sell-car"
              prefetch={false}
              className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ขายด่วนรับเงินเลย!
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - SEO Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 bg-white cv-auto-md">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 sm:mb-8 text-center font-prompt">
            ทำไมต้องเลือกครูหนึ่งรถสวย?
          </h2>

          {/* Main Content */}
          <div className="space-y-6 text-gray-700 leading-relaxed font-prompt">
            {/* Paragraph 1 - Quality & Financing */}
            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 md:p-8">
              <p className="text-sm sm:text-base md:text-lg">
                <strong className="text-primary">ศูนย์รวมรถบ้านคุณภาพดี</strong>{' '}
                ในตลาดรถยนต์มือสองภาคเหนือ{' '}
                <strong className="text-gray-900">คัดสรรคุณภาพทุกคัน</strong> ตรวจสอบโดยผู้เชี่ยวชาญ{' '}
                พร้อม <strong className="text-green-700">รับประกัน 1 ปีเต็ม</strong> เรามี
                <strong className="text-accent-800"> ฟรีดาวน์ 0%</strong> อัตราดอกเบี้ยพิเศษ และ
                <strong className="text-primary">
                  {' '}
                  อนุมัติง่าย
                </strong> ด้วยระบบสินเชื่อที่หลากหลาย{' '}
                <strong className="text-gray-900">ผ่อนถูก ผ่อนสบาย</strong>
              </p>
            </div>

            {/* Paragraph 2 - Car Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 sm:p-6 md:p-8">
              <p className="text-sm sm:text-base md:text-lg mb-4">
                <strong className="text-gray-900">เรามีรถยี่ห้อดังให้เลือกมากมาย</strong>{' '}
                <Link
                  href="/all-cars?brand=toyota"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Toyota
                </Link>{' '}
                <Link
                  href="/all-cars?brand=honda"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Honda
                </Link>{' '}
                <Link
                  href="/all-cars?brand=nissan"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Nissan
                </Link>{' '}
                <Link
                  href="/all-cars?brand=mazda"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Mazda
                </Link>{' '}
                <Link
                  href="/all-cars?brand=isuzu"
                  prefetch={false}
                  className="text-primary hover:underline font-medium"
                >
                  Isuzu
                </Link>{' '}
                ทั้ง
                <Link
                  href="/all-cars?type=เก๋ง"
                  prefetch={false}
                  className="text-accent-800 hover:text-accent-900 hover:underline font-medium"
                >
                  รถเก๋ง
                </Link>{' '}
                <Link
                  href="/all-cars?type=กระบะ"
                  prefetch={false}
                  className="text-accent-800 hover:text-accent-900 hover:underline font-medium"
                >
                  รถกระบะ
                </Link>{' '}
                <Link
                  href="/all-cars?type=SUV"
                  prefetch={false}
                  className="text-accent-800 hover:text-accent-900 hover:underline font-medium"
                >
                  รถ SUV
                </Link>{' '}
                และรถครอบครัว 7 ที่นั่ง พร้อม
                <strong className="text-primary"> ส่งฟรีทั่วประเทศไทย</strong>
              </p>
            </div>

            {/* Paragraph 3 - Services & Contact */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 sm:p-6 md:p-8">
              <p className="text-sm sm:text-base md:text-lg mb-4">
                <strong className="text-gray-900">มีปัญหาเรื่องสินเชื่อ?</strong>{' '}
                <Link
                  href="/credit-check"
                  prefetch={false}
                  className="text-accent-800 hover:text-accent-900 hover:underline font-semibold"
                >
                  ปรึกษาไฟแนนซ์ฟรี
                </Link>{' '}
                เรามีทีมงานมืออาชีพคอยให้คำปรึกษา{' '}
                <strong className="text-gray-900">และอยากขายรถ?</strong>{' '}
                <Link
                  href="/sell-car"
                  prefetch={false}
                  className="text-primary hover:underline font-semibold"
                >
                  ประเมินราคาฟรี รับซื้อทันที
                </Link>{' '}
                ราคายุติธรรม
              </p>

              {/* Contact CTA */}
              <p className="mt-6 pt-6 border-t border-orange-200 text-center text-sm sm:text-base mb-3 text-gray-700">
                <strong className="text-gray-900">นัดหมายดูรถ</strong>
              </p>
              <a
                href="tel:0940649018"
                className="flex w-fit mx-auto items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 hover:shadow-lg text-base sm:text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1  1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>094-064-9018</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <main
        className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 py-16 bg-white font-prompt cv-auto-md"
        id="recommended-cars"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-prompt">
            ค้นหารถที่คุณต้องการ
          </h2>

          {/* Search Bar - 2025 Modern Design */}
          <div className="max-w-6xl mx-auto font-prompt">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div>
                  <label htmlFor="searchTerm" className="sr-only">
                    ค้นหารถ
                  </label>
                  <input
                    type="text"
                    id="searchTerm"
                    name="search"
                    placeholder="ค้นหารถ..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 placeholder-gray-500 bg-white transition-all duration-200"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label htmlFor="priceRange" className="sr-only">
                    ช่วงราคา
                  </label>
                  <select
                    id="priceRange"
                    name="priceRange"
                    value={priceRange}
                    onChange={e => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 bg-white transition-all duration-200"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label htmlFor="brandFilter" className="sr-only">
                    ยี่ห้อรถ
                  </label>
                  <select
                    id="brandFilter"
                    name="brand"
                    value={brandFilter}
                    onChange={e => setBrandFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 bg-white transition-all duration-200"
                  >
                    <option value="all">ทุกยี่ห้อ</option>
                    {brands.slice(1).map(brand => (
                      <option key={brand} value={brand}>
                        {brand.charAt(0).toUpperCase() + brand.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full bg-accent-800 hover:bg-accent-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 font-prompt shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ค้นหา
                  </button>
                </div>
              </div>

              {/* Quick Links - Price Ranges (2025 Modern Clean Design) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link
                  href="/all-cars?price=0-100000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  ต่ำกว่า 1 แสน ({'< 100K'})
                </Link>
                <Link
                  href="/all-cars?price=100000-200000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  1-2 แสน (100K-200K)
                </Link>
                <Link
                  href="/all-cars?price=200000-300000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  2-3 แสน (200K-300K)
                </Link>
                <Link
                  href="/all-cars?price=400000-500000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  4-5 แสน (400K-500K)
                </Link>
                <Link
                  href="/all-cars?price=600000-700000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-primary hover:text-white"
                >
                  6-7 แสน (600K-700K)
                </Link>
                <Link
                  href="/all-cars?price=700000"
                  prefetch={false}
                  className="text-center p-3 bg-white border-2 border-accent rounded-xl hover:bg-accent-800 hover:border-accent-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-sm text-accent-800 hover:text-white"
                >
                  7 แสนขึ้นไป ({'> 700K'})
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* รถแนะนำเข้าใหม่ */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-prompt">
            รถแนะนำเข้าใหม่วันนี้
          </h2>
          <p className="text-base text-gray-700 font-prompt leading-relaxed max-w-3xl mx-auto">
            รถเก๋ง รถกระบะ รถครอบครัว รถอีโค่คาร์ SUV โฟร์วีล{' '}
            <span className="font-bold text-primary">คัดเฉพาะรถมือเดียว ประวัติใส 100%</span>{' '}
            คัดสรรมาเพื่อคุณโดยเฉพาะ ผ่านการตรวจสอบอย่างละเอียด เพื่อให้คุณมั่นใจในทุกการเดินทาง
          </p>
        </div>
        {/* Cars grid (standardized layout across pages) */}
        <div className="-mx-6 md:-mx-8 lg:-mx-12">
          <div className="max-w-7xl mx-auto px-3 md:px-6">
            <section aria-label="รถเข้าใหม่แนะนำวันนี้">
              {carsWithLive.length === 0 ? (
                // Empty state when no cars available
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚗</div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2 font-prompt">
                    ขออภัย ยังไม่มีรถให้แสดง
                  </h3>
                  <p className="text-gray-500 font-prompt mb-4">
                    เรากำลังอัปเดตรถใหม่ ติดตามได้ที่ Facebook หรือ LINE
                  </p>
                  <a
                    href="https://lin.ee/8ugfzstD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-accent-800 hover:bg-accent-900 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
                  >
                    <span>ติดต่อสอบถาม</span>
                  </a>
                </div>
              ) : (
                <div className="car-grid grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
                  {carsWithLive.slice(0, 8).map((car, index) => {
                    const handle = car?.handle;
                    const extra = handle ? specByHandle?.[handle] : null;
                    const mergedCar = mergeSpecs(car, extra);
                    return <CarCard key={car.id} car={mergedCar} priority={index < 2} />;
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
        <div className="text-center mt-12">
          <Link
            href="/all-cars"
            prefetch={false}
            className="inline-flex items-center bg-gray-900 hover:bg-accent-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 space-x-2 border-2 border-accent font-prompt"
            aria-label="ดูรถทั้งหมด ครูหนึ่งรถสวย"
          >
            <span>ดูรถทั้งหมด</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </main>
      <section className="bg-white py-8 sm:py-10 mt-6 rounded-3xl max-w-6xl mx-auto border border-gray-200 shadow-sm cv-auto">
        <div className="px-4 sm:px-6">
          <div className="mb-5 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
              คำถามที่พบบ่อย
            </h2>
            <p className="mt-1 text-sm sm:text-base text-gray-700 font-prompt">
              รวมคำตอบเรื่องดาวน์ 0% เครดิตบูโร และรับประกัน
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                  ดาวน์ 0% จริงไหม?
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                  ดูคำตอบ
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                  ซ่อนคำตอบ
                </span>
              </summary>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                  <span className="font-semibold text-accent-800">จริง!</span>{' '}
                  ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชัน ตรวจสภาพครบถ้วน และตรวจสอบประวัติรถก่อนส่งมอบ
                </div>
              </div>
            </details>

            <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                  ติดเครดิตบูโรออกได้ไหม?
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                  ดูคำตอบ
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                  ซ่อนคำตอบ
                </span>
              </summary>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                  <span className="font-semibold text-primary">ได้!</span>
                  เรามีไฟแนนซ์หลากหลายแบบ แนะนำให้ทัก LINE หรือโทร{' '}
                  <a href="tel:0940649018" className="text-primary font-bold hover:underline ml-1">
                    094-064-9018
                  </a>{' '}
                  เพื่อประเมินเบื้องต้น
                </div>
              </div>
            </details>

            <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                  มีรับประกันไหม?
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                  ดูคำตอบ
                </span>
                <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                  ซ่อนคำตอบ
                </span>
              </summary>

              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                  <span className="font-semibold text-accent-800">รับประกัน</span>
                  เครื่องยนต์และเกียร์ <span className="font-bold text-primary">1 ปีเต็ม</span>{' '}
                  ตรวจสภาพครบถ้วนก่อนส่งมอบ และมีบริการหลังการขาย
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* รีวิว Facebook 9 รีวิวจริง (โหลดเมื่อใกล้ viewport) */}
      <div id="fb-reviews-anchor" className="h-px w-full" aria-hidden="true" />
      {showFbReviews && <FacebookReviewsSection />}

      {/* Why Choose Us Section - 2025 Modern Design */}
      <section className="py-16 mt-8 rounded-3xl max-w-[1400px] mx-auto shadow-xl overflow-hidden bg-white cv-auto-lg">
        <div className="px-6 md:px-10">
          {/* Header Banner (kn9) */}
          <div className="relative rounded-3xl overflow-hidden mb-12 lg:mb-4">
            <div className="relative h-[220px] sm:h-[260px] md:h-[280px] lg:h-[340px]">
              <A11yImage
                src="/images/kn9.webp"
                alt=""
                aria-hidden="true"
                fill
                loading="lazy"
                fetchpriority="low"
                optimizeImage={false}
                sizes="(max-width: 640px) 100vw, (max-width: 1400px) 1400px, 1400px"
                className="absolute inset-0 w-full h-full object-cover object-[50%_36%] sm:object-[50%_62%] lg:object-[50%_56%]"
              />
              <div className="absolute inset-0 bg-black/55 sm:bg-black/40" aria-hidden="true" />

              {/* Floating text above image */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-start text-center px-4 sm:px-8 pt-10 sm:pt-12">
                <h2 className="text-[19px] sm:text-3xl md:text-4xl font-bold text-white mb-4 font-prompt whitespace-nowrap sm:whitespace-normal leading-tight tracking-tight drop-shadow-sm">
                  ลูกค้าทั่วประเทศไว้วางใจเพราะ?
                </h2>
                <p className="text-base sm:text-lg lg:text-base text-white/90 max-w-2xl lg:max-w-none mx-auto font-prompt leading-relaxed lg:leading-tight whitespace-normal lg:whitespace-nowrap drop-shadow-sm">
                  <span className="text-white font-semibold">ประสบการณ์ 10 ปี+</span>{' '}
                  <span className="font-semibold text-white">
                    เฟซบุ๊กผู้ติดตาม 1 ล้านคนทั่วประเทศ
                  </span>{' '}
                  <span className="text-white font-semibold">ลูกค้า 90% เชื่อมั่น</span>{' '}
                  <span
                    className="inline-block font-extrabold text-white tracking-tight text-lg sm:text-xl lg:text-lg px-2 py-0.5 rounded-lg bg-black/45"
                    style={{
                      textShadow:
                        '-2px 0 rgba(0,0,0,0.9), 2px 0 rgba(0,0,0,0.9), 0 -2px rgba(0,0,0,0.9), 0 2px rgba(0,0,0,0.9), -2px -2px rgba(0,0,0,0.9), 2px -2px rgba(0,0,0,0.9), -2px 2px rgba(0,0,0,0.9), 2px 2px rgba(0,0,0,0.9), 0 3px 18px rgba(0,0,0,0.45)',
                    }}
                  >
                    ไม่ต้องมาดูรถ
                  </span>
                </p>
                <div className="w-32 h-1 bg-white/70 mx-auto rounded-full mt-6"></div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
                <A11yImage
                  src="/images/kn2.webp"
                  alt="ไอคอนรถบ้านแท้"
                  width={128}
                  height={128}
                  loading="lazy"
                  fetchpriority="low"
                  optimizeImage={false}
                  className="w-full h-full max-w-none object-contain"
                />
              </div>
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block text-primary font-semibold">คัดเฉพาะรถมือเดียว</span>
                <span className="block">
                  <span className="text-primary font-semibold">จากเจ้าของโดยตรง</span>{' '}
                  <span className="text-accent-800 font-semibold">
                    ไม่มีรถน้ำท่วม ไม่มีรถอุบัติเหตุ
                  </span>{' '}
                  <span className="text-primary">ขอดูเล่มทะเบียนได้ทุกหน้า</span>
                </span>
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
                <A11yImage
                  src="/images/kn1.webp"
                  alt="ไอคอนฟรีดาวน์ 0%"
                  width={128}
                  height={128}
                  loading="lazy"
                  fetchpriority="low"
                  optimizeImage={false}
                  className="w-full h-full max-w-none object-contain"
                />
              </div>
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block text-orange-700 font-semibold">
                  ออกรถไม่ต้องวางเงินดาวน์
                </span>
                <span className="block">
                  ตามเงื่อนไขไฟแนนซ์{' '}
                  <span className="text-primary font-semibold">อนุมัติง่าย ผ่อนสบาย</span>
                </span>
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
                <A11yImage
                  src="/images/kn6.webp"
                  alt="ไอคอนรับประกัน"
                  width={128}
                  height={128}
                  loading="lazy"
                  fetchpriority="low"
                  optimizeImage={false}
                  className="w-full h-full max-w-none object-contain"
                />
              </div>
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block">รับประกันเครื่องยนต์และเกียร์</span>
                <span className="block">
                  <span className="text-primary font-semibold">1 ปีเต็ม ไม่จำกัดกิโลเมตร</span>{' '}
                  พร้อม <span className="text-orange-700 font-semibold">บริการหลังการขาย</span>
                </span>
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
                <A11yImage
                  src="/images/kn5.webp"
                  alt="ไอคอนส่งฟรี"
                  width={128}
                  height={128}
                  loading="lazy"
                  fetchpriority="low"
                  optimizeImage={false}
                  className="w-full h-full max-w-none object-contain"
                />
              </div>
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block text-orange-700 font-semibold">จัดส่งฟรีทุกจังหวัด</span>
                <span className="block">
                  พร้อมประกันการขนส่ง{' '}
                  <span className="text-primary font-semibold">ลูกค้า 90% เชื่อมั่น</span>
                </span>
                <span className="block">ไม่ต้องมาดูรถ</span>
              </p>
            </div>
          </div>

          {/* Car Brands Section - Glass Effect */}
          <div className="relative rounded-3xl p-4 md:p-8 border border-gray-200 shadow-2xl overflow-hidden bg-white">
            {/* Animated Background Elements */}
            <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(26,35,126,0.03),transparent_50%)]"></div>
            <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.02),transparent_50%)]"></div>
            <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(37,99,235,0.02),transparent_50%)]"></div>

            <div className="relative z-10 text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 font-prompt leading-tight">
                ศูนย์รวมแบรนด์ดังครบครัน
              </h3>
              <p className="text-gray-700 font-prompt text-sm md:text-lg leading-relaxed max-w-2xl mx-auto px-2">
                รถมือสองคุณภาพจากทุกแบรนด์ชั้นนำ ตามมาตรฐาน ครูหนึ่งรถสวย
              </p>
            </div>

            {/* Brand Grid - Ultra Glass Design */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              <Link
                href="/all-cars?brand=toyota"
                className="group relative backdrop-blur-2xl bg-white/20 rounded-xl md:rounded-3xl p-3 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="ดูรถ Toyota ทั้งหมด"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-sm md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Toyota
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('toyota')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=honda"
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="ดูรถ Honda ทั้งหมด"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Honda
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('honda')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=nissan"
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="ดูรถ Nissan ทั้งหมด"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Nissan
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('nissan')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=mazda"
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="ดูรถ Mazda ทั้งหมด"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Mazda
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('mazda')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=mitsubishi"
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="ดูรถ Mitsubishi ทั้งหมด"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Mitsubishi
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('mitsubishi')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=ford"
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="ดูรถ Ford ทั้งหมด"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Ford
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('ford')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=isuzu"
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="ดูรถ Isuzu ทั้งหมด"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Isuzu
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('isuzu')}
                  </div>
                </div>
              </Link>

              <Link
                href="/all-cars?brand=hyundai"
                className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
                style={{
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
                }}
                aria-label="ดูรถ Hyundai ทั้งหมด"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                    Hyundai
                  </div>
                  <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                    {getBrandCount('hyundai')}
                  </div>
                </div>
              </Link>
            </div>

            {/* Service Links - Ultra Modern 2025 Neomorphic Glass Design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 px-2 md:px-0">
              <Link
                href="/contact"
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="ติดต่อสอบถามข้อมูลรถยนต์"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    ติดต่อเรา
                  </span>
                </div>
              </Link>
              <Link
                href="/about"
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="เรียนรู้เพิ่มเติมเกี่ยวกับครูหนึ่งรถสวย"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    เกี่ยวกับเรา
                  </span>
                </div>
              </Link>
              <Link
                href="/promotion"
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="ดูโปรโมชั่นและข้อเสนอพิเศษ"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,152,0,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    โปรโมชั่น
                  </span>
                </div>
              </Link>
              <Link
                href="/credit-check"
                prefetch={false}
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="ตรวจสอบสถานะสินเชื่อ"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    ประเมินสินเชื่อ
                  </span>
                </div>
              </Link>
              <Link
                href="/payment-calculator"
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="คำนวณเงินผ่อนรถยนต์"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    คิดเงินผ่อน
                  </span>
                </div>
              </Link>
              <Link
                href="/sell-car"
                prefetch={false}
                className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
                aria-label="ขายรถกับครูหนึ่งรถสวย"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <span className="group-hover:tracking-wider transition-all duration-700">
                    ขายรถ
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Share Buttons - Fixed Position */}
      {showSocialShare && (
        <SocialShareButtons
          url={socialShareUrl}
          title="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่คุณภาพดี"
          description="รถมือสองเชียงใหม่คุณภาพดี คัดสรรทุกคัน ฟรีดาวน์ 0% รับประกัน 1 ปี ส่งฟรีทั่วไทย"
          position="fixed"
        />
      )}

      {/* Defer large JSON-LD parsing until after above-the-fold content */}
      {homeItemListJsonLd ? (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: homeItemListJsonLd }}
        />
      ) : null}
    </div>
  );
}

// ISR - Homepage with car listings - revalidate every 5 minutes
export async function getStaticProps() {
  let cars = [];
  let brandCounts = {};
  let homeOgImage = null;
  let homeItemListJsonLd = null;

  try {
    const result = await getHomepageCars(8);
    cars = Array.isArray(result) ? result : [];
    // Add status to homepage cars (do not filter; show badge instead)
    try {
      const carStatuses = await readCarStatuses();
      cars = cars.map(c => ({ ...c, status: carStatuses[c.id]?.status || 'available' }));
    } catch {
      // ignore status read errors
    }
  } catch {
    // Silent error handling for production
    cars = [];
  }

  // Cache-busting for OG image (stable for a given ISR regeneration)
  try {
    const dateStamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const src = encodeURIComponent('/herobanner/cnxcar.webp');
    homeOgImage = `https://www.chiangmaiusedcar.com/api/og?src=${src}&w=1200&h=630&v=${dateStamp}`;
  } catch {
    homeOgImage =
      'https://www.chiangmaiusedcar.com/api/og?src=%2Fherobanner%2Fcnxcar.webp&w=1200&h=630';
  }

  try {
    homeItemListJsonLd = buildHomeItemListJsonLd(cars);
  } catch {
    homeItemListJsonLd = null;
  }

  try {
    const counts = await getBrandCounts();
    brandCounts = counts || {};
  } catch {
    // Silent error handling for production
    brandCounts = {};
  }

  return {
    props: { cars, brandCounts, homeOgImage, homeItemListJsonLd },
    revalidate: 600, // 10 minutes - Reduce regeneration frequency for better TTFB
  };
}
