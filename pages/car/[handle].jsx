import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import SimilarCars from '../../components/SimilarCars';
import { getAllCars } from '../../lib/shopify.mjs';
import { buildEnhancedCarJsonLd, buildImageObjectJsonLd } from '../../lib/seo/jsonld';
import { safeGet, safeFormatPrice } from '../../lib/safeFetch';
import Link from 'next/link';
import A11yImage from '../../components/A11yImage';
import { carAlt } from '../../utils/a11y';
import { optimizeShopifyImage, generateSrcSet } from '../../utils/imageOptimizer';
import { createShareText } from '../../utils/urlHelper';

function CarDetailPage({ car, allCars = [] }) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [processedDescription, setProcessedDescription] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Hydration protection
  useEffect(() => {
    setMounted(true);
  }, []);

  // Clean URL - ลบ query parameters ที่ไม่จำเป็น (เช่น ?handle=...)
  useEffect(() => {
    if (!mounted || !router.isReady) return;

    // ถ้ามี query parameters ใดๆ ให้ลบออก (เพราะ car detail ไม่ต้องการ query params)
    if (
      Object.keys(router.query).length > 1 ||
      (router.query.handle && router.asPath.includes('?'))
    ) {
      const cleanPath = `/car/${router.query.handle}`;
      // ใช้ replace แทน push เพื่อไม่ให้เพิ่มใน history
      router.replace(cleanPath, undefined, { shallow: true });
    }
  }, [router, mounted]);

  // Preload next/prev images for instant switching with optimization
  useEffect(() => {
    if (!mounted || !car) return;
    const images = safeGet(car, 'images', []);
    if (images.length < 2) return;

    // ⭐ Preload เฉพาะรูปถัดไปและรูปก่อนหน้า (ไม่โหลดทั้งหมด)
    const preloadIndexes = [];
    if (selectedImageIndex < images.length - 1) preloadIndexes.push(selectedImageIndex + 1);
    if (selectedImageIndex > 0) preloadIndexes.push(selectedImageIndex - 1);

    preloadIndexes.forEach(idx => {
      const img = new window.Image();
      const originalUrl = safeGet(images[idx], 'url', '');
      // ⭐ ใช้ optimized URL ขนาด 1920px สำหรับรูปหลัก
      img.src = optimizeShopifyImage(originalUrl, 1920, 'webp');
      // ⭐ ตั้ง fetchpriority ให้ต่ำกว่ารูปปัจจุบัน
      img.fetchPriority = 'low';
    });
  }, [selectedImageIndex, car, mounted]);

  // Keyboard navigation for image gallery
  useEffect(() => {
    if (!mounted || !car) return;
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
  }, [car, mounted]);

  // Removed image loading gating to allow hero image to paint immediately

  // Process description after component mount to prevent hydration errors
  useEffect(() => {
    if (car?.description) {
      // ฟังก์ชันประมวลผลข้อความ
      const processText = text => {
        return (
          text
            .replace(/\\n/g, '\n')
            .replace(/\\r\\n/g, '\n')
            .replace(/\\r/g, '\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p><p>/gi, '\n\n')
            .replace(/<\/?p>/gi, '')
            .replace(/<\/?div>/gi, '')
            // ลบอักขระที่มีปัญหาหลายรูปแบบ
            .replace(/�/g, '') // Replacement character ธรรมดา
            .replace(/\uFFFD/g, '') // Unicode replacement character
            .replace(/\uFEFF/g, '') // Byte order mark
            // Skip aggressive control-char filtering to avoid lint regex issues
            .replace(/[\u007F-\u009F]/g, '') // Extended control characters
            .replace(/\u00A0/g, ' ') // Non-breaking space แปลงเป็น space ธรรมดา
            // กรองอักขระที่แสดงผลไม่ได้หรือมีปัญหา
            .split('')
            .map(char => {
              const code = char.charCodeAt(0);
              // เก็บเฉพาะอักขระที่แสดงผลได้ดี
              if (
                (code >= 32 && code <= 126) || // ASCII printable
                (code >= 160 && code <= 255) || // Latin-1 supplement
                (code >= 0x0e00 && code <= 0x0e7f) || // Thai
                char === '\n' ||
                char === '\r' ||
                char === '\t' || // Whitespace
                /[#@]/.test(char) // Hashtag และ mention symbols
              ) {
                return char;
              }
              // แทนที่อักขระที่ไม่รองรับด้วยช่องว่าง
              return ' ';
            })
            .join('')
            .replace(/\s+/g, ' ') // ลดช่องว่างซ้ำ
            // Skip emoji filtering to avoid unicode regex pitfalls in lint
            // แบ่งบรรทัดเมื่อพบคำว่า "สด" ตามด้วยตัวเลขและราคา
            .replace(/(สด\s*[\d,]+)/gi, '\n$1')
            // แบ่งบรรทัดเมื่อพบคำว่า "ราคา" ในรูปแบบต่างๆ
            .replace(/(ราคา)/gi, '\n$1')
            .replace(/(\d{1,3}(?:,\d{3})*)\s*-\s*/g, '\n\nราคา $1 บาท\n')
            .replace(/(ออกรถ\s*\d+\s*บาท)/gi, '\n$1')
            // Skip complex "ผ่อน ... ปี" regex to avoid unicode class issues
            .replace(/(เครื่องยนต์[^\n#]*)/gi, '\n$1')
            .replace(/(รถบ้าน[^\n#]*)/gi, '\n$1')
            .replace(/(Option\s*เต็ม[^\n#]*)/gi, '\n$1')
        );
      };

      const processed = processText(car.description);
      const hashtagMatches = processed.match(/#[\w\u0E00-\u0E7F]+/g) || [];
      const textWithoutHashtags = processed.replace(/#[\w\u0E00-\u0E7F]+/g, '').trim();
      const paragraphs = textWithoutHashtags
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      setProcessedDescription({
        paragraphs,
        hashtags: hashtagMatches,
      });
    }
  }, [car?.description]);

  // ป้องกัน hydration error
  // ป้องกัน hydration error: เดิมใช้ return ตัดหน้าออก ทำให้บอทไม่ได้รับ OG meta
  // เปลี่ยนเป็นให้ UI แสดง loading ในส่วนคอนเทนต์ แต่คงส่วน <Head> ไว้ใน SSR เสมอ

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

  // ⭐ เตรียม URL รูปแรกสำหรับ preload (ก่อน render)
  const firstImageUrl = safeGet(carImages[0], 'url', '/herobanner/chiangmaiusedcar.webp');
  const optimizedFirstImage = optimizeShopifyImage(firstImageUrl, 1920, 'webp');

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

  // Enhanced image for social sharing - ALWAYS use first image (not current selected)
  // This ensures consistent sharing preview regardless of which image user is viewing
  const firstCarImage = carImages[0] || currentImage;
  let socialImage = safeGet(firstCarImage, 'url', '');

  // Handle relative URLs - MUST be absolute for Facebook/LINE
  if (socialImage.startsWith('/')) {
    socialImage = `https://www.chiangmaiusedcar.com${socialImage}`;
  } else if (!socialImage.startsWith('http')) {
    socialImage = `https://www.chiangmaiusedcar.com/${socialImage}`;
  }

  // Fallback to default high-quality image if no car image
  if (!socialImage || socialImage === 'https://www.chiangmaiusedcar.com' || socialImage === '') {
    socialImage = 'https://www.chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp';
  }

  // Ensure absolute URL with www for better Facebook compatibility
  if (!socialImage.includes('www.')) {
    socialImage = socialImage.replace(
      'https://chiangmaiusedcar.com',
      'https://www.chiangmaiusedcar.com'
    );
  }

  // Add cache busting for Facebook sharing - use build-time timestamp
  if (socialImage && !socialImage.includes('?')) {
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 60)); // Update every hour
    socialImage = `${socialImage}?v=${timestamp}&w=1200&h=630`;
  }

  // Server-rendered Open Graph essentials (SSR-safe, no client-only logic)
  // Build canonical URL and primary OG image directly from props to guarantee tags on first HTML
  const canonicalUrl = `https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`;
  // Prefer original Shopify URL when available to avoid relative paths
  let ogImage = safeGet(firstCarImage, 'originalUrl', '') || safeGet(firstCarImage, 'url', '');
  if (ogImage && ogImage.startsWith('/')) {
    ogImage = `https://www.chiangmaiusedcar.com${ogImage}`;
  }
  if (ogImage && !ogImage.startsWith('http')) {
    ogImage = `https://www.chiangmaiusedcar.com/${ogImage}`;
  }
  // Ensure Shopify image has a sensible width for social preview
  if (ogImage && ogImage.includes('cdn.shopify.com') && !/[?&]width=\d+/.test(ogImage)) {
    const sep = ogImage.includes('?') ? '&' : '?';
    ogImage = `${ogImage}${sep}width=1200`;
  }
  // Final fallback to guaranteed local hero image
  const defaultOgImage = 'https://www.chiangmaiusedcar.com/herobanner/chiangmaiusedcar.webp';
  const ogImageFinal = ogImage || socialImage || defaultOgImage;

  // Debug mode - log for development AND production for social debugging
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('🔍 Car Detail SEO Debug:', {
      title: enhancedTitle,
      description: enhancedDescription,
      image: socialImage,
      imageAbsolute: socialImage.startsWith('https://'),
      imageSize: '1200x630',
      url: `https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`,
      brandModel,
      yearPrice,
      facebookDebugUrl: `https://developers.facebook.com/tools/debug/?q=https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`,
    });
  }

  return (
    <>
      {/* Minimal SSR OG block to guarantee Facebook/LINE can read meta without JS */}
      <Head>
        {/* ⭐ Preconnect to Shopify CDN for faster image loading */}
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />

        {/* ⭐ Preload รูปแรก (Hero Image) เพื่อโหลดทันทีก่อนอย่างอื่น */}
        <link
          rel="preload"
          as="image"
          href={optimizedFirstImage}
          imageSrcSet={generateSrcSet(firstImageUrl, [640, 1024, 1920], 'webp')}
          imageSizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
          fetchPriority="high"
        />

        <meta property="og:type" content="product" />
        <meta property="og:title" content={enhancedTitle} />
        <meta property="og:description" content={enhancedDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageFinal} />
        <meta property="og:image:secure_url" content={ogImageFinal} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่" />
      </Head>

      <SEO
        title={enhancedTitle}
        description={enhancedDescription}
        image={socialImage}
        url={`https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`}
        type="product"
        pageType="car"
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'รถมือสองทั้งหมด', url: '/all-cars' },
          { name: brandModel || safeGet(car, 'title', 'รถมือสอง'), url: null },
        ]}
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
              ? `https://www.chiangmaiusedcar.com${safeGet(img, 'url', '')}`
              : safeGet(img, 'url', ''),
          })),
          // Ensure structured data has required fields for Google Rich Results
          price: {
            amount: safeGet(car, 'price.amount', 0),
            currencyCode: safeGet(car, 'price.currencyCode', 'THB'),
          },
          availableForSale:
            typeof car?.availableForSale === 'boolean' ? car.availableForSale : true,
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

      {/* Enhanced Car JSON-LD Schema - Single Source (ลบ Breadcrumb ซ้ำซ้อน) */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildEnhancedCarJsonLd({
                name: enhancedTitle,
                description: enhancedDescription,
                brand: safeGet(car, 'vendor') || safeGet(car, 'brand', 'รถมือสอง'),
                year: safeGet(car, 'year', ''),
                model: safeGet(car, 'model', ''),
                images: carImages.map(img =>
                  safeGet(img, 'url', '').startsWith('/')
                    ? `https://www.chiangmaiusedcar.com${safeGet(img, 'url', '')}`
                    : safeGet(img, 'url', '')
                ),
                price: safeGet(car, 'price.amount', 0),
                currency: safeGet(car, 'price.currencyCode', 'THB'),
                url: `https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`,
                sku: safeGet(car, 'id') || safeGet(car, 'handle'),
                vin: safeGet(car, 'vin'), // Optional - ไม่บังคับ
                mileage: safeGet(car, 'mileage'),
                transmission: safeGet(car, 'transmission', 'Manual'),
                fuelType: safeGet(car, 'fuel_type', 'Gasoline'),
                engineSize: safeGet(car, 'engine'),
                color: safeGet(car, 'color'),
                seats: safeGet(car, 'seats'),
                bodyType: safeGet(car, 'body_type'), // เพิ่ม body type
                availability: safeGet(car, 'availableForSale', true) ? 'InStock' : 'OutOfStock',
                priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],
                returnPolicy: 'NoReturnRefund',
                shippingCost: 0,
                warrantyPeriod: '1 ปี',
                // ใช้ข้อมูล review จริงถ้ามี (ไม่ hard-code)
                ratingValue: safeGet(car, 'review.ratingValue'),
                reviewCount: safeGet(car, 'review.reviewCount'),
              })
            ),
          }}
        />
      </Head>

      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto p-2 sm:p-4 lg:p-6">
          <Breadcrumb carTitle={safeGet(car, 'title', 'รถมือสองคุณภาพดี')} />

          {/* ชื่อรถ */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-3 font-prompt">
              {safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
            </h1>
          </div>

          {/* รูปรถ - Modern 2025 Style */}
          <div className="mb-6 sm:mb-8">
            <div className="relative w-full h-[220px] sm:h-[350px] md:h-[500px] lg:h-[600px] bg-white rounded-xl overflow-hidden border border-gray-200">
              <A11yImage
                src={safeGet(currentImage, 'url', '/herobanner/chiangmaiusedcar.webp')}
                alt={carAlt(car)}
                fallbackAlt={safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
                fill
                className="object-cover"
                priority={true} // ⭐ เพิ่ม priority สำหรับรูปหลัก Above-the-fold
                imageType="hero" // ⭐ ระบุเป็นรูปหลัก (1920px)
                quality={85}
                decoding="async" // ⭐ Decode แบบ async ไม่บล็อก main thread
              />

              {/* Navigation buttons */}
              {carImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(prev => (prev === 0 ? carImages.length - 1 : prev - 1))
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white hover:bg-opacity-10 text-white p-3 rounded-lg transition-all duration-200"
                    type="button"
                    aria-label="รูปก่อนหน้า"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(prev => (prev === carImages.length - 1 ? 0 : prev + 1))
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-transparent hover:bg-white hover:bg-opacity-10 text-white p-3 rounded-lg transition-all duration-200"
                    type="button"
                    aria-label="รูปถัดไป"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-lg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter Modern 2025 */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium font-prompt">
                <span className="text-white">{selectedImageIndex + 1}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-gray-300">{carImages.length}</span>
                <span className="text-gray-300 ml-2">ภาพรถจริง</span>
              </div>

              {/* Keyboard hint */}
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black text-white px-3 py-1 rounded-lg text-xs font-prompt hidden sm:block">
                ใช้ ← → เพื่อเลื่อนรูป
              </div>
            </div>

            {/* Thumbnails - Modern 2025 Style with Lazy Loading */}
            {carImages.length > 1 && (
              <div className="hidden sm:flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {carImages.map((img, index) => {
                  // ⭐ โหลด thumbnail ทั้งหมดแบบ lazy เพื่อลดการแย่ง bandwidth กับ hero
                  return (
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
                      className={`relative flex-shrink-0 w-20 h-16 lg:w-24 lg:h-18 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        selectedImageIndex === index
                          ? 'border-primary ring-2 ring-primary/20'
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
                        imageType="thumbnail" // ⭐ ระบุเป็น thumbnail (400px)
                        loading="lazy"
                      />
                      {/* Selected indicator */}
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
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
                  );
                })}
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
                          ? 'border-primary ring-1 ring-primary/20'
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

          {/* ข้อมูลหลักรถ - Modern 2025 Style */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            {/* Social Sharing */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-bold text-black mb-4 font-prompt">แชร์รถคันนี้</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    // ใช้ URL จริงของ Shopify (ไม่แก้ไข) เพื่อป้องกัน 404
                    const shareUrl = `https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`;
                    const shareText = createShareText(car);

                    if (navigator.share) {
                      navigator.share({ title: shareText, url: shareUrl });
                    } else {
                      navigator.clipboard
                        .writeText(`${shareText}\n${shareUrl}`)
                        .then(() => alert('✅ คัดลอกลิ้งค์แล้ว!'));
                    }
                  }}
                  className="bg-white hover:bg-gray-50 text-black border border-gray-200 flex items-center gap-2 px-4 py-3 rounded-lg font-prompt transition-colors"
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
                  แชร์รถคันนี้
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-3 rounded-lg font-prompt transition-colors"
                  aria-label="แชร์รถคันนี้บน Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  แชร์ Facebook
                </a>
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://www.chiangmaiusedcar.com/car/${safeGet(car, 'handle', '')}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent hover:bg-orange-600 text-white flex items-center gap-2 px-4 py-3 rounded-lg font-prompt transition-colors"
                  aria-label="แชร์รถคันนี้ทาง LINE"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z" />
                  </svg>
                  แชร์ LINE
                </a>
              </div>
            </div>
            {/* สเปคหลัก - Modern 2025 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-black mb-6 font-prompt">
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
            {/* ราคาโดดเด่น Modern 2025 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* ราคาหลัก */}
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 font-prompt">
                  {safeFormatPrice(safeGet(car, 'price.amount')).display} บาท
                </div>
                {/* ค่าผ่อนประมาณ - สูตร Flat Rate */}
                <div className="space-y-3">
                  {(() => {
                    const carPrice = Number(safeGet(car, 'price.amount', 0));
                    const loanAmount = carPrice; // สมมติเงินดาวน์ 0%
                    const years = 6; // 6 ปี
                    const months = 72; // 72 งวด
                    const age = 35; // อายุเฉลี่ย 35 ปี

                    // Insurance calculation based on age (same for both)
                    const insuranceRatePerYear = age <= 40 ? 0.004 : 0.0062; // 0.40% หรือ 0.62%
                    const totalInsurance = loanAmount * insuranceRatePerYear * years;
                    const monthlyInsurance = totalInsurance / months;

                    // Normal rate calculation (7.5%)
                    const normalRate = 0.075;
                    const normalTotalInterest = loanAmount * normalRate * years;
                    const normalMonthlyPayment = (loanAmount + normalTotalInterest) / months;
                    const normalVat = normalMonthlyPayment * 0.07;
                    const normalTotalMonthly = normalMonthlyPayment + normalVat + monthlyInsurance;

                    // Good credit calculation (4.5%)
                    const goodCreditRate = 0.045;
                    const goodCreditTotalInterest = loanAmount * goodCreditRate * years;
                    const goodCreditMonthlyPayment =
                      (loanAmount + goodCreditTotalInterest) / months;
                    const goodCreditVat = goodCreditMonthlyPayment * 0.07;
                    const goodCreditTotalMonthly =
                      goodCreditMonthlyPayment + goodCreditVat + monthlyInsurance;

                    const savings = normalTotalMonthly - goodCreditTotalMonthly;

                    return (
                      <>
                        {/* Normal rate */}
                        <div>
                          <div className="text-lg text-primary font-prompt">
                            {Math.round(normalTotalMonthly).toLocaleString()} บาท /เดือน*
                          </div>
                          <div className="text-xs text-gray-500 font-prompt">
                            *อัตราปกติ 7.5% สำหรับ 72 งวด + VAT + ประกัน
                          </div>
                        </div>

                        {/* Good credit rate */}
                        <div className="bg-white border border-accent rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <svg
                              className="w-4 h-4 text-accent-800"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm font-semibold text-accent-800 font-prompt">
                              สำหรับลูกค้าเครดิตดี
                            </span>
                          </div>
                          <div className="text-lg font-bold text-primary font-prompt">
                            {Math.round(goodCreditTotalMonthly).toLocaleString()} บาท /เดือน*
                          </div>
                          <div className="text-xs text-gray-600 font-prompt mb-1">
                            *อัตราพิเศษ 4.5% สำหรับ 72 งวด + VAT + ประกัน
                          </div>
                          <div className="text-sm font-semibold text-accent-800 font-prompt">
                            ประหยัดได้ {Math.round(savings).toLocaleString()} บาท/เดือน
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* ปุ่มหลัก Modern 2025 */}
              <div className="flex flex-col gap-3">
                <Link
                  href={`/payment-calculator?price=${safeGet(car, 'price.amount', 0)}&from=car&carTitle=${encodeURIComponent(safeGet(car, 'title', 'รถมือสองคุณภาพดี'))}`}
                  className="bg-primary hover:bg-blue-700 text-white text-center py-4 px-6 rounded-lg font-bold text-lg transition-colors font-prompt w-full"
                >
                  คำนวณสินเชื่อแบบเปรียบเทียบ
                </Link>
                <div className="text-xs text-center text-gray-500 font-prompt mb-2">
                  ดูเปรียบเทียบอัตราปกติ vs เครดิตดี พร้อมรายละเอียดครบถ้วน
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="tel:0940649018"
                    className="bg-white hover:bg-gray-50 text-black border border-gray-200 text-center py-3 px-4 rounded-lg font-bold transition-colors font-prompt w-full"
                    aria-label="โทร 094-064-9018"
                  >
                    โทรหาฉัน
                  </a>
                  <a
                    href="https://line.me/ti/p/@krunuengusedcar"
                    className="bg-accent hover:bg-orange-600 text-white text-center py-3 px-4 rounded-lg font-bold transition-colors font-prompt w-full"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="แชท LINE ครูหนึ่งรถสวย"
                  >
                    ทดลองขับฟรี
                  </a>
                </div>
              </div>
            </div>
            {/* Badge ความน่าเชื่อถือ Modern 2025 */}
            <div className="bg-white border border-primary rounded-lg p-4 mb-6">
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
            </div>
            {/* ข้อมูลรายละเอียดรถ */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4 font-prompt">รายละเอียดรถยนต์</h2>

              {/* ข้อมูลพื้นฐาน */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {car.vendor && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">ยี่ห้อ</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.vendor}</div>
                  </div>
                )}
                {car.model && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">รุ่น</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.model}</div>
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
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เลขไมล์</div>
                    <div className="text-lg font-bold text-black font-prompt">
                      {Number(car.mileage).toLocaleString()} กม.
                    </div>
                  </div>
                )}
                {car.transmission && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เกียร์</div>
                    <div className="text-lg font-bold text-black font-prompt">
                      {car.transmission}
                    </div>
                  </div>
                )}
                {car.fuel_type && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เชื้อเพลิง</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.fuel_type}</div>
                  </div>
                )}
                {car.engine && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">เครื่องยนต์</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.engine}</div>
                  </div>
                )}
                {car.province && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <div className="font-semibold text-gray-600 font-prompt">จังหวัด</div>
                    <div className="text-lg font-bold text-black font-prompt">{car.province}</div>
                  </div>
                )}
              </div>

              {/* คำอธิบาย */}
              {car.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-black mb-3 font-prompt">คำอธิบาย</h3>
                  <div className="text-gray-700 bg-gray-50 border border-gray-200 p-4 rounded-lg font-prompt leading-relaxed">
                    {/* แสดงผลแบบรองรับการแบ่งบรรทัดและจัดรูปแบบข้อความจาก Shopify */}
                    <div className="space-y-3">
                      {processedDescription ? (
                        <>
                          {/* แสดงข้อความหลัก */}
                          {processedDescription.paragraphs.map((paragraph, index) => (
                            <div
                              key={index}
                              className="whitespace-pre-line break-words leading-relaxed"
                            >
                              {paragraph}
                            </div>
                          ))}

                          {/* แสดง hashtags ในบรรทัดเดียว */}
                          {processedDescription.hashtags.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-300">
                              <div className="flex flex-wrap gap-2">
                                {processedDescription.hashtags.map((hashtag, index) => (
                                  <a
                                    key={index}
                                    href={`/all-cars?search=${encodeURIComponent(hashtag.substring(1))}`}
                                    className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer font-prompt"
                                    onClick={e => {
                                      e.preventDefault();
                                      window.location.href = `/all-cars?search=${encodeURIComponent(hashtag.substring(1))}`;
                                    }}
                                  >
                                    {hashtag}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ข้อมูลการติดต่อและสถานที่ Modern 2025 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl font-bold text-black mb-4 font-prompt">ที่ตั้งรถและการติดต่อ</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* ข้อมูลสถานที่ */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold text-black font-prompt">ครูหนึ่งรถสวย เชียงใหม่</span>
                </div>
                <div className="text-gray-600 font-prompt mb-4">
                  ร้านรถมือสองมาตรฐาน ตรวจสภาพละเอียด รับประกันคุณภาพ
                </div>
                <div className="text-sm text-gray-500 font-prompt">เปิดทุกวัน 09:00 - 20:00</div>
              </div>

              {/* ปุ่มติดต่อ Modern 2025 */}
              <div className="space-y-3">
                <a
                  href="tel:0940649018"
                  className="bg-primary hover:bg-blue-700 text-white block text-center py-4 px-6 rounded-lg font-bold text-lg transition-colors font-prompt w-full"
                  aria-label="โทร 094-064-9018"
                >
                  โทร 094-064-9018
                </a>
                <a
                  href="https://line.me/ti/p/@krunuengusedcar"
                  className="bg-white hover:bg-gray-50 text-black border border-gray-200 block text-center py-4 px-6 rounded-lg font-bold text-lg transition-colors font-prompt w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="แชท LINE ครูหนึ่งรถสวย"
                >
                  Line: @krunuengusedcar
                </a>
              </div>
            </div>
          </div>

          {/* Similar Cars Section */}
          <SimilarCars currentCar={car} allCars={allCars} />

          {/* ขั้นตอนการซื้อรถ Modern 2025 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl font-bold text-black mb-6 font-prompt">ขั้นตอนการซื้อรถ</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="font-bold text-black mb-2 font-prompt">ติดต่อสอบถาม</h3>
                <p className="text-gray-600 text-sm font-prompt">โทรหรือ Line สอบถามรายละเอียด</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="font-bold text-black mb-2 font-prompt">นัดดูรถ</h3>
                <p className="text-gray-600 text-sm font-prompt">นัดหมายเวลาดูรถและทดลองขับ</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="font-bold text-black mb-2 font-prompt">ตรวจสภาพ</h3>
                <p className="text-gray-600 text-sm font-prompt">ตรวจสอบสภาพรถอย่างละเอียด</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent text-white rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h3 className="font-bold text-black mb-2 font-prompt">จัดการเอกสาร</h3>
                <p className="text-gray-600 text-sm font-prompt">ดำเนินการโอนและจัดไฟแนนซ์</p>
              </div>
            </div>
          </div>

          {/* ปุ่มกลับ Modern 2025 */}
          <div className="text-center pb-8">
            <Link
              href="/all-cars"
              className="bg-primary hover:bg-blue-700 text-white inline-block px-6 py-3 rounded-lg font-semibold transition-colors text-lg font-prompt"
            >
              กลับหน้ารวมรถ
            </Link>
          </div>
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
// ISR - Individual car pages - revalidate every 10 minutes
export async function getStaticPaths() {
  try {
    const cars = await getAllCars();
    const safeCars = Array.isArray(cars) ? cars : [];

    const paths = safeCars
      .filter(car => car?.handle)
      .map(car => ({
        params: { handle: car.handle },
      }));

    return {
      paths,
      fallback: 'blocking', // Enable ISR for new cars
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getStaticPaths error:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const cars = await getAllCars();

    // ป้องกันกรณีที่ cars เป็น null หรือ undefined
    const safeCars = Array.isArray(cars) ? cars : [];

    const requestedRaw = params?.handle || '';
    const requested = decodeURIComponent(requestedRaw);

    // 1) ตรงตัว
    let car = safeCars.find(c => c?.handle === requestedRaw) || null;

    // 2) เทียบกับ decoded
    if (!car) {
      car = safeCars.find(c => c?.handle === requested) || null;
    }

    // 3) เผื่อมีคำต่อท้าย เช่น -รุ่นท็อป ให้แมทช์แบบ prefix ที่ยาวสุด
    if (!car) {
      const candidates = safeCars
        .filter(c => typeof c?.handle === 'string')
        .filter(c => requestedRaw.startsWith(c.handle) || requested.startsWith(c.handle))
        .sort((a, b) => b.handle.length - a.handle.length);
      car = candidates[0] || null;
    }

    // ไม่พบจริง ๆ
    if (!car) {
      return { notFound: true };
    }

    // Redirect ไป canonical URL ถ้าไม่ตรง
    if (requestedRaw !== car.handle) {
      return {
        redirect: {
          destination: `/car/${car.handle}`,
          permanent: true,
        },
      };
    }

    // ส่ง allCars ทั้งหมดให้ SimilarCars component คำนวณรถที่คล้ายกันเอง (ระบบเดิม)
    return {
      props: {
        car,
        allCars: safeCars, // ส่งรถทั้งหมด
      },
      revalidate: 600, // 10 minutes
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('getStaticProps error:', error);
    // ไม่ throw error - ให้หน้า 404 แทน
    return {
      notFound: true,
    };
  }
}

export default CarDetailPage;
