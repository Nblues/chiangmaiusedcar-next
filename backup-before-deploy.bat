@echo off
echo === 🔄 Creating backup before Vercel deployment ===

REM สร้าง backup tag ใน git
git tag -a backup-before-deploy-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2% -m "Backup before Vercel deployment to chiangmaiusedcar.com"

REM แสดง commit ล่าสุด
echo Latest commit:
git log --oneline -1

echo.
echo === ✅ Backup created successfully ===
echo To restore this version later, use:
echo git checkout backup-before-deploy-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%
echo.

pause
