/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SEO from '../../components/SEO.jsx';
import CarCard from '../../components/CarCard';
import { getAllCars } from '../../lib/shopify.mjs';
import { readCarStatuses } from '../../lib/carStatusStore.js';
import { computeSchemaAvailability } from '../../lib/carStatusUtils.js';
import { COMMON_OFFER_EXTENSIONS } from '../../config/business';

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

function getPriceInfo(amount) {
  try {
    const num = Number(amount);
    const valid = Number.isFinite(num) && num > 0;
    return {
      valid,
      numeric: valid ? String(num) : undefined,
      display: valid ? num.toLocaleString('th-TH') : 'ติดต่อสอบถาม',
    };
  } catch {
    return { valid: false, numeric: undefined, display: 'ติดต่อสอบถาม' };
  }
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

    const priceInfo = getPriceInfo(car?.price?.amount || 0);
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
    const result = await getAllCars();
    const allCars = Array.isArray(result) ? result : [];

    let carStatuses = null;
    try {
      carStatuses = await readCarStatuses();
    } catch {
      carStatuses = null;
    }

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
        installment: car.installment,
        fuelType: car.fuelType || car.fuel_type,
        fuel_type: car.fuel_type || car.fuelType,
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
  const pageCars = cars.slice(start, start + perPage);

  if (context?.res?.setHeader) {
    context.res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
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
  const [specByHandle, setSpecByHandle] = useState({});
  const requestedSpecHandlesRef = useRef(new Set());
  const specFetchAttemptsRef = useRef(new Map());

  const brandFaqs = useMemo(() => buildBrandFaqEntries(brandInfo?.label), [brandInfo?.label]);

  const mergeSpecs = (car, extra) => {
    const next = { ...car };

    const has = v => v != null && String(v).trim() !== '';
    const carFuel = car?.fuelType || car?.fuel_type || car?.['fuel-type'];
    const extraFuel = extra?.fuelType || extra?.fuel_type || extra?.['fuel-type'];

    const carDrive =
      car?.drivetrain ||
      car?.drive_type ||
      car?.driveType ||
      car?.['drive-type'] ||
      car?.wheel_drive ||
      car?.wheelDrive;
    const extraDrive =
      extra?.drivetrain ||
      extra?.drive_type ||
      extra?.driveType ||
      extra?.['drive-type'] ||
      extra?.wheel_drive ||
      extra?.wheelDrive;

    // Normalize fuel keys so all cards behave the same
    if (has(carFuel)) {
      if (!has(next.fuelType)) next.fuelType = carFuel;
      if (!has(next.fuel_type)) next.fuel_type = carFuel;
    }

    // Normalize drivetrain keys so all cards behave the same
    if (has(carDrive)) {
      if (!has(next.drivetrain)) next.drivetrain = carDrive;
      if (!has(next.drive_type)) next.drive_type = carDrive;
    }

    if (!extra) return next;

    if (!has(next.year) && has(extra.year)) next.year = extra.year;
    if (!has(next.mileage) && has(extra.mileage)) next.mileage = extra.mileage;
    if (!has(next.transmission) && has(extra.transmission)) next.transmission = extra.transmission;
    if (!has(carDrive) && has(extraDrive)) {
      next.drivetrain = extra.drivetrain || extraDrive;
      next.drive_type = extra.drive_type || extraDrive;
    }
    if (!has(carFuel) && has(extraFuel)) {
      next.fuelType = extra.fuelType || extraFuel;
      next.fuel_type = extra.fuel_type || extraFuel;
    }
    if (!has(next.installment) && has(extra.installment)) next.installment = extra.installment;

    if (!has(next.category) && has(extra.category)) next.category = extra.category;
    if (!has(next.body_type) && has(extra.body_type)) next.body_type = extra.body_type;

    return next;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!safeCars || safeCars.length === 0) return;

    const needs = [];
    for (const car of safeCars) {
      const handle = car?.handle;
      if (!handle) continue;
      if (requestedSpecHandlesRef.current.has(handle)) continue;

      const attempts = Number(specFetchAttemptsRef.current.get(handle) || 0);
      if (attempts >= 2) continue;

      const extra = specByHandle?.[handle];
      const merged = mergeSpecs(car, extra);

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
      const hasInstallment =
        merged?.installment != null && String(merged.installment).trim() !== '';

      const hasCategory = merged?.category != null && String(merged.category).trim() !== '';

      if (
        !(
          hasMileage &&
          hasTransmission &&
          hasDrivetrain &&
          hasFuel &&
          hasInstallment &&
          hasCategory
        )
      ) {
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
        const canonical = Array.from(new Set(needs.filter(Boolean)));
        canonical.sort();
        const limited = canonical.slice(0, 50);
        const params = new URLSearchParams({ handles: limited.join(',') });
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

    fetchSpecs();
  }, [safeCars, specByHandle]);

  const isEmpty = !totalCars || totalCars <= 0;
  const url = `/used-cars-chiang-mai-brand/${brandInfo.slug}${
    safePage > 1 ? `?page=${safePage}` : ''
  }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`รถมือสอง ${brandInfo.label} เชียงใหม่ รวมรูปจริง`}
        description={`รวมรถมือสอง ${brandInfo.label} ในเชียงใหม่ พร้อมรูปจริง ${totalCars} คัน คลิกดูรายละเอียดคันต่อคันได้ทันที`}
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
            <Link href="/all-cars" prefetch={false} className="btn-primary text-center">
              ดูรถทั้งหมด
            </Link>
            <Link
              href="/used-cars-chiang-mai"
              prefetch={false}
              className="btn-secondary text-center"
            >
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
                prefetch={false}
                className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold font-prompt transition-colors ${safePage <= 1 ? 'border-gray-200 text-gray-400 pointer-events-none' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
              >
                ก่อนหน้า
              </Link>
              <Link
                href={`/used-cars-chiang-mai-brand/${brandInfo.slug}${safePage < totalPages ? `?page=${safePage + 1}` : ''}`}
                prefetch={false}
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
              <Link href="/all-cars" prefetch={false} className="btn-primary">
                ดูรถทั้งหมด
              </Link>
              <Link href="/used-cars-chiang-mai" prefetch={false} className="btn-secondary">
                รถมือสองเชียงใหม่
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-4 xl:gap-6">
              {safeCars.map((car, index) => {
                const handle = car?.handle;
                const extra = handle ? specByHandle?.[handle] : null;
                const mergedCar = mergeSpecs(car, extra);
                return <CarCard key={car?.id || index} car={mergedCar} priority={index < 6} />;
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
                prefetch={false}
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
