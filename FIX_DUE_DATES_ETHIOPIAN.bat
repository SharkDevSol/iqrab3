@echo off
echo ========================================
echo    FIX DUE DATES TO ETHIOPIAN CALENDAR
echo ========================================
echo.
echo This will update all invoice due dates to:
echo - Meskerem: 1/16/2018
echo - Tikimt: 2/16/2018
echo - Hidar: 3/16/2018
echo - Tahsas: 4/16/2018
echo - Tir: 5/16/2018
echo - Yekatit: 6/16/2018
echo - etc...
echo.
pause
echo.

cd backend
node scripts/fix-all-due-dates.js

echo.
echo ========================================
echo.
echo Done! Please refresh your browser.
echo.
pause
