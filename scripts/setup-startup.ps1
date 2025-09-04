# สคริปต์สำหรับเซ็ตอัพการรันอัตโนมัติเมื่อเปิดเครื่อง
# Startup Configuration Script
# Created: August 27, 2025

Write-Host "⚙️ ตั้งค่าการรันสคริปต์อัตโนมัติเมื่อเปิดเครื่อง" -ForegroundColor Yellow

$startupFolder = [Environment]::GetFolderPath("Startup")
$shortcutPath = "$startupFolder\RestoreDevApps.lnk"

Write-Host "📁 โฟลเดอร์ Startup: $startupFolder" -ForegroundColor Cyan

# สร้าง shortcut สำหรับเรียกใช้สคริปต์ restore
$WScriptShell = New-Object -ComObject WScript.Shell
$Shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$PSScriptRoot\restore-apps.ps1`""
$Shortcut.Description = "เปิดแอปกลับคืนหลังรีสตาร์ทเครื่อง"
$Shortcut.IconLocation = "powershell.exe,0"
$Shortcut.Save()

Write-Host "✅ สร้าง shortcut แล้ว: $shortcutPath" -ForegroundColor Green
Write-Host "🔄 จะรันอัตโนมัติเมื่อเปิดเครื่องครั้งถัดไป" -ForegroundColor Yellow

# แสดงคำแนะนำการใช้งาน
Write-Host "`n📖 วิธีใช้งาน:" -ForegroundColor Cyan
Write-Host "1. รัน close-non-dev-apps.ps1 เพื่อปิดแอปที่ไม่จำเป็น" -ForegroundColor White
Write-Host "2. เมื่อรีสตาร์ทเครื่อง ระบบจะเปิดแอปกลับคืนอัตโนมัติ" -ForegroundColor White
Write-Host "3. หรือรัน restore-apps.ps1 ด้วยตนเองได้ตลอดเวลา" -ForegroundColor White

Write-Host "`n🚫 วิธีปิดการรันอัตโนมัติ:" -ForegroundColor Red
Write-Host "ลบไฟล์: $shortcutPath" -ForegroundColor White

pause
