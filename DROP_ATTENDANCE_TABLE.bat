@echo off
echo ========================================
echo Drop Old Attendance Table
echo ========================================
echo.
echo This will delete the old attendance table.
echo It will be recreated with the new structure automatically.
echo.
echo WARNING: This will delete all existing attendance records!
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

cd backend
node scripts/drop-attendance-table.js

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo Now restart your backend server and try marking attendance again.
echo.
pause
