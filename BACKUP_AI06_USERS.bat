@echo off
echo ========================================
echo AI06 User Backup Script
echo ========================================
echo.
echo This will backup all users from the AI06 device to your database
echo.

cd backend
node backup-ai06-users.js

echo.
echo ========================================
echo Backup Complete!
echo ========================================
pause
