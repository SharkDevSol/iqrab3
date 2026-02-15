@echo off
echo ========================================
echo Checking Webhook Logs
echo ========================================
echo.
cd backend
node scripts/check-webhook-logs.js
echo.
pause
