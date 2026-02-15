@echo off
echo ========================================
echo Student Attendance Shift Support Setup
echo ========================================
echo.
echo This script will:
echo 1. Add shift columns to database tables
echo 2. Configure default shift times
echo 3. Assign all classes to Shift 1 by default
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

cd backend
node scripts/add-student-shift-columns.js

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to Student Attendance Time Settings page
echo 2. Configure times for Shift 1 and Shift 2
echo 3. Assign classes to their respective shifts
echo.
pause
