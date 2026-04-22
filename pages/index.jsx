/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import SEO from '../components/SEO.jsx';
import { getHomepageCars, getBrandCounts } from '../lib/shopify.mjs';
import { readCarStatuses } from '../lib/carStatusStore.js';
import Link from 'next/link';
import CarCard from '../components/CarCard';
import Breadcrumb from '../components/Breadcrumb';
import HomeSearchSection from '../components/HomeSearchSection';
import { SEO_HOME } from '../config/seo-keywords';
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
const SocialShareButtons = dynamic(() => import('../components/SocialShareButtons'), {
  ssr: false,
  loading: () => null,
});

// Split large below-the-fold reviews section into a separate chunk
const HomeAboutInline = dynamic(() => import('../components/HomeAboutInline'), {
  ssr: false, // Below-the-fold: defer to reduce initial DOM size (SEO content still visible via JS rendering)
  loading: () => <div className="min-h-[250px] w-full" aria-hidden="true" />,
});
const FacebookReviewsSection = dynamic(() => import('../components/FacebookReviewsSection'), {
  ssr: false, // Keep user-generated reviews and external JS out of critical path
  loading: () => <div className="min-h-[400px] w-full" aria-hidden="true" />,
});
const HomeWhyChooseSection = dynamic(() => import('../components/HomeWhyChooseSection'), {
  // SSR enabled for SEO content (business value props)
  loading: () => <div className="min-h-[500px] w-full" aria-hidden="true" />,
});
const HomeFaqSection = dynamic(() => import('../components/HomeFaqSection'), {
  ssr: false, // FAQ JSON-LD schema is in <SEO> component, not dependent on HTML; defer to cut DOM size
  loading: () => <div className="min-h-[600px] w-full" aria-hidden="true" />,
});

const TikTokFeed = dynamic(() => import('../components/TikTokFeed'), {
  loading: () => <div className="min-h-[400px] w-full" aria-hidden="true" />,
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

export default function Home({
  seoHomeData,
  cars,
  brandCounts,
  homeOgImage,
  homeItemListJsonLd,
  tiktokVideos,
}) {
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

  // Lazy render for lower car cards to improve TBT
  const [showAllCars, setShowAllCars] = useState(false);
  useEffect(() => {
    // Delays the rendering of the secondary row of cards to keep the main thread free
    // during the critical initial hydration phase.
    const timer = setTimeout(() => setShowAllCars(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Defer large below-the-fold sections to reduce initial DOM/style/layout work.
  // (showDeferredSections removed to display content immediately)

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

    // Only rely on interaction or a long fallback timeout to prevent blocking LCP paint
    const hardTimeoutId = window.setTimeout(enable, 8000);

    return () => {
      cleanupListeners();
      window.clearTimeout(hardTimeoutId);
    };
  }, [showSocialShare]);

  return (
    <div>
      <SEO
        title={seoHome.title}
        description={seoHome.description}
        keywords={[
          seoHomeData.primary,
          ...seoHomeData.secondary,
          ...seoHomeData.longTail.slice(0, 5),
        ]}
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
          {/* HTML img tag for Hero Banner because Next Image unoptimized handles srcSet poorly */}
          <img
            src="/herobanner/newherobanner-1400w.webp"
            srcSet="
              /herobanner/newherobanner-414w.webp 414w,
              /herobanner/newherobanner-640w.webp 640w,
              /herobanner/newherobanner-828w.webp 828w,
              /herobanner/newherobanner-1024w.webp 1024w,
              /herobanner/newherobanner-1400w.webp 1400w
            "
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1400px"
            alt="ปกเว็บ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
            className="w-full h-auto object-contain block mx-auto text-transparent"
            style={{ aspectRatio: '1400/467' }}
            decoding="sync"
            loading="eager"
            fetchpriority="high"
            width="1400"
            height="467"
          />
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      <section id="hero" className="relative">
        <div className="hero-card max-w-6xl w-[95%] mx-auto my-3 md:my-6 flex flex-col md:flex-row items-center gap-4 md:gap-6 px-4 py-5 md:px-8 md:py-8 rounded-xl md:rounded-2xl border border-orange-300 bg-white/95 shadow-lg">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-primary mb-1 md:mb-2 font-prompt">
              <span className="block md:inline">ศูนย์รวมรถบ้านมือสองเชียงใหม่</span>{' '}
              <span className="block md:inline mt-1 md:mt-0 text-primary text-xl sm:text-2xl md:text-4xl">
                คุณภาพพรีเมียม
              </span>
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-700 mb-2 md:mb-4 font-prompt">
              ฟรีดาวน์ 0% อนุมัติไว รับประกัน 1 ปีเต็ม
            </h2>
            <p className="text-sm md:text-base leading-snug md:leading-relaxed text-gray-900 font-prompt">
              ครูหนึ่งรถสวย คัดเฉพาะรถมือเดียวจากป้ายแดง สภาพนางฟ้า บริการจัดส่งทั่วประเทศไทย
              ซื้อ-ขาย อุ่นใจ มีใบรับรอง
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:gap-4 w-full md:w-auto md:min-w-[200px]">
            <Link
              href="/all-cars"
              prefetch={false}
              className="flex-1 inline-block text-center font-semibold rounded-lg md:rounded-2xl px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-accent-800 text-white hover:bg-accent-900 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.95]"
            >
              เลือกซื้อรถยนต์
            </Link>
            <Link
              href="/used-cars-chiang-mai"
              prefetch={false}
              className="flex-1 inline-block text-center font-semibold rounded-lg md:rounded-2xl px-4 py-2 md:px-6 md:py-3 text-sm md:text-base border border-orange-700 text-orange-800 hover:bg-orange-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.95]"
            >
              ฝากขายรถ
            </Link>
            <Link
              href="/sell-car"
              prefetch={false}
              className="flex-1 inline-block text-center font-semibold rounded-lg md:rounded-2xl px-4 py-2 md:px-6 md:py-3 text-sm md:text-base border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.95]"
            >
              ขายด่วน!
            </Link>
          </div>
        </div>
      </section>

      {/* Removed defer lock to prevent slow spinning */}
      <>
        <main
          className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 py-8 bg-white font-prompt cv-auto-md"
          id="recommended-cars"
        >
          {/* Search Section (extracted) */}
          <HomeSearchSection />

          {/* Why Choose Us Section - 2026 Modern Design (extracted) */}
          <HomeWhyChooseSection getBrandCount={getBrandCount} />

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
                      className="inline-flex items-center bg-accent-800 hover:bg-accent-900 text-white px-6 py-3 min-h-[48px] justify-center rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt active:scale-[0.97] active:opacity-[0.85]"
                    >
                      <span>ติดต่อสอบถาม</span>
                    </a>
                  </div>
                ) : (
                  <div className="car-grid grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
                    {safeCars.slice(0, showAllCars ? 8 : 4).map((car, index) => {
                      const mergedCar = mergeCarSpecs(car, null);
                      return <CarCard key={car.id} car={mergedCar} priority={index < 4} />;
                    })}
                    {!showAllCars &&
                      safeCars.length > 4 &&
                      Array.from({ length: Math.min(4, safeCars.length - 4) }).map((_, i) => (
                        <div
                          key={`skeleton-${i}`}
                          className="h-[320px] w-full bg-gray-50 animate-pulse rounded-lg border border-gray-100"
                        ></div>
                      ))}
                  </div>
                )}
              </section>
            </div>
          </div>
          <div className="text-center mt-8 sm:mt-12 px-4 sm:px-0">
            <Link
              href="/all-cars"
              prefetch={false}
              className="flex w-full justify-center md:inline-flex md:w-auto items-center bg-gray-900 hover:bg-accent-800 text-white px-8 py-4 rounded-full sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.95] transition-all duration-300 space-x-2 border-2 border-accent font-prompt"
              aria-label="ดูรถทั้งหมด ครูหนึ่งรถสวย"
            >
              <span>ดูรถทั้งหมด</span>
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </main>
        <div className="pb-8 md:pb-12">
          {/* TikTok Feed Section */}
          {tiktokVideos && tiktokVideos.length > 0 && <TikTokFeed videos={tiktokVideos} />}

          {/* รีวิว Facebook 9 รีวิวจริง (โหลดเมื่อใกล้ viewport) */}
          <div id="fb-reviews-anchor" className="h-px w-full" aria-hidden="true" />
          {showFbReviews && <FacebookReviewsSection />}

          {/* Why Choose Us Section - SEO Content (extracted) */}
          <HomeAboutInline />

          {/* FAQ Section (extracted) */}
          <HomeFaqSection />
        </div>
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
      {/* End main content */}
    </div>
  );
}

// ISR - Homepage with car listings - revalidate every 5 minutes
export async function getStaticProps() {
  let cars = [];
  let brandCounts = {};
  let homeOgImage = null;
  let homeItemListJsonLd = null;
  let tiktokVideos = [];

  const carsPromise = getHomepageCars(8).catch(() => []);
  const statusesPromise = readCarStatuses().catch(() => ({}));
  const brandCountsPromise = getBrandCounts().catch(() => ({}));
  const tiktokPromise = fetch('https://rss.app/feeds/v1.1/MkPoJo3SV77U3XXe.json')
    .then(r => r.json())
    .then(d => d.items || [])
    .catch(() => []);

  const [carsRaw, carStatuses, counts, tiktokRaw] = await Promise.all([
    carsPromise,
    statusesPromise,
    brandCountsPromise,
    tiktokPromise,
  ]);

  cars = Array.isArray(carsRaw) ? carsRaw : [];
  brandCounts = counts || {};
  tiktokVideos = tiktokRaw || [];

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

  const seoMap = require('../config/seo-keyword-map.js').SEO_KEYWORD_MAP;

  return {
    props: {
      seoHomeData: seoMap.home,
      cars,
      brandCounts,
      homeOgImage,
      homeItemListJsonLd,
      tiktokVideos,
    },
    revalidate: 300, // 5 minutes - Improve TTFB frequency standard
  };
}

// trigger reload
