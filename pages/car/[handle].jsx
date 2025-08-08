import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import SimilarCars from '../../components/SimilarCars';
import { getAllCars } from '../../lib/shopify';
import Link from 'next/link';
import Image from 'next/image';

// Import CarActionButtons แบบ dynamic ปิด SSR
const CarActionButtons = dynamic(() => import('../../components/CarActionButtons'), { ssr: false });

function CarDetailPage({ car, allCars }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoadingState, setImageLoadingState] = useState({});
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  // Prepare images (up to 20 images from Shopify) - optimized for speed
  const carImages = React.useMemo(() => {
    if (!car?.images || car.images.length === 0) {
      return [{ url: '/cover.jpg', alt: car?.title || 'รถมือสอง' }];
    }

    // Limit to 20 images for better performance
    const images = car.images.slice(0, 20);

    // Optimize image URLs with Shopify transformations
    return images.map((img, index) => ({
      ...img,
      url: img.url.includes('cdn.shopify.com')
        ? `${img.url.split('?')[0]}?width=${index === 0 ? 800 : 400}&quality=85&format=webp`
        : img.url,
      alt: img.alt || `${car.title} - รูปที่ ${index + 1}`,
    }));
  }, [car?.images, car?.title]);

  const currentImage = carImages[selectedImageIndex] || carImages[0];

  // Advanced image preloading function
  const preloadImage = useCallback(
    (url, priority = 'low') => {
      if (!url || preloadedImages.has(url) || url.includes('/cover.jpg')) return;

      const img = new window.Image();
      img.fetchPriority = priority;
      img.loading = 'eager';

      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, url]));
        setImageLoadingState(prev => ({ ...prev, [url]: 'loaded' }));
      };

      img.onerror = () => {
        setImageLoadingState(prev => ({ ...prev, [url]: 'error' }));
      };

      setImageLoadingState(prev => ({ ...prev, [url]: 'loading' }));
      img.src = url;
    },
    [preloadedImages]
  );

  // Smart image navigation with preloading
  const changeImage = useCallback(
    newIndex => {
      setSelectedImageIndex(newIndex);

      // Preload adjacent images
      const nextIndexes = [
        (newIndex + 1) % carImages.length,
        (newIndex - 1 + carImages.length) % carImages.length,
        (newIndex + 2) % carImages.length,
      ];

      nextIndexes.forEach((index, priority) => {
        const img = carImages[index];
        if (img?.url) {
          preloadImage(img.url, priority === 0 ? 'high' : 'low');
        }
      });
    },
    [carImages, preloadImage]
  );

  // Handle keyboard navigation และ intelligent preloading
  useEffect(() => {
    if (!car || typeof window === 'undefined') return;

    // Register Service Worker for image caching
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw-images.js')
        .then(registration => {
          console.log('Image SW registered:', registration);

          // ส่งรายการรูปไปให้ SW preload
          if (registration.active) {
            registration.active.postMessage({
              type: 'PRELOAD_IMAGES',
              urls: carImages.slice(0, 5).map(img => img.url),
            });
          }
        })
        .catch(error => console.log('Image SW registration failed:', error));
    }

    // Initial preloading strategy
    const initPreload = () => {
      // Preload first 3 images immediately
      carImages.slice(0, 3).forEach((img, index) => {
        if (img?.url && !img.url.includes('/cover.jpg')) {
          preloadImage(img.url, index === 0 ? 'high' : 'low');
        }
      });
    };

    // Use requestIdleCallback for non-blocking preload
    if (window.requestIdleCallback) {
      window.requestIdleCallback(initPreload);
    } else {
      setTimeout(initPreload, 100);
    }

    const handleKeyPress = event => {
      if (event.key === 'ArrowLeft') {
        const newIndex = selectedImageIndex === 0 ? carImages.length - 1 : selectedImageIndex - 1;
        changeImage(newIndex);
      } else if (event.key === 'ArrowRight') {
        const newIndex = selectedImageIndex === carImages.length - 1 ? 0 : selectedImageIndex + 1;
        changeImage(newIndex);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageIndex, carImages, car, preloadImage, changeImage]);

  // Early return after all hooks
  if (!car) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-red-600">
        ไม่พบข้อมูลรถคันนี้{' '}
        <Link href="/all-cars" className="text-blue-700 underline">
          ← กลับหน้ารวมรถ
        </Link>
      </div>
    );
  }

  // สร้างข้อมูลรายละเอียดรถที่ครบถ้วน
  const carSpecs = [
    { label: 'รับประกันสภาพโดย', value: car.brand || car.vendor },
    { label: 'รุ่น', value: car.model },
    { label: 'ปี', value: car.year },
    { label: 'สี', value: car.color },
    {
      label: 'เลขไมล์',
      value: car.mileage ? `${Number(car.mileage).toLocaleString()} กม.` : null,
    },
    { label: 'เกียร์', value: car.transmission },
    { label: 'เชื้อเพลิง', value: car.fuel_type },
    { label: 'เครื่องยนต์', value: car.engine },
    { label: 'ขนาดเครื่อง', value: car.displacement ? `${car.displacement} cc` : null },
    { label: 'จำนวนที่นั่ง', value: car.seats ? `${car.seats} ที่นั่ง` : null },
    { label: 'จังหวัด', value: car.province },
    { label: 'สภาพ', value: car.condition },
    { label: 'การรับประกัน', value: car.warranty },
  ].filter(spec => spec.value && spec.value !== '-' && spec.value !== null);

  // Image Gallery Schema for SEO
  const imageGalleryLD = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `รูปภาพ ${car.title}`,
    description: `รูปภาพทั้งหมดของ ${car.title} รถมือสองคุณภาพ`,
    associatedMedia: carImages.map((img, index) => ({
      '@type': 'ImageObject',
      contentUrl: img.url,
      thumbnailUrl: img.url,
      name: `${car.title} - รูปที่ ${index + 1}`,
      description: img.alt || `${car.title} รถมือสองเชียงใหม่ ครูหนึ่งรถสวย`,
      width: '800',
      height: '600',
    })),
  };

  // Breadcrumb Schema
  const breadcrumbLD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: 'https://chiangmaiusedcar.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'รถทั้งหมด',
        item: 'https://chiangmaiusedcar.com/all-cars',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: car.title,
        item: `https://chiangmaiusedcar.com/car/${car.handle}`,
      },
    ],
  };

  // Product Schema
  const productLD = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.title,
    image: carImages.map(img => img.url), // All images for better SEO
    description: car.description,
    brand: { '@type': 'Brand', name: car.vendor },
    offers: {
      '@type': 'Offer',
      priceCurrency: car.price?.currencyCode || 'THB',
      price: car.price?.amount
        ? parseFloat(car.price.amount.toString().replace(/[^0-9.-]/g, ''))
        : 0,
      availability: car.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://chiangmaiusedcar.com/car/${car.handle}`,
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'ยี่ห้อ', value: car.vendor },
      { '@type': 'PropertyValue', name: 'รุ่น', value: car.model || '-' },
      { '@type': 'PropertyValue', name: 'ปี', value: car.year || '-' },
      { '@type': 'PropertyValue', name: 'สี', value: car.color || '-' },
      { '@type': 'PropertyValue', name: 'เลขไมล์', value: car.mileage || '-' },
    ],
  };

  // Organization Schema (Logo, SameAs, Contact)
  const orgLD = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'ครูหนึ่งรถสวย รถมือสองเชียงใหม่',
    url: 'https://chiangmaiusedcar.com',
    logo: 'https://chiangmaiusedcar.com/logo/logo_main.png',
    sameAs: [
      'https://facebook.com/krunuengusedcar',
      'https://www.tiktok.com/@krunueng_usedcar',
      'https://youtube.com/@chiangmaiusedcar',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+66940649018',
        contactType: 'customer service',
        areaServed: 'TH',
      },
    ],
  };

  // SEO meta
  return (
    <>
      <SEO
        title={`${car.title} | รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย`}
        description={`${car.description} ${car.vendor} ${car.model} ${car.year} ราคา ${Number(
          car.price.amount
        ).toLocaleString()} บาท`}
        image={currentImage.url}
        keywords={`รถมือสอง, ${car.title}, ${car.vendor}, ${car.model}, ${car.year}, รถบ้าน, ฟรีดาวน์, ผ่อนถูก, เชียงใหม่`}
        url={`/car/${car.handle}`}
        type="product"
        carData={{
          title: car.title,
          description: car.description,
          images: carImages,
          brand: car.vendor,
          model: car.model,
          year: car.year,
          color: car.color,
          mileage: car.mileage,
          transmission: car.transmission,
          fuel_type: car.fuel_type,
          engine: car.engine,
          displacement: car.displacement,
          seats: car.seats,
          province: car.province,
          condition: car.condition,
          warranty: car.warranty,
          price: car.price,
          availableForSale: car.availableForSale,
          sku: car.id,
          id: car.id,
        }}
      />
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGalleryLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLD) }}
      />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          {/* Breadcrumb Navigation with Schema */}
          <Breadcrumb carTitle={car.title} />

          {/* Header Section - เพิ่ม background card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            {/* ชื่อรถ (H1) - ปรับสีให้เด่นชัด */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-prompt">
              {car.title}
            </h1>
            <div className="flex items-center text-sm text-gray-600 font-prompt">
              อัปเดตล่าสุด: {new Date(car.updatedAt).toLocaleDateString('th-TH')}
            </div>
          </div>

          {/* รูปหลัก - Main Image Gallery - ปรับปรุงสำหรับมือถือ */}
          <div className="mb-8">
            {/* Main Image Container - Optimized Loading */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-white rounded-2xl overflow-hidden shadow-2xl mb-4 border border-gray-200">
              {/* Loading skeleton */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse opacity-50" />

              <Image
                src={currentImage.url}
                alt={currentImage.alt || `${car.title} - รูปที่ ${selectedImageIndex + 1}`}
                fill
                className="object-contain transition-all duration-300 ease-out"
                priority={selectedImageIndex === 0} // Only first image gets priority
                quality={selectedImageIndex === 0 ? 90 : 80} // Higher quality for main image
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                loading={selectedImageIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={selectedImageIndex === 0 ? 'high' : 'low'}
                onLoad={() => {
                  // Hide loading skeleton
                  const skeleton = document.querySelector('.animate-pulse');
                  if (skeleton) skeleton.style.opacity = '0';
                }}
              />

              {/* Mobile-friendly Navigation */}
              {carImages.length > 1 && (
                <>
                  {/* Left Arrow */}
                  <button
                    onClick={() => {
                      const newIndex =
                        selectedImageIndex === 0 ? carImages.length - 1 : selectedImageIndex - 1;
                      changeImage(newIndex);
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-20 touch-manipulation"
                    aria-label="รูปก่อนหน้า (ใช้ลูกศรซ้าย)"
                    type="button"
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

                  {/* Right Arrow */}
                  <button
                    onClick={() => {
                      const newIndex =
                        selectedImageIndex === carImages.length - 1 ? 0 : selectedImageIndex + 1;
                      changeImage(newIndex);
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-all duration-200 z-20 touch-manipulation"
                    aria-label="รูปถัดไป (ใช้ลูกศรขวา)"
                    type="button"
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

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium font-prompt">
                {selectedImageIndex + 1} / {carImages.length}
              </div>

              {/* Keyboard hint */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-prompt hidden sm:block">
                ใช้ ← → เพื่อเลื่อนรูป
              </div>
            </div>

            {/* Desktop Thumbnail Gallery - Performance Optimized */}
            {carImages.length > 1 && (
              <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-h-20 lg:max-h-24">
                {carImages.map((img, index) => (
                  <button
                    key={`thumb-${index}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-150 hover:scale-105 touch-manipulation ${
                      selectedImageIndex === index
                        ? 'border-primary shadow-lg ring-2 ring-primary/30'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    aria-label={`ดูรูปที่ ${index + 1}`}
                    type="button"
                  >
                    <Image
                      src={
                        img.url.includes('cdn.shopify.com')
                          ? `${img.url.split('?')[0]}?width=80&quality=60&format=webp`
                          : img.url
                      }
                      alt={img.alt || `${car.title} ภาพย่อย ${index + 1}`}
                      fill
                      className="object-cover"
                      loading="lazy"
                      quality={50}
                      sizes="80px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Thumbnail Slider - Performance Optimized */}
            {carImages.length > 1 && (
              <div className="sm:hidden">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {carImages.map((img, index) => (
                    <button
                      key={`mobile-thumb-${index}`}
                      onClick={() => changeImage(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150 touch-manipulation ${
                        selectedImageIndex === index
                          ? 'border-primary shadow-lg'
                          : 'border-gray-300'
                      }`}
                      aria-label={`ดูรูปที่ ${index + 1}`}
                      type="button"
                    >
                      <Image
                        src={
                          img.url.includes('cdn.shopify.com')
                            ? `${img.url.split('?')[0]}?width=64&quality=50&format=webp`
                            : img.url
                        }
                        alt={img.alt || `${car.title} ภาพย่อย ${index + 1}`}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={40}
                        sizes="64px"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* รายละเอียดจุดเด่นรถ - แสดงข้อมูลครบถ้วน */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 font-prompt border-b-2 border-accent pb-2">
              รายละเอียดรถ
            </h2>

            {/* คำอธิบาย - จัดรูปแบบให้อ่านง่าย */}
            {car.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 font-prompt">คำอธิบาย</h3>
                <div className="text-base leading-relaxed text-gray-700 font-prompt bg-gray-50 p-6 rounded-lg">
                  {car.description.split('\n').map((paragraph, index) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return <br key={index} />;

                    // จัดรูปแบบข้อความ
                    let formattedText = trimmed;

                    // ถ้าเป็นหัวข้อ (มี ":" ท้ายหรือเป็นข้อความสั้น)
                    if (trimmed.endsWith(':') || (trimmed.length < 30 && !trimmed.includes(' '))) {
                      return (
                        <h4 key={index} className="font-bold text-gray-900 mt-4 mb-2 first:mt-0">
                          {formattedText}
                        </h4>
                      );
                    }

                    // ถ้าเป็นรายการ (ขึ้นต้นด้วย - หรือ •)
                    if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
                      return (
                        <div key={index} className="flex items-start mb-1">
                          <span className="text-accent mr-2 mt-1">•</span>
                          <span>{trimmed.replace(/^[-•]\s*/, '')}</span>
                        </div>
                      );
                    }

                    // ย่อหน้าปกติ
                    return (
                      <p key={index} className="mb-3 last:mb-0">
                        {formattedText}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ราคาโดดเด่น - กดเข้าไปคำนวณค่างวด */}
            <div className="mb-6 text-center">
              <Link
                href={`/payment-calculator?price=${car.price.amount}&from=car&carTitle=${encodeURIComponent(car.title)}`}
                className="block bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-lg font-bold mb-3 font-prompt">ราคาขาย</div>
                <div className="text-4xl md:text-5xl font-bold font-prompt mb-4">
                  ฿{Number(car.price.amount).toLocaleString()}
                </div>
                <div className="text-lg font-bold bg-white/20 px-6 py-3 rounded-full inline-block font-prompt">
                  กดคำนวณค่างวด
                </div>
                {car.compareAtPrice &&
                  Number(car.compareAtPrice.amount) > Number(car.price.amount) && (
                    <div className="text-sm opacity-90 mt-4">
                      <span className="line-through">
                        ฿{Number(car.compareAtPrice.amount).toLocaleString()}
                      </span>
                      <span className="ml-2 bg-white/20 px-2 py-1 rounded-full">
                        ประหยัด ฿
                        {(
                          Number(car.compareAtPrice.amount) - Number(car.price.amount)
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
              </Link>
            </div>

            {/* ข้อมูลจำเพาะรถ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {carSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-gray-600 font-prompt">{spec.label}:</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900 font-prompt">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* ข้อมูลพิเศษ */}
            {(car.free_down || car.low_installment) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {car.free_down && (
                  <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-green-800 font-prompt">ฟรีดาวน์</span>
                    </div>
                    <div className="text-green-700 font-prompt">{car.free_down}</div>
                  </div>
                )}
                {car.low_installment && (
                  <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-blue-800 font-prompt">ผ่อนถูก</span>
                    </div>
                    <div className="text-blue-700 font-prompt">{car.low_installment}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <CarActionButtons car={car} />

          {/* รถที่แนะนำ - คล้ายกัน */}
          <SimilarCars currentCar={car} allCars={allCars} />

          {/* ปุ่มกลับ */}
          <div className="mt-8 text-center pb-8">
            <Link
              href="/all-cars"
              className="inline-block px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-prompt"
            >
              กลับหน้ารวมรถ
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

// Static Paths/Props
export async function getStaticPaths() {
  const cars = await getAllCars();
  const paths = cars.map(car => ({
    params: { handle: car.handle },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const cars = await getAllCars();
  const car = cars.find(c => c.handle === params.handle) || null;
  return { props: { car, allCars: cars }, revalidate: 600 };
}

export default CarDetailPage;
