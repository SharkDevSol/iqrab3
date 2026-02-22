@echo off
echo ========================================
echo Starting Backend Server (Without Nodemon)
echo ========================================
echo.

REM Kill any existing Node processes
echo Stopping any existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting server WITHOUT auto-restart...
cd backend
node server.js

pause
