@echo off
echo ========================================
echo   PREPARE SYSTEM FOR VPS DEPLOYMENT
echo ========================================
echo.
echo This script will help you prepare your system for production deployment.
echo.
echo CRITICAL SECURITY ISSUES TO FIX:
echo 1. Remove hardcoded passwords from code
echo 2. Generate strong JWT secret
echo 3. Update database credentials
echo 4. Configure SMTP for email notifications
echo 5. Update CORS configuration
echo.
echo ========================================
echo   STEP 1: Generate Strong JWT Secret
echo ========================================
echo.
echo Generating a random 64-character JWT secret...
echo.

REM Generate random JWT secret using PowerShell
powershell -Command "$bytes = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); $secret = [Convert]::ToBase64String($bytes) -replace '[^a-zA-Z0-9]', ''; Write-Host 'Your new JWT_SECRET:'; Write-Host $secret -ForegroundColor Green; Write-Host ''; Write-Host 'Copy this and update your backend/.env file' -ForegroundColor Yellow"

echo.
echo ========================================
echo   STEP 2: Security Checklist
echo ========================================
echo.
echo Please complete these tasks manually:
echo.
echo [ ] 1. Update backend/.env with:
echo        - Strong DB_PASSWORD (not 12345678)
echo        - New JWT_SECRET (generated above)
echo        - Real SMTP credentials
echo        - Production FRONTEND_URL
echo.
echo [ ] 2. Update backend/config/db.js:
echo        - Remove hardcoded password fallback
echo        - Use only process.env.DB_PASSWORD
echo.
echo [ ] 3. Update check-guardian-usernames.js:
echo        - Remove hardcoded password
echo        - Use environment variables
echo.
echo [ ] 4. Update backend/server.js CORS:
echo        - Change allowedOrigins to ['https://iqrab3.skoolific.com']
echo        - Remove localhost origins for production
echo.
echo [ ] 5. Create APP/.env.production:
echo        - VITE_API_URL=https://iqrab3.skoolific.com/api
echo        - VITE_WS_URL=wss://iqrab3.skoolific.com
echo.
echo [ ] 6. Search and replace hardcoded URLs in frontend:
echo        - Replace http://localhost:5000 with API utility
echo        - Use: import api from '../../utils/api'
echo.
echo ========================================
echo   STEP 3: Test Before Deployment
echo ========================================
echo.
echo Before deploying to VPS, test locally:
echo.
echo 1. Backend: cd backend ^&^& npm start
echo 2. Frontend: cd APP ^&^& npm run build
echo 3. Check for errors in both
echo.
echo ========================================
echo   STEP 4: Files to Upload to VPS
echo ========================================
echo.
echo Upload these directories:
echo - backend/ (with production .env)
echo - APP/dist/ (built frontend)
echo - Uploads/ (if you have existing files)
echo.
echo DO NOT upload:
echo - node_modules/ (install on VPS)
echo - .git/ (optional)
echo - *.md files (optional)
echo.
echo ========================================
echo   NEXT STEPS
echo ========================================
echo.
echo 1. Complete the security checklist above
echo 2. Read HOSTINGER_VPS_DEPLOYMENT_GUIDE.md
echo 3. Follow the deployment steps in the guide
echo 4. Test all services after deployment
echo.
echo ========================================
echo   IMPORTANT PORTS FOR VPS
echo ========================================
echo.
echo - Port 5000: Backend API
echo - Port 7788: AI06 Biometric Device
echo - Port 5432: PostgreSQL Database
echo - Port 80/443: Nginx (HTTP/HTTPS)
echo.
echo Make sure these ports are open in your VPS firewall!
echo.
pause
