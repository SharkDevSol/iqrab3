@echo off
echo ========================================
echo Finding Unregistered Staff with Issues
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

echo These staff have attendance issues but are NOT registered:
echo.

psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "WITH attendance_staff AS (SELECT DISTINCT staff_id, staff_name, department_name FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY')), registered_staff AS (SELECT global_staff_id FROM staff_teachers WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id FROM staff_administrative_staff WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id FROM staff_supportive_staff WHERE global_staff_id IS NOT NULL) SELECT a.staff_id, a.staff_name, a.department_name, COUNT(*) as issue_count FROM attendance_staff a LEFT JOIN registered_staff r ON a.staff_id = r.global_staff_id LEFT JOIN hr_ethiopian_attendance att ON att.staff_id = a.staff_id AND att.ethiopian_month = 6 AND att.ethiopian_year = 2018 AND att.status IN ('LATE', 'ABSENT', 'HALF_DAY') WHERE r.global_staff_id IS NULL GROUP BY a.staff_id, a.staff_name, a.department_name ORDER BY issue_count DESC;"

echo.
echo ========================================
echo To fix: Register these staff members
echo Go to: Create/Register -^> Register Staff
echo ========================================
pause
