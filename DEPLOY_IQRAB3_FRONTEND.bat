@echo off
echo ========================================
echo IQRAB3 Frontend Deployment Script
echo ========================================
echo.
echo VPS IP: 76.13.48.245
echo Target: /var/www/skoolific/iqrab3/APP
echo.

cd APP

echo [1/3] Building production frontend...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Build complete! dist folder ready.
echo.
echo [3/3] Upload instructions:
echo.
echo Option A - Using SCP (if available):
echo scp -r dist/* root@76.13.48.245:/var/www/skoolific/iqrab3/APP/dist/
echo.
echo Option B - Using FileZilla/WinSCP:
echo 1. Connect to: 76.13.48.245
echo 2. Username: root
echo 3. Navigate to: /var/www/skoolific/iqrab3/APP/
echo 4. Upload the entire 'dist' folder
echo.
echo Option C - Manual SSH commands:
echo ssh root@76.13.48.245
echo cd /var/www/skoolific/iqrab3/APP
echo rm -rf dist/*
echo # Then upload via SFTP
echo.
echo ========================================
echo Build Complete! Ready to upload.
echo ========================================
pause
