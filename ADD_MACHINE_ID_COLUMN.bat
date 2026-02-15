@echo off
echo ========================================
echo   ADD MACHINE ID COLUMN TO STAFF TABLES
echo ========================================
echo.
echo This will add machine_id column to:
echo - All Teachers tables
echo - All Administrative Staff tables
echo - All Supportive Staff tables
echo.
echo ========================================
echo.

cd backend
node scripts/add-machine-id-column.js

echo.
pause
