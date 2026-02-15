@echo off
echo ========================================
echo Attendance Table Migration Script
echo ========================================
echo.
echo This will update the attendance table to support check-in/check-out times.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

cd backend
node scripts/migrate-attendance-to-checkin-checkout.js

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo.
echo You can now use the attendance system.
echo.
pause
