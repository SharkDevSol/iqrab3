@echo off
echo ========================================
echo Quick Fix: Auto Absent Marking
echo ========================================
echo.

echo This script will:
echo 1. Apply database migration via Node.js
echo 2. Restart the backend server
echo.

set /p CONFIRM="Continue? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Cancelled.
    pause
    exit /b 0
)

echo.
echo ========================================
echo Step 1: Applying Database Migration
echo ========================================
echo.

cd backend

REM Create a temporary migration script
echo const { Pool } = require('pg'); > temp_migrate.js
echo const fs = require('fs'); >> temp_migrate.js
echo require('dotenv').config(); >> temp_migrate.js
echo. >> temp_migrate.js
echo const pool = new Pool({ >> temp_migrate.js
echo   connectionString: process.env.DATABASE_URL >> temp_migrate.js
echo }); >> temp_migrate.js
echo. >> temp_migrate.js
echo async function migrate() { >> temp_migrate.js
echo   try { >> temp_migrate.js
echo     console.log('📦 Reading migration file...'); >> temp_migrate.js
echo     const sql = fs.readFileSync('../FIX_ATTENDANCE_AUTO_MARKER.sql', 'utf8'); >> temp_migrate.js
echo. >> temp_migrate.js
echo     console.log('🔧 Applying migration...'); >> temp_migrate.js
echo     await pool.query(sql); >> temp_migrate.js
echo. >> temp_migrate.js
echo     console.log('✅ Migration completed successfully!'); >> temp_migrate.js
echo     process.exit(0); >> temp_migrate.js
echo   } catch (error) { >> temp_migrate.js
echo     console.error('❌ Migration failed:', error.message); >> temp_migrate.js
echo     process.exit(1); >> temp_migrate.js
echo   } >> temp_migrate.js
echo } >> temp_migrate.js
echo. >> temp_migrate.js
echo migrate(); >> temp_migrate.js

REM Run the migration
node temp_migrate.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Migration failed! Check the error above.
    del temp_migrate.js
    pause
    exit /b 1
)

REM Clean up
del temp_migrate.js

echo.
echo ========================================
echo Step 2: Restarting Backend Server
echo ========================================
echo.

REM Kill existing Node.js processes
echo Stopping existing server...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend server...
start "Backend Server" cmd /k "node server.js"

cd ..

echo.
echo ✅ Backend server restarted!
echo.

echo ========================================
echo ✅ Fix Applied Successfully!
echo ========================================
echo.
echo The auto-marker is now running with:
echo   ✓ Support for all staff (with/without machine IDs)
echo   ✓ Shift-based attendance (both shifts supported)
echo   ✓ 30-day lookback period
echo   ✓ Automatic absent marking after 3:00 PM
echo.
echo Check the "Backend Server" window for logs.
echo.
echo To verify:
echo 1. Open HR ^& Staff Management -^> Attendance System
echo 2. Check that empty cells show "A" (Absent)
echo.
echo To manually trigger now: Run TEST_AUTO_MARKER.bat
echo.

pause
