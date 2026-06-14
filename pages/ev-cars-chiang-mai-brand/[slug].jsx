/* eslint-disable @next/next/no-img-element */

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO.jsx';
import CarCard from '../../components/CarCard';
import { getHomepageCars } from '../../lib/shopify.mjs';
import { readCarStatusesByIds } from '../../lib/carStatusStore.js';
import { computeSchemaAvailability } from '../../lib/carStatusUtils.js';
import { COMMON_OFFER_EXTENSIONS } from '../../config/business';
import { getPriceInfo } from '../../lib/carPrice';

const Breadcrumb = dynamic(() => import('../../components/Breadcrumb'), {
  loading: () => null,
});

const SITE = 'https://www.chiangmaiusedcar.com';

const BRAND_CONFIG = {
  byd: {
    label: 'BYD',
    tokens: ['byd'],
    gradient: 'from-[#E31837] to-[#A0001D]',
    text: 'BYD',
  },
  mg: {
    label: 'MG',
    tokens: ['mg4', 'mg ep', 'mg zs ev', 'mg maxus'],
    gradient: 'from-[#1B2D4F] to-[#0A1728]',
    text: 'MG',
  },
  gwm: {
    label: 'GWM',
    tokens: ['gwm', 'ora'],
    gradient: 'from-[#000000] to-[#333333]',
    text: 'GWM',
  },
  tesla: {
    label: 'Tesla',
    tokens: ['tesla'],
    gradient: 'from-[#E31937] to-[#B0001D]',
    text: 'Tesla',
  },
  neta: {
    label: 'NETA',
    tokens: ['neta'],
    gradient: 'from-[#00B4D8] to-[#0077B6]',
    text: 'NETA',
  },
  aion: {
    label: 'AION',
    tokens: ['aion'],
    gradient: 'from-[#0A9396] to-[#005F73]',
    text: 'AION',
  },
  changan: {
    label: 'Changan',
    tokens: ['changan'],
    gradient: 'from-[#023E8A] to-[#03045E]',
    text: 'Changan',
  },
  wuling: {
    label: 'Wuling',
    tokens: ['wuling'],
    gradient: 'from-[#D90429] to-[#9D0208]',
    text: 'Wuling',
  },
};

const BRAND_DESCRIPTIONS = {
  byd: 'BYD (Build Your Dreams) แบรนด์รถยนต์ไฟฟ้าอันดับ 1 ของโลกจากจีน มีชื่อเสียงด้านแบตเตอรี่ Blade Battery ที่ปลอดภัยและทนทานสูง รุ่นยอดนิยมในตลาดมือสอง ได้แก่ BYD Atto 3, BYD Dolphin, BYD Seal, BYD Han และ BYD Atto รับประกันแบตเตอรี่ 8 ปี/150,000 กม. ซึ่งสามารถถ่ายโอนตาม VIN ได้ เป็นทางเลือกที่คุ้มค่าสำหรับผู้ที่ต้องการรถ EV มือสองในเชียงใหม่',
  mg: 'MG (Morris Garages) แบรนด์อังกฤษที่ปัจจุบันผลิตโดย SAIC Motor จากจีน มีรถ EV รุ่นยอดนิยม ได้แก่ MG ZS EV, MG4, MG EP และ MG Maxus ขึ้นชื่อเรื่องดีไซน์หรูหรา ระบบความปลอดภัยครบครัน และราคาที่เข้าถึงได้ง่าย เหมาะสำหรับผู้เริ่มต้นใช้รถ EV มือสองในเชียงใหม่ที่ต้องการความคุ้มค่า',
  gwm: 'GWM (Great Wall Motor) และ ORA แบรนด์ลูกของ GWM ผู้ผลิตรถยนต์ไฟฟ้าจากจีนที่กำลังขยายตัวอย่างรวดเร็ว รถ EV ยอดนิยม ได้แก่ ORA Good Cat, ORA Funky Cat และรุ่น GWM EV ต่างๆ โดดเด่นด้านดีไซน์ Retro-futuristic สุดน่ารัก และเทคโนโลยีขับขี่ที่ทันสมัย เหมาะสำหรับคนรุ่นใหม่ในเชียงใหม่',
  tesla:
    'Tesla แบรนด์รถยนต์ไฟฟ้าพรีเมียมระดับโลกจากอเมริกา ขึ้นชื่อเรื่องระยะทางต่อการชาร์จสูง อัปเดต OTA ได้ Autopilot ขั้นสูง และเครือข่าย Supercharger ทั่วโลก รุ่นยอดนิยมในตลาดมือสองคือ Tesla Model 3 และ Model Y ราคาสูงแต่คุ้มค่าสำหรับผู้ที่ต้องการประสบการณ์ EV ระดับพรีเมียมในเชียงใหม่',
  neta: 'NETA (Hozon Auto) แบรนด์รถยนต์ไฟฟ้าจากจีนที่เน้นความคุ้มค่าและราคาเข้าถึงง่าย รุ่นยอดนิยมได้แก่ NETA V, NETA V Pro และ NETA U เป็นตัวเลือกที่ดีสำหรับผู้ที่ต้องการเริ่มต้นใช้รถ EV มือสองในเชียงใหม่ด้วยงบประมาณที่ไม่สูงมาก แต่ยังได้รถที่มีคุณสมบัติครบถ้วนสำหรับการใช้งานในเมือง',
  aion: 'AION (GAC Aion) แบรนด์รถยนต์ไฟฟ้าจาก GAC Group จีน ขึ้นชื่อเรื่องเทคโนโลยีแบตเตอรี่ Magazine Battery ที่ปลอดภัย ระบบชาร์จเร็ว Super Fast Charge รุ่นยอดนิยม ได้แก่ AION Y, AION S และ AION V ดีไซน์ทันสมัย พื้นที่ภายในกว้างขวาง เหมาะสำหรับครอบครัวในเชียงใหม่ที่ต้องการรถ EV มือสองคุณภาพดี',
  changan:
    'Changan (ฉางอัน) แบรนด์รถยนต์รายใหญ่จากจีนที่มีประวัติยาวนานกว่า 160 ปี มีรถ EV รุ่นยอดนิยม เช่น Changan Uni-T EV และรุ่น BEV ต่างๆ โดดเด่นด้านคุณภาพการผลิตและงานดีไซน์ที่ทันสมัย เป็นทางเลือกที่น่าสนใจสำหรับผู้ที่ต้องการรถ EV มือสองในเชียงใหม่ที่แตกต่างจากแบรนด์กระแสหลัก',
  wuling:
    'Wuling (อู่หลิง) แบรนด์ร่วมทุนระหว่าง GM และ SAIC ที่มีชื่อเสียงระดับโลกจาก Wuling Air EV รถไฟฟ้าขนาดเล็กราคาประหยัดที่ขายดีที่สุดในโลก เหมาะสำหรับการใช้งานในเมืองเชียงใหม่ ประหยัดพลังงาน จอดง่าย ค่าบำรุงรักษาต่ำ เป็นตัวเลือกที่น่าสนใจสำหรับผู้ที่ต้องการรถ EV มือสองราคาเข้าถึงง่าย',
};

function normalizeBrandSlug(input) {
  const raw = String(input || '')
    .trim()
    .toLowerCase();
  return raw.replace(/[^a-z0-9-]/g, '');
}

function getBrandInfo(slug) {
  const key = normalizeBrandSlug(slug);
  const config = BRAND_CONFIG[key];
  if (!config) return null;
  return { slug: key, ...config };
}

/** Filter a car array to only pure BEV (no hybrids), replicating the main EV page logic */
function filterEvCars(cars) {
  return cars.filter(c => {
    const title = (c.title || '').toLowerCase();

    // SEO Guard: Filter out placeholder/test listings
    if (title.includes('พื้นที่ลงประกาศฟรี') || title.includes('ไม่มีชื่อ')) {
      return false;
    }

    const tags = (c.tags || []).join(' ').toLowerCase();
    const fuel = ((c.fuelType || '') + ' ' + (c.fuel_type || '')).toLowerCase();

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
    const isEv =
      text.includes(' ev ') ||
      text.includes('electric') ||
      text.includes('ไฟฟ้า') ||
      text.includes('100%');
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
}

function buildBrandFaqEntries(brandLabel) {
  const safeLabel = String(brandLabel || '').trim() || 'รถ EV มือสอง';
  return [
    {
      question: `รถ EV มือสอง ${safeLabel} เชียงใหม่ มีรุ่นอะไรบ้าง?`,
      answer: `ดูรายการรถที่อยู่ในหน้านี้ได้เลย (อัปเดตตามสต็อกจริง) คลิกแต่ละคันเพื่อดูรูป/รายละเอียด/ราคา และสถานะรถ หากยังไม่มีสต็อกในขณะนี้ สามารถทัก LINE เพื่อให้ทีมงานแจ้งเมื่อมีรถ ${safeLabel} เข้าใหม่`,
    },
    {
      question: `ฝากขายรถ EV ${safeLabel} กับครูหนึ่งรถสวยต้องทำยังไง?`,
      answer:
        'ส่งรูปรถ + เลขไมล์ + ปีรถ มาทาง LINE ทีมงานจะประเมินราคาเบื้องต้นให้ฟรีภายใน 24 ชั่วโมง จากนั้นเลือกได้ว่าจะลงประกาศฟรี (เจ้าของยังใช้รถอยู่) หรือฝากจอดเต็นท์แบบครบวงจร',
    },
    {
      question: `รถ EV ${safeLabel} มือสองยังอยู่ในประกันแบตเตอรี่ไหม?`,
      answer:
        'ขึ้นอยู่กับปีรถและระยะทาง แนะนำให้ตรวจสอบ State of Health (SOH) ของแบตเตอรี่และเช็คประกันศูนย์ก่อนซื้อ ทีมงานช่วยประสานตรวจสอบเบื้องต้นให้ได้ ทัก LINE สอบถามได้เลย',
    },
  ];
}

function buildStructuredData({ brandInfo, cars }) {
  const safeCars = Array.isArray(cars) ? cars : [];
  const pageUrl = `${SITE}/ev-cars-chiang-mai-brand/${brandInfo.slug}`;

  const listItems = safeCars.slice(0, 12).map((car, index) => {
    const handle = car?.handle;
    const carUrl = handle ? `${SITE}/car/${handle}` : `${SITE}/ev-cars-chiang-mai`;
    const priceInfo = getPriceInfo(car?.price?.amount || 0, { allowZero: false });
    const rawImage = car?.images?.[0]?.url;
    const imageUrl = rawImage
      ? rawImage.startsWith('http')
        ? rawImage
        : `${SITE}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
      : `${SITE}/herobanner/ev-car-chiang-mai-banner.webp`;
    const title = car?.title || `รถ EV มือสอง ${brandInfo.label} เชียงใหม่`;
    const availabilityValue = computeSchemaAvailability({
      status: car?.status,
      availableForSale: car?.availableForSale,
    });

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
        brand: { '@type': 'Brand', name: brandInfo.label },
        offers: {
          '@type': 'Offer',
          price: priceInfo.numeric || '0',
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
        },
      },
    };
  });

  const faqs = buildBrandFaqEntries(brandInfo.label);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        url: pageUrl,
        inLanguage: 'th',
        name: `รถ EV มือสอง ${brandInfo.label} เชียงใหม่ เจ้าของขายเอง`,
        description: `รวมรถไฟฟ้า EV มือสอง ${brandInfo.label} สภาพดี ราคาอัปเดต ในเชียงใหม่-ลำพูน บริการฝากขายรถ EV 2 แพ็กเกจ ฟรี หรือ จอดเต็นท์ครบวงจร`,
        mainEntity: {
          '@type': 'ItemList',
          name: `รถ EV มือสอง ${brandInfo.label} เชียงใหม่`,
          numberOfItems: listItems.length,
          itemListElement: listItems,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        url: pageUrl,
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(BRAND_CONFIG).map(slug => ({
      params: { slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const brandInfo = getBrandInfo(params?.slug);
  if (!brandInfo) return { notFound: true };

  let cars = [];
  try {
    const carsRaw = await getHomepageCars(100);
    const allCars = Array.isArray(carsRaw) ? carsRaw : [];

    // 1. Apply EV filter (pure BEV only, no hybrids)
    const evCars = filterEvCars(allCars);

    // 2. Filter by brand tokens
    const tokens = brandInfo.tokens;
    cars = evCars.filter(car => {
      const hay =
        `${car?.vendor || ''} ${car?.brand || ''} ${car?.title || ''} ${(car?.tags || []).join(' ')}`.toLowerCase();
      return tokens.some(t => hay.includes(t));
    });

    // 3. Enrich with KV statuses
    const ids = cars.map(c => c?.id).filter(Boolean);
    if (ids.length > 0) {
      try {
        const statuses = await readCarStatusesByIds(ids);
        cars = cars.map(c => ({
          ...c,
          status: statuses?.[c.id]?.status || c?.status || 'available',
        }));
      } catch {
        // ignore KV errors
      }
    }

    // 4. Slim payload
    cars = cars.map(c => {
      if (!c || typeof c !== 'object') return c;
      const rest = { ...c };
      delete rest.variant;
      const images = Array.isArray(rest.images)
        ? rest.images.slice(0, 1).map(img => ({
            url: img?.url,
            width: img?.width,
            height: img?.height,
            alt: img?.alt,
          }))
        : rest.images;
      return { ...rest, images };
    });
  } catch {
    cars = [];
  }

  const structuredData = buildStructuredData({ brandInfo, cars });

  return {
    props: {
      brandInfo,
      cars,
      structuredData,
    },
    revalidate: 300,
  };
}

export default function EvCarsBrand({ brandInfo, cars, structuredData }) {
  const router = useRouter();
  const safeCars = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);
  const brandFaqs = useMemo(() => buildBrandFaqEntries(brandInfo?.label), [brandInfo?.label]);
  const isEmpty = safeCars.length === 0;

  const pageUrl = `/ev-cars-chiang-mai-brand/${brandInfo.slug}`;
  const ogImage = `${SITE}/api/og?src=${encodeURIComponent('/herobanner/ev-car-chiang-mai-banner.webp')}&w=1200&h=630`;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`รถ EV มือสอง ${brandInfo.label} เชียงใหม่ เจ้าของขายเอง | ครูหนึ่งรถสวย`}
        description={`รวมรถไฟฟ้า EV มือสอง ${brandInfo.label} ในเชียงใหม่-ลำพูน สภาพดี ราคาอัปเดต พร้อมรูปจริง บริการฝากขายรถ EV มี 2 แพ็กเกจ ฟรี หรือ ฝากจอดเต็นท์ครบวงจร`}
        url={pageUrl}
        image={ogImage}
        type="website"
        pageType="all-cars"
        noindex={process.env.NODE_ENV === 'production' && isEmpty}
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'รถไฟฟ้า EV มือสอง เชียงใหม่', url: '/ev-cars-chiang-mai' },
          {
            name: `รถ EV ${brandInfo.label} มือสอง เชียงใหม่`,
            url: pageUrl,
          },
        ]}
        structuredData={structuredData}
      />

      {/* Hero */}
      <header id="hero" className="relative w-full overflow-hidden border-b border-gray-200">
        <div className="relative w-full min-h-[360px] sm:min-h-[400px] md:aspect-[33/14]">
          <img
            src="/herobanner/ev-car-chiang-mai-banner.webp"
            alt={`รถ EV มือสอง ${brandInfo.label} เชียงใหม่ - ครูหนึ่งรถสวย`}
            className="block w-full h-full object-cover object-center"
            decoding="sync"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl mx-auto text-center rounded-2xl bg-black/40 backdrop-blur-sm p-5 sm:p-8 outline outline-1 outline-white/20 shadow-2xl">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white font-prompt leading-tight"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.6)' }}
              >
                รถ EV มือสอง <span className="text-[#ff9800]">{brandInfo.label}</span> เชียงใหม่
              </h1>
              <p
                className="mt-3 text-sm sm:text-base md:text-lg text-white/90 font-prompt leading-relaxed max-w-2xl mx-auto"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                รถไฟฟ้า {brandInfo.label} สภาพดี ราคาอัปเดต พร้อมรูปจริง
                บริการรับซื้อและฝากขายโดยครูหนึ่งรถสวย
              </p>
              <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/ev-cars-chiang-mai"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#1a237e] hover:bg-[#283593] text-white rounded-lg font-bold font-prompt transition-colors text-sm sm:text-base border border-white/10"
                >
                  ← รถ EV ทั้งหมด
                </Link>
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#00B900] hover:bg-[#009900] text-white rounded-lg font-bold font-prompt transition-colors text-sm sm:text-base"
                >
                  ฝากขายรถ EV LINE
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Breadcrumb />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8">
        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 2) {
                router?.back();
              } else {
                router.push('/ev-cars-chiang-mai');
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ย้อนกลับ
          </button>
        </div>

        {/* Section heading */}
        <section className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
            รายการรถ EV {brandInfo.label} ในเชียงใหม่
          </h2>
          <p className="text-gray-700 mt-2 font-prompt">
            ทั้งหมด {safeCars.length.toLocaleString('th-TH')} คัน
          </p>
        </section>

        {/* Car grid / empty state */}
        {isEmpty ? (
          <section className="mt-4 rounded-2xl border border-green-100 bg-green-50/50 p-8 text-center text-gray-700 font-prompt">
            <div className="mb-4 flex justify-center">
              <div className="bg-white p-4 rounded-full shadow-sm ring-4 ring-green-50">
                <svg
                  className="w-12 h-12 text-[#00B900]"
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
            <p className="text-base sm:text-lg font-semibold text-green-800 mb-2">
              ยังไม่มีรถ EV {brandInfo.label} ลงประกาศในขณะนี้
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              ทัก LINE เพื่อให้ทีมงานแจ้งเมื่อมีรถ {brandInfo.label} เข้าใหม่
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/ev-cars-chiang-mai"
                className="px-6 py-2.5 bg-[#1a237e] text-white rounded-lg font-bold font-prompt text-sm hover:bg-[#283593] transition-colors"
              >
                ดูรถ EV ทั้งหมด
              </Link>
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#00B900] text-white rounded-lg font-bold font-prompt text-sm hover:bg-[#009900] transition-colors"
              >
                แจ้งเตือนรถเข้าใหม่ LINE
              </a>
            </div>
          </section>
        ) : (
          <section className="mt-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
              {safeCars.map((car, index) => (
                <CarCard key={car?.id || index} car={car} priority={index < 4} />
              ))}
            </div>
          </section>
        )}

        {/* Brand description */}
        <section className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
            รู้จัก {brandInfo.label} EV มือสองในเชียงใหม่
          </h2>
          <p className="mt-3 text-gray-700 font-prompt leading-relaxed">
            {BRAND_DESCRIPTIONS[brandInfo.slug]}
          </p>
          <p className="mt-3 text-gray-700 font-prompt leading-relaxed">
            ที่ครูหนึ่งรถสวย เราให้บริการรับซื้อและฝากขายรถ EV มือสอง {brandInfo.label}{' '}
            ในเชียงใหม่และลำพูน มีทั้งแบบลงประกาศฟรี และฝากจอดเต็นท์ครบวงจร
            ดูแลจนขายออกและจัดการเอกสารโอนให้ทั้งหมด
          </p>
        </section>

        {/* Other EV brands */}
        <section className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
            ยี่ห้อ EV อื่น ๆ
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(BRAND_CONFIG).map(slug => (
              <Link
                key={slug}
                href={`/ev-cars-chiang-mai-brand/${slug}`}
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold font-prompt transition-colors ${
                  slug === brandInfo.slug
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-300 text-gray-800 hover:border-primary hover:text-primary'
                }`}
              >
                {BRAND_CONFIG[slug].label}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="bg-gradient-to-r from-primary to-[#283593] px-5 py-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-prompt">
              คำถามที่พบบ่อย — รถ EV {brandInfo.label} มือสอง
            </h2>
          </div>
          <div className="p-5 sm:p-6">
            <div className="space-y-3 font-prompt">
              {brandFaqs.map((f, idx) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 py-4"
                >
                  <summary className="flex cursor-pointer list-none items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-900">
                      <span className="text-sm font-bold">{idx + 1}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {f.question}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">กดเพื่อดูคำตอบ</p>
                    </div>
                    <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-transform group-open:rotate-180">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </summary>
                  <div className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                    {f.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA bottom */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="https://lin.ee/8ugfzstD"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#00B900] hover:bg-[#009900] text-white font-prompt font-semibold text-base px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-sm mx-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.53 8.871 8.441 9.615.358.077.854.238 1.002.544.134.275.086.697.042.97l-.234 1.408c-.062.361-.295 1.413 1.236.768 1.53-.645 8.283-4.887 10.826-8.006 1.764-2.167 2.687-4.484 2.687-5.295z" />
            </svg>
            ฝากขายรถ EV ทาง LINE
          </a>
        </div>
      </main>

      {/* Floating LINE CTA mobile */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <a
          href="https://lin.ee/8ugfzstD"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#06c755] text-white shadow-2xl hover:scale-110 transition-transform active:scale-[0.97]"
          aria-label="ปรึกษาฝากขายรถ EV ทาง LINE"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </a>
      </div>
    </div>
  );
}
