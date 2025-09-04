# คู่มือการใช้งานสคริปต์จัดการแอปพลิเคชัน

# Development Apps Management Scripts Guide

## ไฟล์ที่สร้าง

### 1. 📜 **dev-env-manager.ps1** (แนะนำ - ใช้งานง่าย)

สคริปต์หลักที่รวมทุกฟีเจอร์ไว้ในไฟล์เดียว

**การใช้งาน:**

```powershell
# เปิดเมนู
.\dev-env-manager.ps1

# ปิดแอปทันที
.\dev-env-manager.ps1 -Action close

# เปิดแอปกลับคืน
.\dev-env-manager.ps1 -Action restore

# ตั้งค่าเปิดอัตโนมัติเมื่อรีสตาร์ท
.\dev-env-manager.ps1 -Action setup
```

### 2. 🚀 **quick-dev.ps1** (เร็วที่สุด)

สคริปต์แบบเร็วสำหรับใช้งานพื้นฐาน

**การใช้งาน:**

```powershell
# ปิดแอป
.\quick-dev.ps1 close

# เปิดกลับคืน
.\quick-dev.ps1 restore
```

### 3. ⚙️ **app-manager.ps1** (แบบเมนู)

สคริปต์แบบเมนูที่เรียกใช้สคริปต์อื่น

### 4. 📁 สคริปต์แยกไฟล์

- `close-non-dev-apps.ps1` - ปิดแอปเท่านั้น
- `restore-apps.ps1` - เปิดแอปกลับคืนเท่านั้น
- `setup-startup.ps1` - ตั้งค่าเปิดอัตโนมัติ

## แอปที่จะถูกปิด ❌

### Browser (ยกเว้น Chrome)

- Microsoft Edge, Firefox, Opera, Brave

### Communication

- Microsoft Teams, Slack, Discord, WhatsApp, Telegram, Signal, Zoom, Skype

### Entertainment

- Spotify, VLC, iTunes, MusicBee, AIMP

### Gaming

- Steam, Epic Games, Battle.net, Origin, Uplay, GOG Galaxy

### Cloud Storage

- OneDrive, Dropbox, Google Drive, Box, pCloud

### Recording/Streaming

- OBS Studio, XSplit, Streamlabs, Bandicam, Camtasia

### Office Apps

- Word, Excel, PowerPoint, Outlook, OneNote

### Design Apps

- Photoshop, Illustrator, InDesign, Premiere Pro, After Effects

### Download/Torrent

- uTorrent, BitTorrent, qBittorrent, IDM

### Other

- Notepad++, 7-Zip, WinRAR, TeamViewer, AnyDesk, Calculator

## แอปที่จะ**ไม่**ถูกปิด ✅

- **VS Code** (code.exe)
- **Google Chrome** (chrome.exe) - สำหรับทดสอบเว็บ
- **Node.js** (node.exe)
- **Git** (git.exe)
- **Python** (python.exe)
- **NPM/PNPM** (npm.exe, pnpm.exe)
- **PowerShell/CMD** (powershell.exe, cmd.exe)
- **Windows System Processes**

## วิธีใช้งาน 🎯

### วิธีที่ 1: ใช้งานครั้งเดียว

1. เปิด PowerShell ในโฟลเดอร์ scripts
2. รัน: `.\dev-env-manager.ps1 -Action close`
3. เมื่อต้องการเปิดกลับคืน: `.\dev-env-manager.ps1 -Action restore`

### วิธีที่ 2: ตั้งค่าเปิดอัตโนมัติ

1. รัน: `.\dev-env-manager.ps1 -Action setup`
2. ระบบจะตั้งค่าให้เปิดแอปอัตโนมัติเมื่อรีสตาร์ทเครื่อง

### วิธีที่ 3: ใช้งานผ่านเมนู

1. รัน: `.\dev-env-manager.ps1`
2. เลือกจากเมนู 1-5

## ข้อดี 🌟

- **ประหยัดหน่วยความจำ** - ปิดแอปที่ไม่จำเป็น
- **เพิ่มประสิทธิภาพ** - CPU และ RAM ว่างมากขึ้น
- **คืนค่าอัตโนมัติ** - เปิดแอปกลับคืนได้ทันที
- **ปลอดภัย** - ไม่แตะ system services
- **ยืดหยุ่น** - เลือกใช้งานได้หลายแบบ

## ข้อควรระวัง ⚠️

1. **บันทึกงานก่อน** - สคริปต์จะปิดแอปทันทีไม่ถามยืนยัน
2. **อาจสูญเสียข้อมูล** - ถ้าไม่ได้บันทึกงานใน Office หรือแอปอื่น
3. **การเชื่อมต่อออนไลน์** - Teams, Discord จะต้องล็อกอินใหม่
4. **ดาวน์โหลด** - การดาวน์โหลดที่กำลังทำงานจะหยุด

## การแก้ปัญหา 🔧

### ถ้าแอปไม่เปิดกลับคืน:

1. ตรวจสอบ Path ของแอป
2. เปิดแอปด้วยตนเองจาก Start Menu
3. ลบไฟล์ `%TEMP%\dev-closed-apps.json` และลองใหม่

### ถ้าแอปยังทำงานอยู่:

- บางแอปอาจมีหลาย process หรือ service
- ลองปิดด้วยตนเองผ่าน Task Manager

### ถ้าเปิดอัตโนมัติไม่ทำงาน:

1. ตรวจสอบ Startup folder: `Win+R` → `shell:startup`
2. ลบ shortcut และสร้างใหม่
3. ตรวจสอบ PowerShell Execution Policy

## Tips การใช้งาน 💡

1. **ก่อนประชุม**: รัน close เพื่อให้เครื่องเร็วขึ้น
2. **ก่อนเขียนโค้ด**: ปิดแอปเพื่อให้ VS Code ทำงานเร็วขึ้น
3. **หลังเสร็จงาน**: รัน restore เพื่อเปิดแอปกลับคืน
4. **ก่อนนำเสนอ**: ปิดแอปเพื่อลดการรบกวน

---

**สร้างเมื่อ**: 27 สิงหาคม 2025  
**เวอร์ชัน**: 1.0  
**ผู้พัฒนา**: GitHub Copilot
