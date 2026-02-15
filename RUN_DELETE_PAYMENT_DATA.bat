@echo off
echo ========================================
echo  DELETE ALL MONTHLY PAYMENT DATA
echo ========================================
echo.
echo WARNING: This will permanently delete:
echo   - All fee structures
echo   - All late fee rules
echo   - All invoices
echo   - All payments
echo   - All discounts and scholarships
echo.
echo This action CANNOT be undone!
echo.
echo Press Ctrl+C to cancel, or
pause

cd backend
node scripts/delete-all-monthly-payment-data.js --confirm

echo.
echo ========================================
echo  DELETION COMPLETE
echo ========================================
echo.
pause
