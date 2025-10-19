# 🔥 Firebase Backup Setup Guide

## 📋 ขั้นตอนการตั้งค่า Firebase สำหรับ Backup

### 1. สร้าง Firebase Project

1. ไปที่ https://console.firebase.google.com/
2. คลิก "Add project"
3. ตั้งชื่อโปรเจค เช่น `chiangmaiusedcar-backup`
4. เปิดใช้งาน Google Analytics (optional)
5. คลิก "Create project"

### 2. เปิดใช้งาน Firebase Storage

1. ใน Firebase Console ไปที่ **Build** → **Storage**
2. คลิก **Get Started**
3. เลือก **Start in production mode**
4. เลือก storage location: `asia-southeast1` (สิงคโปร์ - ใกล้ไทยที่สุด)
5. คลิก **Done**

### 3. สร้าง Service Account

1. ไปที่ **Project Settings** (⚙️ ข้างบน)
2. เลือกแท็บ **Service accounts**
3. คลิก **Generate new private key**
4. ดาวน์โหลดไฟล์ JSON

### 4. ตั้งค่า Environment Variables

เปิดไฟล์ JSON ที่ดาวน์โหลดมา คุณจะเห็น:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

เพิ่มใน `.env.local`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

**⚠️ สำคัญ**:

- ห่อ `FIREBASE_PRIVATE_KEY` ด้วย double quotes
- เก็บ `\n` ไว้ใน private key

### 5. ตั้งค่า Storage Rules

ใน Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // อนุญาตเฉพาะ Service Account
    match /{allPaths=**} {
      allow read, write: if false; // ปิดการเข้าถึงทั่วไป
    }

    // Service Account สามารถ read/write ได้ทุกอย่าง
    // (จะใช้ admin SDK ไม่ต้องกำหนด rules)
  }
}
```

### 6. ติดตั้ง Dependencies

```bash
pnpm add firebase-admin
```

### 7. ตั้งค่า Vercel Cron (Production)

1. ไปที่ Vercel Dashboard → Project Settings
2. เลือก **Environment Variables**
3. เพิ่ม Firebase credentials:

   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_STORAGE_BUCKET`
   - `CRON_SECRET` (สุ่มค่า random string)

4. Redeploy project

### 8. ทดสอบ Backup

#### Manual Test:

```bash
# Local
curl -X POST http://localhost:3000/api/backup/automated \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-session=YOUR_SESSION" \
  -d '{"uploadToFirebase": true}'

# Production
curl -X POST https://www.chiangmaiusedcar.com/api/backup/automated \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-session=YOUR_SESSION" \
  -d '{"uploadToFirebase": true}'
```

#### Test Cron:

```bash
curl -X POST https://www.chiangmaiusedcar.com/api/cron/backup-daily \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 📊 Backup Schedule (อัตโนมัติ)

### Daily Backup

- **เวลา**: ทุกวัน 2:00 AM (UTC)
- **Endpoint**: `/api/cron/backup-daily`
- **เก็บที่**: `backups/daily/`
- **Retention**: 30 วัน

### Weekly Backup

- **เวลา**: ทุกอาทิตย์ 3:00 AM (UTC)
- **Endpoint**: `/api/cron/backup-weekly`
- **เก็บที่**: `backups/weekly/`
- **Retention**: 12 สัปดาห์

---

## 💾 ดู Backup ใน Firebase

1. ไปที่ Firebase Console → Storage
2. เปิด folder `backups/`
3. จะเห็น:
   ```
   backups/
   ├── automated/      # Manual backups
   ├── daily/          # Daily automated
   └── weekly/         # Weekly automated
   ```

---

## 🔄 Restore Backup

### จาก Firebase:

```javascript
// 1. ดาวน์โหลด backup file
const file = bucket.file('backups/daily/backup-2025-01-14.json');
const [content] = await file.download();
const backupData = JSON.parse(content.toString());

// 2. Restore ข้อมูล
await restoreData(backupData);
```

### จาก Local:

```bash
# อ่านไฟล์
cd backups/automated
cat backup-2025-01-14T12-00-00-000Z.json

# Restore (custom script)
node scripts/restore-backup.js backup-2025-01-14T12-00-00-000Z.json
```

---

## 📈 Monitor Backup Status

### ใน Admin Dashboard:

1. ไปที่ `/admin/dashboard`
2. เลือก "Backup & Security"
3. คลิก "Backup Status"
4. ดูได้:
   - จำนวน backups
   - Last backup time
   - Total size
   - Status

### ใน Firebase Console:

1. Storage → Usage
2. ดู:
   - Storage used
   - Number of files
   - Download count
   - Upload count

---

## 💰 ค่าใช้จ่าย Firebase Storage

### Free Tier (Spark Plan):

- **Storage**: 5 GB ฟรี
- **Downloads**: 1 GB/วัน ฟรี
- **Uploads**: 20,000/วัน ฟรี

### Paid (Blaze Plan):

- **Storage**: $0.026/GB/เดือน (~1 บาท/GB)
- **Downloads**: $0.12/GB
- **Uploads**: ฟรี

### ประมาณการ:

- Backup 1 ไฟล์ = ~10-50 KB
- Daily backup (30 วัน) = ~1.5 MB
- Weekly backup (12 สัปดาห์) = ~600 KB
- **รวม/เดือน**: ~2-5 MB = **ฟรี!** ✅

---

## 🔐 Security Best Practices

### 1. เข้ารหัสข้อมูลสำคัญ:

```javascript
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.BACKUP_ENCRYPTION_KEY, 'salt', 32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}
```

### 2. จำกัดการเข้าถึง:

- ใช้ Service Account แทน API keys
- ตั้ง Storage Rules ให้เข้มงวด
- เก็บ credentials ใน environment variables

### 3. Audit Logs:

- Log ทุกครั้งที่มี backup
- Log ทุกครั้งที่ download backup
- Alert เมื่อมี unauthorized access

---

## 🚨 Troubleshooting

### ❌ Error: Firebase Admin not initialized

**สาเหตุ**: ขาด environment variables

**แก้ไข**:

```bash
# ตรวจสอบใน .env.local
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY="xxx"
FIREBASE_STORAGE_BUCKET=xxx
```

### ❌ Error: Invalid credentials

**สาเหตุ**: Private key format ผิด

**แก้ไข**:

- ห่อ private key ด้วย double quotes
- เก็บ `\n` ไว้
- ไม่ต้องแปลง `\n` เป็น newline จริง

### ❌ Error: Storage bucket not found

**สาเหตุ**: ยังไม่ได้เปิดใช้งาน Firebase Storage

**แก้ไข**:

1. ไปที่ Firebase Console
2. Build → Storage
3. Get Started

---

## 📝 Next Steps

- [ ] ตั้งค่า Firebase Project
- [ ] เพิ่ม environment variables
- [ ] ทดสอบ manual backup
- [ ] Deploy to Vercel
- [ ] ตรวจสอบ cron jobs ทำงาน
- [ ] ตั้งค่า monitoring & alerts
- [ ] เขียน restore script
- [ ] ทดสอบ disaster recovery
