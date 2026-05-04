#!/bin/bash

# Deployment script for VPS
# This script pulls the latest changes and restarts the backend

echo "🚀 Starting deployment to VPS..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to project directory
cd /root/iqrab3 || { echo -e "${RED}❌ Project directory not found${NC}"; exit 1; }

echo -e "${YELLOW}📥 Pulling latest changes from GitHub...${NC}"
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git pull failed${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Restarting backend with PM2...${NC}"
pm2 restart backend

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  PM2 restart failed, trying to start...${NC}"
    pm2 start npm --name "backend" -- start
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}📊 Checking PM2 status...${NC}"
pm2 status

echo ""
echo -e "${GREEN}🎉 Done! The 401 authentication error should now be fixed.${NC}"
echo -e "${YELLOW}📝 Changes made:${NC}"
echo "   - Made /api/faults/classes endpoint public"
echo "   - Made /api/faults/reports endpoint public"
echo "   - Other faults endpoints still require authentication"
echo ""
echo -e "${YELLOW}🧪 Test the fix:${NC}"
echo "   1. Open https://iqrab3.skoolific.com"
echo "   2. Navigate to Student Faults page"
echo "   3. Classes and reports should load without 401 errors"
