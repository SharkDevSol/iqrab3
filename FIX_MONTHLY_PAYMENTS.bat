@echo off
REM ========================================
REM Fix Monthly Payments - Add Required Columns
REM ========================================
REM This script adds the required finance columns to all class tables
REM Run this if monthly payments are not showing students

echo ========================================
echo Fix Monthly Payments - Add Required Columns
echo ========================================
echo.
echo This script will add the following columns to ALL class tables:
echo   - is_active (track active/inactive students)
echo   - is_free (track scholarship/free students)
echo   - exemption_type (type of exemption)
echo   - exemption_reason (reason for exemption)
echo.
echo These columns are required for the monthly payment system to work.
echo.
pause

echo.
echo Running migration...
echo.

cd backend
node migrations/add-finance-columns-to-all-classes.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS: Migration completed!
    echo ========================================
    echo.
    echo All class tables now have the required finance columns.
    echo Monthly payments should now work correctly.
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Migration failed
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
)

cd ..
pause
