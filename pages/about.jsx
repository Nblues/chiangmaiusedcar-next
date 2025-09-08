import React from 'react';
import Image from 'next/image';
import SEO from '../components/SEO';

export default function About() {
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
        title="เกี่ยวกับครูหนึ่งรถสวย - ผู้เชี่ยวชาญรถมือสองเชียงใหม่ 10+ ปี"
        description="เรื่องราวครูหนึ่งรถสวย จากอาจารย์สอนดนตรีสู่ผู้เชี่ยวชาญรถมือสอง Facebook 1M+ TikTok 150K+ YouTube 40K+ ติดตาม รับประกัน 1 ปี ส่งฟรีทั่วประเทศ โทร 094-064-9018"
        keywords="ครูหนึ่งรถสวย, ประวัติครูหนึ่ง, รถมือสองเชียงใหม่, รถมือสองเชียงราย, Facebook KN2car, TikTok krunueng_usedcar, YouTube chiangraiusedcar, Lemon8, รับประกันรถมือสอง, ส่งรถฟรีทั่วประเทศ, รถบ้านแท้, Toyota Vios, ไฟแนนซ์รถมือสอง, Google Business, LINE Official"
        url="https://chiangmaiusedcar.com/about"
        image="https://chiangmaiusedcar.com/herobanner/team.png"
        type="profile"
      />

      {/* Hero Section with Image */}
      <section>
        {/* Text Section - ย้ายมาอยู่ด้านบน */}
        <div className="bg-accent text-white py-8 md:py-12">
          <div className="text-center px-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 font-prompt">
              เกี่ยวกับ ครูหนึ่งรถสวย
            </h1>
            <p className="text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed">
              เพราะอะไรถึงได้รับความไว้วางใจจากลูกค้าทั่วประเทศมากกว่า 1 ล้านติดตาม
            </p>
          </div>
        </div>

        {/* Image Section - ปรับปรุงให้แสดงรูปเต็มไม่ถูกตัดสำหรับทุกอุปกรณ์ */}
        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* พื้นที่รูปที่คำนวณสัดส่วนอัตโนมัติ */}
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src="/herobanner/team.png"
                  alt="ทีมงานครูหนึ่งรถสวย - รถมือสองเชียงใหม่คุณภาพดี"
                  fill
                  sizes="(max-width: 640px) 95vw, (max-width: 1024px) 85vw, 1000px"
                  className="object-contain"
                  style={{
                    objectPosition: 'center center',
                  }}
                  loading="lazy"
                  priority={false}
                />
              </div>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">1M+</div>
                <div className="text-sm text-gray-600">Facebook Followers</div>
                <a
                  href="https://www.facebook.com/KN2car"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  @KN2car
                </a>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">150K+</div>
                <div className="text-sm text-gray-600">TikTok Followers</div>
                <a
                  href="https://www.tiktok.com/@krunueng_usedcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  @krunueng_usedcar
                </a>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">40K+</div>
                <div className="text-sm text-gray-600">YouTube Subscribers</div>
                <a
                  href="https://youtube.com/@chiangraiusedcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  @chiangraiusedcar
                </a>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">26K+</div>
                <div className="text-sm text-gray-600">Lemon8 Followers</div>
                <a
                  href="https://s.lemon8-app.com/al/GgUmdUUsrT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Lemon8 Profile
                </a>
              </div>
            </div>

            {/* เพิ่มส่วนโซเชียลมีเดียเพิ่มเติม */}
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-xl font-bold text-primary mb-4 text-center font-prompt">
                ติดตามเราได้ที่
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <a
                  href="https://www.facebook.com/nuengblues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Facebook ส่วนตัว (100K+ ติดตาม)
                </a>
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  LINE Official Account
                </a>
                <a
                  href="https://g.co/kgs/Fe9dhXt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-800 font-medium"
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
      <section className="py-16 bg-accent text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-prompt">
            ซื้อรถมือสองที่ไหนดี ให้ปลอดภัยไม่ถูกหลอก?
          </h2>
          <p className="text-xl mb-8 font-prompt">
            ลองติดต่อสอบถามครูหนึ่งรถสวยได้เลยให้คำปรึกษาฟรี
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 font-prompt"
            >
              แชท LINE เลย
            </a>
            <a
              href="tel:094-0649018"
              className="bg-white text-accent hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors duration-300 font-prompt"
            >
              โทร 094-064-9018
            </a>
            <a
              href="https://g.co/kgs/Fe9dhXt"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-blue-800 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 font-prompt"
            >
              Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
