@echo off
echo ========================================
echo   Skoolific Mobile App Setup
echo ========================================
echo.

echo Step 1: Checking your IP address...
echo.
ipconfig | findstr /i "IPv4"
echo.

echo Step 2: Instructions to access from mobile:
echo.
echo 1. Connect your phone to the SAME WiFi network
echo 2. Open Chrome (Android) or Safari (iPhone)
echo 3. Go to: http://YOUR-IP-FROM-ABOVE:5173
echo    (Replace YOUR-IP-FROM-ABOVE with the IPv4 address shown above)
echo.
echo 4. On Android: Tap menu (3 dots) > "Add to Home Screen"
echo    On iPhone: Tap Share button > "Add to Home Screen"
echo.

echo Step 3: Starting the development server...
echo.
cd APP
npm run dev

pause
