@echo off
echo ========================================
echo Testing Guardian APIs
echo ========================================
echo.

set /p GUARDIAN_USERNAME="Enter Guardian Username (e.g., abdurhmanahmmed_4386): "

echo.
echo Testing Marks API...
echo URL: http://localhost:5000/api/mark-list/guardian-marks/%GUARDIAN_USERNAME%
echo.
curl -s "http://localhost:5000/api/mark-list/guardian-marks/%GUARDIAN_USERNAME%" > marks_response.json
type marks_response.json
echo.
echo Marks response saved to: marks_response.json
echo.

echo ========================================
echo.
echo Testing Payments API...
echo URL: http://localhost:5000/api/guardian-payments/%GUARDIAN_USERNAME%
echo.
curl -s "http://localhost:5000/api/guardian-payments/%GUARDIAN_USERNAME%" > payments_response.json
type payments_response.json
echo.
echo Payments response saved to: payments_response.json
echo.

echo ========================================
echo.
echo Testing Attendance API...
echo URL: http://localhost:5000/api/guardian-attendance/guardian-attendance/%GUARDIAN_USERNAME%
echo.
curl -s "http://localhost:5000/api/guardian-attendance/guardian-attendance/%GUARDIAN_USERNAME%" > attendance_response.json
type attendance_response.json
echo.
echo Attendance response saved to: attendance_response.json
echo.

echo ========================================
echo Test Complete!
echo.
echo Check the JSON files for API responses:
echo - marks_response.json
echo - payments_response.json
echo - attendance_response.json
echo.
pause
