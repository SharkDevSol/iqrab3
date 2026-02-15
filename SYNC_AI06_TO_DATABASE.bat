@echo off
echo ========================================
echo Sync AI06 Users to Staff Database
echo ========================================
echo.
echo This will sync all users from AI06 device to Staff database
echo.
echo IMPORTANT: Make sure to update the DEVICE_IP in:
echo   backend/sync-ai06-to-staff.js
echo.
pause

cd backend
node sync-ai06-to-staff.js

echo.
echo ========================================
echo Sync Complete!
echo ========================================
echo.
echo Check the output above for sync results
echo.
pause
