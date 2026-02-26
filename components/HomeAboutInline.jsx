import Link from 'next/link';

/**
 * HomeAboutInline – "ทำไมต้องเลือกครูหนึ่งรถสวย?" section.
 * Extracted from pages/index.jsx to reduce TBT on the homepage.
 * Pure presentational – no props required.
 */
export default function HomeAboutInline() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 bg-white cv-auto-md">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 sm:mb-8 text-center font-prompt">
          ทำไมต้องเลือกครูหนึ่งรถสวย?
        </h2>

        <div className="space-y-6 text-gray-700 leading-relaxed font-prompt">
          {/* คุณภาพ & ไฟแนนซ์ */}
          <div className="bg-gray-50 rounded-xl p-5 sm:p-6 md:p-8">
            <p className="text-sm sm:text-base md:text-lg">
              <strong className="text-primary">ศูนย์รวมรถบ้านคุณภาพดี</strong>{' '}
              ในตลาดรถยนต์มือสองภาคเหนือ{' '}
              <strong className="text-gray-900">คัดสรรคุณภาพทุกคัน</strong>{' '}
              ตรวจสอบโดยผู้เชี่ยวชาญ พร้อม{' '}
              <strong className="text-green-700">รับประกัน 1 ปีเต็ม</strong> เรามี
              <strong className="text-accent-800"> ฟรีดาวน์ 0%</strong> อัตราดอกเบี้ยพิเศษ และ
              <strong className="text-primary"> อนุมัติง่าย</strong>{' '}
              ด้วยระบบสินเชื่อที่หลากหลาย{' '}
              <strong className="text-gray-900">ผ่อนถูก ผ่อนสบาย</strong>
            </p>
          </div>

          {/* ยี่ห้อ & ประเภทรถ */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 sm:p-6 md:p-8">
            <p className="text-sm sm:text-base md:text-lg mb-4">
              <strong className="text-gray-900">เรามีรถยี่ห้อดังให้เลือกมากมาย</strong>{' '}
              {[
                { href: '/all-cars?brand=toyota', label: 'Toyota' },
                { href: '/all-cars?brand=honda', label: 'Honda' },
                { href: '/all-cars?brand=nissan', label: 'Nissan' },
                { href: '/all-cars?brand=mazda', label: 'Mazda' },
                { href: '/all-cars?brand=isuzu', label: 'Isuzu' },
              ].map(({ href, label }) => (
                <span key={label}>
                  <Link
                    href={href}
                    prefetch={false}
                    className="text-primary hover:underline font-medium"
                  >
                    {label}
                  </Link>{' '}
                </span>
              ))}
              ทั้ง{' '}
              {[
                { href: '/all-cars?type=เก๋ง', label: 'รถเก๋ง' },
                { href: '/all-cars?type=กระบะ', label: 'รถกระบะ' },
                { href: '/all-cars?type=SUV', label: 'รถ SUV' },
              ].map(({ href, label }) => (
                <span key={label}>
                  <Link
                    href={href}
                    prefetch={false}
                    className="text-accent-800 hover:text-accent-900 hover:underline font-medium"
                  >
                    {label}
                  </Link>{' '}
                </span>
              ))}
              และรถครอบครัว 7 ที่นั่ง พร้อม
              <strong className="text-primary"> ส่งฟรีทั่วประเทศไทย</strong>
            </p>
          </div>

          {/* บริการ & ติดต่อ */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 sm:p-6 md:p-8">
            <p className="text-sm sm:text-base md:text-lg mb-4">
              <strong className="text-gray-900">มีปัญหาเรื่องสินเชื่อ?</strong>{' '}
              <Link
                href="/credit-check"
                prefetch={false}
                className="text-accent-800 hover:text-accent-900 hover:underline font-semibold"
              >
                ปรึกษาไฟแนนซ์ฟรี
              </Link>{' '}
              เรามีทีมงานมืออาชีพคอยให้คำปรึกษา{' '}
              <strong className="text-gray-900">และอยากขายรถ?</strong>{' '}
              <Link
                href="/sell-car"
                prefetch={false}
                className="text-primary hover:underline font-semibold"
              >
                ประเมินราคาฟรี รับซื้อทันที
              </Link>{' '}
              ราคายุติธรรม
            </p>

            <p className="mt-6 pt-6 border-t border-orange-200 text-center text-sm sm:text-base mb-3 text-gray-700">
              <strong className="text-gray-900">นัดหมายดูรถ</strong>
            </p>
            <a
              href="tel:0940649018"
              className="flex w-fit mx-auto items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all duration-300 hover:shadow-lg text-base sm:text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>094-064-9018</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
