@echo off
echo ========================================
echo   SMART CHECK-IN/CHECK-OUT TEST
echo ========================================
echo.
echo This will test the smart check-in/check-out logic
echo by checking the current attendance records.
echo.
echo Expected behavior:
echo - First scan of the day = CHECK-IN
echo - Second scan of the day = CHECK-OUT
echo - Status calculated on first scan only
echo.
pause

cd backend
node check-attendance-records.js

echo.
echo ========================================
echo   TEST INSTRUCTIONS
echo ========================================
echo.
echo 1. Make sure backend server is running (npm run dev)
echo 2. Scan fingerprint on AI06 device (first time)
echo 3. Check backend console for "CHECK-IN" message
echo 4. Refresh attendance page - should see check-in time
echo 5. Scan fingerprint again (second time)
echo 6. Check backend console for "CHECK-OUT" message
echo 7. Refresh attendance page - should see both times
echo.
pause
