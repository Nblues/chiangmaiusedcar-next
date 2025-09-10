import React from 'react';
import SEO from '../components/SEO';
import Head from 'next/head';
import A11yImage from '../components/A11yImage';
import { buildLocalBusinessJsonLd } from '../lib/seo/jsonld';

export default function Promotion() {
  const baseUrl = 'https://chiangmaiusedcar.com';
  const pageUrl = `${baseUrl}/promotion`;
  const pageTitle = 'โปรโมชัน ฟรีดาวน์ 0% รถ ECO Car ประหยัดน้ำมัน | ครูหนึ่งรถสวย';
  const pageDescription =
    'โปรโมชันรถมือสองเชียงใหม่ ฟรีดาวน์ 0% รถ ECO Car ประหยัดน้ำมัน เครดิตไม่ผ่านก็มีทาง ของแถมจัดเต็ม รับประกัน 1 ปี | ครูหนึ่งรถสวย';
  const pageImage = `${baseUrl}/herobanner/promotion.webp`;

  return (
    <>
      <SEO title={pageTitle} description={pageDescription} url="/promotion" />
      <Head>
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
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
        <section className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
          <A11yImage
            src="/herobanner/promotion.webp"
            alt="โปรโมชั่นพิเศษ รถมือสองเชียงใหม่ - ครูหนึ่งรถสวย"
            fill
            className="object-cover object-center"
            priority
            quality={85}
            sizes="100vw"
          />

          {/* Content over banner */}
          <div className="absolute inset-0 flex items-end md:items-center justify-center pb-8 md:pb-0 overflow-hidden">
            <div className="text-center text-white px-4 max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 font-prompt drop-shadow-2xl text-white">
                โปรโมชั่นพิเศษ
              </h1>
              <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-prompt drop-shadow-2xl text-white font-bold mb-4">
                ข้อเสนอสุดคุ้มสำหรับลูกค้าที่ออกรถกับเรา
              </p>
              <span className="text-sm sm:text-base md:text-lg font-semibold font-prompt text-white drop-shadow-2xl">
                ฟรีดาวน์ • ผ่อนถูก • รับประกัน 1 ปี
              </span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="space-y-12">
            {/* โปรโมชันล่าสุด */}
            <section aria-labelledby="latest-promo">
              <div className="text-center mb-10">
                <h2 id="latest-promo" className="text-3xl font-bold text-primary font-prompt mb-4">
                  โปรโมชั่นล่าสุด
                </h2>
                <p className="text-gray-600 font-prompt">
                  สิทธิประโยชน์ที่คุณจะได้รับเมื่อออกรถกับเรา
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-prompt mb-3">ตรวจเช็คฟรี</h3>
                  <p className="text-gray-600 font-prompt leading-relaxed">
                    ตรวจเช็คระยะและเปลี่ยนถ่ายของเหลวก่อนส่งมอบรถให้ลูกค้า
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                    <svg
                      className="w-6 h-6 text-green-600"
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
                  <h3 className="text-xl font-bold text-gray-800 font-prompt mb-3">
                    ฟรีค่าธรรมเนียม
                  </h3>
                  <p className="text-gray-600 font-prompt leading-relaxed">
                    ค่าจัดไฟแนนซ์และค่าโอนกรรมสิทธิ์ทั้งหมด ไม่มีค่าใช้จ่ายเพิ่มเติม
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 font-prompt mb-3">
                    บริการสปารถยนต์
                  </h3>
                  <p className="text-gray-600 font-prompt leading-relaxed">
                    ซักฟอกเบาะ พรม ห้องโดยสาร ห้องเครื่อง และขัดสีเต็มระบบ
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
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
                  <h3 className="text-xl font-bold text-gray-800 font-prompt mb-3">
                    ส่งฟรีทั่วประเทศ
                  </h3>
                  <p className="text-gray-600 font-prompt leading-relaxed">
                    บริการจัดส่งรถถึงบ้านฟรีทุกจังหวัดทั่วประเทศไทย
                  </p>
                </div>
              </div>
            </section>

            {/* การรับประกัน */}
            <section aria-labelledby="warranty-info">
              <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl shadow-2xl p-10 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  <h2 id="warranty-info" className="text-3xl font-bold mb-4 font-prompt">
                    การรับประกัน
                  </h2>
                  <p className="text-xl mb-2 font-prompt opacity-90">ออกรถกับครูหนึ่งรถสวยวันนี้</p>
                  <p className="text-2xl md:text-3xl font-bold font-prompt">
                    รับประกันเครื่องยนต์ และเกียร์
                    <br />
                    <span className="text-4xl">1 ปีเต็ม</span>
                    <br />
                    ไม่จำกัดระยะทาง
                  </p>
                </div>
              </div>
            </section>

            {/* เครดิตดีดอกเบี้ยต่ำ */}
            <section aria-labelledby="credit-offer">
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-3xl shadow-2xl p-10 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  <h2 id="credit-offer" className="text-3xl font-bold mb-4 font-prompt">
                    สิทธิพิเศษลูกค้าเครดิตดี
                  </h2>
                  <p className="text-3xl md:text-4xl font-bold font-prompt mb-4">
                    ดอกเบี้ยเริ่มต้น
                  </p>
                  <p className="text-5xl md:text-6xl font-bold font-prompt mb-4">4.50%</p>
                  <p className="text-xl font-prompt opacity-90">ต่อปี</p>
                  <p className="text-sm opacity-75 font-prompt mt-4">
                    *เงื่อนไขเป็นไปตามที่ไฟแนนซ์กำหนด
                  </p>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white rounded-3xl shadow-2xl p-10 text-center border border-gray-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 font-prompt">
                พร้อมเป็นเจ้าของรถในฝันแล้วหรือยัง?
              </h2>
              <p className="text-xl mb-8 text-gray-600 font-prompt">
                ติดต่อเราเลยวันนี้เพื่อรับข้อเสนอสุดพิเศษ
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 font-prompt shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.628-.629.628M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  แชท LINE
                </a>
                <a
                  href="tel:094-0649018"
                  className="bg-primary hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 font-prompt shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  โทร 094-064-9018
                </a>
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
