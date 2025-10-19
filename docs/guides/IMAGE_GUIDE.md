# 📷 วิธีการแทรกรูปภาพในบทความ - คู่มือละเอียด

## 🎯 ภาพรวมการแทรกรูปภาพ

ระบบรองรับการแทรกรูปภาพได้ **2 วิธี**:

1. **Image Gallery** - แนะนำ (จัดการรูปภาพแบบมืออาชีพ)
2. **Quick Insert** - แทรกรูปด่วน

---

## 🖼️ วิธีที่ 1: ใช้ Image Gallery (แนะนำ)

### ขั้นตอนที่ 1: เข้าสู่ระบบ Admin

1. ไปที่ `http://localhost:3000/admin`
2. Login: `admin` / `admin123`
3. คลิก **"เขียนบทความใหม่"** หรือแก้ไขบทความเดิม

### ขั้นตอนที่ 2: เปิด Image Gallery

ในหน้าแก้ไขบทความ:

1. มองหา **Rich Text Editor** (ช่องเขียนเนื้อหา)
2. ที่ Toolbar ด้านบน คลิกปุ่ม **"📷 คลังรูปภาพ"**
3. คลังรูปภาพจะเปิดขึ้นมา

### ขั้นตอนที่ 3: อัปโหลดรูปภาพ

1. คลิกปุ่ม **"+ เพิ่มรูปภาพ"** สีน้ำเงิน
2. เลือกไฟล์รูปภาพจากคอมพิวเตอร์ (เลือกได้หลายไฟล์)
3. รองรับไฟล์: **JPEG, PNG, GIF, WebP** (ขนาดไม่เกิน 5MB)
4. รูปภาพจะถูกปรับขนาดอัตโนมัติเป็น 800x600px สูงสุด
5. รอให้อัปโหลดเสร็จ (จะมีข้อความ "อัปโหลดรูปภาพสำเร็จ!")

### ขั้นตอนที่ 4: แทรกรูปภาพในบทความ

1. **วางเคอร์เซอร์** ในตำแหน่งที่ต้องการแทรกรูป (ในช่องเขียนเนื้อหา)
2. กลับไปที่ **Image Gallery**
3. **คลิกรูปภาพ** ที่ต้องการแทรก
4. รูปภาพจะถูกแทรกเป็น HTML code อัตโนมัติ:
   ```html
   <img src="/images/articles/ชื่อไฟล์.jpg" alt="ชื่อไฟล์" style="max-width: 100%; height: auto; margin: 10px 0;" />
   ```

### ขั้นตอนที่ 5: ดูตัวอย่าง

1. คลิกปุ่ม **"👁️ ดูตัวอย่าง"**
2. รูปภาพจะแสดงในบทความ
3. ถ้าพอใจแล้ว คลิก **"เผยแพร่"**

---

## ⚡ วิธีที่ 2: Quick Insert (แทรกด่วน)

### สำหรับผู้ที่ต้องการแทรกรูปแบบด่วน:

1. เตรียมไฟล์รูปภาพไว้
2. ในช่องเขียนเนื้อหา พิมพ์ HTML code เอง:
   ```html
   <img src="/images/articles/my-image.jpg" alt="คำอธิบายรูป" style="max-width: 100%; height: auto; margin: 10px 0;" />
   ```
3. เปลี่ยน `my-image.jpg` เป็นชื่อไฟล์จริง
4. เปลี่ยน `คำอธิบายรูป` เป็นคำอธิบายที่เหมาะสม

---

## 🎨 การปรับแต่งรูปภาพ

### ขนาดรูปภาพ

```html
<!-- รูปขนาดเต็ม (100%) -->
<img src="/images/articles/image.jpg" alt="รูปขนาดเต็ม" style="width: 100%; height: auto;" />

<!-- รูปขนาดครึ่งหนึ่ง (50%) -->
<img src="/images/articles/image.jpg" alt="รูปขนาดกลาง" style="width: 50%; height: auto;" />

<!-- รูปขนาดเล็ก (300px) -->
<img src="/images/articles/image.jpg" alt="รูปขนาดเล็ก" style="width: 300px; height: auto;" />
```

### การจัดวางรูปภาพ

```html
<!-- รูปอยู่กึ่งกลาง -->
<img src="/images/articles/image.jpg" alt="รูปกึ่งกลาง" style="display: block; margin: 0 auto; max-width: 100%;" />

<!-- รูปชิดซ้าย -->
<img src="/images/articles/image.jpg" alt="รูปซ้าย" style="float: left; margin: 0 15px 15px 0; max-width: 300px;" />

<!-- รูปชิดขวา -->
<img src="/images/articles/image.jpg" alt="รูปขวา" style="float: right; margin: 0 0 15px 15px; max-width: 300px;" />
```

### เพิ่มกรอบรูป

```html
<img
  src="/images/articles/image.jpg"
  alt="รูปมีกรอบ"
  style="border: 2px solid #ddd; border-radius: 8px; padding: 5px; max-width: 100%;"
/>
```

---

## 📋 ตัวอย่างการใช้งานจริง

### ตัวอย่างที่ 1: บทความรีวิวรถ

```html
<h2>รีวิว Honda City 2024</h2>
<p>Honda City รุ่นใหม่ล่าสุด มาพร้อมการปรับปรุงใหม่ทั้งภายในและภายนอก</p>

<img
  src="/images/articles/honda-city-exterior.jpg"
  alt="Honda City 2024 ภายนอก"
  style="width: 100%; height: auto; margin: 20px 0;"
/>

<h3>ภายในรถ</h3>
<p>ห้องโดยสารกว้างขวาง พร้อมเทคโนโลยีที่ทันสมัย</p>

<img
  src="/images/articles/honda-city-interior.jpg"
  alt="Honda City 2024 ภายใน"
  style="width: 100%; height: auto; margin: 20px 0;"
/>
```

### ตัวอย่างที่ 2: เปรียบเทียบรถ 2 รุ่น

```html
<h2>Honda City vs Toyota Vios</h2>

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div style="flex: 1;">
    <h3>Honda City</h3>
    <img src="/images/articles/honda-city.jpg" alt="Honda City" style="width: 100%; height: auto;" />
    <p>ราคา: 599,000 บาท</p>
  </div>
  <div style="flex: 1;">
    <h3>Toyota Vios</h3>
    <img src="/images/articles/toyota-vios.jpg" alt="Toyota Vios" style="width: 100%; height: auto;" />
    <p>ราคา: 539,000 บาท</p>
  </div>
</div>
```

---

## 🛠️ การจัดการรูปภาพใน Gallery

### การเลือกหลายรูป

- กด **Ctrl + คลิก** เพื่อเลือกหลายรูป
- ปุ่ม "ลบที่เลือก" จะปรากฏขึ้น

### การลบรูปภาพ

- **ลบรูปเดียว**: คลิก 🗑️ ที่รูปภาพ
- **ลบหลายรูป**: เลือกหลายรูป → คลิก "ลบที่เลือก"

### การดูข้อมูลรูปภาพ

- ชื่อไฟล์แสดงใต้รูป
- ขนาดไฟล์แสดงเป็น KB
- วันที่อัปโหลดเก็บไว้ใน metadata

---

## 📱 การใช้งานบนมือถือ

ระบบ Image Gallery รองรับการใช้งานบนมือถือ:

- **อัปโหลดรูป**: แตะ "+ เพิ่มรูปภาพ"
- **เลือกจากแกลลอรี่**: ใช้ camera roll ของมือถือ
- **ถ่ายรูปใหม่**: ใช้กล้องมือถือ
- **แทรกรูป**: แตะรูปที่ต้องการ

---

## ⚠️ ข้อควรระวัง

### ขนาดไฟล์

- **สูงสุด 5MB** ต่อไฟล์
- ไฟล์ใหญ่จะทำให้เว็บโหลดช้า
- แนะนำบีบอัดรูปก่อนอัปโหลด

### ประเภทไฟล์

- ✅ **JPEG** - เหมาะสำหรับรูปถ่าย
- ✅ **PNG** - เหมาะสำหรับรูปที่มีความใส
- ✅ **WebP** - ไฟล์เล็ก คุณภาพดี
- ✅ **GIF** - เหมาะสำหรับภาพเคลื่อนไหว
- ❌ **BMP, TIFF** - ไม่รองรับ

### การตั้งชื่อไฟล์

- ใช้ภาษาอังกฤษหรือตัวเลข
- หลีกเลี่ยงเครื่องหมายพิเศษ
- ตัวอย่างที่ดี: `honda-city-2024.jpg`
- ตัวอย่างที่ไม่ดี: `รูป รถ (ใหม่).jpg`

---

## 🔧 การแก้ปัญหา

### รูปภาพไม่แสดง

1. **ตรวจสอบชื่อไฟล์** ใน HTML code
2. **รีเฟรชหน้าเว็บ** (F5)
3. **ลบ browser cache**
4. **อัปโหลดรูปใหม่**

### อัปโหลดไม่ได้

1. **ตรวจสอบขนาดไฟล์** (ต้องไม่เกิน 5MB)
2. **ตรวจสอบประเภทไฟล์** (ต้องเป็น JPEG, PNG, GIF, WebP)
3. **ลองไฟล์อื่น**

### รูปภาพโหลดช้า

1. **บีบอัดรูป** ก่อนอัปโหลด
2. **ใช้ไฟล์ WebP** แทน JPEG
3. **ลดขนาดรูป** ให้เหมาะสม

---

## 🎯 เทคนิคการใช้งานมืออาชีพ

### 1. การจัดเรียงรูปภาพ

```html
<!-- Gallery แนวนอน -->
<div style="display: flex; gap: 10px; overflow-x: auto; margin: 20px 0;">
  <img src="/images/articles/car1.jpg" alt="รถคันที่ 1" style="min-width: 300px; height: 200px; object-fit: cover;" />
  <img src="/images/articles/car2.jpg" alt="รถคันที่ 2" style="min-width: 300px; height: 200px; object-fit: cover;" />
  <img src="/images/articles/car3.jpg" alt="รถคันที่ 3" style="min-width: 300px; height: 200px; object-fit: cover;" />
</div>
```

### 2. รูปพร้อมคำบรรยาย

```html
<figure style="margin: 20px 0; text-align: center;">
  <img src="/images/articles/engine.jpg" alt="เครื่องยนต์ Honda" style="max-width: 100%; height: auto;" />
  <figcaption style="margin-top: 8px; font-style: italic; color: #666;">
    เครื่องยนต์ VTEC Turbo ขนาด 1.0 ลิตร
  </figcaption>
</figure>
```

### 3. รูปแบบ Before/After

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
  <div>
    <h4>ก่อนปรับปรุง</h4>
    <img src="/images/articles/before.jpg" alt="ก่อนปรับปรุง" style="width: 100%; height: auto;" />
  </div>
  <div>
    <h4>หลังปรับปรุง</h4>
    <img src="/images/articles/after.jpg" alt="หลังปรับปรุง" style="width: 100%; height: auto;" />
  </div>
</div>
```

---

## 📞 ต้องการความช่วยเหลือ?

หากมีปัญหาการใช้งาน:

1. ดู **ตัวอย่างการใช้งาน** ที่ `http://localhost:3000/html-examples.html`
2. อ่าน **USER_GUIDE.md** สำหรับข้อมูลเพิ่มเติม
3. ทดสอบกับรูปภาพขนาดเล็กก่อน

**🎨 ขอให้สนุกกับการสร้างบทความที่สวยงาม!**
