@echo off
echo ========================================
echo Adding Weekend Days Support
echo ========================================
echo.

echo This script will:
echo 1. Add weekend_days column to database
echo 2. Restart backend server
echo.

set /p CONFIRM="Continue? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Cancelled.
    pause
    exit /b 0
)

echo.
echo ========================================
echo Step 1: Adding Database Column
echo ========================================
echo.

cd backend

REM Create a temporary migration script
echo const { Pool } = require('pg'); > temp_add_weekend.js
echo const fs = require('fs'); >> temp_add_weekend.js
echo require('dotenv').config(); >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo const pool = new Pool({ >> temp_add_weekend.js
echo   connectionString: process.env.DATABASE_URL >> temp_add_weekend.js
echo }); >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo async function addWeekendColumn() { >> temp_add_weekend.js
echo   try { >> temp_add_weekend.js
echo     console.log('📦 Adding weekend_days column...'); >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo     // Add column if not exists >> temp_add_weekend.js
echo     await pool.query(` >> temp_add_weekend.js
echo       ALTER TABLE hr_attendance_time_settings  >> temp_add_weekend.js
echo       ADD COLUMN IF NOT EXISTS weekend_days INTEGER[] DEFAULT ARRAY[]::INTEGER[] >> temp_add_weekend.js
echo     `); >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo     console.log('✅ Column added successfully!'); >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo     // Set default weekends (Saturday and Sunday) >> temp_add_weekend.js
echo     await pool.query(` >> temp_add_weekend.js
echo       UPDATE hr_attendance_time_settings  >> temp_add_weekend.js
echo       SET weekend_days = ARRAY[0, 6]  >> temp_add_weekend.js
echo       WHERE weekend_days IS NULL OR weekend_days = ARRAY[]::INTEGER[] >> temp_add_weekend.js
echo     `); >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo     console.log('✅ Default weekends set (Saturday ^& Sunday)!'); >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo     // Verify >> temp_add_weekend.js
echo     const result = await pool.query('SELECT weekend_days FROM hr_attendance_time_settings LIMIT 1'); >> temp_add_weekend.js
echo     console.log('📋 Current weekend_days:', result.rows[0]?.weekend_days); >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo     process.exit(0); >> temp_add_weekend.js
echo   } catch (error) { >> temp_add_weekend.js
echo     console.error('❌ Error:', error.message); >> temp_add_weekend.js
echo     process.exit(1); >> temp_add_weekend.js
echo   } >> temp_add_weekend.js
echo } >> temp_add_weekend.js
echo. >> temp_add_weekend.js
echo addWeekendColumn(); >> temp_add_weekend.js

REM Run the migration
node temp_add_weekend.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Migration failed! Check the error above.
    del temp_add_weekend.js
    pause
    exit /b 1
)

REM Clean up
del temp_add_weekend.js

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
echo ✅ Weekend Support Added Successfully!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Open: HR ^& Staff Management -^> Time ^& Shift Settings
echo 2. Go to: Global Settings tab
echo 3. Scroll to: Weekend Days Configuration
echo 4. Select your weekend days (e.g., Saturday ^& Sunday)
echo 5. Click: Save Global Settings
echo.
echo Default weekends are already set to Saturday ^& Sunday.
echo You can change them in the UI.
echo.

pause
