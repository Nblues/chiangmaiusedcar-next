# 🔄 Backup Strategy - มาตรฐานสากล

## 📊 3-2-1 Backup Rule (มาตรฐานสากล)

### กฎ 3-2-1:

- **3 สำเนา**: ข้อมูลต้นฉบับ + backup 2 ชุด
- **2 สื่อ**: เก็บใน 2 ประเภทสื่อต่างกัน (local + cloud)
- **1 offsite**: อย่างน้อย 1 สำเนาต้องอยู่นอกสถานที่

---

## 🎯 Backup Schedule แนะนำ

### 1. **Database Backup**

- **ทุกวัน**: Full backup ตอนกลางคืน (2:00 AM)
- **ทุกชั่วโมง**: Incremental backup
- **Retention**: เก็บ 30 วัน

### 2. **Configuration Backup**

- **ทุกสัปดาห์**: Full backup
- **Retention**: เก็บ 90 วัน

### 3. **Content/Media Backup**

- **ทุกวัน**: Incremental
- **ทุกสัปดาห์**: Full backup
- **Retention**: เก็บ 180 วัน

### 4. **Code/Application Backup**

- **Git repository**: Real-time (มี version control)
- **Production snapshot**: ทุกครั้งที่ deploy

---

## 💾 ตำแหน่งเก็บ Backup

### Local (Fast Recovery)

```
backups/
├── daily/          # Backup ประจำวัน (7 วัน)
├── weekly/         # Backup รายสัปดาห์ (4 สัปดาห์)
├── monthly/        # Backup รายเดือน (12 เดือน)
└── archive/        # Archive ย้อนหลัง (1 ปี+)
```

### Cloud Storage (Offsite)

- **Firebase Storage**: Primary cloud backup
- **Google Drive/Dropbox**: Secondary backup
- **Vercel Blob Storage**: Alternative

---

## 🔧 Automation Tools

### 1. **Vercel Cron Jobs** (แนะนำ)

```javascript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/backup-daily",
      "schedule": "0 2 * * *"  // ทุกวัน 2:00 AM
    },
    {
      "path": "/api/cron/backup-weekly",
      "schedule": "0 3 * * 0"  // ทุกอาทิตย์ 3:00 AM
    }
  ]
}
```

### 2. **Node-Cron** (Local Development)

```javascript
const cron = require('node-cron');

// ทุกวัน 2:00 AM
cron.schedule('0 2 * * *', () => {
  runDailyBackup();
});

// ทุกสัปดาห์
cron.schedule('0 3 * * 0', () => {
  runWeeklyBackup();
});
```

### 3. **GitHub Actions** (CI/CD)

```yaml
name: Weekly Backup
on:
  schedule:
    - cron: '0 2 * * 0' # ทุกอาทิตย์
  workflow_dispatch:
```

---

## 🔥 Firebase Integration

### Setup Firebase Admin

```bash
pnpm add firebase-admin
```

### Configuration

```javascript
// lib/firebase-admin.js
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const storage = admin.storage();
export default admin;
```

---

## 📦 Backup Content Types

### 1. **Configuration**

- Environment variables (encrypted)
- next.config.js
- package.json dependencies
- API keys (encrypted)

### 2. **Database**

- Shopify product data
- User sessions
- Analytics data
- Logs

### 3. **Content**

- Blog posts
- Images metadata
- Custom data

---

## 🔐 Security Best Practices

### 1. **Encryption**

```javascript
// เข้ารหัสก่อน backup
const encrypted = crypto.encrypt(data, BACKUP_ENCRYPTION_KEY);
```

### 2. **Access Control**

- ใช้ Service Account กับ Firebase
- จำกัดสิทธิ์ read/write
- มี audit log

### 3. **Verification**

- ตรวจสอบ checksum/hash
- ทดสอบ restore เป็นประจำ
- Alert เมื่อ backup ล้มเหลว

---

## 📈 Monitoring & Alerts

### ตรวจสอบสถานะ

- Backup success/failure rate
- Storage usage
- Last backup timestamp
- Recovery time objective (RTO)
- Recovery point objective (RPO)

### Notifications

- Email แจ้งเตือนเมื่อ backup สำเร็จ/ล้มเหลว
- Slack/Discord webhook
- SMS สำหรับ critical failures

---

## 💰 Cost Optimization

### Firebase Storage Pricing

- **Free tier**: 5 GB storage
- **Paid**: $0.026/GB/month
- **Transfer**: $0.12/GB

### แนะนำ:

1. Compress backup ก่อนอัปโหลด (gzip)
2. ลบ backup เก่าอัตโนมัติ
3. ใช้ lifecycle policies
4. Backup เฉพาะข้อมูลสำคัญ

---

## 🚀 Recovery Procedures

### 1. **Fast Recovery** (< 5 นาที)

- ใช้ local backup
- Restore configuration
- Restart services

### 2. **Cloud Recovery** (< 30 นาที)

- ดาวน์โหลดจาก Firebase
- Verify integrity
- Deploy to production

### 3. **Disaster Recovery** (< 4 ชั่วโมง)

- Restore จาก offsite backup
- Rebuild infrastructure
- Full system restore

---

## 📝 Testing Schedule

### Regular Testing

- **ทุกเดือน**: ทดสอบ restore backup ล่าสุด
- **ทุกไตรมาส**: Full disaster recovery drill
- **ทุกปี**: Complete system rebuild test

---

## 🔄 Retention Policies

| Type    | Frequency   | Retention |
| ------- | ----------- | --------- |
| Hourly  | Every hour  | 24 hours  |
| Daily   | Every day   | 30 days   |
| Weekly  | Every week  | 12 weeks  |
| Monthly | Every month | 12 months |
| Yearly  | Every year  | 7 years   |

---

## 📋 Compliance

### GDPR/Data Protection

- เข้ารหัสข้อมูลส่วนบุคคล
- มีสิทธิ์ลบข้อมูล
- Log การเข้าถึง backup

### Business Continuity

- RTO: < 4 ชั่วโมง
- RPO: < 1 ชั่วโมง
- Backup verification quarterly

---

## 🛠️ Implementation Checklist

- [ ] ติดตั้ง Firebase Admin SDK
- [ ] สร้าง Service Account
- [ ] ตั้งค่า environment variables
- [ ] สร้าง API endpoints สำหรับ backup
- [ ] ตั้งค่า cron jobs (Vercel/Node-cron)
- [ ] ทดสอบ backup/restore
- [ ] ตั้งค่า monitoring & alerts
- [ ] เขียน documentation
- [ ] ทดสอบ disaster recovery
- [ ] Train ทีมเรื่อง recovery procedures
