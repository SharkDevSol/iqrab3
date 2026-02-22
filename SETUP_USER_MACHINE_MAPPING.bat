@echo off
echo ========================================
echo Setting up User Machine Mapping Table
echo ========================================
echo.

cd backend
node scripts/setup-dual-mode-attendance.js

echo.
echo ========================================
echo Setup Complete!
echo ========================================
pause
