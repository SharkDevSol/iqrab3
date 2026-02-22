@echo off
echo ========================================
echo Creating Global Machine ID Tracker
echo ========================================
echo.
echo This will create a centralized table to track
echo all student machine IDs across all classes.
echo.
echo This ensures machine IDs remain unique even
echo after deleting students or resetting data.
echo.
pause

cd backend
node scripts/create-global-machine-id-tracker.js

echo.
echo ========================================
echo Done!
echo ========================================
pause
