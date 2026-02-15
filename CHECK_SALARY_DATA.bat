@echo off
echo ========================================
echo  CHECK SALARY DATA
echo ========================================
echo.
echo This will show you:
echo - All salary records
echo - Duplicate entries
echo - Missing names
echo - Recommendations
echo.
pause

cd backend

echo.
node scripts/check-salary-data.js

echo.
echo ========================================
echo.
echo If you see duplicates or missing names,
echo run: FIX_DUPLICATE_PAYROLL.bat
echo.
pause
