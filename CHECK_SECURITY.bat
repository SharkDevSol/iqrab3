@echo off
echo ========================================
echo   SECURITY CHECK FOR VPS DEPLOYMENT
echo ========================================
echo.
echo Checking your system for security issues...
echo.

REM Check if hardcoded passwords exist in db.js
echo [1/5] Checking backend/config/db.js for hardcoded passwords...
findstr /C:"12345678" backend\config\db.js >nul 2>&1
if %errorlevel% equ 0 (
    echo [FAIL] Hardcoded password found in backend/config/db.js
    echo        Action: Remove hardcoded password fallback
) else (
    echo [PASS] No hardcoded password in backend/config/db.js
)
echo.

REM Check if .env has weak password
echo [2/5] Checking backend/.env for weak database password...
findstr /C:"DB_PASSWORD=12345678" backend\.env >nul 2>&1
if %errorlevel% equ 0 (
    echo [FAIL] Weak database password in backend/.env
    echo        Action: Change to strong password (16+ characters)
) else (
    echo [PASS] Database password looks updated
)
echo.

REM Check if JWT secret is default
echo [3/5] Checking backend/.env for JWT secret...
findstr /C:"JWT_SECRET=" backend\.env >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] JWT_SECRET found in backend/.env
    echo        Make sure it's a strong random string (64+ characters)
) else (
    echo [FAIL] JWT_SECRET not found in backend/.env
    echo        Action: Add JWT_SECRET with strong random value
)
echo.

REM Check if SMTP is configured
echo [4/5] Checking backend/.env for SMTP configuration...
findstr /C:"your-email@gmail.com" backend\.env >nul 2>&1
if %errorlevel% equ 0 (
    echo [FAIL] SMTP not configured (placeholder values found)
    echo        Action: Update SMTP_USER and SMTP_PASS with real credentials
) else (
    echo [PASS] SMTP configuration looks updated
)
echo.

REM Check if production .env exists for frontend
echo [5/5] Checking for APP/.env.production...
if exist "APP\.env.production" (
    echo [PASS] APP/.env.production exists
) else (
    echo [FAIL] APP/.env.production not found
    echo        Action: Create APP/.env.production with production API URL
)
echo.

echo ========================================
echo   SECURITY CHECK SUMMARY
echo ========================================
echo.
echo Please review the results above and fix any [FAIL] items.
echo.
echo CRITICAL ITEMS TO FIX:
echo 1. Remove hardcoded passwords from code
echo 2. Use strong database password (not 12345678)
echo 3. Generate strong JWT secret (64+ characters)
echo 4. Configure real SMTP credentials
echo 5. Create production environment files
echo.
echo After fixing these issues, you're ready to deploy!
echo.
echo Next steps:
echo 1. Run PREPARE_FOR_VPS.bat to generate JWT secret
echo 2. Read HOSTINGER_VPS_DEPLOYMENT_GUIDE.md
echo 3. Follow deployment steps
echo.
pause
