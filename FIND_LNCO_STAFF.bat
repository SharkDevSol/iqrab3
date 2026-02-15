@echo off
echo ========================================
echo Finding L+NCO Staff Details
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

echo 1. All L+NCO records in Yekatit 2018:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT staff_id, staff_name, ethiopian_day, check_in, check_out, status FROM hr_ethiopian_attendance WHERE status = 'L+NCO' AND ethiopian_month = 6 AND ethiopian_year = 2018 ORDER BY ethiopian_day;"

echo.
echo 2. Checking if these staff IDs are in the registered list:
echo Registered IDs: 6, 3, 100, 101, 2, 5, 105, 4
echo.

psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT staff_id, staff_name, status, ethiopian_day, CASE WHEN staff_id IN ('6', '3', '100', '101', '2', '5', '105', '4') THEN 'REGISTERED' ELSE 'NOT REGISTERED' END as registration_status FROM hr_ethiopian_attendance WHERE status = 'L+NCO' AND ethiopian_month = 6 AND ethiopian_year = 2018;"

echo.
echo 3. Checking staff_id format (case sensitive):
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT DISTINCT staff_id, typeof(staff_id) as id_type FROM hr_ethiopian_attendance WHERE status = 'L+NCO' LIMIT 5;"

echo.
echo ========================================
pause
