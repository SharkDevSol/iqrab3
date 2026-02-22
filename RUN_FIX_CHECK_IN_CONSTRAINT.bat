@echo off
echo ========================================
echo Fixing check_in constraint
echo ========================================
echo.

REM Load database URL from .env file
for /f "tokens=1,2 delims==" %%a in ('type backend\.env ^| findstr DATABASE_URL') do set %%a=%%b

echo Running SQL fix...
psql "%DATABASE_URL%" -f FIX_CHECK_IN_CONSTRAINT.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ SUCCESS: Constraint fixed!
    echo ========================================
    echo.
    echo The system is now protected against:
    echo - Device changes
    echo - Data deletion
    echo - Missing check-in records
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ ERROR: Failed to apply fix
    echo ========================================
    echo.
)

pause
