# Hostinger VPS Deployment Guide for Skoolific System
## Domain: iqrab3.skoolific.com

---

## 🔍 PRE-DEPLOYMENT CHECKLIST

### ✅ System Analysis Complete
Your system has been analyzed and here's what was found:

#### System Architecture:
- **Backend**: Node.js/Express (Port 5000)
- **Frontend**: React/Vite (Build to static files)
- **Database**: PostgreSQL (Port 5432)
- **WebSocket**: Socket.IO + AI06 Device Service (Port 7788)
- **Real-time Features**: Attendance monitoring, chat, notifications

#### Critical Components:
1. **AI06 Biometric Device Integration** (Port 7788)
2. **Auto-marker Services** (Staff & Student attendance)
3. **Guardian Notification Service**
4. **Device User Persistence Services**
5. **Socket.IO Real-time Communication**

---

## ⚠️ SECURITY ISSUES FOUND

### 🔴 CRITICAL - Must Fix Before Deployment:

1. **Exposed Database Password in Code**
   - File: `backend/config/db.js` (line 7)
   - File: `check-guardian-usernames.js` (line 7)
   - **Action Required**: Remove hardcoded passwords, use only environment variables

2. **Weak JWT Secret**
   - Current: Visible in `.env` file
   - **Action Required**: Generate a strong random secret (64+ characters)

3. **Default Database Credentials**
   - Username: `postgres`
   - Password: `12345678`
   - **Action Required**: Change to strong credentials

4. **SMTP Credentials Not Configured**
   - Current: `your-email@gmail.com` / `your-app-password`
   - **Action Required**: Set up real email service for notifications

5. **CORS Configuration**
   - Currently allows all localhost origins
   - **Action Required**: Restrict to production domain only

---

## 📋 REQUIRED CHANGES FOR PRODUCTION

### 1. Environment Variables (.env files)

#### Backend `.env` (MUST UPDATE):
```env
# Database Configuration - UPDATE WITH VPS CREDENTIALS
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_STRONG_PASSWORD@localhost:5432/school_management2?schema=school_comms&timezone=Africa/Addis_Ababa"

DB_NAME=school_management2
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration - GENERATE NEW SECRET
JWT_SECRET="GENERATE_A_RANDOM_64_CHARACTER_STRING_HERE"
JWT_EXPIRES_IN=24h

# Security
NODE_ENV=production
HTTPS_ENABLED=true  # Enable if using SSL

# Server Configuration
PORT=5000
FRONTEND_URL=https://iqrab3.skoolific.com

# AI06 Biometric Device Configuration
AI06_WEBSOCKET_ENABLED=true
AI06_WEBSOCKET_PORT=7788
AI06_DEVICE_IP=YOUR_DEVICE_IP  # Update with actual device IP
AI06_DEVICE_PORT=80

# Email Configuration - REQUIRED FOR NOTIFICATIONS
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-actual-app-password

# SSL Configuration (if using HTTPS)
SSL_KEY_PATH=/path/to/ssl/private.key
SSL_CERT_PATH=/path/to/ssl/certificate.crt
```

#### Frontend `.env.production` (CREATE THIS FILE):
```env
# Production API URL - Use your domain
VITE_API_URL=https://iqrab3.skoolific.com/api

# WebSocket URL
VITE_WS_URL=wss://iqrab3.skoolific.com

# App URL
VITE_APP_URL=https://iqrab3.skoolific.com
```

### 2. Code Changes Required

#### A. Remove Hardcoded Passwords
**File: `backend/config/db.js`**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,  // Remove hardcoded fallback
  port: process.env.DB_PORT,
});

module.exports = pool;
```

#### B. Update CORS Configuration
**File: `backend/server.js` (around line 230)**
```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://iqrab3.skoolific.com']  // Only your domain
  : ['http://localhost:3000', 'http://localhost:5173'];
```

#### C. Remove Hardcoded API URLs in Frontend
Search and replace all instances of `http://localhost:5000` in frontend files with the API utility:
- Use: `import api from '../../utils/api'` instead of hardcoded URLs
- Files affected: 20+ files (see search results above)

---

## 🗄️ DATABASE SETUP SCRIPTS

### Required SQL Scripts to Run (IN ORDER):

1. **Initial Database Setup**
   ```bash
   # Create database
   createdb school_management2
   ```

2. **Run Migration Scripts** (Backend handles most automatically)
   - The system has auto-initialization on startup
   - File: `backend/config/initDatabase.js`
   - File: `backend/services/attendanceSystemInitializer.js`

3. **Manual Scripts (if needed)**:
   - `backend/database/dual_mode_attendance_schema.sql` - Attendance system
   - `backend/database/staff_attendance_schema.sql` - Staff attendance
   - `ADD_IS_ACTIVE_COLUMN.sql` - Student activation feature
   - `ADD_STAFF_SPECIFIC_TIMING.sql` - Staff timing overrides

**Note**: Most migrations run automatically via `validate-startup.js` and auto-setup utilities.

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Prepare VPS Environment

```bash
# SSH into your Hostinger VPS
ssh root@YOUR_VPS_IP

# Update system
apt update && apt upgrade -y

# Install Node.js (v18 or higher)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (for SSL)
apt install -y certbot python3-certbot-nginx
```

### Step 2: Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE school_management2;
CREATE USER your_db_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE school_management2 TO your_db_user;
\q

# Configure PostgreSQL to accept connections
nano /etc/postgresql/*/main/pg_hba.conf
# Add: local   all   your_db_user   md5

# Restart PostgreSQL
systemctl restart postgresql
```

### Step 3: Upload Project Files

```bash
# Create project directory
mkdir -p /var/www/skoolific
cd /var/www/skoolific

# Upload files (use SCP, SFTP, or Git)
# Option 1: Using Git (recommended)
git clone YOUR_REPOSITORY_URL .

# Option 2: Using SCP from local machine
# scp -r /path/to/project/* root@YOUR_VPS_IP:/var/www/skoolific/

# Create Uploads directory
mkdir -p /var/www/skoolific/Uploads
chmod 755 /var/www/skoolific/Uploads
```

### Step 4: Configure Backend

```bash
cd /var/www/skoolific/backend

# Create production .env file
nano .env
# Paste the production environment variables (see above)

# Install dependencies
npm install --production

# Run database migrations (automatic on first start)
npm run prestart
```

### Step 5: Build Frontend

```bash
cd /var/www/skoolific/APP

# Create production .env file
nano .env.production
# Paste the production environment variables (see above)

# Install dependencies
npm install

# Build for production
npm run build
# This creates a 'dist' folder with static files
```

### Step 6: Configure Nginx

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/skoolific

# Paste this configuration:
```

```nginx
server {
    listen 80;
    server_name iqrab3.skoolific.com;

    # Frontend - serve static files
    location / {
        root /var/www/skoolific/APP/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for long-running requests
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }

    # WebSocket for Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploads directory
    location /uploads/ {
        alias /var/www/skoolific/Uploads/;
        autoindex off;
    }
    
    location /Uploads/ {
        alias /var/www/skoolific/Uploads/;
        autoindex off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size (for file uploads)
    client_max_body_size 10M;
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/skoolific /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 7: Setup SSL Certificate

```bash
# Get SSL certificate from Let's Encrypt
certbot --nginx -d iqrab3.skoolific.com

# Follow the prompts
# Certbot will automatically configure HTTPS in Nginx

# Test auto-renewal
certbot renew --dry-run
```

### Step 8: Start Backend with PM2

```bash
cd /var/www/skoolific/backend

# Start with PM2
pm2 start server.js --name skoolific-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it gives you

# Monitor logs
pm2 logs skoolific-backend
```

### Step 9: Configure Firewall

```bash
# Allow necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 5432  # PostgreSQL (only if external access needed)
ufw allow 7788  # AI06 Device (only from device IP)

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## 🔧 POST-DEPLOYMENT CONFIGURATION

### 1. DNS Configuration (Hostinger Panel)

1. Log into Hostinger control panel
2. Go to DNS Zone Editor
3. Add/Update A Record:
   - **Type**: A
   - **Name**: iqrab3
   - **Points to**: YOUR_VPS_IP
   - **TTL**: 3600

### 2. AI06 Device Configuration

Update device settings to point to your VPS:
- **Server IP**: YOUR_VPS_IP or iqrab3.skoolific.com
- **Server Port**: 7788
- **Server Registration**: YES

### 3. Email Service Setup

For Gmail SMTP:
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env` with app password

### 4. Test All Services

```bash
# Check backend health
curl https://iqrab3.skoolific.com/api/health

# Check PM2 status
pm2 status

# Check Nginx status
systemctl status nginx

# Check PostgreSQL
systemctl status postgresql

# View backend logs
pm2 logs skoolific-backend

# View Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 🔄 AUTOMATIC SERVICES

These services start automatically with the backend:

1. **HR Attendance Auto-Marker** - Marks absent staff daily
2. **Student Attendance Auto-Marker** - Marks absent students daily
3. **Guardian Notification Service** - Sends email notifications
4. **Device User Monitoring** - Syncs biometric device users (every 5 min)
5. **Automatic Backup Service** - Backs up device users (every 6 hours)
6. **AI06 WebSocket Service** - Listens for device connections (port 7788)

**No manual scripts needed** - all services are managed by PM2.

---

## 📊 MONITORING & MAINTENANCE

### Daily Checks:
```bash
# Check PM2 status
pm2 status

# Check disk space
df -h

# Check memory usage
free -h

# Check backend logs for errors
pm2 logs skoolific-backend --lines 100
```

### Weekly Maintenance:
```bash
# Update system packages
apt update && apt upgrade -y

# Restart services if needed
pm2 restart skoolific-backend

# Check SSL certificate expiry
certbot certificates

# Backup database
pg_dump -U your_db_user school_management2 > backup_$(date +%Y%m%d).sql
```

### PM2 Commands:
```bash
pm2 list                    # List all processes
pm2 restart skoolific-backend  # Restart backend
pm2 stop skoolific-backend     # Stop backend
pm2 logs skoolific-backend     # View logs
pm2 monit                   # Monitor resources
```

---

## 🐛 TROUBLESHOOTING

### Backend won't start:
```bash
# Check logs
pm2 logs skoolific-backend

# Common issues:
# 1. Database connection - check .env credentials
# 2. Port already in use - kill process on port 5000
# 3. Missing dependencies - run npm install
```

### Frontend not loading:
```bash
# Check Nginx configuration
nginx -t

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Rebuild frontend
cd /var/www/skoolific/APP
npm run build
```

### Database connection errors:
```bash
# Check PostgreSQL status
systemctl status postgresql

# Check connection
psql -U your_db_user -d school_management2

# Check pg_hba.conf
nano /etc/postgresql/*/main/pg_hba.conf
```

### AI06 Device not connecting:
```bash
# Check if port 7788 is open
netstat -tulpn | grep 7788

# Check firewall
ufw status

# Check backend logs
pm2 logs skoolific-backend | grep AI06
```

---

## 📝 IMPORTANT NOTES

1. **Backup Strategy**: Set up automated database backups
2. **Monitoring**: Consider using monitoring tools (PM2 Plus, New Relic, etc.)
3. **Security**: Regularly update system packages and Node.js
4. **Performance**: Monitor resource usage and scale if needed
5. **Logs**: Rotate logs to prevent disk space issues

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] VPS environment setup complete
- [ ] PostgreSQL installed and configured
- [ ] Strong database credentials set
- [ ] JWT secret generated (64+ characters)
- [ ] Backend .env configured
- [ ] Frontend .env.production configured
- [ ] Hardcoded passwords removed from code
- [ ] CORS restricted to production domain
- [ ] Dependencies installed (backend & frontend)
- [ ] Frontend built successfully
- [ ] Nginx configured and tested
- [ ] SSL certificate installed
- [ ] PM2 running backend
- [ ] Firewall configured
- [ ] DNS A record added
- [ ] AI06 device configured
- [ ] Email SMTP configured
- [ ] All services tested
- [ ] Monitoring setup
- [ ] Backup strategy implemented

---

## 🆘 SUPPORT

If you encounter issues:
1. Check PM2 logs: `pm2 logs skoolific-backend`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Check system resources: `htop` or `pm2 monit`
4. Review this guide's troubleshooting section

---

**Last Updated**: Ready for deployment
**System Version**: Current
**Target Domain**: iqrab3.skoolific.com
