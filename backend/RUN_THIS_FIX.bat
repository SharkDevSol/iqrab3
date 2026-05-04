@echo off
echo ========================================
echo Database Fix Script
echo ========================================
echo.
echo This will create the missing table:
echo hr_attendance_deduction_settings
echo.
echo Make sure PostgreSQL is running!
echo.
pause

echo.
echo Attempting to connect to database...
echo.

REM Try to run the SQL file
psql -U postgres -d school_management10 -f database\FIX_MISSING_TABLE.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Table created successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Refresh your browser
    echo 2. The error should be gone!
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Could not connect to database
    echo ========================================
    echo.
    echo Please fix manually:
    echo 1. Open pgAdmin
    echo 2. Connect to database: school_management10
    echo 3. Run the SQL from: database\FIX_MISSING_TABLE.sql
    echo.
    echo Or check FIX_LOCAL_DATABASE_NOW.md for instructions
    echo.
)

pause
