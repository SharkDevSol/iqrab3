@echo off
REM Deployment script for VPS (Windows version)
REM Run this from your local machine to deploy to VPS via SSH

echo ========================================
echo   Deploying to VPS
echo ========================================
echo.

REM Check if SSH is available
where ssh >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: SSH not found. Please install OpenSSH or use PuTTY.
    pause
    exit /b 1
)

echo Enter your VPS IP address or hostname:
set /p VPS_HOST=VPS Host: 

echo.
echo Connecting to VPS and deploying...
echo.

ssh root@%VPS_HOST% "cd /root/iqrab3 && git pull origin main && cd backend && npm install && pm2 restart backend && pm2 status"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Deployment Successful!
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
    echo   Deployment Failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
)

pause
