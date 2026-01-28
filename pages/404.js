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
          content="ขออภัย ไม่พบหน้าที่คุณต้องการ กรุณาเลือกดูรถมือสองเชียงใหม่คุณภาพดี หรือติดต่อสอบถาม ครูหนึ่งรถสวย"
        />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary/30 mb-4 font-prompt">404</h1>
            <h2 className="text-2xl font-semibold text-primary mb-2 font-prompt">
              ไม่พบหน้าที่คุณต้องการ
            </h2>
            <p className="text-gray-600 mb-6 font-prompt">
              หน้าที่คุณกำลังหาอาจถูกย้าย ลบ หรือไม่มีอยู่จริง
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="btn-primary inline-block text-center px-6 py-3 rounded-lg font-prompt"
            >
              กลับหน้าแรก
            </Link>

            <Link
              href="/all-cars"
              className="btn-secondary inline-block text-center px-6 py-3 rounded-lg ml-4 font-prompt"
            >
              ดูรถทั้งหมด
            </Link>

            <div>
              <Link
                href="/contact"
                className="btn-primary inline-block text-center px-6 py-3 rounded-lg ml-4 font-prompt"
              >
                ติดต่อเรา
              </Link>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>หรือค้นหารถที่คุณต้องการ:</p>
            <div className="mt-4 space-x-2">
              <Link href="/all-cars?search=Toyota" className="text-primary hover:underline">
                Toyota
              </Link>
              <span>•</span>
              <Link href="/all-cars?search=Honda" className="text-primary hover:underline">
                Honda
              </Link>
              <span>•</span>
              <Link href="/all-cars?search=Nissan" className="text-primary hover:underline">
                Nissan
              </Link>
              <span>•</span>
              <Link href="/all-cars?search=Mazda" className="text-primary hover:underline">
                Mazda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
