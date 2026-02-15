@echo off
echo ========================================
echo Testing Auto-Marker Attendance System
echo ========================================
echo.

REM Get auth token from user
set /p TOKEN="Enter your auth token: "

echo.
echo Triggering auto-marker manually...
echo.

curl -X POST http://localhost:5000/api/hr/attendance/trigger-auto-marker ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo Check the backend server logs for details
echo Look for messages like:
echo   - "Auto-marker checking attendance..."
echo   - "Found X staff entries"
echo   - "Marked X staff as ABSENT"
echo ========================================
echo.

pause
