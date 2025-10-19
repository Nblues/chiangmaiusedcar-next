@echo off
REM 🔄 RESTORE SCRIPT - ครูหนึ่งรถสวย Complete Backup (Windows)
REM Created: September 10, 2025
REM Purpose: Restore to complete production-ready state

echo 🚀 Starting Restore Process...
echo 📍 Target: Complete Production-Ready State  
echo 📅 Date: September 10, 2025
echo.

REM Change to project directory
cd /d "c:\project davelopper\chiangmaiusedcar-setup"
if errorlevel 1 (
    echo ❌ Failed to change directory
    pause
    exit /b 1
)

echo 📂 Current directory: %CD%
echo.

echo 🔄 Choose restore method:
echo 1) Hard Reset to commit 544414b (Recommended)
echo 2) Reset to tag backup-complete-v1.0  
echo 3) Create new branch from backup point
echo 4) Emergency nuclear restore
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    echo 🔄 Performing hard reset to commit 544414b...
    git reset --hard 544414b
) else if "%choice%"=="2" (
    echo 🔄 Resetting to tag backup-complete-v1.0...
    git reset --hard backup-complete-v1.0
) else if "%choice%"=="3" (
    echo 🌿 Creating new branch from backup point...
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c%%a%%b
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a%%b
    git checkout -b restore-%mydate%-%mytime% 544414b
) else if "%choice%"=="4" (
    echo 🔥 NUCLEAR RESTORE - Cleaning everything...
    git reset --hard 544414b
    git clean -fd
    if exist node_modules rmdir /s /q node_modules
    if exist .next rmdir /s /q .next
) else (
    echo ❌ Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo 📦 Installing dependencies...
pnpm install

if "%choice%"=="4" (
    echo 🏗️ Building project...
    pnpm build
)

echo.
echo 🧪 Testing development server...
echo 🌐 Starting on http://localhost:3000
echo.
echo ✅ RESTORE COMPLETE!
echo.
echo 🔍 Verify these work:
echo    - Homepage with car listings
echo    - Car detail pages  
echo    - Contact forms
echo    - PWA install prompt
echo    - All navigation
echo.
echo 🚀 Run 'pnpm dev' to start development server

pause
