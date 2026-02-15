@echo off
echo ========================================
echo  FIX PAYROLL TABLES
echo ========================================
echo.
echo This will fix the hr_allowances and hr_deductions tables
echo to ensure they have the correct column structure.
echo.
pause

cd backend

echo.
echo [1/2] Fixing hr_allowances table...
node scripts/fix-allowances-table.js

echo.
echo [2/2] Fixing hr_deductions table...
node scripts/fix-deductions-table.js

echo.
echo ========================================
echo  DONE!
echo ========================================
echo.
echo The payroll tables have been fixed.
echo You can now generate payroll successfully.
echo.
pause
