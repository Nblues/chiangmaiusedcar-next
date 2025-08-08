# คู่มือเข้าใช้ระบบ Admin - ครูหนึ่งรถสวย

## ⚠️ สำคัญ: ระบบนี้เฉพาะผู้ดูแลระบบเท่านั้น

### วิธีการเข้าใช้งาน

#### ขั้นตอนที่ 1: เข้าสู่หน้า Admin Login

```
https://www.chiangmaiusedcar.com/admin-login
```

⚠️ **หมายเหตุ**:

- ระบบจะตรวจสอบสิทธิ์อัตโนมัติผ่านหลายวิธี:
  - การมาจากเว็บไซต์เดียวกัน
  - การเคยเข้าใช้งานภายใน 24 ชั่วโมง
  - การไม่ใช่ bot หรือ crawler
  - การเข้าผ่าน HTTPS

#### สำหรับการเข้าครั้งแรก (หากระบบไม่อนุญาต):

```
https://www.chiangmaiusedcar.com/admin-login?key=admin
```

หรือ

```
https://www.chiangmaiusedcar.com/admin-login?secret=admin2025secure!
```

#### ขั้นตอนที่ 2: เข้าสู่ระบบ

- **Username**: `admin`
- **Password**: `Admin@2024!`
- **2FA Code**: ใช้แอป Google Authenticator สแกน QR Code ที่แสดงในครั้งแรก

#### ขั้นตอนที่ 3: เข้าสู่หน้า Dashboard

หลังจากเข้าสู่ระบบสำเร็จ จะถูก redirect ไปยัง:

```
https://www.chiangmaiusedcar.com/admin
```

---

## 🔐 คุณสมบัติการรักษาความปลอดภัย

### 1. การตรวจสอบสิทธิ์อัตโนมัติ

- **ตรวจสอบ Referer**: มาจากเว็บไซต์เดียวกัน
- **ตรวจสอบเวลา**: เข้าใช้งานภายใน 24 ชั่วโมง
- **ตรวจสอบ Bot**: ไม่ใช่ search engine crawler
- **ตรวจสอบ HTTPS**: เข้าผ่าน connection ที่ปลอดภัย
- **ตรวจสอบ JavaScript**: มี JavaScript engine (ไม่ใช่ simple bot)

### 2. การยืนยันตัวตน

- Two-Factor Authentication (2FA) ด้วย Google Authenticator
- JWT Token มีอายุ 24 ชั่วโมง
- Rate limiting: สูงสุด 5 ครั้งต่อ 15 นาที
- IP Blocking หลังจากล้มเหลว 5 ครั้ง

### 3. การบันทึกกิจกรรม

- บันทึกการเข้าสู่ระบบทั้งหมด
- บันทึกการอัปโหลดรูปภาพ
- บันทึกการสร้าง/แก้ไข/ลบบทความ

---

## 📸 การจัดการรูปภาพ

### คุณสมบัติ:

- อัปโหลดได้หลายไฟล์พร้อมกัน
- แปลงเป็น WebP อัตโนมัติ
- ปรับขนาดตามประเภทการใช้งาน:
  - **รูปบทความ**: 600px, คุณภาพ 80%
  - **รูปปก**: 1200x630px, คุณภาพ 90%
  - **รูปเนื้อหา**: 800px, คุณภาพ 85%

### วิธีใช้:

1. เลือกประเภทรูปภาพ
2. เลือกไฟล์รูป (JPG, PNG, WebP)
3. รอการประมวลผลเสร็จสิ้น
4. คัดลอก URL ที่สร้างขึ้น

---

## ✍️ การจัดการบทความ

### คุณสมบัติ:

- เขียนบทความด้วย Markdown
- กำหนด SEO metadata
- จัดการ tags และ categories
- เผยแพร่หรือบันทึกเป็นร่าง
- แก้ไขและลบบทความ

### โครงสร้าง Markdown:

```markdown
# หัวข้อหลัก

## หัวข้อย่อย

### หัวข้อย่อยที่ 2

**ข้อความตัวหนา** _ข้อความตัวเอียง_

- รายการ 1
- รายการ 2
- รายการ 3

1. รายการมีลำดับ 1
2. รายการมีลำดับ 2

![รูปภาพ](URL_รูปภาพ)

[ลิงก์](URL_ลิงก์)
```

---

## 🔗 URL สำคัญ

### หน้า Admin:

- **Login**: `/admin-login` (URL ปกติ)
- **Dashboard**: `/admin`
- **สำรอง**: `/admin-login?key=admin` (กรณีไม่ผ่านการตรวจสอบ)

### API Endpoints (Protected):

- **อัปโหลดรูป**: `/api/admin/upload-image`
- **จัดการบทความ**: `/api/admin/articles`
- **ล็อกอิน**: `/api/admin/login`

---

## ⚡ การตั้งค่าขั้นสูง

### Environment Variables (.env.local):

```bash
# Admin Security
NEXT_PUBLIC_ADMIN_SECRET=admin2025secure!
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=hash...
ADMIN_2FA_SECRET=secret...
JWT_SECRET=jwt-secret...
ALLOWED_ADMIN_IPS=127.0.0.1,::1
```

### การเปลี่ยนรหัสผ่าน:

1. สร้าง hash ใหม่:

```javascript
const crypto = require('crypto');
const newPassword = 'NewPassword123!';
const hash = crypto.createHash('sha256').update(newPassword).digest('hex');
console.log(hash);
```

2. อัปเดต `ADMIN_PASSWORD_HASH` ใน .env.local

---

## 🆘 การแก้ไขปัญหา

### ไม่สามารถเข้าถึงหน้า admin:

- ลองเข้าผ่าน `/admin-login?key=admin`
- ตรวจสอบว่าไม่ได้ใช้ VPN หรือ Proxy
- ล้างข้อมูล localStorage ในเบราว์เซอร์
- ตรวจสอบว่าเปิด JavaScript ในเบราว์เซอร์

### 2FA ไม่ทำงาน:

- ตรวจสอบเวลาในเครื่อง (ต้องตรงกับเซิร์ฟเวอร์)
- สแกน QR Code ใหม่ใน Google Authenticator
- ตรวจสอบ ADMIN_2FA_SECRET

### Session หมดอายุ:

- Token มีอายุ 24 ชั่วโมง
- ระบบจะตรวจสอบทุก 30 วินาที
- ต้อง login ใหม่เมื่อหมดอายุ

---

## 📞 ติดต่อ

หากมีปัญหาเกี่ยวกับระบบ admin กรุณาติดต่อ:

- **เบอร์โทร**: 094-064-9018
- **อีเมล**: info@chiangmaiusedcar.com

---

**⚠️ คำเตือน**: ห้ามแชร์ข้อมูลการเข้าสู่ระบบ admin กับบุคคลอื่น เพื่อความปลอดภัยของเว็บไซต์
