/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SEO from '../components/SEO.jsx';
import CarCard from '../components/CarCard';
import { getHomepageCars } from '../lib/shopify.mjs';
import A11yImage from '../components/A11yImage';
import { readCarStatusesByIds } from '../lib/carStatusStore.js';
import { mergeCarSpecs } from '../lib/mergeCarSpecs';
const EVFaq = dynamic(() => import('../components/EVFaq'), {
  loading: () => (
    <div
      className="mt-12 min-h-[480px] w-full rounded-3xl bg-gray-100 animate-pulse"
      aria-hidden="true"
    />
  ),
});
const UsedCarsChiangMaiDeferred = dynamic(() => import('../components/UsedCarsChiangMaiDeferred'), {
  loading: () => (
    <div
      className="mt-8 min-h-[600px] w-full rounded-2xl bg-gray-100 animate-pulse"
      aria-hidden="true"
    />
  ),
});

const Breadcrumb = dynamic(() => import('../components/Breadcrumb'), {
  // Breadcrumb is important for SEO rendering
  loading: () => null,
});

const SITE = 'https://www.chiangmaiusedcar.com';

// NOTE: This page must keep runtime JS enabled because the global Navbar/Footer are
// client-only (dynamic + ssr:false). Disabling runtime JS makes the mobile menu
// disappear after a full refresh.

export async function getStaticProps() {
  // Prefer ISR for performance: serve HTML from CDN and refresh periodically.

  // Server-only requires: these modules will NOT be bundled in the client JS
  const { getPriceInfo } = require('../lib/carPrice');
  const { computeSchemaAvailability } = require('../lib/carStatusUtils.js');
  const { COMMON_OFFER_EXTENSIONS } = require('../config/business.js');

  function buildChiangMaiLandingItemListJsonLd(inputCars) {
    const cars = Array.isArray(inputCars) ? inputCars : [];
    const itemListElement = cars.slice(0, 12).map((car, index) => {
      const handle = car?.handle;
      const carUrl = handle ? `${SITE}/car/${handle}` : SITE;

      const priceInfo = getPriceInfo(car?.price?.amount || 0);
      const rawImage = car?.images?.[0]?.url;
      const imageUrl = rawImage
        ? rawImage.startsWith('http')
          ? rawImage
          : `${SITE}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
        : `${SITE}/herobanner/ev-car-chiang-mai-banner.webp`;

      const title = car?.title || 'รถ EV มือสองเชียงใหม่';
      const availabilityValue = computeSchemaAvailability({
        status: car?.status,
        availableForSale: car?.availableForSale,
      });

      const offer = priceInfo.valid
        ? {
            '@type': 'Offer',
            price: priceInfo.numeric,
            priceCurrency: 'THB',
            url: carUrl,
            itemCondition: 'https://schema.org/UsedCondition',
            availability: `https://schema.org/${availabilityValue}`,
            inventoryLevel: {
              '@type': 'QuantitativeValue',
              value: availabilityValue === 'InStock' ? 1 : 0,
              unitCode: 'EA',
            },
            seller: COMMON_OFFER_EXTENSIONS.seller,
            hasMerchantReturnPolicy: COMMON_OFFER_EXTENSIONS.hasMerchantReturnPolicy,
            shippingDetails: COMMON_OFFER_EXTENSIONS.shippingDetails,
          }
        : undefined;

      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          additionalType: 'https://schema.org/Car',
          '@id': carUrl,
          name: title,
          image: imageUrl,
          url: carUrl,
          offers: offer,
        },
      };
    });

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${SITE}/ev-cars-chiang-mai#collection`,
          url: `${SITE}/ev-cars-chiang-mai`,
          inLanguage: 'th',
          dateModified: new Date().toISOString(),
          name: 'ซื้อ-ขาย ฝากขาย รถไฟฟ้า EV มือสอง เชียงใหม่-ลำพูน เจ้าของขายเอง',
          description:
            'รวมรถ EV มือสองสภาพดีในเชียงใหม่-ลำพูน พร้อมรูปจริง ราคาอัปเดต บริการฝากขายรถ EV 2 แพ็กเกจ ฟรี หรือ จอดเต็นท์ครบวงจร ให้ราคาสูงสุด ไม่โดนกดราคา',
          mainEntity: {
            '@type': 'ItemList',
            name: 'รถ EV มือสอง เชียงใหม่ แนะนำ',
            numberOfItems: itemListElement.length,
            itemListElement,
          },
        },
        {
          '@type': ['LocalBusiness', 'AutoDealer'],
          '@id': `${SITE}/#localbusiness`,
          name: 'ครูหนึ่งรถสวย',
          description:
            'ศูนย์รับซื้อ ฝากขาย รถไฟฟ้า (EV) มือสอง เชียงใหม่-ลำพูน ให้ราคาสูงสุด บริการครบวงจร',
          url: SITE,
          image: `${SITE}/logo/logo_main.png`,
          telephone: '+66940649018',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'เลขที่ 324 หมู่ 2 ถนนสมโภชเชียงใหม่ 700 ปี',
            addressLocality: 'สันพระเนตร',
            addressRegion: 'สันทราย เชียงใหม่',
            postalCode: '50210',
            addressCountry: 'TH',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 18.8049109,
            longitude: 99.0301679,
          },
          areaServed: [
            { '@type': 'City', name: 'เชียงใหม่' },
            { '@type': 'City', name: 'ลำพูน' },
          ],
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ],
              opens: '09:00',
              closes: '20:00',
            },
          ],
          sameAs: [
            'https://www.facebook.com/KN2car',
            'https://www.tiktok.com/@krunueng_usedcar',
            'https://www.youtube.com/@chiangmaiusedcar',
          ],
        },
        {
          '@type': 'FAQPage',
          '@id': `${SITE}/ev-cars-chiang-mai#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: 'ฝากขายรถ EV กับครูหนึ่งรถสวยต้องเตรียมตัวอย่างไร?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'เตรียมเล่มทะเบียนรถ บัตรประชาชนเจ้าของ และรูปถ่ายรถ EV ของท่านส่งมาทาง LINE ก่อน ทีมงานจะประเมินราคาเบื้องต้นให้ฟรี จากนั้นนัดนำรถเข้าตรวจสภาพจริงที่เต็นท์ ซึ่งรับรถ EV ทุกยี่ห้อ ไม่ว่าจะ BYD, MG, NETA, Tesla, AION, Changan, Wuling, GWM',
              },
            },
            {
              '@type': 'Question',
              name: 'รถ EV มือสองซื้อขายใช้เงินสดหรือไฟแนนซ์ได้?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'ปัจจุบันรถ EV มือสองในประเทศไทยส่วนใหญ่ยังไม่มีสถาบันการเงินรับจัดไฟแนนซ์ให้ การซื้อขายจึงเน้นเงินสดหรือโอนเงินโดยตรง ทำให้ผู้ซื้อได้ราคาที่ดีกว่าการผ่อน และผู้ขายได้รับเงินครบทันที',
              },
            },
            {
              '@type': 'Question',
              name: 'รถ EV มือสองประกันแบตเตอรี่และศูนย์รับประกันอีกหรือไม่?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'ขึ้นอยู่กับยี่ห้อและอายุรถ เช่น BYD รับประกันแบตเตอรี่ 8 ปี/150,000 กม. หากยังอยู่ในระยะ การันตีจะถ่ายโอนตาม VIN ได้ แนะนำให้ผู้ซื้อตรวจสอบ State of Health (SOH) ของแบตเตอรี่ก่อนตัดสินใจ ทีมงานช่วยตรวจสอบเบื้องต้นให้ได้',
              },
            },
            {
              '@type': 'Question',
              name: 'ฝากขายรถ EV แบบ 2 แพ็กเกจต่างกันอย่างไร?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'แพ็กเกจ 1 ลงประกาศฟรี เจ้าของยังใช้รถได้ปกติ ผู้ซื้อ-ขายนัดดูรถกันเอง แพ็กเกจ 2 ฝากจอดเต็นท์ครบวงจร ทีมงานดูแล ถ่ายคลิปรีวิว โปรโมทผ่านโซเชียลหลักล้านฟอลโลว์ เจรจา ปิดการขาย จัดการเอกสารโอนให้ครบ สัญญาเดือนต่อเดือน ไม่ผูกมัด',
              },
            },
            {
              '@type': 'Question',
              name: 'ซื้อรถ EV มือสองเชียงใหม่จาก BYD, NETA, MG หรือ Tesla ราคาประมาณเท่าไหร่?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'ราคาขึ้นอยู่กับยี่ห้อ รุ่น ปี และสภาพรถ เช่น BYD Atto 3 มือสองปี 2023-2025 ราคาประมาณ 700,000-950,000 บาท NETA V มือสองราคาประมาณ 350,000-550,000 บาท MG EP หรือ MG4 มือสองประมาณ 500,000-750,000 บาท สามารถทัก LINE ให้ทีมงานอัปเดตราคาตลาดปัจจุบันให้ได้ฟรี',
              },
            },
          ],
        },
      ],
    };
  }

  // Keep lightweight: we only need a featured set for the landing page.
  let carsRaw = [];
  let shopifyError = null;
  try {
    carsRaw = await getHomepageCars(50);
  } catch (error) {
    carsRaw = [];
    if (process.env.NODE_ENV === 'development') {
      shopifyError = error?.message || 'unknown error';
      // eslint-disable-next-line no-console
      console.error('getStaticProps(/ev-cars-chiang-mai) error:', error);
    }
  }

  let cars = Array.isArray(carsRaw) ? carsRaw : [];
  cars = cars.filter(c => {
    const title = (c.title || '').toLowerCase();

    // SEO Guard: Filter out placeholder/test listings like "พื้นที่ลงประกาศฟรี" or "ไม่มีชื่อ"
    if (title.includes('พื้นที่ลงประกาศฟรี') || title.includes('ไม่มีชื่อ')) {
      return false;
    }

    const tags = (c.tags || []).join(' ').toLowerCase();
    const fuel = ((c.fuelType || '') + ' ' + (c.fuel_type || '')).toLowerCase();

    // Explicitly exclude hybrids to prevent matching e:HEV, PHEV, Hybrid
    if (
      title.includes('hev') ||
      tags.includes('hev') ||
      fuel.includes('hev') ||
      title.includes('hybrid') ||
      tags.includes('hybrid') ||
      fuel.includes('ไฮบริด')
    ) {
      return false;
    }

    const text = title + ' ' + tags + ' ' + fuel;

    // Pure BEV text matches
    const isEv =
      text.includes(' ev ') ||
      text.includes('electric') ||
      text.includes('ไฟฟ้า') ||
      text.includes('100%');

    // Specific EV brands/models
    const isPureEvBrand =
      text.includes('byd') ||
      text.includes('tesla') ||
      text.includes('neta') ||
      text.includes('aion') ||
      text.includes('changan') ||
      text.includes('wuling') ||
      text.includes('gwm') ||
      text.includes('ora');

    const isMgEv =
      text.includes('mg4') ||
      text.includes('mg ep') ||
      text.includes('mg zs ev') ||
      text.includes('mg maxus');

    return isEv || isPureEvBrand || isMgEv;
  });
  try {
    const ids = cars.map(c => c?.id).filter(Boolean);
    const statuses = await readCarStatusesByIds(ids);
    cars = cars.map(c => {
      const id = c?.id;
      const statusFromKv = id ? statuses?.[id]?.status : undefined;
      return {
        ...c,
        status: statusFromKv || c?.status || 'available',
      };
    });
  } catch {
    // ignore KV errors; page should still render
  }

  // Reduce hydration payload: drop fields not used by this page (notably variant/metafield edges).
  cars = cars.map(c => {
    if (!c || typeof c !== 'object') return c;
    const rest = { ...c };
    delete rest.variant;

    const images = Array.isArray(rest.images)
      ? rest.images.map(img => ({
          url: img?.url,
          width: img?.width,
          height: img?.height,
          alt: img?.alt,
        }))
      : rest.images;

    return {
      ...rest,
      images,
    };
  });

  let tiktokVideos = [];
  try {
    const rawFeed = await fetch('https://rss.app/feeds/v1.1/MkPoJo3SV77U3XXe.json').then(r =>
      r.json()
    );
    tiktokVideos = rawFeed?.items || [];
  } catch (error) {
    tiktokVideos = [];
  }

  const homeOgImage = `${SITE}/api/og?src=${encodeURIComponent(
    '/herobanner/ev-car-chiang-mai-banner.webp'
  )}&w=1200&h=630`;

  const structuredData = buildChiangMaiLandingItemListJsonLd(cars);

  return {
    props: {
      seoData: {
        title:
          'ศูนย์รวม ซื้อ-ขาย ฝากขาย รถไฟฟ้า (EV) มือสอง เชียงใหม่ เจ้าของขายเอง | ครูหนึ่งรถสวย',
        description:
          'รับซื้อ-ฝากขายรถไฟฟ้า (EV) มือสอง เชียงใหม่-ลำพูน ให้ราคาสูงสุด เจ้าของขายเอง มี 2 แพลนบริการ ฟรี! หรือ จอดเต็นท์ฝากขายครบวงจร',
        keywords: [
          'รถไฟฟ้ามือสอง เชียงใหม่',
          'รถ EV มือสอง',
          'ซื้อรถไฟฟ้า เชียงใหม่',
          'ฝากขายรถ EV เชียงใหม่',
          'รถไฟฟ้าเจ้าของขายเอง',
          'BYD มือสอง เชียงใหม่',
          'Tesla มือสอง เชียงใหม่',
          'NETA มือสอง เชียงใหม่',
          'MG ZS EV มือสอง',
          'MG4 มือสอง เชียงใหม่',
          'GWM มือสอง เชียงใหม่',
          'AION มือสอง เชียงใหม่',
          'ORA มือสอง เชียงใหม่',
          'Changan EV มือสอง',
          'รถยนต์ไฟฟ้ามือสอง ลำพูน',
          'ฝากขายรถไฟฟ้า ไม่มีค่าใช้จ่าย',
        ],
      },
      cars,
      homeOgImage,
      structuredData,
      shopifyError,
      tiktokVideos,
    },
    // Refresh every 5 minutes
    revalidate: 300,
  };
}

const TikTokFeed = dynamic(() => import('../components/TikTokFeed'), {
  loading: () => <div className="min-h-[400px] w-full" aria-hidden="true" />,
});

export default function EVCarsChiangMai({
  seoData,

  cars,
  homeOgImage,
  structuredData,
  shopifyError,
  tiktokVideos,
}) {
  const safeCars = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);
  const featuredCars = useMemo(() => safeCars.slice(0, 8), [safeCars]);

  const [specByHandle, setSpecByHandle] = useState({});
  const requestedSpecHandlesRef = useRef(new Set());
  const specFetchAttemptsRef = useRef(new Map());

  // Enrich missing specs for featured cards (helps when metafields are not exposed to Storefront API).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const list = Array.isArray(featuredCars) ? featuredCars : [];
    if (list.length === 0) return;

    const needs = [];
    for (const car of list) {
      const handle = car?.handle;
      if (!handle) continue;
      if (requestedSpecHandlesRef.current.has(handle)) continue;

      const attempts = Number(specFetchAttemptsRef.current.get(handle) || 0);
      if (attempts >= 2) continue;

      const extra = specByHandle?.[handle];
      const merged = mergeCarSpecs(car, extra);

      const hasYear = merged?.year != null && String(merged.year).trim() !== '';
      const hasMileage = merged?.mileage != null && String(merged.mileage).trim() !== '';
      const hasTransmission =
        merged?.transmission != null && String(merged.transmission).trim() !== '';
      const drive =
        merged?.drivetrain ||
        merged?.drive_type ||
        merged?.driveType ||
        merged?.['drive-type'] ||
        merged?.wheel_drive ||
        merged?.wheelDrive;
      const hasDrivetrain = drive != null && String(drive).trim() !== '';
      const fuel = merged?.fuelType || merged?.fuel_type;
      const hasFuel = fuel != null && String(fuel).trim() !== '';

      if (!(hasYear && hasMileage && hasTransmission && hasDrivetrain && hasFuel)) {
        needs.push(handle);
      }
    }

    if (needs.length === 0) return;
    needs.forEach(h => {
      requestedSpecHandlesRef.current.add(h);
      specFetchAttemptsRef.current.set(h, Number(specFetchAttemptsRef.current.get(h) || 0) + 1);
    });

    const fetchSpecs = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const canonical = Array.from(new Set(needs.filter(Boolean))).sort();
        const params = new URLSearchParams({ handles: canonical.join(',') });
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

        const returned = new Set(Object.keys(data.specs || {}));
        for (const h of needs) {
          if (!returned.has(h)) requestedSpecHandlesRef.current.delete(h);
        }

        setSpecByHandle(prev => ({
          ...(prev || {}),
          ...data.specs,
        }));

        // Treat requestedSpecHandlesRef as in-flight only.
        // If specs are still incomplete (e.g. drivetrain missing), allow a limited retry.
        needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
      } catch (error) {
        needs.forEach(h => requestedSpecHandlesRef.current.delete(h));
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('Failed to fetch car specs:', error?.message);
        }
      }
    };

    fetchSpecs().catch(() => {});
  }, [featuredCars, specByHandle]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={seoData.title}
        description={seoData.description}
        url="/ev-cars-chiang-mai"
        image={homeOgImage}
        type="website"
        pageType="home"
        keywords={seoData?.keywords || []}
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'รถไฟฟ้า EV มือสอง เชียงใหม่ เจ้าของขายเอง', url: '/ev-cars-chiang-mai' },
        ]}
        structuredData={structuredData}
      />

      {process.env.NODE_ENV === 'development' && shopifyError && featuredCars.length === 0 && (
        <section
          className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-3"
          aria-label="Dev Shopify error"
        >
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-prompt">
            <div className="font-bold text-red-900">Dev: ดึงรถแนะนำจาก Shopify ไม่สำเร็จ</div>
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

      <header className="relative overflow-hidden bg-white">
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm">
            {/* aspect-[33/14] ตรงกับขนาดภาพจริง 3168×1344 — ป้องกัน CLS */}
            <div className="relative w-full aspect-[33/14]">
              {/* ใช้ <img> โดยตรงเพื่อให้ srcSet responsive ทำงานจริง (NextImage ignores custom srcSet) */}
              <img
                src="/herobanner/ev-car-chiang-mai-banner.webp"
                srcSet="/herobanner/ev-car-chiang-mai-banner-414w.webp 414w, /herobanner/ev-car-chiang-mai-banner-640w.webp 640w, /herobanner/ev-car-chiang-mai-banner-828w.webp 828w, /herobanner/ev-car-chiang-mai-banner-1024w.webp 1024w, /herobanner/ev-car-chiang-mai-banner.webp 1400w"
                sizes="100vw"
                alt="รถไฟฟ้า EV มือสอง เชียงใหม่ เจ้าของขายเอง | ครูหนึ่งรถสวย"
                fetchpriority="high"
                decoding="sync"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="relative flex justify-center mt-6 sm:mt-10 mb-4 px-4 w-full">
            <div className="w-full max-w-4xl mx-auto text-center">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary font-prompt leading-tight">
                รถไฟฟ้า <span className="text-orange-700">EV</span> มือสอง เชียงใหม่
                <br />
                เจ้าของขายเอง
                <span className="block text-gray-600 mt-2 sm:mt-3 text-lg xs:text-xl sm:text-2xl lg:text-3xl font-medium">
                  ศูนย์รับซื้อและฝากขาย ครูหนึ่งรถสวย
                </span>
              </h1>

              <p className="mt-4 sm:mt-6 text-gray-600 font-prompt leading-relaxed text-base md:text-lg font-medium max-w-2xl mx-auto">
                <span className="sm:hidden">
                  มีให้เลือกทั้งแบบ ฟรี! และ ฝากจอด
                  <br />
                </span>
                ฝากลงขายรถ EV ของท่านได้ราคาดีกว่าขายด่วน <br className="hidden md:block" />
                ทีมงานมืออาชีพดูแลจนจบขั้นตอน โอนย้ายสบายใจ
              </p>

              <div className="mt-8 flex justify-center w-full">
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#006600] hover:bg-[#005500] text-white font-prompt font-semibold tracking-wide text-lg sm:text-xl lg:text-2xl px-8 py-4 sm:px-12 sm:py-5 rounded-full shadow-[0_10px_30px_rgba(0,102,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,102,0,0.4)] transform hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto max-w-sm sm:max-w-md mx-auto"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.53 8.871 8.441 9.615.358.077.854.238 1.002.544.134.275.086.697.042.97l-.234 1.408c-.062.361-.295 1.413 1.236.768 1.53-.645 8.283-4.887 10.826-8.006 1.764-2.167 2.687-4.484 2.687-5.295z" />
                  </svg>
                  ฝากขายรถอีวี ของคุณที่นี่
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Trust Badges */}
      <section className="max-w-[1400px] mx-auto px-3 sm:px-4 mt-4" id="eeat-trust">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="font-bold text-primary text-base">ยอดผู้ติดตาม 1M+</p>
            <p className="text-sm text-gray-500 mt-1">โปรโมทให้ทั่วประเทศ</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="font-bold text-orange-700 text-base">2 แพ็กเกจโดนใจ</p>
            <p className="text-sm text-gray-500 mt-1">ลงฟรี / ฝากจอดดูแลโอนย้ายครบ</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="font-bold text-primary text-base">ซื้อขายตรง 100%</p>
            <p className="text-sm text-gray-500 mt-1">ได้ราคาดี แฟร์ทั้ง 2 ฝ่าย</p>
          </div>
        </div>
      </section>

      <Breadcrumb />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 ipadpro:px-3 py-8">
        <nav
          aria-label="ไปยังส่วนต่างๆ ของหน้า"
          className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
        >
          <div className="text-sm font-semibold text-gray-900 font-prompt">ไปยังส่วนที่ต้องการ</div>
          <div className="mt-3 flex flex-wrap gap-2 pb-2">
            <a
              href="#about"
              className="inline-flex snap-center shrink-0 items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 text-xs lg:text-[13px] xl:text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt whitespace-nowrap"
            >
              ซื้อ-ขาย/ฝากขายรถ EV
            </a>
            <a
              href="#consign-conditions"
              className="inline-flex snap-center shrink-0 items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 text-xs lg:text-[13px] xl:text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt whitespace-nowrap"
            >
              เงื่อนไขฝากขาย EV
            </a>
            <a
              href="#brands"
              className="inline-flex snap-center shrink-0 items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 text-xs lg:text-[13px] xl:text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt whitespace-nowrap"
            >
              เลือกดู EV ตามยี่ห้อ
            </a>
            <a
              href="#featured-cars"
              className="inline-flex snap-center shrink-0 items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 text-xs lg:text-[13px] xl:text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt whitespace-nowrap"
            >
              รถ EV ลงประกาศล่าสุด
            </a>
            <a
              href="#social"
              className="inline-flex snap-center shrink-0 items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 text-xs lg:text-[13px] xl:text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt whitespace-nowrap"
            >
              ติดตามบนโซเชียล
            </a>
            <a
              href="#dealer"
              className="inline-flex snap-center shrink-0 items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 text-xs lg:text-[13px] xl:text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt whitespace-nowrap"
            >
              ข้อมูลเต็นท์/ติดต่อ
            </a>
            <a
              href="#faq"
              className="inline-flex snap-center shrink-0 items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 text-xs lg:text-[13px] xl:text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt whitespace-nowrap"
            >
              คำถามที่พบบ่อย (รถ EV)
            </a>
          </div>
        </nav>

        <section
          id="brands"
          className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
            เลือกดูตามยี่ห้อ
          </h2>
          <p className="mt-2 text-gray-700 font-prompt">
            รวมรถพร้อมรูปจริง แยกตามยี่ห้อ เพื่อค้นหาได้เร็วขึ้น
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {[
              {
                slug: 'byd',
                label: 'BYD',
                gradient: 'from-[#E31837] to-[#A0001D]',
                text: 'BYD',
                shadow: 'shadow-red-500/30',
              },
              {
                slug: 'mg',
                label: 'MG',
                gradient: 'from-[#1B2D4F] to-[#0A1728]',
                text: 'MG',
                shadow: 'shadow-slate-800/30',
              },
              {
                slug: 'gwm',
                label: 'GWM',
                gradient: 'from-[#000000] to-[#333333]',
                text: 'GWM',
                shadow: 'shadow-black/20',
              },
              {
                slug: 'tesla',
                label: 'Tesla',
                gradient: 'from-[#E31937] to-[#B0001D]',
                text: 'T',
                shadow: 'shadow-red-600/30',
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white drop-shadow-md"
                  >
                    <path d="M12 2C6.48 2 2 4.02 2 6.5C2 7.7 3.32 8.76 5.37 9.53L12 21L18.63 9.53C20.68 8.76 22 7.7 22 6.5C22 4.02 17.52 2 12 2ZM12 4C16.42 4 20 5.34 20 6.5C20 7.66 16.42 9 12 9C7.58 9 4 7.66 4 6.5C4 5.34 7.58 4 12 4Z" />
                  </svg>
                ),
              },
              {
                slug: 'neta',
                label: 'NETA',
                gradient: 'from-[#00B4D8] to-[#0077B6]',
                text: 'NETA',
                shadow: 'shadow-cyan-500/30',
              },
              {
                slug: 'aion',
                label: 'AION',
                gradient: 'from-[#0A9396] to-[#005F73]',
                text: 'AION',
                shadow: 'shadow-teal-600/30',
              },
              {
                slug: 'changan',
                label: 'Changan',
                gradient: 'from-[#023E8A] to-[#03045E]',
                text: 'V',
                shadow: 'shadow-blue-800/30',
              },
              {
                slug: 'wuling',
                label: 'Wuling',
                gradient: 'from-[#D90429] to-[#9D0208]',
                text: 'W',
                shadow: 'shadow-red-800/30',
              },
            ].map(b => (
              <Link
                key={b.slug}
                href={`/ev-cars-chiang-mai-brand/${b.slug}`}
                prefetch={false}
                className={`group relative flex flex-col items-center justify-center rounded-[1.25rem] border border-gray-200/80 bg-white p-4 shadow-sm hover:shadow-xl hover:${b.shadow} hover:-translate-y-1 transition-all duration-300 overflow-hidden isolate`}
              >
                {/* 2026 Glass/Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-10 pointer-events-none transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%]" />

                {/* 3D Icon Badge */}
                <div
                  className={`w-14 h-14 mb-3 rounded-full flex items-center justify-center bg-gradient-to-br ${b.gradient} shadow-[inset_0_-3px_5px_rgba(0,0,0,0.3),0_4px_10px_rgba(0,0,0,0.15)] ring-1 ring-white/40 relative overflow-hidden`}
                >
                  {/* Top inner glow (Skeuomorphic 3D effect) */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

                  {b.icon ? (
                    b.icon
                  ) : (
                    <span className="text-white font-extrabold text-[12px] sm:text-[13px] tracking-widest z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                      {b.text}
                    </span>
                  )}
                </div>

                <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors font-prompt relative z-10">
                  {b.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="featured-cars" className="mt-8">
          {/* Keep the title in a card, but remove the big outer frame around the car grid */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
              รถลงประกาศล่าสุด (แนะนำ)
            </h2>
            <p className="text-gray-700 mt-2 font-prompt">
              คลิกที่คันที่สนใจเพื่อดูรูป/รายละเอียด/ราคา และสถานะรถ
            </p>
          </div>

          {safeCars.length > 0 ? (
            <div className="mt-4 car-grid grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
              {featuredCars.map((car, index) => {
                const handle = car?.handle;
                const extra = handle ? specByHandle?.[handle] : null;
                return (
                  <CarCard
                    key={car?.id || index}
                    car={mergeCarSpecs(car, extra)}
                    priority={index < 2}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-green-100 bg-green-50/50 p-8 text-center text-gray-700 font-prompt relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200/20 rounded-full blur-2xl"></div>
              <div className="mb-5 flex justify-center mt-2 relative z-10">
                <div className="bg-white p-4 rounded-full shadow-sm ring-4 ring-green-50">
                  <svg
                    className="w-12 h-12 text-green-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-base sm:text-lg font-semibold text-green-800 mb-2 relative z-10">
                ยังไม่มีรถ EV ลงประกาศในขณะนี้ (กำลังเตรียมอัปเดตรถเข้าใหม่)
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                สนใจเป็นคิวแรกในการส่งรถ EV เสนอราคาเต็นท์ หรือ ฝากขายกับเรา?{' '}
                <br className="hidden sm:block" />
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-green-700 font-bold hover:underline"
                >
                  ทัก LINE แชทส่งรูปรถประเมินราคาฟรีได้เลยครับ!
                </a>
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center w-full relative z-10">
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#006600] hover:bg-[#005500] text-white font-prompt font-semibold tracking-wide text-lg sm:text-xl px-6 py-3 sm:px-8 sm:py-3.5 rounded-full shadow-[0_5px_15px_rgba(0,102,0,0.4)] hover:shadow-[0_10px_25px_rgba(0,102,0,0.5)] transform hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto max-w-sm mx-auto"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.53 8.871 8.441 9.615.358.077.854.238 1.002.544.134.275.086.697.042.97l-.234 1.408c-.062.361-.295 1.413 1.236.768 1.53-.645 8.283-4.887 10.826-8.006 1.764-2.167 2.687-4.484 2.687-5.295z" />
              </svg>
              ฝากขายรถอีวี ของคุณที่นี่
            </a>
          </div>
        </section>

        <section
          id="about"
          className="mt-8 mb-8 bg-blue-50/40 rounded-2xl border border-blue-100 p-5 sm:p-6"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary font-prompt leading-snug">
            บริการฝากขายรถ <span className="text-orange-700">EV</span> เชียงใหม่-ลำพูน{' '}
            <br className="hidden md:block" />
            <span className="text-gray-800 text-lg sm:text-xl lg:text-2xl mt-1 block">
              เราเป็นตัวกลางจัดการให้ครบ จบทุกขั้นตอน
            </span>
          </h2>
          <div className="mt-4 sm:mt-5 space-y-4 sm:space-y-5 text-gray-800 font-prompt leading-relaxed text-sm sm:text-base">
            <p>
              หน้านี้เป็นบริการ “ซื้อ-ขาย ฝากขาย รถไฟฟ้า (EV) มือสอง” ในจังหวัดเชียงใหม่-ลำพูน
              ด้วยเครือข่ายผู้ติดตามหลักล้านในทุกช่องทางของเรา เราช่วยให้เจ้าของรถ EV ได้ขายรถใน{' '}
              <strong>ราคาที่พอใจ แบบไม่โดนกดราคา</strong>
              และตอบโจทย์ลูกค้าที่กำลังมองหารถ EV มือสองคุณภาพดี
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
              {/* Package 1 */}
              <div className="p-5 sm:p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  แพ็กเกจ 1: ลงประกาศฟรี
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-[13px] border border-green-200 ml-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    ฟรี
                  </span>
                </h3>
                <ul className="space-y-3 mb-4 flex-grow">
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-700 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700">
                      <strong>เหมาะสำหรับ:</strong> คนที่ยังใช้รถอยู่ แต่เปิดโอกาสขาย
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-700 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700">
                      <strong>สิ่งที่เราทำให้:</strong> ตรวจสอบข้อมูลเบื้องต้น
                      และนำขึ้นประกาศบนเว็บไซต์ให้ฟรี!
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-700 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700">
                      <strong>เงื่อนไข:</strong> ผู้ซื้อและผู้ขาย นัดดูรถและตกลงกันเองโดยตรง
                    </span>
                  </li>
                </ul>
              </div>

              {/* Package 2 */}
              <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/80 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all flex flex-col h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-orange-700 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm flex items-center gap-1.5 z-10">
                  แนะนำ
                  <svg
                    className="w-3.5 h-3.5 text-yellow-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 relative z-10 flex items-center flex-wrap gap-x-2">
                  แพ็กเกจ 2: ฝากขายจอดเต็นท์
                  <span className="text-orange-700 text-[15px] bg-white/70 px-2 py-0.5 rounded-md border border-orange-200 flex items-center gap-1 shadow-sm shrink-0">
                    <svg
                      className="w-4 h-4 text-orange-700"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    ครบวงจร
                  </span>
                </h3>
                <ul className="space-y-3 mb-4 flex-grow relative z-10">
                  <li className="flex items-start gap-2.5 group-hover:block-none">
                    <span className="text-blue-600 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(37,99,235,0.2)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-800">
                      <strong>เหมาะสำหรับ:</strong> คนที่ไม่มีเวลาจัดการ จอดรถทิ้งไว้ได้
                      อยากขายออกไวชัวร์ๆ
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-600 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(37,99,235,0.2)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-800">
                      <strong>การโปรโมท:</strong> ทีมงานถ่ายทำคลิปรีวิวจัดเต็ม
                      โปรโมทผ่านทุกช่องทางโซเชียล (ผู้ติดตามหลักล้าน) ยกเว้นไม่เสียค่ารถแห่
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-600 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(37,99,235,0.2)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-800">
                      <strong>ความสะดวก:</strong> เราเป็นตัวกลางช่วยเจรจา ปิดการขาย (เน้นเงินสด
                      เนื่องจากรถ EV มือสองยังไม่มีไฟแนนซ์รองรับ) และจัดการเอกสารโอนให้ทั้งหมด
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-blue-600 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(37,99,235,0.2)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-800">
                      <strong>ยืดหยุ่นสูง:</strong> สัญญาเดือนต่อเดือน ขายไม่ออก/เปลี่ยนใจ
                      นำรถกลับได้ ไม่ผูกมัด!
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-gray-600 italic mt-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
              * โปรดทราบ: รถทุกคันเป็นการซื้อขายโดยตรง (Direct Sale)
              เพื่อให้ได้ราคาดีที่สุดทั้งสองฝ่าย ทางเราช่วยอำนวยความสะดวกด้านข้อมูลและเอกสาร
              แนะนำให้ผู้ซื้อประเมิน แบตเตอรี่, ประกันศูนย์ และทดลองขับด้วยตนเอง
              เพื่อความสบายใจสูงสุดก่อนทำสัญญา (ไม่มีการรับประกันจากทางเต็นท์)
            </p>
          </div>
        </section>

        <UsedCarsChiangMaiDeferred hideFaq={true} />

        {/* TikTok Feed Section */}
        {tiktokVideos && tiktokVideos.length > 0 && <TikTokFeed videos={tiktokVideos} />}

        {/* EV FAQ Section placed after TikTok as requested */}
        <EVFaq />
      </main>

      {/* Floating LINE CTA for mobile conversion */}
      <div className="fixed bottom-[80px] right-4 z-50 md:hidden pb-[env(safe-area-inset-bottom,0px)]">
        <a
          href="https://lin.ee/8ugfzstD"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#06c755] text-white shadow-2xl hover:scale-110 transition-transform active:scale-[0.97] active:opacity-[0.85]"
          aria-label="ปรึกษาฟรีทาง LINE"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </a>
      </div>
    </div>
  );
}
