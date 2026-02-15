@echo off
echo ========================================
echo   AI06 ATTENDANCE - THREE FIXES TEST
echo ========================================
echo.
echo FIXES APPLIED:
echo 1. Ethiopian Date: Day 3 (not Day 20)
echo 2. Calendar Integration: Gregorian + Ethiopian
echo 3. Only Save Registered Staff
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

echo.
echo ========================================
echo   BACKEND RESTARTED!
echo ========================================
echo.
echo TESTING INSTRUCTIONS:
echo.
echo TEST 1: Registered Staff (Ahmed ID:1)
echo   - Scan Ahmed's face on AI06 device
echo   - Backend should show: "Day 3, Month 6, Year 2018"
echo   - Frontend: Select Yekatit (6), Year 2018
echo   - Look at Day 3 column (not Day 20!)
echo.
echo TEST 2: Unregistered Staff (James ID:50)
echo   - Scan James's face on AI06 device
echo   - Backend should show: "Skipping... not registered"
echo   - Database should NOT have James's attendance
echo.
echo TEST 3: Calendar Integration
echo   - Frontend should understand both calendars
echo   - Ethiopian dates convert to Gregorian correctly
echo.
echo ========================================
echo.
echo Press any key to close this window...
pause >nul
