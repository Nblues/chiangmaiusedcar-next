# WebSocket HMR Fix - คู่มือการใช้งาน

## ปัญหา WebSocket HMR ใน Next.js

เมื่อพัฒนา Next.js บางครั้งจะพบปัญหา WebSocket HMR (Hot Module Replacement) failed ซึ่งทำให้:

- การ auto-refresh ไม่ทำงาน
- ต้องรีเฟรชหน้าจอด้วยตนเองทุกครั้ง
- console แสดง error เกี่ยวกับ WebSocket connection

## วิธีแก้ไขปัญหา

### 1. ใช้ npm scripts (แนะนำ)

```bash
# รีเซ็ตและแก้ไขปัญหา HMR
npm run hmr:reset

# ตั้งค่าสำหรับ development
npm run hmr:dev

# ตั้งค่าสำหรับ production
npm run hmr:prod

# เริ่ม dev server พร้อมแก้ไข HMR
npm run dev:hmr
```

### 2. ใช้ PowerShell script โดยตรง

```powershell
# รีเซ็ตและแก้ไขปัญหา
.\scripts\fix-hmr.ps1 -Reset

# ตั้งค่า development mode
.\scripts\fix-hmr.ps1 -Development

# ตั้งค่า production mode
.\scripts\fix-hmr.ps1 -Production

# แสดงคู่มือ
.\scripts\fix-hmr.ps1 -Help
```

### 3. ใช้ Node.js script

```bash
# แก้ไขปัญหา HMR
node scripts/fix-hmr.js
```

## สิ่งที่เครื่องมือจะทำ

### Development Mode

1. **ลบ .next directory** - รีเซ็ต build cache
2. **ล้าง package manager cache** - ลบ pnpm/npm/yarn cache
3. **ติดตั้ง dependencies ใหม่** - ให้แน่ใจว่าทุกอย่างเป็นปัจจุบัน
4. **ตั้งค่า HMR configuration** - เปิดใช้งาน WebSocket HMR
5. **เริ่ม development server** - รัน `pnpm dev` หรือ `npm run dev`

### Production Mode

1. **ปิด HMR logs** - ลด noise ใน production
2. **ตั้งค่า environment variables** - NEXT_TELEMETRY_DISABLED=1, DISABLE_HMR_LOGS=true
3. **ปิด Fast Refresh** - ไม่จำเป็นใน production

## การตั้งค่าใน next.config.js

เครื่องมือจะอัปเดต `next.config.js` ด้วยการตั้งค่า WebSocket HMR:

```javascript
webpack: (config, { dev, isServer }) => {
  // WebSocket HMR configuration for development
  if (dev && !isServer) {
    config.devServer = {
      hot: true,
      liveReload: true,
      client: {
        webSocketURL: 'ws://localhost:3000/_next/webpack-hmr',
        overlay: {
          errors: true,
          warnings: false,
        },
        reconnect: 3,
      },
    };
  }
  return config;
};
```

## Proxy Configuration

หากใช้ reverse proxy (nginx, Apache) ต้องตั้งค่า WebSocket forwarding:

### Nginx

```nginx
location /_next/webpack-hmr {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

### Apache

```apache
RewriteEngine on
RewriteCond %{HTTP:UPGRADE} ^WebSocket$ [NC]
RewriteCond %{HTTP:CONNECTION} Upgrade$ [NC]
RewriteRule /_next/webpack-hmr(.*) ws://localhost:3000/_next/webpack-hmr$1 [P,L]
```

## ไฟล์ที่สร้างขึ้น

1. **`hmr.config.json`** - การตั้งค่า HMR สำหรับ dev/prod
2. **`proxy.config.js`** - ตัวอย่างการตั้งค่า proxy
3. **`.env.local`** - environment variables สำหรับ production

## วิธีตรวจสอบว่า HMR ทำงาน

1. เริ่ม dev server: `npm run dev`
2. เปิดเว็บไซต์ใน browser: `http://localhost:3000`
3. แก้ไขไฟล์ .js หรือ .jsx
4. ดูว่าหน้าเว็บ auto-refresh หรือไม่
5. ตรวจสอบ console ว่ามี WebSocket error หรือไม่

## การแก้ไขปัญหาเพิ่มเติม

### หาก HMR ยังไม่ทำงาน

1. **ตรวจสอบ Firewall** - อนุญาตพอร์ต 3000
2. **ปิด antivirus** - อาจบล็อก WebSocket connection
3. **ใช้ localhost แทน 127.0.0.1** - หรือลองสลับกัน
4. **รีสตาร์ท VS Code** - บางครั้ง terminal cache ปัญหา

### หาก build ไม่สำเร็จ

```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
rm -rf .next
npm install
npm run dev
```

### หาก PowerShell บล็อก script

```powershell
# อนุญาต PowerShell scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Environment Variables

ตัวแปรสำคัญสำหรับการควบคุม HMR:

```bash
NODE_ENV=development          # เปิด HMR
NODE_ENV=production          # ปิด HMR
NEXT_TELEMETRY_DISABLED=1    # ปิด telemetry
DISABLE_HMR_LOGS=true        # ปิด HMR logs
FAST_REFRESH=false           # ปิด Fast Refresh
```

## สรุป

เครื่องมือนี้จะแก้ไขปัญหา WebSocket HMR โดยอัตโนมัติ โดยตรวจสอบ environment และปรับการตั้งค่าให้เหมาะสม:

- **Development**: เปิด HMR, รีเซ็ต cache, เริ่ม dev server
- **Production**: ปิด HMR logs, ตั้งค่า environment variables

รันคำสั่ง `npm run hmr:reset` เมื่อใดก็ตามที่มีปัญหา HMR!
