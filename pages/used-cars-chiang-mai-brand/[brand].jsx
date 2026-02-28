/* eslint-disable @next/next/no-img-element */

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SEO from '../../components/SEO.jsx';
import CarCard from '../../components/CarCard';
import { getAllCars, getCarSpecsByHandles } from '../../lib/shopify.mjs';
import { readCarStatuses } from '../../lib/carStatusStore.js';
import { computeSchemaAvailability } from '../../lib/carStatusUtils.js';
import { COMMON_OFFER_EXTENSIONS } from '../../config/business';
import { getPriceInfo } from '../../lib/carPrice';
import { mergeCarSpecs } from '../../lib/mergeCarSpecs';

const Breadcrumb = dynamic(() => import('../../components/Breadcrumb'), {
  loading: () => null,
});

const SITE = 'https://www.chiangmaiusedcar.com';

const BRAND_CONFIG = {
  toyota: { label: 'Toyota', tokens: ['toyota'] },
  honda: { label: 'Honda', tokens: ['honda'] },
  isuzu: { label: 'Isuzu', tokens: ['isuzu'] },
  nissan: { label: 'Nissan', tokens: ['nissan'] },
  mazda: { label: 'Mazda', tokens: ['mazda'] },
  mitsubishi: { label: 'Mitsubishi', tokens: ['mitsubishi'] },
  ford: { label: 'Ford', tokens: ['ford'] },
};

function normalizeBrandSlug(input) {
  const raw = String(input || '')
    .trim()
    .toLowerCase();

  // allow only safe path chars
  const safe = raw.replace(/[^a-z0-9-]/g, '');
  return safe;
}

function getBrandInfo(brandSlug) {
  const key = normalizeBrandSlug(brandSlug);
  const config = BRAND_CONFIG[key];
  if (!config) return null;
  return { slug: key, ...config };
}

function buildBrandFaqEntries(brandLabel) {
  const safeLabel = String(brandLabel || '').trim() || 'รถมือสอง';
  return [
    {
      question: `รถมือสอง ${safeLabel} เชียงใหม่ มีรุ่นอะไรบ้าง?`,
      answer:
        'ดูรายการรถที่อยู่ในหน้านี้ได้เลย (อัปเดตตามสต็อกจริง) คลิกแต่ละคันเพื่อดูรูป/รายละเอียด/ราคา และสถานะรถ',
    },
    {
      question: `อยากนัดดูรถ ${safeLabel} ต้องทำยังไง?`,
      answer:
        'เลือกคันที่สนใจ แล้วกดเข้าไปดูรายละเอียด จากนั้นทัก LINE/โทร เพื่อนัดวันเวลาเข้ามาดูรถได้เลย',
    },
    {
      question: 'มีบริการจัดไฟแนนซ์หรือฟรีดาวน์ไหม?',
      answer:
        'มีทีมช่วยประสานไฟแนนซ์ และบางรุ่นมีโปรโมชันฟรีดาวน์ (ขึ้นอยู่กับเงื่อนไขและเครดิตลูกค้า) แนะนำทัก LINE เพื่อเช็คเงื่อนไขล่าสุด',
    },
  ];
}

function buildBrandStructuredDataJsonLd({ brandLabel, brandSlug, cars, page, perPage }) {
  const safeCars = Array.isArray(cars) ? cars : [];
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : safeCars.length || 24;

  const listItems = safeCars.map((car, index) => {
    const handle = car?.handle;
    const carUrl = handle ? `${SITE}/car/${handle}` : `${SITE}/all-cars`;

    const priceInfo = getPriceInfo(car?.price?.amount || 0, { allowZero: false });
    const rawImage = car?.images?.[0]?.url;
    const imageUrl = rawImage
      ? rawImage.startsWith('http')
        ? rawImage
        : `${SITE}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
      : `${SITE}/herobanner/cnxcar.webp`;

    const title = car?.title || `รถมือสอง ${brandLabel} เชียงใหม่`;
    const availabilityValue = computeSchemaAvailability({
      status: car?.status,
      availableForSale: car?.availableForSale,
    });

    return {
      '@type': 'ListItem',
      position: (safePage - 1) * safePerPage + index + 1,
      item: {
        '@type': 'Product',
        additionalType: 'https://schema.org/Car',
        '@id': carUrl,
        name: title,
        image: imageUrl,
        url: carUrl,
        brand: {
          '@type': 'Brand',
          name: brandLabel,
        },
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

  const pageUrl = `${SITE}/used-cars-chiang-mai-brand/${brandSlug}${safePage > 1 ? `?page=${safePage}` : ''}`;

  const collectionPage = {
    '@type': 'CollectionPage',
    '@id': `${SITE}/used-cars-chiang-mai-brand/${brandSlug}#collection`,
    url: pageUrl,
    name: `รถมือสอง ${brandLabel} เชียงใหม่${safePage > 1 ? ` - หน้า ${safePage}` : ''}`,
    description: `รวมรถมือสอง ${brandLabel} ในเชียงใหม่ พร้อมรูปจริงและลิงก์ไปหน้ารายละเอียดรถ`,
    mainEntity: {
      '@type': 'ItemList',
      name: `รถมือสอง ${brandLabel} เชียงใหม่`,
      numberOfItems: listItems.length,
      itemListElement: listItems,
    },
  };

  const faqs = buildBrandFaqEntries(brandLabel);
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE}/used-cars-chiang-mai-brand/${brandSlug}#faq`,
    url: pageUrl,
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [collectionPage, faqPage],
  };
}

export async function getServerSideProps(context) {
  const brandInfo = getBrandInfo(context?.params?.brand);
  if (!brandInfo) {
    return { notFound: true };
  }

  const q = context?.query || {};
  const page = Math.max(1, parseInt(String(q.page || '1'), 10) || 1);
  const perPage = 24;

  let cars = [];
  try {
    // Run both fetches in parallel to reduce SSR latency
    const [result, carStatuses] = await Promise.all([
      getAllCars().catch(() => []),
      readCarStatuses().catch(() => null),
    ]);
    const allCars = Array.isArray(result) ? result : [];

    const tokens = brandInfo.tokens;
    cars = allCars
      .filter(car => {
        const hay = `${car?.vendor || ''} ${car?.brand || ''} ${car?.title || ''}`.toLowerCase();
        return tokens.some(t => hay.includes(t));
      })
      .map(car => ({
        id: car.id,
        handle: car.handle,
        title: car.title,
        vendor: car.vendor,
        tags: car.tags,
        price: car.price,
        // Keep quick specs for CarCard (ปี/ไมล์/เกียร์/เชื้อเพลิง)
        year: car.year,
        mileage: car.mileage,
        transmission: car.transmission,
        drivetrain: car.drivetrain || car.drive_type,
        drive_type: car.drive_type || car.drivetrain,
        installment: car.installment,
        fuelType: car.fuelType || car.fuel_type,
        fuel_type: car.fuel_type || car.fuelType,
        category: car.category,
        body_type: car.body_type,
        images: Array.isArray(car.images) ? car.images.slice(0, 1) : [],
        availableForSale: car.availableForSale,
        status: carStatuses && car.id ? carStatuses[car.id]?.status || 'available' : 'available',
      }));
  } catch {
    cars = [];
  }

  const totalCars = cars.length;
  const totalPages = Math.max(1, Math.ceil(totalCars / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  let pageCars = cars.slice(start, start + perPage);

  // Bring sub-details together at SSR time for this brand page.
  // This avoids client-side /api/public/car-specs calls while keeping the request bounded (<= 24 cars).
  const has = v => v != null && String(v).trim() !== '';
  const needsSpecs = car => {
    const fuel = car?.fuelType || car?.fuel_type;
    const drive = car?.drivetrain || car?.drive_type;
    return !(
      has(car?.mileage) &&
      has(car?.transmission) &&
      has(drive) &&
      has(fuel) &&
      has(car?.installment) &&
      has(car?.category)
    );
  };

  try {
    const handles = pageCars
      .filter(needsSpecs)
      .map(c => c?.handle)
      .filter(Boolean);
    const uniqueHandles = Array.from(new Set(handles)).slice(0, 12);
    if (uniqueHandles.length > 0) {
      const raw = await getCarSpecsByHandles(uniqueHandles);
      pageCars = pageCars.map(c => mergeCarSpecs(c, raw?.[c?.handle]));
    }
  } catch {
    // ignore: keep baseline payload
  }

  if (context?.res?.setHeader) {
    context.res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1800, stale-if-error=86400');
  }

  const structuredData = buildBrandStructuredDataJsonLd({
    brandLabel: brandInfo.label,
    brandSlug: brandInfo.slug,
    cars: pageCars,
    page: safePage,
    perPage,
  });

  const homeOgImage = `${SITE}/api/og?src=${encodeURIComponent(
    '/herobanner/cnxcar.webp'
  )}&w=1200&h=630`;

  return {
    props: {
      brandInfo,
      cars: pageCars,
      totalCars,
      safePage,
      totalPages,
      homeOgImage,
      structuredData,
    },
  };
}

export default function UsedCarsChiangMaiBrand({
  brandInfo,
  cars,
  totalCars,
  safePage,
  totalPages,
  homeOgImage,
  structuredData,
}) {
  const safeCars = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);

  const brandFaqs = useMemo(() => buildBrandFaqEntries(brandInfo?.label), [brandInfo?.label]);

  const isEmpty = !totalCars || totalCars <= 0;
  const url = `/used-cars-chiang-mai-brand/${brandInfo.slug}${
    safePage > 1 ? `?page=${safePage}` : ''
  }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`รถมือสอง ${brandInfo.label} เชียงใหม่ ฟรีดาวน์ ไมล์แท้`}
        description={`รวมรถมือสอง ${brandInfo.label} เชียงใหม่ สภาพนางฟ้า ฟรีดาวน์ ไมล์แท้ พร้อมตรวจสอบประวัติได้ ${totalCars} คัน คลิกดูรายละเอียดและโปรโมชั่นพิเศษได้เลย`}
        url={url}
        image={homeOgImage}
        type="website"
        pageType="all-cars"
        noindex={process.env.NODE_ENV === 'production' && isEmpty}
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'รถมือสอง เชียงใหม่', url: '/used-cars-chiang-mai' },
          {
            name: `รถมือสอง ${brandInfo.label} เชียงใหม่`,
            url: `/used-cars-chiang-mai-brand/${brandInfo.slug}`,
          },
        ]}
        structuredData={structuredData}
      />

      <header className="bg-gradient-to-r from-orange-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 ipadpro:px-3 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-prompt">
            รถมือสอง {brandInfo.label} เชียงใหม่
          </h1>
          <p className="mt-3 text-gray-900 font-prompt leading-relaxed max-w-3xl">
            รวมรถมือสอง {brandInfo.label} ในเชียงใหม่ พร้อมรูปจริง ราคาอัปเดต และลิงก์ไปหน้า
            รายละเอียดรถ
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/all-cars" className="btn-primary text-center">
              ดูรถทั้งหมด
            </Link>
            <Link href="/used-cars-chiang-mai" className="btn-secondary text-center">
              รวมรถมือสองเชียงใหม่
            </Link>
          </div>
        </div>
      </header>

      <Breadcrumb />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 ipadpro:px-3 py-8">
        <section className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
                รายการรถ {brandInfo.label} ในเชียงใหม่
              </h2>
              <p className="text-gray-700 mt-2 font-prompt">
                ทั้งหมด {totalCars.toLocaleString('th-TH')} คัน{' '}
                {totalPages > 1 ? `• หน้า ${safePage}/${totalPages}` : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/used-cars-chiang-mai-brand/${brandInfo.slug}${safePage > 1 ? `?page=${safePage - 1}` : ''}`}
                className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold font-prompt transition-colors ${safePage <= 1 ? 'border-gray-200 text-gray-400 pointer-events-none' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
              >
                ก่อนหน้า
              </Link>
              <Link
                href={`/used-cars-chiang-mai-brand/${brandInfo.slug}${safePage < totalPages ? `?page=${safePage + 1}` : ''}`}
                className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold font-prompt transition-colors ${safePage >= totalPages ? 'border-gray-200 text-gray-400 pointer-events-none' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
              >
                ถัดไป
              </Link>
            </div>
          </div>
        </section>

        {safeCars.length === 0 ? (
          <section className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="font-semibold text-gray-900 font-prompt">
              ยังไม่มีรถยี่ห้อนี้ในสต็อกตอนนี้
            </div>
            <div className="mt-2 text-sm text-gray-700 font-prompt">
              ลองดูหน้า “รถทั้งหมด” หรือหน้า “รถมือสองเชียงใหม่” เพื่อดูรถที่มีในสต็อกล่าสุด
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/all-cars" className="btn-primary">
                ดูรถทั้งหมด
              </Link>
              <Link href="/used-cars-chiang-mai" className="btn-secondary">
                รถมือสองเชียงใหม่
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
              {safeCars.map((car, index) => {
                return <CarCard key={car?.id || index} car={car} priority={index < 6} />;
              })}
            </div>
          </section>
        )}

        <section className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">ยี่ห้ออื่น ๆ</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(BRAND_CONFIG).map(slug => (
              <Link
                key={slug}
                href={`/used-cars-chiang-mai-brand/${slug}`}
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold font-prompt transition-colors ${slug === brandInfo.slug ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-800 hover:border-primary hover:text-primary'}`}
              >
                {BRAND_CONFIG[slug].label}
              </Link>
            ))}
          </div>
        </section>

        <section
          id="faq"
          className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="bg-gradient-to-r from-primary to-primary-800 px-5 py-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-prompt">คำถามที่พบบ่อย</h2>
            <p className="mt-1 text-sm text-white/90 font-prompt">
              คำตอบสั้นๆ ช่วยตัดสินใจดูรถได้เร็วขึ้น
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="space-y-3 font-prompt">
              {brandFaqs.map((f, idx) => (
                <details
                  key={f.question}
                  className="group rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 py-4"
                >
                  <summary className="flex cursor-pointer list-none items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-800">
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
      </main>
    </div>
  );
}
