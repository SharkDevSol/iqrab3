@echo off
echo ========================================
echo Adding Staff-Specific Shift Timing Table
echo ========================================
echo.

REM Load database credentials from .env file
for /f "tokens=1,2 delims==" %%a in ('type backend\.env ^| findstr /v "^#"') do (
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_NAME" set DB_NAME=%%b
    if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
    if "%%a"=="DB_PORT" set DB_PORT=%%b
)

echo Database: %DB_NAME%
echo Host: %DB_HOST%
echo User: %DB_USER%
echo.

REM Set PGPASSWORD environment variable
set PGPASSWORD=%DB_PASSWORD%

echo Running SQL script...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f ADD_STAFF_SPECIFIC_TIMING.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ Staff-specific timing table added successfully!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ❌ Error adding table
    echo ========================================
)

echo.
pause
