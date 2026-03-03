@echo off
echo ========================================
echo Deploying .env Fix to VPS
echo ========================================
echo.

echo Step 1: Committing .env.production template to GitHub...
git add backend/.env.production DEPLOY_ENV_FIX.bat VPS_COMMANDS_FIX_ENV.md
git commit -m "Fix: Add .env.production template with correct Bilal system settings"
git push origin main

echo.
echo Step 2: Now run these commands on your VPS:
echo.
echo cd /var/www/bilal-school
echo git pull origin main
echo cp backend/.env.production backend/.env
echo pm2 restart bilal-backend --update-env
echo pm2 logs bilal-backend --lines 20
echo.
echo Step 3: Test the create-form endpoint:
echo curl -X POST http://localhost:5011/api/students/create-form -H "Content-Type: application/json" -d "{\"classCount\":1,\"classes\":[\"Grade_1\"],\"customFields\":[]}"
echo.
echo ========================================
echo Script complete!
echo ========================================
pause
