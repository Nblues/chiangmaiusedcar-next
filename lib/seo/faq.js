import { BUSINESS_INFO } from '../../config/business.js';

export function buildFaqSchemaItems(faqs) {
  const list = Array.isArray(faqs) ? faqs : [];
  return list
    .map(item => {
      const name = item?.q ? String(item.q).trim() : '';
      const text = item?.a ? String(item.a).trim() : '';
      if (!name || !text) return null;
      return {
        '@type': 'Question',
        name,
        acceptedAnswer: {
          '@type': 'Answer',
          text,
        },
      };
    })
    .filter(Boolean);
}

export function buildFaqPageJsonLd({ url, faqs }) {
  const baseUrl = BUSINESS_INFO?.baseUrl || 'https://www.chiangmaiusedcar.com';
  const fullUrl = url ? (String(url).startsWith('http') ? url : `${baseUrl}${url}`) : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: buildFaqSchemaItems(faqs),
  };

  if (fullUrl) schema.url = fullUrl;

  return schema;
}

export const ALL_CARS_FAQS = [
  {
    q: 'รถมือสองเชียงใหม่มีให้เลือกกี่คัน?',
    a: 'หน้านี้รวมรถมือสองทั้งหมดที่พร้อมขายในสต็อกของครูหนึ่งรถสวย สามารถเลื่อนดูรายการและกดดูรายละเอียดของแต่ละคันได้เลย',
  },
  {
    q: 'ดูรถ/ทดลองขับได้ที่ไหน?',
    a: 'นัดดูรถและทดลองขับได้ที่เต็นท์ครูหนึ่งรถสวย จังหวัดเชียงใหม่ โทร 094-064-9018 หรือแชท LINE @krunuengusedcar เพื่อจองคิวก่อนเข้าดูรถ',
  },
  {
    q: 'มีผ่อน/จัดไฟแนนซ์ได้ไหม ต้องเตรียมอะไรบ้าง?',
    a: 'มีบริการช่วยจัดไฟแนนซ์และประเมินวงเงินเบื้องต้น แนะนำเตรียมบัตรประชาชน สลิปเงินเดือน/รายการเดินบัญชี และเอกสารยืนยันที่อยู่ (รายละเอียดอาจต่างกันตามอาชีพ)',
  },
  {
    q: 'รับประกันและตรวจสภาพรถอย่างไร?',
    a: 'รถทุกคันคัดสภาพและตรวจสอบก่อนลงขาย พร้อมให้ข้อมูลสภาพจริงและรายละเอียดสำคัญในหน้ารถแต่ละคัน หากต้องการจุดตรวจเฉพาะ แจ้งทีมงานได้ก่อนเข้าดูรถ',
  },
];

export function buildCarDetailFaqs({ title, brand, model }) {
  const name = String(title || `${brand || ''} ${model || ''}`.trim() || 'รถมือสอง').trim();

  return [
    {
      q: `รถคันนี้ยังว่างอยู่ไหม (${name})?`,
      a: 'สถานะอัปเดตจากระบบแบบเรียลไทม์ หากต้องการล็อกคิวดูรถ แนะนำโทรหรือแชท LINE ก่อนเข้าดูเพื่อความชัวร์',
    },
    {
      q: 'ผ่อนต่อเดือนประมาณเท่าไหร่?',
      a: 'ค่างวดขึ้นอยู่กับราคา ดาวน์ ระยะผ่อน และไฟแนนซ์ที่อนุมัติ กดดูรายละเอียดราคาในหน้านี้ แล้วทักมาเพื่อให้เราคำนวณค่างวดให้ได้ทันที',
    },
    {
      q: 'สามารถดูรถ/ทดลองขับได้ไหม?',
      a: 'ได้ครับ นัดดูรถและทดลองขับได้ที่เต็นท์ครูหนึ่งรถสวย เชียงใหม่ แนะนำจองคิวล่วงหน้าเพื่อเตรียมรถให้พร้อม',
    },
    {
      q: 'เอกสารที่ใช้จัดไฟแนนซ์มีอะไรบ้าง?',
      a: 'โดยทั่วไปใช้บัตรประชาชน เอกสารรายได้ (สลิป/รายการเดินบัญชี) และเอกสารที่อยู่ รายละเอียดจะปรับตามอาชีพและเงื่อนไขไฟแนนซ์',
    },
  ];
}
