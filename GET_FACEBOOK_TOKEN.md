# 🔑 วิธีสร้าง Facebook Access Token ที่ไม่หมดอายุ

## ⚠️ ปัญหาปัจจุบัน
```
Error: The session is invalid because the user logged out.
```
Token เก่าหมดอายุแล้ว - ต้องสร้างใหม่

---

## 🎯 วิธีที่ 1: User Access Token (แนะนำ - ไม่หมดอายุ)

### ขั้นตอนที่ 1: เข้า Graph API Explorer

1. เปิด: https://developers.facebook.com/tools/explorer/

2. เลือก Facebook App ของคุณ (ถ้ามี) หรือใช้ "Graph API Explorer"

### ขั้นตอนที่ 2: Generate Access Token

1. คลิก **Generate Access Token** (ปุ่มฟ้า)

2. ล็อกอินด้วย Facebook Account ของคุณ

3. อนุญาต permissions (ไม่ต้องเลือกอะไรเพิ่ม - ใช้ default ได้)

4. Copy **Access Token** ที่ได้

### ขั้นตอนที่ 3: แปลง Short-lived → Long-lived Token

**วิธีที่ A: ใช้ Graph API Explorer (ง่ายที่สุด)**

1. ที่หน้า Graph API Explorer เดิม
2. ด้านล่าง Access Token มีปุ่ม 🔄 **"ℹ️ Access Token Info"**
3. คลิกแล้วจะเห็นข้อมูล token
4. มีปุ่ม **"Extend Access Token"** → คลิก
5. Token จะเปลี่ยนเป็นแบบไม่หมดอายุ (หรืออายุ 60 วัน)

**วิธีที่ B: ใช้ API โดยตรง**

```powershell
# แทน YOUR_APP_ID, YOUR_APP_SECRET, และ SHORT_LIVED_TOKEN
$appId = "YOUR_APP_ID"
$appSecret = "YOUR_APP_SECRET"
$shortToken = "SHORT_LIVED_TOKEN"

$url = "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$appId&client_secret=$appSecret&fb_exchange_token=$shortToken"

Invoke-RestMethod -Uri $url
```

Response จะได้:
```json
{
  "access_token": "EAAFmLEj...",  ← Token ใหม่ที่อายุยาวขึ้น
  "token_type": "bearer"
}
```

---

## 🎯 วิธีที่ 2: Page Access Token (อายุไม่จำกัด!)

**สำหรับเว็บไซต์ธุรกิจ แนะนำวิธีนี้!**

### ขั้นตอนที่ 1: สร้าง Facebook Page (ถ้ายังไม่มี)

1. ไปที่: https://www.facebook.com/pages/create
2. สร้าง Facebook Page สำหรับธุรกิจ "ครูหนึ่งรถสวย"

### ขั้นตอนที่ 2: สร้าง Facebook App

1. ไปที่: https://developers.facebook.com/apps
2. คลิก **Create App**
3. เลือก **Business** → **Next**
4. กรอก:
   - App Display Name: `ChiangmaiUsedCar OG Scraper`
   - App Contact Email: อีเมลของคุณ
5. คลิก **Create App**

### ขั้นตอนที่ 3: เพิ่ม Product

1. ในหน้า App Dashboard
2. หา **Add a Product**
3. เพิ่ม **"Facebook Login"**

### ขั้นตอนที่ 4: Get Page Access Token

1. ไปที่: https://developers.facebook.com/tools/explorer/
2. เลือก App ที่สร้าง
3. คลิก **Generate Access Token**
4. เลือก **"Get User Access Token"**
5. เพิ่ม Permissions:
   - ✅ `pages_read_engagement`
   - ✅ `pages_show_list`
6. คลิก **Generate Access Token**
7. ล็อกอินและอนุญาต

### ขั้นตอนที่ 5: แปลงเป็น Page Token (ไม่หมดอายุ!)

**ใช้ API นี้:**

```powershell
# User Access Token ที่เพิ่งได้มา
$userToken = "EAAFmLEj..."

# ดึง list pages ที่คุณเป็นเจ้าของ
$pages = Invoke-RestMethod -Uri "https://graph.facebook.com/v21.0/me/accounts?access_token=$userToken"

# แสดง pages ทั้งหมด
$pages.data | Format-Table name, access_token, id

# เลือก access_token ของ page "ครูหนึ่งรถสวย"
# Token นี้จะไม่หมดอายุ!
```

---

## ⚡ วิธีเร็ว: ใช้ Access Token Tool

1. เปิด: https://developers.facebook.com/tools/accesstoken/

2. ดูในส่วน **"User Token"** หรือ **"Page Token"**

3. คลิก **Debug** เพื่อดูข้อมูล

4. ถ้าเป็น Page Token จะเห็น:
   ```
   Expires: Never
   ```

5. Copy Token นั้นมาใช้

---

## 🔧 อัปเดต Token ใน Vercel

หลังได้ Token ใหม่แล้ว:

```powershell
# ลบ token เก่า
vercel env rm FACEBOOK_GRAPH_ACCESS_TOKEN production --yes
vercel env rm FACEBOOK_GRAPH_ACCESS_TOKEN preview --yes
vercel env rm FACEBOOK_GRAPH_ACCESS_TOKEN development --yes

# เพิ่ม token ใหม่
vercel env add FACEBOOK_GRAPH_ACCESS_TOKEN production
# ใส่: EAAFmLEj... (token ใหม่)

vercel env add FACEBOOK_GRAPH_ACCESS_TOKEN preview
vercel env add FACEBOOK_GRAPH_ACCESS_TOKEN development

# Redeploy
vercel --prod --yes
```

---

## ✅ ทดสอบว่า Token ใช้งานได้

```powershell
# Test API ด้วย token ใหม่
$token = "EAAFmLEj..."  # Token ใหม่
$testUrl = "https://graph.facebook.com/v21.0/?id=https://www.chiangmaiusedcar.com&scrape=true&access_token=$token"

Invoke-RestMethod -Method POST -Uri $testUrl
```

ถ้าได้ response แสดงว่า token ใช้งานได้!

---

## 📋 สรุปวิธีที่ดีที่สุด

| วิธี | อายุ Token | ความยาก | แนะนำ |
|------|-----------|---------|-------|
| User Token | 60 วัน | ⭐⭐ | สำหรับทดสอบ |
| **Page Token** | **ไม่หมดอายุ** | ⭐⭐⭐ | **แนะนำ!** |

**Page Access Token คือทางเลือกที่ดีที่สุด** - ไม่หมดอายุและเหมาะกับธุรกิจ!

---

## 🆘 ติดปัญหา?

แจ้งผมได้เลยครับ จะช่วยแก้ไขทันที! 🚀
