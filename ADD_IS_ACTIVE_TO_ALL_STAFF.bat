@echo off
REM Add is_active column to all staff tables in classes_schema
REM This script dynamically finds all tables and adds the column

echo ========================================
echo Adding is_active Column to All Staff Tables
echo ========================================
echo.

REM Load database credentials from .env file
for /f "tokens=1,2 delims==" %%a in ('type backend\.env ^| findstr /v "^#"') do (
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_PORT" set DB_PORT=%%b
    if "%%a"=="DB_NAME" set DB_NAME=%%b
)

echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo.

REM Create temporary SQL file
set SQL_FILE=temp_add_is_active.sql
echo -- Add is_active column to all staff tables > %SQL_FILE%
echo DO $$ >> %SQL_FILE%
echo DECLARE >> %SQL_FILE%
echo     r RECORD; >> %SQL_FILE%
echo BEGIN >> %SQL_FILE%
echo     FOR r IN >> %SQL_FILE%
echo         SELECT table_schema, table_name >> %SQL_FILE%
echo         FROM information_schema.tables >> %SQL_FILE%
echo         WHERE table_schema = 'classes_schema' >> %SQL_FILE%
echo         AND table_name != 'staff_counter' >> %SQL_FILE%
echo     LOOP >> %SQL_FILE%
echo         EXECUTE format('ALTER TABLE %%I.%%I ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE', r.table_schema, r.table_name); >> %SQL_FILE%
echo         RAISE NOTICE 'Added is_active column to %%.%%', r.table_schema, r.table_name; >> %SQL_FILE%
echo     END LOOP; >> %SQL_FILE%
echo END $$; >> %SQL_FILE%
echo. >> %SQL_FILE%
echo -- Verify the column was added >> %SQL_FILE%
echo SELECT table_name, column_name, data_type, column_default >> %SQL_FILE%
echo FROM information_schema.columns >> %SQL_FILE%
echo WHERE table_schema = 'classes_schema' >> %SQL_FILE%
echo   AND column_name = 'is_active' >> %SQL_FILE%
echo ORDER BY table_name; >> %SQL_FILE%

echo Executing SQL script...
echo.

REM Execute the SQL file
set PGPASSWORD=%DB_PASSWORD%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f %SQL_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS: is_active column added to all staff tables!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERROR: Failed to add is_active column
    echo ========================================
)

REM Clean up
del %SQL_FILE%

echo.
pause
