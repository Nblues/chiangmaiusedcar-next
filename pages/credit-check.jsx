import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import dynamic from 'next/dynamic';

// Dynamic import reCAPTCHA to prevent hydration mismatch
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
  ssr: false,
  loading: () => <div className="h-16 flex items-center justify-center">Loading reCAPTCHA...</div>,
});

// ใส่ Site Key ที่ได้จากการสมัคร reCAPTCHA
const RECAPTCHA_SITEKEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LevqZkrAAAAAPAsPmJk_qUo6kGlvGsy2xdvvL1A';

export default function CreditCheck() {
  const formRef = useRef();
  const [career, setCareer] = useState('');
  const [downOption, setDownOption] = useState('');
  const [showDownInput, setShowDownInput] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [sending, setSending] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const careerText = {
    government: 'ข้าราชการ',
    company: 'พนักงานบริษัท',
    freelance: 'ฟรีแลนซ์',
    business: 'เจ้าของกิจการ',
    farmer: 'เกษตรกร',
    other: 'อื่นๆ',
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!captcha) {
      return Swal.fire('กรุณายืนยัน reCAPTCHA', '', 'warning');
    }

    setSending(true);
    Swal.fire({
      title: 'กำลังตรวจสอบข้อมูล...',
      allowOutsideClick: false,
      didOpen: Swal.showLoading,
    });

    try {
      // Verify reCAPTCHA first
      const recaptchaResponse = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: captcha }),
      });

      const recaptchaData = await recaptchaResponse.json();

      if (!recaptchaData.success) {
        throw new Error('reCAPTCHA verification failed');
      }

      // Set hidden field values
      formRef.current.careerText.value = careerText[career];
      formRef.current.downOptionText.value = downOption;
      formRef.current.submittedAt.value = new Date().toLocaleString('th-TH');

      // Send email
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_qlcksif',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_zd6e3f6',
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'P3wnNJB_Y_PddrdBJ'
      );

      Swal.fire({
        icon: 'success',
        title: 'ส่งข้อมูลเรียบร้อยแล้ว',
        text: 'ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
        confirmButtonText: 'ตกลง',
      });

      // Reset form
      formRef.current.reset();
      setCareer('');
      setDownOption('');
      setShowDownInput(false);
      setCaptcha(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่',
        confirmButtonText: 'ตกลง',
      });
      console.error('เกิดข้อผิดพลาด', error);
    } finally {
      setSending(false);
    }
  };

  const handleCareerChange = e => {
    setCareer(e.target.value);
  };

  const handleDownOptionChange = e => {
    const value = e.target.value;
    setDownOption(value);
    setShowDownInput(value === 'วางเงินดาวน์');
  };

  return (
    <>
      <SEO
        title="ประเมินไฟแนนซ์รถยนต์ออนไลน์ - ครูหนึ่งรถสวย | เช็คเครดิตฟรี อนุมัติง่าย รู้ผลเร็ว"
        description="ประเมินไฟแนนซ์รถมือสองฟรี 100% ไม่ต้องค้ำ อนุมัติง่าย รู้ผลเร็ว ครูหนึ่งรถสวยเชียงใหม่ ให้บริการประเมินเครดิตรถยนต์ครบวงจร"
        keywords="ประเมินไฟแนนซ์รถยนต์, เช็คเครดิตรถมือสอง, อนุมัติรถยนต์, ไฟแนนซ์รถเชียงใหม่, เครดิตรถยนต์, ครูหนึ่งรถสวย, ฟรีดาวน์, ผ่อนรถ"
        url="/credit-check"
        image="/cover.jpg"
        canonical="https://chiangmaiusedcar.com/credit-check"
        locale="th_TH"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'ประเมินไฟแนนซ์รถยนต์',
          description: 'บริการประเมินเครดิตรถยนต์ฟรี อนุมัติง่าย รู้ผลเร็ว',
          provider: {
            '@type': 'Organization',
            name: 'ครูหนึ่งรถสวย',
            url: 'https://chiangmaiusedcar.com',
          },
          areaServed: 'เชียงใหม่',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'THB',
          },
        }}
      />

      <main className="min-h-screen bg-gray-50 py-4 px-4 font-prompt">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-success mb-2">
              แบบฟอร์มประเมินไฟแนนซ์รถยนต์
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              ประเมินฟรี 100% • รู้ผลเร็ว • อนุมัติง่าย • ไม่ต้องค้ำ
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Hidden fields */}
              <input type="hidden" name="careerText" />
              <input type="hidden" name="downOptionText" />
              <input type="hidden" name="submittedAt" />

              {/* ข้อมูลทั่วไป */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-input"
                    placeholder="เช่น นายสมชาย ใจดี"
                  />
                </div>

                <div>
                  <label className="form-label">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    name="phone"
                    pattern="[0-9]{10}"
                    placeholder="เช่น 0812345678"
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">เพศ *</label>
                  <select name="gender" required className="form-select">
                    <option value="">-- เลือกเพศ --</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">อายุ *</label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="18"
                    max="80"
                    className="form-input"
                    placeholder="เช่น 30"
                  />
                </div>
              </div>

              {/* อาชีพ */}
              <div>
                <label className="form-label">อาชีพ *</label>
                <select
                  name="career"
                  value={career}
                  onChange={handleCareerChange}
                  required
                  className="form-select"
                >
                  <option value="">-- เลือกอาชีพ --</option>
                  <option value="government">ข้าราชการ</option>
                  <option value="company">พนักงานบริษัท</option>
                  <option value="freelance">ฟรีแลนซ์</option>
                  <option value="business">เจ้าของกิจการ</option>
                  <option value="farmer">เกษตรกร</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              {/* Career-specific fields */}
              {career && (
                <div className="form-section-government bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    ข้อมูลเพิ่มเติม - {careerText[career]}
                  </h3>

                  {career === 'government' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">หน่วยงานที่ทำงาน</label>
                        <input type="text" name="govAgency" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">ตำแหน่ง</label>
                        <input type="text" name="govPosition" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">อายุราชการ (ปี)</label>
                        <input type="number" name="govYears" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">รายได้ต่อเดือน (บาท)</label>
                        <input type="number" name="govIncome" className="form-input" />
                      </div>
                    </div>
                  )}

                  {career === 'company' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">บริษัทที่ทำงาน</label>
                        <input type="text" name="companyName" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">ตำแหน่ง</label>
                        <input type="text" name="companyPosition" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">อายุงาน (ปี)</label>
                        <input type="number" name="companyYears" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">รายได้ต่อเดือน (บาท)</label>
                        <input type="number" name="companyIncome" className="form-input" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="form-label">ประเภทเอกสารรายได้</label>
                        <select name="companySalaryProof" className="form-select">
                          <option value="">-- เลือกประเภท --</option>
                          <option value="มีสลิปเงินเดือน">มีสลิปเงินเดือน</option>
                          <option value="หนังสือรับรองเงินเดือน">หนังสือรับรองเงินเดือน</option>
                          <option value="รับเงินสด">รับเงินสด</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {career === 'freelance' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">สาขางานที่ทำ</label>
                        <input type="text" name="freelanceField" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">อายุงาน (ปี)</label>
                        <input type="number" name="freelanceYears" className="form-input" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="form-label">รายได้ต่อเดือน (บาท)</label>
                        <input type="number" name="freelanceIncome" className="form-input" />
                      </div>
                    </div>
                  )}

                  {career === 'business' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">ชื่อกิจการ</label>
                        <input type="text" name="businessName" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">อายุกิจการ (ปี)</label>
                        <input type="number" name="businessYears" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">รายได้ต่อเดือน (บาท)</label>
                        <input type="number" name="businessIncome" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">ทะเบียนพาณิชย์</label>
                        <select name="businessLicense" className="form-select">
                          <option value="">-- มีทะเบียนพาณิชย์ไหม --</option>
                          <option value="มี">มี</option>
                          <option value="ไม่มี">ไม่มี</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {career === 'farmer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">ประเภทการเกษตร</label>
                        <input type="text" name="farmType" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">จำนวนไร่</label>
                        <input type="number" name="farmArea" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">รายได้ต่อปี (บาท)</label>
                        <input type="number" name="farmIncome" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">สมุดเกษตรกร</label>
                        <select name="farmerBook" className="form-select">
                          <option value="">-- มีสมุดเกษตรกรไหม --</option>
                          <option value="มี">มี</option>
                          <option value="ไม่มี">ไม่มี</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {career === 'other' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">ระบุอาชีพ</label>
                        <input type="text" name="otherCareer" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">รายได้ต่อเดือน (บาท)</label>
                        <input type="number" name="otherIncome" className="form-input" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ข้อมูลเพิ่มเติม */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">จังหวัดที่อาศัย *</label>
                  <input
                    type="text"
                    name="province"
                    required
                    className="form-input"
                    placeholder="เช่น เชียงใหม่"
                  />
                </div>

                <div>
                  <label className="form-label">สถานะเครดิต *</label>
                  <select name="creditStatus" required className="form-select">
                    <option value="">-- เลือกสถานะเครดิต --</option>
                    <option value="มีเครดิต">มีเครดิต</option>
                    <option value="ไม่มีเครดิต">ไม่มีเครดิต</option>
                    <option value="ติดบูโร">ติดบูโร</option>
                  </select>
                </div>
              </div>

              {/* เงินดาวน์ */}
              <div>
                <label className="form-label">เงินดาวน์ *</label>
                <select
                  name="downOption"
                  value={downOption}
                  onChange={handleDownOptionChange}
                  required
                  className="form-select"
                >
                  <option value="">-- เลือกรูปแบบเงินดาวน์ --</option>
                  <option value="ฟรีดาวน์">ฟรีดาวน์</option>
                  <option value="วางเงินดาวน์">วางเงินดาวน์</option>
                </select>
              </div>

              {showDownInput && (
                <div>
                  <label className="form-label">จำนวนเงินวางดาวน์ (บาท)</label>
                  <input
                    type="number"
                    name="customDown"
                    className="form-input"
                    placeholder="เช่น 50000"
                  />
                </div>
              )}

              {/* reCAPTCHA */}
              {isClient && RECAPTCHA_SITEKEY && (
                <div className="flex justify-center">
                  <ReCAPTCHA sitekey={RECAPTCHA_SITEKEY} onChange={setCaptcha} />
                </div>
              )}

              {/* Message if reCAPTCHA is not available */}
              {isClient && !RECAPTCHA_SITEKEY && (
                <div className="flex justify-center">
                  <p className="text-red-600">
                    reCAPTCHA is not configured. Please contact support.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 rounded-xl font-bold text-white bg-success hover:bg-success/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {sending ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังส่งข้อมูล...
                  </span>
                ) : (
                  'ส่งข้อมูล'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 text-center space-y-4">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/all-cars" className="btn-primary">
                  ดูรถทั้งหมด
                </Link>
                <Link href="/payment-calculator" className="btn-secondary">
                  คำนวนค่างวด
                </Link>
              </div>

              <p className="text-sm text-gray-600">
                หรือติดต่อโดยตรง:
                <a
                  href="https://lin.ee/8ugfzstD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent ml-1"
                >
                  LINE @ครูหนึ่งรถสวย
                </a>
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">คำถามที่พบบ่อย</h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-xl shadow-md">
                <summary className="font-semibold text-accent cursor-pointer hover:text-accent-700">
                  Q: ประเมินไฟแนนซ์ฟรีจริงหรือไม่?
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  ฟรี 100% ไม่มีค่าใช้จ่ายใดๆ ไม่บังคับซื้อรถ รู้ผลทันที ทีมงานมีประสบการณ์กว่า 10
                  ปี
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-md">
                <summary className="font-semibold text-accent cursor-pointer hover:text-accent-700">
                  Q: ใช้เวลานานแค่ไหนถึงจะรู้ผล?
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  ภายใน 24 ชั่วโมง ทีมงานจะติดต่อกลับพร้อมผลการประเมินและแนะนำรถที่เหมาะสม
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-md">
                <summary className="font-semibold text-accent cursor-pointer hover:text-accent-700">
                  Q: ถ้าเครดิตไม่ผ่านจะมีทางเลือกอื่นไหม?
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  มี! เรามีรถราคาถูกที่ไม่ต้องใช้ไฟแนนซ์ หรือสามารถหาผู้ค้ำประกันให้ได้
                </p>
              </details>

              <details className="bg-white p-6 rounded-xl shadow-md">
                <summary className="font-semibold text-accent cursor-pointer hover:text-accent-700">
                  Q: รถที่ขายมีรับประกันไหม?
                </summary>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  รับประกันเครื่องยนต์ เกียร์ 3 เดือน และมีบริการฟรีตรวจเช็คระยะเปลี่ยนน้ำมันเครื่อง
                </p>
              </details>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
