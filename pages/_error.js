import React from 'react';
import Link from 'next/link';

function Error({ statusCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-400 mb-4">
            {statusCode ? statusCode : 'Client Error'}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            {statusCode ? `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์` : 'เกิดข้อผิดพลาดในเบราว์เซอร์'}
          </h2>
          <p className="text-gray-600 mb-6">
            {statusCode === 404 ? 'ไม่พบหน้าที่คุณต้องการ' : 'ขออภัย เกิดข้อผิดพลาดบางอย่าง'}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            กลับหน้าแรก
          </Link>

          <div>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors ml-4"
            >
              รีเฟรชหน้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
