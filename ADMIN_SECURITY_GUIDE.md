# 🔐 คู่มือความปลอดภัยระบบ Admin - ครูหนึ่งรถสวย

## สรุปการป้องกันที่ตั้งค่าแล้ว

### 🚫 การป้องกันบอท Google และ AI

#### 1. **Robots.txt Protection**

```
# บล็อกบอททุกประเภทจากหน้า admin
Disallow: /admin*
Disallow: /api*
Disallow: /dashboard*

# บล็อกบอท AI เฉพาะ
User-agent: ChatGPT-User
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: CCBot
Disallow: /
```

#### 2. **Middleware Protection**

```javascript
// middleware.js - บล็อกบอทระดับเซิร์ฟเวอร์
const blockedBots = ['ChatGPT', 'Claude', 'anthropic', 'CCBot', 'AI2Bot', 'OpenAI', 'GPTBot', 'Google-Extended'];

// ส่ง 403 Forbidden สำหรับบอทที่เข้าหน้า admin
```

#### 3. **Server Level Protection (.htaccess)**

```apache
# บล็อกบอท AI จากเข้าหน้า admin
RewriteCond %{HTTP_USER_AGENT} (ChatGPT|Claude|anthropic|CCBot) [NC]
RewriteRule ^admin.* - [F,L]

# บล็อกการเข้าถึงโดยตรงโดยไม่มี referrer
RewriteCond %{REQUEST_URI} ^/admin.*
RewriteCond %{HTTP_REFERER} !^https://chiangmaiusedcar\.com.*$ [NC]
RewriteRule .* - [F,L]
```

### 🔐 ระบบป้องกันหน้า Admin

#### 1. **Multi-Layer Authentication**

**ขั้นตอนที่ 1: Access Control**

- ตรวจสอบ referer header
- ตรวจสอบ localStorage
- ตรวจสอบ query parameters
- ตรวจสอบ user agent (ไม่ใช่บอท)

**ขั้นตอนที่ 2: Login Authentication**

- Username/Password validation
- SHA-256 password hashing
- 2FA Authentication (Google Authenticator)
- IP-based access control

#### 2. **Rate Limiting & Security**

**Login Attempt Protection:**

- สูงสุด 5 ครั้งต่อ 15 นาที
- ล็อก IP 30 นาที หลังจากผิด 5 ครั้ง
- บันทึก log ทุกการพยายาม

**Session Security:**

- JWT Token หมดอายุ 2 ชั่วโมง
- Browser fingerprinting
- IP address validation

#### 3. **Advanced Security Features**

**Bot Detection:**

```javascript
// ตรวจสอบ pattern ที่น่าสงสัย
const suspiciousPatterns = ['bot', 'crawler', 'spider', 'scraper', 'automated', 'curl', 'wget', 'python'];
```

**Security Headers:**

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## วิธีการเข้าถึงระบบ Admin

### สำหรับ Admin ที่ได้รับอนุญาต

1. **วิธีที่ 1: ผ่าน URL Parameter**

   ```
   https://chiangmaiusedcar.com/admin?admin_access=true
   ```

2. **วิธีที่ 2: ผ่าน Secret Key**

   ```
   https://chiangmaiusedcar.com/admin?secret=secure2024KN
   ```

3. **วิธีที่ 3: ผ่านการเข้าถึงปกติ (หลังจากเข้าครั้งแรกแล้ว)**
   ```
   https://chiangmaiusedcar.com/admin
   ```

### ข้อมูลการเข้าสู่ระบบ

**Username:** `knadmin`  
**Password:** `301982Nueng@77`  
**2FA:** ใช้ Google Authenticator ด้วย secret: `KRNG5G5SMRPWEUDS7HSW24OP`

## การตรวจสอบและ Monitoring

### 1. **Log Files**

```
/logs/admin-YYYY-MM-DD.log
```

ประเภท log ที่บันทึก:

- `LOGIN_SUCCESS` - เข้าสู่ระบบสำเร็จ
- `LOGIN_FAILED` - เข้าสู่ระบบไม่สำเร็จ
- `LOGIN_BLOCKED` - IP ถูกบล็อก
- `LOGIN_RATE_LIMITED` - ถูก rate limit
- `ACCESS_DENIED` - ถูกปฏิเสธการเข้าถึง

### 2. **การตรวจสอบ Security**

**ตรวจสอบการเข้าถึง:**

```bash
# ดู log การเข้าสู่ระบบ
tail -f logs/admin-*.log

# ตรวจสอบ IP ที่พยายามเข้า
grep "LOGIN_FAILED" logs/admin-*.log
```

**ตรวจสอบบอท:**

```bash
# ดูบอทที่ถูกบล็อก
grep "403" server.log
```

## การปรับปรุงความปลอดภัย

### 1. **สำหรับ Production**

**เปลี่ยน Environment Variables:**

```bash
# สร้าง password hash ใหม่
echo -n "รหัสผ่านใหม่" | sha256sum

# สร้าง JWT secret ใหม่
openssl rand -base64 64

# สร้าง 2FA secret ใหม่
node -e "console.log(require('speakeasy').generateSecret().base32)"
```

**เพิ่ม IP Whitelist:**

```
ALLOWED_ADMIN_IPS=123.456.789.0,111.222.333.444
```

### 2. **การตั้งค่า HTTPS**

**สำหรับ Vercel:**

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
```

### 3. **Database Security (ถ้ามี)**

```javascript
// การเข้ารหัสข้อมูลละเอียดอ่อน
const sensitiveData = encrypt(data, process.env.ENCRYPTION_KEY);
```

## แนวทางปฏิบัติที่ดี

### 1. **การจัดการ Secret**

- ไม่เก็บ secret ใน code
- ใช้ environment variables
- หมุนเวียน secret เป็นระยะ

### 2. **การตรวจสอบประจำ**

- ตรวจสอบ log ทุกสัปดาห์
- อัพเดท dependencies เป็นระยะ
- ทดสอบระบบป้องกันเป็นประจำ

### 3. **การ Backup**

- สำรองข้อมูล log
- สำรองการตั้งค่า
- เตรียมแผนฟื้นคืนระบบ

## การติดต่อฉุกเฉิน

หากพบปัญหาความปลอดภัย:

1. **ปิดการเข้าถึง admin ชั่วคราว**

   ```javascript
   // ใน middleware.js
   if (pathname.startsWith('/admin')) {
     return new NextResponse('Maintenance', { status: 503 });
   }
   ```

2. **ตรวจสอบ log**
3. **เปลี่ยน password และ secret**
4. **อัพเดทระบบป้องกัน**

---

**หมายเหตุ:** เอกสารนี้มีข้อมูลความปลอดภัยที่ละเอียดอ่อน กรุณาเก็บไว้ในที่ปลอดภัยและไม่แชร์กับบุคคลที่ไม่ได้รับอนุญาต

**อัพเดทครั้งล่าสุด:** 4 กันยายน 2025
