/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO.jsx';
import CarCard from '../components/CarCard';
import { getHomepageCars, getBrandCounts } from '../lib/shopify.mjs';
import { readCarStatuses } from '../lib/carStatusStore.js';
import Link from 'next/link';
import A11yImage from '../components/A11yImage'; // Static import for LCP
import { SEO_HOME } from '../config/seo-keywords';
import HomeAboutInline from '../components/HomeAboutInline';
import HomeSearchSection from '../components/HomeSearchSection';
import { computeSchemaAvailability } from '../lib/carStatusUtils.js';
import { COMMON_OFFER_EXTENSIONS } from '../config/business';
import { buildFaqPageJsonLd } from '../lib/seo/faq';
import { getPriceInfo } from '../lib/carPrice';
import { mergeCarSpecs } from '../lib/mergeCarSpecs';

const HOME_FAQS = [
  {
    q: 'ดาวน์ 0% จริงไหม?',
    a: 'จริง! ครูหนึ่งรถสวยมีโปรโมชันฟรีดาวน์ 0% ลูกค้าสามารถออกรถโดยไม่ต้องวางเงินดาวน์ ตรวจสภาพครบถ้วน ตรวจสอบประวัติรถทุกคันก่อนส่งมอบ พร้อมเอกสารครบถ้วน',
  },
  {
    q: 'ติดเครดิตบูโรออกได้ไหม?',
    a: 'ออกได้! เรามีไฟแนนซ์หลากหลายรายผู้ให้สินเชื่อ รองรับทุกอาชีพ แนะนำให้ทัก LINE @krunung.car หรือโทร 094-064-9018 เพื่อประเมินเบื้องต้น ทีมงานจะช่วยหาวิธีที่เหมาะสมที่สุด',
  },
  {
    q: 'มีรับประกันไหม?',
    a: 'รับประกันเครื่องยนต์และเกียร์ 1 ปีเต็ม ตรวจสภาพครบถ้วนก่อนส่งมอบโดยช่างผู้เชี่ยวชาญ มีบริการหลังการขายและศูนย์บริการครบวงจร',
  },
  {
    q: 'รถมือสองเชียงใหม่ที่ไหนดี?',
    a: 'ครูหนึ่งรถสวย (www.chiangmaiusedcar.com) เป็นศูนย์รถมือสองออนไลน์ชั้นนำในเชียงใหม่ คัดสรรรถบ้านคุณภาพดี ฟรีดาวน์ ผ่อนถูก รับประกัน 1 ปี จัดส่งฟรีทั่วประเทศ',
  },
  {
    q: 'มีรถยี่ห้ออะไรบ้าง?',
    a: 'มีรถยี่ห้อชั้นนำทุกยี่ห้อ ได้แก่ Toyota, Honda, Nissan, Mazda, Mitsubishi, Isuzu, Ford ทั้งรถเก๋ง รถกระบะ รถ SUV และรถครอบครัว 7 ที่นั่ง ราคาตั้งแต่ 100,000 บาทขึ้นไป',
  },
  {
    q: 'จัดส่งได้ไหม?',
    a: 'จัดส่งฟรีทั่วประเทศ! มีบริการนำรถส่งถึงบ้านลูกค้า ตรวจสภาพก่อนส่งมอบทุกครั้ง',
  },
];

// Lazy load non-critical components to reduce TBT
const Breadcrumb = dynamic(() => import('../components/Breadcrumb'), {
  loading: () => null,
});
const SocialShareButtons = dynamic(() => import('../components/SocialShareButtons'), {
  /* ssr: false, removed for INP */
  loading: () => null,
});

// Split large below-the-fold reviews section into a separate chunk
const FacebookReviewsSection = dynamic(() => import('../components/FacebookReviewsSection'), {
  /* ssr: false, removed for INP */
  loading: () => null,
});
const HomeWhyChooseSection = dynamic(() => import('../components/HomeWhyChooseSection'), {
  /* ssr: false, removed for INP */
  loading: () => null,
});
const HomeFaqSection = dynamic(() => import('../components/HomeFaqSection'), {
  /* ssr: false, removed for INP */
  loading: () => null,
});

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
  const seoHome = SEO_HOME;
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

  // Defer large below-the-fold sections to reduce initial DOM/style/layout work.
  // This helps mobile LCP by allowing the browser to paint the hero sooner.
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  // Defer non-critical share widget to reduce long tasks during hydration
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [socialShareUrl, setSocialShareUrl] = useState('');

  // Memoize expensive computations
  const safeCars = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);

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

  // Show deferred content after the browser is idle, or earlier if the user interacts.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (showDeferredSections) return;

    let done = false;
    let idleId;
    let timeoutId;
    let hardTimeoutId;

    const enable = () => {
      if (done) return;
      done = true;
      setShowDeferredSections(true);
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
      idleId = window.requestIdleCallback(enable, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(enable, 800);
    }

    // Safety net: always show within a few seconds.
    hardTimeoutId = window.setTimeout(enable, 4000);

    return () => {
      cleanupListeners();
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
      if (hardTimeoutId) window.clearTimeout(hardTimeoutId);
    };
  }, [showDeferredSections]);

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
            src="/herobanner/newherobanner-828w.webp"
            srcSet="/herobanner/newherobanner-414w.webp 414w, /herobanner/newherobanner-640w.webp 640w, /herobanner/newherobanner-828w.webp 828w, /herobanner/newherobanner-1024w.webp 1024w, /herobanner/newherobanner-1400w.webp 1400w"
            sizes="(max-width: 414px) 414px, (max-width: 1400px) 100vw, 1400px"
            alt="ปกเว็บ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
            width={1400}
            height={467}
            className="w-full h-auto object-contain"
            priority
            decoding="sync"
            fetchPriority="high"
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
              className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base bg-accent-800 text-white hover:bg-accent-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              เลือกซื้อรถยนต์
            </Link>
            <Link
              href="/used-cars-chiang-mai"
              className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base border-2 border-orange-600 text-orange-700 hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ฝากขายได้ราคาดี
            </Link>
            <Link
              href="/sell-car"
              className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ขายด่วนรับเงินเลย!
            </Link>
          </div>
        </div>
      </section>

      {showDeferredSections ? (
        <>
          {/* Why Choose Us Section - SEO Content (extracted) */}
          <HomeAboutInline />

          <main
            className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 py-16 bg-white font-prompt cv-auto-md"
            id="recommended-cars"
          >
            {/* Search Section (extracted) */}
            <HomeSearchSection />

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
              <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-5 ipadpro:px-3 lg:px-6">
                <section aria-label="รถเข้าใหม่แนะนำวันนี้">
                  {safeCars.length === 0 ? (
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
                    <div className="car-grid grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
                      {safeCars.slice(0, 8).map(car => {
                        const mergedCar = mergeCarSpecs(car, null);
                        return <CarCard key={car.id} car={mergedCar} />;
                      })}
                    </div>
                  )}
                </section>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link
                href="/all-cars"
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
          {/* FAQ Section (extracted) */}
          <HomeFaqSection />

          {/* รีวิว Facebook 9 รีวิวจริง (โหลดเมื่อใกล้ viewport) */}
          <div id="fb-reviews-anchor" className="h-px w-full" aria-hidden="true" />
          {showFbReviews && <FacebookReviewsSection />}

          {/* Why Choose Us Section - 2025 Modern Design (extracted) */}
          <HomeWhyChooseSection getBrandCount={getBrandCount} />

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
        </>
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

  const carsPromise = getHomepageCars(8).catch(() => []);
  const statusesPromise = readCarStatuses().catch(() => ({}));
  const brandCountsPromise = getBrandCounts().catch(() => ({}));

  const [carsRaw, carStatuses, counts] = await Promise.all([
    carsPromise,
    statusesPromise,
    brandCountsPromise,
  ]);

  cars = Array.isArray(carsRaw) ? carsRaw : [];
  brandCounts = counts || {};

  // Add status to homepage cars (do not filter; show badge instead)
  try {
    cars = cars.map(c => ({ ...c, status: carStatuses?.[c.id]?.status || 'available' }));
  } catch {
    // ignore status merge errors
  }

  // Cache-busting for OG image (stable for a given ISR regeneration)
  try {
    const dateStamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const src = encodeURIComponent('/herobanner/newherobanner-1400w.webp');
    homeOgImage = `https://www.chiangmaiusedcar.com/api/og?src=${src}&w=1200&h=630&v=${dateStamp}`;
  } catch {
    homeOgImage =
      'https://www.chiangmaiusedcar.com/api/og?src=%2Fherobanner%2Fnewherobanner-1400w.webp&w=1200&h=630';
  }

  try {
    homeItemListJsonLd = buildHomeItemListJsonLd(cars);
  } catch {
    homeItemListJsonLd = null;
  }

  return {
    props: { cars, brandCounts, homeOgImage, homeItemListJsonLd },
    revalidate: 600, // 10 minutes - Reduce regeneration frequency for better TTFB
  };
}

// trigger reload
