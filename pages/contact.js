import { useRef, useState } from 'react';
import SEO from '../components/SEO';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITEKEY = 'YOUR_RECAPTCHA_SITEKEY'; // ใส่ key ของตัวเอง

export default function CreditCheck() {
  const formRef = useRef();
  const [career, setCareer] = useState('');
  const [careerFields, setCareerFields] = useState('');
  const [downOption, setDownOption] = useState('');
  const [showDownInput, setShowDownInput] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [sending, setSending] = useState(false);

  const careerText = {
    government: 'ข้าราชการ',
    company: 'พนักงานบริษัท',
    freelance: 'ฟรีแลนซ์',
    business: 'เจ้าของกิจการ',
    farmer: 'เกษตรกร',
    other: 'อื่นๆ',
  };

  const onCaptchaChange = value => setCaptcha(value);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!captcha) {
      Swal.fire('กรุณายืนยัน reCAPTCHA ด้วย', '', 'warning');
      return;
    }

    formRef.current.careerText.value = careerText[career] || '';
    formRef.current.downOptionText.value = downOption;
    formRef.current.submittedAt.value = new Date().toLocaleString('th-TH');

    setSending(true);
    Swal.fire({
      title: 'กำลังส่งข้อมูล...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // ส่ง API กันสแปม/บันทึก log (optional, เพิ่มใน production)
      const formData = new FormData(formRef.current);
      formData.append('g-recaptcha-response', captcha);
      const res = await fetch('/api/credit-check', { method: 'POST', body: formData });
      const apiResult = await res.json();
      if (!apiResult.success) throw new Error(apiResult.message);

      // ส่ง EmailJS
      await emailjs.sendForm(
        'service_qlcksif',
        'template_zd6e3f6',
        formRef.current,
        'P3wnNJB_Y_PddrdBJ',
      );

      Swal.fire({
        icon: 'success',
        title: 'ส่งข้อมูลเรียบร้อยแล้ว',
        text: 'ทีมงานจะติดต่อกลับค่ะ',
      });
      formRef.current.reset();
      setCareer('');
      setCareerFields('');
      setDownOption('');
      setShowDownInput(false);
      setCaptcha(null);
    } catch (error) {
      Swal.fire('เกิดข้อผิดพลาด', error.message || 'ไม่สามารถส่งข้อมูลได้', 'error');
    } finally {
      setSending(false);
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: 'https://chiangmaiusedcar.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'เช็คเครดิต',
        item: 'https://chiangmaiusedcar.com/credit-check',
      },
    ],
  };
  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'เช็คไฟแนนซ์ออนไลน์ฟรีจริงมั้ย?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ฟรี 100% ไม่มีค่าใช้จ่าย ผลเบื้องต้นรู้ทันที ไม่บังคับซื้อรถ.',
        },
      },
      {
        '@type': 'Question',
        name: 'ข้อมูลที่กรอกจะปลอดภัยมั้ย?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ข้อมูลลูกค้าเป็นความลับ 100% ไม่เผยแพร่และไม่กระทบเครดิต.',
        },
      },
      {
        '@type': 'Question',
        name: 'ใช้เวลากี่วันรู้ผล?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ส่วนใหญ่รู้ผลเบื้องต้นทันที ถ้าเอกสารครบ ภายใน 1-3 ชม.',
        },
      },
      {
        '@type': 'Question',
        name: 'ติดบูโรหรือผ่อนสินค้าอยู่ ยื่นได้มั้ย?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ยื่นได้ ทีมงานจะช่วยประเมินฟรี และหาทางออกให้.',
        },
      },
      {
        '@type': 'Question',
        name: 'ต้องใช้เอกสารอะไรบ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สำเนาบัตรประชาชน, สลิปเงินเดือน/หนังสือรับรอง, สมุดบัญชีธนาคาร ย้อนหลัง 6 เดือน.',
        },
      },
    ],
  };

  return (
    <>
      <SEO
        title="เช็คเครดิตฟรี ประเมินไฟแนนซ์รถยนต์ | ครูหนึ่งรถสวย"
        description="เช็คเครดิตรถมือสอง อนุมัติง่าย ฟรี ผ่อนถูก ไม่ต้องค้ำ รู้ผลเร็ว ครูหนึ่งรถสวย เชียงใหม่"
        url="https://chiangmaiusedcar.com/credit-check"
        image="https://chiangmaiusedcar.com/cover.jpg"
        canonical="https://chiangmaiusedcar.com/credit-check"
        locale="th_TH"
        alternate={[{ href: 'https://chiangmaiusedcar.com/credit-check', hrefLang: 'th-TH' }]}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/logo.webp" alt="โลโก้ครูหนึ่งรถสวย" className="h-14 w-auto" loading="lazy" />
      </div>

      <main className="min-h-screen py-6 bg-gray-50">
        <div className="bg-white max-w-2xl mx-auto p-4 md:p-8 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-6 text-green-600">
            แบบฟอร์มประเมินไฟแนนซ์รถยนต์
          </h2>
          <form ref={formRef} id="financeForm" onSubmit={handleSubmit} autoComplete="off">
            <input type="hidden" name="careerText" />
            <input type="hidden" name="downOptionText" />
            <input type="hidden" name="submittedAt" />

            <div className="mb-2">
              <label className="font-semibold">ชื่อ-นามสกุล</label>
              <input
                type="text"
                name="name"
                required
                className="form-input mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                name="phone"
                pattern="[0-9]{10}"
                placeholder="เช่น 0812345678"
                required
                className="form-input mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">เพศ</label>
              <select
                name="gender"
                required
                className="form-input mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="">-- เลือกเพศ --</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="font-semibold">อายุ</label>
              <input
                type="number"
                name="age"
                required
                className="form-input mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">อาชีพ</label>
              <select
                id="career"
                name="career"
                value={career}
                onChange={e => {
                  setCareer(e.target.value);
                  setCareerFields(e.target.value);
                }}
                required
                className="form-input mt-1 block w-full rounded-md border-gray-300"
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

            {/* เงื่อนไขอาชีพ */}
            {careerFields === 'government' && (
              <div className="bg-green-50 rounded-xl p-3 mb-2">
                <label>หน่วยงานที่ทำงาน</label>
                <input type="text" name="govAgency" className="form-input" />
                <label>ตำแหน่ง</label>
                <input type="text" name="govPosition" className="form-input" />
                <label>อายุราชการ (ปี)</label>
                <input type="number" name="govYears" className="form-input" />
                <label>รายได้ต่อเดือน (บาท)</label>
                <input type="number" name="govIncome" className="form-input" />
              </div>
            )}
            {careerFields === 'company' && (
              <div className="bg-blue-50 rounded-xl p-3 mb-2">
                <label>บริษัทที่ทำงาน</label>
                <input type="text" name="companyName" className="form-input" />
                <label>ตำแหน่ง</label>
                <input type="text" name="companyPosition" className="form-input" />
                <label>อายุงาน (ปี)</label>
                <input type="number" name="companyYears" className="form-input" />
                <label>รายได้ต่อเดือน (บาท)</label>
                <input type="number" name="companyIncome" className="form-input" />
                <label>ประเภทเอกสารรายได้</label>
                <select name="companySalaryProof" className="form-input">
                  <option value="">-- เลือกประเภท --</option>
                  <option value="มีสลิปเงินเดือน">มีสลิปเงินเดือน</option>
                  <option value="หนังสือรับรองเงินเดือน">หนังสือรับรองเงินเดือน</option>
                  <option value="รับเงินสด">รับเงินสด</option>
                </select>
              </div>
            )}
            {careerFields === 'freelance' && (
              <div className="bg-yellow-50 rounded-xl p-3 mb-2">
                <label>สาขางานที่ทำ</label>
                <input type="text" name="freelanceField" className="form-input" />
                <label>อายุงาน (ปี)</label>
                <input type="number" name="freelanceYears" className="form-input" />
                <label>รายได้ต่อเดือน (บาท)</label>
                <input type="number" name="freelanceIncome" className="form-input" />
              </div>
            )}
            {careerFields === 'business' && (
              <div className="bg-orange-50 rounded-xl p-3 mb-2">
                <label>ชื่อกิจการ</label>
                <input type="text" name="businessName" className="form-input" />
                <label>อายุกิจการ (ปี)</label>
                <input type="number" name="businessYears" className="form-input" />
                <label>รายได้ต่อเดือน (บาท)</label>
                <input type="number" name="businessIncome" className="form-input" />
                <label>ทะเบียนพาณิชย์</label>
                <select name="businessLicense" className="form-input">
                  <option value="">-- มีทะเบียนพาณิชย์ไหม --</option>
                  <option value="มี">มี</option>
                  <option value="ไม่มี">ไม่มี</option>
                </select>
              </div>
            )}
            {careerFields === 'farmer' && (
              <div className="bg-lime-50 rounded-xl p-3 mb-2">
                <label>ประเภทการเกษตร</label>
                <input type="text" name="farmType" className="form-input" />
                <label>จำนวนไร่</label>
                <input type="number" name="farmArea" className="form-input" />
                <label>รายได้ต่อปี (บาท)</label>
                <input type="number" name="farmIncome" className="form-input" />
                <label>สมุดเกษตรกร</label>
                <select name="farmerBook" className="form-input">
                  <option value="">-- มีสมุดเกษตรกรไหม --</option>
                  <option value="มี">มี</option>
                  <option value="ไม่มี">ไม่มี</option>
                </select>
              </div>
            )}
            {careerFields === 'other' && (
              <div className="bg-gray-100 rounded-xl p-3 mb-2">
                <label>ระบุอาชีพ</label>
                <input type="text" name="otherCareer" className="form-input" />
                <label>รายได้ต่อเดือน (บาท)</label>
                <input type="number" name="otherIncome" className="form-input" />
              </div>
            )}

            <div className="mb-2">
              <label className="font-semibold">จังหวัดที่อาศัย</label>
              <input
                type="text"
                name="province"
                required
                className="form-input mt-1 block w-full rounded-md border-gray-300"
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">สถานะเครดิต</label>
              <select
                name="creditStatus"
                required
                className="form-input mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="">-- เลือกสถานะเครดิต --</option>
                <option value="มีเครดิต">มีเครดิต</option>
                <option value="ไม่มีเครดิต">ไม่มีเครดิต</option>
                <option value="ติดบูโร">ติดบูโร</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="font-semibold">เงินดาวน์</label>
              <select
                id="downOption"
                name="downOption"
                value={downOption}
                onChange={e => {
                  setDownOption(e.target.value);
                  setShowDownInput(e.target.value === 'วางเงินดาวน์');
                }}
                required
                className="form-input mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="">-- เลือกรูปแบบเงินดาวน์ --</option>
                <option value="ฟรีดาวน์">ฟรีดาวน์</option>
                <option value="วางเงินดาวน์">วางเงินดาวน์</option>
              </select>
            </div>
            {showDownInput && (
              <div className="mb-2">
                <label>จำนวนเงินวางดาวน์ (บาท)</label>
                <input
                  type="number"
                  name="customDown"
                  className="form-input mt-1 block w-full rounded-md border-gray-300"
                />
              </div>
            )}

            {/* reCAPTCHA */}
            <div className="mt-4 mb-2 flex justify-center">
              <ReCAPTCHA sitekey={RECAPTCHA_SITEKEY} onChange={onCaptchaChange} />
            </div>

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg mt-5 py-3 rounded-xl w-full transition"
              disabled={sending}
            >
              {sending ? 'กำลังส่ง...' : 'ส่งข้อมูล'}
            </button>
          </form>

          {/* CTA - ลิงก์ไปหน้ารถทั้งหมด */}
          <div className="flex justify-center mt-8">
            <a
              href="/all-cars"
              className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow hover:bg-gold hover:text-primary transition"
            >
              ดูรถทั้งหมด
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-10 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-3 text-primary">คำถามที่พบบ่อย (FAQ)</h2>
          <div className="divide-y">
            <details className="py-3">
              <summary className="font-semibold text-gold">
                Q: เช็คไฟแนนซ์ออนไลน์ฟรีจริงมั้ย?
              </summary>
              <div className="pl-3 pt-2">
                A: ฟรี 100% ไม่มีค่าใช้จ่าย ผลเบื้องต้นรู้ทันที ไม่บังคับซื้อรถ.
              </div>
            </details>
            <details className="py-3">
              <summary className="font-semibold text-gold">Q: ข้อมูลที่กรอกจะปลอดภัยมั้ย?</summary>
              <div className="pl-3 pt-2">
                A: ข้อมูลลูกค้าเป็นความลับ 100% ไม่เผยแพร่และไม่กระทบเครดิต.
              </div>
            </details>
            <details className="py-3">
              <summary className="font-semibold text-gold">Q: ใช้เวลากี่วันรู้ผล?</summary>
              <div className="pl-3 pt-2">
                A: ส่วนใหญ่รู้ผลเบื้องต้นทันที ถ้าเอกสารครบ ภายใน 1-3 ชม.
              </div>
            </details>
            <details className="py-3">
              <summary className="font-semibold text-gold">
                Q: ติดบูโรหรือผ่อนสินค้าอยู่ ยื่นได้มั้ย?
              </summary>
              <div className="pl-3 pt-2">A: ยื่นได้ ทีมงานจะช่วยประเมินฟรี และหาทางออกให้.</div>
            </details>
            <details className="py-3">
              <summary className="font-semibold text-gold">Q: ต้องใช้เอกสารอะไรบ้าง?</summary>
              <div className="pl-3 pt-2">
                A: สำเนาบัตรประชาชน, สลิปเงินเดือน/หนังสือรับรอง, สมุดบัญชีธนาคาร ย้อนหลัง 6 เดือน.
              </div>
            </details>
          </div>
        </section>
      </main>
    </>
  );
}
