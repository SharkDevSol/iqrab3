@echo off
echo ========================================
echo Debugging L+NCO Issue
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

echo 1. Checking L+NCO records in attendance:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT staff_id, staff_name, status, ethiopian_day, ethiopian_month, ethiopian_year, check_in, check_out FROM hr_ethiopian_attendance WHERE status = 'L+NCO' AND ethiopian_month = 6 AND ethiopian_year = 2018;"

echo.
echo 2. Checking if 'mustafa' is in staff tables:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 'Teachers' as table_name, global_staff_id, full_name FROM staff_teachers WHERE LOWER(full_name) LIKE '%%mustafa%%' OR LOWER(global_staff_id) LIKE '%%mustafa%%' UNION SELECT 'Admin Staff', global_staff_id, full_name FROM staff_administrative_staff WHERE LOWER(full_name) LIKE '%%mustafa%%' OR LOWER(global_staff_id) LIKE '%%mustafa%%' UNION SELECT 'Support Staff', global_staff_id, full_name FROM staff_supportive_staff WHERE LOWER(full_name) LIKE '%%mustafa%%' OR LOWER(global_staff_id) LIKE '%%mustafa%%';"

echo.
echo 3. All staff names in attendance with L+NCO:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT DISTINCT staff_name FROM hr_ethiopian_attendance WHERE status = 'L+NCO';"

echo.
echo 4. Checking if these names exist in staff tables:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "WITH lnco_staff AS (SELECT DISTINCT LOWER(staff_name) as name FROM hr_ethiopian_attendance WHERE status = 'L+NCO'), registered_staff AS (SELECT LOWER(full_name) as name FROM staff_teachers UNION SELECT LOWER(full_name) FROM staff_administrative_staff UNION SELECT LOWER(full_name) FROM staff_supportive_staff) SELECT l.name as attendance_name, CASE WHEN r.name IS NOT NULL THEN 'REGISTERED' ELSE 'NOT REGISTERED' END as status FROM lnco_staff l LEFT JOIN registered_staff r ON l.name = r.name;"

echo.
echo ========================================
echo Analysis Complete
echo ========================================
pause
