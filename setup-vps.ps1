# Setup and Deploy to VPS
# This script will clone the project if it doesn't exist, then deploy

Write-Host "Setting up project on VPS..." -ForegroundColor Green
Write-Host "VPS: 76.13.48.245" -ForegroundColor Cyan
Write-Host ""

$setupCommands = @'
echo "Searching for existing project..."
PROJECT_DIR=$(find /var/www /root /home -name "iqrab3" -type d 2>/dev/null | head -1)

if [ -z "$PROJECT_DIR" ]; then
    echo "Project not found. Cloning from GitHub..."
    cd /var/www || cd /root || cd ~
    git clone https://github.com/SharkDevSol/iqrab3.git
    PROJECT_DIR="/var/www/iqrab3"
    if [ ! -d "$PROJECT_DIR" ]; then
        PROJECT_DIR="/root/iqrab3"
    fi
    echo "Project cloned to: $PROJECT_DIR"
else
    echo "Project found at: $PROJECT_DIR"
fi

cd "$PROJECT_DIR" || exit 1

echo "Pulling latest changes..."
git pull origin main

echo "Installing backend dependencies..."
cd backend
npm install

echo "Checking .env file..."
if [ ! -f .env ]; then
    echo "Creating .env from .env.production..."
    cp .env.production .env
fi

echo "Running database fix..."
node scripts/quick-fix-table.js

echo "Checking PM2 processes..."
pm2 list

echo "Starting/Restarting backend..."
pm2 restart iqrab3-backend 2>/dev/null || pm2 start server.js --name iqrab3-backend

echo ""
echo "==================================="
echo "Setup completed!"
echo "Project location: $PROJECT_DIR"
echo "==================================="
echo ""
pm2 status
'@

Write-Host "Connecting to VPS..." -ForegroundColor Yellow
Write-Host ""

ssh root@76.13.48.245 $setupCommands

Write-Host ""
Write-Host "Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Check your site: https://iqrab3.skoolific.com/" -ForegroundColor Cyan
Write-Host ""
