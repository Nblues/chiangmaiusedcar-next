import React, { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import { getAllCars } from '../../lib/shopify';
import { buildCarJsonLd, buildProductJsonLd } from '../../lib/seo/jsonld';
import Link from 'next/link';
import NextImage from 'next/image';

function CarDetailPage({ car }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartTime = useRef(null);
  const minSwipeDistance = 30; // Reduced for more responsive touch
  const maxSwipeTime = 300; // Max time for swipe gesture (ms)

  // เตรียมรูปภาพ
  const carImages = car?.images || [
    { url: '/herobanner/chiangmaiusedcar.webp', alt: car?.title || 'รถมือสอง' },
  ];
  const currentImage = carImages[selectedImageIndex] || carImages[0];

  // Smooth image change with international performance standards
  const changeImage = useCallback(
    newIndex => {
      if (
        isTransitioning ||
        newIndex === selectedImageIndex ||
        newIndex < 0 ||
        newIndex >= carImages.length
      )
        return;

      setIsTransitioning(true);

      // Pre-schedule the image change for smoother transition
      requestAnimationFrame(() => {
        setSelectedImageIndex(newIndex);

        // Reset transition state after CSS animation completes
        setTimeout(() => setIsTransitioning(false), 150); // Optimized from 200ms to 150ms
      });
    },
    [isTransitioning, selectedImageIndex, carImages.length]
  );

  // Handle touch events for swipe navigation
  const onTouchStart = e => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const onTouchMove = e => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !touchStartTime.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const timeElapsed = Date.now() - touchStartTime.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const isQuickSwipe = timeElapsed < maxSwipeTime;

    // Only trigger swipe if it's quick enough and meets distance requirement
    if (isQuickSwipe && carImages.length > 1) {
      if (isLeftSwipe) {
        // Swipe left - next image
        const nextIndex = selectedImageIndex === carImages.length - 1 ? 0 : selectedImageIndex + 1;
        changeImage(nextIndex);
      } else if (isRightSwipe) {
        // Swipe right - previous image
        const prevIndex = selectedImageIndex === 0 ? carImages.length - 1 : selectedImageIndex - 1;
        changeImage(prevIndex);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = e => {
      if (carImages.length <= 1) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = selectedImageIndex === 0 ? carImages.length - 1 : selectedImageIndex - 1;
        changeImage(prevIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = selectedImageIndex === carImages.length - 1 ? 0 : selectedImageIndex + 1;
        changeImage(nextIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carImages.length, selectedImageIndex, changeImage]);

  // Early return for missing car
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

  // เตรียม JSON-LD schema สำหรับ SEO
  const carSpecs = {
    year: car.year,
    transmission: car.transmission || 'Unknown',
    fuelType: car.fuel_type || 'Gasoline',
    engineSize: car.engine,
    mileage: car.mileage,
    seats: car.seats,
    color: car.color,
  };

  const carProduct = {
    url: `https://chiangmaiusedcar.com/car/${car.handle}`,
    name: car.title,
    description:
      car.description ||
      `${car.vendor || car.brand || ''} ${car.model || ''} ${car.year || ''} มือสองเชียงใหม่ สภาพสวย ราคาดี`,
    images: carImages.map(img =>
      img.url.startsWith('/') ? `https://chiangmaiusedcar.com${img.url}` : img.url
    ),
    brand: car.vendor || car.brand,
    sku: car.id || car.handle,
    mpn: car.vin,
    price: car.price?.amount,
    currency: car.price?.currencyCode || 'THB',
    inStock: car.availableForSale !== false,
    priceValidDays: 90,
    sellerName: 'ครูหนึ่งรถสวย',
  };

  const carJsonLd = buildCarJsonLd(carSpecs, carProduct);
  const productJsonLd = buildProductJsonLd(carProduct);

  return (
    <>
      <SEO
        title={`${car.title} | รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย`}
        description={`${car.title} ${car.vendor} ${car.model || ''} ${car.year || ''} ราคา ${Number(car.price.amount).toLocaleString()} บาท`}
        image={currentImage.url}
        url={`/car/${car.handle}`}
        carData={car}
      />

      {/* Car Product JSON-LD Schema */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(carJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd),
          }}
        />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          <Breadcrumb carTitle={car.title} />

          {/* ชื่อรถ */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-prompt">
              {car.title}
            </h1>
          </div>

          {/* รูปรถ - Smooth Transition Gallery with Touch Support */}
          <div className="mb-8">
            <div
              className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 rounded-xl overflow-hidden shadow-lg cursor-pointer select-none"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <NextImage
                src={currentImage.url}
                alt={currentImage.alt || car.title}
                fill
                className={`object-cover transition-all duration-200 ease-out ${
                  isTransitioning ? 'scale-102 opacity-95' : 'scale-100 opacity-100'
                }`}
                priority
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />

              {/* Loading overlay during transition - optimized */}
              {isTransitioning && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center transition-opacity duration-150">
                  <div className="w-6 h-6 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* Navigation buttons - enhanced with hover effects */}
              {carImages.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const prevIndex =
                        selectedImageIndex === 0 ? carImages.length - 1 : selectedImageIndex - 1;
                      changeImage(prevIndex);
                    }}
                    disabled={isTransitioning}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex items-center justify-center"
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
                    onClick={() => {
                      const nextIndex =
                        selectedImageIndex === carImages.length - 1 ? 0 : selectedImageIndex + 1;
                      changeImage(nextIndex);
                    }}
                    disabled={isTransitioning}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex items-center justify-center"
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
              <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium font-prompt backdrop-blur-sm transition-all duration-200">
                <span className="text-white">{selectedImageIndex + 1}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-gray-300">{carImages.length}</span>
                <span className="text-gray-300 ml-2">ภาพรถจริง</span>
              </div>

              {/* Navigation hint - animated */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-prompt transition-all duration-200 hover:bg-black/80">
                <span className="sm:hidden">⚡ เลื่อนนิ้วเร็วๆ ซ้าย-ขวา</span>
                <span className="hidden sm:inline">⚡ ใช้ ← → หรือเลื่อนนิ้วเร็วๆ</span>
              </div>

              {/* Mobile dots indicator - enhanced */}
              {carImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                  {carImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => changeImage(index)}
                      disabled={isTransitioning}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 disabled:opacity-50 ${
                        selectedImageIndex === index
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/70 scale-100'
                      }`}
                      aria-label={`ไปยังรูปที่ ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails - Enhanced Smooth Transitions */}
            {carImages.length > 1 && (
              <div className="hidden sm:flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {carImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => changeImage(index)}
                    disabled={isTransitioning}
                    className={`relative flex-shrink-0 w-20 h-16 lg:w-24 lg:h-18 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedImageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    type="button"
                    aria-label={`ดูรูปที่ ${index + 1}`}
                  >
                    <NextImage
                      src={img.url}
                      alt={`รูปที่ ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-200"
                      sizes="96px"
                      loading="lazy"
                      quality={75}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                    {/* Selected indicator */}
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center transition-all duration-300">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
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

            {/* Mobile Thumbnails - Enhanced */}
            {carImages.length > 1 && (
              <div className="sm:hidden">
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide px-1">
                  {carImages.map((img, index) => (
                    <button
                      key={`mobile-${index}`}
                      onClick={() => changeImage(index)}
                      disabled={isTransitioning}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedImageIndex === index
                          ? 'border-blue-500 ring-1 ring-blue-200 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      type="button"
                      aria-label={`ดูรูปที่ ${index + 1}`}
                    >
                      <NextImage
                        src={img.url}
                        alt={`รูปที่ ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-200"
                        sizes="64px"
                        loading="lazy"
                        quality={70}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ข้อมูลหลักรถ - Carsome Style */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            {/* สเปคหลัก - แนวนอนแบบ Carsome */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600 mb-6 font-prompt">
              {car.mileage && (
                <>
                  <span className="font-semibold">{Number(car.mileage).toLocaleString()} กม.</span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {car.transmission && (
                <>
                  <span className="font-semibold">{car.transmission}</span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {car.year && (
                <>
                  <span className="font-semibold">{car.year}</span>
                  <span className="text-gray-400">|</span>
                </>
              )}
              {car.engine && <span className="font-semibold">{car.engine}</span>}
            </div>

            {/* ราคาโดดเด่นแบบ Carsome */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* ราคาหลัก */}
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 font-prompt">
                  {Number(car.price.amount).toLocaleString()} บาท
                </div>
                {/* ค่าผ่อนประมาณ - คำนวณแบบ Carsome */}
                <div className="text-lg text-gray-600 font-prompt">
                  {Math.round(Number(car.price.amount) * 0.0195).toLocaleString()} บาท /เดือน
                </div>
              </div>

              {/* ปุ่มหลัก */}
              <div className="flex flex-col gap-3">
                <Link
                  href={`/payment-calculator?price=${car.price.amount}&from=car&carTitle=${encodeURIComponent(car.title)}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-6 rounded-xl font-bold text-lg transition-colors font-prompt"
                >
                  เครื่องคำนวณสินเชื่อรถยนต์
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="tel:0940649018"
                    className="bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-xl font-bold transition-colors font-prompt"
                  >
                    โทรหาฉัน
                  </a>
                  <a
                    href="https://line.me/ti/p/@krunuengusedcar"
                    className="bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-xl font-bold transition-colors font-prompt"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ทดลองขับฟรี
                  </a>
                </div>
              </div>
            </div>

            {/* Badge ความน่าเชื่อถือแบบ Carsome */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold text-green-800 font-prompt">
                  ครูหนึ่งรถสวย การันตีคุณภาพ
                </span>
              </div>
              <div className="text-green-700 text-sm font-prompt">
                ✓ ไม่มีข้อบกพร่อง ✓ ไม่ชนหนัก ✓ ไม่เคยผ่านน้ำท่วม ✓ ไม่มีความเสียหายจากไฟไหม้
              </div>
            </div>

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
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-prompt">
              ที่ตั้งรถและการติดต่อ
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  className="block bg-green-600 hover:bg-green-700 text-white text-center py-4 px-6 rounded-xl font-bold text-lg transition-colors font-prompt"
                >
                  โทร 094-064-9018
                </a>
                <a
                  href="https://line.me/ti/p/@krunuengusedcar"
                  className="block bg-green-500 hover:bg-green-600 text-white text-center py-4 px-6 rounded-xl font-bold text-lg transition-colors font-prompt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Line: @krunuengusedcar
                </a>
              </div>
            </div>
          </div>

          {/* ขั้นตอนการซื้อรถ - แบบ Carsome */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-prompt">ขั้นตอนการซื้อรถ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="inline-block px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-primary border-2 border-primary font-semibold shadow-lg transition-all text-lg font-prompt"
            >
              กลับหน้ารวมรถ
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

// Static Paths/Props - Optimized data fetching for performance
export async function getServerSideProps({ params }) {
  try {
    const cars = await getAllCars();
    const car = cars.find(c => c.handle === params.handle) || null;

    if (!car) {
      return { notFound: true };
    }

    // Optimize data size by only sending necessary fields
    const optimizedCar = {
      id: car.id,
      handle: car.handle,
      title: car.title,
      vendor: car.vendor,
      model: car.model,
      year: car.year,
      price: car.price,
      description: car.description,
      images: car.images || [], // Show all images from source
      // Essential specs only
      mileage: car.mileage,
      transmission: car.transmission,
      engine: car.engine,
      fuel_type: car.fuel_type,
      color: car.color,
      province: car.province,
      seats: car.seats,
      availableForSale: car.availableForSale,
      vin: car.vin || null, // Fix undefined serialization error
    };

    return {
      props: {
        car: optimizedCar,
        // Remove allCars to reduce data transfer
      },
    };
  } catch (error) {
    console.error('Error fetching car data:', error);
    return { notFound: true };
  }
}

export default CarDetailPage;
