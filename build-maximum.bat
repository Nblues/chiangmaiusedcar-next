@echo off
echo ======================================
echo  Building with Maximum Performance
echo  Using Full System RAM (8GB)
echo ======================================
echo.

REM Set maximum memory environment variables
set NODE_OPTIONS=--max-old-space-size=8192 --max-semi-space-size=1024 --optimize-for-size --gc-interval=100
set UV_THREADPOOL_SIZE=16
set NODE_MAX_OLD_SPACE_SIZE=8192
set FORCE_COLOR=1

REM Build optimization flags
set NEXT_TELEMETRY_DISABLED=0
set WEBPACK_ANALYZE=true
set BUNDLE_ANALYZE=true
set TSC_COMPILE_ON_ERROR=true
set NEXT_SHARP=1
set GENERATE_SOURCEMAP=true
set ANALYZE=true

echo Build Settings:
echo - Node.js heap: 8GB
echo - Semi-space: 1GB
echo - Thread pool: 16 threads
echo - Analysis: Enabled
echo - Source maps: Enabled
echo.

REM Change to project directory
cd /d "c:\project davelopper\chiangmaiusedcar-setup"

echo Installing dependencies...
pnpm install --frozen-lockfile

echo.
echo Building application with maximum performance...
pnpm build

echo.
echo Build completed! Files are in .next folder
echo.

pause
