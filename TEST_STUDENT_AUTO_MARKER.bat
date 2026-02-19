@echo off
echo ========================================
echo Testing Student Attendance Auto-Marker
echo ========================================
echo.

echo Step 1: Checking if auto-marker service exists...
if exist "backend\services\studentAttendanceAutoMarker.js" (
    echo    [OK] Auto-marker service found
) else (
    echo    [ERROR] Auto-marker service not found!
    pause
    exit /b 1
)

echo.
echo Step 2: Running auto-marker manually...
cd backend
node services/studentAttendanceAutoMarker.js

echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
echo The auto-marker should have:
echo 1. Checked settings (auto_absent_enabled should be TRUE)
echo 2. Retrieved all students from class tables
echo 3. Processed all past school days
echo 4. Marked students as ABSENT if no attendance record exists
echo.
echo Check the output above for:
echo - Total students found
echo - Days processed
echo - Students marked absent
echo.
pause
