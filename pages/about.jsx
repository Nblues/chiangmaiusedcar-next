import React, { useState } from 'react';
import A11yImage from '../components/A11yImage';
import SEO from '../components/SEO';
import Head from 'next/head';

export default function About({ seoAbout }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const features = [
    {
      title: 'รถบ้านแท้ 100%',
      description: 'คัดสรรรถคุณภาพดีจากเจ้าของขายตรง ไม่ผ่านคนกลาง',
    },
    {
      title: 'ฟรีดาวน์ 0%',
      description: 'ออกรถได้ไม่ต้องวางเงินดาวน์ ตามเงื่อนไขไฟแนนซ์',
    },
    {
      title: 'รับประกัน 1 ปี',
      description: 'รับประกันเครื่องยนต์และเกียร์ไม่จำกัดกิโลเมตร',
    },
    {
      title: 'ส่งฟรีทั่วไทย',
      description: 'บริการส่งรถถึงบ้านฟรีทุกจังหวัด',
    },
    {
      title: 'เอกสารครบถ้วน',
      description: 'รถมีเล่มทะเบียน พร้บ. และเอกสารถูกต้องตามกฎหมาย',
    },
    {
      title: 'ประสบการณ์ 10+ ปี',
      description: 'ความเชี่ยวชาญในธุรกิจรถมือสองมากกว่า 10 ปี',
    },
  ];

  return (
    <div>
      <SEO
        title="ครูหนึ่งรถสวย ศูนย์รวมรถยนต์มือสองคุณภาพดี - เกี่ยวกับเรา | Facebook 1M+"
        description="ครูหนึ่งรถสวย แพลตฟอร์มออนไลน์ศูนย์รวมรถบ้านคุณภาพดีในภาคเหนือ ตรวจสภาพครบถ้วน เช็คประวัติรถ ประสบการณ์ 10+ ปี Facebook 1M+ TikTok 150K+ รับประกัน 1 ปี โทร 094-064-9018"
        url="/about"
        keywords={[seoAbout.primary, ...seoAbout.secondary, ...seoAbout.longTail.slice(0, 5)]}
        image="https://www.chiangmaiusedcar.com/herobanner/bannerabout-1400w.webp"
        type="profile"
        pageType="about"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'ครูหนึ่งรถสวย',
          alternateName: 'KruNueng Used Cars',
          description: 'ผู้เชี่ยวชาญตลาดรถยนต์มือสองภาคเหนือ ประสบการณ์ 10+ ปี',
          image: 'https://www.chiangmaiusedcar.com/herobanner/bannerabout-1400w.webp',
          url: 'https://www.chiangmaiusedcar.com/about',
          jobTitle: 'ผู้เชี่ยวชาญรถยนต์มือสอง',
          worksFor: {
            '@type': 'AutoDealer',
            name: 'ครูหนึ่งรถสวย',
            url: 'https://www.chiangmaiusedcar.com',
          },
          knowsAbout: [
            'รถยนต์มือสองภาคเหนือ',
            'ตลาดรถบ้านคุณภาพดี',
            'การประเมินรถ',
            'สินเชื่อรถยนต์',
            'Toyota',
            'Honda',
            'Nissan',
            'Mazda',
          ],
          alumniOf: 'อาจารย์สอนดนตรี',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'เชียงใหม่',
            addressRegion: 'เชียงใหม่',
            addressCountry: 'TH',
          },
          sameAs: [
            'https://www.facebook.com/KN2car',
            'https://www.facebook.com/nuengblues',
            'https://www.tiktok.com/@krunueng_usedcar',
            'https://www.youtube.com/@chiangmaiusedcar',
            'https://www.lemon8-app.com/@kn.goodcar?region=th',
            'https://lin.ee/8ugfzstD',
          ],
          award: [
            'Facebook 1M+ ผู้ติดตาม',
            'TikTok 150K+ ผู้ติดตาม',
            'YouTube 40K+ ผู้ติดตาม',
            'Lemon8 26K+ ผู้ติดตาม',
          ],
        }}
      />

      <Head>
        <link
          rel="preload"
          as="image"
          href="/herobanner/bannerabout-1024w.webp"
          type="image/webp"
          imageSrcSet="/herobanner/bannerabout-414w.webp 414w, /herobanner/bannerabout-640w.webp 640w, /herobanner/bannerabout-1024w.webp 1024w, /herobanner/bannerabout-1400w.webp 1400w"
          imageSizes="100vw"
        />
      </Head>

      {/* Hero Section with Image */}
      <section>
        {/* Text Section - ย้ายมาอยู่ด้านบน */}
        <div className="bg-accent text-white py-8 md:py-12">
          <div className="text-center px-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-prompt">
              เกี่ยวกับ ครูหนึ่งรถสวย รถมือสองเชียงใหม่
            </h1>
            <p className="text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed">
              เพราะอะไรถึงได้รับความไว้วางใจจากลูกค้าทั่วประเทศมากกว่า 1 ล้านติดตาม
            </p>
          </div>
        </div>

        {/* Image Section - ปรับให้รูปพอดีหน้าจอไม่โดนตัด */}
        <div className="relative w-full bg-[#f8f9fa] flex justify-center">
          {/* Container สำหรับรูปภาพ
              - ใช้อัตราส่วนตามภาพจริง 1400/474 ในทุกอุปกรณ์ เพื่อให้แสดงผลพอดีเป๊ะ ไม่โดนตัดเลยทั้งบนมือถือ แท็บเล็ต และเดสก์ทอป
          */}
          <div className="relative w-full max-w-[1400px] aspect-[1400/474]">
            <div className="w-full h-full">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="animate-pulse space-y-4 w-full max-w-md mx-auto p-8">
                    <div className="h-16 bg-gray-300 rounded-lg"></div>
                    <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              )}

              <A11yImage
                src="/herobanner/bannerabout-1024w.webp"
                srcSet="/herobanner/bannerabout-414w.webp 414w, /herobanner/bannerabout-640w.webp 640w, /herobanner/bannerabout-1024w.webp 1024w, /herobanner/bannerabout-1400w.webp 1400w"
                alt="ทีมงานครูหนึ่งรถสวย"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                className={`transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  objectPosition: 'center center',
                }}
                imageType="hero"
                priority={true}
                decoding="sync"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  // Image load failed - component will handle gracefully
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 font-prompt">
              เรื่องราวของเรา
            </h2>
            <div className="space-y-8 text-gray-700 font-prompt text-lg leading-relaxed text-left">
              {/* จุดเริ่มต้น */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  จุดเริ่มต้นของครูหนึ่งรถสวย
                </h3>
                <p className="mb-4">
                  <strong>ครูหนึ่งรถสวย</strong>{' '}
                  เริ่มต้นจากความหลงใหลในรถยนต์และความต้องการหารถคุณภาพดีให้ลูกค้า ย้อนไปเมื่อ 10
                  กว่าปีที่แล้ว จากอาจารย์สอนดนตรีที่มีความต้องการหารถยนต์ไว้ใช้สัก 1 คัน
                </p>
                <p>
                  เรื่องที่เป็นจุดเริ่มต้นนั้น...
                  ด้วยการรวบรวมเงินที่มีและได้คุณพ่อคุณแม่ช่วยสมทบเงินมา
                  เพื่อหาซื้อรถมือสองไว้ใช้สักคัน จึงเลือกดูตามเว็บไซต์ในอินเทอร์เน็ตช่องทางต่างๆ
                  อยู่นานเป็นอาทิตย์แบบคนไม่มีความรู้ คิดหนักคิดนาน เพราะกลัวโดนหลอกขายรถย้อมแมว
                  และต้องเลือกให้พอดีกับงบด้วย แต่ต้องเลือกให้ดีที่สุด
                  ถ้าขับไปซ่อมไปหรือไปน็อคกลางทางคงไม่ดีแน่
                </p>
                <p>
                  วันที่ไปซื้อก็ยังไม่รู้เลยว่าจะเอารุ่นอะไร ไปแบบไร้ความรู้ไร้เป้าหมายไร้ทิศทาง
                  ขับไปดูไปเรื่อยๆ กลัวจะค่ำเสียก่อน สุดท้ายตัดสินใจวัดดวงเลยได้
                  <strong> Toyota Vios 1.5 E</strong> โฉมแรกสีบรอนซ์ทองกียร์ธรรมดา ในราคา 150,000
                  บาท โชคดีมากมันใช้งานได้ดีจนขายต่อเปลี่ยนคันใหม่
                </p>
              </div>

              {/* การเริ่มเป็นนายหน้า */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">ก้าวแรกสู่วงการรถมือสอง</h3>
                <p>
                  จากประสบการณ์การซื้อรถครั้งแรกที่ต้องเสี่ยงดวง เพราะขาดความรู้เรื่องรถยนต์
                  จึงเป็นแรงบันดาลใจให้เริ่มเข้าสู่วงการรถมือสองในฐานะนายหน้า ได้ค่าคอมมิชชั่นคันละ
                  5,000 บาท ในช่วงที่วงการรถมือสองเชียงใหม่และทั่วประเทศกำลังบูม วันหนึ่งขายได้ 3-4
                  คัน ทำให้เริ่มคุ้นเคยกับไฟแนนซ์ สำนักงานขนส่งทั่วภาคเหนือ
                  และรู้จักคนในวงการรถมือสอง
                </p>
              </div>

              {/* เปิดเต็นท์เอง */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">ยุคเต็นท์รถที่เชียงราย</h3>
                <p>
                  เมื่อได้เปิด<strong> เต็นท์รถเองที่อำเภอเวียงป่าเป้า จังหวัดเชียงราย</strong>
                  ขายดีมากจนต้องวิ่งส่งรถให้ลูกค้าทั่วภาคเหนือจนหัวหมุน แทบไม่มีเวลาพักผ่อน
                  รองเท้าขาดพื้นทะลุเป็นคู่ๆ กลางวันสอนดนตรี กลางคืนยังต้องเล่นดนตรีอีก
                  ทำงานหามรุ่งหามค่ำ เรียกว่าในแต่ละวันพอหัวถึงหมอนก็น๊อคหลับภายใน 3 วินาที
                </p>
              </div>

              {/* จุดเด่นและการสร้างตัวตน */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">การสร้างตัวตนออนไลน์</h3>
                <p className="mb-4">
                  จุดเด่นคือเป็นคนพูดจริงทำจริง คำไหนคำนั้น จนลูกค้าประทับใจในการดูแลหลังการขาย
                  ด้วยความจริงใจ จนมาถึงยุคของการสร้างตัวตนบนอินเทอร์เน็ต เป็นคนแรกๆ
                  ที่ออกมาให้ความรู้เกี่ยวกับรถยนต์ทุกด้าน ไม่ว่าจะเป็นกฎหมาย วิธีการใช้งาน
                  การบำรุงรักษา และสอนวิธีดูรถ มีคลิปสอนให้ความรู้มากมายหลายร้อยคลิป
                </p>
                <p>
                  ด้วยเนื้อหาคุณภาพที่ตอบโจทย์ผู้คนและมีความจริงใจ ทำให้มีผู้ติดตาม
                  <strong> Facebook ครูหนึ่งรถสวย 1 ล้านคน</strong> และ
                  <strong> TikTok 150,000 คน</strong>
                </p>
              </div>

              {/* การย้ายมาเชียงใหม่ */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">การขยายธุรกิจที่เชียงใหม่</h3>
                <p>
                  จากการซื้อขายทั่วภาคเหนือ จึงขยายย้ายมาเปิดที่เชียงใหม่
                  เพราะสะดวกในการประสานงานมากกว่าที่เดิม ซึ่งต้องใช้เวลาเดินทางไกล
                  เพื่อปรับรูปแบบธุรกิจให้เป็นซื้อขายรถมือสองออนไลน์ทั่วประเทศ พร้อมบริการ
                  <strong>จัดส่งฟรีทั่วประเทศ</strong> โดยลูกค้า 90% ไม่ต้องมาดูรถ
                  เพราะเชื่อมั่นในคุณภาพ
                  นับเป็นหนึ่งในไม่กี่ร้านที่ขายรถมือสองออนไลน์ส่งฟรีทั่วประเทศอย่างแท้จริง
                </p>
              </div>

              {/* ปัจจุบัน */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">ครูหนึ่งรถสวยในปัจจุบัน</h3>
                <p className="mb-4">
                  วันนี้ <strong>ครูหนึ่งรถสวย</strong> มีทีมขาย ทีมจัดส่ง
                  ทีมบริการจัดสินเชื่อให้ทั่วประเทศ คัดเลือกเฉพาะ
                  <strong>รถบ้านแท้ 90% รถมือเดียว</strong> ไม่มีรถประมูล พร้อม
                  <strong>รับประกันเครื่องเกียร์ 1 ปี ไม่จำกัดกิโลเมตร</strong>
                </p>
                <p>
                  เป้าหมายของเราคือ{' '}
                  <em>&ldquo;การทำให้รถมือสองซื้อง่าย ปลอดภัย อุ่นใจ ไว้ใจได้&rdquo;</em>
                  เพราะเข้าใจความรู้สึกของคนที่ไม่มีความรู้เรื่องรถในตอนซื้อครั้งแรก
                </p>
              </div>

              {/* การให้บริการ */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">มาตรฐานการให้บริการ</h3>
                <p>
                  ลูกค้าสามารถ <strong>ขอดูตรวจสอบเล่มทะเบียนได้ทุกคันทุกหน้าแบบไม่มีปกปิด</strong>
                  ปัญหาทุกอย่างจะไม่เกิด ถ้าหากต้นทางคัดเลือกรถคุณภาพเกรด A มาขาย
                  เพราะเข้าใจความรู้สึกในตอนนั้นดีว่า คนที่ไม่มีความรู้เรื่องรถเลย
                  เวลาไปเลือกซื้อรถมันรู้สึกยังไง จึงอยากให้ทุกคนอุ่นใจทุกครั้งที่เลือก
                  <strong>&ldquo;ครูหนึ่งรถสวย&rdquo;</strong>
                </p>
              </div>

              {/* วิสัยทัศน์อนาคต */}
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">วิสัยทัศน์อนาคต</h3>
                <p>
                  พวกเราและทีมงานเดินทางกันมาร่วม 10 ปีในวงการรถมือสอง เป้าหมายต่อไปของเราคือ
                  <strong>&ldquo;การทำให้รถมือสองซื้อง่าย ปลอดภัย อุ่นใจ ไว้ใจได้&rdquo;</strong>
                  โดยจะมีการซื้อขายผ่านแพลตฟอร์มที่คิดและพัฒนาโดยครูหนึ่งและทีมงานเอง
                  และยังให้ทุกคนได้มีโอกาสรับค่าคอมมิชชั่น มีรายได้ มีโอกาสสร้างเนื้อสร้างตัว
                </p>
              </div>

              {/* ข้อความสรุป */}
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-primary">
                <p className="mb-4">
                  มาถึงตรงนี้แล้ว สิ่งเดียวที่พอจะบอกได้ว่า
                  อะไรที่ทำให้ครูหนึ่งรถสวยได้รับความไว้วางใจจากลูกค้าทั่วประเทศ มากกว่า 1
                  ล้านผู้ติดตาม เคล็ดลับคือ <strong>&ldquo;ความจริงใจ&rdquo;</strong> นั่นเองครับ
                </p>
                <p className="text-xl font-semibold text-primary italic text-center">
                  &ldquo;โอกาสมีอยู่ทุกที่ เงินมีอยู่ทุกที่ในอากาศ อยู่ที่คุณจะเห็นมันหรือไม่&rdquo;
                  <br />
                  <span className="text-lg">ร่วมอุดมการณ์เดียวกันกับพวกเราได้เร็วๆนี้</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto mt-8 lg:mt-12">
              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">1M+</div>
                <div className="text-xs lg:text-sm text-gray-600 mb-2 font-prompt">
                  Facebook Followers
                </div>
                <a
                  href="https://www.facebook.com/KN2car"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium font-prompt transition-colors"
                >
                  @KN2car
                </a>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-800 transition-colors">
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">150K+</div>
                <div className="text-xs lg:text-sm text-gray-600 mb-2 font-prompt">
                  TikTok Followers
                </div>
                <a
                  href="https://www.tiktok.com/@krunueng_usedcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-black hover:text-gray-800 font-medium font-prompt transition-colors"
                >
                  @krunueng_usedcar
                </a>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">40K+</div>
                <div className="text-xs lg:text-sm text-gray-600 mb-2 font-prompt">
                  YouTube Subscribers
                </div>
                <a
                  href="https://www.youtube.com/@chiangmaiusedcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:text-red-800 font-medium font-prompt transition-colors"
                >
                  @chiangmaiusedcar
                </a>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 text-center hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-200 transition-colors">
                  <svg
                    className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">26K+</div>
                <div className="text-xs lg:text-sm text-gray-600 mb-2 font-prompt">
                  Lemon8 Followers
                </div>
                <a
                  href="https://www.lemon8-app.com/@kn.goodcar?region=th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-yellow-600 hover:text-yellow-800 font-medium font-prompt transition-colors"
                >
                  Lemon8 Profile
                </a>
              </div>
            </div>

            {/* เพิ่มส่วนโซเชียลมีเดียเพิ่มเติม */}
            <div className="mt-8 lg:mt-12 p-4 lg:p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-lg lg:text-xl font-bold text-primary mb-4 lg:mb-6 text-center font-prompt">
                ติดตามเราได้ที่
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
                <a
                  href="https://www.facebook.com/nuengblues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-50 text-primary hover:text-blue-700 font-medium p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-primary transition-all text-center text-sm lg:text-base font-prompt"
                >
                  Facebook ส่วนตัว (100K+ ติดตาม)
                </a>
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-50 text-primary hover:text-blue-700 font-medium p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-primary transition-all text-center text-sm lg:text-base font-prompt"
                >
                  LINE Official Account
                </a>
                <a
                  href="https://g.co/kgs/Fe9dhXt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-50 text-primary hover:text-blue-700 font-medium p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-primary transition-all text-center text-sm lg:text-base font-prompt"
                >
                  Google Business Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-prompt">
              จุดเด่นของเรา
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-prompt">
              เหตุผลที่ลูกค้าเลือกเชื่อมั่นและกลับมาใช้บริการซ้ำ
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-primary mb-3 font-prompt">{feature.title}</h3>
                <p className="text-gray-600 font-prompt">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 font-prompt leading-tight">
            ซื้อรถมือสองที่ไหนดี
            <br className="hidden sm:block" />
            <span className="block sm:inline"> ให้ปลอดภัยไม่ถูกหลอก?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 font-prompt leading-relaxed max-w-2xl mx-auto">
            <span className="block mb-2">
              ลองติดต่อสอบถาม{' '}
              <span className="font-bold text-white bg-primary px-2 py-1 rounded">
                ครูหนึ่งรถสวย
              </span>{' '}
              ได้เลย
            </span>
            <span className="block text-lg sm:text-xl font-semibold">🎯 ให้คำปรึกษาฟรี</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg sm:max-w-none mx-auto">
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-bold transition-colors duration-300 font-prompt text-sm sm:text-base"
              aria-label="แชท LINE ครูหนึ่งรถสวย"
            >
              แชท LINE เลย
            </a>
            <a
              href="tel:094-0649018"
              className="bg-white text-accent hover:bg-gray-50 border-2 border-white hover:border-gray-200 px-6 sm:px-8 py-3 rounded-lg font-bold transition-all duration-300 font-prompt text-sm sm:text-base"
              aria-label="โทร 094-064-9018"
            >
              โทร 094-064-9018
            </a>
            <a
              href="https://g.co/kgs/Fe9dhXt"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-bold transition-colors duration-300 font-prompt text-sm sm:text-base"
            >
              Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ISR - Company info changes infrequently - revalidate every 30 minutes
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 1800, // 30 minutes
  };
}
