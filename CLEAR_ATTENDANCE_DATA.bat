@echo off
echo ========================================
echo CLEAR ALL ATTENDANCE DATA
echo ========================================
echo.
echo WARNING: This will delete ALL attendance records!
echo.
set /p confirm="Are you sure? Type YES to confirm: "

if /i "%confirm%"=="YES" (
    echo.
    echo Clearing attendance data...
    cd backend
    node clear-attendance-data.js
    cd ..
) else (
    echo.
    echo Operation cancelled.
)

echo.
pause
