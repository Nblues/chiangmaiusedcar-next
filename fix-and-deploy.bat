@echo off
title Fix Shopify API and Deploy - ChiangMaiUsedCar

echo =========================================
echo 🔧 Fixing Shopify API Configuration
echo =========================================
echo.

echo 📋 Current Shopify Configuration:
echo SHOPIFY_DOMAIN=kn-goodcar.com
echo SHOPIFY_STOREFRONT_TOKEN=bb70cb008199a94b83c98df0e45ada67
echo.

echo 🚀 Starting production build with correct environment...
echo.

REM Set environment variables locally to override Vercel
set SHOPIFY_DOMAIN=kn-goodcar.com
set SHOPIFY_STOREFRONT_TOKEN=bb70cb008199a94b83c98df0e45ada67
set NODE_ENV=production

echo ✅ Environment variables set locally
echo.

echo 📦 Running production build...
call pnpm build

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo 🌐 Deploying to Vercel with fixed configuration...
    call vercel --prod --env SHOPIFY_DOMAIN=kn-goodcar.com --env SHOPIFY_STOREFRONT_TOKEN=bb70cb008199a94b83c98df0e45ada67
    
    if %errorlevel% equ 0 (
        echo.
        echo 🎉 Deploy successful!
        echo ✅ Shopify API configuration fixed
        echo 🌐 Website should now work correctly
    ) else (
        echo.
        echo ❌ Deploy failed
    )
) else (
    echo.
    echo ❌ Build failed! Check errors above.
)

echo.
echo === NEXT STEPS ===
echo If deploy was successful:
echo 1. Test the website: https://chiangmaiusedcar.com
echo 2. Verify Shopify data loads correctly
echo 3. Check all car pages work properly
echo.

pause