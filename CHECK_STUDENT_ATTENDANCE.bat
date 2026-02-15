@echo off
echo Checking student attendance records for machine ID 3001...
echo.

psql -U postgres -d school_management -c "SELECT * FROM academic_student_attendance WHERE smachine_id = '3001' ORDER BY created_at DESC LIMIT 10;"

echo.
echo Checking all student attendance records...
echo.

psql -U postgres -d school_management -c "SELECT student_name, class_name, smachine_id, ethiopian_year, ethiopian_month, ethiopian_day, status, check_in_time FROM academic_student_attendance ORDER BY created_at DESC LIMIT 20;"

echo.
pause
