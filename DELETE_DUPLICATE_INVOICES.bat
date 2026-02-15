@echo off
echo ========================================
echo  DELETE DUPLICATE INVOICES
echo ========================================
echo.
echo This will remove duplicate invoices from the database.
echo Only the first invoice for each student/month will be kept.
echo.
pause

cd backend
node scripts/delete-duplicate-invoices.js

echo.
echo ========================================
echo Press any key to exit...
pause > nul
