@echo off
echo ========================================
echo   Fixing Port 7788 (AI06 WebSocket)
echo ========================================
echo.
echo Killing process on port 7788...
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :7788') do (
    echo Found process: %%a
    taskkill /F /PID %%a
)

echo.
echo ========================================
echo   Port 7788 is now free!
echo ========================================
echo.
echo Now restart the backend:
echo   cd backend
echo   node server.js
echo.
pause
