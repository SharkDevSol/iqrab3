@echo off
echo ========================================
echo AI06 User Restore Script
echo ========================================
echo.
echo This will restore users to the AI06 device from backup
echo.

cd backend
node restore-ai06-users.js

echo.
echo ========================================
echo Restore Complete!
echo ========================================
pause
