@echo off
echo ========================================
echo  DELETE ALL FINANCE DATA
echo ========================================
echo.
echo ⚠️  WARNING: THIS WILL DELETE EVERYTHING! ⚠️
echo.
echo This will permanently delete:
echo   - All invoices
echo   - All payments
echo   - All fee structures
echo   - All late fee rules
echo   - All payment allocations
echo   - All invoice items
echo.
echo This action CANNOT be undone!
echo.
echo Are you absolutely sure you want to continue?
echo.
pause

cd backend
node scripts/delete-all-finance-data.js

echo.
echo ========================================
echo Press any key to exit...
pause > nul
