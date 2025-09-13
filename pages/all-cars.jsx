import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import A11yImage from '../components/A11yImage';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify.mjs';
import { buildLocalBusinessJsonLd, sanitizePrice } from '../lib/seo/jsonld';
import { safeGet, safeFormatPrice } from '../lib/safeFetch';
import { carAlt } from '../utils/a11y';

export default function AllCars({ cars }) {
  const router = useRouter();
  const [filteredCars, setFilteredCars] = useState(cars);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // จำนวนรถต่อหน้า: 8 คัน (มือถือ: 2x4 แถว, เดสก์ท็อป: 4x2 แถว)
  const carsPerPage = 8;

  useEffect(() => {
    setMounted(true);

    // อ่านพารามิเตอร์จาก URL
    const { query } = router;
    if (query.search) setSearchTerm(String(query.search).trim().slice(0, 120));
    if (query.price) {
      const p = String(query.price);
      // allow forms like 100000-200000 or 700000
      if (/^\d+(?:-\d+)?$/.test(p)) setPriceRange(p);
    }
    if (query.brand) setBrandFilter(String(query.brand).trim().slice(0, 40));
    if (query.page) {
      const pg = parseInt(query.page, 10);
      setCurrentPage(Number.isFinite(pg) && pg > 0 ? pg : 1);
    }
  }, [router]);

  useEffect(() => {
    let filtered = cars;

    // Search filter - ปรับปรุงให้ค้นหาในหลายฟิลด์
    if (searchTerm) {
      const term = String(searchTerm).toLowerCase();
      filtered = filtered.filter(
        car =>
          safeGet(car, 'title', '').toLowerCase().includes(term) ||
          safeGet(car, 'vendor', '').toLowerCase().includes(term) ||
          safeGet(car, 'tags', []).some(tag => String(tag).toLowerCase().includes(term))
      );
    }

    // Price filter
    if (priceRange !== 'all') {
      const [minRaw, maxRaw] = String(priceRange).split('-');
      const min = Number(minRaw);
      const hasMax = typeof maxRaw !== 'undefined';
      const max = hasMax ? Number(maxRaw) : undefined;
      const validMin = Number.isFinite(min) && min >= 0;
      const validMax = !hasMax || (Number.isFinite(max) && max >= min);
      if (validMin && validMax) {
        filtered = filtered.filter(car => {
          const price = Number(safeGet(car, 'price.amount', 0));
          if (!Number.isFinite(price)) return false;
          return hasMax ? price >= min && price <= max : price >= min;
        });
      }
    }

    // Brand filter - ปรับปรุงให้แม่นยำขึ้น
    if (brandFilter !== 'all') {
      const bf = String(brandFilter).toLowerCase();
      filtered = filtered.filter(
        car =>
          safeGet(car, 'title', '').toLowerCase().includes(bf) ||
          safeGet(car, 'vendor', '').toLowerCase().includes(bf)
      );
    }

    setFilteredCars(filtered);
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีการกรอง
  }, [searchTerm, priceRange, brandFilter, cars]);

  const brands = ['all', 'toyota', 'honda', 'nissan', 'mazda', 'mitsubishi', 'isuzu', 'ford'];
  const priceRanges = [
    { value: 'all', label: 'ทุกช่วงราคา' },
    { value: '0-100000', label: 'ต่ำกว่า 1 แสน' },
    { value: '100000-200000', label: '1-2 แสน' },
    { value: '200000-300000', label: '2-3 แสน' },
    { value: '300000-400000', label: '3-4 แสน' },
    { value: '400000-500000', label: '4-5 แสน' },
    { value: '500000-600000', label: '5-6 แสน' },
    { value: '600000-700000', label: '6-7 แสน' },
    { value: '700000', label: '7 แสนขึ้นไป' },
  ];

  // คำนวณการแบ่งหน้า
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

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

  // ฟังก์ชันสำหรับเปลี่ยนหน้าโดยไม่เลื่อนขึ้นด้านบน
  const handlePageChange = (page, event) => {
    event.preventDefault();
    if (!Number.isFinite(page) || page < 1 || page > totalPages) return;
    setCurrentPage(page);
    try {
      const newUrl = getPageUrl(page);
      router.push(newUrl, undefined, { shallow: true, scroll: false });
    } catch (error) {
      console.warn('Router navigation failed:', error);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const showPages = 5; // แสดง 5 หน้า

    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
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
        title={`รถมือสองเชียงใหม่ทั้งหมด${totalPages > 1 && currentPage > 1 ? ` หน้า ${currentPage}` : ''} ตรวจสภาพครบถ้วน เช็คประวัติรถ ฟรีดาวน์ | ครูหนึ่งรถสวย`}
        description={`รถมือสองเชียงใหม่คุณภาพดี ${filteredCars.length} คัน แพลตฟอร์มออนไลน์ ตรวจสภาพครบถ้วน เช็คประวัติรถ ฟรีดาวน์ 0% รับประกัน 1 ปี ส่งฟรีทั่วไทย${totalPages > 1 ? ` หน้า ${currentPage}/${totalPages}` : ''} Toyota Honda Nissan โทร 094-064-9018`}
        url={`/all-cars${currentPage > 1 ? `?page=${currentPage}` : ''}`}
        image="https://chiangmaiusedcar.com/herobanner/cnxallcar.webp"
        type="website"
        pageType="all-cars"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `รถมือสองทั้งหมด${totalPages > 1 ? ` - หน้า ${currentPage}` : ''}`,
          description: `รถมือสองคุณภาพดี ${filteredCars.length} คัน พร้อมส่งมอบ`,
          url: `https://chiangmaiusedcar.com/all-cars${currentPage > 1 ? `?page=${currentPage}` : ''}`,
          mainEntity: {
            '@type': 'ItemList',
            name: 'รายการรถมือสอง',
            numberOfItems: currentCars.length,
            itemListElement: currentCars.map((car, index) => ({
              '@type': 'ListItem',
              position: startIndex + index + 1,
              item: {
                '@type': 'Car',
                '@id': `https://chiangmaiusedcar.com/car/${car.handle}`,
                name: car.title,
                description: `${car.vendor || car.brand || ''} ${car.model || ''} ${car.year || ''} ราคา ${Number(car.price?.amount || 0).toLocaleString()} บาท`,
                brand: car.vendor || car.brand || 'รถมือสอง',
                image: car.images?.[0]?.url
                  ? car.images[0].url.startsWith('/')
                    ? `https://chiangmaiusedcar.com${car.images[0].url}`
                    : car.images[0].url
                  : 'https://chiangmaiusedcar.com/herobanner/allusedcars.webp',
                offers: {
                  '@type': 'Offer',
                  price: car.price?.amount || '0',
                  priceCurrency: 'THB',
                  availability:
                    car.availableForSale !== false
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                  priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                  seller: {
                    '@type': 'AutoDealer',
                    name: 'ครูหนึ่งรถสวย',
                    telephone: '+66940649018',
                    address: {
                      '@type': 'PostalAddress',
                      addressLocality: 'เชียงใหม่',
                      addressCountry: 'TH',
                    },
                  },
                  warranty: {
                    '@type': 'WarrantyPromise',
                    durationOfWarranty: 'P1Y',
                    warrantyScope: 'เครื่องยนต์และเกียร์',
                  },
                },
              },
            })),
          },
          publisher: {
            '@type': 'AutoDealer',
            name: 'ครูหนึ่งรถสวย',
            url: 'https://chiangmaiusedcar.com',
          },
        }}
      />

      {/* Pagination Link Tags for SEO */}
      {mounted && totalPages > 1 && (
        <Head>
          {currentPage > 1 && (
            <link
              rel="prev"
              href={`https://www.chiangmaiusedcar.com${getPageUrl(currentPage - 1)}`}
            />
          )}
          {currentPage < totalPages && (
            <link
              rel="next"
              href={`https://www.chiangmaiusedcar.com${getPageUrl(currentPage + 1)}`}
            />
          )}
          <link
            rel="canonical"
            href={`https://www.chiangmaiusedcar.com${getPageUrl(currentPage)}`}
          />
        </Head>
      )}

      {/* Structured Data for Car Collection */}
      {mounted && currentCars.length > 0 && (
        <Head>
          {/* LocalBusiness Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildLocalBusinessJsonLd()),
            }}
          />

          {/* Collection Page Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: `รถทั้งหมด - หน้า ${currentPage}`,
                description: `รถมือสองคุณภาพดี ${filteredCars.length} คัน พร้อมส่งมอบ`,
                url: `https://chiangmaiusedcar.com/all-cars${currentPage > 1 ? `?page=${currentPage}` : ''}`,
                mainEntity: {
                  '@type': 'ItemList',
                  name: 'รายการรถมือสอง',
                  numberOfItems: currentCars.length,
                  itemListElement: currentCars.map((car, index) => {
                    const sanitizedPrice = sanitizePrice(car.price?.amount);
                    const priceValidUntil = new Date(
                      Date.now() + 90 * 24 * 60 * 60 * 1000
                    ).toISOString();
                    const carDescription =
                      car.description ||
                      `${car.vendor || car.brand || ''} ${car.model || ''} ${car.year || ''} มือสองเชียงใหม่ สภาพสวย ราคาดี`.trim();

                    return {
                      '@type': 'ListItem',
                      position: startIndex + index + 1,
                      item: {
                        '@type': 'Car',
                        '@id': `https://chiangmaiusedcar.com/car/${car.handle}`,
                        name: car.title,
                        description: carDescription,
                        brand: car.vendor || 'Unknown',
                        offers: {
                          '@type': 'Offer',
                          price: sanitizedPrice,
                          priceCurrency: 'THB',
                          availability:
                            car.availableForSale !== false
                              ? 'https://schema.org/InStock'
                              : 'https://schema.org/OutOfStock',
                          priceValidUntil: sanitizedPrice ? priceValidUntil : undefined,
                          seller: {
                            '@type': 'AutoDealer',
                            name: 'ครูหนึ่งรถสวย',
                          },
                          hasMerchantReturnPolicy: {
                            '@type': 'MerchantReturnPolicy',
                            applicableCountry: 'TH',
                            returnPolicyCategory: 'http://schema.org/MerchantReturnUnlimitedWindow',
                            merchantReturnDays: 7,
                            returnFees: 'http://schema.org/FreeReturn',
                          },
                          shippingDetails: {
                            '@type': 'OfferShippingDetails',
                            shippingDestination: {
                              '@type': 'DefinedRegion',
                              addressCountry: 'TH',
                            },
                            shippingRate: {
                              '@type': 'MonetaryAmount',
                              value: 0,
                              currency: 'THB',
                            },
                          },
                        },
                      },
                    };
                  }),
                },
                publisher: {
                  '@type': 'AutoDealer',
                  name: 'ครูหนึ่งรถสวย',
                  url: 'https://chiangmaiusedcar.com',
                },
              }),
            }}
          />
        </Head>
      )}

      {/* Hero Banner - 2025 Modern Design */}
      <section className="relative w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden bg-white">
        <A11yImage
          src="/herobanner/cnxallcar.webp"
          alt="รถมือสองทั้งหมด - ครูหนึ่งรถสวย"
          fill
          className="object-cover object-top"
          priority
          quality={85}
          sizes="100vw"
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content over banner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 font-prompt text-white"
              style={{
                textShadow:
                  '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              รถมือสองทั้งหมด
            </h1>
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <p
                className="text-xs sm:text-sm md:text-lg lg:text-xl font-prompt text-white font-bold"
                style={{
                  textShadow:
                    '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                }}
              >
                รถคุณภาพดี {mounted ? filteredCars.length : '...'} คัน พร้อมส่งมอบ
              </p>
              {mounted && totalPages > 1 && (
                <p
                  className="text-xs sm:text-xs md:text-sm lg:text-base font-prompt text-white font-semibold"
                  style={{
                    textShadow:
                      '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                  }}
                >
                  หน้า {currentPage}/{totalPages}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-gray-200 -mt-0">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-600 font-prompt">
            <Link href="/" className="hover:text-primary transition-colors">
              หน้าแรก
            </Link>
            <span>/</span>
            <span className="text-primary font-medium">รถทั้งหมด</span>
          </nav>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-4 md:py-6 shadow-lg border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="ค้นหารถ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 placeholder-gray-500 bg-white transition-all duration-200"
              />
            </div>

            {/* Price Range */}
            <div>
              <select
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
              <select
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

            {/* Reset */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange('all');
                  setBrandFilter('all');
                  setCurrentPage(1);
                  // อัพเดต URL เมื่อรีเซ็ต
                  if (mounted) {
                    router.push('/all-cars', undefined, { shallow: true });
                  }
                }}
                className="w-full bg-accent hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 font-prompt shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                รีเซ็ต
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-8 md:py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-6">
          {!mounted ? (
            // Loading state ระหว่างรอ hydration - Skeleton Cards
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl md:rounded-3xl shadow-lg overflow-hidden border-2 border-gray-200 animate-pulse"
                >
                  <div className="w-full h-28 md:h-48 bg-gray-200"></div>
                  <div className="p-2 md:p-4">
                    <div className="h-3 md:h-4 bg-gray-200 rounded mb-1 md:mb-2"></div>
                    <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 mb-1 md:mb-2"></div>
                    <div className="h-4 md:h-6 bg-gray-200 rounded w-1/2 mb-1 md:mb-2"></div>
                    <div className="space-y-0.5 md:space-y-1 mb-1 md:mb-2">
                      <div className="h-2 md:h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex">
                      <div className="w-full h-8 md:h-10 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-600 mb-2 font-prompt">
                ไม่พบรถที่คุณค้นหา
              </h2>
              <p className="text-gray-500 font-prompt">
                ลองเปลี่ยนเงื่อนไขการค้นหาหรือติดต่อเราโดยตรง
              </p>
            </div>
          ) : (
            <>
              {/* Cards Grid - 2025 Modern Layout */}
              <div className="car-grid grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
                {currentCars.map(car => (
                  <article
                    key={car.id}
                    className="car-card group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border-2 border-gray-200 hover:border-primary flex flex-col h-full relative font-prompt"
                  >
                    {/* Main Car Link - คลิกได้ทั้งส่วนรูปและข้อมูล */}
                    <Link
                      href={
                        typeof safeGet(car, 'handle') === 'string' &&
                        safeGet(car, 'handle', '').length
                          ? `/car/${encodeURIComponent(safeGet(car, 'handle'))}`
                          : '/all-cars'
                      }
                      className="block focus:outline-none flex-1"
                    >
                      <figure className="thumb relative w-full h-28 md:h-48 overflow-hidden bg-gray-100">
                        <A11yImage
                          src={
                            Array.isArray(car.images) && car.images.length > 0
                              ? safeGet(car, 'images.0.url', '/cover.jpg')
                              : '/cover.jpg'
                          }
                          alt={carAlt(car)}
                          fallbackAlt={`${safeGet(car, 'title', 'รถมือสองคุณภาพดี')} - ราคา ${safeFormatPrice(safeGet(car, 'price.amount')).display} บาท`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 300px"
                        />
                      </figure>
                      <div className="p-2 md:p-3 flex flex-col">
                        <h3 className="card-title font-extrabold text-sm md:text-lg text-gray-900 mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2 font-prompt">
                          {safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
                        </h3>
                        <div className="flex items-center justify-between mb-1 md:mb-3">
                          <p className="price text-base md:text-xl font-bold text-accent font-prompt">
                            ฿{safeFormatPrice(safeGet(car, 'price.amount')).display}
                          </p>
                        </div>
                        <ul className="text-xs md:text-sm text-gray-800 mb-1 md:mb-3 space-y-0.5 md:space-y-1 font-prompt font-medium">
                          {safeGet(car, 'tags', []).includes('ฟรีดาวน์') && (
                            <li className="text-primary">✓ ฟรีดาวน์</li>
                          )}
                          {safeGet(car, 'tags', []).includes('ผ่อนถูก') && (
                            <li className="text-primary">✓ ผ่อนถูก</li>
                          )}
                          <li className="text-gray-900">✓ รับประกัน 1 ปี</li>
                        </ul>
                      </div>
                    </Link>

                    {/* Action Button - เหมือนหน้าแรก */}
                    <div className="flex p-2 pt-0 md:p-4 md:pt-0">
                      <Link
                        href={
                          typeof safeGet(car, 'handle') === 'string' &&
                          safeGet(car, 'handle', '').length
                            ? `/car/${encodeURIComponent(safeGet(car, 'handle'))}`
                            : '/all-cars'
                        }
                        className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full min-h-11 px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 font-prompt"
                        aria-label={`ดูรายละเอียด ${safeGet(car, 'title', 'รถยนต์')}`}
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination - 2025 Modern Design */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  {/* Previous Button */}
                  {currentPage > 1 && (
                    <button
                      type="button"
                      onClick={e => handlePageChange(currentPage - 1, e)}
                      className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 font-prompt text-gray-700 shadow-lg"
                      aria-label="ไปหน้าก่อนหน้า"
                    >
                      ← ก่อนหน้า
                    </button>
                  )}

                  {/* First Page */}
                  {generatePageNumbers()[0] > 1 && (
                    <>
                      <button
                        onClick={e => handlePageChange(1, e)}
                        className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 font-prompt text-gray-700 shadow-lg"
                      >
                        1
                      </button>
                      {generatePageNumbers()[0] > 2 && (
                        <span className="px-2 text-gray-500 font-bold">...</span>
                      )}
                    </>
                  )}

                  {/* Page Numbers */}
                  {generatePageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={e => handlePageChange(page, e)}
                      className={`px-4 py-2 rounded-xl transition-all duration-200 font-prompt shadow-lg ${
                        page === currentPage
                          ? 'bg-accent text-white border-2 border-accent font-bold shadow-xl transform scale-110'
                          : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-primary hover:border-primary hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  {currentPage < totalPages && (
                    <button
                      type="button"
                      onClick={e => handlePageChange(currentPage + 1, e)}
                      className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl hover:bg-primary hover:border-primary hover:text-white transition-all duration-200 font-prompt text-gray-700 shadow-lg"
                      aria-label="ไปหน้าถัดไป"
                    >
                      ถัดไป →
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// Keep SSR for all-cars due to pagination and search functionality
export async function getServerSideProps() {
  let cars = [];
  try {
    const result = await getAllCars();
    cars = Array.isArray(result) ? result : [];

    // ลดขนาดข้อมูลโดยเก็บเฉพาะฟิลด์ที่จำเป็น
    cars = cars.map(car => ({
      id: car.id,
      handle: car.handle,
      title: car.title,
      vendor: car.vendor,
      tags: car.tags,
      price: car.price,
      images: car.images?.slice(0, 1) || [], // เก็บแค่รูปแรกสำหรับ listing
      availableForSale: car.availableForSale,
    }));

    // แสดงรถทั้งหมดที่มีจริง ไม่จำกัดจำนวน
  } catch (e) {
    console.error('getAllCars error:', e);
    // ไม่ throw error - ให้ UI แสดงข้อมูลว่างแทน
    cars = [];
  }

  return {
    props: { cars },
  };
}
