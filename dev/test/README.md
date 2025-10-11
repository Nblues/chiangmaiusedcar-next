# 🧪 Test Scripts

โฟลเดอร์นี้เก็บไฟล์ทดสอบและ utility scripts สำหรับการพัฒนา

## ไฟล์ในโฟลเดอร์

### 📍 `test-map-url.js`

ทดสอบการสร้าง Google Maps URL จากพิกัด

**วิธีใช้:**

```bash
node dev/test/test-map-url.js
```

### 📧 `test-emailjs-node.js`

ทดสอบการส่งอีเมลผ่าน EmailJS (Node.js version)

**วิธีใช้:**

```bash
node dev/test/test-emailjs-node.js
```

### 📧 `test-emailjs-console.js`

ทดสอบการตั้งค่า EmailJS ในคอนโซล

**วิธีใช้:**

```bash
node dev/test/test-emailjs-console.js
```

---

## ⚠️ หมายเหตุ

- ไฟล์เหล่านี้ใช้สำหรับ development เท่านั้น
- ไม่ได้ถูกรวมใน production build
- ต้องการ `.env.local` สำหรับการทดสอบบางอย่าง
