# การตั้งค่าหน้าเช็คเครดิตสำหรับใช้งานจริง

## ขั้นตอนการตั้งค่า

### 1. reCAPTCHA Setup
1. ไปที่ https://www.google.com/recaptcha/admin/create
2. สร้าง reCAPTCHA v2 "I'm not a robot" checkbox
3. เพิ่มโดเมนของคุณ (เช่น chiangmaiusedcar.com)
4. คัดลอก Site Key และ Secret Key
5. อัปเดตในไฟล์ .env.local:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
   RECAPTCHA_SECRET_KEY=your_secret_key_here
   ```

### 2. EmailJS Setup
1. สมัครที่ https://www.emailjs.com/
2. สร้าง Email Service (Gmail, Outlook, etc.)
3. สร้าง Email Template สำหรับการแจ้งเตือน
4. คัดลอก Service ID, Template ID, และ Public Key
5. อัปเดตในไฟล์ .env.local:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

### 3. Email Template ตัวอย่าง
```
เรื่อง: แบบฟอร์มเช็คเครดิต - {{name}}

ข้อมูลลูกค้า:
ชื่อ: {{name}}
เบอร์โทร: {{phone}}
เพศ: {{gender}}
อายุ: {{age}}
อาชีพ: {{careerText}}
จังหวัด: {{province}}
สถานะเครดิต: {{creditStatus}}
เงินดาวน์: {{downOptionText}}

ข้อมูลอาชีพเพิ่มเติม:
{{govAgency}} {{govPosition}} {{govYears}} {{govIncome}}
{{companyName}} {{companyPosition}} {{companyYears}} {{companyIncome}}

เวลาส่งข้อมูล: {{submittedAt}}
```

## การทดสอบ

### ทดสอบ reCAPTCHA
1. เปิดหน้าเช็คเครดิต
2. ตรวจสอบว่า reCAPTCHA แสดงผล
3. ทำ checkbox "I'm not a robot"
4. ต้องไม่มีข้อผิดพลาด

### ทดสอบการส่งอีเมล
1. กรอกข้อมูลทดสอบในฟอร์ม
2. ทำ reCAPTCHA
3. กดส่งข้อมูล
4. ตรวจสอบอีเมลที่ตั้งค่าใน EmailJS

## การแก้ไขปัญหา

### reCAPTCHA ไม่แสดง
- ตรวจสอบ NEXT_PUBLIC_RECAPTCHA_SITE_KEY
- ตรวจสอบว่าโดเมนตรงกับที่ตั้งค่าใน Google reCAPTCHA
- เปิด Developer Tools ดู Console errors

### อีเมลส่งไม่ได้
- ตรวจสอบ EmailJS keys ทั้งหมด
- ตรวจสอบ Email Service ใน EmailJS
- ตรวจสอบ Template ID และ field names

### ข้อผิดพลาดอื่นๆ
- เปิด Developer Tools → Console
- ดู Network tab สำหรับ API calls
- ตรวจสอบ server logs

## การนำไป Production

### Vercel Deployment
1. อัปโหลดโค้ดไป GitHub
2. เชื่อมต่อ Vercel กับ repository
3. ตั้งค่า Environment Variables ใน Vercel:
   - NEXT_PUBLIC_RECAPTCHA_SITE_KEY
   - RECAPTCHA_SECRET_KEY
   - NEXT_PUBLIC_EMAILJS_SERVICE_ID
   - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
   - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

### การรักษาความปลอดภัย
- ไม่ hardcode keys ในโค้ด
- ใช้ Environment Variables เสมอ
- ตรวจสอบ reCAPTCHA score สำหรับ v3
- จำกัดการเรียกใช้ API

## การติดต่อสำหรับสนับสนุน
- ปัญหาเทคนิค: developer@chiangmaiusedcar.com
- ปัญหาอีเมล: admin@chiangmaiusedcar.com
- Line สำหรับลูกค้า: @ครูหนึ่งรถสวย
