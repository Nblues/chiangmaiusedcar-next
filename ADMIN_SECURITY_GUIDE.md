# 🔒 Admin Security Configuration Guide

## ความปลอดภัยหลังบ้าน (Admin Backend Security)

ระบบหลังบ้านได้รับการป้องกันตามมาตรฐานสากล 2025:

---

## 🛡️ **การป้องกันที่มีอยู่:**

### **1. URL Protection**

- ✅ **Robots.txt**: Block `/admin*` จาก search engines
- ✅ **Meta Tags**: `noindex, nofollow, noarchive, nosnippet`
- ✅ **X-Robots-Tag**: Server-side blocking
- ✅ **No Sitemap**: Admin pages ไม่อยู่ใน sitemap

### **2. Bot Protection**

- ✅ **Block Search Bots**: Google, Bing, Yandex, Baidu, DuckDuckGo
- ✅ **Block Social Bots**: Facebook, Twitter, LinkedIn, WhatsApp, Telegram
- ✅ **User-Agent Detection**: ตรวจจับและบล็อค bots อัตโนมัติ

### **3. HTTP Headers Security**

```
X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
Cache-Control: no-cache, no-store, must-revalidate
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
```

### **4. Session Security**

- ✅ **HttpOnly Cookies**: ป้องกัน XSS attacks
- ✅ **SameSite=Strict**: ป้องกัน CSRF attacks
- ✅ **24-hour Session**: Auto logout หลัง 24 ชั่วโมง
- ✅ **Secure Flag**: ใช้ HTTPS ใน production

### **5. Authentication**

- ✅ **Password Protection**: SHA-256 hashing
- ✅ **Session Token**: HMAC signature verification
- ✅ **Brute Force Protection**: 1-second delay on failed login

---

## ⚙️ **การตั้งค่า Production**

### **Environment Variables (`.env.local`)**

```env
# =============================================
# ADMIN CREDENTIALS (เปลี่ยนทันที!)
# =============================================
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-password-here

# =============================================
# SECURITY SECRETS
# =============================================
SESSION_SECRET=your-random-secret-key-min-32-chars
REVALIDATE_SECRET=your-revalidate-secret-key

# =============================================
# IP WHITELIST (Optional - แนะนำสำหรับ Production)
# =============================================
# Format: IP1,IP2,IP3 or CIDR notation
# Examples:
ADMIN_ALLOWED_IPS=203.154.x.x,123.45.67.89,192.168.1.0/24

# =============================================
# SHOPIFY CONFIGURATION
# =============================================
SHOPIFY_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token

# =============================================
# EMAIL CONFIGURATION
# =============================================
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_USER_ID=user_xxxxxxx
```

---

## 🔐 **การใช้งาน IP Whitelist**

### **เปิดใช้งาน:**

1. **หา IP ของคุณ:**

   ```bash
   curl https://api.ipify.org
   ```

2. **ตั้งค่าใน `.env.local`:**

   ```env
   ADMIN_ALLOWED_IPS=203.154.123.45
   ```

3. **หลาย IP (คั่นด้วยจุลภาค):**

   ```env
   ADMIN_ALLOWED_IPS=203.154.123.45,123.45.67.89,192.168.1.100
   ```

4. **IP Range (CIDR):**
   ```env
   ADMIN_ALLOWED_IPS=192.168.1.0/24,203.154.0.0/16
   ```

### **หมายเหตุ:**

- ✅ IP Whitelist ใช้งานเฉพาะ **Production** (`NODE_ENV=production`)
- ✅ ไม่กระทบ **Development** (localhost)
- ✅ `/admin/login` เข้าได้จากทุก IP (เพื่อ login)
- ✅ `/admin/dashboard` ต้อง IP ที่อนุญาตเท่านั้น

---

## 📋 **Checklist ก่อน Deploy Production:**

### **1. เปลี่ยน Credentials:**

- [ ] เปลี่ยน `ADMIN_USERNAME`
- [ ] เปลี่ยน `ADMIN_PASSWORD` (ความยาวอย่างน้อย 12 ตัวอักษร)
- [ ] สร้าง `SESSION_SECRET` แบบสุ่ม (32+ ตัวอักษร)
- [ ] สร้าง `REVALIDATE_SECRET`

### **2. ตั้งค่า IP Whitelist (แนะนำ):**

- [ ] หา IP ของ office/บ้าน
- [ ] ตั้งค่า `ADMIN_ALLOWED_IPS`
- [ ] ทดสอบ login จาก IP ที่อนุญาต

### **3. ตรวจสอบ Security Headers:**

- [ ] HTTPS enabled (Vercel auto)
- [ ] HSTS enabled
- [ ] CSP headers
- [ ] X-Frame-Options: DENY

### **4. ทดสอบ:**

- [ ] Login ได้ปกติ
- [ ] Session timeout ทำงาน (24 ชั่วโมง)
- [ ] Logout ทำงาน
- [ ] Bot ถูกบล็อค (ทดสอบด้วย curl)
- [ ] Google ไม่ index หน้า admin (ตรวจสอบใน Search Console)

---

## 🚨 **การตรวจสอบความปลอดภัย:**

### **1. ทดสอบ Bot Protection:**

```bash
# ปลอมตัวเป็น Googlebot
curl -A "Googlebot" https://yourdomain.com/admin/login
# Expected: 403 Access Denied

# ปลอมตัวเป็น Browser ปกติ
curl -A "Mozilla/5.0" https://yourdomain.com/admin/login
# Expected: 200 OK (แต่ต้อง login)
```

### **2. ตรวจสอบ Headers:**

```bash
curl -I https://yourdomain.com/admin/dashboard
# Expected Headers:
# X-Robots-Tag: noindex, nofollow
# X-Frame-Options: DENY
# Cache-Control: no-cache, no-store
```

### **3. ตรวจสอบ Google Index:**

```
site:yourdomain.com/admin
```

Expected: **ไม่มีผลลัพธ์** (ไม่ถูก index)

---

## 🔧 **Troubleshooting:**

### **Problem: ไม่สามารถ login ได้**

**Solution:**

1. ตรวจสอบ username/password ใน `.env.local`
2. Clear browser cookies
3. ตรวจสอบ IP whitelist (ถ้ามี)

### **Problem: IP Whitelist บล็อคตัวเอง**

**Solution:**

1. ปิด IP whitelist ชั่วคราว:
   ```env
   # ADMIN_ALLOWED_IPS=  (comment out)
   ```
2. Deploy ใหม่
3. Login และเพิ่ม IP ปัจจุบัน

### **Problem: Google ยัง index หน้า admin**

**Solution:**

1. ตรวจสอบ `robots.txt` มี `Disallow: /admin*`
2. Submit removal request ใน Google Search Console
3. รอ 1-2 สัปดาห์ให้ Google ลบออก

---

## 📚 **Best Practices:**

1. **เปลี่ยน password เป็นประจำ** (ทุก 3-6 เดือน)
2. **ใช้ 2FA** (เพิ่มใน future update)
3. **Monitor login attempts** (เพิ่ม logging)
4. **Backup ก่อน deploy** ทุกครั้ง
5. **Test ใน staging** ก่อน production
6. **Keep dependencies updated**
7. **Monitor security alerts**

---

## 📞 **Support:**

หากมีปัญหาเรื่องความปลอดภัย:

1. อ่านเอกสารนี้อีกครั้ง
2. ตรวจสอบ logs ใน Vercel
3. ติดต่อ support team

---

**อัปเดตล่าสุด:** October 13, 2025 **เวอร์ชัน:** 1.0.0 **มาตรฐาน:** OWASP Top 10, GDPR Compliant
