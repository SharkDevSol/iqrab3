@echo off
echo ========================================
echo   Skoolific Mobile Testing Setup
echo ========================================
echo.

echo Step 1: Your Computer's IP Address
echo ------------------------------------
echo.
ipconfig | findstr /i "IPv4"
echo.

echo Step 2: On Your Phone
echo ------------------------------------
echo.
echo 1. Connect phone to the SAME WiFi network
echo 2. Open Chrome browser on your phone
echo 3. Type one of these URLs:
echo.
echo    Main App:     http://YOUR-IP:5173
echo    Student App:  http://YOUR-IP:5173/app/student-login
echo    Staff App:    http://YOUR-IP:5173/app/staff-login
echo    Guardian App: http://YOUR-IP:5173/app/guardian-login
echo    Settings:     http://YOUR-IP:5173/settings
echo.
echo    (Replace YOUR-IP with the IPv4 address shown above)
echo.

echo Step 3: Test Install Buttons
echo ------------------------------------
echo.
echo On your phone:
echo 1. Go to Settings -^> Apps
echo 2. Click any "Install App" button
echo 3. Chrome will show "Add to Home Screen"
echo 4. Tap "Add" or "Install"
echo 5. App icon appears on home screen!
echo.

echo Step 4: Troubleshooting
echo ------------------------------------
echo.
echo If you can't connect:
echo 1. Make sure phone and computer are on SAME WiFi
echo 2. Temporarily disable Windows Firewall:
echo    - Open Windows Security
echo    - Firewall ^& network protection
echo    - Turn off firewall for Private network
echo 3. Try again
echo 4. Remember to turn firewall back on after testing!
echo.

echo ========================================
echo   Starting Development Server...
echo ========================================
echo.

cd APP
npm run dev

pause
