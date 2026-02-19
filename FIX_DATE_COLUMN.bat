@echo off
echo ========================================
echo Fixing Date Column Constraint
echo ========================================
echo.

echo This will make the 'date' column nullable in academic_student_attendance table
echo so the auto-marker can work with Ethiopian calendar dates.
echo.

cd backend

echo Running migration...
psql %DATABASE_URL% -f database/fix_student_attendance_constraint.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo The date column is now nullable.
    echo The auto-marker will now work correctly.
    echo.
    echo Please restart your server to apply changes.
) else (
    echo.
    echo ========================================
    echo ERROR
    echo ========================================
    echo.
    echo Could not run migration.
    echo Please check your DATABASE_URL environment variable.
    echo.
    echo Manual fix:
    echo 1. Open your database client
    echo 2. Run: ALTER TABLE academic_student_attendance ALTER COLUMN date DROP NOT NULL;
)

echo.
pause
