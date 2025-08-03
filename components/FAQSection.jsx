import React from 'react';

// FAQSection.js
// Modern 2025 FAQ section with schema.org/FAQPage for SEO

const faqs = [
  {
    q: 'ซื้อรถมือสองกับครูหนึ่งรถสวยดีอย่างไร?',
    a: 'รถทุกคันผ่านการตรวจสอบคุณภาพ รับประกันหลังการขาย ฟรีดาวน์ ผ่อนถูก พร้อมบริการสินเชื่อครบวงจรและรีวิวจากลูกค้าจริงมากกว่า 1 ล้านคน.',
  },
  {
    q: 'มีบริการหลังการขายหรือไม่?',
    a: 'มีบริการรับประกัน 1 ปี และทีมช่างมืออาชีพดูแลหลังการขายทุกคัน.',
  },
  {
    q: 'สามารถขอสินเชื่อได้ทุกอาชีพหรือไม่?',
    a: 'สามารถขอสินเชื่อได้ทุกอาชีพ มีเจ้าหน้าที่ให้คำปรึกษาและช่วยเหลือทุกขั้นตอน.',
  },
  {
    q: 'ถ้าเครดิตไม่ดี ซื้อได้ไหม?',
    a: 'มีบริการเช็คเครดิตและให้คำแนะนำสำหรับลูกค้าที่เครดิตไม่ดี เพื่อโอกาสในการออกรถ.',
  },
];

export default function FAQSection() {
  return (
    <section
      className="max-w-4xl mx-auto px-4 py-12 md:py-16 mb-8 bg-gradient-to-br from-white via-gold/10 to-primary/5 rounded-3xl shadow-2xl border border-gold"
      aria-label="คำถามที่พบบ่อย รถมือสองเชียงใหม่"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center font-prompt uppercase tracking-wide">
        คำถามที่พบบ่อย
      </h2>
      <dl className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white/90 rounded-xl shadow p-5 border border-gold/20">
            <dt className="font-bold text-accent text-lg mb-2" itemProp="name">
              {faq.q}
            </dt>
            <dd
              className="text-gray-800 text-base"
              itemProp="acceptedAnswer"
              itemScope
              itemType="https://schema.org/Answer"
            >
              <span itemProp="text">{faq.a}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
