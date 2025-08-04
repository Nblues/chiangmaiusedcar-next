@echo off
title Vercel Deployment - ChiangMaiUsedCar

echo =========================================
echo 🚀 Vercel Deployment Script
echo =========================================
echo.

echo 🔧 Building production version...
echo.

REM ตรวจสอบ node_modules
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call pnpm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM สร้าง production build
echo 📦 Running production build...
call pnpm build

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful!
    echo 🌐 Ready for Vercel deployment
    echo.
    echo === DEPLOYMENT INSTRUCTIONS ===
    echo 1. Install Vercel CLI: npm i -g vercel
    echo 2. Login to Vercel: vercel login
    echo 3. Deploy: vercel --prod
    echo 4. Set custom domain: chiangmaiusedcar.com
    echo.
    echo === ENVIRONMENT VARIABLES ===
    echo Make sure these are set in Vercel dashboard:
    echo - SHOPIFY_DOMAIN
    echo - SHOPIFY_STOREFRONT_TOKEN  
    echo - NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    echo - RECAPTCHA_SECRET_KEY
    echo - NEXT_PUBLIC_EMAILJS_SERVICE_ID
    echo - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    echo - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    echo - SITE_URL=https://chiangmaiusedcar.com
    echo.
) else (
    echo.
    echo ❌ Build failed! Please check errors above.
    echo.
)

echo === BACKUP INFO ===
echo Your backup tag: backup-before-deploy-20250805-0348
echo To restore: git checkout backup-before-deploy-20250805-0348
echo.

pause
