@echo off
setlocal EnableExtensions

REM Automated Vercel Environment Variables Setup for Windows
REM Usage: setup-vercel-env.bat
REM 
REM Security notes:
REM - Do NOT hardcode secrets in this file.
REM - Provide values via environment variables or interactive prompts.
REM - Sensitive variables are added with `--sensitive` so values are hidden in Vercel UI.

set "TARGET_ENVS=production preview development"

REM Always run from repository root (so `vercel link` uses the correct project)
pushd "%~dp0\.." >nul 2>&1

echo.
echo ========================================
echo  Vercel Environment Variables Setup
echo ========================================
echo.

echo Tip:
echo  - In PowerShell, prefer running: powershell -ExecutionPolicy Bypass -File scripts\setup-vercel-env.ps1
echo  - Or run this .bat via CMD: cmd /c scripts\setup-vercel-env.bat
echo  - To disable prompts-pauses (CI), set: NO_PAUSE=1
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI not found!
    echo.
    echo Installing Vercel CLI...

    where pnpm >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] pnpm not found.
        echo Please install pnpm first, then re-run this script.
        echo  - https://pnpm.io/installation
        echo.
        call :MaybePause
        goto :cleanup_fail
    )

    call pnpm add -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install Vercel CLI
        echo Please run: pnpm add -g vercel
        call :MaybePause
        goto :cleanup_fail
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
        call :MaybePause
        goto :cleanup_fail
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
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to link Vercel project
    call :MaybePause
    goto :cleanup_fail
)
echo [OK] Project linked
echo.

REM Add environment variables
echo Adding environment variables...
echo.

REM Read values from environment variables or prompt interactively
call :RequireVar ADMIN_USERNAME "ADMIN_USERNAME (non-sensitive)" || goto :cleanup_fail
call :RequireSecret ADMIN_PASSWORD "ADMIN_PASSWORD (sensitive)" || goto :cleanup_fail
call :RequireSecret SESSION_SECRET "SESSION_SECRET (sensitive, random 32+ chars)" || goto :cleanup_fail

for %%E in (%TARGET_ENVS%) do (
    echo   Setting vars for %%E...
    call :UpsertEnvVar ADMIN_USERNAME %%E normal || goto :cleanup_fail
    call :UpsertEnvVar ADMIN_PASSWORD %%E sensitive || goto :cleanup_fail
    call :UpsertEnvVar SESSION_SECRET %%E sensitive || goto :cleanup_fail
)

echo.

REM Verify
echo Verifying environment variables...
call vercel env ls > temp_env_list.txt 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to list Vercel env vars
    del temp_env_list.txt >nul 2>&1
    call :MaybePause
    goto :cleanup_fail
)

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
call :MaybePause

goto :cleanup_success

:cleanup_fail
popd >nul 2>&1
exit /b 1

:cleanup_success
popd >nul 2>&1
exit /b 0

REM -------------------------
REM Helpers
REM -------------------------

:MaybePause
REM Optional pause: set NO_PAUSE=1 (or CI=true/1) to skip
if /I "%NO_PAUSE%"=="1" exit /b 0
if /I "%CI%"=="true" exit /b 0
if "%CI%"=="1" exit /b 0
pause
exit /b 0

:RequireVar
REM Usage: call :RequireVar VAR_NAME "Prompt"
set "_var=%~1"
set "_prompt=%~2"
for %%# in (1) do if defined %_var% exit /b 0
set /p "%_var%=%_prompt%: "
for %%# in (1) do if not defined %_var% (
        echo [ERROR] Missing required value: %_var%
        exit /b 1
)
exit /b 0

:RequireSecret
REM Usage: call :RequireSecret VAR_NAME "Prompt"
set "_var=%~1"
set "_prompt=%~2"
for %%# in (1) do if defined %_var% exit /b 0

REM Secure prompt via PowerShell (input not echoed)
for /f "usebackq delims=" %%A in (`powershell -NoProfile -Command "$p=Read-Host '%_prompt%' -AsSecureString; [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($p))"`) do (
    set "%_var%=%%A"
)

for %%# in (1) do if not defined %_var% (
        echo [ERROR] Missing required value: %_var%
        exit /b 1
)
exit /b 0

:UpsertEnvVar
REM Usage: call :UpsertEnvVar NAME ENV normal|sensitive
set "_name=%~1"
set "_target=%~2"
set "_mode=%~3"

call set "_value=%%%_name%%%"
if "%_value%"=="" (
    echo [ERROR] %_name% is empty
    exit /b 1
)

set "SETUP_VALUE=%_value%"
if /I "%_mode%"=="sensitive" (
    powershell -NoProfile -Command "$v=$env:SETUP_VALUE; $v | & vercel env add '%_name%' '%_target%' --force --sensitive | Out-Null" >nul 2>&1
) else (
    powershell -NoProfile -Command "$v=$env:SETUP_VALUE; $v | & vercel env add '%_name%' '%_target%' --force | Out-Null" >nul 2>&1
)

if %ERRORLEVEL% EQU 0 (
    echo     [OK] %_name%
) else (
    echo     [ERROR] Failed to set %_name% for %_target%
    exit /b 1
)

set "SETUP_VALUE="
exit /b 0
