@echo off
echo ========================================
echo    FIX TIR MONTH LATE FEE
echo ========================================
echo.

cd backend

echo Step 1: Debugging Tir invoice...
echo.
node scripts/debug-tir-invoice.js

echo.
echo ========================================
echo.
echo Step 2: Forcing fix on Tir invoice...
echo.
node scripts/fix-tir-now.js

echo.
echo ========================================
echo.
echo Done! Please refresh your browser.
echo.
pause
