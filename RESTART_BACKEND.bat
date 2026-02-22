@echo off
echo ========================================
echo Restarting Backend Server
echo ========================================
echo.

echo Stopping existing Node processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Starting backend server...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Backend server is starting...
echo Check the new window for logs
echo ========================================
echo.
pause
