@echo off
echo ========================================
echo   RESTARTING BACKEND FOR AI06 TEST
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
echo NEXT STEPS:
echo 1. Wait for "AI06 WebSocket Server started on port 7788"
echo 2. Scan face on AI06 device (Machine ID 1 = Ahmed)
echo 3. Check backend console for Ethiopian date
echo 4. Go to Attendance System page
echo 5. Select: Yekatit (Month 6), Year 2018
echo 6. Look for Ahmed's attendance on Day 20
echo.
echo Press any key to close this window...
pause >nul
