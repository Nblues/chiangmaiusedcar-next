import React from 'react';
import Link from 'next/link';
import A11yImage from './A11yImage';
import { BUSINESS_INFO, createPhoneLink, createPlaceLink } from '../config/business';

export default function UsedCarsChiangMaiDeferred() {
  return (
    <>
      <section id="social" className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt text-center">
          ติดตามเราบนโซเชียลมีเดีย
        </h2>
        <p className="mt-2 text-gray-700 font-prompt text-center">
          อัปเดตรถเข้าใหม่ รีวิวรถ และโปรโมชัน — เลือกช่องทางที่สะดวกได้เลย
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          <a
            href={BUSINESS_INFO.socialMedia.facebook.main}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"
            aria-label="ติดตาม Facebook เพจหลัก ครูหนึ่งรถสวย"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors font-prompt">
                  Facebook
                </h3>
                <p className="text-xs text-gray-500 font-prompt">
                  {BUSINESS_INFO.socialFollowStats.facebook.main.label}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-blue-600 font-prompt">
              {BUSINESS_INFO.socialFollowStats.facebook.main.metricText}
            </p>
          </a>

          <a
            href={BUSINESS_INFO.socialMedia.facebook.personal}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"
            aria-label="ติดตาม Facebook ส่วนตัว ครูหนึ่งรถสวย"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-gray-800 group-hover:text-blue-500 transition-colors font-prompt">
                  Facebook
                </h3>
                <p className="text-xs text-gray-500 font-prompt">
                  {BUSINESS_INFO.socialFollowStats.facebook.personal.label}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-blue-500 font-prompt">
              {BUSINESS_INFO.socialFollowStats.facebook.personal.metricText}
            </p>
          </a>

          <a
            href={BUSINESS_INFO.socialMedia.facebook.fcGroup}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"
            aria-label="เข้าร่วม Facebook กลุ่ม FC ครูหนึ่งรถสวย"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors font-prompt">
                  Facebook
                </h3>
                <p className="text-xs text-gray-500 font-prompt">
                  {BUSINESS_INFO.socialFollowStats.facebook.fcGroup.label}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-blue-700 font-prompt">
              {BUSINESS_INFO.socialFollowStats.facebook.fcGroup.metricText}
            </p>
          </a>

          <a
            href={BUSINESS_INFO.socialMedia.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"
            aria-label="ติดตาม TikTok ครูหนึ่งรถสวย"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-gray-800 group-hover:text-gray-900 transition-colors font-prompt">
                  TikTok
                </h3>
                <p className="text-xs text-gray-500 font-prompt">
                  {BUSINESS_INFO.socialFollowStats.tiktok.label}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900 font-prompt">
              {BUSINESS_INFO.socialFollowStats.tiktok.metricText}
            </p>
          </a>

          <a
            href={BUSINESS_INFO.socialMedia.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"
            aria-label="ติดตาม YouTube วิดีโอรีวิว ครูหนึ่งรถสวย"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors font-prompt">
                  YouTube
                </h3>
                <p className="text-xs text-gray-500 font-prompt">
                  {BUSINESS_INFO.socialFollowStats.youtube.label}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-red-600 font-prompt">
              {BUSINESS_INFO.socialFollowStats.youtube.metricText}
            </p>
          </a>

          <a
            href={BUSINESS_INFO.socialMedia.lemon8}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group"
            aria-label="ติดตาม Lemon8 ครูหนึ่งรถสวย"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L19.82 5.63L16.55 11.37L23 12L16.55 12.63L19.82 18.37L13.09 15.74L12 22L10.91 15.74L4.18 18.37L7.45 12.63L1 12L7.45 11.37L4.18 5.63L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-gray-800 group-hover:text-yellow-600 transition-colors font-prompt">
                  Lemon8
                </h3>
                <p className="text-xs text-gray-500 font-prompt">
                  {BUSINESS_INFO.socialFollowStats.lemon8.label}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-yellow-600 font-prompt">
              {BUSINESS_INFO.socialFollowStats.lemon8.metricText}
            </p>
          </a>

          <a
            href={BUSINESS_INFO.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group sm:col-span-2 lg:col-span-1"
            aria-label="แชท LINE ครูหนึ่งรถสวย"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors font-prompt">
                  LINE
                </h3>
                <p className="text-xs text-gray-500 font-prompt">
                  {BUSINESS_INFO.socialFollowStats.line.label}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-green-600 font-prompt">
              {BUSINESS_INFO.socialFollowStats.line.metricText}
            </p>
          </a>
        </div>
      </section>

      <section id="dealer" className="mt-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary font-prompt">
          เต็นท์รถมือสองเชียงใหม่ (ครูหนึ่งรถสวย)
        </h2>
        <p className="mt-2 text-gray-700 font-prompt">
          สามารถติดต่อนัดหมายดูรถหรือสอบถามข้อมูลเพิ่มเติมได้ที่นี่
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
          <div className="relative h-56 w-full sm:h-64 md:h-72 lg:h-80 xl:h-96">
            <A11yImage
              src="/images/kn9.webp"
              alt="เต็นท์รถมือสองเชียงใหม่ ครูหนึ่งรถสวย"
              fill
              decoding="async"
              imageType="content"
              optimizeImage={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 900px, 1000px"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 font-prompt">ที่อยู่</div>
            <div className="mt-1 text-sm text-gray-700 font-prompt">
              {BUSINESS_INFO.address.street} {BUSINESS_INFO.address.subdistrict}{' '}
              {BUSINESS_INFO.address.district} {BUSINESS_INFO.address.province}{' '}
              {BUSINESS_INFO.address.postalCode}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={createPlaceLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                เปิดแผนที่
              </a>
              <a
                href={BUSINESS_INFO.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-green-600 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 transition-colors"
              >
                ทัก LINE
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 font-prompt">โทร / เวลาทำการ</div>
            <div className="mt-1 text-sm text-gray-700 font-prompt">
              <a href={createPhoneLink()} className="text-primary font-semibold hover:underline">
                {BUSINESS_INFO.phone}
              </a>
            </div>
            <div className="mt-1 text-sm text-gray-700 font-prompt">
              {BUSINESS_INFO.operatingHours.display}
            </div>
            <div className="mt-3">
              <Link
                href="/contact"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-xl border border-primary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
              >
                หน้า “ติดต่อเรา”
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold text-gray-900 font-prompt">ลิงก์สำคัญ</div>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/all-cars"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-800 transition-colors"
              >
                ดูรถทั้งหมด
              </Link>
              <a
                href={BUSINESS_INFO.socialMedia.facebook.main}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-blue-700 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="bg-gradient-to-r from-primary to-primary-800 px-5 py-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-prompt">คำถามที่พบบ่อย</h2>
          <p className="mt-1 text-sm text-white/90 font-prompt">
            คำตอบสั้นๆ ที่ช่วยให้ตัดสินใจได้เร็วขึ้น
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="space-y-3 font-prompt">
            <details className="group rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 py-4">
              <summary className="flex cursor-pointer list-none items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-7-4.35-7-10a7 7 0 0 1 14 0c0 5.65-7 10-7 10z" />
                    <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    ฝากขายรถกับครูหนึ่งรถสวยมีเงื่อนไขอะไรบ้าง?
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    เน้นคัดสภาพให้ได้มาตรฐานก่อนรับฝากขาย
                  </p>
                </div>

                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-transform group-open:rotate-180">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>

              <div className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                โดยหลักๆ จะเน้นรถมือเดียว ไม่มีอุบัติเหตุหนัก/ไม่จมน้ำ มีประวัติดูแลบำรุงรักษาดี
                เครื่องยนต์/เกียร์/เล่มทะเบียนไม่มีปัญหา — ดูรายละเอียดเพิ่มเติมได้ที่{' '}
                <a
                  href="#consign-conditions"
                  className="text-primary hover:underline font-semibold"
                >
                  เงื่อนไขฝากขาย
                </a>
              </div>
            </details>

            <details className="group rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 py-4">
              <summary className="flex cursor-pointer list-none items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-800">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 12h-4l-3 9-6-18-3 9H2" />
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    ฝากขายต้องเอารถมาจอดที่เต็นท์ไหม?
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">โดยส่วนใหญ่ยังใช้รถตามปกติได้</p>
                </div>

                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-transform group-open:rotate-180">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>

              <div className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                ไม่จำเป็นต้องเอารถมาจอดไว้ที่เต็นท์ตลอดเวลา โดยส่วนใหญ่คุณยังสามารถใช้รถตามปกติได้
                ทีมงานจะนัดหมายตามขั้นตอนที่เหมาะสม (เช่น ตรวจสภาพ/ถ่ายรูป/นัดลูกค้า)
                เพื่อให้ขายง่ายและสะดวกที่สุด
              </div>
            </details>

            <details className="group rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 py-4">
              <summary className="flex cursor-pointer list-none items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold-800">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 7h13l5 5-5 5H3V7z" />
                    <path d="M7 12h.01" />
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    นัดตรวจสภาพและตั้งราคาฝากขายทำอย่างไร?
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    นัดล่วงหน้า นำรถเข้ามาตรวจสภาพได้ทุกวัน
                  </p>
                </div>

                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-transform group-open:rotate-180">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>

              <div className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                นัดหมายล่วงหน้าแล้วนำรถเข้ามาตรวจสภาพที่เต็นท์ได้ทุกวัน หลังตรวจสภาพ
                ทีมงานจะช่วยประเมินและตั้งราคา ให้ใกล้เคียงราคาตลาดมากที่สุดตามสภาพจริง
                เพื่อให้ขายได้คุ้มและสบายใจ
              </div>
            </details>

            <details className="group rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 py-4">
              <summary className="flex cursor-pointer list-none items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 7h10v10H7z" />
                    <path d="M7 11h10" />
                    <path d="M9 7V5" />
                    <path d="M15 7V5" />
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    ต้องเตรียมเอกสารอะไรบ้างสำหรับฝากขาย/ซื้อขาย?
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">เช็คให้ก่อนนัดหมายได้ทาง LINE</p>
                </div>

                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-transform group-open:rotate-180">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>

              <div className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                โดยทั่วไปแนะนำเตรียมเล่มทะเบียน/เอกสารรถที่เกี่ยวข้อง บัตรประชาชนผู้ขาย
                และข้อมูลการดูแลบำรุงรักษา (ถ้ามี) รายการอาจแตกต่างตามกรณี —{' '}
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  ทัก LINE
                </a>{' '}
                เพื่อให้ทีมงานเช็คให้ได้ก่อนนัดหมาย
              </div>
            </details>

            <details className="group rounded-2xl border border-gray-200 bg-white px-4 sm:px-5 py-4">
              <summary className="flex cursor-pointer list-none items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 7h13l5 5-5 5H3V7z" />
                    <path d="M7 12h.01" />
                  </svg>
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    มีบริการส่งรถต่างจังหวัด หรือช่วยดูรถแบบออนไลน์ไหม?
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    ขึ้นอยู่กับเงื่อนไขและความพร้อมของงาน
                  </p>
                </div>

                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-transform group-open:rotate-180">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>

              <div className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
                มีบริการประสานงานจัดส่งรถ (ขึ้นอยู่กับเงื่อนไข)
                และสามารถช่วยสรุปข้อมูล/รูป/วิดีโอประกอบการตัดสินใจ พร้อมดูแลเอกสารให้ครบก่อนส่งมอบ
                ติดต่อสอบถามได้ที่{' '}
                <a href={createPhoneLink()} className="text-primary hover:underline font-semibold">
                  {BUSINESS_INFO.phone}
                </a>
              </div>
            </details>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-700 font-prompt">
              ถ้ายังไม่แน่ใจ ทักมาถามได้เลย — ตอบไว ช่วยเช็คคันที่เหมาะกับงบ
            </div>
            <div className="flex gap-2">
              <a href={createPhoneLink()} className="btn-primary px-4 py-2 text-sm rounded-xl">
                โทรเลย
              </a>
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-4 py-2 text-sm rounded-xl"
              >
                ทัก LINE
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
