import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO.jsx';
import { getHomepageCars, getBrandCounts } from '../lib/shopify.mjs';
import { safeGet } from '../lib/safeFetch';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { carAlt } from '../utils/a11y';
import A11yImage from '../components/A11yImage'; // Static import for LCP

// Lazy load non-critical components to reduce TBT
const Breadcrumb = dynamic(() => import('../components/Breadcrumb'), {
  loading: () => null,
});
const SocialShareButtons = dynamic(() => import('../components/SocialShareButtons'), {
  ssr: false,
  loading: () => null,
});

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

export default function Home({ cars, brandCounts }) {
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
  const [mounted, setMounted] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  const router = useRouter();

  // Memoize expensive computations
  const safeCars = useMemo(() => (Array.isArray(cars) ? cars : []), [cars]);

  // Memoize static data to prevent re-creation
  const brands = useMemo(
    () => ['all', 'toyota', 'honda', 'nissan', 'mazda', 'mitsubishi', 'isuzu', 'ford'],
    []
  );
  const priceRanges = useMemo(
    () => [
      { value: 'all', label: 'ทุกช่วงราคา' },
      { value: '0-100000', label: 'ต่ำกว่า 1 แสน' },
      { value: '100000-200000', label: '1-2 แสน' },
      { value: '200000-300000', label: '2-3 แสน' },
      { value: '300000-400000', label: '3-4 แสน' },
      { value: '400000-500000', label: '4-5 แสน' },
      { value: '500000-600000', label: '5-6 แสน' },
      { value: '600000-700000', label: '6-7 แสน' },
      { value: '700000', label: '7 แสนขึ้นไป' },
    ],
    []
  );

  // Optimize heavy functions with useCallback
  const handleSearch = useCallback(() => {
    if (!mounted) return;

    const params = new URLSearchParams();
    const term = (searchTerm || '').trim().slice(0, 120);
    if (term) params.set('search', term);
    if (priceRange !== 'all') params.set('price', priceRange);
    if (brandFilter !== 'all') params.set('brand', brandFilter);

    const queryString = params.toString();
    const url = queryString ? `/all-cars?${queryString}` : '/all-cars';
    router.push(url);
  }, [mounted, searchTerm, priceRange, brandFilter, router]);

  // Optimize useEffect - reduce blocking time
  useEffect(() => {
    setMounted(true);

    // Use requestIdleCallback for non-critical tasks
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(
        () => {
          setShowFbReviews(true);
        },
        { timeout: 2000 }
      );

      return () => {
        if (window.cancelIdleCallback) {
          window.cancelIdleCallback(idleCallback);
        }
      };
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        setShowFbReviews(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Memoize heavy JSON-LD to prevent re-creation on every render
  const breadcrumbList = useMemo(
    () => [
      { name: 'หน้าแรก', url: 'https://chiangmaiusedcar.com/' },
      { name: 'รถมือสองเชียงใหม่ ครูหนึ่งรถสวย', url: 'https://chiangmaiusedcar.com/' },
      { name: 'ฟรีดาวน์ 0% รถ ECO Car ประหยัดน้ำมัน', url: 'https://chiangmaiusedcar.com/' },
    ],
    []
  );

  // Memoize FAQ Schema to reduce computation
  const faqJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'ฟรีดาวน์ 0% รถมือสองเชียงใหม่ จริงไหม?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'จริง! ครูหนึ่งรถสวยให้ลูกค้าออกรถฟรีดาวน์ 0% ตามโปรโมชันและไฟแนนซ์ที่อนุมัติ รถ ECO Car ประหยัดน้ำมันและรธธรรมดาก็มี',
          },
        },
        {
          '@type': 'Question',
          name: 'เครดิตไม่ผ่าน ติดบูโรรถมือสองเชียงใหม่ออกได้ไหม?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ได้! ครูหนึ่งรถสวยมีไฟแนนซ์หลากหลายแบบ เครดิตไม่ผ่านก็มีทาง สอบถามข้อมูลได้ทาง LINE หรือโทร 094-064-9018',
          },
        },
        {
          '@type': 'Question',
          name: 'รถมือสองเชียงใหม่ ครูหนึ่งรถสวย มีรับประกันไหม?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ครูหนึ่งรถสวยให้รับประกันเครื่องยนต์และเกียร์ 1 ปีเต็ม รถ ECO Car ก็มีรับประกัน พร้อมบริการหลังการขายครบครัน',
          },
        },
        {
          '@type': 'Question',
          name: 'รถ ECO Car ประหยัดน้ำมันมือสองเชียงใหม่ มีไหม?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'มี! ครูหนึ่งรถสวยมีรถ ECO Car ประหยัดน้ำมันหลากหลายรุ่น Toyota Vios, Honda City, Nissan Almera พร้อมส่ง ประหยัดน้ำมันสุดๆ',
          },
        },
        {
          '@type': 'Question',
          name: 'ส่งรถฟรีทั่วไทย รถมือสองเชียงใหม่ จริงไหม?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'จริง! ครูหนึ่งรถสวยส่งฟรีทั่วไทย มีขนส่งเฉพาะและประกันภัยระหว่างขนส่ง ลูกค้ากรุงเทพ ภูเก็ต หาดใหญ่ สั่งได้เลย',
          },
        },
      ],
    }),
    []
  );

  return (
    <div>
      <SEO
        title="รถมือสองเชียงใหม่ คุณภาพดี ตรวจสภาพครบถ้วน | ครูหนึ่งรถสวย"
        description="รถมือสองเชียงใหม่คุณภาพดี ครูหนึ่งรถสวย ศูนย์รวมแบรนด์ดังครบครัน ตรวจสภาพครบถ้วน ฟรีดาวน์ 0% รับประกัน 1 ปี ส่งฟรีทั่วไทย Toyota Honda Nissan Mazda เช็คประวัติรถ โทร 094-064-9018"
        url="/"
        image="https://www.chiangmaiusedcar.com/herobanner/cnxcar.webp"
        type="website"
        pageType="home"
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
              '@id': `https://www.chiangmaiusedcar.com/car/${car.handle}`,
              name: car.title,
              description: `${car.vendor || car.brand || ''} ${car.model || ''} ${car.year || ''} ราคา ${Number(car.price?.amount || 0).toLocaleString()} บาท`,
              brand: car.vendor || car.brand || 'รถมือสอง',
              model: car.model || '',
              year: car.year || '',
              image: car.images?.[0]?.url || '/herobanner/cnxcar.webp',
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

      {/* Service Features Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': 'https://www.chiangmaiusedcar.com/#service',
            name: 'ความเป็นเลิศของครูหนึ่งรถสวย',
            description: 'ผู้นำด้านรถมือสองเชียงใหม่ด้วยมาตรฐานการบริการระดับสากล',
            provider: {
              '@id': 'https://www.chiangmaiusedcar.com/#organization',
            },
            serviceType: 'รถมือสองคุณภาพ',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'ศูนย์รวมแบรนด์ดังครบครัน',
              itemListElement: [
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Toyota รถมือสองเชียงใหม่',
                    description: 'รถ Toyota มือสอง 50+ คัน',
                    category: 'รถยนต์',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Honda รถมือสองเชียงใหม่',
                    description: 'รถ Honda มือสอง 30+ คัน',
                    category: 'รถยนต์',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Nissan รถมือสองเชียงใหม่',
                    description: 'รถ Nissan มือสอง 20+ คัน',
                    category: 'รถยนต์',
                  },
                },
                {
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Product',
                    name: 'Mazda รถมือสองเชียงใหม่',
                    description: 'รถ Mazda มือสอง 15+ คัน',
                    category: 'รถยนต์',
                  },
                },
              ],
            },
            features: [
              'รถบ้านแท้ 100% - 90% รถมือเดียว',
              'ฟรีดาวน์ 0% ตามเงื่อนไขไฟแนนซ์',
              'รับประกัน 1 ปีเต็ม ไม่จำกัดกิโลเมตร',
              'ส่งฟรีทั่วไทย จัดส่งฟรีทั่วประเทศ',
            ],
          }),
        }}
      />

      <header className="relative w-full h-auto flex items-center justify-center bg-gradient-to-r from-orange-100 to-blue-100">
        <div className="relative w-full max-w-[1400px] mx-auto">
          <A11yImage
            src="/herobanner/cnxcar.webp"
            alt="ปกเว็บ ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
            width={1920}
            height={640}
            className="w-full h-auto object-contain"
            priority
            quality={60}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1400px"
            style={{ maxHeight: '60vh' }}
          />
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      <section id="hero" className="relative">
        <div className="hero-card max-w-6xl w-[95%] mx-auto my-6 flex flex-col md:flex-row items-center gap-6 px-8 py-8 rounded-2xl border border-orange-300 bg-white/95 shadow-lg">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
              รถมือสองเชียงใหม่
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-orange-700 mb-4">
              คุณภาพระดับพรีเมียม
            </h2>
            <p className="text-base leading-relaxed text-gray-900">
              ครูหนึ่งรถสวย แพลตฟอร์มออนไลน์รถมือสองคุณภาพดีในเชียงใหม่ ตรวจสภาพครบถ้วน
              เช็คประวัติรถ ฟรีดาวน์ ผ่อนถูก รับประกันหลังการขาย 1 ปี จัดส่งฟรีทั่วประเทศ
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[200px]">
            <a
              href="https://lin.ee/8ugfzstD"
              className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base bg-accent text-white hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              target="_blank"
              rel="noopener noreferrer"
            >
              สอบถามรถยนต์
            </a>
            <Link
              href="/all-cars"
              className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ดูรถทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      <main
        className="max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12 py-16 bg-white font-prompt"
        id="recommended-cars"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-prompt">
            ค้นหารถที่คุณต้องการ
          </h2>

          {/* Search Bar - 2025 Modern Design */}
          <div className="max-w-6xl mx-auto font-prompt">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-gray-200">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 placeholder-gray-500 bg-white transition-all duration-200"
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
                  <label htmlFor="brandFilter" className="sr-only">
                    ยี่ห้อรถ
                  </label>
                  <select
                    id="brandFilter"
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

                {/* Search Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full bg-accent hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 font-prompt shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ค้นหา
                  </button>
                </div>
              </div>

              {/* Quick Links - Price Ranges (2025 Modern Clean Design) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link
                  href="/all-cars?price=0-100000"
                  className="group text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-primary group-hover:text-white">
                    ต่ำกว่า 1 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-700 group-hover:text-white">
                    {'< 100K'}
                  </div>
                </Link>
                <Link
                  href="/all-cars?price=100000-200000"
                  className="group text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-primary group-hover:text-white">
                    1-2 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-700 group-hover:text-white">
                    100K-200K
                  </div>
                </Link>
                <Link
                  href="/all-cars?price=200000-300000"
                  className="group text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-primary group-hover:text-white">
                    2-3 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-700 group-hover:text-white">
                    200K-300K
                  </div>
                </Link>
                <Link
                  href="/all-cars?price=400000-500000"
                  className="group text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-primary group-hover:text-white">
                    4-5 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-700 group-hover:text-white">
                    400K-500K
                  </div>
                </Link>
                <Link
                  href="/all-cars?price=600000-700000"
                  className="group text-center p-3 bg-white border-2 border-primary rounded-xl hover:bg-primary hover:border-primary transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-primary group-hover:text-white">
                    6-7 แสน
                  </div>
                  <div className="text-xs font-bold text-orange-700 group-hover:text-white">
                    600K-700K
                  </div>
                </Link>
                <Link
                  href="/all-cars?price=700000"
                  className="group text-center p-3 bg-white border-2 border-accent rounded-xl hover:bg-accent hover:border-accent transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="font-bold text-sm text-orange-700 group-hover:text-white">
                    7 แสนขึ้นไป
                  </div>
                  <div className="text-xs font-bold text-primary group-hover:text-white">
                    {'> 700K'}
                  </div>
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
          <p className="text-base text-gray-700 font-prompt leading-relaxed max-w-3xl mx-auto">
            รถคุณภาพดี ตรวจสภาพครบถ้วน เช็คประวัติรถ{' '}
            <span className="font-bold text-primary">คัดเฉพาะรถมือเดียว ประวัติใส 100%</span>{' '}
            คัดสรรมาเพื่อคุณโดยเฉพาะ ผ่านการตรวจสอบอย่างละเอียด เพื่อให้คุณมั่นใจในทุกการเดินทาง
          </p>
        </div>
        <section
          aria-label="รถเข้าใหม่แนะนำวันนี้"
          className="grid gap-2 md:gap-6 grid-cols-2 md:grid-cols-4"
        >
          {!mounted ? (
            // Loading state ระหว่างรอ hydration - Skeleton Cards
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl md:rounded-3xl shadow-lg overflow-hidden border-2 border-gray-200 animate-pulse"
              >
                <div className="w-full h-28 md:h-48 bg-gray-200"></div>
                <div className="p-2 md:p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="space-y-1 mb-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex">
                    <div className="w-full h-8 md:h-10 bg-gray-200 rounded-full"></div>
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
                className="group bg-white rounded-xl md:rounded-3xl shadow-lg hover:shadow-orange-600/50 transition-all duration-300 overflow-hidden border-2 border-orange-600/40 hover:border-primary flex flex-col h-full relative font-prompt"
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
                  <figure className="relative w-full h-28 md:h-48 overflow-hidden bg-orange-600/10">
                    <A11yImage
                      src={safeGet(car, 'images.0.url') || '/cover.jpg'}
                      alt={carAlt(car)}
                      fallbackAlt={`${safeGet(car, 'title', 'รถมือสองคุณภาพดี')} - ราคา ${getPriceInfo(safeGet(car, 'price.amount')).display} บาท`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      itemProp="image"
                      loading="lazy"
                      quality={75}
                      sizes="(max-width: 414px) 180px, (max-width: 768px) 320px, (max-width: 1024px) 256px, 320px"
                    />
                    {safeGet(car, 'tags', []).includes('ใหม่') && (
                      <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        ใหม่
                      </span>
                    )}
                  </figure>
                  <div className="p-2 md:p-4 flex flex-col">
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
                {/* Action Button - ปุ่มดูรายละเอียดเท่านั้น */}
                <div className="flex p-2 pt-0 md:p-4 md:pt-0">
                  <Link
                    href={
                      typeof safeGet(car, 'handle') === 'string' &&
                      safeGet(car, 'handle', '').length
                        ? `/car/${encodeURIComponent(safeGet(car, 'handle'))}`
                        : '/all-cars'
                    }
                    className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-2xl min-h-11 px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-prompt"
                    aria-label={`ดูรายละเอียด ${safeGet(car, 'title', 'รถยนต์')}`}
                  >
                    ดูรายละเอียด
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
        <div className="text-center mt-12">
          <Link
            href="/all-cars"
            className="inline-flex items-center bg-gray-900 hover:bg-accent text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 space-x-2 border-2 border-accent font-prompt"
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
        <section className="max-w-[1400px] mx-auto py-12 px-6 md:px-8 lg:px-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-prompt">
              รีวิวจากลูกค้าจริง
            </h2>
            <p className="text-lg text-orange-700 font-prompt">
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
              className="reviews-scroll-container flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 mx-0 md:mx-16 lg:mx-20 px-4 md:px-0"
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

      <section className="bg-white py-6 sm:py-8 mt-6 rounded-2xl max-w-6xl mx-auto border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary font-prompt px-4 sm:px-6">
          คำถามที่พบบ่อย
        </h2>
        <div className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          <details className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-5 hover:bg-gray-100 transition-colors group">
            <summary className="font-bold text-black cursor-pointer text-base sm:text-lg font-prompt flex items-center justify-between group-hover:text-primary transition-colors">
              ดาวน์ 0% จริงไหม?
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-open:rotate-180 transition-transform text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="text-gray-700 pt-3 sm:pt-4 text-sm sm:text-base font-prompt leading-relaxed">
              <span className="font-semibold text-orange-700">จริง!</span>{' '}
              ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชัน ตรวจสภาพครบถ้วน เช็คประวัติรถก่อนส่งมอบ
            </div>
          </details>
          <details className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-5 hover:bg-gray-100 transition-colors group">
            <summary className="font-bold text-black cursor-pointer text-base sm:text-lg font-prompt flex items-center justify-between group-hover:text-primary transition-colors">
              ติดเครดิตบูโรออกได้ไหม?
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-open:rotate-180 transition-transform text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="text-gray-700 pt-3 sm:pt-4 text-sm sm:text-base font-prompt leading-relaxed">
              <span className="font-semibold text-orange-700">ได้!</span>{' '}
              แพลตฟอร์มออนไลน์ของเรามีไฟแนนซ์หลากหลายแบบ สอบถามข้อมูลได้ทาง LINE หรือโทร
              <a href="tel:0940649018" className="text-primary font-bold hover:underline ml-1">
                094-064-9018
              </a>
            </div>
          </details>
          <details className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-5 hover:bg-gray-100 transition-colors group">
            <summary className="font-bold text-black cursor-pointer text-base sm:text-lg font-prompt flex items-center justify-between group-hover:text-primary transition-colors">
              มีรับประกันไหม?
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-open:rotate-180 transition-transform text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="text-gray-700 pt-3 sm:pt-4 text-sm sm:text-base font-prompt leading-relaxed">
              <span className="font-semibold text-orange-700">รับประกัน</span>เครื่องยนต์และเกียร์{' '}
              <span className="font-bold text-primary">1 ปีเต็ม</span> ตรวจสภาพครบถ้วนก่อนส่งมอบ
              พร้อมบริการหลังการขายครบครัน
            </div>
          </details>
        </div>
      </section>

      {/* Why Choose Us Section - 2025 Modern Design */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-accent/5 py-16 mt-8 rounded-3xl max-w-[1400px] mx-auto border border-primary/10 shadow-xl">
        <div className="px-6 md:px-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-prompt">
              ความเป็นเลิศของครูหนึ่งรถสวย
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-prompt leading-relaxed">
              <span className="text-primary font-semibold">รถบ้านแท้ 90% มือเดียว</span>{' '}
              ไม่มีรถประมูล ตรวจสภาพครบถ้วนก่อนส่งมอบ{' '}
              <span className="text-accent font-semibold">ลูกค้า 90% เชื่อมั่น</span> ไม่ต้องมาดูรถ
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-6"></div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-colors">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-prompt">รถบ้านแท้ 100%</h3>
              <p className="text-gray-600 leading-relaxed font-prompt text-sm">
                <span className="text-primary font-semibold">90% รถมือเดียว</span> จากเจ้าของโดยตรง
                ไม่มีรถประมูล ไม่มีรถอุบัติเหตุ ตรวจเล่มได้ทุกหน้า
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mb-4 group-hover:bg-accent/20 transition-colors">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-prompt">ฟรีดาวน์ 0%</h3>
              <p className="text-gray-600 leading-relaxed font-prompt text-sm">
                <span className="text-accent font-semibold">ออกรถไม่ต้องวางเงินดาวน์</span>{' '}
                ตามเงื่อนไขไฟแนนซ์{' '}
                <span className="text-primary font-semibold">เครดิตไม่ผ่านก็มีทาง</span>
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-colors">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-prompt">รับประกัน 1 ปี</h3>
              <p className="text-gray-600 leading-relaxed font-prompt text-sm">
                รับประกันเครื่องยนต์และเกียร์{' '}
                <span className="text-primary font-semibold">1 ปีเต็ม ไม่จำกัดกิโลเมตร</span> พร้อม
                <span className="text-accent font-semibold">บริการหลังการขาย 24/7</span>
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mb-4 group-hover:bg-accent/20 transition-colors">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-prompt">ส่งฟรีทั่วไทย</h3>
              <p className="text-gray-600 leading-relaxed font-prompt text-sm">
                <span className="text-accent font-semibold">จัดส่งฟรีทุกจังหวัด</span>{' '}
                พร้อมประกันการขนส่ง{' '}
                <span className="text-primary font-semibold">ลูกค้า 90% เชื่อมั่น</span>{' '}
                ไม่ต้องมาดูรถ
              </p>
            </div>
          </div>

          {/* Car Brands Section */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-prompt leading-tight">
                ศูนย์รวมแบรนด์ดังครบครัน
              </h3>
              <p className="text-gray-600 font-prompt text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                รถมือสองคุณภาพจากทุกแบรนด์ชั้นนำ ผ่านการคัดสรรอย่างเข้มงวด
              </p>
            </div>

            {/* Brand Grid - Enhanced 2025 Design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 lg:gap-6 mb-8">
              <Link
                href="/all-cars?brand=toyota"
                className="group relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md active:scale-98"
                aria-label="ดูรถ Toyota ทั้งหมด"
              >
                <div className="font-bold text-primary text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt">
                  Toyota
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100 rounded-lg py-1 px-2 font-prompt">
                  {getBrandCount('toyota')}
                </div>
              </Link>

              <Link
                href="/all-cars?brand=honda"
                className="group relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md active:scale-98"
                aria-label="ดูรถ Honda ทั้งหมด"
              >
                <div className="font-bold text-primary text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt">
                  Honda
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100 rounded-lg py-1 px-2 font-prompt">
                  {getBrandCount('honda')}
                </div>
              </Link>

              <Link
                href="/all-cars?brand=nissan"
                className="group relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md active:scale-98"
                aria-label="ดูรถ Nissan ทั้งหมด"
              >
                <div className="font-bold text-primary text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt">
                  Nissan
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100 rounded-lg py-1 px-2 font-prompt">
                  {getBrandCount('nissan')}
                </div>
              </Link>

              <Link
                href="/all-cars?brand=mazda"
                className="group relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md active:scale-98"
                aria-label="ดูรถ Mazda ทั้งหมด"
              >
                <div className="font-bold text-primary text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt">
                  Mazda
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100 rounded-lg py-1 px-2 font-prompt">
                  {getBrandCount('mazda')}
                </div>
              </Link>

              <Link
                href="/all-cars?brand=mitsubishi"
                className="group relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md active:scale-98"
                aria-label="ดูรถ Mitsubishi ทั้งหมด"
              >
                <div className="font-bold text-primary text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt">
                  Mitsubishi
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100 rounded-lg py-1 px-2 font-prompt">
                  {getBrandCount('mitsubishi')}
                </div>
              </Link>

              <Link
                href="/all-cars?brand=ford"
                className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-gray-200 hover:border-gray-300 hover:shadow-md active:scale-98 transition-all duration-200"
                aria-label="ดูรถ Ford ทั้งหมด"
              >
                <div className="font-bold text-primary text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt">
                  Ford
                </div>
                <div className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100 rounded-lg py-1 px-2 font-prompt">
                  {getBrandCount('ford')}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
              </Link>
            </div>

            {/* Service Links - Enhanced 2025 Design */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              <Link
                href="/contact"
                className="group relative bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/90 hover:via-primary/85 hover:to-primary/80 text-white font-semibold text-xs md:text-sm py-3 md:py-4 px-3 md:px-4 rounded-xl md:rounded-2xl text-center transition-all duration-500 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1 active:scale-95 overflow-hidden font-prompt"
                aria-label="ติดต่อสอบถามข้อมูลรถยนต์"
              >
                <span className="relative z-10">ติดต่อเรา</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <Link
                href="/about"
                className="group relative bg-gradient-to-r from-gray-100 via-gray-50 to-white hover:from-primary/10 hover:via-primary/5 hover:to-white text-primary hover:text-primary font-semibold text-xs md:text-sm py-3 md:py-4 px-3 md:px-4 rounded-xl md:rounded-2xl text-center border border-gray-200/60 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 active:scale-95 overflow-hidden font-prompt"
                aria-label="เรียนรู้เพิ่มเติมเกี่ยวกับครูหนึ่งรถสวย"
              >
                <span className="relative z-10">เกี่ยวกับเรา</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <Link
                href="/promotion"
                className="group relative bg-gradient-to-r from-accent via-accent/95 to-accent/90 hover:from-accent/90 hover:via-accent/85 hover:to-accent/80 text-white font-semibold text-xs md:text-sm py-3 md:py-4 px-3 md:px-4 rounded-xl md:rounded-2xl text-center transition-all duration-500 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-1 active:scale-95 overflow-hidden font-prompt"
                aria-label="ดูโปรโมชั่นและข้อเสนอพิเศษ"
              >
                <span className="relative z-10">โปรโมชั่น</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <Link
                href="/credit-check"
                className="group relative bg-gradient-to-r from-gray-100 via-gray-50 to-white hover:from-primary/10 hover:via-primary/5 hover:to-white text-primary hover:text-primary font-semibold text-xs md:text-sm py-3 md:py-4 px-3 md:px-4 rounded-xl md:rounded-2xl text-center border border-gray-200/60 hover:border-primary/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 active:scale-95 overflow-hidden font-prompt"
                aria-label="ตรวจสอบสถานะสินเชื่อ"
              >
                <span className="relative z-10">ตรวจเครดิต</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <Link
                href="/payment-calculator"
                className="group relative bg-gradient-to-r from-gray-100 via-gray-50 to-white hover:from-accent/10 hover:via-accent/5 hover:to-white text-accent hover:text-accent font-semibold text-xs md:text-sm py-3 md:py-4 px-3 md:px-4 rounded-xl md:rounded-2xl text-center border border-gray-200/60 hover:border-accent/40 transition-all duration-500 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 active:scale-95 overflow-hidden font-prompt"
                aria-label="คำนวณเงินผ่อนรถยนต์"
              >
                <span className="relative z-10">คิดเงินผ่อน</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
              <Link
                href="/sell-car"
                className="group relative bg-gradient-to-r from-gray-100 via-gray-50 to-white hover:from-accent/10 hover:via-accent/5 hover:to-white text-accent hover:text-accent font-semibold text-xs md:text-sm py-3 md:py-4 px-3 md:px-4 rounded-xl md:rounded-2xl text-center border border-gray-200/60 hover:border-accent/40 transition-all duration-500 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 active:scale-95 overflow-hidden font-prompt"
                aria-label="ขายรถกับครูหนึ่งรถสวย"
              >
                <span className="relative z-10">ขายรถ</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Share Buttons - Fixed Position */}
      {mounted && (
        <SocialShareButtons
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่คุณภาพดี"
          description="รถมือสองเชียงใหม่คุณภาพดี ฟรีดาวน์ ดอกเบี้ยต่ำ รับประกัน 1 ปี ส่งฟรีทั่วไทย"
          position="fixed"
        />
      )}
    </div>
  );
}

// ISR - Homepage with car listings - revalidate every 5 minutes
export async function getStaticProps() {
  let cars = [];
  let brandCounts = {};

  try {
    const result = await getHomepageCars(8);
    cars = Array.isArray(result) ? result : [];
  } catch (e) {
    console.error('getHomepageCars error:', e);
    cars = [];
  }

  try {
    const counts = await getBrandCounts();
    brandCounts = counts || {};
  } catch (e) {
    console.error('getBrandCounts error:', e);
    brandCounts = {};
  }

  return {
    props: { cars, brandCounts },
    revalidate: 300, // 5 minutes
  };
}
