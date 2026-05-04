@echo off
REM Deployment script for iqrab3 VPS
REM VPS IP: 76.13.48.245
REM Domain: https://iqrab3.skoolific.com

echo ========================================
echo   Deploying to iqrab3 VPS
echo   IP: 76.13.48.245
echo   Domain: iqrab3.skoolific.com
echo ========================================
echo.

REM Check if SSH is available
where ssh >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: SSH not found. Please install OpenSSH.
    echo.
    echo To install OpenSSH on Windows:
    echo 1. Open Settings ^> Apps ^> Optional Features
    echo 2. Click "Add a feature"
    echo 3. Search for "OpenSSH Client"
    echo 4. Install it
    echo.
    pause
    exit /b 1
)

echo Connecting to VPS and deploying...
echo.

ssh root@76.13.48.245 "cd /root/iqrab3 && echo '=== Pulling latest changes ===' && git pull origin main && echo '=== Installing dependencies ===' && cd backend && npm install && echo '=== Restarting backend ===' && pm2 restart backend && echo '=== Checking status ===' && pm2 status"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Deployment Successful! ✅
    echo ========================================
    echo.
    echo The 401 authentication error should now be fixed.
    echo.
    echo Test the fix:
    echo   1. Open https://iqrab3.skoolific.com
    echo   2. Navigate to Student Faults page
    echo   3. Classes and reports should load without errors
    echo.
) else (
    echo.
    echo ========================================
    echo   Deployment Failed! ❌
    echo ========================================
    echo.
    echo Possible issues:
    echo   1. Cannot connect to VPS - Check your internet connection
    echo   2. SSH authentication failed - Check your SSH key or password
    echo   3. PM2 not running - Backend may need to be started manually
    echo.
    echo Try manual deployment:
    echo   ssh root@76.13.48.245
    echo   cd /root/iqrab3
    echo   git pull origin main
    echo   cd backend
    echo   pm2 restart backend
    echo.
)

pause
