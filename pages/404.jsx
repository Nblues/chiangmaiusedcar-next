import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>ไม่พบหน้าที่ต้องการ - ครูหนึ่งรถสวย</title>
        <meta
          name="description"
          content="ขออภัย ไม่พบหน้าที่คุณต้องการ กรุณาเลือกดูรถมือสองเชียงใหม่สภาพดี หรือติดต่อสอบถาม ครูหนึ่งรถสวย"
        />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-prompt">
        <div className="text-center p-8 rounded-2xl bg-white shadow-xl max-w-lg w-full mx-auto border border-gray-100 m-4">
          <div className="mb-4">
            <h1 className="text-8xl font-black text-primary/10 mb-4 tracking-tighter">404</h1>
            <h2 className="text-2xl font-bold text-primary mb-3">
              ไม่พบหน้าที่คุณต้องการ
            </h2>
            <p className="text-gray-600 mb-8 text-sm md:text-base">
              หน้าที่คุณกำลังหาอาจถูกย้าย ลบ หรือไม่มีอยู่จริง
            </p>
          </div>

          <div className="space-y-3 flex flex-col items-center">
            <Link
              href="/"
              className="btn-primary w-full text-center px-6 py-3 rounded-lg font-semibold"
            >
              กลับหน้าแรก
            </Link>

            <Link
              href="/all-cars"
              className="btn-secondary w-full text-center px-6 py-3 rounded-lg font-semibold"
            >
              ดูรถทั้งหมด
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500 pt-6 border-t border-gray-100">
            <p>หรือค้นหายี่ห้อรถที่คุณต้องการ:</p>
            <div className="mt-4 flex justify-center flex-wrap gap-3 text-primary text-xs sm:text-sm">
              <Link href="/used-cars-chiang-mai-brand/toyota" className="hover:underline font-semibold transition-colors">
                Toyota
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/used-cars-chiang-mai-brand/honda" className="hover:underline font-semibold transition-colors">
                Honda
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/used-cars-chiang-mai-brand/isuzu" className="hover:underline font-semibold transition-colors">
                Isuzu
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/used-cars-chiang-mai-brand/mitsubishi" className="hover:underline font-semibold transition-colors">
                Mitsubishi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ช่วยให้ Next.js สร้างหน้า 404 (Prerender) รองรับระบบหลายภาษา (i18n) ตอนทำ SSG Build
export async function getStaticProps({ locale }) {
  return {
    props: {
        ...(locale ? { locale } : {}),
    },
  };
}
