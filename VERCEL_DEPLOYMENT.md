# Vercel Deployment Guide

## Required Environment Variables

สำหรับ Vercel deployment ต้องตั้งค่า environment variables เหล่านี้ใน Vercel Dashboard:

### 1. Shopify (Required)

```bash
SHOPIFY_DOMAIN=kn-goodcar.com
SHOPIFY_STOREFRONT_TOKEN=bb70cb008199a94b83c98df0e45ada67
```

### 2. Admin Authentication (Required)

```bash
ADMIN_USERNAME=kngoodcar
ADMIN_PASSWORD=Kn-goodcar**5277
SESSION_SECRET=7f1a6f08c3b64b0e9c0a5a1d7e9b4a32e4e9f7dac8b64c1e8f0d9b7a6c5d4e3f
```

### 3. API Security (Required)

```bash
API_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
API_SECRET=local_hmac_secret_change_me
REVALIDATE_SECRET=2c141efd3a2c01d8236828a54bbcdf4c
SHOPIFY_WEBHOOK_SECRET=b8aec9cffadd6f449e3ffe6208f0ccbd
```

### 4. Site URLs (Auto-set by vercel.json)

```bash
SITE_URL=https://www.chiangmaiusedcar.com
NEXT_PUBLIC_SITE_URL=https://www.chiangmaiusedcar.com
```

### 5. EmailJS (Auto-set by vercel.json)

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qlcksif
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_zd6e3f6
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=P3wnNJB_Y_PddrdBJ
```

## การตั้งค่าใน Vercel Dashboard

1. ไปที่: https://vercel.com/chiangmaiusedcars-projects/chiangmaiusedcar-next
2. คลิก **Settings** → **Environment Variables**
3. เพิ่ม variables ทั้งหมดจากด้านบน
4. เลือก Environment: **Production**, **Preview**, **Development**
5. คลิก **Save**

## การ Redeploy

หลังจากตั้งค่า environment variables:

```bash
# วิธีที่ 1: Push code ใหม่
git add .
git commit -m "Update configuration"
git push origin master

# วิธีที่ 2: Redeploy ใน Vercel Dashboard
# คลิก Deployments → คลิกจุด 3 จุด → Redeploy
```

## Troubleshooting

### Build Failed?

1. ตรวจสอบว่าตั้งค่า environment variables ครบถ้วน
2. ตรวจสอบ build logs ใน Vercel
3. ทดสอบ build ในเครื่องก่อน: `pnpm build`

### 500 Error?

1. ตรวจสอบ Shopify credentials
2. ตรวจสอบ API_KEY และ SESSION_SECRET

### Missing Data?

1. ตรวจสอบ SHOPIFY_STOREFRONT_TOKEN
2. ตรวจสอบ SHOPIFY_DOMAIN

## Build Commands

Vercel ใช้ commands เหล่านี้:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install"
}
```

## Notes

- ไฟล์ `.env.local` ไม่ถูก deploy (อยู่ใน `.vercelignore`)
- Environment variables ใน `vercel.json` จะ override `.env.local`
- ใช้ `NEXT_PUBLIC_*` สำหรับ client-side variables
