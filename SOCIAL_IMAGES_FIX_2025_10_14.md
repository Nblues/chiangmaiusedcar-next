# 🖼️ แก้ไขรูปแชร์ลิงก์ให้ตรงกับรูปจริง - 14 ตุลาคม 2025

## 📋 ปัญหาที่พบ

รูปภาพที่แสดงเมื่อแชร์ลิงก์ (Open Graph images) ไม่ตรงกับรูปที่แสดงจริงในเว็บไซต์

## ✅ การแก้ไข

อัปเดต `lib/social-sharing.js` ให้ตรงกับรูปที่ใช้จริงในแต่ละหน้า:

### เปรียบเทียบก่อน - หลัง

| หน้า             | รูปเดิม (ผิด)           | รูปใหม่ (ถูกต้อง)        | สถานะ          |
| ---------------- | ----------------------- | ------------------------ | -------------- |
| **หน้าแรก**      | `chiangmaiusedcar.webp` | `cnxcar.webp`            | ✅ แก้แล้ว     |
| **รถทั้งหมด**    | `allusedcars.webp`      | `cnxallcar.webp`         | ✅ แก้แล้ว     |
| **ขายรถ**        | _(ไม่มี)_               | `chiangmaiusedcars.webp` | ✅ เพิ่มแล้ว   |
| **เกี่ยวกับเรา** | `team.webp`             | `team.webp`              | ✅ ถูกต้องแล้ว |
| **โปรโมชั่น**    | `promotion.webp`        | `cnxcontact.webp`        | ✅ แก้แล้ว     |
| **ติดต่อ**       | `contact.webp`          | `contact.webp`           | ✅ ถูกต้องแล้ว |
| **เช็คเครดิต**   | `kn2carbanner2.webp`    | `outdoorbanner.webp`     | ✅ แก้แล้ว     |
| **คำนวณค่างวด**  | `kn2carbanner2.webp`    | `paymentcalculator.webp` | ✅ แก้แล้ว     |

## 🔍 วิธีตรวจสอบ

### 1. ทดสอบใน Local

```bash
# เปิด dev server
pnpm dev

# เข้าหน้าทดสอบ
http://localhost:3000/test-social-images
```

### 2. ทดสอบใน Production

#### Facebook Sharing Debugger

```
https://developers.facebook.com/tools/debug/
```

1. ใส่ URL ของแต่ละหน้า
2. กด "Scrape Again" 2-3 ครั้ง
3. ตรวจสอบว่ารูปตรงกับรูปในเว็บ

#### Twitter Card Validator

```
https://cards-dev.twitter.com/validator
```

#### LinkedIn Post Inspector

```
https://www.linkedin.com/post-inspector/
```

## 📱 หากรูปยังไม่อัปเดต

### Facebook/LINE Cache

Facebook และ LINE มักจะ cache รูปเก่าไว้ วิธีแก้:

1. **เปิด Facebook Debugger**

   - ใส่ URL: `https://www.chiangmaiusedcar.com/`
   - กด "Scrape Again"
   - รอ 5-10 วินาที
   - กด "Scrape Again" อีกครั้ง (2-3 ครั้ง)

2. **Clear Browser Cache**

   - กด `Ctrl + Shift + Delete`
   - เลือก "Cached images and files"
   - Clear data

3. **ทดสอบใน Incognito Mode**
   - กด `Ctrl + Shift + N` (Chrome)
   - ทดสอบแชร์ลิงก์ใหม่

## 🚀 Deploy ไป Production

```powershell
# 1. Commit changes
git add lib/social-sharing.js
git commit -m "🖼️ Fix social sharing images to match actual page images"

# 2. Push to repository
git push origin master

# 3. Vercel จะ auto-deploy หรือ
vercel --prod
```

## 📊 ตรวจสอบหลัง Deploy

### ✅ Checklist

- [ ] หน้าแรก - แชร์แล้วเห็นรูป `cnxcar.webp`
- [ ] รถทั้งหมด - แชร์แล้วเห็นรูป `cnxallcar.webp`
- [ ] ขายรถ - แชร์แล้วเห็นรูป `chiangmaiusedcars.webp`
- [ ] เกี่ยวกับเรา - แชร์แล้วเห็นรูป `team.webp`
- [ ] โปรโมชั่น - แชร์แล้วเห็นรูป `cnxcontact.webp`
- [ ] ติดต่อ - แชร์แล้วเห็นรูป `contact.webp`
- [ ] เช็คเครดิต - แชร์แล้วเห็นรูป `outdoorbanner.webp`
- [ ] คำนวณค่างวด - แชร์แล้วเห็นรูป `paymentcalculator.webp`

### 🔧 เครื่องมือทดสอบ

1. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. [Twitter Card Validator](https://cards-dev.twitter.com/validator)
3. [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
4. [Open Graph Check](https://opengraphcheck.com/)

## 💡 หมายเหตุ

- **Cache Busting**: ระบบใช้ `?v=${timestamp}` เพื่อบังคับให้โหลดรูปใหม่
- **Build Time**: timestamp จะเปลี่ยนทุกครั้งที่ build ใหม่
- **CDN Cache**: Vercel อาจต้อง clear edge cache ด้วยตนเอง

## 📝 Related Files

- `lib/social-sharing.js` - กำหนดรูปสำหรับแต่ละหน้า
- `components/SEO.jsx` - Component หลักสำหรับ SEO tags
- `pages/test-social-images.jsx` - หน้าทดสอบรูปแชร์

---

**วันที่แก้ไข:** 14 ตุลาคม 2025  
**ผู้แก้ไข:** GitHub Copilot  
**สถานะ:** ✅ แก้ไขเสร็จสมบูรณ์
