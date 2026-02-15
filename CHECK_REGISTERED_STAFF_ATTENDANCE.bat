@echo off
echo ========================================
echo Checking Registered Staff vs Attendance
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
echo Host: %DB_HOST%:%DB_PORT%
echo.

echo 1. Checking registered staff...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 'Teachers' as source, COUNT(*) as count FROM \"Teacher\" WHERE global_staff_id IS NOT NULL UNION ALL SELECT 'Admin Staff', COUNT(*) FROM \"AdministrativeStaff\" WHERE global_staff_id IS NOT NULL UNION ALL SELECT 'Support Staff', COUNT(*) FROM \"SupportiveStaff\" WHERE global_staff_id IS NOT NULL;"

echo.
echo 2. Checking attendance issues (LATE, ABSENT, HALF_DAY)...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT status, COUNT(*) as count FROM hr_ethiopian_attendance WHERE status IN ('LATE', 'ABSENT', 'HALF_DAY') GROUP BY status;"

echo.
echo 3. Checking if attendance staff IDs match registered staff...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "WITH registered_staff AS (SELECT global_staff_id FROM \"Teacher\" WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id FROM \"AdministrativeStaff\" WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id FROM \"SupportiveStaff\" WHERE global_staff_id IS NOT NULL) SELECT a.staff_id, a.staff_name, a.status, a.ethiopian_month, a.ethiopian_year, CASE WHEN r.global_staff_id IS NOT NULL THEN 'REGISTERED' ELSE 'NOT REGISTERED' END as registration_status FROM hr_ethiopian_attendance a LEFT JOIN registered_staff r ON a.staff_id = r.global_staff_id WHERE a.status IN ('LATE', 'ABSENT', 'HALF_DAY') ORDER BY a.ethiopian_year DESC, a.ethiopian_month DESC, a.ethiopian_day DESC LIMIT 20;"

echo.
echo 4. Sample registered staff IDs...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT global_staff_id, full_name FROM \"Teacher\" WHERE global_staff_id IS NOT NULL LIMIT 5;"

echo.
echo ========================================
echo Check complete!
echo ========================================
pause
