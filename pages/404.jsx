import Link from 'next/link';
import SEO from '../components/SEO';

export default function Custom404() {
  return (
    <>
      <SEO
        title="ไม่พบหน้าที่ต้องการ - ครูหนึ่งรถสวย"
        description="ขออภัย ไม่พบหน้าที่คุณต้องการ กลับไปหน้าแรกเพื่อดูรถมือสองเชียงใหม่"
        url="https://chiangmaiusedcar.com/404"
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="max-w-md w-full mx-auto text-center p-8">
          <div className="mb-8">
            <h1 className="text-8xl font-bold text-orange-600 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-prompt">
              ไม่พบหน้าที่ต้องการ
            </h2>
            <p className="text-gray-600 mb-8 font-prompt">
              ขออภัย หน้าที่คุณต้องการหาไม่มีอยู่ หรืออาจถูกย้ายแล้ว
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 font-prompt"
            >
              กลับหน้าแรก
            </Link>

            <div className="text-sm text-gray-500 font-prompt">หรือ</div>

            <Link
              href="/all-cars"
              className="inline-block border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 font-prompt"
            >
              ดูรถทั้งหมด
            </Link>
          </div>

          <div className="mt-12 text-sm text-gray-500 font-prompt">
            <p>ต้องการความช่วยเหลือ?</p>
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              ติดต่อเราผ่าน LINE
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
