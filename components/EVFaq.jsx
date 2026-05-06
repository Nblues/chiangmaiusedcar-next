import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EVFaq() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'รถ EV มือสองที่ครูหนึ่งรถสวย มีการตรวจสอบสภาพแบตเตอรี่ไหม?',
      a: 'ทางเรายินดีอำนวยความสะดวกให้นำรถเข้าไปตรวจเช็คสภาพและดูค่า SOH (State of Health) ของแบตเตอรี่ที่ศูนย์บริการอย่างเป็นทางการของรถแต่ละแบรนด์ได้เลยครับ เพื่อให้ลูกค้าได้ข้อมูลที่แม่นยำและมั่นใจในคุณภาพแบตเตอรี่อย่างแท้จริงก่อนตัดสินใจ',
    },
    {
      q: 'มีสายชาร์จ/อุปกรณ์ชาร์จแถมให้กับรถ EV มือสองด้วยไหม?',
      a: 'รถ EV ทุกคันจะมาพร้อมกับอุปกรณ์ชาร์จฉุกเฉิน (Emergency Charger) หรือสายชาร์จที่ติดมากับตัวรถเดิมครบถ้วน พร้อมใช้งานได้ทันที',
    },
    {
      q: 'รับประกันศูนย์ของรถไฟฟ้า (EV) จะยังอยู่ไหมเมื่อเป็นรถมือสอง?',
      a: 'รถ EV ส่วนใหญ่ที่เรารับมาจะเป็นปีใหม่ๆ ทำให้การรับประกันคุณภาพตัวรถ (Warranty) และรับประกันแบตเตอรี่จากศูนย์บริการ ยังคงครอบคลุมและสามารถโอนสิทธิ์ให้เจ้าของใหม่ได้ปกติครับ',
    },
    {
      q: 'รถ EV มือสองสามารถจัดไฟแนนซ์ได้ไหม?',
      a: 'ณ ปัจจุบันสถาบันการเงินและสถาบันไฟแนนซ์ส่วนใหญ่ยังไม่มีบริการรองรับการจัดไฟแนนซ์สำหรับรถ EV มือสองครับ ดังนั้นทางเต็นท์จึงเปิดรับเฉพาะการซื้อขายด้วย "เงินสด" เท่านั้นครับ (หากในอนาคตมีไฟแนนซ์รองรับ ทางเราจะรีบอัปเดตให้ทราบทันทีครับ)',
    },
  ];

  return (
    <section
      id="faq"
      className="mt-12 mb-10 overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/40 border border-gray-100 relative"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-gold" />
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="bg-white px-6 pt-12 pb-8 sm:px-12 sm:pt-16 sm:pb-10 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary font-prompt mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          EV FAQ
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-prompt tracking-tight">
          คำถามที่พบบ่อย{' '}
          <span className="text-orange-700 underline decoration-2 underline-offset-8">รถ EV</span>
        </h2>
        <p className="mt-4 text-gray-500 font-prompt max-w-2xl mx-auto text-base sm:text-lg">
          ข้อควรรู้เพิ่มเติมเกี่ยวกับการซื้อรถไฟฟ้ามือสอง เพื่อความมั่นใจก่อนตัดสินใจ
        </p>
      </div>

      <div className="bg-white px-6 pb-12 sm:px-12 sm:pb-16 relative z-10">
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-2xl transition-all duration-300 border ${
                openFaq === index
                  ? 'border-primary/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white ring-1 ring-primary/5'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white hover:shadow-sm'
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between p-5 text-left sm:p-6 group"
              >
                <span className="text-lg font-bold text-gray-800 font-prompt group-hover:text-primary transition-colors">
                  {faq.q}
                </span>
                <span
                  className={`ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    openFaq === index
                      ? 'bg-primary text-white rotate-180 shadow-md shadow-primary/30'
                      : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
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
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="border-t border-gray-100 bg-white p-5 pt-2 font-prompt text-gray-600 sm:p-6 sm:pt-2">
                      <p className="leading-relaxed text-base">{faq.a}</p>
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
