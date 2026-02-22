@echo off
echo ========================================
echo Testing Shift Settings Routes
echo ========================================
echo.

echo Testing: GET /api/hr/shift-settings
curl -X GET http://localhost:5000/api/hr/shift-settings
echo.
echo.

echo Testing: GET /api/hr/shift-settings/staff-specific-timing
curl -X GET http://localhost:5000/api/hr/shift-settings/staff-specific-timing
echo.
echo.

echo ========================================
echo Test Complete
echo ========================================
pause
