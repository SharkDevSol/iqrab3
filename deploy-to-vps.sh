#!/bin/bash

# ============================================================================
# Deploy to VPS and Fix Database
# ============================================================================
# VPS: ssh root@76.13.48.245
# Domain: https://iqrab3.skoolific.com/
# ============================================================================

echo "🚀 Starting deployment to VPS..."
echo "📍 VPS: 76.13.48.245"
echo "🌐 Domain: https://iqrab3.skoolific.com/"
echo ""

# SSH into VPS and execute commands
ssh root@76.13.48.245 << 'ENDSSH'

echo "📂 Navigating to project directory..."
cd /var/www/iqrab3 || cd /root/iqrab3 || cd ~/iqrab3 || {
    echo "❌ Project directory not found!"
    echo "Please specify the correct path."
    exit 1
}

echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🗄️  Fixing database - Creating missing table..."
echo "Running database migration..."

# Create the table using Node.js script
node scripts/quick-fix-table.js || {
    echo "⚠️  Automated script failed. Trying direct SQL..."
    
    # Try using psql directly
    psql -U postgres -d school_management10 -f database/FIX_MISSING_TABLE.sql || {
        echo "❌ Database fix failed!"
        echo "📌 Manual fix required:"
        echo "   1. Connect to PostgreSQL"
        echo "   2. Run: psql -U postgres -d school_management10 -f backend/database/FIX_MISSING_TABLE.sql"
        echo "   3. Or use pgAdmin to run the SQL from backend/database/FIX_MISSING_TABLE.sql"
    }
}

echo "🔄 Restarting backend server..."
pm2 restart iqrab3-backend || pm2 restart bilal-backend || pm2 restart all || {
    echo "⚠️  PM2 restart failed. Trying to start..."
    pm2 start server.js --name iqrab3-backend
}

echo "📊 Checking PM2 status..."
pm2 status

echo "📝 Showing recent logs..."
pm2 logs --lines 20

echo ""
echo "✅ Deployment completed!"
echo "🌐 Check your site: https://iqrab3.skoolific.com/"
echo ""

ENDSSH

echo ""
echo "✅ Deployment script finished!"
echo "📌 Next steps:"
echo "   1. Check if the site is working: https://iqrab3.skoolific.com/"
echo "   2. If database error persists, SSH into VPS and run:"
echo "      ssh root@76.13.48.245"
echo "      cd /var/www/iqrab3/backend"
echo "      node scripts/quick-fix-table.js"
echo ""
