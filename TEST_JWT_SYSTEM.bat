@echo off
echo ========================================
echo JWT System Test Suite
echo ========================================
echo.

cd backend

echo [1/3] Validating Environment...
echo.
call node validate-env.js
if errorlevel 1 (
    echo.
    echo ❌ Environment validation failed!
    echo Please fix the errors above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo.
echo [2/3] Testing Password Change System...
echo.
call node test-password-change.js
if errorlevel 1 (
    echo.
    echo ❌ Password change test failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo.
echo [3/3] Testing Complete Flow...
echo.
call node test-complete-flow.js

echo.
echo ========================================
echo.
echo ✅ ALL TESTS PASSED!
echo.
echo Your system is ready for deployment.
echo.
echo Next steps:
echo 1. Deploy to VPS
echo 2. Run this test on VPS
echo 3. Clear browser storage
echo 4. Login and test
echo.
echo ========================================
echo.
pause
