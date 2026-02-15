@echo off
echo ========================================
echo Fix Attendance Table - Make Nullable
echo ========================================
echo.
echo This will make check_in and check_out columns nullable
echo so that leave records can be created without times.
echo.
pause

cd backend
node scripts/fix-attendance-table-nullable.js

echo.
echo ========================================
echo Done!
echo ========================================
pause
