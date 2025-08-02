import SEO from '../components/SEO';

export default function Promotion() {
  return (
    <>
      <SEO title="โปรโมชั่น ฟรีดาวน์ ผ่อนถูก" />
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-text-primary">โปรโมชั่น ฟรีดาวน์ ผ่อนถูก</h1>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-3 text-text-primary">โปรโมชั่นพิเศษประจำเดือน</h2>
          <div className="space-y-4 text-text-secondary">
            <p>🚗 <strong className="text-text-primary">ฟรีดาวน์</strong> สำหรับรถยนต์ที่ผ่อนได้</p>
            <p>💰 <strong className="text-text-primary">ดอกเบี้ยพิเศษ</strong> เริ่มต้น 0.99% ต่อเดือน</p>
            <p>📋 <strong className="text-text-primary">อนุมัติง่าย</strong> เอกสารน้อย อนุมัติเร็ว</p>
            <p>🎯 <strong className="text-text-primary">รับประกันคุณภาพ</strong> รถคุณภาพดี ตรวจสภาพแล้ว</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="https://lin.ee/cJuakxZ" className="btn-success text-center">
              สอบถามโปรโมชั่นผ่าน LINE
            </a>
            <a href="tel:+66940649018" className="btn-primary text-center">
              โทรสอบถาม 094-064-9018
            </a>
          </div>
        </div>
        <div className="mt-6 text-text-muted text-sm">
          <p>*เงื่อนไขขึ้นอยู่กับการอนุมัติของสถาบันการเงิน</p>
          <p>*อัปเดตโปรโมชั่นไฟแนนซ์ ดอกเบี้ยพิเศษทุกสัปดาห์</p>
        </div>
      </main>
    </>
  );
}
