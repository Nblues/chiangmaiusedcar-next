@echo off
REM Start Next.js Dev Server with Maximum Memory
REM For Windows PowerShell

echo ====================================
echo Starting Next.js Dev Server
echo Memory: 10GB (10240 MB)
echo Port: 3000
echo ====================================
echo.

REM Kill existing Node processes
echo Stopping existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Clean .next cache
echo Cleaning .next cache...
if exist .next (
    rmdir /s /q .next 2>nul
)

REM Start dev server with increased memory
echo Starting server...
echo.
set NODE_OPTIONS=--max-old-space-size=10240
pnpm dev

pause
