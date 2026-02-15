@echo off
echo ========================================
echo  FIX ALL PAYROLL ISSUES
echo ========================================
echo.
echo This will fix:
echo 1. Duplicate salary records (8 to 6 staff)
echo 2. Column name issue (allowance_type)
echo 3. Missing deductions table
echo.
echo Press any key to start...
pause > nul

cd backend

echo.
echo ========================================
echo  STEP 1: Fixing Table Structures
echo ========================================
echo.

echo [1/3] Fixing hr_allowances table...
node scripts/fix-allowances-table.js

echo.
echo [2/3] Fixing hr_deductions table...
node scripts/fix-deductions-table.js

echo.
echo [3/3] Fixing duplicate salaries...
node scripts/fix-duplicate-salaries.js

echo.
echo ========================================
echo  ALL FIXES COMPLETE!
echo ========================================
echo.
echo Now:
echo 1. Restart the backend (RESTART_BACKEND.bat)
echo 2. Generate payroll again
echo 3. Should show exactly 6 staff members
echo.
pause
