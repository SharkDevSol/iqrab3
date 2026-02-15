@echo off
echo ========================================
echo   FIX ATTENDANCE TABLE DISPLAY
echo ========================================
echo.
echo PROBLEM: Attendance saved but not showing in table
echo SOLUTION: Use actual staff_id from database
echo.
echo ========================================
echo.

echo Step 1: Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Starting backend server...
cd backend
start cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   BACKEND RESTARTED WITH FIX!
echo ========================================
echo.
echo WHAT WAS FIXED:
echo - Backend now looks up actual staff_id from database
echo - Uses actual staff_id (not Machine ID) when saving
echo - Attendance will now match and display in table
echo.
echo ========================================
echo.
echo TESTING STEPS:
echo.
echo 1. SCAN FACE on AI06 device (Ahmed = Machine ID 1)
echo.
echo 2. CHECK BACKEND CONSOLE for:
echo    "✅ Found staff in database: Ahmed (ID: actual_id)"
echo    "💾 Saving to database: Ahmed (Machine ID: 1, Staff ID: actual_id)"
echo.
echo 3. GO TO FRONTEND:
echo    - HR ^& Staff Management → Attendance System
echo    - Select: Yekatit (Month 6), Year 2018
echo    - Look at Ahmed's row, Day 3 column
echo.
echo 4. YOU SHOULD SEE:
echo    - Orange "L" badge (Late)
echo    - Check-in time: 12:28:12
echo    - Machine ID: 1 (blue badge)
echo.
echo ========================================
echo.
echo OPTIONAL: Check database directly
echo Run: CHECK_ATTENDANCE_DATA.bat
echo.
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
