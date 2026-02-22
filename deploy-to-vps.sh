#!/bin/bash

# ============================================
# School Management System - VPS Deployment Script
# VPS IP: 76.13.48.245
# ============================================

echo "=========================================="
echo "School Management System Deployment"
echo "VPS IP: 76.13.48.245"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running on VPS
print_info "Checking environment..."

# Step 1: Update system
print_info "Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Step 2: Install Node.js if not installed
if ! command -v node &> /dev/null; then
    print_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
    sudo apt install -y nodejs
    print_success "Node.js installed: $(node --version)"
else
    print_success "Node.js already installed: $(node --version)"
fi

# Step 3: Install PostgreSQL if not installed
if ! command -v psql &> /dev/null; then
    print_info "Installing PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    print_success "PostgreSQL installed"
else
    print_success "PostgreSQL already installed"
fi

# Step 4: Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    print_info "Installing Nginx..."
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    print_success "Nginx installed"
else
    print_success "Nginx already installed"
fi

# Step 5: Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    print_info "Installing PM2..."
    sudo npm install -g pm2
    print_success "PM2 installed"
else
    print_success "PM2 already installed"
fi

# Step 6: Setup Backend
print_info "Step 6: Setting up backend..."
cd backend

# Check if .env.production exists
if [ -f ".env.production" ]; then
    print_info "Copying production environment..."
    cp .env.production .env
    print_success "Environment configured"
else
    print_error ".env.production not found! Please create it first."
    exit 1
fi

# Install backend dependencies
print_info "Installing backend dependencies..."
npm install
print_success "Backend dependencies installed"

# Step 7: Setup Frontend
print_info "Step 7: Setting up frontend..."
cd ../APP

# Install frontend dependencies
print_info "Installing frontend dependencies..."
npm install
print_success "Frontend dependencies installed"

# Build frontend
print_info "Building frontend for production..."
npm run build
print_success "Frontend built successfully"

# Step 8: Configure Nginx
print_info "Step 8: Configuring Nginx..."

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/school-system > /dev/null <<'EOF'
server {
    listen 80;
    server_name 76.13.48.245;

    # Frontend
    location / {
        root /root/school-system/APP/dist;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Uploads
    location /uploads {
        alias /root/school-system/backend/uploads;
    }

    location /Uploads {
        alias /root/school-system/backend/Uploads;
    }

    client_max_body_size 50M;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/school-system /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if sudo nginx -t; then
    print_success "Nginx configuration valid"
    sudo systemctl reload nginx
    print_success "Nginx reloaded"
else
    print_error "Nginx configuration error"
    exit 1
fi

# Step 9: Configure Firewall
print_info "Step 9: Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 7788/tcp
sudo ufw --force enable
print_success "Firewall configured"

# Step 10: Start Backend with PM2
print_info "Step 10: Starting backend with PM2..."
cd ../backend

# Stop existing process if running
pm2 delete school-backend 2>/dev/null || true

# Start backend
pm2 start npm --name "school-backend" -- start
pm2 save
pm2 startup | tail -n 1 | bash

print_success "Backend started with PM2"

# Step 11: Create backup script
print_info "Step 11: Setting up backup script..."
sudo tee /root/backup-school-system.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump school_management2 > $BACKUP_DIR/db_$DATE.sql
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /root/school-system/backend/uploads /root/school-system/backend/Uploads
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
echo "Backup completed: $DATE"
EOF

sudo chmod +x /root/backup-school-system.sh
print_success "Backup script created"

# Final message
echo ""
echo "=========================================="
print_success "Deployment completed successfully!"
echo "=========================================="
echo ""
print_info "Access your application at: http://76.13.48.245"
echo ""
print_info "Useful commands:"
echo "  - View logs: pm2 logs school-backend"
echo "  - Restart: pm2 restart school-backend"
echo "  - Status: pm2 status"
echo "  - Nginx logs: tail -f /var/log/nginx/error.log"
echo ""
print_info "Next steps:"
echo "  1. Update database password in backend/.env"
echo "  2. Update JWT_SECRET in backend/.env"
echo "  3. Configure email settings in backend/.env"
echo "  4. Run database migrations"
echo "  5. Test the application"
echo ""
print_info "Run UPDATE_MACHINE_IP.sql to update biometric device IP in database"
echo ""
