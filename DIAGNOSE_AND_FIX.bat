@echo off
echo ========================================
echo    DIAGNOSE AND FIX TIR MONTH
echo ========================================
echo.
echo This will:
echo 1. Show all invoices and their late fees
echo 2. Force fix ALL invoices including Tir
echo.
pause
echo.

cd backend

echo ========================================
echo STEP 1: SHOWING ALL INVOICES
echo ========================================
echo.
node scripts/show-all-invoices.js

echo.
echo.
echo ========================================
echo STEP 2: FORCE FIXING ALL INVOICES
echo ========================================
echo.
node scripts/force-fix-all-invoices.js

echo.
echo ========================================
echo.
echo Done! Please:
echo 1. Check the output above
echo 2. Refresh your browser (Ctrl+F5)
echo 3. Go to Finance - Monthly Payments
echo 4. Check Tir month
echo.
pause
