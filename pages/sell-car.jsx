import React from 'react';
import SEO from '../components/SEO';
import { useRouter } from 'next/router';
import Link from 'next/link';
import A11yImage from '../components/A11yImage';
import { SEO_KEYWORD_MAP } from '../config/seo-keyword-map';
// Organization JSON-LD is injected centrally by <SEO /> to avoid duplicates

export default function SellCar() {
  const router = useRouter();
  const activeLocale = router?.locale || 'th';

  const seoSellCar = SEO_KEYWORD_MAP.sellCar;
  const baseUrl = 'https://www.chiangmaiusedcar.com';
  const pagePath = activeLocale === 'en' ? '/en/sell-car' : '/sell-car';
  const pageUrl = `${baseUrl}${pagePath}`;
  const pageImage = `${baseUrl}/herobanner/chiangmaiusedcars.webp`;

  return (
    <>
      <SEO
        title={seoSellCar.title}
        description={seoSellCar.description}
        url="/sell-car"
        image={pageImage}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: seoSellCar.title,
          description: seoSellCar.description,
          url: pageUrl,
          provider: {
            '@type': 'AutoDealer',
            name: 'ครูหนึ่งรถสวย',
            url: baseUrl,
          },
        }}
        pageType="sell-car"
      />

      <header className="relative w-full h-auto flex items-center justify-center bg-gradient-to-r from-orange-100 to-blue-100">
        <div className="relative w-full max-w-7xl mx-auto">
          <A11yImage
            src="/herobanner/chiangmaiusedcars.webp"
            alt="ขายรถยนต์มือสอง - ครูหนึ่งรถสวย ประเมินราคายุติธรรม แลกเทิร์นรถ"
            width={1920}
            height={640}
            className="w-full h-auto object-contain"
            priority
            quality={75}
            sizes="(max-width: 414px) 414px, (max-width: 768px) 768px, (max-width: 1200px) 1200px, 1920px"
            style={{ maxHeight: '60vh' }}
          />
        </div>
      </header>

      <main className="min-h-screen bg-gray-50" suppressHydrationWarning>
        {/* Hero Section - Same style as homepage */}
        <section id="hero" className="relative py-8">
          <div className="hero-card max-w-4xl w-[90%] mx-auto my-6 flex flex-col md:flex-row items-center gap-6 px-6 py-8 rounded-2xl border border-orange-300 bg-white/95 shadow-lg">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 font-prompt">
                ขายรถยนต์มือสอง • ประเมินราคายุติธรรม
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-orange-700 mb-4 font-prompt">
                แลกเทิร์น รับซื้อทุกสภาพ
              </h2>
              <p className="text-base leading-relaxed text-gray-900">
                ครูหนึ่งรถสวย รับซื้อรถมือสองทุกยี่ห้อ ประเมินราคาฟรี แลกเทิร์นรถยนต์
                ให้ราคายุติธรรม จ่ายเงินสดทันที ดำเนินการเอกสารให้ครบถ้วน
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[200px]">
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                ติดต่อทาง LINE
              </a>
              <a
                href="tel:0940649018"
                className="inline-block text-center font-semibold rounded-2xl px-6 py-3 text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                โทร 094-064-9018
              </a>
            </div>
          </div>
        </section>

        {/* SEO Article Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <article className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-primary mb-6 font-prompt">
                ขายรถยนต์มือสอง ราคายุติธรรม ขายเร็ว ไว้ใจได้
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  การขายรถบ้านในภาคเหนือต้องเลือกศูนย์ที่เชื่อถือได้
                  ครูหนึ่งรถสวยเป็นแพลตฟอร์มซื้อขายรถยนต์คุณภาพดี มีประสบการณ์มากกว่า 10
                  ปีในธุรกิจรถยนต์ พร้อมให้บริการขายรถ ประเมินราคา และแลกเทิร์นรถยนต์ทุกยี่ห้อ ดู
                  <Link href="/" className="text-primary hover:underline">
                    หน้าแรก
                  </Link>
                  ของเราเพื่อข้อมูลเพิ่มเติม
                </p>

                <h3 className="text-2xl font-bold text-primary mb-4 font-prompt">
                  บริการรับซื้อขายรถยนต์ครบวงจร
                </h3>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">ขายรถทุกยี่ห้อ</h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>รับซื้อรถยนต์ทุกยี่ห้อ ทุกรุ่น</li>
                      <li>ประเมินราคายุติธรรม ตามราคาตลาด</li>
                      <li>จ่ายเงินสดทันที ไม่มีค่าธรรมเนียม</li>
                      <li>ดำเนินการเอกสารให้ครบถ้วน</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">ประเมินราคาฟรี</h4>
                    <ul className="text-gray-700 space-y-2">
                      <li>ตรวจสอบสภาพรถโดยผู้เชี่ยวชาญ</li>
                      <li>ให้ราคาประเมินที่แม่นยำ</li>
                      <li>ไม่มีค่าใช้จ่ายในการประเมิน</li>
                      <li>ให้คำปรึกษาการซื้อขายฟรี</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-primary mb-4 font-prompt">
                  ทำไมต้องเลือกครูหนึ่งรถสวย
                </h3>

                <p className="text-gray-700 leading-relaxed mb-6">
                  ด้วยประสบการณ์ยาวนานในธุรกิจรถยนต์ เรามีลูกค้าประจำมากมาย
                  และเครือข่ายการขายที่กว้างขวาง ทำให้สามารถขายรถของคุณได้อย่างรวดเร็ว ภายใน 7 วัน
                  พร้อมทั้งให้ราคาที่ดีที่สุด ตรวจสอบ
                  <Link href="/all-cars" className="text-primary hover:underline">
                    สต็อกรถมือสอง
                  </Link>
                  ของเราหรืออ่าน
                  <Link href="/promotion" className="text-primary hover:underline">
                    โปรโมชั่นพิเศษ
                  </Link>
                  เพิ่มเติม
                </p>

                <div className="bg-blue-50 border-l-4 border-primary p-6 mb-8">
                  <h4 className="text-xl font-semibold text-primary mb-3">
                    ข้อดีของการขายรถกับเรา
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">10+</div>
                      <p className="text-gray-700">ปีประสบการณ์</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">1M+</div>
                      <p className="text-gray-700">ผู้ติดตาม Facebook</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">7</div>
                      <p className="text-gray-700">วัน ขายได้</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-primary mb-4 font-prompt">
                  ขั้นตอนการขายรถกับเรา
                </h3>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      1
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">ติดต่อ LINE</h4>
                    <p className="text-gray-600 text-sm">ส่งรูปรถและรายละเอียด</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      2
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">นัดดูรถ</h4>
                    <p className="text-gray-600 text-sm">ตรวจสอบสภาพรถจริง</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      3
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">ประเมินราคา</h4>
                    <p className="text-gray-600 text-sm">ให้ราคาที่ยุติธรรม</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      4
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">จ่ายเงิน</h4>
                    <p className="text-gray-600 text-sm">รับเงินสดทันที</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-primary mb-4 font-prompt">
                  รถยี่ห้อไหนที่เรารับซื้อ
                </h3>

                <p className="text-gray-700 leading-relaxed mb-6">
                  เรารับซื้อรถยนต์ทุกยี่ห้อ ไม่ว่าจะเป็น{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Toyota
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Honda
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Nissan
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Mazda
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Mitsubishi
                  </Link>
                  ,
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Isuzu
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Ford
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Chevrolet
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    BMW
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Mercedes-Benz
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Audi
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Hyundai
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Kia
                  </Link>
                  ,{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    Suzuki
                  </Link>
                  หรือยี่ห้ออื่นๆ รวมถึง
                  <Link href="/all-cars" className="text-primary hover:underline">
                    รถปิคอัพ
                  </Link>{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    รถ SUV
                  </Link>{' '}
                  <Link href="/all-cars" className="text-primary hover:underline">
                    รถเก๋ง
                  </Link>{' '}
                  และ
                  <Link href="/all-cars" className="text-primary hover:underline">
                    รถคอมแพค
                  </Link>
                </p>

                <div className="bg-gray-100 p-6 rounded-lg mb-8">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">เอกสารที่ต้องเตรียม</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-gray-700 space-y-2">
                      <li>สำเนาบัตรประชาชนเจ้าของรถ</li>
                      <li>สำเนาทะเบียนบ้าน</li>
                      <li>เล่มทะเบียนรถ (หนังสือรับรองการจดทะเบียน)</li>
                    </ul>
                    <ul className="text-gray-700 space-y-2">
                      <li>ใบตรวจสภาพรถ (ถ้ามี)</li>
                      <li>กรมธรรม์ประกันภัย (ถ้ามี)</li>
                      <li>ใบเสร็จค่างวด (กรณีผ่อน)</li>
                    </ul>
                  </div>
                  <p className="text-gray-600 text-sm mt-4">
                    ต้องการข้อมูลเพิ่มเติม? ดู
                    <Link href="/payment-calculator" className="text-primary hover:underline">
                      คำนวณค่างวด
                    </Link>
                    หรือ
                    <Link href="/credit-check" className="text-primary hover:underline">
                      ตรวจสอบเครดิต
                    </Link>
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-primary mb-4 font-prompt">
                  ติดต่อขายรถวันนี้ รับเงินเร็ว
                </h3>

                <p className="text-gray-700 leading-relaxed mb-6">
                  หากคุณต้องการขายรถด่วน หรือต้องการประเมินราคารถฟรี สามารถติดต่อเราได้ทันทีผ่าน
                  LINE หรือโทรศัพท์ ทีมงานของเราพร้อมให้คำปรึกษาและบริการที่ดีที่สุด
                  เพื่อให้คุณขายรถได้ในราคาที่คุ้มค่าและรวดเร็ว ดูตัวอย่าง
                  <Link href="/all-cars" className="text-primary hover:underline">
                    รถมือสองคุณภาพดี
                  </Link>
                  ที่เรามีจำหน่าย หรือเรียนรู้เพิ่มเติมเกี่ยวกับ
                  <Link href="/about" className="text-primary hover:underline">
                    เรื่องราวของเรา
                  </Link>
                  และ
                  <Link href="/contact" className="text-primary hover:underline">
                    ช่องทางติดต่อ
                  </Link>
                </p>

                <div className="text-center mt-8">
                  <a
                    href="https://lin.ee/8ugfzstD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    <span>ติดต่อเราเลย</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}

// ISR for performance
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 86400, // 24 hours
  };
}
