import SEO from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="นโยบายความเป็นส่วนตัว | ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
        description="นโยบายความเป็นส่วนตัวของ ครูหนึ่งรถสวย เราให้ความสำคัญกับการปกป้องข้อมูลส่วนบุคคลของลูกค้า"
        url="/privacy-policy"
      />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-primary mb-8 text-center">
              นโยบายความเป็นส่วนตัว
            </h1>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-600 mb-6">
                <strong>วันที่มีผลบังคับใช้:</strong> 4 สิงหาคม 2567
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">1. ข้อมูลที่เรารวบรวม</h2>
                <p className="text-gray-700 mb-4">
                  ครูหนึ่งรถสวย อาจรวบรวมข้อมูลส่วนบุคคลของท่านในกรณีต่อไปนี้:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>ข้อมูลที่ท่านให้ไว้เมื่อติดต่อสอบถาม เช่น ชื่อ เบอร์โทรศัพท์ อีเมล</li>
                  <li>ข้อมูลการใช้งานเว็บไซต์ เช่น หน้าที่เข้าชม เวลาที่ใช้งาน</li>
                  <li>ข้อมูลเทคนิค เช่น IP Address, Browser Type, Device Information</li>
                  <li>ข้อมูลจาก Google Analytics เพื่อปรับปรุงบริการ</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  2. วัตถุประสงค์ในการใช้ข้อมูล
                </h2>
                <p className="text-gray-700 mb-4">เราใช้ข้อมูลของท่านเพื่อ:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>ติดต่อตอบกลับคำถามและให้บริการ</li>
                  <li>ประมวลผลใบสมัครขอสินเชื่อรถยนต์</li>
                  <li>ส่งข้อมูลข่าวสารและโปรโมชั่น (หากท่านยินยอม)</li>
                  <li>ปรับปรุงคุณภาพเว็บไซต์และบริการ</li>
                  <li>ปฏิบัติตามกฎหมายและระเบียบที่เกี่ยวข้อง</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">3. การเปิดเผยข้อมูล</h2>
                <p className="text-gray-700 mb-4">
                  เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สาม ยกเว้น:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>เมื่อได้รับความยินยอมจากท่าน</li>
                  <li>แก่สถาบันการเงินเพื่อประมวลผลสินเชื่อ</li>
                  <li>แก่ผู้ให้บริการที่ช่วยดำเนินธุรกิจ (เช่น บริษัทขนส่ง)</li>
                  <li>เพื่อปฏิบัติตามกฎหมายหรือคำสั่งศาล</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">4. การรักษาความปลอดภัย</h2>
                <p className="text-gray-700 mb-4">เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสม เช่น:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>การเข้ารหัสข้อมูล (SSL/TLS)</li>
                  <li>การจำกัดการเข้าถึงข้อมูลเฉพาะผู้ที่จำเป็น</li>
                  <li>การสำรองข้อมูลอย่างสม่ำเสมอ</li>
                  <li>การตรวจสอบระบบความปลอดภัยเป็นประจำ</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  5. สิทธิของเจ้าของข้อมูล
                </h2>
                <p className="text-gray-700 mb-4">ท่านมีสิทธิ์ดังต่อไปนี้:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>ขอเข้าถึงและขอสำเนาข้อมูลส่วนบุคคล</li>
                  <li>ขอแก้ไขข้อมูลส่วนบุคคลที่ไม่ถูกต้อง</li>
                  <li>ขอลบหรือทำลายข้อมูลส่วนบุคคล</li>
                  <li>ขอระงับการใช้ข้อมูลส่วนบุคคล</li>
                  <li>ขอให้โอนข้อมูลส่วนบุคคล</li>
                  <li>ถอนความยินยอมได้ตลอดเวลา</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">6. การใช้ Cookies</h2>
                <p className="text-gray-700 mb-4">เว็บไซต์ของเราใช้ Cookies เพื่อ:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>จดจำการตั้งค่าของผู้ใช้</li>
                  <li>วิเคราะห์การใช้งานเว็บไซต์</li>
                  <li>ปรับปรุงประสบการณ์การใช้งาน</li>
                  <li>แสดงโฆษณาที่เกี่ยวข้อง</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  ท่านสามารถตั้งค่า Browser เพื่อปฏิเสธ Cookies ได้ แต่อาจส่งผลต่อการใช้งานเว็บไซต์
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  7. การเปลี่ยนแปลงนโยบาย
                </h2>
                <p className="text-gray-700">
                  เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
                  การเปลี่ยนแปลงจะมีผลทันทีที่เผยแพร่บนเว็บไซต์
                  เราแนะนำให้ท่านตรวจสอบนโยบายนี้เป็นประจำ
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">8. ติดต่อเรา</h2>
                <p className="text-gray-700 mb-4">
                  หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อ:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>ครูหนึ่งรถสวย</strong>
                  </p>
                  <p className="text-gray-700">
                    320 หมู่ 2 ต.สันพระเนตร อ.สันทราย จ.เชียงใหม่ 50210
                  </p>
                  <p className="text-gray-700">
                    <strong>โทร:</strong> 094-064-9018
                  </p>
                  <p className="text-gray-700">
                    <strong>อีเมล:</strong> info@chiangmaiusedcar.com
                  </p>
                  <p className="text-gray-700">
                    <strong>เวลาทำการ:</strong> เปิดทุกวัน 09:00-20:00 น.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// ISR (Incremental Static Regeneration) - Performance optimization
export async function getServerSideProps() {
  return {
    props: {},
  };
}
