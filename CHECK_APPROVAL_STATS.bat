@echo off
echo ========================================
echo Check Approval Statistics
echo ========================================
echo.
echo This will show all approval/rejection records
echo and statistics by user.
echo.
pause

cd backend
node scripts/check-approval-stats.js

echo.
echo ========================================
echo Done!
echo ========================================
pause
