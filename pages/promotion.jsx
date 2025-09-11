import React from 'react';
import SEO from '../components/SEO';
import Head from 'next/head';
import A11yImage from '../components/A11yImage';
import { buildLocalBusinessJsonLd } from '../lib/seo/jsonld';

export default function Promotion() {
  const baseUrl = 'https://www.chiangmaiusedcar.com';
  const pageUrl = `${baseUrl}/promotion`;
  const pageTitle = 'โปรโมชัน ฟรีดาวน์ 0% รถ ECO Car ประหยัดน้ำมัน | ครูหนึ่งรถสวย';
  const pageDescription =
    'โปรโมชันรถมือสองเชียงใหม่ ฟรีดาวน์ 0% รถ ECO Car ประหยัดน้ำมัน เครดิตไม่ผ่านก็มีทาง ของแถมจัดเต็ม รับประกัน 1 ปี | ครูหนึ่งรถสวย';
  const pageImage = `${baseUrl}/herobanner/promotioncar.webp`;

  return (
    <>
      <SEO title={pageTitle} description={pageDescription} url="/promotion" image={pageImage} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildLocalBusinessJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: pageTitle,
              description: pageDescription,
              url: pageUrl,
            }),
          }}
        />
      </Head>

      <main
        className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
        suppressHydrationWarning
      >
        {/* Hero Banner */}
        <section className="relative w-full h-auto overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="relative w-full max-w-7xl mx-auto">
            <A11yImage
              src="/herobanner/promotioncar.webp"
              alt="โปรโมชั่นพิเศษ รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย ฟรีดาวน์ 0% รถ ECO Car"
              width={1920}
              height={1080}
              className="w-full h-auto object-contain"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              style={{ maxHeight: '80vh' }}
            />
          </div>

          {/* Content over banner - Mobile Optimized */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-1 py-2 sm:p-4">
            <div className="text-center text-white w-full max-w-5xl mx-auto">
              {/* Main Offer Title */}
              <div className="bg-black bg-opacity-60 rounded-xl sm:rounded-2xl p-2 sm:p-6 lg:p-8 backdrop-blur-sm mx-1 sm:mx-4">
                <h1 className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-prompt font-bold text-white drop-shadow-2xl mb-2 sm:mb-6 leading-tight">
                  ข้อเสนอสุดคุ้มสำหรับลูกค้า
                  <br className="sm:hidden" />
                  ที่ออกรถกับเรา
                </h1>

                {/* Special Offers Grid - Ultra Compact Mobile */}
                <div className="grid grid-cols-3 gap-0.5 sm:gap-4 lg:gap-6 mb-2 sm:mb-4">
                  <div className="bg-gradient-to-r from-primary/90 to-primary rounded sm:rounded-lg p-1 sm:p-4 shadow-lg">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm lg:text-base font-bold text-white leading-none">
                        ฟรี
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white leading-none">
                        ดาวน์
                      </div>
                      <div className="text-xs font-bold text-white">0%</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-accent/90 to-accent rounded sm:rounded-lg p-1 sm:p-4 shadow-lg">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm lg:text-base font-bold text-white leading-none">
                        ดอกเบี้ย
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white leading-none">
                        เริ่มต้น
                      </div>
                      <div className="text-xs font-bold text-white">4.50%</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gold/90 to-gold rounded sm:rounded-lg p-1 sm:p-4 shadow-lg">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm lg:text-base font-bold text-white leading-none">
                        รับประกัน
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white leading-none">
                        เครื่อง
                      </div>
                      <div className="text-xs font-bold text-white">1 ปี</div>
                    </div>
                  </div>
                </div>

                {/* Call to Action - Ultra Compact Mobile */}
                <div className="bg-white bg-opacity-20 rounded-lg sm:rounded-xl p-1.5 sm:p-3 backdrop-blur-sm">
                  <p className="text-xs sm:text-sm text-white opacity-95 mb-1 sm:mb-2">
                    โทรสอบถามเลย
                  </p>
                  <a
                    href="tel:0940649018"
                    className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-2 sm:px-6 py-1.5 sm:py-3 rounded-full font-bold text-xs sm:text-base hover:shadow-lg transition-all duration-300 font-prompt"
                  >
                    094-064-9018
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="space-y-16 sm:space-y-20">
            {/* Main Value Propositions */}
            <section aria-labelledby="value-props" className="text-center">
              <h2
                id="value-props"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-prompt mb-6"
              >
                ข้อเสนอสุดคุ้มสำหรับคุณ
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 font-prompt max-w-4xl mx-auto mb-12">
                รับสิทธิประโยชน์พิเศษเต็มๆ เมื่อคุณเลือกซื้อรถมือสองคุณภาพจากครูหนึ่งรถสวย
              </p>

              {/* Value Props Grid - Mobile Optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {/* ฟรีดาวน์ */}
                <div className="group bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-accent/20 hover:border-accent hover:-translate-y-2">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-white"
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
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-prompt mb-3 sm:mb-4">
                    ฟรีดาวน์ 0%
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2 font-prompt text-left">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></span>
                      <span>ไม่ต้องมีเงินดาวน์</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></span>
                      <span>เริ่มผ่อนได้ทันที</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></span>
                      <span>สำหรับลูกค้าที่ผ่านคุณสมบัติ</span>
                    </li>
                  </ul>
                </div>

                {/* ดอกเบี้ยต่ำ */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gold/20 hover:border-gold hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-prompt mb-4">
                    ดอกเบี้ย 4.50%
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2 font-prompt text-left">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                      อัตราพิเศษลูกค้าเครดิตดี
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>ผ่อนได้นานสูงสุด 7
                      ปี
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
                      เครดิตไม่ผ่านก็มีทาง
                    </li>
                  </ul>
                </div>

                {/* รับประกัน */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-primary/20 hover:border-primary hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-prompt mb-4">
                    รับประกัน 1 ปี
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2 font-prompt text-left">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      รับประกันเครื่องยนต์
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      รับประกันระบบเกียร์
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>ไม่จำกัดกิโลเมตร
                    </li>
                  </ul>
                </div>

                {/* เงินสด */}
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-500/20 hover:border-green-500 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-prompt mb-4">ลูกค้าเงินสด</h3>
                  <ul className="text-sm text-gray-600 space-y-2 font-prompt text-left">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      โอนกรรมสิทธิ์ฟรี
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      ส่งฟรีทั่วประเทศ
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>สปาเต็มระบบ
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Complete Service Package */}
            <section
              aria-labelledby="service-package"
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 sm:p-12"
            >
              <div className="text-center mb-12">
                <h2
                  id="service-package"
                  className="text-3xl sm:text-4xl font-bold text-gray-900 font-prompt mb-6"
                >
                  บริการครบครันในราคาเดียว
                </h2>
                <p className="text-lg text-gray-600 font-prompt max-w-3xl mx-auto">
                  ปลอดภัยอุ่นใจ 100% พร้อมการันตีคุณภาพระดับ 5 ดาว
                  จากบริการมาตรฐานสูงของครูหนึ่งรถสวย
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Pre-Delivery Services */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-primary rounded-xl flex items-center justify-center mb-6">
                    <svg
                      className="w-7 h-7 text-white"
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
                  <h3 className="text-xl font-bold text-gray-900 font-prompt mb-4">
                    บริการก่อนส่งมอบ
                  </h3>
                  <ul className="space-y-3 text-gray-600 font-prompt">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      ตรวจเช็คเต็มระบบ
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      เปลี่ยนถ่ายของเหลว
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      บริการสปาเต็มระบบ
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>ใบการันตี 5 ดาว
                    </li>
                  </ul>
                </div>

                {/* Documentation & Transfer */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                    <svg
                      className="w-7 h-7 text-white"
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
                  <h3 className="text-xl font-bold text-gray-900 font-prompt mb-4">
                    เอกสารและการโอน
                  </h3>
                  <ul className="space-y-3 text-gray-600 font-prompt">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      โอนกรรมสิทธิ์ฟรี
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      ฟรีค่าธรรมเนียมทุกรายการ
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>สัญญาส่งมอบ
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>สัญญารับประกัน
                    </li>
                  </ul>
                </div>

                {/* Delivery & Warranty */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100 hover:border-orange-300 md:col-span-2 lg:col-span-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent to-orange-500 rounded-xl flex items-center justify-center mb-6">
                    <svg
                      className="w-7 h-7 text-white"
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
                  <h3 className="text-xl font-bold text-gray-900 font-prompt mb-4">
                    การส่งมอบและรับประกัน
                  </h3>
                  <ul className="space-y-3 text-gray-600 font-prompt">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>ส่งฟรีทั่วประเทศ
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>รับประกัน 1 ปี
                      ไม่จำกัดกิโลเมตร
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>บริการหลังการขาย
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                      การตรวจสอบจากบริษัทกลาง
                    </li>
                  </ul>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-primary rounded-2xl p-8 text-white">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-white"
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
                <h3 className="text-2xl font-bold font-prompt mb-3 text-white">
                  การันตีความปลอดภัย 100%
                </h3>
                <p className="text-lg opacity-90 font-prompt text-white">
                  จากบริการมาตรฐานสูงของครูหนึ่งรถสวย
                </p>
              </div>
            </section>

            {/* Financing Options */}
            <section aria-labelledby="financing" className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Warranty Highlight */}
              <div className="bg-gradient-to-br from-yellow-400 via-gold to-yellow-600 rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg
                      className="w-10 h-10 text-white"
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
                  <h2 id="warranty-info" className="text-3xl font-bold mb-6 font-prompt">
                    รับประกันเต็มระบบ
                  </h2>
                  <div className="space-y-4">
                    <p className="text-xl font-prompt">เครื่องยนต์ + เกียร์</p>
                    <p className="text-5xl font-bold font-prompt">1 ปีเต็ม</p>
                    <p className="text-lg font-prompt opacity-90">ไม่จำกัดระยะทาง</p>
                  </div>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h2 id="credit-offer" className="text-3xl font-bold mb-6 font-prompt">
                    ลูกค้าเครดิตดี
                  </h2>
                  <div className="space-y-4">
                    <p className="text-xl font-prompt">ดอกเบี้ยเริ่มต้น</p>
                    <p className="text-5xl font-bold font-prompt">4.50%</p>
                    <p className="text-lg font-prompt opacity-90">ต่อปี*</p>
                    <p className="text-sm opacity-75 font-prompt mt-6">
                      *เงื่อนไขเป็นไปตามที่ไฟแนนซ์กำหนด
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA - Mobile Optimized */}
            <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary rounded-3xl p-6 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 font-prompt leading-tight text-white">
                  พร้อมเป็นเจ้าของรถในฝัน
                  <br className="sm:hidden" />
                  แล้วหรือยัง?
                </h2>
                <p className="text-base sm:text-xl mb-8 sm:mb-10 opacity-90 font-prompt max-w-2xl mx-auto text-white">
                  ติดต่อเราเลยวันนี้เพื่อรับข้อเสนอสุดพิเศษ และสิทธิประโยชน์ครบครันที่คุณสมควรได้รับ
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
                  <a
                    href="https://lin.ee/8ugfzstD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-green-500 hover:bg-green-400 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 font-prompt shadow-xl hover:shadow-2xl transform hover:-translate-y-2 flex items-center justify-center gap-3 sm:gap-4"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.628-.629.628M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                      </svg>
                    </div>
                    <span>แชท LINE</span>
                  </a>

                  <a
                    href="tel:094-0649018"
                    className="group bg-white hover:bg-gray-100 text-gray-900 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 font-prompt shadow-xl hover:shadow-2xl transform hover:-translate-y-2 flex items-center justify-center gap-3 sm:gap-4"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <span>094-064-9018</span>
                  </a>
                </div>

                {/* Contact Hours - Mobile Friendly */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white border-opacity-20">
                  <p className="text-xs sm:text-sm opacity-75 font-prompt">
                    เปิดให้บริการทุกวัน 9:00 - 20:00 น.
                    <br className="sm:hidden" />
                    <span className="hidden sm:inline"> | </span>พร้อมให้คำปรึกษาฟรี
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

// Using SSR for now due to Html import issues during static generation
export async function getServerSideProps() {
  return {
    props: {},
  };
}
