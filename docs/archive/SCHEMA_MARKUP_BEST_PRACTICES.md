# 📊 คู่มือ Schema Markup สำหรับเว็บไซต์รถมือสอง (Best Practices)

**วันที่**: 9 ตุลาคม 2025  
**อ้างอิง**: Schema.org + Google Rich Results Guidelines

---

## 🎯 Schema Markup ที่ควรมี

### 1. Organization Schema (ข้อมูลธุรกิจ)

**ใช้ที่**: ทุกหน้า (global)  
**@type**: `Organization` หรือ `LocalBusiness` หรือ `AutomotiveBusiness`

```json
{
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "name": "ครูหนึ่งรถสวย",
  "alternateName": "Khru Neung Rod Suay Used Cars",
  "url": "https://www.chiangmaiusedcar.com",
  "logo": "https://www.chiangmaiusedcar.com/logo.png",
  "image": "https://www.chiangmaiusedcar.com/og-image.jpg",
  "description": "ขายรถมือสองคุณภาพ เชียงใหม่ ราคาดี มีรับประกัน ฟรีดาวน์ ผ่อนสบาย",

  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 ถนนเชียงใหม่-ลำปาง",
    "addressLocality": "เมืองเชียงใหม่",
    "addressRegion": "เชียงใหม่",
    "postalCode": "50000",
    "addressCountry": "TH"
  },

  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "18.7883",
    "longitude": "98.9853"
  },

  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+66-89-123-4567",
    "contactType": "sales",
    "areaServed": "TH",
    "availableLanguage": ["th", "en"]
  },

  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "19:00"
    }
  ],

  "sameAs": [
    "https://www.facebook.com/chiangmaiusedcar",
    "https://line.me/R/ti/p/@chiangmaiusedcar",
    "https://www.instagram.com/chiangmaiusedcar"
  ],

  "priceRange": "฿฿-฿฿฿"
}
```

---

### 2. Car Schema (รถแต่ละคัน)

**ใช้ที่**: หน้า car detail (`/car/[handle]`)  
**@type**: `Car` (ไม่ใช่ Product!)

```json
{
  "@context": "https://schema.org",
  "@type": "Car",
  "name": "Toyota Vios 1.5 E ปี 2016 สีขาว",
  "description": "รถยนต์มือสอง Toyota Vios 1.5 E ปี 2016 สีขาว เกียร์อัตโนมัติ เลขไมล์ 45,000 กม. สภาพดีมาก พร้อมใช้งาน",
  "image": [
    "https://cdn.shopify.com/s/files/1/0123/4567/8901/products/vios-01.jpg",
    "https://cdn.shopify.com/s/files/1/0123/4567/8901/products/vios-02.jpg",
    "https://cdn.shopify.com/s/files/1/0123/4567/8901/products/vios-03.jpg"
  ],

  "brand": {
    "@type": "Brand",
    "name": "Toyota"
  },

  "model": "Vios 1.5 E",
  "vehicleModelDate": "2016",
  "productionDate": "2016",

  "color": "ขาว",
  "bodyType": "Sedan",
  "vehicleTransmission": "อัตโนมัติ",
  "fuelType": "Gasoline",
  "vehicleEngine": {
    "@type": "EngineSpecification",
    "engineDisplacement": {
      "@type": "QuantitativeValue",
      "value": "1500",
      "unitCode": "CMQ"
    },
    "fuelType": "Gasoline"
  },

  "mileageFromOdometer": {
    "@type": "QuantitativeValue",
    "value": 45000,
    "unitCode": "KMT"
  },

  "numberOfDoors": 4,
  "vehicleSeatingCapacity": 5,

  "vehicleIdentificationNumber": "JTDBL40E109012345",

  "vehicleCondition": "https://schema.org/UsedCondition",

  "offers": {
    "@type": "Offer",
    "url": "https://www.chiangmaiusedcar.com/car/toyota-vios-1-5-e-2016",
    "priceCurrency": "THB",
    "price": "325000",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "ครูหนึ่งรถสวย"
    },
    "itemCondition": "https://schema.org/UsedCondition"
  }
}
```

---

### 3. ItemList Schema (หน้ารายการรถ)

**ใช้ที่**: หน้า `/all-cars`  
**@type**: `ItemList` พร้อม `ListItem` ที่เป็น `Car`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "รถมือสองทั้งหมด - ครูหนึ่งรถสวย",
  "description": "รถมือสองคุณภาพสูง เชียงใหม่ มีให้เลือกหลากหลายรุ่น",
  "numberOfItems": 125,

  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Car",
        "@id": "https://www.chiangmaiusedcar.com/car/toyota-vios-1-5-e-2016",
        "name": "Toyota Vios 1.5 E ปี 2016",
        "image": "https://cdn.shopify.com/s/files/1/0123/4567/8901/products/vios-01.jpg",
        "brand": {
          "@type": "Brand",
          "name": "Toyota"
        },
        "model": "Vios 1.5 E",
        "vehicleModelDate": "2016",
        "color": "ขาว",
        "bodyType": "Sedan",
        "mileageFromOdometer": {
          "@type": "QuantitativeValue",
          "value": 45000,
          "unitCode": "KMT"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "THB",
          "price": "325000",
          "availability": "https://schema.org/InStock"
        }
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Car",
        "@id": "https://www.chiangmaiusedcar.com/car/honda-civic-1-8-el-2018",
        "name": "Honda Civic 1.8 EL ปี 2018",
        "image": "https://cdn.shopify.com/s/files/1/0123/4567/8901/products/civic-01.jpg",
        "brand": {
          "@type": "Brand",
          "name": "Honda"
        },
        "model": "Civic 1.8 EL",
        "vehicleModelDate": "2018",
        "color": "ดำ",
        "bodyType": "Sedan",
        "mileageFromOdometer": {
          "@type": "QuantitativeValue",
          "value": 32000,
          "unitCode": "KMT"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "THB",
          "price": "595000",
          "availability": "https://schema.org/InStock"
        }
      }
    }
  ]
}
```

---

### 4. BreadcrumbList Schema

**ใช้ที่**: ทุกหน้าย่อย  
**@type**: `BreadcrumbList`

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "หน้าแรก",
      "item": "https://www.chiangmaiusedcar.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "รถทั้งหมด",
      "item": "https://www.chiangmaiusedcar.com/all-cars"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Toyota Vios 1.5 E ปี 2016",
      "item": "https://www.chiangmaiusedcar.com/car/toyota-vios-1-5-e-2016"
    }
  ]
}
```

---

### 5. WebSite Schema (ฟีเจอร์ Search)

**ใช้ที่**: หน้าแรก  
**@type**: `WebSite`

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ครูหนึ่งรถสวย - รถมือสองเชียงใหม่",
  "url": "https://www.chiangmaiusedcar.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.chiangmaiusedcar.com/all-cars?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## ⚠️ สิ่งที่ควรหลีกเลี่ยง

### ❌ ห้ามทำ:

1. **ห้ามใช้ Product แทน Car**

```json
// ❌ ผิด
{
  "@type": "Product",
  "name": "Toyota Vios"
}

// ✅ ถูก
{
  "@type": "Car",
  "name": "Toyota Vios 1.5 E ปี 2016"
}
```

2. **ห้ามซ้ำ Schema เดียวกัน**

```html
<!-- ❌ ห้าม: Organization ซ้ำ 2 ที่ -->
<script type="application/ld+json">
  { "@type": "Organization" }
</script>
<script type="application/ld+json">
  { "@type": "Organization" }
</script>

<!-- ✅ ถูก: Organization มีแค่ 1 ที่ -->
<script type="application/ld+json">
  { "@type": "Organization" }
</script>
```

3. **ห้ามใส่ข้อมูลเท็จ**

- ไม่ควรใส่ `aggregateRating` ถ้าไม่มีรีวิวจริง
- ไม่ควรใส่ `availability: InStock` ถ้ารถขายไปแล้ว

4. **ห้ามใช้ข้อมูลที่ไม่เห็นในหน้าเว็บ**

- Schema ต้องตรงกับสิ่งที่ user เห็นจริงๆ

---

## ✅ Best Practices

### 1. ใช้ JSON-LD (ไม่ใช่ Microdata)

```html
<!-- ✅ แนะนำ: JSON-LD -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Car"
  }
</script>

<!-- ❌ ไม่แนะนำ: Microdata -->
<div itemscope itemtype="https://schema.org/Car">
  <span itemprop="name">Toyota</span>
</div>
```

### 2. ใส่ @id สำหรับ Entity หลัก

```json
{
  "@context": "https://schema.org",
  "@type": "Car",
  "@id": "https://www.chiangmaiusedcar.com/car/toyota-vios-2016",
  "name": "Toyota Vios"
}
```

### 3. ใช้ Brand Object

```json
// ✅ ถูก
"brand": {
  "@type": "Brand",
  "name": "Toyota"
}

// ❌ ไม่ดี
"brand": "Toyota"
```

### 4. ใส่หน่วยวัดที่ถูกต้อง

```json
"mileageFromOdometer": {
  "@type": "QuantitativeValue",
  "value": 45000,
  "unitCode": "KMT"  // KMT = Kilometer
}
```

### 5. ใช้ URL แบบ Canonical

```json
"url": "https://www.chiangmaiusedcar.com/car/toyota-vios-2016",
"image": "https://cdn.shopify.com/s/files/1/0123/4567/8901/products/vios-01.jpg"
```

---

## 🔍 เครื่องมือทดสอบ

### 1. Google Rich Results Test

**URL**: https://search.google.com/test/rich-results

**ทดสอบ**:

- Organization
- LocalBusiness
- Car (หน้า detail)
- ItemList (หน้า listing)
- BreadcrumbList

### 2. Schema Markup Validator

**URL**: https://validator.schema.org/

**ทดสอบ**:

- ความถูกต้องของ JSON-LD
- ความสมบูรณ์ของ properties

### 3. Google Search Console

**URL**: https://search.google.com/search-console

**เช็ค**:

- Rich Results report
- Coverage issues
- Enhancement suggestions

---

## 📈 ผลลัพธ์ที่คาดหวัง

### ใน Google Search:

1. **Rich Snippet**: แสดงรูปรถ, ราคา, ยี่ห้อ, ปี
2. **Knowledge Panel**: ข้อมูลร้าน, ที่อยู่, เบอร์โทร
3. **Sitelinks**: เมนูย่อยใน Search Results
4. **Breadcrumb**: แสดง path navigation

### ใน Google Maps:

1. แสดงข้อมูล Business Profile
2. Opening hours
3. Reviews & Ratings
4. Location pin

---

## 🎯 สรุป Priority

### ⭐⭐⭐ สำคัญที่สุด (Must Have):

1. **Organization/LocalBusiness** - ทุกหน้า
2. **Car Schema** - หน้า car detail
3. **BreadcrumbList** - ทุกหน้าย่อย

### ⭐⭐ สำคัญ (Should Have):

4. **ItemList** - หน้า all-cars
5. **WebSite** - หน้าแรก (สำหรับ Search)

### ⭐ เพิ่มเติม (Nice to Have):

6. **FAQPage** - หน้า FAQ
7. **Article** - หน้าบล็อก
8. **Review** - หน้ารีวิว

---

## 📝 ตัวอย่าง Implementation ใน Next.js

```javascript
// lib/seo/jsonld.js
export function buildCarJsonLd(car) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    '@id': `https://www.chiangmaiusedcar.com/car/${car.handle}`,
    name: car.title,
    description: car.description,
    image: car.images.map(img => img.url),
    brand: {
      '@type': 'Brand',
      name: car.brand,
    },
    model: car.model,
    vehicleModelDate: car.year,
    color: car.color,
    bodyType: car.body_type,
    vehicleTransmission: car.transmission,
    fuelType: car.fuel_type,
    mileageFromOdometer: car.mileage
      ? {
          '@type': 'QuantitativeValue',
          value: parseInt(car.mileage),
          unitCode: 'KMT',
        }
      : undefined,
    vehicleCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: `https://www.chiangmaiusedcar.com/car/${car.handle}`,
      priceCurrency: 'THB',
      price: car.price.amount,
      availability: car.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ครูหนึ่งรถสวย',
      },
    },
  };
}
```

**พร้อมใช้งาน!** 🚀
