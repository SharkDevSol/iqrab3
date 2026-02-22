@echo off
echo ========================================
echo Fix Duplicate Guardian Accounts
echo ========================================
echo.
echo This will update all students with phone 0936311768
echo to have the SAME guardian username: abdurhmanahmmed_4386
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Connecting to database: school_management2
echo.

REM Update KG2A (obsa yusuf)
psql -U postgres -d school_management2 -c "UPDATE classes_schema.\"KG2A\" SET guardian_username = 'abdurhmanahmmed_4386', guardian_password = (SELECT guardian_password FROM classes_schema.\"KG1B\" WHERE guardian_phone = '0936311768' LIMIT 1) WHERE guardian_phone = '0936311768';"

REM Update GRADE2 (halima yusuf)
psql -U postgres -d school_management2 -c "UPDATE classes_schema.\"GRADE2\" SET guardian_username = 'abdurhmanahmmed_4386', guardian_password = (SELECT guardian_password FROM classes_schema.\"KG1B\" WHERE guardian_phone = '0936311768' LIMIT 1) WHERE guardian_phone = '0936311768';"

echo.
echo ========================================
echo Verifying the fix...
echo ========================================
echo.

psql -U postgres -d school_management2 -c "SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"KG1B\" WHERE guardian_phone = '0936311768' UNION ALL SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"KG2A\" WHERE guardian_phone = '0936311768' UNION ALL SELECT student_name, school_id, class, guardian_phone, guardian_username FROM classes_schema.\"GRADE2\" WHERE guardian_phone = '0936311768';"

echo.
echo ========================================
echo Fix Complete!
echo.
echo All 3 students now have username: abdurhmanahmmed_4386
echo.
echo Next steps:
echo 1. Restart the backend server
echo 2. Refresh the guardian app
echo 3. Check the payments tab - all 3 students should appear
echo.
pause
