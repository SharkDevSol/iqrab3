# VPS Deployment Guide - Complete Setup

## Your VPS Information
- **VPS IP**: 76.13.48.245
- **New Machine IP**: 192.168.1.2 (local network)
- **OS**: Ubuntu 24.04 LTS
- **Root Access**: ssh root@76.13.48.245

---

## STEP 1: Update Machine IP Address (Biometric Device)

### Files to Update for Machine IP Change

#### 1. Backend Environment File
**File**: `backend/.env`

Change line 21:
```env
# OLD
AI06_DEVICE_IP=192.168.1.201

# NEW
AI06_DEVICE_IP=192.168.1.2
```

#### 2. Database Configuration (if machine IP is stored)
Run this SQL query to update any stored machine IPs:

```sql
-- Update machine_config table
UPDATE machine_config 
SET ip_address = '192.168.1.2' 
WHERE ip_address = '192.168.1.201';

-- Update any other tables that might store the IP
UPDATE user_machine_mapping 
SET machine_ip = '192.168.1.2' 
WHERE machine_ip = '192.168.1.201';
```

---

## STEP 2: Prepare for VPS Deployment

### A. Create Production Environment File

**File**: `backend/.env.production`

```env
# Production Database Configuration
DATABASE_URL="postgresql://postgres:YOUR_SECURE_PASSWORD@localhost:5432/school_management2?schema=school_comms&timezone=Africa/Addis_Ababa"

DB_NAME=school_management2
DB_USER=postgres
DB_PASSWORD=YOUR_SECURE_PASSWORD
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration - CHANGE THIS TO A NEW SECURE KEY
JWT_SECRET="GENERATE_NEW_SECURE_KEY_HERE_AT_LEAST_64_CHARACTERS_LONG"
JWT_EXPIRES_IN=24h

# Security
NODE_ENV=production
HTTPS_ENABLED=true

# AI06 Biometric Device Configuration
AI06_WEBSOCKET_ENABLED=true
AI06_WEBSOCKET_PORT=7788
AI06_DEVICE_IP=192.168.1.2
AI06_DEVICE_PORT=80

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-school-email@gmail.com
SMTP_PASS=your-app-specific-password

# Server Configuration
PORT=5000
FRONTEND_URL=http://76.13.48.245
```

### B. Create Frontend Environment File

**File**: `APP/.env.production`

```env
VITE_API_URL=http://76.13.48.245:5000/api
VITE_SOCKET_URL=http://76.13.48.245:5000
```

---

## STEP 3: VPS Server Setup

### 1. Connect to VPS
```bash
ssh root@76.13.48.245
```

### 2. Update System
```bash
apt update && apt upgrade -y
```

### 3. Install Required Software

#### Install Node.js (v20 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # Should show v20.x
npm --version
```

#### Install PostgreSQL
```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

#### Install Nginx (Web Server)
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

#### Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 4. Setup PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE school_management2;
CREATE USER postgres WITH PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE school_management2 TO postgres;
\q
```

### 5. Configure Firewall

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Allow Backend Port
ufw allow 5000/tcp

# Allow WebSocket Port
ufw allow 7788/tcp

# Enable firewall
ufw enable
```

---

## STEP 4: Deploy Application to VPS

### 1. Upload Files to VPS

**Option A: Using SCP (from your local machine)**
```bash
# Compress your project
tar -czf school-system.tar.gz SCHOOLS/

# Upload to VPS
scp school-system.tar.gz root@76.13.48.245:/root/

# On VPS, extract
ssh root@76.13.48.245
cd /root
tar -xzf school-system.tar.gz
cd SCHOOLS
```

**Option B: Using Git (recommended)**
```bash
# On VPS
cd /root
git clone YOUR_REPOSITORY_URL school-system
cd school-system
```

### 2. Setup Backend

```bash
cd /root/school-system/backend

# Install dependencies
npm install

# Copy production environment
cp .env.production .env

# Edit .env with your actual passwords
nano .env

# Run database migrations
npm run migrate  # or your migration command

# Test backend
npm start
# Press Ctrl+C to stop after testing
```

### 3. Setup Frontend

```bash
cd /root/school-system/APP

# Install dependencies
npm install

# Build for production
npm run build

# This creates a 'dist' folder with optimized files
```

---

## STEP 5: Configure Nginx

### Create Nginx Configuration

**File**: `/etc/nginx/sites-available/school-system`

```nginx
server {
    listen 80;
    server_name 76.13.48.245;

    # Frontend - Serve built React app
    location / {
        root /root/school-system/APP/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
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
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket for real-time features
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads folder
    location /uploads {
        alias /root/school-system/backend/uploads;
        autoindex off;
    }

    location /Uploads {
        alias /root/school-system/backend/Uploads;
        autoindex off;
    }

    # Increase upload size limit
    client_max_body_size 50M;
}
```

### Enable the Site

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/school-system /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

## STEP 6: Start Application with PM2

### 1. Start Backend

```bash
cd /root/school-system/backend

# Start with PM2
pm2 start npm --name "school-backend" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it gives you
```

### 2. Monitor Application

```bash
# View logs
pm2 logs school-backend

# View status
pm2 status

# Restart if needed
pm2 restart school-backend

# Stop
pm2 stop school-backend
```

---

## STEP 7: Update Code References (Important!)

You need to update all hardcoded localhost references in your code. Here's a script to help:

### Create Update Script

**File**: `update-for-production.sh`

```bash
#!/bin/bash

# Update frontend API references
cd /root/school-system/APP/src

# Replace localhost:5000 with VPS IP
find . -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i 's|http://localhost:5000|http://76.13.48.245:5000|g' {} +

# Update AppContext
sed -i 's|http://localhost:5000/api/admin/branding|/api/admin/branding|g' context/AppContext.jsx
sed -i 's|http://localhost:5000/uploads/branding|/uploads/branding|g' context/AppContext.jsx

echo "Updated all references!"
```

**Better Approach**: Use environment variables everywhere:

Update `APP/src/utils/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || '';
```

---

## STEP 8: SSL Certificate (Optional but Recommended)

### Install Certbot for Free SSL

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate (requires domain name)
# If you have a domain pointing to 76.13.48.245:
certbot --nginx -d yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

---

## STEP 9: Backup Strategy

### Create Backup Script

**File**: `/root/backup-school-system.sh`

```bash
#!/bin/bash

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
sudo -u postgres pg_dump school_management2 > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /root/school-system/backend/uploads /root/school-system/backend/Uploads

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Setup Automatic Daily Backups

```bash
# Make script executable
chmod +x /root/backup-school-system.sh

# Add to crontab (runs daily at 2 AM)
crontab -e

# Add this line:
0 2 * * * /root/backup-school-system.sh >> /var/log/school-backup.log 2>&1
```

---

## STEP 10: Testing Checklist

After deployment, test these:

- [ ] Access frontend: http://76.13.48.245
- [ ] Login as admin
- [ ] Upload a file (test uploads folder)
- [ ] Check database connection
- [ ] Test biometric device connection (192.168.1.2)
- [ ] Test real-time features (WebSocket)
- [ ] Check all API endpoints
- [ ] Test mobile app installation
- [ ] Verify icon upload/display
- [ ] Check reports generation
- [ ] Test student/staff management

---

## Troubleshooting

### Backend not starting
```bash
pm2 logs school-backend
# Check for errors in logs
```

### Database connection issues
```bash
# Test PostgreSQL
sudo -u postgres psql -d school_management2

# Check if PostgreSQL is running
systemctl status postgresql
```

### Nginx errors
```bash
# Check Nginx logs
tail -f /var/log/nginx/error.log

# Test configuration
nginx -t
```

### Port already in use
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process
kill -9 PID
```

---

## Quick Commands Reference

```bash
# Restart everything
pm2 restart all
systemctl restart nginx

# View logs
pm2 logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Update application
cd /root/school-system
git pull  # if using git
cd backend && npm install
cd ../APP && npm install && npm run build
pm2 restart school-backend
systemctl reload nginx

# Check system resources
htop
df -h  # disk space
free -h  # memory
```

---

## Security Recommendations

1. **Change default passwords** in .env file
2. **Setup firewall** properly (ufw)
3. **Enable SSL** with Let's Encrypt
4. **Regular backups** (automated)
5. **Update system** regularly: `apt update && apt upgrade`
6. **Monitor logs** for suspicious activity
7. **Disable root SSH** after creating sudo user
8. **Use strong JWT secret** (64+ characters)
9. **Limit upload file sizes** in Nginx
10. **Setup fail2ban** to prevent brute force attacks

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `/var/log/nginx/error.log`
3. Check PostgreSQL logs: `/var/log/postgresql/`
4. Verify firewall: `ufw status`
5. Test ports: `netstat -tulpn | grep LISTEN`
