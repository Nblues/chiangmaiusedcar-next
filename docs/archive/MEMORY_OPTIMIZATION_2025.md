# การตั้งค่าแรมสำหรับระบบ 12 GB RAM (มาตรฐาน 2025)

## สรุปการตั้งค่า

### 1. Node.js Memory Allocation (V8 Heap)

**ระบบ 12 GB RAM - การจัดสรรแรมที่เหมาะสม:**

- **Development Mode**: 8 GB (8192 MB)
  - ใช้งานทั่วไป, Hot Module Replacement (HMR)
  - เหลือแรม 4 GB สำหรับระบบและเครื่องมืออื่น
- **Production Build**: 10 GB (10240 MB)
  - การ build ครั้งเดียว, ใช้แรมสูงสุด
  - เหลือแรม 2 GB สำหรับระบบขั้นต่ำ
- **Light Development**: 4 GB (4096 MB)
  - เมื่อต้องการทำงานหลายโปรแกรมพร้อมกัน
- **Safe Mode**: 2 GB (2048 MB)
  - สำหรับระบบที่มีแรมน้อยหรือเกิดปัญหา

### 2. การตั้งค่าเพิ่มเติม

#### `--max-semi-space-size`

- **Development**: 256 MB
- **Production Build**: 512 MB
- ช่วยให้ Young Generation GC ทำงานได้เร็วขึ้น

#### `UV_THREADPOOL_SIZE`

- **ค่าที่แนะนำ**: 8 (สำหรับ CPU 8+ cores)
- เพิ่มประสิทธิภาพ I/O operations (file system, network)

### 3. คำสั่งที่สำคัญ

```bash
# Development (8 GB)
npm run dev
npm run dev:turbo  # ใช้ Turbopack

# Production Build (10 GB)
npm run build

# Light Development (4 GB)
npm run dev:light

# Safe Mode (2 GB)
npm run dev:safe

# Build Analysis (10 GB)
npm run build:analyze
```

### 4. หลักการจัดสรรแรม (2025 Best Practices)

#### สำหรับ Node.js Applications:

| RAM รวม | Development | Production Build | System Reserve |
| ------- | ----------- | ---------------- | -------------- |
| 8 GB    | 4-6 GB      | 6-7 GB           | 1-2 GB         |
| 12 GB   | 8 GB        | 10 GB            | 2-4 GB         |
| 16 GB   | 10-12 GB    | 14 GB            | 2-4 GB         |
| 32 GB   | 16-24 GB    | 28 GB            | 4-8 GB         |

#### คำนวณแรมที่เหมาะสม:

- **Development**: 60-70% ของ RAM
- **Build**: 80-85% ของ RAM
- **System Reserve**: อย่างน้อย 2 GB สำหรับ OS และเครื่องมือ

### 5. การเพิ่มประสิทธิภาพสำหรับ GitHub Copilot

GitHub Copilot และ AI assistants ใช้แรมเพิ่มเติมประมาณ:

- **VS Code Extension**: 500 MB - 1 GB
- **Language Server**: 200-500 MB
- **Cache & Indexing**: 500 MB - 1 GB

**คำแนะนำ**:

- เหลือแรมอย่างน้อย 2-3 GB สำหรับ VS Code + Copilot
- ปิด extensions ที่ไม่จำเป็น
- ใช้ `dev:light` mode เมื่อทำงานกับ Copilot อย่างหนัก

### 6. Monitoring & Troubleshooting

#### ดูการใช้แรมของ Node.js:

```bash
# Windows PowerShell
Get-Process node | Select-Object Name, PM, CPU, @{N='Memory(MB)';E={[math]::round($_.PM/1MB,2)}}

# Runtime monitoring
node --trace-gc your-script.js
```

#### เครื่องหมายแสดงปัญหาแรม:

- ❌ "JavaScript heap out of memory"
- ❌ Build ช้ามาก (>5 นาที)
- ❌ System freeze หรือ crash

#### วิธีแก้:

1. ลดแรม development: ใช้ `dev:light`
2. ปิดแท็บ browser ที่ไม่ได้ใช้
3. Restart VS Code
4. Clear `.next` cache: `rm -rf .next`

### 7. การตั้งค่า `.npmrc`

```properties
# Network optimization
fetch-retries=3
maxsockets=20
network-timeout=300000

# Thread pool
UV_THREADPOOL_SIZE=8

# Cache
cache-min=10
prefer-offline=false
```

### 8. Production Deployment (Vercel)

Vercel ใช้:

- **Build**: 8 GB (Hobby plan) / 32 GB (Pro plan)
- **Runtime**: 1 GB (Serverless Functions)

การตั้งค่าใน `next.config.js`:

```javascript
module.exports = {
  // Optimize bundle size
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lodash', 'date-fns'],
  },
};
```

## สรุป

✅ **Development**: 8 GB + semi-space 256 MB + UV threads 8  
✅ **Build**: 10 GB + semi-space 512 MB + UV threads 8  
✅ **System Reserve**: 2-4 GB สำหรับ OS, VS Code, Copilot  
✅ **Monitoring**: ติดตามการใช้แรมเป็นประจำ

---

**อัปเดต**: 19 ตุลาคม 2025  
**ระบบ**: Windows 11, Node.js 20+, Next.js 14  
**RAM**: 12 GB DDR4
