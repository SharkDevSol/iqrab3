@echo off
echo ========================================
echo  FIX DUPLICATE PAYROLL ENTRIES
echo ========================================
echo.
echo This will:
echo - Find duplicate salary records
echo - Keep only the most recent one per staff
echo - Remove records with missing names
echo.
pause

cd backend

echo.
echo Fixing duplicate salaries...
node scripts/fix-duplicate-salaries.js

echo.
echo ========================================
echo  DONE!
echo ========================================
echo.
echo Now restart the backend and generate payroll again.
echo You should see exactly 6 staff members.
echo.
pause
