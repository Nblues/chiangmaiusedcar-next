import { useRef, useState } from 'react';
import SEO from '../components/SEO';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITEKEY = 'YOUR_RECAPTCHA_SITEKEY';

export default function CreditCheck() {
  const formRef = useRef();
  const [career, setCareer] = useState('');
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!captcha) {
      return Swal.fire('กรุณายืนยัน reCAPTCHA', '', 'warning');
    }
    formRef.current.careerText.value = careerText[career];
    formRef.current.downOptionText.value = downOption;
    formRef.current.submittedAt.value = new Date().toLocaleString('th-TH');

    setSending(true);
    Swal.fire({ title: 'กำลังส่งข้อมูล...', allowOutsideClick: false, didOpen: Swal.showLoading });

    try {
      const formData = new FormData(formRef.current);
      formData.append('g-recaptcha-response', captcha);
      const res = await fetch('/api/credit-check', { method: 'POST', body: formData });
      const api = await res.json();
      if (!api.success) throw new Error(api.message);

      await emailjs.sendForm(
        'service_qlcksif',
        'template_zd6e3f6',
        formRef.current,
        'P3wnNJB_Y_PddrdBJ',
      );

      Swal.fire('ส่งข้อมูลเรียบร้อยแล้ว', 'ทีมงานจะติดต่อกลับ', 'success');
      formRef.current.reset();
      setCareer('');
      setDownOption('');
      setShowDownInput(false);
      setCaptcha(null);
    } catch (err) {
      Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  // Schema JSON-LD (Breadcrumb + FAQ) เหมือนเดิม...

  return (
    <>
      <SEO
        title="เช็คเครดิตรถยนต์ออนไลน์ | ครูหนึ่งรถสวย"
        description="เช็คเครดิตรถมือสอง อนุมัติง่าย ฟรี 100% ไม่ต้องค้ำ รู้ผลเร็ว"
        url="/credit-check"
        image="/cover.jpg"
        canonical="https://chiangmaiusedcar.com/credit-check"
        locale="th_TH"
        alternate={[{ href: 'https://chiangmaiusedcar.com/credit-check', hrefLang: 'th-TH' }]}
      />

      {/* JSON-LD scripts... */}

      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <h2 className="text-center text-2xl font-bold mb-6 text-success">ประเมินไฟแนนซ์รถยนต์</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="careerText" />
            <input type="hidden" name="downOptionText" />
            <input type="hidden" name="submittedAt" />

            <div>
              <label className="block font-semibold mb-1">ชื่อ-นามสกุล</label>
              <input type="text" name="name" required className="form-input w-full" />
            </div>
            <div>
              <label className="block font-semibold mb-1">เบอร์โทร</label>
              <input
                type="tel"
                name="phone"
                required
                pattern="[0-9]{10}"
                className="form-input w-full"
              />
            </div>
            {/* ...ฟิลด์อื่นๆ ตามเดิม ใช้ className="form-input w-full" */}
            <div>
              <label className="block font-semibold mb-1">เงินดาวน์</label>
              <select
                name="downOption"
                value={downOption}
                onChange={e => {
                  setDownOption(e.target.value);
                  setShowDownInput(e.target.value === 'วางเงินดาวน์');
                }}
                className="form-input w-full"
                required
              >
                <option value="">-- เลือกรูปแบบ --</option>
                <option value="ฟรีดาวน์">ฟรีดาวน์</option>
                <option value="วางเงินดาวน์">วางเงินดาวน์</option>
              </select>
            </div>
            {showDownInput && (
              <div>
                <label className="block font-semibold mb-1">จำนวนเงิน (บาท)</label>
                <input type="number" name="customDown" className="form-input w-full" />
              </div>
            )}

            <div className="flex justify-center">
              <ReCAPTCHA sitekey={RECAPTCHA_SITEKEY} onChange={setCaptcha} />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl font-bold text-white bg-success hover:bg-success/90 transition"
            >
              {sending ? 'กำลังส่ง...' : 'ส่งข้อมูล'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/all-cars"
              className="inline-block px-6 py-2 bg-primary text-white rounded-full hover:bg-gold hover:text-primary transition"
            >
              ดูรถทั้งหมด
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="max-w-2xl mx-auto mt-10">
          <h3 className="text-xl font-bold mb-4 text-primary">คำถามที่พบบ่อย</h3>
          <div className="space-y-2">
            <details className="bg-white p-4 rounded-lg shadow">
              <summary className="font-semibold text-accent">Q: เช็คไฟแนนซ์ฟรีจริงมั้ย?</summary>
              <p className="mt-2 text-gray-700">ฟรี 100% ไม่บังคับซื้อรถ รู้ผลทันที</p>
            </details>
            {/* ...more details */}
          </div>
        </section>
      </main>
    </>
  );
}
