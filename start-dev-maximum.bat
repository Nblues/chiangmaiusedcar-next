@echo off
echo ======================================
echo  Starting Maximum Performance Mode
echo  Using Full System RAM (8GB)
echo ======================================
echo.

REM Set maximum memory environment variables
set NODE_OPTIONS=--max-old-space-size=8192 --max-semi-space-size=1024 --heap-prof --heap-prof-interval=100000 --optimize-for-size --gc-interval=100
set UV_THREADPOOL_SIZE=16
set NODE_MAX_OLD_SPACE_SIZE=8192
set FORCE_COLOR=1

REM Performance flags
set NEXT_TELEMETRY_DISABLED=0
set WEBPACK_ANALYZE=true
set BUNDLE_ANALYZE=true
set TSC_COMPILE_ON_ERROR=true
set NEXT_SHARP=1

echo Memory Settings:
echo - Node.js heap: 8GB
echo - Semi-space: 1GB  
echo - Thread pool: 16 threads
echo - Profiling: Enabled
echo - Analysis: Enabled
echo.

REM Change to project directory
cd /d "c:\project davelopper\chiangmaiusedcar-setup"

echo Starting development server with maximum performance...
echo Server will be available at: http://localhost:3000
echo.

REM Start the development server
pnpm dev

pause
