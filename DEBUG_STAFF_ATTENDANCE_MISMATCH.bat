@echo off
echo ========================================
echo Debugging Staff Attendance Mismatch
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

echo 1. Total attendance issues (LATE, ABSENT, HALF_DAY) for Yekatit 2018:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT status, COUNT(*) as count FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY') GROUP BY status;"

echo.
echo 2. Sample staff IDs from attendance issues:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT DISTINCT staff_id, staff_name, department_name FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY') ORDER BY staff_name LIMIT 20;"

echo.
echo 3. Sample registered staff IDs from staff tables:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT global_staff_id, full_name FROM staff_teachers WHERE global_staff_id IS NOT NULL LIMIT 10;"

echo.
echo 4. Check if attendance staff IDs exist in staff tables:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "WITH attendance_staff AS (SELECT DISTINCT staff_id, staff_name FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY')), registered_staff AS (SELECT global_staff_id FROM staff_teachers WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id FROM staff_administrative_staff WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id FROM staff_supportive_staff WHERE global_staff_id IS NOT NULL) SELECT a.staff_id, a.staff_name, CASE WHEN r.global_staff_id IS NOT NULL THEN 'REGISTERED' ELSE 'NOT REGISTERED' END as status FROM attendance_staff a LEFT JOIN registered_staff r ON a.staff_id = r.global_staff_id ORDER BY status, a.staff_name;"

echo.
echo 5. Count of registered vs not registered:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "WITH attendance_staff AS (SELECT DISTINCT staff_id FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY')), registered_staff AS (SELECT global_staff_id FROM staff_teachers WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id FROM staff_administrative_staff WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id FROM staff_supportive_staff WHERE global_staff_id IS NOT NULL) SELECT COUNT(CASE WHEN r.global_staff_id IS NOT NULL THEN 1 END) as registered_count, COUNT(CASE WHEN r.global_staff_id IS NULL THEN 1 END) as not_registered_count FROM attendance_staff a LEFT JOIN registered_staff r ON a.staff_id = r.global_staff_id;"

echo.
echo ========================================
echo Debug complete!
echo ========================================
pause
