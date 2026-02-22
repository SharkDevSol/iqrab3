@echo off
echo ========================================
echo   Skoolific - Capacitor Setup
echo ========================================
echo.

echo This script will install Capacitor to build mobile apps
echo.

cd APP

echo Step 1: Installing Capacitor...
call npm install @capacitor/core @capacitor/cli @capacitor/android

echo.
echo Step 2: Building React app...
call npm run build

echo.
echo Step 3: Initializing Capacitor...
echo.
echo When prompted:
echo - App name: Skoolific
echo - App ID: com.skoolific.app
echo - Web directory: dist
echo.
call npx cap init

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Install Android Studio from: https://developer.android.com/studio
echo 2. Read BUILD_MOBILE_APPS.md for detailed instructions
echo 3. Run: npx cap add android
echo 4. Run: npx cap open android
echo.

pause
