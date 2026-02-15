@echo off
echo ========================================
echo Importing Student Attendance from Machine Logs
echo ========================================
echo.

cd backend
node scripts/import-student-machine-logs.js

echo.
echo Done!
pause
