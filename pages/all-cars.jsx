import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import { getAllCars } from '../lib/shopify.mjs';
import { buildLocalBusinessJsonLd, sanitizePrice } from '../lib/seo/jsonld';
import { safeGet, safeLocalStorage, safeFormatPrice } from '../lib/safeFetch';

export default function AllCars({ cars }) {
  const router = useRouter();
  const [filteredCars, setFilteredCars] = useState(cars);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [saved, setSaved] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // จำนวนรถต่อหน้า: 8 คัน (มือถือ: 2x4 แถว, เดสก์ท็อป: 4x2 แถว)
  const carsPerPage = 8;

  useEffect(() => {
    setMounted(true);

    // ป้องกัน hydration mismatch โดยเช็ค window object
    if (typeof window !== 'undefined') {
      const saved = safeLocalStorage('savedCars', []);
      setSaved(Array.isArray(saved) ? saved : []);
    }

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

  function toggleSave(carId) {
    if (!mounted || typeof window === 'undefined') return; // ป้องกันการเรียกใช้ก่อน mount และ SSR
    try {
      const currentSaved = safeLocalStorage('savedCars', []);
      let s = Array.isArray(currentSaved) ? currentSaved : [];
      if (carId == null) return;
      if (s.includes(carId)) s = s.filter(id => id !== carId);
      else s.push(carId);
      setSaved(s);
      localStorage.setItem('savedCars', JSON.stringify(s));
    } catch {}
  }

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
        title={`รรถมือสองทั้งหมด${totalPages > 1 && currentPage > 1 ? ` หน้า ${currentPage}` : ''} - รถบ้านแท้ ฟรีดาวน์ ผ่อนถูก | ครูหนึ่งรถสวย`}
        description={`รถมือสองคุณภาพดี ${filteredCars.length} คัน รถบ้านแท้ 100% ฟรีดาวน์ 0% ผ่อนถูกสุด รับประกัน 1 ปี ส่งฟรีทั่วไทย${totalPages > 1 ? ` หน้า ${currentPage}/${totalPages}` : ''} Toyota Honda Nissan Mazda และอื่นๆ โทร 094-064-9018`}
        keywords={`รถมือสองทั้งหมด, รถยนต์มือสอง, รถบ้านเชียงใหม่, รถคุณภาพดี, ฟรีดาวน์, ผ่อนถูก, Toyota มือสอง, Honda มือสอง, Nissan มือสอง, Mazda มือสอง, รับประกันรถ, ส่งฟรีทั่วไทย, ครูหนึ่งรถสวย${brandFilter !== 'all' ? `, ${brandFilter} มือสอง` : ''}${searchTerm ? `, ${searchTerm}` : ''}`}
        url={`/all-cars${currentPage > 1 ? `?page=${currentPage}` : ''}`}
        image="https://chiangmaiusedcar.com/herobanner/allusedcars.webp"
        type="website"
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
            <link rel="prev" href={`https://chiangmaiusedcar.com${getPageUrl(currentPage - 1)}`} />
          )}
          {currentPage < totalPages && (
            <link rel="next" href={`https://chiangmaiusedcar.com${getPageUrl(currentPage + 1)}`} />
          )}
          <link rel="canonical" href={`https://chiangmaiusedcar.com${getPageUrl(currentPage)}`} />
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

      {/* Hero Banner */}
      <section className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
        <Image
          src="/herobanner/allusedcars.webp"
          alt="รถมือสองทั้งหมด - ครูหนึ่งรถสวย"
          fill
          className="object-cover object-center"
          priority
          quality={85}
          sizes="100vw"
        />

        {/* Content over banner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 font-prompt drop-shadow-lg">
              รถมือสองทั้งหมด
            </h1>
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-prompt drop-shadow-lg text-black font-bold">
                รถคุณภาพดี {mounted ? filteredCars.length : '...'} คัน พร้อมส่งมอบ
              </p>
              {mounted && totalPages > 1 && (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-lg font-prompt text-black font-semibold">
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
      <section className="bg-white py-4 md:py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="ค้นหารถ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-gray-900 placeholder-gray-500 bg-white"
              />
            </div>

            {/* Price Range */}
            <div>
              <select
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-gray-900 bg-white"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-gray-900 bg-white"
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
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 font-prompt"
              >
                รีเซ็ต
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          {!mounted ? (
            // Loading state ระหว่างรอ hydration - Skeleton Cards
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden border-2 border-gray-200 animate-pulse"
                >
                  <div className="w-full h-32 md:h-48 bg-gray-200"></div>
                  <div className="p-3 md:p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="space-y-1 mb-2">
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <div className="flex-1 h-6 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 h-6 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 h-6 bg-gray-200 rounded-full"></div>
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
              {/* Cards Grid - Responsive Layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {currentCars.map(car => (
                  <article
                    key={car.id}
                    className="group bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-orange-600/50 transition-all duration-300 overflow-hidden border-2 border-orange-600/40 hover:border-primary flex flex-col h-full relative font-prompt"
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
                      <figure className="relative w-full h-32 md:h-48 overflow-hidden bg-orange-600/10">
                        <Image
                          src={
                            Array.isArray(car.images) && car.images.length > 0
                              ? safeGet(car, 'images.0.url', '/cover.jpg')
                              : '/cover.jpg'
                          }
                          alt={`${safeGet(car, 'title', 'รถมือสองคุณภาพดี')} - ราคา ${safeFormatPrice(safeGet(car, 'price.amount')).display} บาท`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 300px"
                        />
                      </figure>
                      <div className="p-3 md:p-4 flex flex-col">
                        <h3 className="font-extrabold text-sm md:text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 font-prompt">
                          {safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
                        </h3>
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                          <p className="text-lg md:text-xl font-bold text-orange-600 font-prompt">
                            ฿{safeFormatPrice(safeGet(car, 'price.amount')).display}
                          </p>
                          <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full font-bold shadow-sm">
                            ส่งฟรี!
                          </span>
                        </div>
                        <ul className="text-xs md:text-sm text-gray-800 mb-2 md:mb-3 space-y-1 font-prompt font-medium">
                          {safeGet(car, 'tags', []).includes('ฟรีดาวน์') && (
                            <li className="text-blue-600">✓ ฟรีดาวน์</li>
                          )}
                          {safeGet(car, 'tags', []).includes('ผ่อนถูก') && (
                            <li className="text-blue-600">✓ ผ่อนถูก</li>
                          )}
                          <li className="text-gray-900">✓ รับประกัน 1 ปี</li>
                        </ul>
                      </div>
                    </Link>

                    {/* Action Buttons - แยกออกจาก Link เพื่อป้องกัน nested anchor */}
                    <div className="flex gap-1 md:gap-2 p-3 pt-0 md:p-4 md:pt-0">
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full px-2 py-1 text-xs font-semibold shadow transition-colors"
                        onClick={() =>
                          window.open('https://lin.ee/8ugfzstD', '_blank', 'noopener,noreferrer')
                        }
                      >
                        LINE
                      </button>
                      <button
                        type="button"
                        className="flex-1 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white rounded-full px-2 py-1 text-xs font-semibold shadow transition-colors"
                        onClick={() => window.open('tel:094-0649018', '_self')}
                      >
                        โทร
                      </button>
                      <button
                        type="button"
                        className={`flex-1 flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold shadow border transition-all duration-200 ${
                          mounted && saved.includes(safeGet(car, 'id'))
                            ? 'bg-orange-600 text-white border-orange-600 shadow-lg'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-orange-600 hover:text-orange-600'
                        }`}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSave(safeGet(car, 'id'));
                        }}
                        aria-label={`${mounted && saved.includes(safeGet(car, 'id')) ? 'ยกเลิก' : ''}บันทึกรถ ${safeGet(car, 'title', 'รถยนต์')}`}
                      >
                        <svg
                          className="w-3 md:w-4 h-3 md:h-4"
                          fill={
                            mounted && saved.includes(safeGet(car, 'id')) ? 'currentColor' : 'none'
                          }
                          stroke="currentColor"
                          strokeWidth={mounted && saved.includes(safeGet(car, 'id')) ? 0 : 2}
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  {/* Previous Button */}
                  {currentPage > 1 && (
                    <button
                      onClick={e => handlePageChange(currentPage - 1, e)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors font-prompt text-gray-700 hover:text-orange-600"
                    >
                      ← ก่อนหน้า
                    </button>
                  )}

                  {/* First Page */}
                  {generatePageNumbers()[0] > 1 && (
                    <>
                      <button
                        onClick={e => handlePageChange(1, e)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors font-prompt text-gray-700 hover:text-orange-600"
                      >
                        1
                      </button>
                      {generatePageNumbers()[0] > 2 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {/* Page Numbers */}
                  {generatePageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={e => handlePageChange(page, e)}
                      className={`px-3 py-2 rounded-lg transition-colors font-prompt ${
                        page === currentPage
                          ? 'bg-orange-600 text-white border border-orange-600 font-bold shadow-lg'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  {currentPage < totalPages && (
                    <button
                      onClick={e => handlePageChange(currentPage + 1, e)}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors font-prompt text-gray-700 hover:text-orange-600"
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

    // จำกัดจำนวนรถสำหรับการ preload ลดเวลาโหลดเริ่มต้น
    if (cars.length > 50) {
      cars = cars.slice(0, 50); // จำกัดแค่ 50 คันแรกสำหรับ performance
    }
  } catch (e) {
    console.error('getAllCars error:', e);
    cars = [];
  }

  return {
    props: { cars },
  };
}
