import SEO from '../components/SEO';
import proseStyles from '../styles/prose.module.css';

export default function TermsOfService() {
  return (
    <>
      <SEO
        title="ข้อกำหนดการใช้งาน | ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
        description="ข้อกำหนดและเงื่อนไขการใช้งานเว็บไซต์ ครูหนึ่งรถสวย รถมือสองเชียงใหม่ คุณภาพดี ราคาดี"
        url="/terms-of-service"
      />

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-primary mb-8 text-center">ข้อกำหนดการใช้งาน</h1>

            <div className={`prose prose-lg max-w-none ${proseStyles.prose}`}>
              <div className="text-gray-600 mb-6">
                <strong>วันที่มีผลบังคับใช้:</strong> 4 สิงหาคม 2567
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">1. การยอมรับข้อกำหนด</h2>
                <p className="text-gray-700">
                  การเข้าใช้งานเว็บไซต์ chiangmaiusedcar.com หรือบริการใดๆ ของ ครูหนึ่งรถสวย
                  ถือว่าท่านยอมรับและตกลงปฏิบัติตามข้อกำหนดและเงื่อนไขทั้งหมดในนี้
                  หากท่านไม่ยอมรับข้อกำหนดเหล่านี้ กรุณาหยุดการใช้งานเว็บไซต์ทันที
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">2. บริการที่เราให้</h2>
                <p className="text-gray-700 mb-4">ครูหนึ่งรถสวย ให้บริการดังต่อไปนี้:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>จำหน่ายรถยนต์มือสอง คุณภาพดี ราคาเป็นธรรม</li>
                  <li>บริการประเมินราคารถยนต์</li>
                  <li>บริการจัดหาสินเชื่อรถยนต์</li>
                  <li>บริการรับซื้อรถยนต์มือสอง</li>
                  <li>บริการหลังการขาย รับประกันคุณภาพ</li>
                  <li>ให้คำปรึกษาเกี่ยวกับรถยนต์</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">3. การใช้งานเว็บไซต์</h2>
                <p className="text-gray-700 mb-4">ท่านตกลงที่จะ:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>ใช้งานเว็บไซต์เพื่อวัตถุประสงค์ที่ถูกกฎหมายเท่านั้น</li>
                  <li>ไม่ใช้เว็บไซต์เพื่อการฉ้อโกงหรือหลอกลวง</li>
                  <li>ไม่แทรกแซงหรือทำลายระบบเว็บไซต์</li>
                  <li>ไม่คัดลอกเนื้อหาโดยไม่ได้รับอนุญาต</li>
                  <li>ให้ข้อมูลที่ถูกต้องและครบถ้วน</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">4. ข้อมูลรถยนต์และราคา</h2>
                <p className="text-gray-700 mb-4">ข้อมูลรถยนต์และราคาที่แสดงบนเว็บไซต์:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>ข้อมูลถูกต้อง ณ เวลาที่เผยแพร่</li>
                  <li>ราคาและรายละเอียดอาจเปลี่ยนแปลงได้โดยไม่แจ้งให้ทราบล่วงหน้า</li>
                  <li>รถยนต์อาจขายหมดก่อนที่จะอัปเดตเว็บไซต์</li>
                  <li>การซื้อขายจริงต้องตรวจสอบรายละเอียดอีกครั้งที่หน้าร้าน</li>
                  <li>รูปภาพอาจแตกต่างจากสภาพจริงเล็กน้อย</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">5. การจองและการซื้อขาย</h2>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">การจองรถยนต์</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>การจองผ่านเว็บไซต์เป็นการจองเบื้องต้น</li>
                    <li>ต้องชำระเงินมัดจำภายใน 24 ชั่วโมง</li>
                    <li>หากไม่จองตามนัด ถือว่ายกเลิกการจอง</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold text-primary mb-2">เงื่อนไขการขาย</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>รถยนต์ขายตามสภาพ &quot;AS IS&quot; ณ วันที่ส่งมอบ</li>
                    <li>มีการรับประกันเครื่องยนต์และเกียร์ 1 ปี เดือน (ตามเงื่อนไข)</li>
                    <li>ผู้ซื้อต้องตรวจสอบรถยนต์ด้วยตนเองก่อนรับมอบ</li>
                    <li>การโอนกรรมสิทธิ์ต้องชำระภายใน 7 วัน</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary mb-2">การยกเลิกและคืนเงิน</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>หากผู้ซื้อยกเลิก: เงินมัดจำไม่คืน</li>
                    <li>หากเราไม่สามารถส่งมอบรถได้: คืนเงินมัดจำ 100%</li>
                    <li>หากพบปัญหาร้ายแรงก่อนส่งมอบ: เจรจาเป็นกรณีไป</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">6. สินเชื่อรถยนต์</h2>
                <p className="text-gray-700 mb-4">บริการจัดหาสินเชื่อรถยนต์:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>เราเป็นเพียงตัวกลางในการจัดหาสินเชื่อ</li>
                  <li>การอนุมัติขึ้นอยู่กับนโยบายของสถาบันการเงิน</li>
                  <li>เราไม่รับผิดชอบหากสินเชื่อไม่ได้รับอนุมัติ</li>
                  <li>อัตราดอกเบี้ยและเงื่อนไขขึ้นอยู่กับแต่ละธนาคาร</li>
                  <li>ค่าธรรมเนียมการจัดหาสินเชื่อเป็นไปตามที่ตกลง</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">7. การรับประกัน</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary mb-2">ขอบเขตการรับประกัน</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                    <li>
                      <strong>เครื่องยนต์:</strong> ระบบหล่อลื่น การจุดระเบิด (1 ปี)
                    </li>
                    <li>
                      <strong>เกียร์:</strong> ระบบเกียร์อัตโนมัติ/ธรรมดา (1 ปี)
                    </li>
                    <li>
                      <strong>ไม่รับประกัน:</strong> ชิ้นส่วนที่สึกหรอตามปกติ เช่น ยาง แบตเตอรี่
                      ฟิลม์กรอง คอล์ยจุดระเบิด ช่วงล่าง หรืออื่นๆนอกจาก เครื่องยนต์ เกียร์
                    </li>
                    <li>
                      <strong>เงื่อนไข:</strong> ต้องเข้าเช็คระบบเช็คระยะตามกำหนด ทุก 3-6 เดือน
                      หากขาดการบำรุงรักษา ปล่อยให้นำ้มันเครื่องแห้ง หม้อนำ้แห้ง ไม่เปลี่ยน
                      นำ้มันเครื่อง-นำ้มันเกียร์ ใช้รถผิดประเภท เช่นแต่งโมดิฟาย เครื่องยนต์และเกียร์
                      เงื่อนใขนี้จะไม่อยู่ในการรับประกัน ระบุอาการเสียที่อยู่ในรับประกันคือ
                      เครื่องน็อคโดยไม่ทราบสาเหตุ เกียร์พังโดยไม่ทราบสาเหตุ
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  8. ข้อจำกัดความรับผิดชอบ
                </h2>
                <p className="text-gray-700 mb-4">ครูหนึ่งรถสวย จะไม่รับผิดชอบต่อ:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>ความเสียหายที่เกิดจากการใช้งานเว็บไซต์</li>
                  <li>ข้อผิดพลาดของข้อมูลที่นอกเหนือการควบคุม</li>
                  <li>การหยุดชะงักของบริการเว็บไซต์</li>
                  <li>การสูญหายของข้อมูลส่วนบุคคล</li>
                  <li>ความเสียหายทางอ้อมหรือผลสืบเนื่อง</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">9. ทรัพย์สินทางปัญญา</h2>
                <p className="text-gray-700 mb-4">
                  เนื้อหาทั้งหมดในเว็บไซต์ เช่น ข้อความ รูปภาพ โลโก้ วิดีโอ เป็นทรัพย์สินทางปัญญาของ
                  ครูหนึ่งรถสวย การใช้งานโดยไม่ได้รับอนุญาตถือเป็นการละเมิดลิขสิทธิ์
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">10. กฎหมายที่ใช้บังคับ</h2>
                <p className="text-gray-700">
                  ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย หากเกิดข้อพิพาท
                  ให้อยู่ในเขตอำนาจศาลจังหวัดเชียงใหม่
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-primary mb-4">11. การติดต่อ</h2>
                <p className="text-gray-700 mb-4">
                  หากมีคำถามเกี่ยวกับข้อกำหนดการใช้งาน กรุณาติดต่อ:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>ครูหนึ่งรถสวย</strong>
                  </p>
                  <p className="text-gray-700">
                    324 หมู่ 2 ต.สันพระเนตร อ.สันทราย จ.เชียงใหม่ 50210
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

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500 text-center">
                  ข้อกำหนดนี้อาจมีการปรับปรุงเปลี่ยนแปลงเป็นครั้งคราว โดยจะแจ้งให้ทราบผ่านเว็บไซต์
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// ISR - Terms rarely change - revalidate every 1 hour
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600, // 1 hour
  };
}
