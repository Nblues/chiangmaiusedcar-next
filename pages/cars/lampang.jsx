import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../../components/SEO';
import A11yImage from '../../components/A11yImage';
import { buildLocalBusinessJsonLd } from '../../lib/seo/jsonld';
import { getHomepageCars } from '../../lib/shopify.mjs';
import { safeGet } from '../../lib/safeFetch';
import { carAlt } from '../../utils/a11y';

// Helper: format price safely for display
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

export default function CarsLampang({ cars }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeCars = Array.isArray(cars) ? cars : [];

  const pageTitle = 'รถมือสองลำปาง - ครูหนึ่งรถสวย';
  const pageDescription =
    'รถมือสองลำปาง คุณภาพสูง ครูหนึ่งรถสวย ตรวจสภาพครบถ้วน รับประกัน 1 ปี โทร 094-064-9018 บริการทั่วลำปาง Toyota Honda Mazda Nissan';

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        url="/cars/ลำปาง"
        image="https://chiangmaiusedcar.com/herobanner/cnxcar.webp"
        pageType="location"
        structuredData={buildLocalBusinessJsonLd()}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <header className="relative w-full h-auto flex items-center justify-center bg-gradient-to-r from-orange-100 to-blue-100">
          <div className="relative w-full max-w-7xl mx-auto">
            <A11yImage
              src="/herobanner/cnxcar.webp"
              alt="ปกเว็บ ครูหนึ่งรถสวย รถมือสองลำปาง"
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

        <section id="hero" className="relative">
          <div className="hero-card max-w-4xl w-[90%] mx-auto my-6 flex flex-col md:flex-row items-center gap-6 px-6 py-8 rounded-2xl border border-orange-300 bg-white/95 shadow-lg">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
                รถมือสองลำปาง
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-orange-500 mb-4">
                คุณภาพระดับพรีเมียม
              </h2>
              <p className="text-base leading-relaxed text-gray-900">
                ครูหนึ่งรถสวย ผู้เชี่ยวชาญรถมือสองคุณภาพดีในลำปาง ตรวจสภาพครบถ้วน เช็คประวัติรถ
                ฟรีดาวน์ ผ่อนถูก รับประกันหลังการขาย 1 ปี ส่งฟรีทุกอำเภอในลำปาง
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

        {/* รถแนะนำลำปาง */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">
                รถแนะนำเรามีบริการส่งฟรีครอบคลุมทุกอำเภอทั้งจังหวัดลำปาง
              </h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                รถมือสองคุณภาพดีที่คัดสรรมาเพื่อลูกค้าในลำปาง ตรวจสภาพครบถ้วน รับประกัน 1 ปี
                พร้อมบริการส่งฟรีถึงที่ทุกอำเภอ
              </p>
            </div>

            <div className="grid gap-4 md:gap-6 grid-cols-2 max-w-4xl mx-auto">
              {!mounted ? (
                // Loading state - Skeleton Cards
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-pulse"
                  >
                    <div className="w-full h-32 md:h-48 bg-gray-200"></div>
                    <div className="p-3 md:p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="space-y-1 mb-3">
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 md:h-10 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                ))
              ) : safeCars.length === 0 ? (
                // Empty state when no cars available
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🚗</div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">
                    ขออภัย ยังไม่มีรถให้แสดง
                  </h3>
                  <p className="text-gray-500 mb-4">
                    เรากำลังอัปเดตรถใหม่ ติดตามได้ที่ Facebook หรือ LINE
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    ติดต่อสอบถาม
                  </Link>
                </div>
              ) : (
                safeCars.slice(0, 8).map(car => (
                  <article
                    key={car.id}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-accent/50 transition-all duration-300 overflow-hidden border border-gray-200 hover:border-accent flex flex-col h-full"
                  >
                    <Link
                      href={
                        safeGet(car, 'handle') &&
                        typeof car.handle === 'string' &&
                        car.handle.length
                          ? `/car/${encodeURIComponent(car.handle)}`
                          : '/all-cars'
                      }
                      className="block focus:outline-none flex-1"
                    >
                      <figure className="relative w-full h-32 md:h-48 overflow-hidden bg-gray-100">
                        <A11yImage
                          src={safeGet(car, 'images.0.url') || '/cover.jpg'}
                          alt={carAlt(car)}
                          fallbackAlt={`${safeGet(car, 'title', 'รถมือสองคุณภาพดี')} - ราคา ${getPriceInfo(safeGet(car, 'price.amount')).display} บาท`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          sizes="(max-width: 768px) 50vw, 50vw"
                        />
                        {safeGet(car, 'tags', []).includes('ใหม่') && (
                          <span className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                            ใหม่
                          </span>
                        )}
                      </figure>
                      <div className="p-3 md:p-4 flex flex-col">
                        <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {safeGet(car, 'title', 'รถมือสองคุณภาพดี')}
                        </h3>
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                          {(() => {
                            const price = getPriceInfo(safeGet(car, 'price.amount'));
                            return (
                              <p className="text-lg md:text-xl font-bold text-accent">
                                ฿{price.display}
                              </p>
                            );
                          })()}
                        </div>
                        <ul className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 space-y-1">
                          {safeGet(car, 'tags', []).includes('ฟรีดาวน์') && (
                            <li className="flex items-center">
                              <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full mr-2"></span>
                              ฟรีดาวน์
                            </li>
                          )}
                          {safeGet(car, 'tags', []).includes('ผ่อนถูก') && (
                            <li className="flex items-center">
                              <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full mr-2"></span>
                              ผ่อนถูก
                            </li>
                          )}
                          <li className="flex items-center">
                            <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full mr-2"></span>
                            รับประกัน 1 ปี
                          </li>
                        </ul>
                      </div>
                    </Link>
                    <div className="p-3 md:p-4 pt-0">
                      <Link
                        href={
                          typeof safeGet(car, 'handle') === 'string' &&
                          safeGet(car, 'handle', '').length
                            ? `/car/${encodeURIComponent(safeGet(car, 'handle'))}`
                            : '/all-cars'
                        }
                        className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-lg py-2 px-3 md:px-4 text-sm md:text-base font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                        aria-label={`ดูรายละเอียด ${safeGet(car, 'title', 'รถยนต์')}`}
                      >
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/all-cars"
                className="inline-flex items-center bg-gray-900 hover:bg-accent text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 space-x-3"
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
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">ติดตามเราบนโซเชียลมีเดีย</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                อัปเดตรถเข้าใหม่ รีวิวลูกค้า และข่าวสารพิเศษทุกวัน
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {/* Facebook Page */}
              <a
                href="https://www.facebook.com/KN2car"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-600 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-sm mb-1">
                    Facebook
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">เพจหลัก</p>
                  <p className="text-xs font-semibold text-blue-600">1 ล้าน ติดตาม</p>
                </div>
              </a>

              {/* Facebook Personal */}
              <a
                href="https://www.facebook.com/nuengblues"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-500 transition-colors text-sm mb-1">
                    Facebook
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">ส่วนตัว</p>
                  <p className="text-xs font-semibold text-blue-500">1 แสน+ ติดตาม</p>
                </div>
              </a>

              {/* Facebook Group */}
              <a
                href="https://www.facebook.com/groups/kru.nueng.goodcar"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors text-sm mb-1">
                    Facebook
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">กลุ่ม FC</p>
                  <p className="text-xs font-semibold text-blue-700">7.3 หมื่น สมาชิก</p>
                </div>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@krunueng_usedcar"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-gray-900 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors text-sm mb-1">
                    TikTok
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">วิดีโอสั้น</p>
                  <p className="text-xs font-semibold text-gray-900">1.5 แสน ติดตาม</p>
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@chiangraiusedcar"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-red-600 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors text-sm mb-1">
                    YouTube
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">วิดีโอรีวิว</p>
                  <p className="text-xs font-semibold text-red-600">4 หมื่น+ ติดตาม</p>
                </div>
              </a>

              {/* LINE */}
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-green-500 transition-colors text-sm mb-1">
                    LINE
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">แชทสด</p>
                  <p className="text-xs font-semibold text-green-500">สอบถามเลย</p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Province Information */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-primary mb-6 text-center">
                  ทำไมต้องเลือกซื้อรถมือสองลำปาง จากครูหนึ่งรถสวย
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-white"
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
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">ตรวจสภาพรถ 100%</h3>
                          <p className="text-gray-700 leading-relaxed">
                            ช่างมืออาชีพตรวจสภาพรถทุกระบบ เครื่องยนต์ เกียร์ ระบบไฟฟ้า ระบบเบรก
                            ระบบช่วงล่าง และตัวถัง ครบถ้วนทุกรายการ
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-accent transition-all duration-300 shadow-md hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">รับประกัน 1 ปี</h3>
                          <p className="text-gray-700 leading-relaxed">
                            รับประกันคุณภาพรถทุกคัน 1 ปีเต็ม หรือ 20,000 กิโลเมตร
                            พร้อมบริการซ่อมและเปลี่ยนอะไหล่ฟรี ตามเงื่อนไข
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">ส่งฟรีทุกอำเภอ</h3>
                          <p className="text-gray-700 leading-relaxed">
                            บริการส่งรถฟรีถึงบ้านทุกอำเภอในลำปาง ไม่ว่าจะเป็น เมืองลำปาง แม่ทะ
                            เกาะคา แม่พริก แม่เมาะ งาว เสริมงาม หางฉัตร ทุ่งหัวช้าง แจ้ห่ม วังเหนือ
                            เถิน
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-accent transition-all duration-300 shadow-md hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-white"
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
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">ฟรีดาวน์ ผ่อนยาว</h3>
                          <p className="text-gray-700 leading-relaxed">
                            สำหรับลูกค้าผ่านเกณฑ์ สามารถซื้อรถฟรีดาวน์ ผ่อนสบายๆ นานสูงสุด 6 ปี
                            ดอกเบี้ยพิเศษเริ่มต้น 1.99% ต่อปี
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">เช็คประวัติรถ</h3>
                          <p className="text-gray-700 leading-relaxed">
                            ตรวจสอบประวัติรถ ประวัติการชน การจมน้ำ การติดไฟ และสถานะจำนำ
                            จากกรมการขนส่งทางบก ให้มั่นใจทุกการซื้อ
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-accent transition-all duration-300 shadow-md hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-white"
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
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            ศูนย์บริการครบครัน
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            ศูนย์บริการหลังการขายพร้อมอะไหล่แท้ ช่างมืออาชีพ เปิดบริการทุกวัน
                            9:00-20:00 น. ตลอดปี
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 bg-primary p-8 rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      สนใจซื้อรถมือสองลำปาง ติดต่อครูหนึ่งรถสวย
                    </h3>
                    <p className="text-white/90 mb-8 leading-relaxed">
                      ด้วยประสบการณ์กว่า 15 ปี ในการ{' '}
                      <span className="font-semibold text-white">ซื้อขายรถมือสองลำปาง</span>{' '}
                      และจังหวัดใกล้เคียง เรามีรถคุณภาพดีให้เลือกหลากหลายยี่ห้อ Toyota Honda Nissan
                      Mazda Mitsubishi ทุกรุ่น ทุกปี พร้อม
                      <span className="font-semibold text-white">บริการส่งฟรีถึงบ้าน</span>
                      ทุกอำเภอในลำปาง รับรองคุณภาพ เช็คประวัติรถ 100%
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="tel:0940649018"
                        className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors duration-300 shadow-lg"
                      >
                        โทร 094-064-9018
                      </a>
                      <a
                        href="https://lin.ee/8ugfzstD"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-colors duration-300 shadow-lg"
                      >
                        LINE @krunung
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Static props to fetch cars data
export async function getStaticProps() {
  try {
    const cars = await getHomepageCars();
    return {
      props: {
        cars: cars || [],
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error fetching cars for Lampang page:', error);
    return {
      props: {
        cars: [],
      },
      revalidate: 300,
    };
  }
}
