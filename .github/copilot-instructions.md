# ครูหนึ่งรถสวย Next.js - คำแนะนำสำหรับ AI Coding

## ภาพรวมสถาปัตยกรรม

เว็บไซต์รถมือสองเชียงใหม่ ครูหนึ่งรถสวย สร้างด้วย Next.js 14 ใช้สถาปัตยกรรม **Pages Router** แบบ hybrid SSR/client-side rendering รวมกับ Shopify เป็น headless CMS สำหรับจัดการข้อมูลรถยนต์

### โครงสร้างหลัก

- **Pages Router**: การจัดการเส้นทางหลักใน `/pages` (ไม่ใช่ App Router)
- **การรวม Shopify**: ข้อมูลรถเก็บเป็น Shopify products พร้อม custom metafields
- **เนื้อหาสองภาษา**: หลักภาษาไทย บางส่วนภาษาอังกฤษ ใช้หลักการตั้งชื่อแบบไทยเป็นหลัก
- **สถาปัตยกรรมคอมโพเนนต์**: Functional components พร้อม hooks, ปิด SSR สำหรับ UI components เพื่อป้องกัน hydration mismatches

## ขั้นตอนการพัฒนา

```bash
pnpm dev          # เซิร์ฟเวอร์สำหรับพัฒนา (พอร์ต 3000)
pnpm build        # สร้าง production build
pnpm lint         # ตรวจสอบ ESLint
pnpm type-check   # ตรวจสอบ TypeScript
```

**สำคัญ**: ใช้ `pnpm` ไม่ใช่ npm. Husky pre-commit hooks จะรัน lint + type-check อัตโนมัติ

## รูปแบบที่สำคัญ

### 1. การจัดการ SSR

Components จะถูก import แบบ dynamic พร้อม `ssr: false` เพื่อป้องกัน hydration mismatches:

```javascript
const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });
```

### 2. โครงสร้างข้อมูล Shopify

รถยนต์จะถูกเก็บเป็น Shopify products พร้อม custom metafields ใน namespace `spec`:

- `spec.year`, `spec.brand`, `spec.model`, `spec.mileage`, ฯลฯ
- เข้าถึงผ่าน GraphQL queries ใน `lib/shopify.js`
- รูปภาพจาก Shopify CDN พร้อมการปรับปรุงด้วย Next.js Image

### 3. การใช้ภาษาไทย

- ฟอนต์: Prompt (ปรับปรุงสำหรับภาษาไทย) ใน `@fontsource/prompt`
- สี: ธีมธุรกิจไทยแบบกำหนดเอง (หลักสีน้ำเงิน `#1a237e`, สีส้ม `#ff9800`, สีทอง `#ffd700`)
- ป้ายนำทางและเนื้อหาเป็นภาษาไทย

### 4. การจัดระเบียบไฟล์

```
/pages           # หน้าเว็บ Next.js (เส้นทางหลัก)
/components      # UI components ที่ใช้ซ้ำได้
/lib             # การดึงข้อมูล (shopify.js, blog.js)
/styles          # CSS ทั่วโลก + Tailwind
/content/blog    # โพสต์บล็อกแบบ Markdown
/public          # ไฟล์สถิตจัดระเบียบตามประเภท
```

### 5. กลยุทธ์ SEO

ทุกหน้าใช้ `components/SEO.js` พร้อม meta tags ที่ปรับปรุงสำหรับภาษาไทย:

- คำสำคัญและรายละเอียดธุรกิจไทย
- Open Graph + Twitter cards
- Canonical URLs พร้อมโดเมนเว็บไซต์

### 6. หลักการจัดรูปแบบ

- **Tailwind CSS** พร้อมสีสันธุรกิจไทยแบบกำหนดเอง
- **ระบบสีหลัก**: `primary` (น้ำเงิน #1a237e), `accent` (ส้ม #ff9800), `gold` (#ffd700)
- **คลาสกำหนดเอง**:
  - `.btn-primary`, `.btn-secondary` สำหรับปุ่ม
  - `.form-input`, `.form-select`, `.form-textarea` สำหรับฟอร์ม
  - `.form-label` สำหรับป้ายกำกับ
  - `.form-section-*` สำหรับกลุ่มฟอร์มตามอาชีพ
- **ตระกูลฟอนต์**: `font-prompt` สำหรับการแสดงข้อความไทย
- **Responsive**: Mobile-first พร้อม breakpoints `md:`
- **สีคอนทราสต์**: ใช้ `text-primary` บนพื้นขาว, `text-white` บนพื้นสี, หลีกเลี่ยงสีกลืนกัน

## จุดเชื่อมต่อ

### Shopify GraphQL

- โดเมน: `process.env.SHOPIFY_DOMAIN`
- โทเคน: `process.env.SHOPIFY_STOREFRONT_TOKEN`
- เวอร์ชัน API: 2023-04
- ต้องการ custom metafields สำหรับข้อมูลจำเพาะรถยนต์

### บริการภายนอก

- **Vercel Analytics**: รวมไว้ใน `_app.js`
- **EmailJS**: ฟอร์มติดต่อ (`emailjs-com`)
- **reCAPTCHA**: การป้องกันฟอร์ม (`react-google-recaptcha`)
- **Framer Motion**: การเปลี่ยนหน้าและแอนิเมชัน

### ระบบบล็อก

ไฟล์ Markdown ใน `/content/blog/` พร้อม gray-matter frontmatter:

```yaml
---
title: 'หัวข้อโพสต์'
excerpt: 'คำอธิบายสั้นๆ'
date: '2024-01-01'
---
```

## ไฟล์หลักที่ต้องอ้างอิง

- `lib/shopify.js` - Shopify GraphQL queries และการแปลงข้อมูล
- `components/SEO.js` - รูปแบบ meta tags สำหรับ SEO ภาษาไทย
- `tailwind.config.js` - โทนสีธุรกิจไทยแบบกำหนดเอง
- `next.config.js` - การปรับปรุงรูปภาพและการตั้งค่าประสิทธิภาพ
- `pages/_app.js` - เลย์เอาต์ทั่วโลกพร้อม dynamic SSR-disabled components

## งานทั่วไป

- **เพิ่มฟิลด์รถใหม่**: อัปเดต Shopify metafields ใน GraphQL query
- **หน้าใหม่**: สร้างใน `/pages` พร้อมคอมโพเนนต์ SEO
- **UI components**: เพิ่มใน `/components` พร้อมรองรับข้อความไทย
- **โพสต์บล็อก**: สร้างไฟล์ `.md` ใน `/content/blog/`
- **การจัดรูปแบบ**: ใช้ตัวแปรสีที่มีอยู่ (`text-primary`, `bg-accent`, ฯลฯ)
- **ฟอร์ม**: ใช้ `.form-input`, `.form-select`, `.form-label` แทน inline styles
- **ปุ่ม**: ใช้ `.btn-primary`, `.btn-secondary` แทนการกำหนดสีโดยตรง

## หลักการป้องกันสีกลืนกัน

- **พื้นหลังขาว**: ใช้ `text-primary` หรือ `text-gray-900` สำหรับข้อความ
- **พื้นหลังสี**: ใช้ `text-white` เสมอ
- **ฟอร์ม**: ใช้ `border-gray-300` ปกติ, `focus:border-primary` เมื่อโฟกัส
- **ส่วนฟอร์มต่างๆ**: ใช้ `.form-section-government`, `.form-section-company` ฯลฯ
- **ทดสอบคอนทราสต์**: ตรวจสอบให้ข้อความอ่านง่ายในทุกสถานการณ์

เมื่อแก้ไขโค้ดเบสนี้ ให้รักษาบริบทธุรกิจไทย รูปแบบการรวม Shopify และสถาปัตยกรรมคอมโพเนนต์ที่ปลอดภัยจาก SSR
