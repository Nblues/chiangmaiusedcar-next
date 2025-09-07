import React, { useState } from 'react';
import Head from 'next/head';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import { getAllCars } from '../../lib/shopify';
import { buildCarJsonLd, buildProductJsonLd } from '../../lib/seo/jsonld';
import Link from 'next/link';
import NextImage from 'next/image';

function CarDetailPage({ car }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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

  // เตรียมรูปภาพ
  const carImages = car?.images || [
    { url: '/herobanner/chiangmaiusedcar.webp', alt: car?.title || 'รถมือสอง' },
  ];
  const currentImage = carImages[selectedImageIndex] || carImages[0];

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

          {/* รูปรถ - Carsome Style */}
          <div className="mb-8">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 rounded-xl overflow-hidden shadow-lg">
              <NextImage
                src={currentImage.url}
                alt={currentImage.alt || car.title}
                fill
                className="object-cover"
                priority
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
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
              <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium font-prompt backdrop-blur-sm">
                <span className="text-white">{selectedImageIndex + 1}</span>
                <span className="text-gray-300 mx-1">/</span>
                <span className="text-gray-300">{carImages.length}</span>
                <span className="text-gray-300 ml-2">ภาพรถจริง</span>
              </div>

              {/* Keyboard hint */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs font-prompt hidden sm:block">
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
                    className={`relative flex-shrink-0 w-20 h-16 lg:w-24 lg:h-18 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      selectedImageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    type="button"
                    aria-label={`ดูรูปที่ ${index + 1}`}
                  >
                    <NextImage
                      src={img.url}
                      alt={`รูปที่ ${index + 1}`}
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
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide px-1">
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
                      <NextImage
                        src={img.url}
                        alt={`รูปที่ ${index + 1}`}
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

// Static Paths/Props - ปิด static generation เพื่อหลีกเลี่ยง Html import error
export async function getServerSideProps({ params }) {
  const cars = await getAllCars();
  const car = cars.find(c => c.handle === params.handle) || null;
  return { props: { car, allCars: cars } };
}

export default CarDetailPage;
