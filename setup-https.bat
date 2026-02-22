@echo off
echo ========================================
echo Setting up HTTPS for Local Development
echo ========================================
echo.

echo Step 1: Installing mkcert...
choco install mkcert -y

echo.
echo Step 2: Creating local Certificate Authority...
mkcert -install

echo.
echo Step 3: Generating certificate for 172.21.8.159...
mkcert 172.21.8.159 localhost 127.0.0.1

echo.
echo Step 4: Creating certs folder...
if not exist "certs" mkdir certs

echo.
echo Step 5: Moving certificates...
move 172.21.8.159+2.pem certs\cert.pem
move 172.21.8.159+2-key.pem certs\key.pem

echo.
echo ========================================
echo HTTPS Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update APP/.env with: VITE_API_URL=https://172.21.8.159:5000/api
echo 2. Start frontend: cd APP && npm run dev
echo 3. Start backend: cd backend && node server.js
echo 4. Access from mobile: https://172.21.8.159:5173
echo.
echo Note: You'll see a security warning on first access.
echo Click "Advanced" and "Proceed" to continue.
echo.
pause
