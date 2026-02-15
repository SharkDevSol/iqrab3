@echo off
echo ========================================
echo   Adding Shift Assignment Columns
echo ========================================
echo.

REM Load environment variables
for /f "tokens=1,2 delims==" %%a in (backend\.env) do (
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
    if "%%a"=="DB_NAME" set DB_NAME=%%b
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_PORT" set DB_PORT=%%b
)

echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo.

REM Set PGPASSWORD for authentication
set PGPASSWORD=%DB_PASSWORD%

echo Running migration...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f backend/database/add_shift_columns.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Migration completed successfully!
    echo ========================================
    echo.
    echo What was added:
    echo - shift_assignment column to all staff tables
    echo - shift_time_settings table for Shift 1 and Shift 2
    echo - shift_type column to attendance tables
    echo.
    echo Next steps:
    echo 1. Restart your backend server
    echo 2. Access Shift Time Settings page to configure times
    echo 3. Assign staff to shifts in Staff Shift Assignment page
    echo.
) else (
    echo.
    echo ========================================
    echo   Migration failed!
    echo ========================================
    echo Please check the error messages above.
    echo.
)

pause
