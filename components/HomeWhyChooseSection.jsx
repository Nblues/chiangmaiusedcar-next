import Link from 'next/link';
import A11yImage from './A11yImage';

/**
 * HomeWhyChooseSection – "ลูกค้าทั่วประเทศไว้วางใจเพราะ?" section.
 * Extracted from pages/index.jsx.
 * @param {function} getBrandCount - function(brandName: string) => string, returns count string like "12 คัน"
 */
export default function HomeWhyChooseSection({ getBrandCount }) {
  return (
    <section className="py-16 mt-8 rounded-3xl max-w-[1400px] mx-auto shadow-xl overflow-hidden bg-white cv-auto-lg">
      <div className="px-6 md:px-10">
        {/* Header Banner (kn9) */}
        <div className="relative rounded-3xl overflow-hidden mb-12 lg:mb-4">
          <div className="relative h-[220px] sm:h-[260px] md:h-[280px] lg:h-[340px]">
            <A11yImage
              src="/images/kn9.webp"
              alt=""
              aria-hidden="true"
              fill
              loading="lazy"
              fetchpriority="low"
              optimizeImage={false}
              sizes="(max-width: 640px) 100vw, (max-width: 1400px) 1400px, 1400px"
              className="absolute inset-0 w-full h-full object-cover object-[50%_36%] sm:object-[50%_62%] lg:object-[50%_56%]"
            />
            <div className="absolute inset-0 bg-black/55 sm:bg-black/40" aria-hidden="true" />

            {/* Floating text above image */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-start text-center px-4 sm:px-8 pt-10 sm:pt-12">
              <h2 className="text-[19px] sm:text-3xl md:text-4xl font-bold text-white mb-4 font-prompt whitespace-nowrap sm:whitespace-normal leading-tight tracking-tight drop-shadow-sm">
                ลูกค้าทั่วประเทศไว้วางใจเพราะ?
              </h2>
              <p className="text-base sm:text-lg lg:text-base text-white/90 max-w-2xl lg:max-w-none mx-auto font-prompt leading-relaxed lg:leading-tight whitespace-normal lg:whitespace-nowrap drop-shadow-sm">
                <span className="text-white font-semibold">ประสบการณ์ 10 ปี+</span>{' '}
                <span className="font-semibold text-white">
                  เฟซบุ๊กผู้ติดตาม 1 ล้านคนทั่วประเทศ
                </span>{' '}
                <span className="text-white font-semibold">ลูกค้า 90% เชื่อมั่น</span>{' '}
                <span
                  className="inline-block font-extrabold text-white tracking-tight text-lg sm:text-xl lg:text-lg px-2 py-0.5 rounded-lg bg-black/45"
                  style={{
                    textShadow:
                      '-2px 0 rgba(0,0,0,0.9), 2px 0 rgba(0,0,0,0.9), 0 -2px rgba(0,0,0,0.9), 0 2px rgba(0,0,0,0.9), -2px -2px rgba(0,0,0,0.9), 2px -2px rgba(0,0,0,0.9), -2px 2px rgba(0,0,0,0.9), 2px 2px rgba(0,0,0,0.9), 0 3px 18px rgba(0,0,0,0.45)',
                  }}
                >
                  ไม่ต้องมาดูรถ
                </span>
              </p>
              <div className="w-32 h-1 bg-white/70 mx-auto rounded-full mt-6"></div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
              <A11yImage
                src="/images/kn2.webp"
                alt="ไอคอนรถบ้านแท้"
                width={128}
                height={128}
                loading="lazy"
                fetchpriority="low"
                optimizeImage={false}
                className="w-full h-full max-w-none object-contain"
              />
            </div>
            <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
              <span className="block text-primary font-semibold">คัดเฉพาะรถมือเดียว</span>
              <span className="block">
                <span className="text-primary font-semibold">จากเจ้าของโดยตรง</span>{' '}
                <span className="text-accent-800 font-semibold">
                  ไม่มีรถน้ำท่วม ไม่มีรถอุบัติเหตุ
                </span>{' '}
                <span className="text-primary">ขอดูเล่มทะเบียนได้ทุกหน้า</span>
              </span>
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
              <A11yImage
                src="/images/kn1.webp"
                alt="ไอคอนฟรีดาวน์ 0%"
                width={128}
                height={128}
                loading="lazy"
                fetchpriority="low"
                optimizeImage={false}
                className="w-full h-full max-w-none object-contain"
              />
            </div>
            <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
              <span className="block text-orange-700 font-semibold">ออกรถไม่ต้องวางเงินดาวน์</span>
              <span className="block">
                ตามเงื่อนไขไฟแนนซ์{' '}
                <span className="text-primary font-semibold">อนุมัติง่าย ผ่อนสบาย</span>
              </span>
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
              <A11yImage
                src="/images/kn6.webp"
                alt="ไอคอนรับประกัน"
                width={128}
                height={128}
                loading="lazy"
                fetchpriority="low"
                optimizeImage={false}
                className="w-full h-full max-w-none object-contain"
              />
            </div>
            <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
              <span className="block">รับประกันเครื่องยนต์และเกียร์</span>
              <span className="block">
                <span className="text-primary font-semibold">1 ปีเต็ม ไม่จำกัดกิโลเมตร</span> พร้อม{' '}
                <span className="text-orange-700 font-semibold">บริการหลังการขาย</span>
              </span>
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 sm:mb-4 lg:mb-5 rounded-2xl overflow-hidden">
              <A11yImage
                src="/images/kn5.webp"
                alt="ไอคอนส่งฟรี"
                width={128}
                height={128}
                loading="lazy"
                fetchpriority="low"
                optimizeImage={false}
                className="w-full h-full max-w-none object-contain"
              />
            </div>
            <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
              <span className="block text-orange-700 font-semibold">จัดส่งฟรีทุกจังหวัด</span>
              <span className="block">
                พร้อมประกันการขนส่ง{' '}
                <span className="text-primary font-semibold">ลูกค้า 90% เชื่อมั่น</span>
              </span>
              <span className="block">ไม่ต้องมาดูรถ</span>
            </p>
          </div>
        </div>

        {/* Car Brands Section - Glass Effect */}
        <div className="relative rounded-3xl p-4 md:p-8 border border-gray-200 shadow-2xl overflow-hidden bg-white">
          {/* Animated Background Elements */}
          <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(26,35,126,0.03),transparent_50%)]"></div>
          <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.02),transparent_50%)]"></div>
          <div className="hidden absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(37,99,235,0.02),transparent_50%)]"></div>

          <div className="relative z-10 text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 font-prompt leading-tight">
              ศูนย์รวมแบรนด์ดังครบครัน
            </h3>
            <p className="text-gray-700 font-prompt text-sm md:text-lg leading-relaxed max-w-2xl mx-auto px-2">
              รถมือสองคุณภาพจากทุกแบรนด์ชั้นนำ ตามมาตรฐาน ครูหนึ่งรถสวย
            </p>
          </div>

          {/* Brand Grid - Ultra Glass Design */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            <Link
              href="/all-cars?brand=toyota"
              className="group relative backdrop-blur-2xl bg-white/20 rounded-xl md:rounded-3xl p-3 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
              }}
              aria-label="ดูรถ Toyota ทั้งหมด"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="font-bold text-gray-900 text-sm md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                  Toyota
                </div>
                <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                  {getBrandCount('toyota')}
                </div>
              </div>
            </Link>

            <Link
              href="/all-cars?brand=honda"
              className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
              }}
              aria-label="ดูรถ Honda ทั้งหมด"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                  Honda
                </div>
                <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                  {getBrandCount('honda')}
                </div>
              </div>
            </Link>

            <Link
              href="/all-cars?brand=nissan"
              className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
              }}
              aria-label="ดูรถ Nissan ทั้งหมด"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                  Nissan
                </div>
                <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                  {getBrandCount('nissan')}
                </div>
              </div>
            </Link>

            <Link
              href="/all-cars?brand=mazda"
              className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
              }}
              aria-label="ดูรถ Mazda ทั้งหมด"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                  Mazda
                </div>
                <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                  {getBrandCount('mazda')}
                </div>
              </div>
            </Link>

            <Link
              href="/all-cars?brand=mitsubishi"
              className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
              }}
              aria-label="ดูรถ Mitsubishi ทั้งหมด"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                  Mitsubishi
                </div>
                <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                  {getBrandCount('mitsubishi')}
                </div>
              </div>
            </Link>

            <Link
              href="/all-cars?brand=ford"
              className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
              }}
              aria-label="ดูรถ Ford ทั้งหมด"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                  Ford
                </div>
                <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                  {getBrandCount('ford')}
                </div>
              </div>
            </Link>

            <Link
              href="/all-cars?brand=isuzu"
              className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
              }}
              aria-label="ดูรถ Isuzu ทั้งหมด"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                  Isuzu
                </div>
                <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                  {getBrandCount('isuzu')}
                </div>
              </div>
            </Link>

            <Link
              href="/all-cars?brand=hyundai"
              className="group relative backdrop-blur-2xl bg-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 text-center border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/30 active:scale-95 overflow-hidden"
              style={{
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(255,255,255,0.3)',
              }}
              aria-label="ดูรถ Hyundai ทั้งหมด"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="font-bold text-gray-900 text-base md:text-lg lg:text-xl mb-2 md:mb-3 font-prompt drop-shadow-sm">
                  Hyundai
                </div>
                <div className="inline-flex items-center justify-center text-xs md:text-sm text-gray-800 font-medium backdrop-blur-lg bg-white/50 rounded-lg py-1 px-2 font-prompt border border-white/50 shadow-sm">
                  {getBrandCount('hyundai')}
                </div>
              </div>
            </Link>
          </div>

          {/* Service Links - Ultra Modern 2025 Neomorphic Glass Design */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 px-2 md:px-0">
            <Link
              href="/contact"
              className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
              aria-label="ติดต่อสอบถามข้อมูลรถยนต์"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="group-hover:tracking-wider transition-all duration-700">
                  ติดต่อเรา
                </span>
              </div>
            </Link>
            <Link
              href="/about"
              className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
              aria-label="เรียนรู้เพิ่มเติมเกี่ยวกับครูหนึ่งรถสวย"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="group-hover:tracking-wider transition-all duration-700">
                  เกี่ยวกับเรา
                </span>
              </div>
            </Link>
            <Link
              href="/promotion"
              className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
              aria-label="ดูโปรโมชั่นและข้อเสนอพิเศษ"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,152,0,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
                <span className="group-hover:tracking-wider transition-all duration-700">
                  โปรโมชั่น
                </span>
              </div>
            </Link>
            <Link
              href="/credit-check"
              prefetch={false}
              className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
              aria-label="ตรวจสอบสถานะสินเชื่อ"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span className="group-hover:tracking-wider transition-all duration-700">
                  ประเมินสินเชื่อ
                </span>
              </div>
            </Link>
            <Link
              href="/payment-calculator"
              className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
              aria-label="คำนวณเงินผ่อนรถยนต์"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="group-hover:tracking-wider transition-all duration-700">
                  คิดเงินผ่อน
                </span>
              </div>
            </Link>
            <Link
              href="/sell-car"
              prefetch={false}
              className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
              aria-label="ขายรถกับครูหนึ่งรถสวย"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <span className="group-hover:tracking-wider transition-all duration-700">
                  ขายรถ
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
