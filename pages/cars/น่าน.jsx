import React from 'react';
import Link from 'next/link';
import SEO from '../../components/SEO';
import Image from 'next/image';
import { buildLocalBusinessJsonLd } from '../../lib/seo/jsonld';

export default function Carsน่าน() {
  const pageTitle = 'รถมือสองน่าน - ครูหนึ่งรถสวย';
  const pageDescription =
    'รถมือสองน่าน คุณภาพสูง ครูหนึ่งรถสวย ตรวจสภาพครบถ้วน รับประกัน 1 ปี โทร 094-064-9018 บริการทั่วน่าน Toyota Honda Mazda Nissan';
  const pageUrl = `https://www.chiangmaiusedcar.com/cars/น่าน`;

  const districts = ['เมืองน่าน', 'ปัว', 'เวียงสา', 'ท่าวังผา'];

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        url="/cars/น่าน"
        image="https://chiangmaiusedcar.com/herobanner/cnxallcars.webp"
        pageType="location"
        structuredData={buildLocalBusinessJsonLd()}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
          <Image
            src="/herobanner/cnxallcars.webp"
            alt="รถมือสองน่าน คุณภาพดี - ครูหนึ่งรถสวย"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">รถมือสองน่าน 🚗</h1>
              <p className="text-lg md:text-xl mb-6">คุณภาพดี ราคาดี ครูหนึ่งรถสวย</p>
              <Link href="/all-cars" className="btn-primary inline-block">
                ดูรถทั้งหมด
              </Link>
            </div>
          </div>
        </section>

        {/* Province Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-primary">
                บริการรถมือสองครอบคลุมทั่วน่าน
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">
                    🏆 ทำไมต้องเลือกครูหนึ่งรถสวย?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span>ตรวจสภาพรถครบถ้วนทุกคัน</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span>รับประกันคุณภาพ 1 ปี</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span>บริการส่งรถถึงบ้านในน่าน</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span>ดาวน์ 0% ผ่อนเริ่ม 3,000 บาท</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-primary">
                    🚗 รุ่นรถยอดนิยมในน่าน
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Toyota Vios มือสองน่าน</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Honda City มือสองน่าน</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Mazda 2 มือสองน่าน</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>Nissan Almera มือสองน่าน</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Districts Coverage */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  📍 พื้นที่ให้บริการในน่าน
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {districts.map((district, index) => (
                    <div key={index} className="text-sm py-1">
                      • {district}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">สนใจรถมือสองน่าน?</h2>
            <p className="text-lg mb-8">ติดต่อเราวันนี้ บริการส่งรถถึงบ้านทั่วน่าน</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-secondary">
                ติดต่อเรา
              </Link>
              <Link href="/all-cars" className="btn-outline">
                ดูรถทั้งหมด
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400, // 24 hours
  };
}
