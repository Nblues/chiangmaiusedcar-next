# คู่มือระบบ Admin - ครูหนึ่งรถสวย

## 🚀 การติดตั้งและตั้งค่าเริ่มต้น

### 1. ตั้งค่า Admin Account

```bash
pnpm setup-admin
```

### 2. ติดตั้ง Google Authenticator

- ดาวน์โหลดแอป Google Authenticator บนมือถือ
- สแกน QR Code หรือกรอก Secret Key ที่ได้จากขั้นตอนที่ 1
- บันทึก Backup Codes ไว้ในที่ปลอดภัย

### 3. เข้าสู่ระบบ

- เปิด: `http://localhost:3000/admin-login`
- กรอก Username และ Password
- กรอกรหัส 2FA จาก Google Authenticator

---

## 🛡️ ระบบความปลอดภัย

### ✅ Features ที่มี:

- **2FA Authentication**: ใช้ Google Authenticator
- **Rate Limiting**: จำกัดการลองเข้าสู่ระบบ (5 ครั้ง/15 นาที)
- **IP Blocking**: บล็อก IP ที่พยายามเข้าผิดมากเกินไป
- **JWT Tokens**: Session หมดอายุใน 2 ชั่วโมง
- **Activity Logging**: บันทึกการใช้งานทั้งหมด
- **Fingerprinting**: ตรวจสอบ browser fingerprint
- **Password Hashing**: รหัสผ่านถูกเข้ารหัสด้วย SHA-256

### ⚠️ ข้อควรระวัง:

- อย่าแชร์ข้อมูลการเข้าสู่ระบบ
- ใช้รหัสผ่านที่แข็งแรง (8 ตัวอักษรขึ้นไป)
- เปลี่ยนรหัสผ่านเป็นระยะ
- ตรวจสอบ log files เป็นประจำ

---

## 📸 การจัดการรูปภาพ

### ประเภทรูปภาพ:

#### 🖼️ รูปปก (Cover Image)

- **ขนาด**: 1200x630px
- **ใช้สำหรับ**: Open Graph, Facebook, Twitter cards
- **คุณภาพ**: 90%
- **รูปแบบ**: WebP + Responsive variants

#### 📷 รูปในเนื้อหา (Content Image)

- **ขนาด**: 800px width (height auto)
- **ใช้สำหรับ**: รูปภายในบทความ
- **คุณภาพ**: 85%
- **รูปแบบ**: WebP + Responsive variants

#### 📝 รูปบทความ (Article Image)

- **ขนาด**: ขนาดอัตโนมัติ
- **ใช้สำหรับ**: รูปทั่วไปในบทความ
- **คุณภาพ**: 85%
- **รูปแบบ**: WebP

### วิธีการใช้งาน:

1. เลือกประเภทรูปภาพ
2. ลากไฟล์มาวางหรือคลิกเลือก
3. รอการประมวลผล
4. คัดลอก URL ไปใช้งาน

### ฟีเจอร์อัตโนมัติ:

- ✅ แปลงเป็น WebP
- ✅ สร้างขนาดต่างๆ (Responsive)
- ✅ ปรับปรุงคุณภาพ
- ✅ สร้าง Alt Text อัตโนมัติ
- ✅ ลดขนาดไฟล์ 50-70%

---

## ✍️ การจัดการบทความ

### การสร้างบทความใหม่:

#### 1. ข้อมูลพื้นฐาน

- **ชื่อเรื่อง**: ชื่อบทความ (จำเป็น)
- **คำอธิบายสั้น**: สรุปเนื้อหา (แนะนำ)
- **รูปปก**: URL รูปปก (ไม่จำเป็น)
- **แท็ก**: คำสำคัญ คั่นด้วยจุลภาค

#### 2. เนื้อหา (Markdown)

รองรับ Markdown syntax:

```markdown
# หัวข้อใหญ่

## หัวข้อย่อย

### หัวข้อย่อยที่ 3

**ตัวหนา** และ _ตัวเอียง_

- รายการที่ 1
- รายการที่ 2
- รายการที่ 3

1. ลำดับที่ 1
2. ลำดับที่ 2

![คำอธิบายรูป](/uploads/image.webp)

[ลิงก์](https://example.com)
```

#### 3. การเผยแพร่

- **Draft**: บันทึกแต่ไม่เผยแพร่
- **Published**: เผยแพร่ให้ผู้อื่นเห็น

### ตัวอย่างบทความ:

```markdown
# รถยนต์มือสองคุณภาพดี ที่ครูหนึ่งรถสวย

รถมือสองเชียงใหม่ที่มีคุณภาพและราคาดี **ฟรีดาวน์** และ **ผ่อนถูก**

## ข้อดีของการซื้อรถมือสอง

- ราคาถูกกว่ารถใหม่
- ค่าเสื่อมราคาไม่สูง
- มีให้เลือกหลากหลาย

![รถมือสองคุณภาพ](/uploads/quality-used-cars.webp)

## ติดต่อเรา

โทร: 094-064-9018
```

---

## 📁 โครงสร้างไฟล์

```
/admin-login          # หน้าเข้าสู่ระบบ Admin
/admin               # หน้า Dashboard Admin
/api/admin/login     # API เข้าสู่ระบบ
/api/admin/articles  # API จัดการบทความ
/api/admin/log       # API บันทึก log
/api/upload-image    # API อัปโหลดรูป
/public/uploads/     # โฟลเดอร์เก็บรูปที่อัปโหลด
/content/blog/       # โฟลเดอร์เก็บบทความ Markdown
/logs/              # โฟลเดอร์เก็บ log files
```

---

## 📊 Log Files

### ประเภท Log:

- `admin-YYYY-MM-DD.log`: การเข้าสู่ระบบ
- `admin-activity-YYYY-MM-DD.log`: กิจกรรมต่างๆ
- `admin-articles-YYYY-MM-DD.log`: การจัดการบทความ

### ตัวอย่าง Log Entry:

```json
{
  "timestamp": "2024-08-09T10:30:00.000Z",
  "action": "LOGIN_SUCCESS",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "username": "admin"
}
```

---

## 🛠️ คำสั่ง CLI

```bash
# ตั้งค่า Admin (ครั้งแรก)
pnpm setup-admin

# ประมวลผลรูปทั้งหมด
pnpm process-images

# ประมวลผลแบบ responsive
pnpm process-images:responsive

# ลบรูปต้นฉบับหลังแปลงเสร็จ
pnpm process-images:delete

# ทำความสะอาดรูปต้นฉบับ
pnpm cleanup-images

# รัน development server
pnpm dev

# Build production
pnpm build
```

---

## ⚡ Tips & Tricks

### 1. การเพิ่มความปลอดภัย

```env
# จำกัด IP ที่เข้าได้ (ใน .env.local)
ALLOWED_ADMIN_IPS=192.168.1.100,203.154.xxx.xxx
```

### 2. การสำรองข้อมูล

- สำรอง `/content/blog/` เป็นประจำ
- สำรอง `/public/uploads/` เป็นประจำ
- สำรอง `logs/` สำหรับการตรวจสอบ

### 3. การปรับแต่งขนาดรูป

แก้ไขใน `/api/upload-image.js`:

```javascript
// สำหรับรูปปก
formData.append('width', '1200');
formData.append('height', '630');

// สำหรับรูปเนื้อหา
formData.append('width', '800');
```

### 4. การเพิ่ม Alt Text แบบกำหนดเอง

แก้ไขใน `/lib/imageManager.js` ฟังก์ชัน `generateAltText()`

---

## 🚨 Troubleshooting

### ปัญหาที่พบบ่อย:

#### 1. ไม่สามารถเข้าสู่ระบบได้

- ตรวจสอบ Username/Password
- ตรวจสอบเวลาใน Google Authenticator
- ดู log ใน `logs/admin-YYYY-MM-DD.log`

#### 2. รูปไม่โหลด

- ตรวจสอบ permissions โฟลเดอร์ `/public/uploads/`
- ตรวจสอบขนาดไฟล์ (จำกัด 10MB)
- ดู browser console สำหรับ error

#### 3. บทความไม่แสดง

- ตรวจสอบ frontmatter ใน Markdown
- ตรวจสอบ `published: true`
- restart Next.js server

#### 4. Session หมดอายุบ่อย

- เพิ่มเวลาใน `/api/admin/login.js`:

```javascript
exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60), // 8 ชั่วโมง
```

---

## 📞 การติดต่อและแจ้งปัญหา

หากพบปัญหาหรือต้องการความช่วยเหลือ:

- ตรวจสอบ log files ก่อน
- บันทึก error message
- ระบุขั้นตอนที่ทำให้เกิดปัญหา

ระบบนี้ได้รับการออกแบบให้มีความปลอดภัยสูงและใช้งานง่าย เหมาะสำหรับการจัดการเนื้อหาเว็บไซต์รถมือสองขนาดเล็กถึงกลาง
