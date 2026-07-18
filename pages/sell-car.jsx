import React from 'react';
import SEO from '../components/SEO';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import A11yImage from '../components/A11yImage';
import {
  BadgeCheck,
  Banknote,
  CarFront,
  FileText,
  CheckCircle2,
  ChevronRight,
  Calculator,
  CreditCard,
  Smartphone,
  Search,
  Handshake,
  Wallet,
} from 'lucide-react';
import proseStyles from '../styles/prose.module.css';

export default function SellCar({ seoSellCar }) {
  const router = useRouter();
  const activeLocale = router?.locale || 'th';

  const baseUrl = 'https://www.chiangmaiusedcar.com';
  const pagePath = activeLocale === 'en' ? '/en/sell-car' : '/sell-car';
  const pageUrl = `${baseUrl}${pagePath}`;
  const pageImage = `${baseUrl}/herobanner/chiangmaiusedcars.webp`;

  return (
    <>
      <SEO
        title={seoSellCar.title}
        description={seoSellCar.description}
        keywords={[seoSellCar.primary, ...seoSellCar.secondary, ...seoSellCar.longTail.slice(0, 5)]}
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
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'รับซื้อรถยนต์', url: '/sell-car' },
        ]}
        pageType="sell-car"
      />

      <header className="relative w-full bg-white flex justify-center border-b border-gray-100">
        <div className="relative w-full max-w-[1920px] aspect-[1920/650]">
          <A11yImage
            src="/herobanner/chiangmaiusedcars-1200w.webp"
            customSrcSet="/herobanner/chiangmaiusedcars-640w.webp 640w, /herobanner/chiangmaiusedcars-828w.webp 828w, /herobanner/chiangmaiusedcars-1024w.webp 1024w, /herobanner/chiangmaiusedcars-1200w.webp 1200w, /herobanner/chiangmaiusedcars-1400w.webp 1400w, /herobanner/chiangmaiusedcars-1920w.webp 1920w"
            alt="ขายรถยนต์มือสอง - ครูหนึ่งรถสวย ประเมินราคายุติธรรม แลกเทิร์นรถ"
            fill
            className="w-full h-full object-cover md:object-contain"
            priority
            optimizeImage={false}
            customSizes="(max-width: 414px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 120vw, 1920px"
          />
        </div>
      </header>

      <main className="min-h-screen bg-gray-50/50 pb-20" suppressHydrationWarning>
        {/* Modern Hero Section */}
        <section id="hero" className="relative -mt-8 md:-mt-16 z-10 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 px-6 md:px-10 py-10 rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/40">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-primary text-sm font-medium mb-4">
                <CheckCircle2 size={16} /> ประเมินราคาฟรี ไม่มีค่าใช้จ่าย
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight font-prompt">
                ขายรถยนต์มือสอง <br className="hidden md:block" />
                <span className="text-primary">ประเมินราคายุติธรรม</span>
              </h1>
              <h2 className="text-base md:text-lg font-medium text-gray-700 mb-6 font-prompt">
                แลกเทิร์น รับซื้อทุกสภาพ ให้ราคาสูงสุดตามตลาด
              </h2>
              <p className="text-base leading-relaxed text-gray-600 mb-8 max-w-xl">
                ครูหนึ่งรถสวย รับซื้อรถมือสองทุกยี่ห้อ จ่ายเงินสดทันที ดำเนินการเอกสารให้ครบถ้วน
                สะดวกรวดเร็ว เชื่อถือได้ 100%
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-semibold rounded-2xl px-8 py-4 text-base bg-[#00B900] text-white hover:bg-[#009900] transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  ประเมินราคาผ่าน LINE <ChevronRight size={18} />
                </a>
                <a
                  href="tel:0940649018"
                  className="inline-flex items-center justify-center gap-2 font-semibold rounded-2xl px-8 py-4 text-base bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
                >
                  โทร 094-064-9018
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-col gap-4">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                  <Banknote size={20} />
                </div>
                <div className="text-sm font-medium text-gray-900">รับเงินสดทันที</div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                  <CarFront size={20} />
                </div>
                <div className="text-sm font-medium text-gray-900">รับซื้อทุกยี่ห้อ</div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 md:col-span-1 col-span-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <FileText size={20} />
                </div>
                <div className="text-sm font-medium text-gray-900">จัดการเอกสารให้จบ</div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-primary mb-4 font-prompt">
                ขั้นตอนการขายรถกับเรา
              </h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                สะดวกรวดเร็ว ไม่กี่ขั้นตอนก็รับเงินสดกลับบ้านได้เลย ดำเนินการโปร่งใสในทุกกระบวนการ
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 md:gap-6 relative">
              <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-gray-100 z-0"></div>
              <div className="relative group z-10">
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 ring-[10px] ring-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Smartphone size={28} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg font-prompt">
                    ติดต่อประเมินราคา
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    ส่งรูปรถ รุ่น ปี และรายละเอียดเข้ามาทาง LINE ฟรีไม่มีค่าใช้จ่าย
                  </p>
                </div>
              </div>

              <div className="relative group z-10">
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 ring-[10px] ring-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Search size={28} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg font-prompt">นัดดูรถจริง</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    ทีมงานผู้เชี่ยวชาญจะทำการตรวจสอบสภาพรถจริงอย่างละเอียด
                  </p>
                </div>
              </div>

              <div className="relative group z-10">
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 ring-[10px] ring-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Handshake size={28} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg font-prompt">ตกลงรับราคา</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    เสนอราคาให้สูงที่สุดตามสภาพและราคาตลาดยุติธรรม
                  </p>
                </div>
              </div>

              <div className="relative group z-10">
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 ring-[10px] ring-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Wallet size={28} strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg font-prompt">
                    รับเงินสดทันที
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    ทำสัญญาซื้อขายและรับเงินสดหรือโอนเข้าบัญชีทันที
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info & Requirements Section */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 mb-6">
                <BadgeCheck size={28} />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4 font-prompt">
                การเตรียมเอกสารขายรถ
              </h3>
              <p className="text-gray-700 mb-8 leading-relaxed">
                เพื่อให้การดำเนินการซื้อขายเป็นไปอย่างรวดเร็วและถูกต้องตามกฎหมาย
                กรุณาเตรียมเอกสารพื้นฐานเหล่านี้ไว้ให้พร้อมในวันนัดหมาย
              </p>

              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="bg-green-50 p-1.5 rounded-full shrink-0 mt-0.5">
                    <CheckCircle2 size={18} className="text-green-500" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">
                      เล่มทะเบียนรถตัวจริง
                    </span>
                    <span className="text-sm text-gray-700">
                      หรือสำเนา และใบเสร็จค่างวดล่าสุด (กรณีรถติดไฟแนนซ์)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-green-50 p-1.5 rounded-full shrink-0 mt-0.5">
                    <CheckCircle2 size={18} className="text-green-500" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">
                      บัตรประชาชนเจ้าของรถ
                    </span>
                    <span className="text-sm text-gray-700">
                      สำหรับทำสัญญาซื้อขายและโอนกรรมสิทธิ์
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-green-50 p-1.5 rounded-full shrink-0 mt-0.5">
                    <CheckCircle2 size={18} className="text-green-500" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">
                      เอกสารหน้าสัญญาไฟแนนซ์
                    </span>
                    <span className="text-sm text-gray-700">
                      กรณีต้องการให้เราดำเนินการปิดยอดและรับซื้อดาวน์ให้
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-10 border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 -ml-10 -mb-10"></div>

              <div className="relative z-10">
                <h4 className="text-2xl font-bold text-gray-900 mb-4 font-prompt">
                  ต้องการขายรถติดไฟแนนซ์?
                </h4>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  เรามีบริการปิดบัญชีไฟแนนซ์ให้คุณทันที พร้อมดำเนินการเรื่องเอกสารโอนทุกขั้นตอน
                  ไม่ต้องกังวลเรื่องการจัดการหนี้คงค้าง
                </p>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <Link
                    href="/payment-calculator"
                    className="flex flex-col items-center justify-center gap-3 bg-white py-5 px-4 rounded-2xl shadow-sm hover:shadow border border-gray-100 transition-all font-medium text-gray-700 hover:text-primary hover:border-blue-100 group"
                  >
                    <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                      <Calculator size={24} className="text-primary" />
                    </div>
                    <span className="text-sm">คำนวณค่างวด</span>
                  </Link>
                  <Link
                    href="/credit-check"
                    className="flex flex-col items-center justify-center gap-3 bg-white py-5 px-4 rounded-2xl shadow-sm hover:shadow border border-gray-100 transition-all font-medium text-gray-700 hover:text-primary hover:border-blue-100 group"
                  >
                    <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                      <CreditCard size={24} className="text-primary" />
                    </div>
                    <span className="text-sm">เช็คเครดิต</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Bottom Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-gray-900 font-prompt">
                รับซื้อรถยนต์มือสองคุณภาพดีทุกยี่ห้อ
              </h3>
              <p className="text-gray-700 mt-2">ศูนย์รวมรถบ้านคุณภาพในเชียงใหม่และภาคเหนือ</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Toyota',
                'Honda',
                'Nissan',
                'Mazda',
                'Mitsubishi',
                'Isuzu',
                'Ford',
                'Chevrolet',
                'BMW',
                'Mercedes-Benz',
                'Audi',
                'Hyundai',
                'Kia',
                'Suzuki',
              ].map(brand => (
                <Link
                  key={brand}
                  href="/all-cars"
                  className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all"
                >
                  {brand}
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center text-sm text-gray-600">
              <p>
                ประสบการณ์มากกว่า 10 ปีในธุรกิจรถยนต์ เรามีเครือข่ายและการให้บริการที่ลูกค้าไว้วางใจ
              </p>
              <div className="mt-5 flex justify-center items-center gap-4 flex-wrap">
                <Link href="/" className="text-primary font-medium hover:underline">
                  หน้าแรก
                </Link>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <Link href="/all-cars" className="text-primary font-medium hover:underline">
                  สต็อกรถมือสอง
                </Link>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <Link href="/promotion" className="text-primary font-medium hover:underline">
                  โปรโมชั่นพิเศษ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: { seoSellCar: require('../config/seo-keyword-map').SEO_KEYWORD_MAP.sellCar },
    revalidate: 86400,
  };
}
