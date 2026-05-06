import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EVFaq() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'รถ EV มือสองที่ครูหนึ่งรถสวย มีการตรวจสอบสภาพแบตเตอรี่ไหม?',
      a: 'แน่นอนครับ! รถไฟฟ้ามือสองทุกคันของเราผ่านการตรวจเช็ค SOH (State of Health) ของแบตเตอรี่ เพื่อให้ลูกค้ามั่นใจว่าแบตเตอรี่ยังอยู่ในสภาพดีเยี่ยมและมีประสิทธิภาพพร้อมใช้งานในระยะยาว'
    },
    {
      q: 'มีสายชาร์จ/อุปกรณ์ชาร์จแถมให้กับรถ EV มือสองด้วยไหม?',
      a: 'รถ EV ทุกคันจะมาพร้อมกับอุปกรณ์ชาร์จฉุกเฉิน (Emergency Charger) หรือสายชาร์จที่ติดมากับตัวรถเดิมครบถ้วน พร้อมใช้งานได้ทันที'
    },
    {
      q: 'รับประกันศูนย์ของรถไฟฟ้า (EV) จะยังอยู่ไหมเมื่อเป็นรถมือสอง?',
      a: 'รถ EV ส่วนใหญ่ที่เรารับมาจะเป็นปีใหม่ๆ ทำให้การรับประกันคุณภาพตัวรถ (Warranty) และรับประกันแบตเตอรี่จากศูนย์บริการ ยังคงครอบคลุมและสามารถโอนสิทธิ์ให้เจ้าของใหม่ได้ปกติครับ'
    },
    {
      q: 'หากต้องการไฟแนนซ์สำหรับรถ EV มือสอง ต้องเตรียมตัวอย่างไร?',
      a: 'ใช้เอกสารมาตรฐานเหมือนรถมือสองทั่วไปครับ คือ บัตรประชาชน ทะเบียนบ้าน และสลิปเงินเดือนหรือหนังสือรับรองรายได้ โดยปัจจุบันไฟแนนซ์หลายแห่งมีโปรโมชั่นดอกเบี้ยพิเศษสำหรับรถ EV เป็นทางเลือกให้ด้วยครับ'
    }
  ];

  return (
    <section id="faq" className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-primary to-[#ff9800] p-6 text-white sm:p-8">
        <h2 className="text-center text-3xl font-bold font-prompt">
          คำถามที่พบบ่อย (รถ EV)
        </h2>
        <p className="mt-2 text-center text-primary-50 text-white/90 font-prompt">
          ข้อควรรู้เพิ่มเติมเกี่ยวกับการซื้อรถไฟฟ้ามือสอง
        </p>
      </div>

      <div className="divide-y divide-gray-100 bg-white p-6 sm:p-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between p-4 text-left sm:p-6"
              >
                <span className="text-lg font-bold text-gray-900 font-prompt">
                  {faq.q}
                </span>
                <span
                  className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                    openFaq === index
                      ? 'bg-primary text-white rotate-180'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t border-gray-50 bg-gray-50/50 p-4 font-prompt text-gray-600 sm:p-6">
                      <p className="leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
