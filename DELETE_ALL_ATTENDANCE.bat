@echo off
echo ========================================
echo   Delete All Attendance Data
echo ========================================
echo.
echo WARNING: This will delete ALL attendance records!
echo.
echo Are you sure you want to continue?
pause

echo.
echo Step 1: Killing any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Deleting all attendance data...
cd backend
node scripts/delete-all-attendance.js

echo.
echo ========================================
echo   Done!
echo ========================================
echo.
echo Refresh the attendance page to see empty grid.
echo.
pause
