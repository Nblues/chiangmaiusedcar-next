import React from 'react';
import Link from 'next/link';

export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
      <div className="text-center p-8 max-w-md">
        <div className="mb-8">
          <div className="text-8xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">500</h1>
          <h2 className="text-xl font-semibold text-gray-600 mb-4">เกิดข้อผิดพลาดจากเซิร์ฟเวอร์</h2>
          <p className="text-gray-500 mb-6">
            ขออภัย เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
          >
            ลองใหม่อีกครั้ง
          </button>

          <Link
            href="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
          >
            กลับหน้าแรก
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>หากปัญหายังคงมีอยู่ กรุณาติดต่อเรา</p>
          <p>โทร: 094-064-9018</p>
        </div>
      </div>
    </div>
  );
}
