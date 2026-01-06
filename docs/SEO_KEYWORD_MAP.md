# SEO Keyword Map (Single Source of Truth)

เป้าหมาย: ทำให้ทั้งเว็บ “สอดคล้อง” (Title/Description/H1/H2-H3) และสร้าง long-tail แบบไม่สแปม โดยอ้างอิงจากไฟล์ config เดียว

- แหล่งข้อมูลหลัก: `config/seo-keyword-map.js`
- กติกาสำคัญ
  - 1 หน้า = 1 H1
  - Title/Description ต้องมีคีย์หลัก 1 ครั้งแบบธรรมชาติ
  - H2/H3 ใช้กระจายคีย์รอง/คำพ้อง (ไม่ยัดซ้ำ)

## หน้าเงินหลักที่ต้องคุมเข้ม

### Home `/`

- Primary: รถมือสองเชียงใหม่
- Secondary: ฟรีดาวน์, ดอกเบี้ยต่ำ, ตรวจสภาพครบถ้วน, รับประกัน 1 ปี, ส่งฟรีทั่วไทย
- Placement
  - Title/Description: ใน `<SEO />`
  - H1: Hero

### All Cars `/all-cars`

- Primary: รถมือสองเชียงใหม่ทั้งหมด
- Secondary: รถบ้านแท้, ฟรีดาวน์, ผ่อนถูก, รับประกัน, ส่งฟรีทั่วไทย
- Placement
  - Title: เติมเลขหน้า (pagination) ได้ แต่โครงหลักต้องเหมือนเดิม
  - noindex: ใช้เฉพาะหน้าที่เป็น filter/search เพื่อกันหน้าซ้ำ

### Car Detail `/car/[handle]`

- Primary: รถมือสองเชียงใหม่
- Secondary: รถบ้านแท้, ฟรีดาวน์, ผ่อนถูก, รับประกัน, ส่งฟรีทั่วไทย
- Placement
  - Title/H1: ปี + ยี่ห้อ + รุ่น + ราคา (ถ้ามี) + เชียงใหม่ (แบบอ่านได้)
  - Structured data: Car/Product schema (มีอยู่แล้ว)

### Contact `/contact`

- Primary: ติดต่อ ครูหนึ่งรถสวย
- Secondary: รถมือสองเชียงใหม่, นัดหมายดูรถ, LINE, โทรศัพท์
- Placement
  - Breadcrumb schema: ให้ใช้ `breadcrumbs` prop ของ `<SEO />` (ไม่ต้องยิงซ้ำเอง)

### Credit Check `/credit-check`

- Primary: เช็คเครดิต รถมือสองเชียงใหม่
- Secondary: สินเชื่อรถยนต์, ประเมินวงเงิน, ดอกเบี้ย, ผ่อน, เอกสาร

### Sell Car `/sell-car`

- Primary: ขายรถมือสองเชียงใหม่
- Secondary: ฝากขายรถ, ประเมินราคา, แลกเทิร์น, รับซื้อรถ

## หมายเหตุ

- ไม่ใช้ meta keywords (deprecated) แต่ใช้ structured data/หัวข้อ/เนื้อหาแทน
- ลด schema ซ้ำซ้อน: breadcrumb/organization ควรมีแหล่งเดียว
