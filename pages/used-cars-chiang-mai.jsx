/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Head from 'next/head';
import SEO from '../components/SEO.jsx';
import CarCard from '../components/CarCard';
import { getHomepageCars } from '../lib/shopify.mjs';
import A11yImage from '../components/A11yImage';
import { readCarStatusesByIds } from '../lib/carStatusStore.js';
import { mergeCarSpecs } from '../lib/mergeCarSpecs';
const UsedCarsChiangMaiDeferred = dynamic(() => import('../components/UsedCarsChiangMaiDeferred'));

const Breadcrumb = dynamic(() => import('../components/Breadcrumb'), {
  ssr: false,
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
        : `${SITE}/herobanner/outdoorbanner-1024w.webp`;

      const title = car?.title || 'รถมือสองเชียงใหม่';
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
          '@id': `${SITE}/used-cars-chiang-mai#collection`,
          url: `${SITE}/used-cars-chiang-mai`,
          name: 'ซื้อ-ขาย รถบ้านมือสอง เชียงใหม่-ลำพูน',
          description:
            'รวมรถบ้านมือสองสภาพดีในเชียงใหม่-ลำพูน พร้อมรูปจริง ราคาอัปเดต และบริการฝากขายรถแบบมืออาชีพ',
          mainEntity: {
            '@type': 'ItemList',
            name: 'รถมือสองเชียงใหม่แนะนำ',
            numberOfItems: itemListElement.length,
            itemListElement,
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${SITE}/used-cars-chiang-mai#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: 'ฝากขายรถกับครูหนึ่งรถสวยมีเงื่อนไขอะไรบ้าง?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'เพื่อคัดสภาพให้ได้ตามมาตรฐาน รถที่รับฝากขายจะเน้นรถมือเดียว ไม่มีอุบัติเหตุหนัก/ไม่จมน้ำ มีประวัติดูแลบำรุงรักษาดี เครื่องยนต์/เกียร์/เล่มทะเบียนไม่มีปัญหา โดยสามารถนัดหมายนำรถเข้ามาตรวจสภาพที่เต็นท์ได้ทุกวัน',
              },
            },
            {
              '@type': 'Question',
              name: 'ฝากขายต้องเอารถมาจอดที่เต็นท์ไหม?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'ไม่จำเป็นต้องเอารถมาจอดไว้ที่เต็นท์ตลอดเวลา โดยส่วนใหญ่คุณยังสามารถใช้รถตามปกติได้ และนัดหมายตามขั้นตอนที่ทีมงานแจ้งเพื่อความสะดวกในการขาย',
              },
            },
            {
              '@type': 'Question',
              name: 'นัดตรวจสภาพและตั้งราคาฝากขายทำอย่างไร?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'นัดหมายล่วงหน้าแล้วนำรถเข้ามาตรวจสภาพที่เต็นท์ได้ทุกวัน หลังตรวจสภาพ ทีมงานจะช่วยประเมินและตั้งราคาให้ใกล้เคียงราคาตลาดมากที่สุดตามสภาพจริงของรถ',
              },
            },
            {
              '@type': 'Question',
              name: 'ต้องเตรียมเอกสารอะไรบ้างสำหรับฝากขาย/ซื้อขาย?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'โดยทั่วไปแนะนำเตรียมเล่มทะเบียน/เอกสารรถที่เกี่ยวข้อง บัตรประชาชนผู้ขาย และข้อมูลการดูแลบำรุงรักษา (ถ้ามี) รายการเอกสารอาจแตกต่างตามกรณี สามารถทัก LINE เพื่อให้ทีมงานเช็คให้ได้ก่อนนัดหมาย',
              },
            },
            {
              '@type': 'Question',
              name: 'มีบริการส่งรถต่างจังหวัด หรือช่วยดูรถแบบออนไลน์ไหม?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'มีบริการประสานงานจัดส่งรถ (ขึ้นอยู่กับเงื่อนไข) และสามารถช่วยสรุปข้อมูล/รูป/วิดีโอประกอบการตัดสินใจ พร้อมดูแลเอกสารให้ครบก่อนส่งมอบ',
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
    carsRaw = await getHomepageCars(12);
  } catch (error) {
    carsRaw = [];
    if (process.env.NODE_ENV === 'development') {
      shopifyError = error?.message || 'unknown error';
      // eslint-disable-next-line no-console
      console.error('getStaticProps(/used-cars-chiang-mai) error:', error);
    }
  }

  let cars = Array.isArray(carsRaw) ? carsRaw : [];
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

  const homeOgImage = `${SITE}/api/og?src=${encodeURIComponent(
    '/herobanner/outdoorbanner.webp'
  )}&w=1200&h=630`;

  const structuredData = buildChiangMaiLandingItemListJsonLd(cars);

  return {
    props: {
      cars,
      homeOgImage,
      structuredData,
      shopifyError,
    },
    // Refresh every 5 minutes
    revalidate: 300,
  };
}

export default function UsedCarsChiangMai({ cars, homeOgImage, structuredData, shopifyError }) {
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
      <Head>
        <link
          rel="preload"
          as="image"
          href="/herobanner/outdoorbanner-828w.webp"
          imageSrcSet="/herobanner/outdoorbanner-480w.webp 480w, /herobanner/outdoorbanner-640w.webp 640w, /herobanner/outdoorbanner-828w.webp 828w, /herobanner/outdoorbanner-1024w.webp 1024w, /herobanner/outdoorbanner-1280w.webp 1280w, /herobanner/outdoorbanner-1400w.webp 1400w"
          imageSizes="(max-width: 1024px) 100vw, 1400px"
          media="(max-width: 1024px)"
        />
      </Head>
      <SEO
        title="ซื้อ-ขาย รถบ้านมือสอง เชียงใหม่-ลำพูน | ฝากขายรถ ขายง่าย ขายเร็ว | ครูหนึ่งรถสวย"
        url="/used-cars-chiang-mai"
        image={homeOgImage}
        type="website"
        pageType="home"
        keywords={[
          'รถมือสองเชียงใหม่',
          'รถบ้านมือสองเชียงใหม่',
          'ฝากขายรถเชียงใหม่',
          'ฝากขายรถลำพูน',
          'รับฝากขายรถ',
          'ขายรถบ้านเชียงใหม่',
          'เต็นท์รถมือสองเชียงใหม่',
          'ฝากขายรถไม่ต้องเอารถมาจอด',
        ]}
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'ซื้อ-ขาย รถบ้านมือสอง เชียงใหม่-ลำพูน', url: '/used-cars-chiang-mai' },
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
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-200">
            {/* Make hero taller on small screens so overlay + CTAs never clip inside the rounded container */}
            <div className="relative w-full aspect-[16/10] xs:aspect-[16/9] sm:aspect-[1920/800]">
              <A11yImage
                src="/herobanner/outdoorbanner-1024w.webp"
                srcSet="/herobanner/outdoorbanner-480w.webp 480w, /herobanner/outdoorbanner-640w.webp 640w, /herobanner/outdoorbanner-828w.webp 828w, /herobanner/outdoorbanner-1024w.webp 1024w, /herobanner/outdoorbanner-1280w.webp 1280w, /herobanner/outdoorbanner-1400w.webp 1400w"
                sizes="(max-width: 1400px) 100vw, 1400px"
                alt="รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย"
                aspectRatio="1920/800"
                priority
                decoding="async"
                imageType="hero"
                optimizeImage={false}
                className="block w-full h-full object-contain object-top"
              />
            </div>

            {/* On mobile: show CTA box below the image so nothing blocks the hero.
                On sm+: keep it overlayed like the original design. */}
            <div className="relative flex justify-center p-3 xs:p-4 sm:absolute sm:inset-0 sm:items-center sm:justify-center sm:p-6">
              <div className="w-full max-w-6xl mx-auto">
                <div className="mx-auto w-full max-w-[22rem] xs:max-w-sm sm:w-auto sm:max-w-2xl rounded-2xl bg-black/65 sm:bg-black/70 sm:backdrop-blur-md ring-1 ring-white/30 px-3 xs:px-4 sm:px-6 py-3 xs:py-3.5 sm:py-5 shadow-2xl">
                  <h1
                    className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-extrabold text-white font-prompt text-center leading-tight"
                    style={{
                      WebkitTextStroke: '0.6px rgba(0,0,0,0.85)',
                      textShadow:
                        '0 4px 14px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.95), 0 0 1px rgba(0,0,0,1)',
                    }}
                  >
                    ซื้อ-ขาย รถบ้านมือสอง เชียงใหม่-ลำพูน
                  </h1>
                  <p className="mt-1.5 xs:mt-2 sm:mt-3 text-white font-prompt leading-relaxed text-center text-sm sm:text-base font-semibold">
                    <span className="sm:hidden">หารถมือสองสภาพดี หรือฝากขายรถแบบมืออาชีพ</span>
                    <span className="hidden sm:inline">
                      หารถมือสองสภาพดีไว้ใช้งาน หรือฝากลงขายรถของท่านได้ราคาดีกว่าขายด่วน —
                      ทีมงานมืออาชีพดูแลจนจบขั้นตอน ซื้อขายสบายใจ
                    </span>
                  </p>
                  <div className="mt-3 xs:mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 xs:gap-3 justify-center">
                    <Link
                      href="/all-cars"
                      prefetch={false}
                      className="btn-hero-primary text-center w-full sm:w-auto max-w-full px-3 py-1.5 xs:py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm lg:text-base hover:scale-100"
                    >
                      ดูรถทั้งหมด
                    </Link>
                    <a
                      href="https://lin.ee/8ugfzstD"
                      className="btn-hero-secondary text-center w-full sm:w-auto max-w-full px-3 py-1.5 xs:py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 text-xs sm:text-sm lg:text-base hover:scale-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ปรึกษาฟรีทาง LINE
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Breadcrumb />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 ipadpro:px-3 py-8">
        <nav
          aria-label="ไปยังส่วนต่างๆ ของหน้า"
          className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
        >
          <div className="text-sm font-semibold text-gray-900 font-prompt">ไปยังส่วนที่ต้องการ</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt"
            >
              ซื้อ-ขาย/ฝากขาย
            </a>
            <a
              href="#consign-conditions"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt"
            >
              เงื่อนไขฝากขาย
            </a>
            <a
              href="#brands"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt"
            >
              เลือกดูตามยี่ห้อ
            </a>
            <a
              href="#featured-cars"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt"
            >
              รถลงประกาศล่าสุด
            </a>
            <a
              href="#social"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt"
            >
              ติดตามบนโซเชียล
            </a>
            <a
              href="#dealer"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt"
            >
              ข้อมูลเต็นท์/ติดต่อ
            </a>
            <a
              href="#faq"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt"
            >
              คำถามที่พบบ่อย
            </a>
            <Link
              href="/all-cars"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors font-prompt"
            >
              ดูรถทั้งหมด
            </Link>
          </div>
        </nav>

        <section id="about" className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
            ซื้อ-ขาย รถบ้านมือสอง ในเชียงใหม่-ลำพูน (ฝากขายได้)
          </h2>
          <div className="mt-3 space-y-3 text-gray-800 font-prompt leading-relaxed">
            <p>
              หน้านี้เป็นบริการ “ซื้อ-ขาย รถบ้านมือสอง” ในจังหวัดเชียงใหม่-ลำพูน — ไม่ว่าจะหา{' '}
              <Link
                href="/all-cars"
                prefetch={false}
                className="text-primary font-semibold hover:underline"
              >
                รถมือสองเชียงใหม่
              </Link>{' '}
              สภาพดีไว้ใช้งาน หรือ{' '}
              <Link
                href="/sell-car"
                prefetch={false}
                className="text-primary font-semibold hover:underline"
              >
                ฝากขายรถเชียงใหม่
              </Link>{' '}
              เราดูแลให้ครบจนจบขั้นตอนซื้อขาย
            </p>
            <p>
              ฝากขายกับ “ครูหนึ่งรถสวย” ได้ราคาสูงกว่าขายด่วนเข้าเต็นท์โดยตรงในหลายกรณี
              และไม่ต้องเอารถมาจอดไว้ที่ร้าน คุณยังสามารถใช้รถตามปกติได้เลย ขายผ่านทีมงานมืออาชีพ
              ขายง่าย ขายเร็ว ไม่ต้องปวดหัวรับสาย/นัดดูรถที่บ้านเอง
            </p>
            <p>
              ทางเราดำเนินการให้จนจบขั้นตอนซื้อขาย รับเงินกลับบ้านสบายใจ
              เพราะมีลูกค้ารอซื้อทั่วประเทศ และมีผู้ติดตามจากทุกช่องทางหลักแสน-หลักล้าน
              ซื้อขายทั่วประเทศมายาวนานมากกว่า 10 ปี
            </p>
            <p className="text-gray-700">
              เหมาะสำหรับคนที่ “ไม่รีบขายเข้าเต็นท์” อยากได้ราคาที่ใกล้เคียงราคาตลาดมากที่สุด
              และอยากให้ทีมงานช่วยดูแลแทนแบบมืออาชีพ
            </p>
          </div>

          <div
            id="consign-conditions"
            className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-prompt">
              เงื่อนไขการฝากขายรถกับครูหนึ่งรถสวย (เพื่อคัดสภาพให้ได้ตามมาตรฐาน)
            </h3>
            <p className="mt-2 text-gray-700 font-prompt leading-relaxed">
              ลูกค้าที่ซื้อรถกับครูหนึ่งรถสวยจากทั่วประเทศจำนวนมากตัดสินใจจากความไว้วางใจสูง
              เราจึงต้องคัดสภาพรถทุกคันให้ได้ตามมาตรฐาน หากรถของท่านมีสภาพตามนี้
              สามารถนัดหมายนำรถเข้ามาตรวจสภาพที่เต็นท์ได้ทุกวัน
            </p>

            <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-800 font-prompt">
              <li>รถมือเดียว</li>
              <li>ไม่มีอุบัติเหตุหนัก และไม่จมน้ำ 100%</li>
              <li>มีประวัติดูแลบำรุงรักษามาเป็นอย่างดี</li>
              <li>เครื่องยนต์และเกียร์ไม่มีปัญหา</li>
              <li>เล่มทะเบียนไม่มีปัญหา</li>
            </ul>

            <div className="mt-4 space-y-2 text-gray-700 font-prompt leading-relaxed">
              <p>
                หลังจากตรวจสภาพแล้ว ทีมงานจะช่วยตั้งราคาให้ใกล้เคียงราคาตลาดมากที่สุด
                เพื่อให้ท่านขายได้คุ้ม ไม่ต้องขาดทุนเป็นแสนเหมือนขายด่วน และได้ราคาที่ยิ้มได้แน่นอน
              </p>
              <p className="text-sm text-gray-600">
                หมายเหตุ: ผลการประเมินขึ้นอยู่กับสภาพจริงและเอกสารประกอบของรถแต่ละคัน
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
            <Link href="/sell-car" prefetch={false} className="btn-primary text-center">
              ฝากขายรถกับครูหนึ่ง
            </Link>
            <Link
              href="/all-cars"
              prefetch={false}
              className="btn-secondary text-center rounded-xl px-4 py-2"
            >
              หารถมือสองสภาพดี
            </Link>
            <Link
              href="/contact"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors font-prompt"
            >
              ติดต่อทีมงาน
            </Link>
          </div>
        </section>

        <section
          id="brands"
          className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
            เลือกดูตามยี่ห้อ
          </h2>
          <p className="mt-2 text-gray-700 font-prompt">
            รวมรถพร้อมรูปจริง แยกตามยี่ห้อ เพื่อค้นหาได้เร็วขึ้น หรือ{' '}
            <Link
              href="/all-cars"
              prefetch={false}
              className="text-primary hover:underline font-semibold"
            >
              ดูรถทั้งหมด
            </Link>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { slug: 'toyota', label: 'Toyota' },
              { slug: 'honda', label: 'Honda' },
              { slug: 'isuzu', label: 'Isuzu' },
              { slug: 'nissan', label: 'Nissan' },
              { slug: 'mazda', label: 'Mazda' },
              { slug: 'mitsubishi', label: 'Mitsubishi' },
              { slug: 'ford', label: 'Ford' },
            ].map(b => (
              <Link
                key={b.slug}
                href={`/used-cars-chiang-mai-brand/${b.slug}`}
                prefetch={false}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-primary hover:text-primary transition-colors font-prompt"
              >
                {b.label}
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
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 font-prompt">
              ตอนนี้ยังไม่มีรถแนะนำให้แสดง (อาจเกิดจากการเชื่อมต่อข้อมูลชั่วคราว) — ไปที่{' '}
              <Link
                href="/all-cars"
                prefetch={false}
                className="text-primary font-semibold hover:underline"
              >
                ดูรถทั้งหมด
              </Link>{' '}
              หรือ{' '}
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                ทัก LINE
              </a>{' '}
              เพื่อให้ช่วยแนะนำรุ่นที่ตรงงบได้เลย
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link href="/all-cars" prefetch={false} className="btn-primary text-center">
              ดูรถทั้งหมดในสต็อก
            </Link>
          </div>
        </section>

        <UsedCarsChiangMaiDeferred />
      </main>

      {/* Floating LINE CTA for mobile conversion */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <a
          href="https://lin.ee/8ugfzstD"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#06c755] text-white shadow-2xl hover:scale-110 transition-transform"
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
