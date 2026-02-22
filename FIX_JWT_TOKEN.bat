@echo off
echo ========================================
echo JWT Token Fix Tool
echo ========================================
echo.
echo This will help you fix the "invalid signature" error
echo.

cd backend

echo Running JWT Quick Fix...
echo.
node quick-fix-jwt.js

echo.
echo ========================================
echo.
pause
