# ISR Revalidation API Documentation

## 📊 **ภาพรวม ISR Revalidation API**

API endpoint สำหรับ On-Demand Incremental Static Regeneration (ISR) ที่ช่วยให้สามารถอัปเดตเนื้อหาแบบ static pages
โดยไม่ต้อง rebuild ทั้งแอปพลิเคชัน

### 🌟 **ฟีเจอร์หลัก**

- ✅ **On-Demand Revalidation**: อัปเดต static pages แบบ real-time
- ✅ **Flexible Targeting**: รองรับทั้ง path-based และ tag-based revalidation
- ✅ **Security Controls**: Rate limiting และ secret token authentication
- ✅ **Performance Monitoring**: ติดตาม response time และ success rate
- ✅ **Detailed Logging**: รายงานผลลัพธ์และ debugging information
- ✅ **Error Recovery**: ข้อแนะนำการแก้ไขปัญหา

---

## 🚀 **การใช้งาน**

### **Endpoint URL**

```
POST /api/revalidate
```

### **Authentication**

```http
?secret=YOUR_REVALIDATE_SECRET
```

### **Request Parameters**

| Parameter | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| `secret`  | string | ✅       | Secret token สำหรับ authentication         |
| `tag`     | string | ❌       | Tag สำหรับ bulk revalidation               |
| `path`    | string | ❌       | Specific path สำหรับ targeted revalidation |

### **Supported Tags**

- `home` - หน้าแรก
- `cars` - หน้ารถยนต์ทั้งหมด
- `blog` - หน้าบล็อกและข่าวสาร
- `all` - ทุกหน้าหลัก

---

## 📝 **ตัวอย่างการใช้งาน**

### **1. Revalidate Homepage**

```bash
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&tag=home"
```

```javascript
const revalidateHome = async () => {
  const response = await fetch('/api/revalidate?secret=YOUR_SECRET&tag=home', {
    method: 'POST',
  });
  const result = await response.json();
  console.log('Revalidation result:', result);
};
```

### **2. Revalidate Specific Car Page**

```bash
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/cars/toyota-camry-2020"
```

```javascript
const revalidateCarPage = async carHandle => {
  const response = await fetch(`/api/revalidate?secret=YOUR_SECRET&path=/cars/${carHandle}`, {
    method: 'POST',
  });
  return await response.json();
};
```

### **3. Bulk Revalidation (All Pages)**

```bash
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&tag=all"
```

```javascript
const revalidateAll = async () => {
  const response = await fetch('/api/revalidate?secret=YOUR_SECRET&tag=all', {
    method: 'POST',
  });
  return await response.json();
};
```

### **4. Car Inventory Update**

```javascript
const updateCarInventory = async () => {
  // อัปเดตข้อมูลรถใน Shopify แล้ว revalidate
  await updateShopifyInventory();

  const response = await fetch('/api/revalidate?secret=YOUR_SECRET&tag=cars', {
    method: 'POST',
  });

  return await response.json();
};
```

---

## 📊 **Response Format**

### **Success Response (200)**

```json
{
  "success": true,
  "revalidated": true,
  "timestamp": "2025-09-05T10:30:00.000Z",
  "performance": {
    "response_time_ms": 245,
    "targets_processed": 3,
    "success_count": 3,
    "failure_count": 0,
    "success_rate": "100.0%"
  },
  "results": [
    {
      "type": "tag",
      "tag": "cars",
      "target": "/",
      "success": true
    },
    {
      "type": "tag",
      "tag": "cars",
      "target": "/cars",
      "success": true
    },
    {
      "type": "tag",
      "tag": "cars",
      "target": "/all-cars",
      "success": true
    }
  ],
  "request": {
    "ip": "192.168.1***",
    "tag": "cars",
    "path": null,
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit"
  }
}
```

### **Path-specific Response**

```json
{
  "success": true,
  "revalidated": true,
  "timestamp": "2025-09-05T10:30:00.000Z",
  "performance": {
    "response_time_ms": 120,
    "targets_processed": 1,
    "success_count": 1,
    "failure_count": 0,
    "success_rate": "100.0%"
  },
  "results": [
    {
      "type": "path",
      "target": "/cars/toyota-camry-2020",
      "success": true
    }
  ]
}
```

---

## 🔒 **Security Features**

### **Rate Limiting**

- **10 requests per minute** ต่อ IP address
- **Automatic cleanup** ของ rate limiting data
- **429 status code** เมื่อเกินขีดจำกัด

### **Authentication**

- **Secret Token** validation required
- **Environment variable**: `REVALIDATE_SECRET`
- **IP logging** สำหรับ security monitoring

### **Input Validation**

- **Parameter sanitization**: ตรวจสอบประเภทและขนาด
- **Path validation**: ป้องกัน malicious paths
- **Tag validation**: เฉพาะ tags ที่อนุญาต

### **Security Headers**

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## ⚡ **Performance Guidelines**

### **Revalidation Strategies**

#### **Individual Page Updates**

```javascript
// ดีที่สุดสำหรับการอัปเดตหน้าเดียว
await revalidate('/cars/specific-car');
```

#### **Category Updates**

```javascript
// เหมาะสำหรับการอัปเดตกลุ่มหน้า
await revalidate('?tag=cars'); // /, /cars, /all-cars
```

#### **Site-wide Updates**

```javascript
// ใช้เฉพาะเมื่อจำเป็น (ช้า)
await revalidate('?tag=all');
```

### **Timing Recommendations**

- **Single page**: < 200ms
- **Category (2-3 pages)**: < 500ms
- **Site-wide (8+ pages)**: < 2000ms

### **Best Practices**

1. **Use specific paths** เมื่อเป็นไปได้
2. **Batch related updates** ให้ tag เดียวกัน
3. **Monitor performance** ด้วย response metrics
4. **Avoid frequent all-tag** revalidations

---

## 🔄 **Integration Examples**

### **Shopify Webhook Integration**

```javascript
// pages/api/webhooks/product-update.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const product = req.body;

    // Revalidate relevant pages when product is updated
    await fetch(`${process.env.SITE_URL}/api/revalidate`, {
      method: 'POST',
      body: new URLSearchParams({
        secret: process.env.REVALIDATE_SECRET,
        tag: 'cars',
      }),
    });

    res.status(200).json({ revalidated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### **Admin Dashboard Integration**

```javascript
// components/AdminRevalidation.jsx
import { useState } from 'react';

export default function AdminRevalidation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRevalidate = async tag => {
    setLoading(true);
    try {
      const response = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATE_SECRET}&tag=${tag}`, {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-revalidation">
      <h3>Content Revalidation</h3>
      <div className="buttons">
        <button onClick={() => handleRevalidate('home')} disabled={loading}>
          Update Homepage
        </button>
        <button onClick={() => handleRevalidate('cars')} disabled={loading}>
          Update Cars
        </button>
        <button onClick={() => handleRevalidate('all')} disabled={loading}>
          Update All Pages
        </button>
      </div>
      {result && <pre className="result">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

### **Automated Content Updates**

```javascript
// scripts/scheduled-revalidation.js
const scheduleRevalidation = async () => {
  const jobs = [
    { time: '00:00', tag: 'all' }, // Midnight - full site update
    { time: '06:00', tag: 'cars' }, // Morning - cars update
    { time: '12:00', tag: 'home' }, // Noon - homepage update
    { time: '18:00', tag: 'cars' }, // Evening - cars update
  ];

  for (const job of jobs) {
    schedule.scheduleJob(job.time, async () => {
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          body: new URLSearchParams({
            secret: process.env.REVALIDATE_SECRET,
            tag: job.tag,
          }),
        });
        console.log(`✅ Scheduled revalidation completed: ${job.tag}`);
      } catch (error) {
        console.error(`❌ Scheduled revalidation failed: ${job.tag}`, error);
      }
    });
  }
};
```

---

## 🐛 **Error Handling**

### **Common Errors**

#### **400 Bad Request**

```json
{
  "error": "Invalid tag parameter",
  "message": "Missing or invalid tag parameter",
  "supported_tags": ["home", "cars", "blog", "all"],
  "usage": "POST /api/revalidate?secret=YOUR_SECRET&tag=home"
}
```

#### **401 Unauthorized**

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing secret token"
}
```

#### **405 Method Not Allowed**

```json
{
  "error": "Method not allowed",
  "message": "Only POST requests are supported for revalidation"
}
```

#### **429 Too Many Requests**

```json
{
  "error": "Too many revalidation requests",
  "message": "Please wait before triggering more revalidations",
  "retry_after": 60
}
```

#### **500 Internal Server Error**

```json
{
  "error": "Revalidation failed",
  "message": "Internal server error",
  "response_time_ms": 1500,
  "suggestions": [
    "Check if the target paths exist and are statically generated",
    "Verify the REVALIDATE_SECRET environment variable is set correctly",
    "Ensure the Next.js application is running in production mode",
    "Try revalidating individual paths instead of bulk operations"
  ]
}
```

---

## 🛠️ **Environment Setup**

### **Required Environment Variables**

```env
# ISR Revalidation Secret
REVALIDATE_SECRET=your-secure-secret-here

# Site URL (for webhooks)
SITE_URL=https://yourdomain.com

# Node Environment
NODE_ENV=production
```

### **Next.js Configuration**

```javascript
// next.config.js
module.exports = {
  // ISR requires getStaticProps with revalidate
  experimental: {
    isrMemoryCacheSize: 50, // MB
  },
};
```

### **Page Configuration Example**

```javascript
// pages/index.js
export async function getStaticProps() {
  const data = await fetchData();

  return {
    props: { data },
    revalidate: 60, // Revalidate at most once per minute
  };
}
```

---

## 📈 **Monitoring & Analytics**

### **Performance Metrics**

- **Response Time**: เวลาที่ใช้ในการ revalidate
- **Success Rate**: อัตราความสำเร็จของการ revalidate
- **Target Count**: จำนวนหน้าที่ process
- **Error Rate**: อัตราการเกิดข้อผิดพลาด

### **Logging Examples**

```
🔄 ISR revalidation request from IP: 192.168.1.100
✅ Revalidated: / (tag: home)
✅ Revalidated: /cars (tag: cars)
❌ Failed to revalidate /nonexistent: Page not found
🎯 Revalidation complete in 340ms: 2 success, 1 failed
```

### **Health Monitoring**

```javascript
// Monitor revalidation health
const monitorRevalidation = async () => {
  const healthCheck = await fetch('/api/revalidate?secret=health-check&tag=home', {
    method: 'POST',
  });

  if (healthCheck.ok) {
    const result = await healthCheck.json();
    console.log('ISR Health:', {
      status: 'healthy',
      response_time: result.performance.response_time_ms,
      success_rate: result.performance.success_rate,
    });
  }
};
```

---

## 🚨 **Best Practices**

### **Security**

1. **Keep secrets secure** - ไม่เปิดเผย REVALIDATE_SECRET
2. **Monitor access logs** - ตรวจสอบการเข้าถึงที่ผิดปกติ
3. **Use HTTPS only** - สำหรับ production
4. **Rate limit properly** - ป้องกันการใช้งานเกินขนาด

### **Performance**

1. **Revalidate strategically** - เฉพาะหน้าที่จำเป็น
2. **Use specific paths** แทน bulk operations
3. **Monitor response times** - เฝิาระวังประสิทธิภาพ
4. **Schedule bulk updates** ในช่วงที่ traffic ต่ำ

### **Reliability**

1. **Implement retry logic** สำหรับ critical updates
2. **Log all operations** เพื่อ debugging
3. **Handle failures gracefully** - ไม่ให้ error หยุดระบบ
4. **Test revalidation paths** ก่อน deploy

---

## 📞 **Support**

สำหรับการสนับสนุนเทคนิค:

- **Revalidation Issues**: ตรวจสอบ logs และ error messages
- **Performance Problems**: ลด scope ของการ revalidate
- **Authentication Issues**: ตรวจสอบ environment variables

---

**เอกสารนี้อัปเดตล่าสุด**: September 5, 2025  
**API Version**: 1.0.0  
**Production Ready**: ✅ พร้อมใช้งาน
