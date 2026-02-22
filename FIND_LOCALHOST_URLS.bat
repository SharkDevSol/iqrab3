@echo off
echo ========================================
echo   Finding localhost URLs in your code
echo ========================================
echo.

echo Searching for localhost:5000 references...
echo.

cd APP\src

echo === Files containing localhost:5000 ===
findstr /s /i /n "localhost:5000" *.jsx *.js *.ts *.tsx 2>nul

echo.
echo === Files containing localhost:3000 ===
findstr /s /i /n "localhost:3000" *.jsx *.js *.ts *.tsx 2>nul

echo.
echo ========================================
echo   Search Complete!
echo ========================================
echo.
echo These files need to be updated when deploying to VPS.
echo See VPS_DEPLOYMENT_GUIDE.md for instructions.
echo.

pause
