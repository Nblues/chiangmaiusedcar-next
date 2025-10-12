# Facebook OG Re-scrape (No Token Required) 🔓

## ภาพรวม

ระบบ re-scrape Facebook Open Graph cache ได้รับการอัปเดตให้ **ไม่ต้องใช้ Access Token** อีกต่อไป!

## ✅ ข้อดี

- ✅ **ไม่ต้องจัดการ Token** - ไม่มีปัญหาหมดอายุ
- ✅ **ไม่ต้องสร้าง Facebook App** - ใช้ Public API
- ✅ **ปลอดภัย** - ยังคงต้องใช้ `RESCRAPE_SECRET` ป้องกัน
- ✅ **ง่ายต่อการ Maintain** - ไม่มี credentials ซับซ้อน

## ⚠️ ข้อจำกัด

- ⚠️ **Rate Limits** - Facebook อาจจำกัดจำนวน requests
- ⚠️ **ช้ากว่า** - เพิ่ม delay เป็น 500ms ต่อ URL (ป้องกัน rate limit)
- ⚠️ **Public URLs เท่านั้น** - URL ต้องเข้าถึงได้จาก Internet

## 🚀 การใช้งาน

### 1. Re-scrape รถทั้งหมด

```bash
curl -X POST "https://www.chiangmaiusedcar.com/api/social/rescrape?secret=YOUR_SECRET"
```

### 2. Re-scrape รถจำนวนจำกัด (50 คันแรก)

```bash
curl -X POST "https://www.chiangmaiusedcar.com/api/social/rescrape?secret=YOUR_SECRET&limit=50"
```

### 3. Re-scrape รถคันเดียว

```bash
curl -X POST "https://www.chiangmaiusedcar.com/api/social/rescrape?secret=YOUR_SECRET&handle=toyota-camry-2024"
```

## 🔧 Configuration

### Environment Variables (Vercel)

เหลือแค่ตัวเดียว:

```env
RESCRAPE_SECRET=your-random-secret-string
```

**ไม่ต้องใช้อีกต่อไป:**
- ~~`FACEBOOK_GRAPH_ACCESS_TOKEN`~~
- ~~`FACEBOOK_APP_SECRET`~~

## 🤖 GitHub Workflow

Workflow จะรันอัตโนมัติหลัง deploy:

```yaml
# .github/workflows/rescrape-facebook.yml
- name: Re-scrape Facebook Cache
  run: |
    curl -X POST "https://www.chiangmaiusedcar.com/api/social/rescrape?secret=${{ secrets.RESCRAPE_SECRET }}"
```

## 📊 Response Format

```json
{
  "ok": true,
  "count": 72,
  "results": [
    {
      "url": "https://www.chiangmaiusedcar.com/car/toyota-camry-2024",
      "status": 200,
      "data": {
        "id": "https://www.chiangmaiusedcar.com/car/toyota-camry-2024",
        "share": {
          "comment_count": 0,
          "share_count": 0
        }
      }
    }
  ]
}
```

## 🔍 Technical Details

### API Endpoint Used

```
POST https://graph.facebook.com/?id={url}&scrape=true
```

### Features

- **No Authentication**: ไม่ต้องใช้ access token
- **Public API**: Facebook's Sharing Debugger endpoint
- **Rate Limiting**: 500ms delay ระหว่าง requests
- **Error Handling**: จัดการ errors แบบละเอียด

### Code Location

- **API Handler**: `pages/api/social/rescrape.js`
- **Workflow**: `.github/workflows/rescrape-facebook.yml`

## 🆚 เปรียบเทียบกับเวอร์ชันเก่า

| Feature | เวอร์ชันเก่า (Token) | **เวอร์ชันใหม่ (No Token)** |
|---------|---------------------|------------------------------|
| Access Token | ✅ ต้องการ | ❌ ไม่ต้องการ |
| App Secret | ✅ ต้องการ | ❌ ไม่ต้องการ |
| Token Expiry | ❌ หมดอายุ 60 วัน | ✅ ไม่มีปัญหา |
| Rate Limits | น้อยกว่า | มากกว่าเล็กน้อย |
| Setup | ซับซ้อน | ง่ายมาก |
| Maintenance | ต้องต่ออายุ token | ไม่ต้องทำอะไร |

## 📝 Migration Notes

### ถ้ามี Environment Variables เดิม

สามารถลบออกได้:

1. ไปที่ Vercel Dashboard → Settings → Environment Variables
2. ลบ `FACEBOOK_GRAPH_ACCESS_TOKEN`
3. ลบ `FACEBOOK_APP_SECRET`
4. เก็บไว้: `RESCRAPE_SECRET` (ยังใช้อยู่)

### ไม่ต้อง Redeploy

การเปลี่ยนแปลงนี้:
- ✅ Backward compatible
- ✅ ไม่ทำให้ระบบเดิมพัง
- ✅ ทำงานได้ทันที

## 🎯 Use Cases

### 1. Auto Re-scrape หลัง Deploy
Workflow รันอัตโนมัติทุกครั้งที่ push code

### 2. Manual Re-scrape
เมื่อต้องการอัปเดต OG tags ด้วยตัวเอง

### 3. Batch Updates
Re-scrape รถหลายคันพร้อมกัน (ระวัง rate limits)

## 🛡️ Security

- ✅ Protected by `RESCRAPE_SECRET`
- ✅ POST method only
- ✅ No sensitive credentials exposed
- ✅ Server-side only (API route)

## 🔗 Resources

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Open Graph Protocol](https://ogp.me/)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

---

**อัปเดตล่าสุด**: 12 ตุลาคม 2025  
**เวอร์ชัน**: 2.0 (No Token Required)
