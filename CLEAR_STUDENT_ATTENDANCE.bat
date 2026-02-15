@echo off
echo ========================================
echo Clearing Student Attendance Records
echo ========================================
echo.
echo WARNING: This will delete ALL student attendance records!
echo.
pause
echo.
cd backend
node scripts/clear-student-attendance.js
echo.
pause
