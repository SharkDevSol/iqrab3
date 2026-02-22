@echo off
echo ========================================
echo Check Guardian Account Status
echo ========================================
echo.
echo Checking students with phone: 0936311768
echo.

psql -U postgres -d school_management2 -c "SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"KG1B\" WHERE guardian_phone = '0936311768' UNION ALL SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"KG2A\" WHERE guardian_phone = '0936311768' UNION ALL SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"GRADE2\" WHERE guardian_phone = '0936311768';"

echo.
echo ========================================
echo Expected Result:
echo All 3 students should have the SAME guardian_username
echo If they have different usernames, run FIX_GUARDIAN_ACCOUNTS_SIMPLE.bat
echo.
pause
