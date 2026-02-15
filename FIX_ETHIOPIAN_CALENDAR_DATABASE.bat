@echo off
echo ========================================
echo  FIX ETHIOPIAN CALENDAR DATABASE SCHEMA
echo ========================================
echo.
echo This will:
echo 1. Backup existing deductions and allowances
echo 2. Recreate tables with Ethiopian month support
echo 3. Restore your data
echo.
echo Press any key to continue...
pause > nul

cd backend
node scripts/recreate-deductions-allowances-tables.js

echo.
echo ========================================
echo  DONE!
echo ========================================
echo.
echo Now you can:
echo 1. Add deductions and allowances
echo 2. View details with net salary calculation
echo 3. Ethiopian month will show "Tir 2018"
echo.
pause
