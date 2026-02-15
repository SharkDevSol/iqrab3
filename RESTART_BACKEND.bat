@echo off
echo ========================================
echo  RESTARTING BACKEND SERVER
echo ========================================
echo.
echo Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% == 0 (
    echo Node processes stopped.
) else (
    echo No Node processes were running.
)

echo.
echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Starting backend server...
cd backend
start cmd /k "node server.js"

echo.
echo ========================================
echo  Backend server started in new window
echo ========================================
echo.
pause
