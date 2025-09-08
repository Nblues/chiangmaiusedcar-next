import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

export default function CreditCheck() {
  const formRef = useRef();
  const [career, setCareer] = useState('');
  const [downOption, setDownOption] = useState('');
  const [showDownInput, setShowDownInput] = useState(false);
  const [sending, setSending] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Prevent hydration mismatch (kept for other dynamic content)
  useEffect(() => {
    // Any other initialization logic can go here
  }, []);

  const careerText = {
    government: 'ข้าราชการ',
    company: 'พนักงานบริษัท',
    freelance: 'ฟรีแลนซ์',
    business: 'เจ้าของกิจการ',
    farmer: 'เกษตรกร',
    other: 'อื่นๆ',
  };

  function sanitizeForm(form) {
    const elements = Array.from(form.elements);
    elements.forEach(el => {
      if (!el || !('name' in el)) return;
      const tag = el.tagName?.toLowerCase();
      const type = (el.getAttribute?.('type') || '').toLowerCase();
      // Trim text-like inputs
      if (tag === 'input' && (type === 'text' || type === 'tel' || type === 'number')) {
        if (typeof el.value === 'string') el.value = el.value.trim();
        if (type === 'tel') el.value = el.value.replace(/[^0-9]/g, '').slice(0, 10);
      }
      if (tag === 'input' && type === 'number') {
        // Clamp to reasonable range
        if (el.name?.toLowerCase().includes('age')) {
          const n = parseInt(el.value || '');
          if (!Number.isFinite(n)) el.value = '';
          else el.value = String(Math.min(80, Math.max(18, n)));
        }
      }
      if (tag === 'textarea' || tag === 'select') {
        if (typeof el.value === 'string') el.value = el.value.trim();
      }
    });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (sending) return;

    // Honeypot: if filled, likely bot
    if (honeypot && honeypot.trim().length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถส่งข้อมูลได้',
        text: 'โปรดลองใหม่อีกครั้ง',
      });
      return;
    }

    setSending(true);
    Swal.fire({
      title: 'กำลังตรวจสอบข้อมูล...',
      html: '<div class="swal2-loader"><div></div><div></div><div></div></div>',
      allowOutsideClick: false,
      showConfirmButton: false,
      customClass: {
        loader: 'custom-loader',
      },
    });

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS environment variables are not configured');
      }

      // Sanitize and enrich form data
      sanitizeForm(formRef.current);
      formRef.current.careerText.value = careerText[career];
      formRef.current.downOptionText.value = downOption;
      formRef.current.submittedAt.value = new Date().toLocaleString('th-TH');

      // Send email
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);

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
        title="เช็คเครดิตก่อนซื้อรถ รู้เงื่อนไขดีที่สุด - ครูหนึ่งรถสวย | ประเมินฟรี รู้ผลเร็ว"
        description="เช็คเครดิตก่อนซื้อรถฟรี รู้ดอกเบี้ยและเงื่อนไขล่วงหน้า ครูหนึ่งรถสวยเชียงใหม่ ให้บริการประเมินเครดิตรถยนต์ครบวงจร เครดิตดีได้ดอกเบี้ยต่ำ"
        keywords="เช็คเครดิตรถยนต์, ประเมินเครดิตก่อนซื้อรถ, ดอกเบี้ยรถยนต์, เงื่อนไขไฟแนนซ์, ครูหนึ่งรถสวย, เครดิตดี, ผ่อนรถเชียงใหม่"
        url="/credit-check"
        image="/cover.jpg"
        canonical="https://chiangmaiusedcar.com/credit-check"
        locale="th_TH"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'เช็คเครดิตรถยนต์',
          description: 'บริการเช็คเครดิตก่อนซื้อรถฟรี รู้เงื่อนไขล่วงหน้า',
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

      <main className="min-h-screen bg-gray-50 py-8 px-4 font-prompt">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-primary to-primary-600 text-white rounded-2xl p-8 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-accent">เช็คเครดิตก่อนซื้อรถ</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-4">
                รู้เงื่อนไขล่วงหน้า • ดอกเบี้ยต่ำสำหรับเครดิตดี • เช็คฟรี • รู้ผลเร็ว
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 inline-block">
                <p className="text-sm">
                  💡 <strong>เครดิตดีได้สิทธิพิเศษ:</strong> ดอกเบี้ยต่ำสุด ผ่อนยาวสูงสุด 84 เดือน
                </p>
              </div>
            </div>
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
                    maxLength={120}
                    inputMode="text"
                    autoComplete="name"
                    placeholder="เช่น นายสมชาย ใจดี"
                  />
                </div>

                <div>
                  <label className="form-label">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    name="phone"
                    pattern="0[0-9]{9}"
                    placeholder="เช่น 0812345678"
                    required
                    className="form-input"
                    inputMode="tel"
                    autoComplete="tel"
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
                    inputMode="numeric"
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
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-2xl border border-accent/20">
                  <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
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
                    maxLength={60}
                    autoComplete="address-level1"
                    placeholder="เช่น เชียงใหม่"
                  />
                </div>

                <div>
                  <label className="form-label">สถานะเครดิต *</label>
                  <select name="creditStatus" required className="form-select">
                    <option value="">-- เลือกสถานะเครดิต --</option>
                    <option value="เครดิตดีมาก">เครดิตดีมาก (AAA)</option>
                    <option value="เครดิตดี">เครดิตดี (AA-A)</option>
                    <option value="เครดิตปานกลาง">เครดิตปานกลาง (BBB-B)</option>
                    <option value="ไม่มีประวัติเครดิต">ไม่มีประวัติเครดิต</option>
                    <option value="ต้องการตรวจสอบ">ต้องการให้ตรวจสอบ</option>
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
                    min="0"
                    step="1000"
                    inputMode="numeric"
                    placeholder="เช่น 50000"
                  />
                </div>
              )}

              {/* Consent */}
              <div className="flex items-start gap-2">
                <input type="checkbox" name="privacyConsent" required className="mt-1" />
                <p className="text-sm text-gray-700">
                  ฉันยินยอมตาม{' '}
                  <Link href="/privacy-policy" className="text-primary hover:text-accent underline">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </p>
              </div>

              {/* Honeypot (anti-bot) */}
              <div className="hidden" aria-hidden="true">
                <label>
                  เว็บไซต์
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                    'ส่งข้อมูลเพื่อประเมินเครดิต'
                  )}
                </button>
              </div>
            </form>

            {/* Links */}
            <div className="mt-8 text-center space-y-6">
              {/* Credit Benefits Section */}
              <div className="bg-gradient-to-br from-gold/20 to-accent/20 border border-accent/30 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center justify-center gap-2">
                  <span className="text-2xl">🌟</span>
                  สิทธิพิเศษเครดิตดี
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                    <div className="font-bold text-primary text-lg">ดอกเบี้ยต่ำสุด</div>
                    <div className="text-gray-700">เครดิตดี</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-accent/10">
                    <div className="font-bold text-accent text-lg">ผ่อนยาวสุด</div>
                    <div className="text-gray-700">84 เดือน</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gold/20">
                    <div className="font-bold text-gold text-lg">อนุมัติเร็ว</div>
                    <div className="text-gray-700">ภายใน 1 วัน</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                    <div className="font-bold text-primary text-lg">ไม่ต้องค้ำ</div>
                    <div className="text-gray-700">สำหรับเครดิต AAA</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/all-cars"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 8l-2-2-2 2"
                    />
                  </svg>
                  ดูรถทั้งหมด
                </Link>
                <Link
                  href="/payment-calculator"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  คำนวนค่างวด
                </Link>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-primary/10">
                <p className="text-gray-700 mb-4">หรือติดต่อโดยตรง:</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href="https://lin.ee/8ugfzstD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.630.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.630 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12.017.572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    สอบถามเลย LINE
                  </a>
                  <a
                    href="tel:0940649018"
                    className="btn-secondary inline-flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    โทร 094-064-9018
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">คำถามที่พบบ่อย</h2>
              <p className="text-gray-600">ข้อมูลเพิ่มเติมที่คุณควรรู้</p>
            </div>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent flex items-center gap-2">
                  <span className="text-accent">Q:</span>
                  ประเมินไฟแนนซ์ฟรีจริงหรือไม่?
                </summary>
                <div className="mt-4 pl-6 border-l-4 border-accent/30">
                  <p className="text-gray-700 leading-relaxed">
                    ฟรี 100% ไม่มีค่าใช้จ่ายใดๆ ไม่บังคับซื้อรถ รู้ผลทันที ทีมงานมีประสบการณ์กว่า 10
                    ปี
                  </p>
                </div>
              </details>

              <details className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent flex items-center gap-2">
                  <span className="text-accent">Q:</span>
                  ใช้เวลานานแค่ไหนถึงจะรู้ผล?
                </summary>
                <div className="mt-4 pl-6 border-l-4 border-accent/30">
                  <p className="text-gray-700 leading-relaxed">
                    ภายใน 24 ชั่วโมง ทีมงานจะติดต่อกลับพร้อมผลการประเมินและแนะนำรถที่เหมาะสม
                  </p>
                </div>
              </details>

              <details className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent flex items-center gap-2">
                  <span className="text-accent">Q:</span>
                  เครดิตดีจะได้สิทธิพิเศษอะไรบ้าง?
                </summary>
                <div className="mt-4 pl-6 border-l-4 border-accent/30">
                  <p className="text-gray-700 leading-relaxed">
                    ดอกเบี้ยต่ำสุด, ผ่อนยาวสูงสุด 84 เดือน, อนุมัติเร็ว, ไม่ต้องค้ำประกัน
                    และเลือกรถได้มากกว่า
                  </p>
                </div>
              </details>

              <details className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent flex items-center gap-2">
                  <span className="text-accent">Q:</span>
                  รถที่ขายมีรับประกันไหม?
                </summary>
                <div className="mt-4 pl-6 border-l-4 border-accent/30">
                  <p className="text-gray-700 leading-relaxed">
                    รับประกันเครื่องยนต์ เกียร์ 3 เดือน
                    และมีบริการฟรีตรวจเช็คระยะเปลี่ยนน้ำมันเครื่อง
                  </p>
                </div>
              </details>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
