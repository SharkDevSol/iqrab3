@echo off
echo ========================================
echo Verifying Monthly Payments Fix
echo ========================================
echo.
echo Running test script...
echo.
node backend\test-overview-active-students.js
echo.
echo ========================================
echo.
echo If you see "70700.00 Birr" above, the backend is working correctly!
echo.
echo Next steps:
echo 1. Restart your backend server (Ctrl+C, then npm start)
echo 2. Hard refresh the browser (Ctrl+Shift+R)
echo 3. Check the monthly payments page
echo.
pause
