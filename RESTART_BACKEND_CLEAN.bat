@echo off
echo ========================================
echo   Clean Restart - Backend Server
echo ========================================
echo.
echo Step 1: Killing all Node.js processes...
echo.

taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✅ Node.js processes killed
) else (
    echo ℹ️  No Node.js processes were running
)

echo.
echo Step 2: Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo.
echo Step 3: Starting backend server...
echo.
cd backend
start cmd /k "node server.js"

echo.
echo ========================================
echo   Backend server starting in new window
echo ========================================
echo.
echo Wait for: "Server running on port 5000"
echo Then open: http://localhost:5173/live-attendance
echo.
pause
