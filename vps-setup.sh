#!/bin/bash

# VPS Setup and Deployment Script
# Run this directly on the VPS: bash vps-setup.sh

echo "========================================="
echo "VPS Setup and Deployment"
echo "========================================="
echo ""

# Find or clone project
echo "Step 1: Locating project..."
PROJECT_DIR=$(find /var/www /root /home -name "iqrab3" -type d 2>/dev/null | head -1)

if [ -z "$PROJECT_DIR" ]; then
    echo "Project not found. Cloning from GitHub..."
    cd /var/www 2>/dev/null || cd /root || cd ~
    git clone https://github.com/SharkDevSol/iqrab3.git
    
    if [ -d "/var/www/iqrab3" ]; then
        PROJECT_DIR="/var/www/iqrab3"
    elif [ -d "/root/iqrab3" ]; then
        PROJECT_DIR="/root/iqrab3"
    else
        PROJECT_DIR="$HOME/iqrab3"
    fi
    
    echo "Project cloned to: $PROJECT_DIR"
else
    echo "Project found at: $PROJECT_DIR"
fi

# Navigate to project
cd "$PROJECT_DIR" || {
    echo "ERROR: Cannot access project directory"
    exit 1
}

echo ""
echo "Step 2: Pulling latest changes..."
git pull origin main

echo ""
echo "Step 3: Installing backend dependencies..."
cd backend
npm install

echo ""
echo "Step 4: Setting up environment..."
if [ ! -f .env ]; then
    echo "Creating .env from .env.production..."
    cp .env.production .env
else
    echo ".env file already exists"
fi

echo ""
echo "Step 5: Fixing database (creating missing table)..."
node scripts/quick-fix-table.js

echo ""
echo "Step 6: Managing PM2 process..."
pm2 list

# Try to restart, if fails then start
pm2 restart iqrab3-backend 2>/dev/null || \
pm2 restart bilal-backend 2>/dev/null || \
pm2 start server.js --name iqrab3-backend

echo ""
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Project location: $PROJECT_DIR"
echo "Website: https://iqrab3.skoolific.com/"
echo ""
echo "PM2 Status:"
pm2 status

echo ""
echo "Recent logs:"
pm2 logs --lines 10 --nostream

echo ""
echo "To view live logs: pm2 logs iqrab3-backend"
echo "To restart: pm2 restart iqrab3-backend"
echo ""
