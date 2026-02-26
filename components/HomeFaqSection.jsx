/**
 * HomeFaqSection – คำถามที่พบบ่อย accordion section.
 * Extracted from pages/index.jsx. No props required.
 */
export default function HomeFaqSection() {
  return (
    <section className="bg-white py-8 sm:py-10 mt-6 rounded-3xl max-w-6xl mx-auto border border-gray-200 shadow-sm cv-auto">
            <div className="px-4 sm:px-6">
              <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
                  คำถามที่พบบ่อย
                </h2>
                <p className="mt-1 text-sm sm:text-base text-gray-700 font-prompt">
                  รวมคำตอบเรื่องดาวน์ 0% เครดิตบูโร และรับประกัน
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                      ดาวน์ 0% จริงไหม?
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                      ดูคำตอบ
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                      ซ่อนคำตอบ
                    </span>
                  </summary>

                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                      <span className="font-semibold text-accent-800">จริง!</span>{' '}
                      ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชัน ตรวจสภาพครบถ้วน
                      และตรวจสอบประวัติรถก่อนส่งมอบ
                    </div>
                  </div>
                </details>

                <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                      ติดเครดิตบูโรออกได้ไหม?
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                      ดูคำตอบ
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                      ซ่อนคำตอบ
                    </span>
                  </summary>

                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                      <span className="font-semibold text-primary">ได้!</span>
                      เรามีไฟแนนซ์หลากหลายแบบ แนะนำให้ทัก LINE หรือโทร{' '}
                      <a
                        href="tel:0940649018"
                        className="text-primary font-bold hover:underline ml-1"
                      >
                        094-064-9018
                      </a>{' '}
                      เพื่อประเมินเบื้องต้น
                    </div>
                  </div>
                </details>

                <details className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <summary className="cursor-pointer list-none font-prompt flex items-start justify-between gap-4 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                      มีรับประกันไหม?
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap group-open:hidden">
                      ดูคำตอบ
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-primary whitespace-nowrap hidden group-open:inline">
                      ซ่อนคำตอบ
                    </span>
                  </summary>

                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="rounded-xl bg-white border border-gray-200 p-3 sm:p-4 text-sm sm:text-base font-prompt leading-relaxed text-gray-800">
                      <span className="font-semibold text-accent-800">รับประกัน</span>
                      เครื่องยนต์และเกียร์ <span className="font-bold text-primary">
                        1 ปีเต็ม
                      </span>{' '}
                      ตรวจสภาพครบถ้วนก่อนส่งมอบ และมีบริการหลังการขาย
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </section>
  );
}
