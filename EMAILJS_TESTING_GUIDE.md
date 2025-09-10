# 🧪 การทดสอบ EmailJS Credit Check Form

## 📋 **ขั้นตอนการทดสอบ**

### **1. เปิด Development Server**

```bash
cd "c:\project davelopper\chiangmaiusedcar-setup"
pnpm dev
```

### **2. เข้าไปหน้าทดสอบ**

**Option A: หน้าทดสอบ EmailJS**

- URL: http://localhost:3000/test-emailjs
- วัตถุประสงค์: ทดสอบการส่งอีเมลอย่างง่าย
- คลิก "ทดสอบ EmailJS" และดูผลลัพธ์

**Option B: หน้า Credit Check Form**

- URL: http://localhost:3000/credit-check
- วัตถุประสงค์: ทดสอบฟอร์มจริง
- กรอกข้อมูลและส่งฟอร์ม

### **3. เปิด Browser DevTools**

1. กด `F12` หรือ `Ctrl+Shift+I`
2. เข้าไปแท็บ "Console"
3. เข้าไปแท็บ "Network"
4. ทำการทดสอบส่งฟอร์ม

## 🔍 **สิ่งที่ต้องดูใน Console**

### **✅ Configuration Check**

ควรเห็นข้อความ:

```
EmailJS config: {
  serviceId: "service_qlcksif",
  templateId: "template_zd6e3f6",
  publicKey: "SET"
}
```

### **📤 Data Being Sent**

ควรเห็นข้อความ:

```
Sending data to EmailJS: {
  name: "ชื่อที่กรอก",
  phone: "เบอร์ที่กรอก",
  ...
}
```

### **✅ Success Response**

ถ้าสำเร็จจะเห็น:

```
EmailJS result: {
  status: 200,
  text: "OK"
}
```

### **❌ Error Response**

ถ้าไม่สำเร็จจะเห็น:

```
Form submission error: [รายละเอียด error]
```

## 🌐 **Network Tab Analysis**

### **ดู HTTP Request**

1. เปิด Network tab
2. ส่งฟอร์ม
3. ดู request ไป `https://api.emailjs.com/api/v1.0/email/send`

### **สถานะที่ควรเห็น**

- **200 OK**: สำเร็จ ✅
- **400 Bad Request**: ข้อมูลไม่ถูกต้อง ❌
- **401 Unauthorized**: Public key ไม่ถูกต้อง ❌
- **403 Forbidden**: Domain ไม่ได้รับอนุญาต ❌
- **429 Too Many Requests**: ส่งเยอะเกินไป ❌

## 📝 **ข้อมูลทดสอบ (ตัวอย่าง)**

```
ชื่อ-นามสกุล: ทดสอบ ระบบ
เบอร์โทรศัพท์: 0812345678
เพศ: ชาย
อายุ: 30
อาชีพ: พนักงานบริษัท
จังหวัด: เชียงใหม่
สถานะเครดิต: เครดิตดี
เงินดาวน์: ฟรีดาวน์
✅ ยอมรับนโยบายความเป็นส่วนตัว
```

## 🚨 **Common Errors & Solutions**

### **1. "EmailJS configuration missing"**

**สาเหตุ**: Environment variables ไม่ load **แก้ไข**: ตรวจสอบ .env.local และ restart server

### **2. "Failed to fetch"**

**สาเหตุ**: Network/CORS issues **แก้ไข**: ตรวจสอบอินเทอร์เน็ต และ EmailJS domain settings

### **3. "400 Bad Request"**

**สาเหตุ**: Template variables ไม่ตรงกัน **แก้ไข**: ตรวจสอบ EmailJS template ใน dashboard

### **4. "401/403 Unauthorized/Forbidden"**

**สาเหตุ**: Public key หรือ domain ไม่ถูกต้อง **แก้ไข**: ตรวจสอบ EmailJS API Keys และ allowed domains

## 📊 **EmailJS Dashboard Check**

### **ตรวจสอบ Service**

1. ไปที่ https://dashboard.emailjs.com
2. เข้า "Email Services"
3. ตรวจสอบ service_qlcksif ว่าทำงาน

### **ตรวจสอบ Template**

1. เข้า "Email Templates"
2. ดู template_zd6e3f6
3. ตรวจสอบ variables: {{name}}, {{phone}}, {{career}}, etc.

### **ตรวจสอบ Usage**

1. เข้า "Usage"
2. ดูจำนวนอีเมลที่ส่งไปแล้ว
3. ตรวจสอบว่าไม่เกิน limit

## ✅ **Test Checklist**

### **Configuration Tests**

- [ ] Environment variables loaded correctly
- [ ] EmailJS service ID valid
- [ ] Template ID exists
- [ ] Public key works

### **Form Tests**

- [ ] Required field validation works
- [ ] Career-specific fields show/hide correctly
- [ ] Honeypot anti-spam works
- [ ] Privacy consent validation works

### **Email Tests**

- [ ] Basic data sends successfully
- [ ] Career-specific data includes correctly
- [ ] Thai characters display properly
- [ ] Timestamp formats correctly

### **Error Tests**

- [ ] Network error shows proper message
- [ ] Invalid data shows specific error
- [ ] Missing fields show field-specific error
- [ ] EmailJS errors show helpful message

## 🎯 **Success Criteria**

หากทุกอย่างทำงานถูกต้อง:

1. ✅ **Form submits successfully**
2. ✅ **User sees success message**
3. ✅ **Form resets after submission**
4. ✅ **Email arrives in target inbox**
5. ✅ **All form data included in email**
6. ✅ **Thai characters display correctly**

## 📞 **หากยังมีปัญหา**

### **Immediate Actions**

1. ตรวจสอบ console errors
2. ตรวจสอบ network requests
3. ลองส่งอีกครั้งหลัง 5 นาที (rate limiting)

### **EmailJS Dashboard**

1. ตรวจสอบ service status
2. ตรวจสอบ template configuration
3. ตรวจสอบ account usage/limits

### **Alternative Solutions**

1. ใช้ API routes แทน client-side
2. ใช้ alternative email service
3. เพิ่ม fallback contact methods

---

**📝 การทดสอบนี้จะช่วยระบุปัญหาและแก้ไขได้อย่างแม่นยำ**
