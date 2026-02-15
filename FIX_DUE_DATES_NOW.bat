@echo off
echo ========================================
echo  FIX INVOICE DUE DATES
echo ========================================
echo.
echo This will update all invoice due dates to:
echo   Due Date = Month Start + Grace Period Days
echo.
echo Example:
echo   - Month starts: March 1, 2026
echo   - Grace period: 15 days
echo   - New due date: March 15, 2026
echo.
pause

cd backend
node scripts/fix-invoice-due-dates.js

echo.
echo ========================================
echo Press any key to exit...
pause > nul
