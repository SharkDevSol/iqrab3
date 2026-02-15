@echo off
echo ========================================
echo Checking Staff ID Format Mismatches
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

echo 1. Staff IDs in attendance (sample):
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT DISTINCT staff_id, staff_name FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY') ORDER BY staff_name LIMIT 10;"

echo.
echo 2. Staff IDs in registration tables (sample):
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT global_staff_id, full_name FROM staff_teachers WHERE global_staff_id IS NOT NULL LIMIT 10;"

echo.
echo 3. Checking for case-insensitive matches:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "WITH attendance_staff AS (SELECT DISTINCT staff_id, staff_name FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY')), registered_staff AS (SELECT global_staff_id, full_name FROM staff_teachers WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id, full_name FROM staff_administrative_staff WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id, full_name FROM staff_supportive_staff WHERE global_staff_id IS NOT NULL) SELECT a.staff_id as attendance_id, a.staff_name as attendance_name, r.global_staff_id as registered_id, r.full_name as registered_name, CASE WHEN a.staff_id = r.global_staff_id THEN 'EXACT MATCH' WHEN LOWER(a.staff_id) = LOWER(r.global_staff_id) THEN 'CASE MISMATCH' WHEN LOWER(a.staff_name) = LOWER(r.full_name) THEN 'NAME MATCH' ELSE 'NO MATCH' END as match_type FROM attendance_staff a LEFT JOIN registered_staff r ON LOWER(a.staff_id) = LOWER(r.global_staff_id) OR LOWER(a.staff_name) = LOWER(r.full_name) ORDER BY match_type, a.staff_name LIMIT 20;"

echo.
echo 4. Count by match type:
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "WITH attendance_staff AS (SELECT DISTINCT staff_id, staff_name FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 AND status IN ('LATE', 'ABSENT', 'HALF_DAY')), registered_staff AS (SELECT global_staff_id, full_name FROM staff_teachers WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id, full_name FROM staff_administrative_staff WHERE global_staff_id IS NOT NULL UNION SELECT global_staff_id, full_name FROM staff_supportive_staff WHERE global_staff_id IS NOT NULL) SELECT CASE WHEN a.staff_id = r.global_staff_id THEN 'EXACT MATCH' WHEN LOWER(a.staff_id) = LOWER(r.global_staff_id) THEN 'CASE MISMATCH' WHEN LOWER(a.staff_name) = LOWER(r.full_name) THEN 'NAME MATCH ONLY' WHEN r.global_staff_id IS NULL THEN 'NOT REGISTERED' ELSE 'OTHER' END as match_type, COUNT(*) as count FROM attendance_staff a LEFT JOIN registered_staff r ON LOWER(a.staff_id) = LOWER(r.global_staff_id) OR LOWER(a.staff_name) = LOWER(r.full_name) GROUP BY match_type ORDER BY count DESC;"

echo.
echo ========================================
echo Analysis complete!
echo ========================================
pause
