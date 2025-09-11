import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import SEO from '../components/SEO';

function Error({ statusCode }) {
  return (
    <>
      <SEO
        title={`ข้อผิดพลาด ${statusCode || 'ไม่ทราบสาเหตุ'} - ครูหนึ่งรถสวย`}
        description={`เกิดข้อผิดพลาด ${statusCode === 404 ? 'ไม่พบหน้าที่ต้องการ' : 'จากระบบ'} กรุณาลองใหม่อีกครั้ง หรือกลับไปหน้าแรก`}
        url="/error"
        image="/herobanner/error-page.webp"
      />
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-primary/30 mb-4 font-prompt">
              {statusCode ? statusCode : '❌'}
            </h1>
            <h2 className="text-2xl font-semibold text-primary mb-2 font-prompt">
              {statusCode ? `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์` : 'เกิดข้อผิดพลาดในเบราว์เซอร์'}
            </h2>
            <p className="text-gray-600 mb-6 font-prompt">
              {statusCode === 404 ? 'ไม่พบหน้าที่คุณต้องการ' : 'ขออภัย เกิดข้อผิดพลาดบางอย่าง'}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors font-prompt"
            >
              🏠 กลับหน้าแรก
            </Link>

            <div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-block bg-accent hover:bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors ml-4 font-prompt"
              >
                🔄 รีเฟรชหน้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
