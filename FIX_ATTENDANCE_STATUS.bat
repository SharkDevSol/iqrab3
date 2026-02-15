@echo off
echo ========================================
echo Fix Attendance Status Based on Time
echo ========================================
echo.
echo This script will:
echo 1. Check all attendance records
echo 2. Compare check-in time with shift threshold
echo 3. Auto-correct PRESENT/LATE status
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

cd backend
node scripts/fix-attendance-status-by-time.js

echo.
pause
