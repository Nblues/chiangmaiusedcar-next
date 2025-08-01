import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import Link from 'next/link';

export default function CreditCheck() {
  // โหลด EmailJS และ SweetAlert2 เฉพาะฝั่ง client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // EmailJS
      const scriptEmail = document.createElement('script');
      scriptEmail.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@2.3.2/dist/email.min.js';
      scriptEmail.onload = () => window.emailjs?.init('P3wnNJB_Y_PddrdBJ');
      document.body.appendChild(scriptEmail);

      // SweetAlert2
      const scriptSwal = document.createElement('script');
      scriptSwal.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      document.body.appendChild(scriptSwal);
    }
  }, []);

  // ฟังก์ชันจัดการฟอร์ม
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.toggleCareerFields = function () {
      const career = document.getElementById('career').value;
      document.querySelectorAll('#careerFields > div').forEach(div => div.classList.add('hidden'));
      document.getElementById('careerFields').classList.toggle('hidden', career === '');

      if (career) {
        const fieldId = career + 'Fields';
        const fieldDiv = document.getElementById(fieldId);
        if (fieldDiv) fieldDiv.classList.remove('hidden');
      }

      // ตั้งชื่อภาษาไทยให้ careerText
      const careerText = {
        government: 'ข้าราชการ',
        company: 'พนักงานบริษัท',
        freelance: 'ฟรีแลนซ์',
        business: 'เจ้าของกิจการ',
        farmer: 'เกษตรกร',
        other: 'อื่นๆ',
      };
      document.getElementById('careerText').value = careerText[career] || '';
    };

    window.toggleDownPayment = function () {
      const downOption = document.getElementById('downOption').value;
      document
        .getElementById('customDownContainer')
        .classList.toggle('hidden', downOption !== 'วางเงินดาวน์');
      document.getElementById('downOptionText').value = downOption;
    };

    const form = document.getElementById('financeForm');
    if (form) {
      form.onsubmit = function (e) {
        e.preventDefault();
        const now = new Date();
        const submittedAt = now.toLocaleDateString('th-TH') + ' ' + now.toLocaleTimeString('th-TH');
        document.getElementById('submittedAt').value = submittedAt;

        window.emailjs.sendForm('service_qlcksif', 'template_zd6e3f6', form).then(
          () => {
            window.Swal.fire({
              icon: 'success',
              title: 'ส่งข้อมูลเรียบร้อยแล้ว',
              text: 'ขอบคุณที่กรอกข้อมูลค่ะ',
              confirmButtonText: 'ตกลง',
            });
            form.reset();
            document.getElementById('careerFields').classList.add('hidden');
            document.getElementById('customDownContainer').classList.add('hidden');
          },
          error => {
            window.Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่',
            });
            // eslint-disable-next-line no-console
            console.error('เกิดข้อผิดพลาด', error);
          },
        );
      };
    }
  }, []);

  return (
    <React.Fragment>
      <SEO
        title="เช็คเครดิต - ตรวจสอบสถานะสินเชื่อรถยนต์มือสอง เชียงใหม่ | ประเมินไฟแนนซ์ฟรี ครูหนึ่งรถสวย"
        description="เช็คเครดิตรถมือสอง เชียงใหม่ อนุมัติง่าย | ครูหนึ่งรถสวย"
        keywords="เช็คเครดิต, ตรวจสอบเครดิต, สินเชื่อรถยนต์, ไฟแนนซ์รถมือสอง, เครดิตบูโร, เชียงใหม่, ประเมินไฟแนนซ์, รถบ้าน, ฟรีดาวน์, ดอกเบี้ยต่ำ, อนุมัติไว, รถมือสองเชียงใหม่"
      />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* ...other sections... */}
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">พร้อมเช็คเครดิตแล้วใช่ไหม?</h2>
            <p className="text-xl text-brand-200 mb-8">
              รับคำปรึกษาฟรี จากผู้เชี่ยวชาญด้านสินเชื่อ พร้อมแนะนำรถที่เหมาะกับงบของคุณ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://lin.ee/cJuakxZ"
                target="_blank"
                className="bg-success-500 hover:bg-success-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                <span>เช็คเครดิตเลย</span>
              </a>
              <Link
                href="/all-cars"
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                ดูรถทั้งหมด
              </Link>
            </div>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
}
