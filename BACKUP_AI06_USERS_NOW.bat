@echo off
echo ========================================
echo AI06 User Backup Script
echo ========================================
echo.
echo This will backup all users from the AI06 device
echo.
echo IMPORTANT: Make sure to update the DEVICE_IP in:
echo   backend/backup-ai06-users.js
echo.
pause

cd backend
node backup-ai06-users.js

echo.
echo ========================================
echo Backup Complete!
echo ========================================
echo.
echo Backup file saved in: backend/backups/
echo.
pause
