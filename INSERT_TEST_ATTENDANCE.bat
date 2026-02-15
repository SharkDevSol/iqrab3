@echo off
echo ========================================
echo   INSERT TEST ATTENDANCE RECORD
echo ========================================
echo.
echo This will:
echo 1. Find Ahmed's actual staff_id in database
echo 2. Insert a test attendance record for Day 3
echo 3. Verify it was saved correctly
echo.
echo ========================================
echo.

cd backend
node scripts/test-insert-attendance.js

echo.
pause
