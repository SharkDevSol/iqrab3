@echo off
echo ========================================
echo Fix Duplicate Guardian Accounts
echo ========================================
echo.
echo This will update all students with the same guardian phone
echo to have the SAME guardian username and password.
echo.

set /p PHONE="Enter Guardian Phone Number (e.g., 0936311768): "
set /p USERNAME="Enter Guardian Username to keep (e.g., abdurhmanahmmed_4386): "

echo.
echo Fixing guardian accounts for phone: %PHONE%
echo Using username: %USERNAME%
echo.

psql -U postgres -d school_management -c "UPDATE classes_schema.\"KG1B\" SET guardian_username = '%USERNAME%', guardian_password = (SELECT guardian_password FROM classes_schema.\"KG1B\" WHERE guardian_phone = '%PHONE%' AND guardian_username = '%USERNAME%' LIMIT 1) WHERE guardian_phone = '%PHONE%';"

psql -U postgres -d school_management -c "UPDATE classes_schema.\"KG2A\" SET guardian_username = '%USERNAME%', guardian_password = (SELECT guardian_password FROM classes_schema.\"KG1B\" WHERE guardian_phone = '%PHONE%' AND guardian_username = '%USERNAME%' LIMIT 1) WHERE guardian_phone = '%PHONE%';"

psql -U postgres -d school_management -c "UPDATE classes_schema.\"GRADE2\" SET guardian_username = '%USERNAME%', guardian_password = (SELECT guardian_password FROM classes_schema.\"KG1B\" WHERE guardian_phone = '%PHONE%' AND guardian_username = '%USERNAME%' LIMIT 1) WHERE guardian_phone = '%PHONE%';"

echo.
echo ========================================
echo Verifying the fix...
echo ========================================
echo.

psql -U postgres -d school_management -c "SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"KG1B\" WHERE guardian_phone = '%PHONE%' UNION ALL SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"KG2A\" WHERE guardian_phone = '%PHONE%' UNION ALL SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"GRADE2\" WHERE guardian_phone = '%PHONE%';"

echo.
echo ========================================
echo Fix Complete!
echo.
echo All students with phone %PHONE% now have username: %USERNAME%
echo.
echo Next steps:
echo 1. Refresh the guardian app
echo 2. Check the payments tab
echo 3. All students should now appear
echo.
pause
