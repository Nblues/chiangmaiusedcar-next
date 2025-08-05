# 🚀 Vercel Deployment Guide

## ครูหนึ่งรถสวย - chiangmaiusedcar.com

### 📋 Pre-Deployment Checklist

- [x] ✅ Fixed hydration errors
- [x] ✅ Optimized preload resources
- [x] ✅ Updated environment variables
- [x] ✅ Created backup tag: `backup-before-deploy-20250805-0348`
- [x] ✅ Production build tested
- [x] ✅ SEO optimizations complete

---

## 🔄 Step-by-Step Deployment

### 1. Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Test Production Build

```bash
# รัน script นี้เพื่อ test build
deploy-production.bat
```

### 4. Deploy to Vercel

```bash
# Deploy ไป preview environment ก่อน
vercel

# Deploy ไป production
vercel --prod
```

### 5. Configure Custom Domain

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจค `chiangmaiusedcar-next`
3. ไปที่ Settings > Domains
4. เพิ่มโดเมน: `chiangmaiusedcar.com` และ `www.chiangmaiusedcar.com`
5. ตั้งค่า DNS ที่ domain registrar ให้ชี้ไป Vercel

### 6. Set Environment Variables

คัดลอกค่าจาก `VERCEL_ENV_VARIABLES.txt` ไปใส่ใน:

- Vercel Dashboard > Settings > Environment Variables

### 7. SSL Certificate (Automatic)

Vercel จะสร้าง SSL certificate อัตโนมัติเมื่อเพิ่มโดเมน

---

## 🔧 DNS Configuration

### A. ถ้าใช้ Cloudflare

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### B. ถ้าใช้ DNS Provider อื่น

```
Type: A
Name: @
Value: 76.76.19.61

Type: A
Name: www
Value: 76.76.19.61
```

---

## 🧪 Post-Deployment Testing

### 1. Core Functionality

- [ ] หน้าแรกโหลดได้
- [ ] รายการรถแสดงครบ
- [ ] รายละเอียดรถเปิดได้
- [ ] ค้นหารถทำงาน
- [ ] ฟอร์มติดต่อส่งได้

### 2. SEO & Performance

- [ ] Meta tags ครบถ้วน
- [ ] Sitemap accessible
- [ ] Google Analytics ทำงาน
- [ ] Images loading properly
- [ ] Mobile responsive

### 3. External Integrations

- [ ] Shopify data loading
- [ ] reCAPTCHA working
- [ ] EmailJS sending emails
- [ ] Social media links working

---

## 🆘 Troubleshooting

### ปัญหา Build Failed

```bash
# ลบ cache และ rebuild
rm -rf .next
pnpm build
```

### ปัญหา Environment Variables

- ตรวจสอบว่าใส่ครบทุกตัวแปรใน Vercel Dashboard
- ตรวจสอบค่าไม่มีช่องว่างหน้าหลัง

### ปัญหา Domain Configuration

- รอ DNS propagation (อาจใช้เวลา 24-48 ชั่วโมง)
- ใช้ DNS checker tools ตรวจสอบ

---

## 🔄 Rollback Instructions

### กรณีมีปัญหาต้องย้อนกลับ:

```bash
# ย้อนกลับโค้ด
git checkout backup-before-deploy-20250805-0348

# Deploy version เก่า
vercel --prod
```

### การแก้ไขแล้ว deploy ใหม่:

```bash
# แก้ไขโค้ด
git add .
git commit -m "Fix deployment issues"

# Deploy
vercel --prod
```

---

## 📞 Support Contact

- **Email**: support@chiangmaiusedcar.com
- **Phone**: 094-064-9018
- **LINE**: @krunueng_usedcar

---

## 📊 Monitoring & Analytics

- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics 4**: GA ID `G-81DK266FDR`
- **Search Console**: Monitor SEO performance
- **Uptime Monitoring**: Set up monitoring service
