@echo off
echo ========================================
echo Verifying Staff-Specific Timing Feature
echo ========================================
echo.

echo 1. Testing basic shift settings route...
curl -s http://localhost:5000/api/hr/shift-settings
echo.
echo.

echo 2. Testing staff-specific timing route...
curl -s http://localhost:5000/api/hr/shift-settings/staff-specific-timing
echo.
echo.

echo 3. Testing test route...
curl -s http://localhost:5000/api/hr/shift-settings/test
echo.
echo.

echo ========================================
echo Verification Complete!
echo ========================================
echo.
echo If you see JSON responses above, the feature is working!
echo If you see errors, the backend may not be running.
echo.
pause
