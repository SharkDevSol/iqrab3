@echo off
echo ========================================
echo Checking for H, L+H, NCO Issues
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

echo 1. Checking all attendance statuses in database:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT status, COUNT(*) as count FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 GROUP BY status ORDER BY count DESC;"

echo.
echo 2. Checking for HALF_DAY (H) issues:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT staff_name, ethiopian_day, check_in, check_out FROM hr_ethiopian_attendance WHERE status = 'HALF_DAY' AND ethiopian_month = 6 AND ethiopian_year = 2018 LIMIT 10;"

echo.
echo 3. Checking for LATE_HALF_DAY (L+H) issues:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT staff_name, ethiopian_day, check_in, check_out FROM hr_ethiopian_attendance WHERE status = 'LATE_HALF_DAY' AND ethiopian_month = 6 AND ethiopian_year = 2018 LIMIT 10;"

echo.
echo 4. Checking for NO_CHECKOUT (NCO) issues:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT staff_name, ethiopian_day, check_in, check_out FROM hr_ethiopian_attendance WHERE status = 'NO_CHECKOUT' AND ethiopian_month = 6 AND ethiopian_year = 2018 LIMIT 10;"

echo.
echo 5. Total issues that will show in Leave Management:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT status, COUNT(*) as count FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY', 'LATE_HALF_DAY', 'NO_CHECKOUT') GROUP BY status;"

echo.
echo ========================================
echo If you see 0 records for H, L+H, or NCO,
echo it means no attendance records exist
echo with these statuses yet.
echo ========================================
pause
