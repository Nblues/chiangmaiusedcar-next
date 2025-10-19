@echo off
REM Automated Vercel Environment Variables Setup for Windows
REM Usage: setup-vercel-env.bat

echo.
echo ========================================
echo  Vercel Environment Variables Setup
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI not found!
    echo.
    echo Installing Vercel CLI...
    call pnpm add -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install Vercel CLI
        echo Please run: pnpm add -g vercel
        pause
        exit /b 1
    )
    echo [OK] Vercel CLI installed
    echo.
)

echo [OK] Vercel CLI found
echo.

REM Check login status
echo Checking Vercel login status...
call vercel whoami >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Not logged in to Vercel
    echo.
    echo Please login to Vercel:
    call vercel login
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Login failed
        pause
        exit /b 1
    )
    echo.
    echo [OK] Logged in successfully
    echo.
)

echo [OK] Logged in to Vercel
echo.

REM Link project
echo Linking to Vercel project...
call vercel link --yes >nul 2>&1
echo [OK] Project linked
echo.

REM Add environment variables
echo Adding environment variables...
echo.

REM ADMIN_USERNAME
echo Adding ADMIN_USERNAME...
echo kngoodcar | vercel env add ADMIN_USERNAME production >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Production
) else (
    echo   [WARN] Production ^(may already exist^)
)

echo kngoodcar | vercel env add ADMIN_USERNAME preview >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Preview
) else (
    echo   [WARN] Preview ^(may already exist^)
)

echo kngoodcar | vercel env add ADMIN_USERNAME development >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Development
) else (
    echo   [WARN] Development ^(may already exist^)
)
echo.

REM ADMIN_PASSWORD
echo Adding ADMIN_PASSWORD...
echo Kn-goodcar**5277 | vercel env add ADMIN_PASSWORD production >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Production
) else (
    echo   [WARN] Production ^(may already exist^)
)

echo Kn-goodcar**5277 | vercel env add ADMIN_PASSWORD preview >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Preview
) else (
    echo   [WARN] Preview ^(may already exist^)
)

echo Kn-goodcar**5277 | vercel env add ADMIN_PASSWORD development >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Development
) else (
    echo   [WARN] Development ^(may already exist^)
)
echo.

REM SESSION_SECRET
echo Adding SESSION_SECRET...
echo f84a65d8b96928512fc7938a14c15c72d5a23689354a2fbc8312c102d1d10f33 | vercel env add SESSION_SECRET production >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Production
) else (
    echo   [WARN] Production ^(may already exist^)
)

echo f84a65d8b96928512fc7938a14c15c72d5a23689354a2fbc8312c102d1d10f33 | vercel env add SESSION_SECRET preview >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Preview
) else (
    echo   [WARN] Preview ^(may already exist^)
)

echo f84a65d8b96928512fc7938a14c15c72d5a23689354a2fbc8312c102d1d10f33 | vercel env add SESSION_SECRET development >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Development
) else (
    echo   [WARN] Development ^(may already exist^)
)
echo.

REM Verify
echo Verifying environment variables...
call vercel env ls > temp_env_list.txt 2>&1

findstr /C:"ADMIN_USERNAME" temp_env_list.txt >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] ADMIN_USERNAME
) else (
    echo   [ERROR] ADMIN_USERNAME - NOT FOUND
)

findstr /C:"ADMIN_PASSWORD" temp_env_list.txt >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] ADMIN_PASSWORD
) else (
    echo   [ERROR] ADMIN_PASSWORD - NOT FOUND
)

findstr /C:"SESSION_SECRET" temp_env_list.txt >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo   [OK] SESSION_SECRET
) else (
    echo   [ERROR] SESSION_SECRET - NOT FOUND
)

del temp_env_list.txt >nul 2>&1

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Redeploy production: vercel --prod
echo 2. Wait 2-3 minutes for deployment
echo 3. Test login at: https://www.chiangmaiusedcar.com/admin/login
echo.
echo Credentials:
echo    Username: kngoodcar
echo    Password: Kn-goodcar**5277
echo.
pause
