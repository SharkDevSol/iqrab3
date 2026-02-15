@echo off
echo ========================================
echo Checking Actual Status Values in DB
echo ========================================
echo.

REM Get database credentials from .env
for /f "tokens=1,2 delims==" %%a in ('type backend\.env ^| findstr /i "DB_"') do (
    if "%%a"=="DB_HOST" set DB_HOST=%%b
    if "%%a"=="DB_PORT" set DB_PORT=%%b
    if "%%a"=="DB_NAME" set DB_NAME=%%b
    if "%%a"=="DB_USER" set DB_USER=%%b
    if "%%a"=="DB_PASSWORD" set DB_PASSWORD=%%b
)

echo Database: %DB_NAME%
echo.

echo 1. ALL UNIQUE STATUS VALUES in attendance table:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT DISTINCT status, COUNT(*) as count FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 GROUP BY status ORDER BY count DESC;"

echo.
echo 2. Sample records with each status:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT status, staff_name, ethiopian_day, check_in, check_out FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 ORDER BY status, ethiopian_day LIMIT 20;"

echo.
echo ========================================
echo Copy the EXACT status values above
echo ========================================
pause
