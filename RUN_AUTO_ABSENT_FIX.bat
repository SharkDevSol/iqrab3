@echo off
echo ========================================
echo Auto Absent Marking - Automatic Fix
echo ========================================
echo.

REM Get database credentials
set /p DB_USER="Enter PostgreSQL username (default: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_NAME="Enter database name: "
if "%DB_NAME%"=="" (
    echo ERROR: Database name is required!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 1: Running Database Migration
echo ========================================
echo.

REM Run the SQL migration
psql -U %DB_USER% -d %DB_NAME% -f FIX_ATTENDANCE_AUTO_MARKER.sql

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Database migration failed!
    echo Please check your database credentials and try again.
    pause
    exit /b 1
)

echo.
echo ✅ Database migration completed successfully!
echo.

echo ========================================
echo Step 2: Restarting Backend Server
echo ========================================
echo.

REM Find and kill existing Node.js server process
echo Stopping existing server...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend server...
cd backend

REM Start the server in a new window
start "Backend Server" cmd /k "node server.js"

echo.
echo ✅ Backend server restarted!
echo.

echo ========================================
echo Step 3: Verification
echo ========================================
echo.
echo The auto-marker is now running and will:
echo   - Run every 60 seconds
echo   - Mark absent staff after 3:00 PM
echo   - Check past 30 days
echo   - Support all staff (with or without machine IDs)
echo   - Handle "both" shift assignments
echo.
echo Check the backend server window for logs like:
echo   🤖 Attendance auto-marker started
echo   🔍 Auto-marker checking attendance...
echo   ✅ Marked X staff as ABSENT
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Wait until after 3:00 PM (or trigger manually)
echo 2. Open: HR ^& Staff Management -^> Attendance System
echo 3. Verify: Empty cells now show "A" (Absent) in red
echo.
echo To manually trigger the auto-marker now:
echo   Run: TEST_AUTO_MARKER.bat
echo.
echo ========================================

pause
