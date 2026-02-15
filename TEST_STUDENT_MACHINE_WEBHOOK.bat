@echo off
echo ========================================
echo Testing Student Machine Webhook
echo ========================================
echo.
cd backend
node scripts/test-student-machine-webhook.js
echo.
echo ========================================
echo Test Complete
echo ========================================
echo.
pause
