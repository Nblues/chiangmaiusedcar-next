import React from 'react';
import Link from 'next/link';
import SEO from '../../../components/SEO';
import Image from 'next/image';
import { buildLocalBusinessJsonLd } from '../../../lib/seo/jsonld';

export default function Carsสันพระเนตร() {
  const pageTitle = 'รถมือสองสันพระเนตร เชียงใหม่ - ครูหนึ่งรถสวย';
  const pageDescription =
    'รถมือสองสันพระเนตร เชียงใหม่ ครูหนึ่งรถสวย คุณภาพดี ราคาดี ตรวจสภาพครบถ้วน รับประกัน 1 ปี ส่งรถถึงบ้าน โทร 094-064-9018';

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        url="/cars/เชียงใหม่/สันพระเนตร"
        image="https://chiangmaiusedcar.com/herobanner/cnxallcars.webp"
        pageType="location"
        structuredData={buildLocalBusinessJsonLd()}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative w-full h-[250px] md:h-[350px] overflow-hidden">
          <Image
            src="/herobanner/cnxallcars.webp"
            alt="รถมือสองสันพระเนตร เชียงใหม่ - ครูหนึ่งรถสวย"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-2xl md:text-4xl font-bold mb-4">รถมือสองสันพระเนตร 🚗</h1>
              <p className="text-lg mb-6">คุณภาพดี ราคาดี ครูหนึ่งรถสวย</p>
              <Link href="/all-cars" className="btn-primary inline-block">
                ดูรถทั้งหมด
              </Link>
            </div>
          </div>
        </section>

        {/* Local Service Information */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8 text-primary">
                บริการรถมือสองในสันพระเนตร เชียงใหม่
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    🏅 บริการพิเศษในสันพระเนตร
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span>ส่งรถถึงบ้านในสันพระเนตร</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span>ตรวจสภาพรถ ณ จุดนัดหมาย</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span>บริการหลังการขายในสันพระเนตร</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">✓</span>
                      <span>รับประกันคุณภาพ 1 ปี</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-primary">💰 เงื่อนไขพิเศษ</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>ดาวน์ 0% สำหรับลูกค้าในสันพระเนตร</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>ผ่อนเริ่มต้น 3,000 บาท/เดือน</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>ดอกเบี้ยต่ำพิเศษ</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-accent mr-2">•</span>
                      <span>ขั้นตอนง่าย อนุมัติเร็ว</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Popular Models in District */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-6 text-primary">
                  รุ่นรถยอดนิยมในสันพระเนตร
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="font-medium">Toyota Vios</div>
                    <div className="text-sm text-gray-600">มือสองสันพระเนตร</div>
                  </div>
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="font-medium">Honda City</div>
                    <div className="text-sm text-gray-600">มือสองสันพระเนตร</div>
                  </div>
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="font-medium">Mazda 2</div>
                    <div className="text-sm text-gray-600">มือสองสันพระเนตร</div>
                  </div>
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="font-medium">Nissan Almera</div>
                    <div className="text-sm text-gray-600">มือสองสันพระเนตร</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">สนใจรถมือสองในสันพระเนตร?</h2>
            <p className="text-lg mb-6">ติดต่อเราเพื่อรับคำปรึกษาและดูรถ</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="tel:0940649018" className="btn-secondary">
                โทร 094-064-9018
              </a>
              <Link href="/contact" className="btn-outline">
                ติดต่อเรา
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
