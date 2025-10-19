# 🚀 วิธีทดสอบ Page Speed - ChiangMai Used Car

**วันที่:** 11 ตุลาคม 2025  
**เว็บไซต์:** https://www.chiangmaiusedcar.com

---

## 📊 วิธีที่ 1: Google PageSpeed Insights (แนะนำ)

### ขั้นตอน:

1. **เปิดเว็บเบราว์เซอร์**

2. **ไปที่ PageSpeed Insights:**

   ```
   https://pagespeed.web.dev/
   ```

3. **ใส่ URL:**

   ```
   https://www.chiangmaiusedcar.com/
   ```

4. **กดปุ่ม "Analyze"**

5. **รอผลการทดสอบ** (ประมาณ 30-60 วินาที)

6. **ดูคะแนน 4 หมวด:**
   - 🟢 Performance (ประสิทธิภาพ)
   - 🟢 Accessibility (การเข้าถึง)
   - 🟢 Best Practices (แนวทางปฏิบัติที่ดี)
   - 🟢 SEO

---

## 📱 วิธีที่ 2: Google Search Console (แนะนำสำหรับ Core Web Vitals)

### ขั้นตอน:

1. **เข้า Google Search Console:**

   ```
   https://search.google.com/search-console
   ```

2. **เลือก Property:** www.chiangmaiusedcar.com

3. **ไปที่เมนูด้านซ้าย:**

   ```
   Experience → Core Web Vitals
   ```

4. **ดูรายงาน 2 แท็บ:**

   - **Mobile** (มือถือ)
   - **Desktop** (คอมพิวเตอร์)

5. **ตรวจสอบสถานะ:**

   - 🟢 Good URLs (URLs ที่ผ่านเกณฑ์)
   - 🟡 Needs Improvement (ต้องปรับปรุง)
   - 🔴 Poor URLs (ไม่ผ่านเกณฑ์)

6. **คลิกดูรายละเอียด:**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

---

## 🔍 วิธีที่ 3: Chrome DevTools Lighthouse

### ขั้นตอน:

1. **เปิดเว็บไซต์ในเบราว์เซอร์ Chrome:**

   ```
   https://www.chiangmaiusedcar.com/
   ```

2. **เปิด DevTools:**

   - กด `F12` หรือ
   - คลิกขวา → "Inspect" หรือ
   - `Ctrl + Shift + I` (Windows)
   - `Cmd + Option + I` (Mac)

3. **ไปที่แท็บ "Lighthouse"**

   - ถ้าไม่เห็น ให้กด >> แล้วเลือก Lighthouse

4. **เลือกการตั้งค่า:**

   - **Mode:** Navigation (default)
   - **Device:** Mobile หรือ Desktop
   - **Categories:** เลือกทั้ง 4
     - ✅ Performance
     - ✅ Accessibility
     - ✅ Best Practices
     - ✅ SEO

5. **กด "Analyze page load"**

6. **รอผลการทดสอบ** (30-60 วินาที)

7. **ดูรายงานโดยละเอียด:**
   - คะแนนแต่ละหมวด
   - Metrics (LCP, FID, CLS, FCP, TBT, Speed Index)
   - ปัญหาที่พบ
   - คำแนะนำการแก้ไข

---

## 🌐 วิธีที่ 4: WebPageTest (สำหรับการทดสอบละเอียด)

### ขั้นตอน:

1. **เปิดเว็บ:**

   ```
   https://www.webpagetest.org/
   ```

2. **ใส่ URL:**

   ```
   https://www.chiangmaiusedcar.com/
   ```

3. **เลือกการตั้งค่า:**

   - **Test Location:** จังหวัดใกล้เคียง (เช่น Bangkok, Thailand)
   - **Browser:** Chrome
   - **Connection:** Cable (Fast) หรือ Mobile 4G

4. **กด "Start Test"**

5. **รอผลการทดสอบ** (อาจใช้เวลา 1-2 นาที)

6. **ดูรายงาน:**
   - Performance Grade
   - Load Time
   - First Byte
   - Start Render
   - Speed Index
   - Waterfall view (แสดงการโหลดแต่ละ resource)

---

## 📋 วิธีที่ 5: ติดตั้ง Lighthouse CLI (สำหรับนักพัฒนา)

### ขั้นตอนการติดตั้ง:

```powershell
# 1. ตรวจสอบ Node.js (ต้องมีก่อน)
node --version

# 2. ติดตั้ง Lighthouse
npm install -g lighthouse

# หรือใช้ pnpm
pnpm add -g lighthouse
```

### วิธีใช้งาน:

```powershell
# ทดสอบ Mobile
lighthouse https://www.chiangmaiusedcar.com/ --preset=mobile --view

# ทดสอบ Desktop
lighthouse https://www.chiangmaiusedcar.com/ --preset=desktop --view

# ทดสอบและบันทึกเป็น JSON
lighthouse https://www.chiangmaiusedcar.com/ --output=json --output-path=./report.json

# ทดสอบและบันทึกเป็น HTML
lighthouse https://www.chiangmaiusedcar.com/ --output=html --output-path=./report.html

# ทดสอบหลายหน้าพร้อมกัน
lighthouse https://www.chiangmaiusedcar.com/ --view
lighthouse https://www.chiangmaiusedcar.com/all-cars --view
lighthouse https://www.chiangmaiusedcar.com/about --view
lighthouse https://www.chiangmaiusedcar.com/contact --view
```

---

## 🎯 เป้าหมายคะแนน

### PageSpeed Insights / Lighthouse

| หมวด           | เป้าหมาย | สีที่ต้องการ |
| -------------- | -------- | ------------ |
| Performance    | 90-100   | 🟢 เขียว     |
| Accessibility  | 90-100   | 🟢 เขียว     |
| Best Practices | 90-100   | 🟢 เขียว     |
| SEO            | 90-100   | 🟢 เขียว     |

### Core Web Vitals

| Metric                             | เป้าหมาย | สถานะที่ต้องการ |
| ---------------------------------- | -------- | --------------- |
| **LCP** (Largest Contentful Paint) | < 2.5s   | 🟢 Good         |
| **FID** (First Input Delay)        | < 100ms  | 🟢 Good         |
| **CLS** (Cumulative Layout Shift)  | < 0.1    | 🟢 Good         |

### ตัวชี้วัดเพิ่มเติม

| Metric                           | เป้าหมาย |
| -------------------------------- | -------- |
| **FCP** (First Contentful Paint) | < 1.8s   |
| **TBT** (Total Blocking Time)    | < 200ms  |
| **Speed Index**                  | < 3.4s   |

---

## 📊 วิธีอ่านผลลัพธ์

### คะแนน Performance

- **90-100** 🟢 = ยอดเยี่ยม (Excellent)
- **50-89** 🟡 = ต้องปรับปรุง (Needs Improvement)
- **0-49** 🔴 = ต่ำ (Poor)

### Core Web Vitals Status

- **🟢 Good** = ผ่านเกณฑ์
- **🟡 Needs Improvement** = ต้องปรับปรุง
- **🔴 Poor** = ไม่ผ่านเกณฑ์

### ส่วนสำคัญที่ต้องดู

1. **Performance Score** (คะแนนประสิทธิภาพ)

   - ดูเป็นตัวแรก
   - เป้าหมาย: 90+

2. **Metrics** (ตัวชี้วัด)

   - **LCP** - ความเร็วในการโหลดเนื้อหาหลัก
   - **TBT** - เวลาที่หน้าจอค้าง
   - **CLS** - การเลื่อนของเนื้อหา

3. **Opportunities** (โอกาสในการปรับปรุง)

   - แสดงปัญหาที่สามารถแก้ไขได้
   - เรียงตามผลกระทบ (KB/ms ที่จะประหยัดได้)

4. **Diagnostics** (การวินิจฉัย)
   - ปัญหาที่พบเพิ่มเติม
   - คำแนะนำการแก้ไข

---

## 🔄 แนวทางการทดสอบ

### ทดสอบบ่อยครั้ง:

1. **หลังจาก Deploy ใหม่** (ทุกครั้ง)

   - ทดสอบทันทีหลัง push to production
   - เปรียบเทียบกับผลก่อนหน้า

2. **ทุกสัปดาห์** (Routine Check)

   - ตรวจสอบ Core Web Vitals ใน GSC
   - ดูว่ามี URLs ที่มีปัญหาใหม่หรือไม่

3. **ทุกเดือน** (Comprehensive Audit)
   - รัน Lighthouse ทุกหน้าสำคัญ
   - วิเคราะห์ trends
   - สร้าง action plan สำหรับเดือนถัดไป

### หน้าที่ควรทดสอบ:

1. **Homepage** (หน้าแรก)

   ```
   https://www.chiangmaiusedcar.com/
   ```

2. **All Cars** (หน้ารถทั้งหมด)

   ```
   https://www.chiangmaiusedcar.com/all-cars
   ```

3. **Car Detail** (หน้ารายละเอียดรถ)

   ```
   https://www.chiangmaiusedcar.com/car/[handle]
   ```

   - ทดสอบ 2-3 รถที่มี view สูง

4. **About** (เกี่ยวกับเรา)

   ```
   https://www.chiangmaiusedcar.com/about
   ```

5. **Contact** (ติดต่อ)
   ```
   https://www.chiangmaiusedcar.com/contact
   ```

---

## 📝 บันทึกผลการทดสอบ

### Template สำหรับบันทึก:

```markdown
## ผลการทดสอบ Page Speed

**วันที่:** [วัน/เดือน/ปี] **เวลา:** [เวลา] **URL:** https://www.chiangmaiusedcar.com/ **อุปกรณ์:** Mobile / Desktop

### คะแนน

- Performance: [คะแนน]/100
- Accessibility: [คะแนน]/100
- Best Practices: [คะแนน]/100
- SEO: [คะแนน]/100

### Core Web Vitals

- LCP: [เวลา] s
- FID: [เวลา] ms
- CLS: [คะแนน]

### ปัญหาที่พบ

1. [ปัญหาที่ 1]
2. [ปัญหาที่ 2]

### แผนการแก้ไข

1. [วิธีแก้ที่ 1]
2. [วิธีแก้ที่ 2]
```

---

## 🚀 เริ่มทดสอบเลย!

**ขั้นตอนแรกที่แนะนำ:**

1. เปิด https://pagespeed.web.dev/
2. ใส่ URL: https://www.chiangmaiusedcar.com/
3. กด "Analyze"
4. รอผลลัพธ์
5. บันทึกคะแนน
6. อ่านคำแนะนำและแก้ไข

**Good luck! 🎯**

---

**วันที่สร้างเอกสาร:** 11 ตุลาคม 2025  
**Project:** ChiangMai Used Car - Next.js
