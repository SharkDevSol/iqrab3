# Deploy to VPS and Fix Database (PowerShell Version)
# VPS: ssh root@76.13.48.245
# Domain: https://iqrab3.skoolific.com/

Write-Host "Starting deployment to VPS..." -ForegroundColor Green
Write-Host "VPS: 76.13.48.245" -ForegroundColor Cyan
Write-Host "Domain: https://iqrab3.skoolific.com/" -ForegroundColor Cyan
Write-Host ""

# Create the SSH command script
$sshCommands = @"
echo 'Navigating to project directory...'
cd /var/www/iqrab3 || cd /root/iqrab3 || cd ~/iqrab3 || {
    echo 'Project directory not found!'
    echo 'Searching for project...'
    find / -name 'iqrab3' -type d 2>/dev/null | head -5
    exit 1
}

echo 'Pulling latest changes from GitHub...'
git pull origin main

echo 'Installing backend dependencies...'
cd backend
npm install --production

echo 'Fixing database - Creating missing table...'
node scripts/quick-fix-table.js

if [ \$? -ne 0 ]; then
    echo 'Automated script failed. Trying direct SQL...'
    DB_NAME=\$(grep DB_NAME .env | cut -d '=' -f2 | tr -d '"' | tr -d ' ')
    DB_USER=\$(grep DB_USER .env | cut -d '=' -f2 | tr -d '"' | tr -d ' ')
    PGPASSWORD=\$(grep DB_PASSWORD .env | cut -d '=' -f2 | tr -d '"' | tr -d ' ') psql -U \$DB_USER -d \$DB_NAME -f database/FIX_MISSING_TABLE.sql
fi

echo 'Restarting backend server...'
pm2 restart iqrab3-backend || pm2 restart bilal-backend || pm2 restart all

echo 'PM2 Status:'
pm2 status

echo 'Recent logs:'
pm2 logs --lines 20 --nostream

echo ''
echo 'Deployment completed!'
echo 'Check: https://iqrab3.skoolific.com/'
"@

# Execute SSH commands
Write-Host "Connecting to VPS..." -ForegroundColor Yellow
ssh root@76.13.48.245 $sshCommands

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Check your site: https://iqrab3.skoolific.com/" -ForegroundColor White
    Write-Host "   2. Test the attendance issues page" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Deployment encountered issues!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manual steps:" -ForegroundColor Cyan
    Write-Host "   ssh root@76.13.48.245" -ForegroundColor Gray
    Write-Host "   cd /var/www/iqrab3" -ForegroundColor Gray
    Write-Host "   git pull origin main" -ForegroundColor Gray
    Write-Host "   cd backend && npm install" -ForegroundColor Gray
    Write-Host "   node scripts/quick-fix-table.js" -ForegroundColor Gray
    Write-Host "   pm2 restart iqrab3-backend" -ForegroundColor Gray
    Write-Host ""
}
