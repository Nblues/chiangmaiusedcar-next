import React, { useState } from 'react';
import Head from 'next/head';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import SimilarCars from '../../components/SimilarCars';
import { getAllCars } from '../../lib/shopify.mjs';
import { buildCarJsonLd, buildProductJsonLd, buildImageObjectJsonLd } from '../../lib/seo/jsonld';
import { safeGet, safeFormatPrice } from '../../lib/safeFetch';
import Link from 'next/link';
import A11yImage from '../../components/A11yImage';
import { carAlt } from '../../utils/a11y';

function CarDetailPage({ car, allCars }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // Preload next/prev images for instant switching
  React.useEffect(() => {
    const images = safeGet(car, 'images', []);
    if (images.length < 2) return;
    const preloadIndexes = [];
    if (selectedImageIndex < images.length - 1) preloadIndexes.push(selectedImageIndex + 1);
    if (selectedImageIndex > 0) preloadIndexes.push(selectedImageIndex - 1);
    preloadIndexes.forEach(idx => {
      const img = new window.Image();
      img.src = safeGet(images[idx], 'url', '');
    });
  }, [selectedImageIndex, car]);

  // Keyboard navigation for image gallery
  React.useEffect(() => {
    const images = safeGet(car, 'images', []);
    if (images.length < 2) return;

    const handleKeyDown = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [car]);

  // Reset loading state when image changes
  React.useEffect(() => {
    setImageLoading(true);
  }, [selectedImageIndex]);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h1 className="text-2xl font-bold text-gray-600 mb-2 font-prompt">ไม่พบข้อมูลรถคันนี้</h1>
          <p className="text-gray-500 font-prompt mb-6">
            รถคันนี้อาจถูกขายไปแล้ว หรือลิงก์อาจไม่ถูกต้อง
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/all-cars"
              className="inline-flex items-center bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
            >
              <span>← ดูรถทั้งหมด</span>
            </Link>
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-accent hover:bg-accent-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 space-x-2 font-prompt"
            >
              <span>สอบถามรถอื่น</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // เตรียมรูปภาพ
  const carImages = safeGet(car, 'images', [
    { url: '/herobanner/chiangmaiusedcar.webp', alt: safeGet(car, 'title', 'รถมือสอง') },
  ]);
  const currentImage = carImages[selectedImageIndex] || carImages[0];

  // เตรียม JSON-LD schema สำหรับ SEO
  const carSpecs = {
    year: safeGet(car, 'year'),
    transmission: safeGet(car, 'transmission', 'Unknown'),
    fuelType: safeGet(car, 'fuel_type', 'Gasoline'),
    engineSize: safeGet(car, 'engine'),
    mileage: safeGet(car, 'mileage'),
    seats: safeGet(car, 'seats'),
    color: safeGet(car, 'color'),
  };

  const carProduct = {
    url: `https://chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`,
    name: safeGet(car, 'title', 'รถมือสองคุณภาพดี'),
    description:
      safeGet(car, 'description') ||
      `${safeGet(car, 'vendor', '') || safeGet(car, 'brand', '')} ${safeGet(car, 'model', '')} ${safeGet(car, 'year', '')} มือสองเชียงใหม่ สภาพสวย ราคาดี`,
    images: carImages.map(img =>
      safeGet(img, 'url', '').startsWith('/')
        ? `https://chiangmaiusedcar.com${safeGet(img, 'url', '')}`
        : safeGet(img, 'url', '')
    ),
    brand: safeGet(car, 'vendor') || safeGet(car, 'brand'),
    sku: safeGet(car, 'id') || safeGet(car, 'handle'),
    mpn: safeGet(car, 'vin'),
    price: safeGet(car, 'price.amount'),
    currency: safeGet(car, 'price.currencyCode', 'THB'),
    inStock: safeGet(car, 'availableForSale', true) !== false,
    priceValidDays: 90,
    sellerName: 'ครูหนึ่งรถสวย',
  };

  const carJsonLd = buildCarJsonLd(carSpecs, carProduct);
  const productJsonLd = buildProductJsonLd(carProduct);

  // Enhanced SEO data for better link sharing - optimized for social media
  const brandModel = [safeGet(car, 'vendor') || safeGet(car, 'brand'), safeGet(car, 'model')]
    .filter(Boolean)
    .join(' ');

  const yearPrice = [
    safeGet(car, 'year') ? `ปี ${safeGet(car, 'year')}` : '',
    `${safeFormatPrice(safeGet(car, 'price.amount')).display}฿`,
  ]
    .filter(Boolean)
    .join(' ');

  // Social media optimized title (max 60 chars for Facebook)
  const enhancedTitle = `${brandModel} ${yearPrice} | ครูหนึ่งรถสวย`.substring(0, 58);

  // Social media optimized description (max 155 chars for Facebook)
  const enhancedDescription = [
    `${brandModel} ${yearPrice}`,
    safeGet(car, 'mileage')
      ? `วิ่ง ${Number(safeGet(car, 'mileage', 0)).toLocaleString()} กม.`
      : '',
    'รถบ้านแท้ รับประกัน เชียงใหม่',
  ]
    .filter(Boolean)
    .join(' • ')
    .substring(0, 150);

  // Enhanced image for social sharing - ensure high quality and absolute URL
  let socialImage = safeGet(currentImage, 'url', '');

  // Handle relative URLs
  if (socialImage.startsWith('/')) {
    socialImage = `https://chiangmaiusedcar.com${socialImage}`;
  }

  // Fallback to default high-quality image if no car image
  if (!socialImage || socialImage === 'https://chiangmaiusedcar.com') {
    socialImage = 'https://chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp';
  }

  // Add cache busting and optimization for Facebook sharing
  if (socialImage && !socialImage.includes('?')) {
    // Add timestamp for cache busting Facebook cards
    const timestamp = Date.now();
    socialImage = `${socialImage}?v=${timestamp}&w=1200&h=630&fit=crop&auto=format&q=90`;
  }

  // Debug mode - log for development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('🔍 Car Detail SEO Debug:', {
      title: enhancedTitle,
      description: enhancedDescription,
      image: socialImage,
      url: `/car/${safeGet(car, 'handle', '')}`,
      brandModel,
      yearPrice,
    });
  }

  return (
    <>
      <SEO
        title={enhancedTitle}
        description={enhancedDescription}
        image={socialImage}
        url={`/car/${safeGet(car, 'handle', '')}`}
        type="product"
        pageType="car"
        carData={{
          ...car,
          title: enhancedTitle,
          description: enhancedDescription,
          brand: safeGet(car, 'vendor') || safeGet(car, 'brand', 'รถมือสอง'),
          model: safeGet(car, 'model', ''),
          year: safeGet(car, 'year', ''),
          images: carImages.map(img => ({
            ...img,
            url: safeGet(img, 'url', '').startsWith('/')
              ? `https://chiangmaiusedcar.com${safeGet(img, 'url', '')}`
              : safeGet(img, 'url', ''),
          })),
        }}
        keywords={[
          safeGet(car, 'title'),
          safeGet(car, 'vendor') || safeGet(car, 'brand'),
          safeGet(car, 'model'),
          `${safeGet(car, 'vendor', '')} ${safeGet(car, 'model', '')}`,
          `รถมือสอง${safeGet(car, 'vendor', '')}`,
          `${safeGet(car, 'vendor', '')}มือสอง`,
          safeGet(car, 'year') ? `${safeGet(car, 'vendor', '')} ${safeGet(car, 'year')}` : '',
          'รถมือสองเชียงใหม่',
          'รถบ้านแท้',
          'ฟรีดาวน์',
          'ผ่อนถูก',
          'รับประกัน',
          'ส่งฟรีทั่วไทย',
          'ครูหนึ่งรถสวย',
        ]
          .filter(Boolean)
          .join(', ')}
      />

      {/* Enhanced Car Product JSON-LD Schema */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...carJsonLd,
              name: enhancedTitle,
              description: enhancedDescription,
              image: carImages.map(img =>
                safeGet(img, 'url', '').startsWith('/')
                  ? `https://chiangmaiusedcar.com${safeGet(img, 'url', '')}`
                  : safeGet(img, 'url', '')
              ),
              url: `https://chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`,
              offers: {
                ...carJsonLd.offers,
                description: enhancedDescription,
                category: 'รถยนต์มือสอง',
                hasMerchantReturnPolicy: {
                  '@type': 'MerchantReturnPolicy',
                  applicableCountry: 'TH',
                  returnPolicyCategory: 'http://schema.org/MerchantReturnUnlimitedWindow',
                  merchantReturnDays: 7,
                  returnFees: 'http://schema.org/FreeReturn',
                },
                warranty: {
                  '@type': 'WarrantyPromise',
                  durationOfWarranty: 'P1Y',
                  warrantyScope: 'เครื่องยนต์และเกียร์',
                },
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...productJsonLd,
              name: enhancedTitle,
              description: enhancedDescription,
              image: carImages.map(img =>
                safeGet(img, 'url', '').startsWith('/')
                  ? `https://chiangmaiusedcar.com${safeGet(img, 'url', '')}`
                  : safeGet(img, 'url', '')
              ),
            }),
          }}
        />

        {/* Enhanced Breadcrumb JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'หน้าแรก',
                  item: 'https://chiangmaiusedcar.com/',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'รถทั้งหมด',
                  item: 'https://chiangmaiusedcar.com/all-cars',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: safeGet(car, 'vendor') || safeGet(car, 'brand', 'รถมือสอง'),
                  item: `https://chiangmaiusedcar.com/all-cars?brand=${encodeURIComponent(safeGet(car, 'vendor', '') || safeGet(car, 'brand', ''))}`,
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  name: safeGet(car, 'title', 'รถมือสองคุณภาพดี'),
                  item: `https://chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`,
                },
              ],
            }),
          }}
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-gray-50">
        <div className="max-w-6xl mx-auto p-2 sm:p-4 lg:p-6">
          <Breadcrumb carTitle={safeGet(car, 'title', 'รถมือสองคุณภาพดี')} />

          {/* ชื่อรถ */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-primary/10">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3 font-prompt">
              {safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
            </h1>
          </div>

          {/* รูปรถ - Carsome Style */}
          <div className="mb-6 sm:mb-8">
            <div className="relative w-full h-[220px] sm:h-[350px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden shadow-lg border-2 border-primary/20">
              {/* Loading overlay */}
              {imageLoading && (
                <div className="absolute inset-0 bg-primary/10 animate-pulse flex items-center justify-center">
                  <div className="text-primary font-prompt">กำลังโหลดรูป...</div>
                </div>
              )}

              <A11yImage
                src={safeGet(currentImage, 'url', '/herobanner/chiangmaiusedcar.webp')}
                alt={carAlt(car)}
                fallbackAlt={safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
                fill
                className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                priority
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />

              {/* Navigation buttons */}
              {carImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(prev => (prev === 0 ? carImages.length - 1 : prev - 1))
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200"
                    type="button"
                    aria-label="รูปก่อนหน้า"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(prev => (prev === carImages.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200"
                    type="button"
                    aria-label="รูปถัดไป"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter แบบ Carsome */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-primary/80 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium font-prompt backdrop-blur-sm shadow-md">
                <span className="text-white">{selectedImageIndex + 1}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-gray-300">{carImages.length}</span>
                <span className="text-gray-300 ml-2">ภาพรถจริง</span>
              </div>

              {/* Keyboard hint */}
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-primary/70 text-white px-2 py-1 rounded text-xs font-prompt hidden sm:block">
                ใช้ ← → เพื่อเลื่อนรูป
              </div>
            </div>

            {/* Thumbnails - Carsome Style */}
            {carImages.length > 1 && (
              <div className="hidden sm:flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {carImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedImageIndex(index);
                      }
                    }}
                    tabIndex={0}
                    className={`relative flex-shrink-0 w-20 h-16 lg:w-24 lg:h-18 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      selectedImageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    type="button"
                    aria-label={`ดูรูปที่ ${index + 1}`}
                  >
                    <A11yImage
                      src={safeGet(img, 'url', '/herobanner/chiangmaiusedcar.webp')}
                      alt={`${carAlt(car)} รูปที่ ${index + 1}`}
                      fallbackAlt={`รูปที่ ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                      loading="lazy"
                    />
                    {/* Selected indicator */}
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Thumbnails */}
            {carImages.length > 1 && (
              <div className="sm:hidden">
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                  {carImages.map((img, index) => (
                    <button
                      key={`mobile-${index}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-blue-500 ring-1 ring-blue-200'
                          : 'border-gray-200'
                      }`}
                      type="button"
                      aria-label={`ดูรูปที่ ${index + 1}`}
                    >
                      <A11yImage
                        src={safeGet(img, 'url', '/herobanner/chiangmaiusedcar.webp')}
                        alt={`${carAlt(car)} รูปที่ ${index + 1}`}
                        fallbackAlt={`รูปที่ ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ข้อมูลหลักรถ - Carsome Style */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-primary/10">
            {/* Social Sharing */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-prompt">แชร์รถคันนี้</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    const shareUrl = `https://chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`;
                    const shareText = `${safeGet(car, 'title', 'รถมือสองคุณภาพดี')} ราคา ${safeFormatPrice(safeGet(car, 'price.amount')).display} บาท | ครูหนึ่งรถสวย`;
                    navigator.share
                      ? navigator.share({ title: shareText, url: shareUrl })
                      : navigator.clipboard
                          .writeText(`${shareText} ${shareUrl}`)
                          .then(() => alert('คัดลอกลิ้งค์แล้ว!'));
                  }}
                  className="btn-secondary flex items-center gap-2 min-h-11 min-w-11 px-4 py-2 rounded-xl font-prompt"
                  aria-label="แชร์ข้อมูลรถคันนี้"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  แชร์ข้อมูลรถ
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 min-h-11 min-w-11 px-4 py-2 rounded-xl font-prompt"
                  aria-label="แชร์รถคันนี้บน Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  แชร์ Facebook
                </a>
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 min-h-11 min-w-11 px-4 py-2 rounded-xl font-prompt"
                  aria-label="แชร์รถคันนี้ทาง LINE"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z" />
                  </svg>
                  แชร์ LINE
                </a>
              </div>
            </div>
            {/* สเปคหลัก - แนวนอนแบบ Carsome */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-700 mb-6 font-prompt">
              {safeGet(car, 'mileage') && (
                <>
                  <span className="font-semibold">
                    {Number(safeGet(car, 'mileage', 0)).toLocaleString()} กม.
                  </span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {safeGet(car, 'transmission') && (
                <>
                  <span className="font-semibold">{safeGet(car, 'transmission')}</span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {safeGet(car, 'year') && (
                <>
                  <span className="font-semibold">{safeGet(car, 'year')}</span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {safeGet(car, 'engine') && (
                <span className="font-semibold">{safeGet(car, 'engine')}</span>
              )}
            </div>
            {/* ราคาโดดเด่นแบบ Carsome */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* ราคาหลัก */}
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-accent mb-2 font-prompt">
                  {safeFormatPrice(safeGet(car, 'price.amount')).display} บาท
                </div>
                {/* ค่าผ่อนประมาณ - คำนวณแบบ Carsome */}
                <div className="text-lg text-primary font-prompt">
                  {Math.round(Number(safeGet(car, 'price.amount', 0)) * 0.0195).toLocaleString()}{' '}
                  บาท /เดือน
                </div>
              </div>

              {/* ปุ่มหลัก */}
              <div className="flex flex-col gap-2 sm:gap-3">
                <Link
                  href={`/payment-calculator?price=${safeGet(car, 'price.amount', 0)}&from=car&carTitle=${encodeURIComponent(safeGet(car, 'title', 'รถมือสองคุณภาพดี'))}`}
                  className="btn-primary text-center py-4 px-6 rounded-xl font-bold text-lg transition-colors font-prompt w-full"
                >
                  เครื่องคำนวณสินเชื่อรถยนต์
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <a
                    href="tel:0940649018"
                    className="btn-secondary text-center py-3 px-4 rounded-xl font-bold transition-colors font-prompt w-full"
                    aria-label="โทร 094-064-9018"
                  >
                    โทรหาฉัน
                  </a>
                  <a
                    href="https://line.me/ti/p/@krunuengusedcar"
                    className="bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-xl font-bold transition-colors font-prompt w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="แชท LINE ครูหนึ่งรถสวย"
                  >
                    ทดลองขับฟรี
                  </a>
                </div>
              </div>
            </div>
            {/* Badge ความน่าเชื่อถือแบบ Carsome */}
            <div className="bg-white border-2 border-primary/20 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold text-black font-prompt">
                    ครูหนึ่งรถสวย การันตีคุณภาพ
                  </span>
                </div>
              </div>
              <div className="text-black text-sm font-prompt font-medium">
                ✓ ไม่มีข้อบกพร่อง ✓ ไม่ชนหนัก ✓ ไม่เคยผ่านน้ำท่วม ✓ ไม่มีความเสียหายจากไฟไหม้
              </div>
            </div>{' '}
            {/* ข้อมูลรายละเอียดรถ */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-prompt">รายละเอียดรถยนต์</h2>

              {/* ข้อมูลพื้นฐาน */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {car.vendor && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">ยี่ห้อ</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">{car.vendor}</div>
                  </div>
                )}
                {car.model && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">รุ่น</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">{car.model}</div>
                  </div>
                )}
                {car.year && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">ปี</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">{car.year}</div>
                  </div>
                )}
                {car.color && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">สี</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">{car.color}</div>
                  </div>
                )}
                {car.mileage && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เลขไมล์</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">
                      {Number(car.mileage).toLocaleString()} กม.
                    </div>
                  </div>
                )}
                {car.transmission && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เกียร์</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">
                      {car.transmission}
                    </div>
                  </div>
                )}
                {car.fuel_type && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เชื้อเพลิง</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">
                      {car.fuel_type}
                    </div>
                  </div>
                )}
                {car.engine && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เครื่องยนต์</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">{car.engine}</div>
                  </div>
                )}
                {car.province && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">จังหวัด</div>
                    <div className="text-lg font-bold text-gray-900 font-prompt">
                      {car.province}
                    </div>
                  </div>
                )}
              </div>

              {/* คำอธิบาย */}
              {car.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 font-prompt">คำอธิบาย</h3>
                  <div className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-line font-prompt leading-relaxed">
                    {car.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ข้อมูลการติดต่อและสถานที่ */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-primary/10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-prompt">
              ที่ตั้งรถและการติดต่อ
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* ข้อมูลสถานที่ */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold text-gray-900 font-prompt">
                    ครูหนึ่งรถสวย เชียงใหม่
                  </span>
                </div>
                <div className="text-gray-600 font-prompt mb-4">
                  ร้านรถมือสองมาตรฐาน ตรวจสภาพละเอียด รับประกันคุณภาพ
                </div>
                <div className="text-sm text-gray-500 font-prompt">เปิดทุกวัน 09:00 - 20:00</div>
              </div>

              {/* ปุ่มติดต่อ */}
              <div className="space-y-3">
                <a
                  href="tel:0940649018"
                  className="btn-primary block text-center py-4 px-6 rounded-xl font-bold text-lg transition-colors font-prompt w-full"
                  aria-label="โทร 094-064-9018"
                >
                  โทร 094-064-9018
                </a>
                <a
                  href="https://line.me/ti/p/@krunuengusedcar"
                  className="btn-secondary block text-center py-4 px-6 rounded-xl font-bold text-lg transition-colors font-prompt w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="แชท LINE ครูหนึ่งรถสวย"
                >
                  Line: @krunuengusedcar
                </a>
              </div>
            </div>
          </div>

          {/* ขั้นตอนการซื้อรถ - แบบ Carsome */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-primary/10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-prompt">ขั้นตอนการซื้อรถ</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 font-prompt">ติดต่อสอบถาม</h3>
                <p className="text-gray-600 text-sm font-prompt">โทรหรือ Line สอบถามรายละเอียด</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 font-prompt">นัดดูรถ</h3>
                <p className="text-gray-600 text-sm font-prompt">นัดหมายเวลาดูรถและทดลองขับ</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 font-prompt">ตรวจสภาพ</h3>
                <p className="text-gray-600 text-sm font-prompt">ตรวจสอบสภาพรถอย่างละเอียด</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 font-prompt">จัดการเอกสาร</h3>
                <p className="text-gray-600 text-sm font-prompt">ดำเนินการโอนและจัดไฟแนนซ์</p>
              </div>
            </div>
          </div>

          {/* ปุ่มกลับ */}
          <div className="text-center pb-8">
            <Link
              href="/all-cars"
              className="btn-primary inline-block px-6 py-3 rounded-xl font-semibold shadow-lg transition-all text-lg font-prompt"
            >
              กลับหน้ารวมรถ
            </Link>
          </div>

          {/* Similar Cars Section */}
          <SimilarCars currentCar={car} allCars={allCars || []} />
        </div>
      </main>

      {/* Enhanced Car Product JSON-LD Schema with Reviews */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: enhancedTitle,
              image: carImages.map(img =>
                safeGet(img, 'url', '').startsWith('/')
                  ? `https://www.chiangmaiusedcar.com${safeGet(img, 'url', '')}`
                  : safeGet(img, 'url', '')
              ),
              description: enhancedDescription,
              brand: {
                '@type': 'Brand',
                name: safeGet(car, 'vendor') || safeGet(car, 'brand') || 'Toyota',
              },
              offers: {
                '@type': 'Offer',
                url: `https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`,
                price: safeGet(car, 'price.amount') || '659000',
                priceCurrency: 'THB',
                priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],
                availability: 'https://schema.org/InStock',
                itemCondition: 'https://schema.org/UsedCondition',
                shippingDetails: {
                  '@type': 'OfferShippingDetails',
                  shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'THB' },
                  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'TH' },
                },
                hasMerchantReturnPolicy: {
                  '@type': 'MerchantReturnPolicy',
                  applicableCountry: 'TH',
                  returnPolicyCategory: 'https://schema.org/NoReturnRefund',
                },
                seller: {
                  '@type': 'AutoDealer',
                  name: 'ครูหนึ่งรถสวย',
                  url: 'https://www.chiangmaiusedcar.com',
                  telephone: '+66940649018',
                },
              },
            }),
          }}
        />

        {/* Primary Image Object Schema */}
        {carImages[0] && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                buildImageObjectJsonLd({
                  url: safeGet(carImages[0], 'url', '').startsWith('/')
                    ? `https://www.chiangmaiusedcar.com${safeGet(carImages[0], 'url', '')}`
                    : safeGet(carImages[0], 'url', ''),
                  caption: `${safeGet(car, 'vendor', 'Toyota')} ${safeGet(car, 'title', 'Camry')} ${safeGet(car, 'year', '2018')} ฟรีดาวน์ ผ่อนถูก`,
                  altText: safeGet(carImages[0], 'altText') || enhancedTitle,
                  carTitle: safeGet(car, 'title') || safeGet(car, 'model', 'Camry'),
                  carBrand: safeGet(car, 'vendor') || safeGet(car, 'brand', 'Toyota'),
                  carYear: safeGet(car, 'year', '2018'),
                  uploadDate: new Date().toISOString().split('T')[0],
                  width: safeGet(carImages[0], 'width', 1200),
                  height: safeGet(carImages[0], 'height', 800),
                  contentType: 'image/jpeg',
                })
              ),
            }}
          />
        )}
      </Head>
    </>
  );
}

// Convert to SSR temporarily to debug
export async function getServerSideProps({ params }) {
  try {
    const cars = await getAllCars();

    // ป้องกันกรณีที่ cars เป็น null หรือ undefined
    const safeCars = Array.isArray(cars) ? cars : [];
    const car = safeCars.find(c => c?.handle === params?.handle) || null;

    if (!car) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        car,
        allCars: safeCars,
      },
    };
  } catch (error) {
    console.error('getServerSideProps error:', error);
    // ไม่ throw error - ให้หน้า 404 แทน
    return {
      notFound: true,
    };
  }
}

export default CarDetailPage;
