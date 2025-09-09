import React from 'react';
import SEO from '../components/SEO';

export default function LicensePage() {
  return (
    <>
      <SEO
        title="เงื่อนไขการใช้งานรูปภาพและลิขสิทธิ์"
        description="เงื่อนไขการใช้งานรูปภาพ ลิขสิทธิ์ และทรัพย์สินทางปัญญาของครูหนึ่งรถสวย รถมือสองเชียงใหม่"
        url="/license"
        keywords="ลิขสิทธิ์, เงื่อนไขการใช้งาน, รูปภาพ, ครูหนึ่งรถสวย, สงวนสิทธิ์"
      />

      <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-gray-50">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 py-12">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-primary/10">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-prompt">
              เงื่อนไขการใช้งานและลิขสิทธิ์
            </h1>
            <p className="text-lg text-gray-700 font-prompt">
              เงื่อนไขการใช้งานรูปภาพ เนื้อหา และทรัพย์สินทางปัญญาของครูหนึ่งรถสวย
            </p>
            <div className="mt-4 text-sm text-gray-600 font-prompt">
              อัปเดตล่าสุด:{' '}
              {new Date().toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-primary/10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-prompt">
              📄 ข้อความลิขสิทธิ์
            </h2>
            <div className="space-y-4 text-gray-700 font-prompt leading-relaxed">
              <p>© {new Date().getFullYear()} ครูหนึ่งรถสวย (KN Good Car) สงวนสิทธิ์ทุกประการ</p>
              <p>
                เนื้อหา รูปภาพ โลโก้ และสื่อดิจิทัลทั้งหมดในเว็บไซต์นี้เป็นทรัพย์สินทางปัญญา
                ของครูหนึ่งรถสวย
                ได้รับการคุ้มครองภายใต้กฎหมายลิขสิทธิ์และทรัพย์สินทางปัญญาของประเทศไทย
              </p>
            </div>
          </div>

          {/* Image Rights */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-primary/10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-prompt">🖼️ สิทธิ์ในรูปภาพ</h2>
            <div className="space-y-4 text-gray-700 font-prompt leading-relaxed">
              <h3 className="text-xl font-semibold text-primary">รูปภาพรถยนต์</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>รูปภาพรถยนต์ทั้งหมดถ่ายโดยทีมงานครูหนึ่งรถสวย</li>
                <li>รูปภาพแสดงสภาพจริงของรถยนต์ ณ วันที่ถ่าย</li>
                <li>ห้ามนำรูปภาพไปใช้เพื่อการค้าโดยไม่ได้รับอนุญาต</li>
                <li>การใช้รูปภาพต้องระบุเครดิต &ldquo;ภาพโดย ครูหนึ่งรถสวย&rdquo;</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mt-6">โลโก้และเครื่องหมายการค้า</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>โลโก้ &ldquo;ครูหนึ่งรถสวย&rdquo; เป็นเครื่องหมายการค้าจดทะเบียน</li>
                <li>ห้ามใช้โลโก้เพื่อวัตถุประสงค์เชิงพาณิชย์โดยไม่ได้รับอนุญาต</li>
                <li>การแสดงโลโก้ต้องไม่ทำให้เกิดความเข้าใจผิดเกี่ยวกับการรับรองหรือความร่วมมือ</li>
              </ul>
            </div>
          </div>

          {/* Usage Terms */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border-2 border-primary/10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-prompt">
              ✅ การใช้งานที่อนุญาต
            </h2>
            <div className="space-y-4 text-gray-700 font-prompt leading-relaxed">
              <h3 className="text-xl font-semibold text-primary">การใช้งานส่วนบุคคล</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>ดูข้อมูลรถยนต์เพื่อการพิจารณาซื้อ</li>
                <li>แชร์ลิงก์หน้าเว็บไปยังเพื่อนและครอบครัว</li>
                <li>บันทึกรูปภาพเพื่อเปรียบเทียบรถยนต์</li>
                <li>พิมพ์ข้อมูลเพื่อนำไปประกอบการตัดสินใจ</li>
              </ul>

              <h3 className="text-xl font-semibold text-primary mt-6">
                การใช้งานเชิงธุรกิจ (ต้องขออนุญาต)
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>นำเสนอรถยนต์ในฐานะตัวแทนจำหน่าย</li>
                <li>ใช้รูปภาพในสื่อโฆษณาหรือการตลาด</li>
                <li>สร้างเนื้อหาเพื่อการศึกษาหรือฝึกอบรม</li>
                <li>นำข้อมูลไปใช้ในระบบเปรียบเทียบราคา</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center mt-8">
            <h3 className="text-xl font-bold text-primary mb-4 font-prompt">
              ติดต่อสอบถามเพิ่มเติม
            </h3>
            <div className="space-y-2 text-gray-700 font-prompt">
              <p>
                <strong>ครูหนึ่งรถสวย</strong>
              </p>
              <p>📞 094-064-9018</p>
              <p>📧 contact@chiangmaiusedcar.com</p>
              <p>💬 LINE: @krunuengusedcar</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Use SSR instead of static generation to avoid prerendering issues
export async function getServerSideProps() {
  return {
    props: {},
  };
}
