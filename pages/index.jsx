import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO.jsx';
import Breadcrumb from '../components/Breadcrumb';
import NoSSR from '../components/NoSSR';
import { getHomepageCars } from '../lib/shopify.mjs';
import { safeGet, safeLocalStorage } from '../lib/safeFetch';
import Link from 'next/link';
import A11yImage from '../components/A11yImage';
import { useRouter } from 'next/router';
import { carAlt } from '../utils/a11y';

// Helper: format price safely for display and microdata using our safe utility
function getPriceInfo(amount) {
  try {
    const num = Number(amount);
    const valid = Number.isFinite(num) && num >= 0;
    return {
      valid,
      numeric: valid ? String(num) : undefined,
      display: valid ? num.toLocaleString() : 'ติดต่อสอบถาม',
    };
  } catch (error) {
    return {
      valid: false,
      numeric: undefined,
      display: 'ติดต่อสอบถาม',
    };
  }
}

export default function Home({ cars }) {
  // Facebook reviews: render only client
  const [showFbReviews, setShowFbReviews] = useState(false);
  const [saved, setSaved] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Load saved cars safely using safeLocalStorage
    const savedCars = safeLocalStorage('savedCars', []);
    setSaved(Array.isArray(savedCars) ? savedCars : []);

    // Delay Facebook reviews loading for better performance
    const timer = setTimeout(() => {
      setShowFbReviews(true);
    }, 2000); // โหลดหลังจากหน้าแรกโหลดเสร็จ 2 วินาที

    return () => clearTimeout(timer);
  }, []);

  // Handle search - redirect to all-cars with filters
  const handleSearch = () => {
    if (!mounted) return;

    const params = new URLSearchParams();
    const term = (searchTerm || '').trim().slice(0, 120);
    if (term) params.set('search', term);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (brandFilter !== 'all') params.set('brand', brandFilter);

    const queryString = params.toString();
    const url = queryString ? `/all-cars?${queryString}` : '/all-cars';
    router.push(url);
  };

  // Save/unsave cars with safe error handling
  function toggleSave(carId) {
    if (!mounted || typeof window === 'undefined' || !carId) return;

    try {
      const currentSaved = safeLocalStorage('savedCars', []);
      let updatedSaved = Array.isArray(currentSaved) ? [...currentSaved] : [];

      if (updatedSaved.includes(carId)) {
        updatedSaved = updatedSaved.filter(id => id !== carId);
      } else {
        updatedSaved.push(carId);
      }

      setSaved(updatedSaved);
      localStorage.setItem('savedCars', JSON.stringify(updatedSaved));
    } catch (error) {
      console.warn('Failed to save car preference:', error);
    }
  }

  const safeCars = Array.isArray(cars) ? cars : [];

  // ข้อมูลสำหรับ filters
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

  // Breadcrumb Schema
  const breadcrumbList = [
    { name: 'หน้าแรก', url: 'https://chiangmaiusedcar.com/' },
    { name: 'รถมือสองเชียงใหม่', url: 'https://chiangmaiusedcar.com/' },
  ];

  // Organization Schema moved to SEO component; avoid duplicating JSON-LD here

  // FAQ Schema
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ดาวน์ 0% จริงไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'จริง! ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชันและไฟแนนซ์',
        },
      },
      {
        '@type': 'Question',
        name: 'ติดเครดิตบูโรออกได้ไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สอบถามข้อมูลได้ทาง LINE, ส่วนมากไฟแนนซ์ให้โอกาส! แจ้งรายละเอียดกับทีมงาน',
        },
      },
      {
        '@type': 'Question',
        name: 'มีรับประกันไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'รับประกันเครื่องยนต์และเกียร์ 1 ปีเต็ม',
        },
      },
    ],
  };

  return (
    <div>
      <SEO
        title="รถมือสองเชียงใหม่ ฟรีดาวน์ 0% ผ่อนถูก รับประกัน 1 ปี | ครูหนึ่งรถสวย"
        description="ศูนย์รวมรถมือสองคุณภาพดีเชียงใหม่ รถบ้านแท้ 100% ฟรีดาวน์ 0% ผ่อนถูกสุด รับประกัน 1 ปี ส่งฟรีทั่วไทย ติดตาม Facebook 1M+ TikTok 150K+ โทร 094-064-9018"
        keywords="รถมือสองเชียงใหม่, รถบ้านแท้, ฟรีดาวน์, ผ่อนรถ, รถคุณภาพ, ครูหนึ่งรถสวย, รถมือสองคุณภาพ, Toyota Honda Nissan, สินเชื่อรถยนต์, รับประกันรถ, ส่งฟรีทั่วไทย"
        url="/"
        image="https://chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp"
        type="website"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'รถมือสองแนะนำ',
          description: 'รถมือสองคุณภาพดีจากครูหนึ่งรถสวย',
          numberOfItems: safeCars.length,
          itemListElement: safeCars.slice(0, 10).map((car, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Car',
              '@id': `https://chiangmaiusedcar.com/car/${car.handle}`,
              name: car.title,
              description: `${car.vendor || car.brand || ''} ${car.model || ''} ${car.year || ''} ราคา ${Number(car.price?.amount || 0).toLocaleString()} บาท`,
              brand: car.vendor || car.brand || 'รถมือสอง',
              model: car.model || '',
              year: car.year || '',
              image: car.images?.[0]?.url || '/herobanner/chiangmaiusedcar.webp',
              offers: {
                '@type': 'Offer',
                price: car.price?.amount || '0',
                priceCurrency: 'THB',
                availability: car.availableForSale
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
                seller: {
                  '@type': 'AutoDealer',
                  name: 'ครูหนึ่งรถสวย',
                },
              },
            },
          })),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbList.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.name,
              item: item.url,
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="relative w-full h-auto flex items-center justify-center bg-gradient-to-r from-orange-100 to-blue-100">
        <div className="relative w-full max-w-7xl mx-auto">
          <A11yImage
            src="/herobanner/chiangmaiusedcar.webp"
            alt="ปกเว็บ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            style={{ maxHeight: '80vh' }}
          />
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      <section id="hero" className="relative">
        <div className="hero-card max-w-4xl w-[90%] mx-auto my-6 flex flex-col md:flex-row items-center gap-6 px-6 py-8 rounded-2xl border border-orange-300 bg-white/95 shadow-lg">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
              รถมือสองเชียงใหม่
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-4">
              คุณภาพระดับพรีเมียม
            </h2>
            <p className="text-base leading-relaxed text-gray-900">
              ครูหนึ่งรถสวย ศูนย์รวมรถมือสองคุณภาพดีในเชียงใหม่ ฟรีดาวน์ ผ่อนถูก รับประกันหลังการขาย
              1 ปี จัดส่งฟรีทั่วประเทศ
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[200px]">
            <a
              href="https://lin.ee/8ugfzstD"
              className="inline-block text-center font-semibold rounded-full px-6 py-3 text-base bg-accent text-white hover:bg-accent-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              สอบถามรถยนต์
            </a>
            <Link
              href="/all-cars"
              className="inline-block text-center font-semibold rounded-full px-6 py-3 text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              ดูรถทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      <main
        className="max-w-7xl mx-auto px-4 md:px-6 py-16 bg-white font-prompt"
        id="recommended-cars"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-prompt">
            ค้นหารถที่คุณต้องการ
          </h2>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto font-prompt">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div>
                  <label htmlFor="searchTerm" className="sr-only">
                    ค้นหารถ
                  </label>
                  <input
                    type="text"
                    id="searchTerm"
                    placeholder="ค้นหารถ..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-gray-900 placeholder-gray-500 bg-white"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label htmlFor="priceRange" className="sr-only">
                    ช่วงราคา
                  </label>
                  <select
                    id="priceRange"
                    value={priceRange}
                    onChange={e => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-gray-900 bg-white"
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
                    value={brandFilter}
                    onChange={e => setBrandFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent text-gray-900 bg-white"
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
                    className="w-full bg-accent hover:bg-accent-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 font-prompt"
                  >
                    ค้นหา
                  </button>
                </div>
              </div>

              {/* Quick Links - Price Ranges (Modern 2025 Design) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link
                  href="/all-cars?price=0-100000"
                  className="group relative text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-blue-700 group-hover:text-blue-800">
                    ต่ำกว่า 1 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-500 group-hover:text-orange-600">
                    &lt; 100K
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/all-cars?price=100000-200000"
                  className="group relative text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-blue-700 group-hover:text-blue-800">
                    1-2 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-500 group-hover:text-orange-600">
                    100K-200K
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/all-cars?price=200000-300000"
                  className="group relative text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-blue-700 group-hover:text-blue-800">
                    2-3 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-500 group-hover:text-orange-600">
                    200K-300K
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/all-cars?price=400000-500000"
                  className="group relative text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-blue-700 group-hover:text-blue-800">
                    4-5 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-500 group-hover:text-orange-600">
                    400K-500K
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/all-cars?price=600000-700000"
                  className="group relative text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-blue-700 group-hover:text-blue-800">
                    6-7 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-500 group-hover:text-orange-600">
                    600K-700K
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/all-cars?price=700000"
                  className="group relative text-center p-3 bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-amber-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-orange-700 group-hover:text-orange-800">
                    7 แสนขึ้นไป
                  </div>
                  <div className="text-xs font-bold text-blue-500 group-hover:text-blue-600">
                    &gt; 700K
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          <p className="text-gray-600 font-prompt">รถคุณภาพดีที่เราคัดสรรมาเพื่อคุณโดยเฉพาะ</p>
        </div>
        <section
          aria-label="รถเข้าใหม่แนะนำวันนี้"
          className="grid gap-6 grid-cols-2 lg:grid-cols-4"
        >
          {!mounted ? (
            // Loading state ระหว่างรอ hydration - Skeleton Cards
            Array.from({ length: 8 }).map((_, index) => (
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
            ))
          ) : safeCars.length === 0 ? (
            // Empty state when no cars available
            <div className="col-span-full text-center py-12">
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
                className="inline-flex items-center bg-accent hover:bg-accent-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
              >
                <span>ติดต่อสอบถาม</span>
              </a>
            </div>
          ) : (
            safeCars.slice(0, 8).map(car => (
              <article
                key={car.id}
                className="group bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-orange-600/50 transition-all duration-300 overflow-hidden border-2 border-orange-600/40 hover:border-primary flex flex-col h-full relative font-prompt"
                itemScope
                itemType="https://schema.org/Product"
              >
                <Link
                  href={
                    safeGet(car, 'handle') && typeof car.handle === 'string' && car.handle.length
                      ? `/car/${encodeURIComponent(car.handle)}`
                      : '/all-cars'
                  }
                  className="block focus:outline-none flex-1"
                  tabIndex={0}
                >
                  <figure className="relative w-full h-32 md:h-48 overflow-hidden bg-orange-600/10">
                    <A11yImage
                      src={safeGet(car, 'images.0.url') || '/cover.jpg'}
                      alt={carAlt(car)}
                      fallbackAlt={`${safeGet(car, 'title', 'รถมือสองคุณภาพดี')} - ราคา ${getPriceInfo(safeGet(car, 'price.amount')).display} บาท`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      itemProp="image"
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 300px"
                    />
                    {safeGet(car, 'tags', []).includes('ใหม่') && (
                      <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        ใหม่
                      </span>
                    )}
                  </figure>
                  <div className="p-2 md:p-3 flex flex-col">
                    <h3
                      className="font-extrabold text-sm md:text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 font-prompt"
                      itemProp="name"
                    >
                      {safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
                    </h3>
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      {(() => {
                        const price = getPriceInfo(safeGet(car, 'price.amount'));
                        return (
                          <p
                            className="text-lg md:text-xl font-bold text-orange-600 font-prompt"
                            itemProp="offers"
                            itemScope
                            itemType="https://schema.org/Offer"
                          >
                            {price.numeric && <meta itemProp="price" content={price.numeric} />}
                            <meta itemProp="priceCurrency" content="THB" />
                            <span>฿{price.display}</span>
                          </p>
                        );
                      })()}
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
                <div className="flex gap-1 md:gap-2 p-3 pt-0 md:p-4 md:pt-0">
                  <div className="flex gap-1 md:gap-2 w-full">
                    <a
                      href="https://lin.ee/8ugfzstD"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full min-h-11 min-w-11 px-4 py-2 text-xs font-semibold shadow transition-colors"
                      aria-label="แชท LINE ครูหนึ่งรถสวย"
                      onClick={e => e.stopPropagation()}
                    >
                      LINE
                    </a>
                    <a
                      href={`tel:0940649018`}
                      className="flex-1 flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white rounded-full min-h-11 min-w-11 px-4 py-2 text-xs font-semibold shadow transition-colors"
                      aria-label="โทร 094-064-9018"
                      onClick={e => e.stopPropagation()}
                    >
                      โทร
                    </a>
                    <NoSSR
                      fallback={
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center rounded-full min-h-11 min-w-11 px-4 py-2 text-xs font-semibold shadow border bg-white text-gray-600 border-gray-300"
                          disabled
                        >
                          <svg
                            className="w-3 md:w-4 h-3 md:h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      }
                    >
                      <button
                        type="button"
                        className={`flex-1 flex items-center justify-center rounded-full min-h-11 min-w-11 px-4 py-2 text-xs font-semibold shadow border transition-all duration-200 ${
                          mounted && saved.includes(safeGet(car, 'id'))
                            ? 'bg-orange-600 text-white border-orange-600 shadow-lg'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-orange-600 hover:text-orange-600'
                        }`}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSave(safeGet(car, 'id'));
                        }}
                        aria-label={
                          mounted && saved.includes(safeGet(car, 'id'))
                            ? 'ลบออกจากที่บันทึก'
                            : 'บันทึกรถ'
                        }
                        title="บันทึกดูทีหลัง"
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
                    </NoSSR>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
        <div className="text-center mt-12">
          <Link
            href="/all-cars"
            className="inline-flex items-center bg-gray-900 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 border-2 border-orange-600 font-prompt"
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

      {/* รีวิว Facebook 9 รีวิวจริง */}
      {showFbReviews && (
        <section className="max-w-7xl mx-auto py-12 px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-prompt">
              รีวิวจากลูกค้าจริง
            </h2>
            <p className="text-lg text-accent font-prompt">
              ความประทับใจจากลูกค้าที่เลือกใช้บริการ ครูหนึ่งรถสวย
            </p>
          </div>
          <div className="relative overflow-hidden">
            {/* Desktop Arrow Buttons - ซ่อนในมือถือ */}
            <button
              type="button"
              className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              onClick={() => {
                const container = document.querySelector('.reviews-scroll-container');
                if (container && 'scrollBy' in container) {
                  container.scrollBy({ left: -320, behavior: 'smooth' });
                }
              }}
              aria-label="เลื่อนดูรีวิวก่อนหน้า"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-primary rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              onClick={() => {
                const container = document.querySelector('.reviews-scroll-container');
                if (container && 'scrollBy' in container) {
                  container.scrollBy({ left: 320, behavior: 'smooth' });
                }
              }}
              aria-label="เลื่อนดูรีวิวถัดไป"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Horizontal Scroll Container */}
            <div
              className="reviews-scroll-container flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 mx-0 md:mx-12 px-4 md:px-0"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {[
                {
                  url: 'https://www.facebook.com/oonmaxx/posts/pfbid0YcUhHBngfrZmqz4SWWF5rKkVFzrTSMyw4dzayqhbcnEFviMCEwWPc9vhqcQ5Fnzvl',
                  name: 'คุณอุ๋น',
                  text: 'บริการดีมาก รถสวย คุณภาพดี ส่งมาถึงบ้านตามที่นัดหมาย แนะนำเลยครับ',
                  rating: 5,
                },
                {
                  url: 'https://www.facebook.com/tai.thanchanok.7/posts/pfbid02o1H8XvSfrYBy3SJyHAjGQySsunfzAtL7pZha7pLCQnXj4GQXVQisp7mMXczdVrLol',
                  name: 'คุณใต้',
                  text: 'ขอบคุณครูหนึ่งรถสวยมากค่ะ ได้รถตามที่ใจหวัง ราคาดี คุ้มค่า',
                  rating: 5,
                },
                {
                  url: 'https://www.facebook.com/nongnoo.kookkook/posts/pfbid0tpxVdnyyomBdnd2UECRPa567pYnev2b2fTe9jcmVtK6mTWSQFTM8PmyQQRXx8Kqjl',
                  name: 'คุณหนู',
                  text: 'รถดีมาก เครื่องยนต์ดี ไม่มีปัญหา ขอบคุณที่ให้คำแนะนำดีๆ',
                  rating: 5,
                },
                {
                  url: 'https://www.facebook.com/NaowaratUpachal/posts/pfbid0K9xEwV4KmtjFaQvZ7g7PsVchrPE1vko4esuchpSuuvBNrwVfhJ1KMkiqhYhxKhtSl',
                  name: 'คุณเนาวรัตน์',
                  text: 'พอใจมากค่ะ รถตรงปก ไม่โกหก จัดส่งตรงเวลา',
                  rating: 5,
                },
                {
                  url: 'https://www.facebook.com/nongtee.myson/posts/pfbid02xgQBPEGhpPyeVemBEymTBUDmByZ33GJh2fvcWCfoznu5MjhQ82ZDptUXC53RHz5el',
                  name: 'คุณนงที',
                  text: 'ประทับใจการบริการ ให้คำปรึกษาดี รถคุณภาพดี แนะนำเพื่อนๆ',
                  rating: 5,
                },
                {
                  url: 'https://www.facebook.com/permalink.php?story_fbid=pfbid0XmfHjMnKrL6i2tn5W3UyJSHdx9K6wqY99bqfsBDR5rpGMrcj2mGufNtfYVY2nbFQl&id=100004184059361',
                  name: 'ลูกค้าครูหนึ่ง',
                  text: 'ได้รถดีมาก ไม่มีปัญหา เอกสารครบถ้วน บริการดีเยี่ยม',
                  rating: 5,
                },
                {
                  url: 'https://www.facebook.com/na.mo.payya.ym/posts/pfbid0ssojKSqnysqj4tidSPBTVfteipcWvDU1weJCE8doDAZKKq8S74vuyUy2qihwEww7l',
                  name: 'คุณนะโม',
                  text: 'ขอบคุณครูหนึ่งรถสวย ได้รับรถตามเวลาที่นัด รถสภาพดี',
                  rating: 5,
                },
                {
                  url: 'https://www.facebook.com/malee.daengprasert/posts/pfbid0LRfqmX9JGEZZvvFBnfK8GABoZmdSVB7VjAiWA8TfgvR7FHzed7h9XyD4pCpJLkGJl',
                  name: 'คุณมาลี',
                  text: 'โอเคมากเลย ครูหนึ่งให้คำแนะนำดี รถดี ราคาเป็นธรรม',
                  rating: 5,
                },
                {
                  url: 'https://www.facebook.com/chalida.twoslim/posts/pfbid02aZHpp5tcQUdhhT4SiR4c4zZv4HhrBGEEUiEuSYSNzzc1PF9yTiTrRgqZYwNXER31l',
                  name: 'คุณชลิดา',
                  text: 'ดีใจมากที่ได้รถมา สวยมาก ไม่มีตำหนิ ขอบคุณครูหนึ่งค่ะ',
                  rating: 5,
                },
              ].map((review, i) => (
                <article
                  key={i}
                  className="flex-none w-72 sm:w-80 md:w-96 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-44 sm:h-48 md:h-60 snap-center"
                >
                  <div className="relative h-full">
                    {/* ใช้ Static content แทน iframe สำหรับ production */}
                    <div className="w-full h-full bg-white border border-gray-200 rounded-lg p-3 md:p-4 overflow-hidden">
                      <div className="flex items-start space-x-2 md:space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 md:w-6 md:h-6 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs md:text-sm font-medium text-gray-900 mb-1">
                            {review.name}
                          </div>
                          <div className="text-xs text-gray-500 mb-1 md:mb-2">
                            รีวิวจาก Facebook
                          </div>
                          <div className="text-xs md:text-sm text-gray-700 line-clamp-3 md:line-clamp-4">
                            &ldquo;{review.text}&rdquo;
                          </div>
                          <div className="flex items-center mt-1 md:mt-2">
                            <div className="flex text-yellow-400 text-xs md:text-sm">
                              {'★'.repeat(review.rating)}
                            </div>
                            <span className="ml-1 text-xs text-gray-500">{review.rating}.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => window.open(review.url, '_blank', 'noopener,noreferrer')}
                      className="absolute bottom-1 md:bottom-2 right-1 md:right-2 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold shadow-lg transition-colors cursor-pointer"
                      aria-label={`ดูรีวิวเต็มของ ${review.name} บน Facebook`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          window.open(review.url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      อ่านรีวิวเต็ม
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Scroll Indicator - ปรับข้อความให้เหมาะสมกับมือถือ */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 font-prompt">
                <span className="md:hidden">เลื่อนดูรีวิวเพิ่มเติม</span>
                <span className="hidden md:inline">คลิกปุ่มลูกศร หรือ เลื่อนดูรีวิวเพิ่มเติม</span>
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <a
              href="https://www.facebook.com/KN2car"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
              aria-label="ดูรีวิวลูกค้าเพิ่มเติมบน Facebook ครูหนึ่งรถสวย"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>ดูรีวิวลูกค้าเพิ่มเติม</span>
            </a>
          </div>
        </section>
      )}

      <section className="bg-white py-8 mt-6 rounded-2xl max-w-4xl mx-auto shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-900 font-prompt px-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 px-4">
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-gray-900 cursor-pointer">ดาวน์ 0% จริงไหม?</summary>
            <div className="text-gray-700 pt-2 font-medium">
              จริง! ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชันและไฟแนนซ์
            </div>
          </details>
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-gray-900 cursor-pointer">
              ติดเครดิตบูโรออกได้ไหม?
            </summary>
            <div className="text-gray-700 pt-2 font-medium">
              สอบถามข้อมูลได้ทาง LINE, ส่วนมากไฟแนนซ์ให้โอกาส! แจ้งรายละเอียดกับทีมงาน
            </div>
          </details>
          <details className="bg-white rounded-xl p-4 shadow">
            <summary className="font-bold text-gray-900 cursor-pointer">มีรับประกันไหม?</summary>
            <div className="text-gray-700 pt-2 font-medium">
              รับประกันเครื่องยนต์และเกียร์ 1 ปีเต็ม
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}

// Keep SSR for homepage due to search functionality
export async function getServerSideProps() {
  let cars = [];
  try {
    const result = await getHomepageCars(8);
    cars = Array.isArray(result) ? result : [];
  } catch (e) {
    console.error('getHomepageCars error:', e);
    cars = [];
  }
  return {
    props: { cars },
  };
}
