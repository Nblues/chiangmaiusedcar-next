# 🛠️ Development Tools

เครื่องมือสำหรับพัฒนาและทดสอบ - **ไม่ได้ deploy ขึ้น production**

## 📁 โครงสร้าง

### `/testing`

ไฟล์ HTML สำหรับทดสอบและ debug ต่างๆ:

#### Favicon & Logo Testing

- `favicon-preview.html` - ดู favicon ทั้งหมด
- `favicon-check.html` - ตรวจสอบ favicon
- `favicon-comparison.html` - เปรียบเทียบ favicon
- `favicon-current-view.html` - ดู favicon ปัจจุบัน
- `favicon-logo-preview.html` - preview favicon + logo
- `logo-preview.html` - ดูโลโก้ทั้งหมด

#### Social Media Testing

- `social-sharing-test.html` - ทดสอบการแชร์ social media
- `test-social-meta.html` - ตรวจสอบ meta tags
- `og-image.html` - ทดสอบ Open Graph images

#### Debug Tools

- `debug-console.html` - debug console errors
- `debug-images.html` - debug รูปภาพ
- `debug-social.html` - debug social sharing
- `console-errors-explained.html` - อธิบาย errors

#### PWA & Manifest

- `test-manifest.html` - ทดสอบ PWA manifest
- `test-sw.html` - ทดสอบ service worker

#### Image Tools

- `images.html` - รายการรูปภาพทั้งหมด
- `create-sample-image.html` - สร้างรูป sample
- `create-test-images.html` - สร้างรูปทดสอบ

#### HTML Examples

- `html-examples.html` - ตัวอย่าง HTML components

---

## 🚀 การใช้งาน

### วิธีเปิดไฟล์:

#### Option 1: Live Server (แนะนำ)

```bash
# เปิดด้วย VS Code Live Server
# คลิกขวาไฟล์ → "Open with Live Server"
```

#### Option 2: Direct File

```bash
# เปิดไฟล์โดยตรง
start dev-tools/testing/favicon-preview.html
```

#### Option 3: Local Server

```bash
# สร้าง simple server
cd dev-tools/testing
python -m http.server 8080
# เปิด http://localhost:8080
```

---

## 📝 หมายเหตุ

- ✅ ไฟล์เหล่านี้**ไม่ได้ deploy** ขึ้น Vercel (blocked โดย `.vercelignore`)
- ✅ ไม่กระทบประสิทธิภาพเว็บไซต์
- ✅ ใช้สำหรับพัฒนาและ debug เท่านั้น
- ⚠️ อย่าลบ - อาจต้องใช้ในอนาคต

---

## 🔒 Security

ไฟล์เหล่านี้:

- ❌ ไม่มีข้อมูล sensitive
- ❌ ไม่เชื่อมต่อ API จริง
- ✅ ปลอดภัย 100%
