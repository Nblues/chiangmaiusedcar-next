# การตั้งค่า External Services

## 🎯 บริการภายนอกที่ใช้ในโปรเจค

### 1. 🔒 Google reCAPTCHA

**จุดประสงค์**: ป้องกันสแปมและบอทในฟอร์มเช็คเครดิต

**วิธีตั้งค่า**:

1. ไปที่ [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. สร้าง Site ใหม่
3. เลือก reCAPTCHA v2 "I'm not a robot"
4. เพิ่มโดเมนของคุณ (localhost สำหรับการพัฒนา)
5. ได้ Site Key และ Secret Key

**Environment Variables**:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le37cArAAAAAPLDyOok1wORZV9Xsd1lBi962Vdf
RECAPTCHA_SECRET_KEY=6Le37cArAAAAAD_kQFsrF8N7EU_EMKIiLkculpiL
```

_หมายเหตุ: Keys ข้างบนเป็น Production Keys จริงที่ใช้งานได้แล้ว_

---

### 2. 📧 EmailJS

**จุดประสงค์**: ส่งอีเมลฟอร์มติดต่อและเช็คเครดิต

**วิธีตั้งค่า**:

1. ไปที่ [EmailJS](https://www.emailjs.com/)
2. สร้างบัญชีใหม่
3. สร้าง Email Service (Gmail, Outlook, etc.)
4. สร้าง Email Template
5. ได้ Service ID, Template ID, และ Public Key

**Environment Variables**:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qlcksif
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_zd6e3f6
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=P3wnNJB_Y_PddrdBJ
```

**Template Variables ที่ใช้**:

- `{{name}}` - ชื่อผู้ติดต่อ
- `{{phone}}` - เบอร์โทรศัพท์
- `{{careerText}}` - อาชีพ
- `{{submittedAt}}` - วันที่ส่ง
- และอื่นๆ ตามฟิลด์ในฟอร์ม

---

### 3. 🛒 Shopify Storefront API

**จุดประสงค์**: ดึงข้อมูลรถยนต์จาก Shopify

**วิธีตั้งค่า**:

1. ไปที่ Shopify Admin > Apps > Manage private apps
2. สร้าง Private App ใหม่
3. เปิดใช้งาน Storefront API
4. ได้ Storefront Access Token

**Environment Variables**:

```bash
SHOPIFY_DOMAIN=kn-goodcar.com
SHOPIFY_STOREFRONT_TOKEN=<SHOPIFY_STOREFRONT_TOKEN>
```

**Custom Metafields ที่ใช้**:

- `spec.year` - ปีรถ
- `spec.brand` - ยี่ห้อ
- `spec.model` - รุ่น
- `spec.mileage` - เลขไมล์
- `spec.engine` - ขนาดเครื่องยนต์
- และอื่นๆ

---

## ✅ สถานะปัจจุบัน (อัปเดต: 7 ก.ย. 2025)

### 🔐 Google reCAPTCHA

- ✅ **ใช้งานได้**: Production Keys ตั้งค่าเรียบร้อย
- ✅ **ทดสอบแล้ว**: ฟอร์มเครดิตเช็คใช้งานได้
- ✅ **API Verify**: Server-side verification ทำงาน

### 📧 EmailJS

- ✅ **ใช้งานได้**: Service และ Template พร้อม
- ✅ **ทดสอบแล้ว**: ส่งอีเมลได้ปกติ
- ✅ **Template**: รองรับฟิลด์ครบถ้วน

### 🛒 Shopify Storefront API

- ✅ **ใช้งานได้**: เชื่อมต่อ kn-goodcar.com
- ✅ **ข้อมูลรถ**: ดึงข้อมูลและรูปภาพได้
- ✅ **Metafields**: ข้อมูลจำเพาะรถครบถ้วน

---

## 🔧 การตั้งค่าสำหรับ Production

### 1. ReCAPTCHA Production Keys

```bash
# ใน .env.local สำหรับ production
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_real_site_key_here
RECAPTCHA_SECRET_KEY=your_real_secret_key_here
```

### 2. EmailJS Production

- ตรวจสอบ Monthly Quota (200 emails/month สำหรับ Free plan)
- ตั้งค่า CORS domain ให้ถูกต้อง
- ทดสอบการส่งอีเมลก่อน deploy

### 3. Shopify Production

- ใช้ Production Store URL
- ตรวจสอบ Rate Limiting (100 requests/minute)
- ตั้งค่า Webhook สำหรับ real-time updates

---

## 🚦 การทดสอบ

### ทดสอบ ReCAPTCHA

```javascript
// Test Keys จะผ่านการตรวจสอบเสมอ
// Production Keys จะตรวจสอบจริง
```

### ทดสอบ EmailJS

```bash
# ตรวจสอบใน Browser Console
console.log('EmailJS Service ID:', process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID);
```

### ทดสอบ Shopify

```bash
# ตรวจสอบการเชื่อมต่อ
curl -X POST https://your-store.myshopify.com/api/2023-04/graphql.json \\
  -H "X-Shopify-Storefront-Access-Token: your_token" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ shop { name } }"}'
```

---

## 🔒 ความปลอดภัย

### Environment Variables

- ไม่เก็บ Secret Keys ใน git repository
- ใช้ `.env.local` สำหรับการพัฒนา
- ตั้งค่าใน Vercel/Hosting Platform สำหรับ production

### API Security

- Shopify: ใช้ Storefront API (read-only)
- EmailJS: จำกัด domain ที่อนุญาต
- ReCAPTCHA: ตรวจสอบ score threshold

---

## 📚 เอกสารเพิ่มเติม

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
