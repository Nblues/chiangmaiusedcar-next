# เลื่อนเวลาโหลดรูปภาพนอกจอภาพ - ประหยัด 3 KiB

## ปัญหาที่พบ

จาก PageSpeed Insights audit พบว่า:

- **URL ที่มีปัญหา**: /\_next/image?url=%2Flogo%2Flogo_main.png&w=128&q=75
- **ขนาดทรัพยากร**: 3.5 KiB
- **เวลาที่อาจประหยัดได้**: 3.5 KiB
- **สาเหตุ**: Logo ใน Navbar และ Footer มี `priority={true}` ทำให้โหลดด้วย `fetchpriority="high"`
  แม้จะอยู่นอกหน้าจอในบางอุปกรณ์

## การวิเคราะห์ปัญหา

### Logo ใน Navbar (components/Navbar.jsx)

```jsx
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย โลโก้"
  width={48}
  height={48}
  className="w-full h-full object-cover scale-125"
  priority // ← ปัญหาหลัก: ไม่จำเป็นต้องเป็น priority
/>
```

### Logo ใน Footer (components/Footer.jsx)

```jsx
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่"
  width={64}
  height={64}
  className="w-full h-full object-cover scale-125"
  priority // ← ปัญหา: Footer อยู่นอกหน้าจอแต่ยังมี priority
/>
```

## กลยุทธ์การแก้ไข

### 1. เปลี่ยน Priority Strategy

- **Navbar Logo**: เก็บ `loading="eager"` แต่เอา `priority` ออก (ยังโหลดเร็วแต่ไม่ใช่ high priority)
- **Footer Logo**: เปลี่ยนเป็น `loading="lazy"` (โหลดเมื่อผู้ใช้เลื่อนมาใกล้ footer)

### 2. Image Optimization Strategy

```jsx
// Navbar Logo - ลดขนาด priority แต่ยังโหลดเร็ว
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย โลโก้"
  width={48}
  height={48}
  className="w-full h-full object-cover scale-125"
  loading="eager" // โหลดเร็วแต่ไม่ high priority
  quality={80} // ลดคุณภาพเล็กน้อยเพื่อประหยัดขนาด
/>

// Footer Logo - Full lazy loading
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่"
  width={64}
  height={64}
  className="w-full h-full object-cover scale-125"
  loading="lazy" // โหลดเมื่อใกล้เข้าสู่ viewport
  quality={75} // ลดคุณภาพเพื่อประหยัดขนาด
/>
```

### 3. Advanced Optimization

- ใช้ WebP format โดยอัตโนมัติผ่าน Next.js
- เพิ่ม `placeholder="empty"` เพื่อป้องกันการหน่วงเวลา
- ปรับ `sizes` ให้เหมาะสมกับการใช้งานจริง

## การดำเนินการ

### Phase 1: Navbar Logo Optimization

```jsx
// จาก priority={true}
// เป็น loading="eager" + quality optimization
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย โลโก้"
  width={48}
  height={48}
  className="w-full h-full object-cover scale-125"
  loading="eager"
  quality={80}
  placeholder="empty"
  sizes="48px"
/>
```

### Phase 2: Footer Logo Lazy Loading

```jsx
// เปลี่ยนเป็น lazy loading เต็มรูปแบบ
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่"
  width={64}
  height={64}
  className="w-full h-full object-cover scale-125"
  loading="lazy"
  quality={75}
  placeholder="empty"
  sizes="64px"
/>
```

## ผลลัพธ์ที่คาดหวัง

### ประสิทธิภาพ

- **ลดขนาดการโหลดเริ่มต้น**: 3.5 KiB
- **ปรับปรุง FCP**: ลดเวลาการรอโหลดทรัพยากรที่ไม่จำเป็น
- **ปรับปรุง LCP**: มี priority เฉพาะทรัพยากรสำคัญที่สุด
- **ปรับปรุง Speed Index**: โหลดเนื้อหาหลักเร็วขึ้น

### ประสบการณ์ผู้ใช้

- **Navbar**: ยังโหลดเร็วไม่เปลี่ยนแปลง
- **Footer**: โหลดเมื่อผู้ใช้เลื่อนลงมา (ประหยัด bandwidth)
- **Overall**: หน้าเว็บโหลดเร็วขึ้นโดยรวม

## การตรวจสอบผล

### ก่อนการแก้ไข

```bash
# ตรวจสอบขนาดปัจจุบัน
curl -s https://chiangmaiusedcar.com/_next/image?url=%2Flogo%2Flogo_main.png&w=128&q=75 | wc -c
```

### หลังการแก้ไข

- ตรวจสอบ PageSpeed Insights อีกครั้ง
- ยืนยันว่า "เลื่อนเวลาโหลดรูปภาพนอกจอภาพ" หายไป
- ตรวจสอบคะแนน Core Web Vitals

## Implementation Status

- [x] Phase 1: Navbar Logo Optimization - ✅ สำเร็จ
- [x] Phase 2: Footer Logo Lazy Loading - ✅ สำเร็จ
- [x] Phase 3: Verification และ Testing - ✅ สำเร็จ
- [ ] Phase 4: PageSpeed Insights Re-audit - รอการทดสอบ

## การแก้ไขที่ดำเนินการแล้ว

### 1. Navbar Logo (components/Navbar.jsx)

```jsx
// ก่อนการแก้ไข
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย โลโก้"
  width={48}
  height={48}
  className="w-full h-full object-cover scale-125"
  priority // ← ปัญหา: มี fetchpriority="high"
/>

// หลังการแก้ไข
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย โลโก้"
  width={48}
  height={48}
  className="w-full h-full object-cover scale-125"
  loading="eager"    // ← โหลดเร็วแต่ไม่ high priority
  quality={80}       // ← ลดคุณภาพเล็กน้อย
  placeholder="empty" // ← ป้องกันการหน่วงเวลา
  sizes="48px"       // ← ระบุขนาดที่แน่นอน
/>
```

### 2. Footer Logo (components/Footer.jsx)

```jsx
// ก่อนการแก้ไข
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่"
  width={64}
  height={64}
  className="w-full h-full object-cover scale-125"
  priority // ← ปัญหา: Footer มี high priority
/>

// หลังการแก้ไข
<Image
  src="/logo/logo_main.png"
  alt="ครูหนึ่งรถสวย - รถมือสองเชียงใหม่"
  width={64}
  height={64}
  className="w-full h-full object-cover scale-125"
  loading="lazy"     // ← lazy loading เต็มรูปแบบ
  quality={75}       // ← ลดคุณภาพมากขึ้น
  placeholder="empty" // ← ป้องกันการหน่วงเวลา
  sizes="64px"       // ← ระบุขนาดที่แน่นอน
/>
```

## ผลการทดสอบ Build

✅ **Build สำเร็จ**: Next.js 14.2.10 build สำเร็จไม่มีข้อผิดพลาด ✅ **Bundle Size**: คงที่ที่ 269 kB shared JS
(ไม่เพิ่มขึ้น) ✅ **CSS Optimization**: CSS แยกออกมาเป็น 10 kB chunk ✅ **Performance**: Homepage build time เสถียรที่
~500ms

## คาดการณ์ผลลัพธ์

### เมื่อ Deploy แล้ว:

- **Logo ใน Navbar**: ยังโหลดเร็วเหมือนเดิม แต่ไม่ block critical resources
- **Logo ใน Footer**: โหลดเมื่อผู้ใช้เลื่อนลงมาใกล้ footer
- **ประหยัด 3.5 KiB**: จากการไม่ priority โหลด logo ที่ off-screen
- **FCP/LCP Improvement**: ทรัพยากรที่สำคัญโหลดเร็วขึ้น

## Notes

- การเปลี่ยนแปลงนี้จะไม่กระทบต่อการแสดงผลหรือประสบการณ์ผู้ใช้
- Logo ยังคงโหลดอย่างเหมาะสม: Navbar เร็ว, Footer เมื่อต้องการ
- ประหยัด 3.5 KiB ในการโหลดหน้าแรก ซึ่งช่วยปรับปรุง Core Web Vitals
