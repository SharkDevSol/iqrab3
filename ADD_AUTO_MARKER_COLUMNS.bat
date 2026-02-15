@echo off
echo ========================================
echo   ADD AUTO-MARKER COLUMNS
echo ========================================
echo.
echo This will add the required columns for automatic attendance marking:
echo - max_checkout_hours (default: 3.0 hours)
echo - absent_threshold_time (default: 03:00 PM)
echo.
pause

cd backend
node add-auto-marker-columns.js

echo.
echo ========================================
echo   DONE!
echo ========================================
echo.
echo Now restart the backend server to start the auto-marker.
echo.
pause
