import React from 'react';
import SEO from '../components/SEO';
import Head from 'next/head';

export default function Promotion() {
  const baseUrl = 'https://chiangmaiusedcar.com';
  const pageUrl = `${baseUrl}/promotion`;
  const pageTitle = 'โปรโมชัน ฟรีดาวน์ ผ่อนถูก | ครูหนึ่งรถสวย';
  const pageDescription = 'โปรโมชันรถมือสองเชียงใหม่ ฟรีดาวน์ ของแถมจัดเต็ม | ครูหนึ่งรถสวย';
  const pageImage = `${baseUrl}/cover.jpg`;

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords="โปรโมชันรถมือสอง, รถมือสองเชียงใหม่, รถบ้านฟรีดาวน์, โปรรถมือสอง ฟรีดาวน์, รถมือสองราคาถูก, รถบ้านฟรีดาวน์ เชียงใหม่, รถมือสองผ่อนถูก, ของแถมรถมือสอง"
        url="/promotion"
      />
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

      <main className="max-w-4xl mx-auto p-4 font-prompt text-white" suppressHydrationWarning>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">
          โปรโมชัน ฟรีดาวน์ ผ่อนถูก
        </h1>

        <div className="text-center mb-6">
          <p className="text-lg text-white">รับข้อเสนอสุดพิเศษสำหรับลูกค้าทุกท่านที่ออกรถกับเรา</p>
        </div>

        <div className="space-y-10">
          {/* โปรโมชันล่าสุด */}
          <section aria-labelledby="latest-promo">
            <h2 id="latest-promo" className="text-xl font-semibold mb-4 text-white">
              โปรโมชันล่าสุด
            </h2>
            <ul className="space-y-2 list-disc list-inside text-white">
              <li>ฟรีตรวจเช็คระยะ เปลี่ยนถ่ายของเหลวก่อนส่งมอบ</li>
              <li>ฟรีค่าจัดไฟแนนซ์และค่าโอนกรรมสิทธิ์</li>
              <li>ฟรีบริการสปารถยนต์: ซักฟอกเบาะ พรม ห้องโดยสาร ห้องเครื่อง ขัดสีเต็มระบบ</li>
              <li>ฟรีค่าจัดส่งทั่วประเทศ</li>
            </ul>
          </section>

          {/* การรับประกัน */}
          <section aria-labelledby="warranty-info">
            <h2 id="warranty-info" className="text-xl font-semibold mb-4 text-white">
              การรับประกัน
            </h2>
            <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl text-center shadow">
              <p className="mb-2 text-gray-700">ออกรถกับครูหนึ่งรถสวยวันนี้</p>
              <p className="text-lg font-bold text-yellow-800">
                รับประกันเครื่องยนต์ และเกียร์ 1 ปีเต็ม ไม่จำกัดระยะทาง
              </p>
            </div>
          </section>

          {/* เครดิตดีดอกเบี้ยต่ำ */}
          <section aria-labelledby="credit-offer">
            <h2 id="credit-offer" className="text-xl font-semibold mb-4 text-white">
              สิทธิพิเศษสำหรับลูกค้าเครดิตดี
            </h2>
            <div className="bg-green-50 border border-green-300 p-4 rounded-xl text-center shadow">
              <p className="text-xl font-semibold text-green-700">ดอกเบี้ยเริ่มต้น 4.50% ต่อปี</p>
              <p className="text-sm text-gray-600 mt-2">เงื่อนไขเป็นไปตามที่ไฟแนนซ์กำหนด</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
