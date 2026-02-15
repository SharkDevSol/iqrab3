@echo off
echo ========================================
echo Fix Timezone Configuration
echo ========================================
echo.
echo This will help you fix the timezone issue
echo.
echo STEP 1: Set Windows Timezone
echo ========================================
echo.
echo Current timezone:
tzutil /g
echo.
echo Setting timezone to East Africa Time (UTC+3)...
tzutil /s "E. Africa Standard Time"
echo.
echo New timezone:
tzutil /g
echo.
echo ========================================
echo STEP 2: Update Database Connection
echo ========================================
echo.
echo Please manually edit: backend/.env
echo.
echo Add timezone parameter to DATABASE_URL:
echo DATABASE_URL="postgresql://postgres:12345678@localhost:5432/school_management?schema=school_comms&timezone=Africa/Addis_Ababa"
echo.
echo ========================================
echo STEP 3: Restart Backend Server
echo ========================================
echo.
echo After updating .env file, restart your backend server
echo.
pause
