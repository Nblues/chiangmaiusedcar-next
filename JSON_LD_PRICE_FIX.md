# JSON-LD Schema Validation Fixed

## ✅ **ปัญหาที่แก้ไขแล้ว**

### 🔧 **Price Property ใน JSON-LD Schema**

**ปัญหาเดิม**:

```javascript
price: car.price?.amount || '0'; // ❌ String value
```

**แก้ไขเป็น**:

```javascript
price: car.price?.amount ? parseFloat(car.price.amount.toString().replace(/[^0-9.-]/g, '')) : 0; // ✅ Number value
```

### 📍 **ไฟล์ที่แก้ไข**

1. **`components/SEO.jsx`**

   - ✅ แก้ไข `offers.price` ใน Car schema
   - ✅ แก้ไข `product:price:amount` meta tag

2. **`pages/car/[handle].jsx`**

   - ✅ แก้ไข `offers.price` ใน Product schema

3. **`pages/all-cars.jsx`**
   - ✅ แก้ไข `offers.price` ใน ItemList schema

### 🎯 **Schema.org Compliance**

ตอนนี้ JSON-LD schema ทั้งหมดเป็นไปตาม [Schema.org Offer specification](https://schema.org/Offer):

```json
{
  "@type": "Offer",
  "price": 250000, // ✅ ตัวเลข (ไม่ใช่ string)
  "priceCurrency": "THB", // ✅ ISO currency code
  "availability": "https://schema.org/InStock"
}
```

### 🔍 **การตรวจสอบ**

สามารถทดสอบได้ที่:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [JSON-LD Playground](https://json-ld.org/playground/)

### 📊 **ผลลัพธ์ที่คาดหวัง**

- ✅ ไม่มี validation errors ใน Google Search Console
- ✅ Rich snippets แสดงราคาถูกต้อง
- ✅ Product schema ผ่าน Google validation
- ✅ AutoDealer schema ผ่าน validation

---

**Status**: ✅ **Fixed - Ready for Production**  
**Date**: August 9, 2025
