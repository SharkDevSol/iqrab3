@echo off
echo ========================================
echo Webhook Configuration Info
echo ========================================
echo.
cd backend
node scripts/show-webhook-url.js
echo.
pause
