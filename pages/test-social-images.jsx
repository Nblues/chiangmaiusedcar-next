/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { getHomepageCars } from '../lib/shopify.mjs';
import { DEFAULT_SOCIAL_IMAGES } from '../lib/social-sharing';

export default function TestSocialImages({ cars }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const seo = (
    <SEO
      title="ทดสอบรูปแชร์ลิงก์"
      description="หน้าทดสอบรูปแชร์ลิงก์ (ภายใน)"
      url="/test-social-images"
      noindex={true}
    />
  );

  if (!mounted) return <>{seo}</>;

  const testPages = [
    { type: 'home', path: '/', image: DEFAULT_SOCIAL_IMAGES.home },
    { type: 'all-cars', path: '/all-cars', image: DEFAULT_SOCIAL_IMAGES['all-cars'] },
    { type: 'sell-car', path: '/sell-car', image: DEFAULT_SOCIAL_IMAGES['sell-car'] },
    { type: 'about', path: '/about', image: DEFAULT_SOCIAL_IMAGES.about },
    { type: 'contact', path: '/contact', image: DEFAULT_SOCIAL_IMAGES.contact },
    { type: 'promotion', path: '/promotion', image: DEFAULT_SOCIAL_IMAGES.promotion },
    { type: 'credit-check', path: '/credit-check', image: DEFAULT_SOCIAL_IMAGES['credit-check'] },
    {
      type: 'payment-calculator',
      path: '/payment-calculator',
      image: DEFAULT_SOCIAL_IMAGES['payment-calculator'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-prompt">
      {seo}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-4">ทดสอบระบบรูปภาพสำหรับแชร์ลิงก์</h1>
        <p className="text-gray-600 mb-8">
          ตรวจสอบว่ารูปที่แสดงเมื่อแชร์ลิงก์ตรงกับรูปที่ใช้ในเว็บจริงหรือไม่
        </p>

        {/* หน้าทั่วไป */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gold pb-2">
            📄 หน้าทั่วไป (Static Pages)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testPages.map(page => (
              <div key={page.type} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={page.image}
                    alt={`Preview ${page.type}`}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.target.src = '/herobanner/chiangmaiusedcar.webp';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    1200x630px
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{page.type}</h3>
                  <p className="text-sm text-gray-600 mb-3">Path: {page.path}</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-center text-sm py-2"
                    >
                      🌐 เปิดหน้าจริง
                    </a>
                    <a
                      href={`https://developers.facebook.com/tools/debug/?q=https://www.chiangmaiusedcar.com${page.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-center text-sm py-2"
                    >
                      🔍 ตรวจสอบ FB
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* หน้ารถยนต์ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 border-b-2 border-gold pb-2">
            🚗 หน้ารายละเอียดรถ (Dynamic Pages)
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
            <p className="text-amber-800 font-semibold">
              ⚠️ หน้ารถแต่ละคันจะใช้รูปแรกของรถนั้นๆ (ไม่ใช่รูปที่กำลังเลือกดู)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.slice(0, 6).map(car => {
              const firstImage = car.images?.[0]?.url || DEFAULT_SOCIAL_IMAGES.car;
              const carUrl = `/car/${car.handle}`;
              return (
                <div key={car.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative aspect-video bg-gray-200">
                    <img
                      src={firstImage}
                      alt={car.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.target.src = DEFAULT_SOCIAL_IMAGES.car;
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                      รูปที่แชร์
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{car.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">Handle: {car.handle}</p>
                    <div className="flex flex-col gap-2">
                      <a
                        href={carUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-center text-sm py-2"
                      >
                        🌐 เปิดหน้ารถ
                      </a>
                      <a
                        href={`https://developers.facebook.com/tools/debug/?q=https://www.chiangmaiusedcar.com${carUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-center text-sm py-2"
                      >
                        🔍 ตรวจสอบ FB
                      </a>
                      <a
                        href={`https://cards-dev.twitter.com/validator`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-400 hover:bg-blue-500 text-white text-center text-sm py-2 rounded transition-colors"
                      >
                        🐦 ตรวจสอบ Twitter
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* คำแนะนำ */}
        <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="text-xl font-bold text-blue-900 mb-4">📝 วิธีตรวจสอบ</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>
              <strong>เปิดหน้าจริง</strong> - ดูว่ารูปที่แสดงในเว็บเป็นรูปไหน
            </li>
            <li>
              <strong>คลิก &quot;ตรวจสอบ FB&quot;</strong> - ดู Preview ที่ Facebook จะแสดงเมื่อแชร์
            </li>
            <li>
              <strong>เปรียบเทียบ</strong> - รูปใน Facebook Debugger ต้องตรงกับรูปในเว็บ
            </li>
            <li>
              <strong>หากไม่ตรง</strong> - กด &quot;Scrape Again&quot; ใน Facebook Debugger
            </li>
          </ol>

          <div className="mt-6 pt-6 border-t border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">🔧 เครื่องมือเพิ่มเติม</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href="https://developers.facebook.com/tools/debug/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white hover:bg-blue-100 p-3 rounded border border-blue-200 transition-colors"
              >
                <div className="font-semibold">Facebook Sharing Debugger</div>
                <div className="text-sm text-gray-600">ตรวจสอบ OG tags และรูปแชร์</div>
              </a>
              <a
                href="https://cards-dev.twitter.com/validator"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white hover:bg-blue-100 p-3 rounded border border-blue-200 transition-colors"
              >
                <div className="font-semibold">Twitter Card Validator</div>
                <div className="text-sm text-gray-600">ตรวจสอบ Twitter Card</div>
              </a>
              <a
                href="https://www.linkedin.com/post-inspector/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white hover:bg-blue-100 p-3 rounded border border-blue-200 transition-colors"
              >
                <div className="font-semibold">LinkedIn Post Inspector</div>
                <div className="text-sm text-gray-600">ตรวจสอบ LinkedIn sharing</div>
              </a>
              <a
                href="https://opengraphcheck.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white hover:bg-blue-100 p-3 rounded border border-blue-200 transition-colors"
              >
                <div className="font-semibold">Open Graph Check</div>
                <div className="text-sm text-gray-600">ตรวจสอบ OG tags ทุก platform</div>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  if (process.env.NODE_ENV === 'production') {
    return { notFound: true };
  }
  try {
    const cars = await getHomepageCars(20);
    return {
      props: {
        cars: cars || [],
      },
      revalidate: 600, // 10 minutes
    };
  } catch {
    // Error fetching cars - return empty array
    return {
      props: {
        cars: [],
      },
      revalidate: 60,
    };
  }
}
