@echo off
echo ========================================
echo   Live Attendance Monitor - Quick Test
echo ========================================
echo.
echo This will open:
echo 1. Live Attendance Monitor page
echo 2. Test endpoint to trigger event
echo.
echo Make sure backend is running first!
echo.
pause

echo.
echo Opening Live Attendance Monitor...
start http://localhost:5173/live-attendance

timeout /t 3 /nobreak >nul

echo.
echo Opening test endpoint (will trigger event)...
start http://localhost:5000/api/test-attendance

echo.
echo ========================================
echo   Check the Live Attendance page!
echo   You should see a test log appear.
echo ========================================
echo.
echo Press any key to exit...
pause >nul
