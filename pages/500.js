import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>เกิดข้อผิดพลาดของระบบ - ครูหนึ่งรถสวย</title>
        <meta
          name="description"
          content="ขออภัย ระบบเกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือกลับไปหน้าแรก"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-5xl font-bold text-primary/30 mb-3 font-prompt">500</h1>
          <h2 className="text-2xl font-semibold text-primary mb-2 font-prompt">
            เกิดข้อผิดพลาดของระบบ
          </h2>
          <p className="text-gray-600 mb-6 font-prompt">กรุณาลองใหม่อีกครั้ง หรือกลับไปหน้าแรก</p>

          <div className="space-y-4">
            <Link
              href="/"
              className="btn-primary inline-block text-center px-6 py-3 rounded-lg font-prompt"
            >
              กลับหน้าแรก
            </Link>

            <div>
              <Link
                href="/all-cars"
                className="btn-secondary inline-block text-center px-6 py-3 rounded-lg font-prompt"
              >
                ดูรถทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
