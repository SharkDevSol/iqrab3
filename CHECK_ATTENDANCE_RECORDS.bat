@echo off
echo ========================================
echo CHECKING ATTENDANCE RECORDS
echo ========================================
echo.

cd backend

echo Checking database for Khalid's attendance...
echo.

node check-attendance-records.js

echo.
echo Check complete!
echo.
pause
