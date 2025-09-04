# การแก้ไขปัญหา reCAPTCHA "Invalid key type"

## สาเหตุของปัญหา

Error "Invalid key type" เกิดขึ้นเมื่อ:

1. **reCAPTCHA Version ไม่ตรงกัน**

   - ใช้ v2 key กับ v3 widget หรือกลับกัน
   - Site key และ Secret key มาจากเวอร์ชันต่างกัน

2. **Domain ไม่ตรงกัน**

   - Site key ลงทะเบียนสำหรับ domain อื่น
   - localhost ไม่ได้อยู่ในรายการ authorized domains

3. **Key ผิดประเภท**
   - ใช้ Secret key แทน Site key หรือกลับกัน
   - Key bị hỏng hoặือคัดลอกไม่ครบ

## วิธีแก้ไข

### 1. ใช้ Google Test Keys (สำหรับการทดสอบ)

```bash
# ใน .env.local
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

Test keys เหล่านี้:

- ✅ ใช้ได้กับทุกโดเมน
- ✅ ผ่าน verification เสมอ
- ✅ เหมาะสำหรับการทดสอบ

### 2. สร้าง reCAPTCHA Keys ใหม่

1. ไปที่ https://www.google.com/recaptcha/admin/create
2. เลือก **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
3. เพิ่ม domains:
   ```
   localhost
   127.0.0.1
   chiangmaiusedcar.com
   your-production-domain.com
   ```
4. คัดลอก Site Key และ Secret Key

### 3. ตรวจสอบการตั้งค่า

```javascript
// ตรวจสอบใน browser console
console.log('Site Key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

// ควรเห็น key ที่ขึ้นต้นด้วย 6L...
```

### 4. ใช้ Test Page

เข้าไปที่ `http://localhost:3000/test-recaptcha` เพื่อ:

- ตรวจสอบการโหลด reCAPTCHA
- ทดสอบ verification
- ดู detailed logs

## Code ที่ปรับปรุงแล้ว

### Error Handling ใน ReCAPTCHA Component

```jsx
<ReCAPTCHA
  sitekey={RECAPTCHA_SITEKEY}
  onChange={setCaptcha}
  onErrored={() => {
    console.error('reCAPTCHA error occurred');
    // แสดงข้อความข้อผิดพลาด
  }}
  onExpired={() => {
    setCaptcha(null);
    // แจ้งให้ทำใหม่
  }}
/>
```

### API Verification ที่มี Debug Logs

```javascript
// pages/api/verify-recaptcha.js
console.log('Verifying reCAPTCHA with secret key:', secretKey.substring(0, 10) + '...');
console.log('reCAPTCHA response:', data);
```

## การทดสอบ

### Test Checklist

- [ ] reCAPTCHA widget โหลดได้
- [ ] ไม่มี "Invalid key type" error
- [ ] สามารถทำ checkbox ได้
- [ ] Verification ผ่าน API ได้
- [ ] Form ส่งได้สำเร็จ

### Debug Commands

```bash
# ตรวจสอบ environment variables
echo $NEXT_PUBLIC_RECAPTCHA_SITE_KEY

# รีสตาร์ทเซิร์ฟเวอร์
pnpm dev
```

## สำหรับ Production

### Vercel Environment Variables

```bash
# ใน Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_production_site_key
RECAPTCHA_SECRET_KEY=your_production_secret_key
```

### Security Best Practices

1. **ไม่ hardcode keys ในโค้ด**
2. **ใช้ Environment Variables เสมอ**
3. **ตั้งค่า Domain restrictions ใน reCAPTCHA console**
4. **เปิด logging สำหรับ production debugging**

## การติดต่อสำหรับการสนับสนุน

- reCAPTCHA Issues: [Google reCAPTCHA Help](https://developers.google.com/recaptcha/docs/faq)
- ปัญหาเทคนิค: ตรวจสอบ browser console และ server logs
- Test Page: `/test-recaptcha` สำหรับการวินิจฉัย

## คำแนะนำเพิ่มเติม

- ใช้ Test Keys สำหรับ development
- สร้าง Production Keys สำหรับ live site
- ตรวจสอบ Network tab ใน DevTools หากมีปัญหา
- ลบ browser cache ถ้า reCAPTCHA ไม่โหลด
