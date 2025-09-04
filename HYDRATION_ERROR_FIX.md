# แก้ไข Hydration Error - Next.js

## สาเหตุของ Hydration Error

Hydration Error เกิดจากการที่ HTML ที่ render บน server ไม่ตรงกับ UI ที่ render บน client

## สาเหตุที่พบบ่อย

### 1. การใช้ Date/Time
```jsx
// ❌ ผิด - อาจแตกต่างกันระหว่าง server และ client
const currentYear = new Date().getFullYear();

// ✅ ถูก - ใช้ state และ useEffect
const [currentYear, setCurrentYear] = useState(2024);
useEffect(() => {
  setCurrentYear(new Date().getFullYear());
}, []);
```

### 2. การใช้ Router
```jsx
// ❌ ผิด - router อาจไม่พร้อมใช้งานบน server
const isActive = href => router.pathname === href;

// ✅ ถูก - ตรวจสอบ mounted ก่อน
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
const isActive = href => mounted && router.pathname === href;
```

### 3. การใช้ Dynamic Imports
```jsx
// ✅ ถูก - ปิด SSR สำหรับ components ที่ใช้ browser APIs
const Component = dynamic(() => import('./Component'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
});
```

### 4. การใช้ suppressHydrationWarning
```jsx
// ใช้เฉพาะส่วนที่จำเป็น
<div suppressHydrationWarning>
  {currentYear} {/* ส่วนที่อาจแตกต่างกัน */}
</div>
```

## การแก้ไขที่ใช้ในโปรเจค

### 1. Credit Check Page
- ใช้ `mounted` state แทน `isClient`
- ปรับปรุงการแสดง reCAPTCHA ให้สม่ำเสมอ
- เพิ่ม suppressHydrationWarning ในส่วนที่จำเป็น

### 2. Navbar Component
- เพิ่ม mounted state
- ตรวจสอบ mounted ก่อนใช้ router.pathname

### 3. Footer Component  
- แก้ไขการใช้ new Date()
- เพิ่ม suppressHydrationWarning สำหรับปีลิขสิทธิ์

### 4. App Layout
- ลด nested divs ที่ไม่จำเป็น
- ย้าย Analytics components เข้าใน main div

## Best Practices

### 1. ใช้ Dynamic Loading
```jsx
const ClientOnlyComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});
```

### 2. Mounted Pattern
```jsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) {
  return <div>Loading...</div>; // หรือ placeholder
}
```

### 3. Conditional Rendering
```jsx
{mounted && <ClientSpecificContent />}
{!mounted && <ServerSafeContent />}
```

### 4. Safe Router Usage
```jsx
const router = useRouter();
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

// ใช้งาน router เฉพาะเมื่อ mounted
const currentPath = mounted ? router.pathname : '';
```

## การตรวจสอบ

### 1. Development Mode
- เปิด Console ใน Browser
- ดู warnings เกี่ยวกับ hydration
- ใช้ React Developer Tools

### 2. Production Build
```bash
pnpm build
pnpm start
```

### 3. Testing
- ทดสอบ hard refresh (Ctrl+F5)
- ทดสอบการ navigate ระหว่างหน้า
- ทดสอบใน incognito mode

## ข้อควรระวัง

1. **อย่าใช้ suppressHydrationWarning มากเกินไป** - ใช้เฉพาะที่จำเป็น
2. **ตรวจสอบ performance** - dynamic loading อาจช้าลง
3. **ทดสอบ SEO** - บาง content อาจไม่ถูก index
4. **ระวัง Memory Leaks** - cleanup event listeners ใน useEffect

## การ Debug

### 1. เปิด Hydration Warnings
```javascript
// next.config.js
module.exports = {
  experimental: {
    hydrationErrorDetails: true
  }
}
```

### 2. ใช้ console.log เปรียบเทียบ
```jsx
useEffect(() => {
  console.log('Client render:', value);
}, []);

// Server-side
console.log('Server render:', value);
```

### 3. ตรวจสอบ HTML Source
- View Page Source เปรียบเทียบกับ Developer Tools
- ดู differences ระหว่าง server และ client HTML
