import Link from 'next/link';
import { Fragment } from 'react';
import A11yImage from './A11yImage';
import Image from 'next/image';
/**
 * HomeFaqSection – คำถามที่พบบ่อย accordion section.
 * Extracted from pages/index.jsx. No props required.
 */
export default function HomeFaqSection() {
  return (
    <Fragment>
      {/* SEO Optimized Trust Features Section */}
      <section
        className="mb-8 sm:mb-12 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10"
        aria-labelledby="trust-features-heading"
      >
        <h2 id="trust-features-heading" className="sr-only">
          จุดเด่นบริการและมาตรฐานรถยนต์มือสองครูหนึ่งรถสวย
        </h2>
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Feature 1 */}
          <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-row-reverse md:flex-col items-center md:items-start gap-4 md:gap-0">
            <div className="relative shrink-0 flex items-center justify-center w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-20 md:h-20 lg:w-24 lg:h-24 md:mb-4 lg:mb-5 rounded-2xl transition-transform duration-300 group-hover:scale-105 active:scale-[0.97] active:opacity-[0.85]">
              <A11yImage
                src="/images/kn2.webp"
                alt="ไอคอนรถบ้านแท้"
                width={128}
                height={128}
                loading="lazy"
                fetchPriority="low"
                className="w-full h-full max-w-none object-contain scale-[1.15] md:scale-100 origin-center"
              />
            </div>
            <div className="flex-1 w-full text-left">
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
          </div>

          {/* Feature 2 */}
          <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-row-reverse md:flex-col items-center md:items-start gap-4 md:gap-0">
            <div className="relative shrink-0 flex items-center justify-center w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-20 md:h-20 lg:w-24 lg:h-24 md:mb-4 lg:mb-5 rounded-2xl transition-transform duration-300 group-hover:scale-105 active:scale-[0.97] active:opacity-[0.85]">
              <A11yImage
                src="/images/kn1.webp"
                alt="ไอคอนฟรีดาวน์ 0%"
                width={128}
                height={128}
                loading="lazy"
                fetchPriority="low"
                className="w-full h-full max-w-none object-contain scale-[1.15] md:scale-100 origin-center"
              />
            </div>
            <div className="flex-1 w-full text-left">
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block text-orange-700 font-semibold">
                  ออกรถไม่ต้องวางเงินดาวน์
                </span>
                <span className="block">
                  ตามเงื่อนไขไฟแนนซ์{' '}
                  <span className="text-primary font-semibold">อนุมัติง่าย ผ่อนสบาย</span>
                </span>
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-row-reverse md:flex-col items-center md:items-start gap-4 md:gap-0">
            <div className="relative shrink-0 flex items-center justify-center w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-20 md:h-20 lg:w-24 lg:h-24 md:mb-4 lg:mb-5 rounded-2xl transition-transform duration-300 group-hover:scale-105 active:scale-[0.97] active:opacity-[0.85]">
              <A11yImage
                src="/images/kn6.webp"
                alt="ไอคอนรับประกัน"
                width={128}
                height={128}
                loading="lazy"
                fetchPriority="low"
                className="w-full h-full max-w-none object-contain scale-[1.15] md:scale-100 origin-center"
              />
            </div>
            <div className="flex-1 w-full text-left">
              <p className="text-gray-800 font-prompt text-sm sm:text-[15px] md:text-sm leading-relaxed antialiased">
                <span className="block">รับประกันเครื่องยนต์และเกียร์</span>
                <span className="block">
                  <span className="text-primary font-semibold">1 ปีเต็ม ไม่จำกัดกิโลเมตร</span>{' '}
                  พร้อม <span className="text-orange-700 font-semibold">บริการหลังการขาย</span>
                </span>
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 ring-1 ring-black/5 shadow-md hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-row-reverse md:flex-col items-center md:items-start gap-4 md:gap-0">
            <div className="relative shrink-0 flex items-center justify-center w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-20 md:h-20 lg:w-24 lg:h-24 md:mb-4 lg:mb-5 rounded-2xl transition-transform duration-300 group-hover:scale-105 active:scale-[0.97] active:opacity-[0.85]">
              <A11yImage
                src="/images/kn5.webp"
                alt="ไอคอนส่งฟรี"
                width={128}
                height={128}
                loading="lazy"
                fetchPriority="low"
                className="w-full h-full max-w-none object-contain scale-[1.15] md:scale-100 origin-center"
              />
            </div>
            <div className="flex-1 w-full text-left">
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
        </div>
      </section>
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
                  ลูกค้าสามารถออกรถฟรีดาวน์ตามโปรโมชัน ตรวจสภาพครบถ้วน และตรวจสอบประวัติรถก่อนส่งมอบ
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
                  <a href="tel:0940649018" className="text-primary font-bold hover:underline ml-1">
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
                  เครื่องยนต์และเกียร์ <span className="font-bold text-primary">1 ปีเต็ม</span>{' '}
                  ตรวจสภาพครบถ้วนก่อนส่งมอบ และมีบริการหลังการขาย
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Quick Service Links Section */}
      <section
        className="mt-8 mb-4 sm:mb-8 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10"
        aria-label="ช่องทางลัดบริการ"
      >
        <h2 className="sr-only">ช่องทางลัดตรวจสอบเครดิตและออกรถ</h2>
        {/* Service Links - Ultra Modern 2025 Neomorphic Glass Design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-4 px-2 md:px-0">
          <Link
            href="/contact"
            prefetch={false}
            className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 active:scale-[0.97] active:opacity-[0.85]"
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
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 active:scale-[0.97] active:opacity-[0.85]"
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
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,152,0,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 active:scale-[0.97] active:opacity-[0.85]"
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
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 active:scale-[0.97] active:opacity-[0.85]"
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
            prefetch={false}
            className="group relative backdrop-blur-xl bg-white/85 hover:bg-white/90 text-primary font-semibold text-xs md:text-sm py-3 md:py-5 px-2 md:px-4 rounded-xl md:rounded-3xl text-center transition-all duration-700 hover:scale-[1.02] active:scale-95 overflow-hidden font-prompt shadow-[4px_4px_8px_rgba(163,177,198,0.3),-2px_-2px_6px_rgba(255,255,255,0.7)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4),-3px_-3px_8px_rgba(255,255,255,0.8),inset_1px_1px_2px_rgba(26,35,126,0.08)] border border-white/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 active:scale-[0.97] active:opacity-[0.85]"
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
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(26,35,126,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
              <svg
                className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 active:scale-[0.97] active:opacity-[0.85]"
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
              <span className="group-hover:tracking-wider transition-all duration-700">ขายรถ</span>
            </div>
          </Link>
        </div>
      </section>
    </Fragment>
  );
}
