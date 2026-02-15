@echo off
echo ========================================
echo ATTENDANCE MACHINE CONNECTION TEST
echo ========================================
echo.

cd backend

echo Running connection test...
echo.

node test-machine-connection.js

echo.
echo Test complete!
echo.
pause
