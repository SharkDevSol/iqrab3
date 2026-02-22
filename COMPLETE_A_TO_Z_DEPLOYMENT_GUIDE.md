# 🚀 Complete A-Z Deployment Guide for iqrab3.skoolific.com

## Your VPS Information (From Screenshots):
- **VPS IP**: 76.13.48.245
- **Domain**: skoolific.com
- **Subdomain**: iqrab3.skoolific.com
- **OS**: Ubuntu 24.04 LTS
- **Location**: France - Paris
- **Root Access**: ssh root@76.13.48.245

---

# PART 1: CREATE SUBDOMAIN (5 Minutes)

## Step 1: Add DNS A Record in Hostinger

1. **Go to DNS Manager**
   - In Hostinger panel, click "DNS / Nameservers" (left sidebar)
   - You should see the DNS records page

2. **Add A Record for Subdomain**
   - Click "Add Record" button
   - Fill in these details:
     - **Type**: A
     - **Name**: iqrab3
     - **Points to**: 76.13.48.245
     - **TTL**: 14400 (or leave default)
   - Click "Add Record"

3. **Verify DNS Record**
   - You should see a new record:
     ```
     Type: A
     Name: iqrab3
     Points to: 76.13.48.245
     ```

4. **Wait for DNS Propagation** (5-30 minutes)
   - DNS changes take time to propagate
   - You can check status at: https://dnschecker.org
   - Enter: iqrab3.skoolific.com

✅ **Subdomain Created!** Now let's setup the VPS.

---

# PART 2: CONNECT TO VPS (2 Minutes)

## Step 2: SSH into Your VPS

### Option A: Using Hostinger Terminal (Easiest)
1. In Hostinger panel, click "Terminal" button (top right)
2. It will open a web-based terminal
3. You're now connected as root!

### Option B: Using Windows PowerShell
1. Open PowerShell on your computer
2. Run this command:
   ```powershell
   ssh root@76.13.48.245
   ```
3. Enter your root password when prompted
4. Type "yes" if asked about fingerprint

✅ **Connected to VPS!** You should see a terminal prompt.

---

# PART 3: INSTALL REQUIREMENTS (10 Minutes)

## Step 3: Update System

```bash
# Update package list
apt update

# Upgrade installed packages
apt upgrade -y
```

## Step 4: Install Node.js 18

```bash
# Download Node.js setup script
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Install Node.js
apt install -y nodejs

# Verify installation
node --version
npm --version
```

You should see: Node v18.x.x and npm 9.x.x or higher

## Step 5: Install PostgreSQL

```bash
# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
systemctl start postgresql
systemctl enable postgresql

# Verify it's running
systemctl status postgresql
```

Press 'q' to exit the status view.

## Step 6: Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

## Step 7: Install Nginx (Web Server)

```bash
# Install Nginx
apt install -y nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Verify it's running
systemctl status nginx
```

## Step 8: Install Certbot (SSL Certificates)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

✅ **All Requirements Installed!**

---

# PART 4: SETUP DATABASE (5 Minutes)

## Step 9: Create PostgreSQL Database and User

```bash
# Switch to postgres user
sudo -u postgres psql
```

You'll see a `postgres=#` prompt. Now run these commands:

```sql
-- Create database
CREATE DATABASE school_management2;

-- Create user with strong password (CHANGE THIS PASSWORD!)
CREATE USER skoolific_user WITH ENCRYPTED PASSWORD 'Sk00l!f1c#2024$SecurePass';

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE school_management2 TO skoolific_user;

-- Grant schema privileges
\c school_management2
GRANT ALL ON SCHEMA public TO skoolific_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skoolific_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skoolific_user;

-- Exit PostgreSQL
\q
```

✅ **Database Created!**

**IMPORTANT**: Remember your database credentials:
- **DB_USER**: skoolific_user
- **DB_PASSWORD**: Sk00l!f1c#2024$SecurePass (or whatever you chose)

---

# PART 5: UPLOAD PROJECT FILES (10 Minutes)

## Step 10: Create Project Directory

```bash
# Create directory
mkdir -p /var/www/skoolific

# Go to directory
cd /var/www/skoolific
```

## Step 11: Upload Your Project Files

You have 3 options to upload files:

### Option A: Using Git (Recommended if you have a repository)

```bash
# If you have Git repository
git clone YOUR_REPOSITORY_URL .
```

### Option B: Using FileZilla (Easiest for Windows)

1. **Download FileZilla**: https://filezilla-project.org/download.php?type=client
2. **Connect to VPS**:
   - Host: sftp://76.13.48.245
   - Username: root
   - Password: your_root_password
   - Port: 22
3. **Upload Files**:
   - Left side: Your local project folder
   - Right side: Navigate to /var/www/skoolific
   - Drag and drop all project files to the right side
   - Wait for upload to complete (may take 10-20 minutes)

### Option C: Using WinSCP (Alternative)

1. **Download WinSCP**: https://winscp.net/eng/download.php
2. **Connect**:
   - File protocol: SFTP
   - Host name: 76.13.48.245
   - Port: 22
   - User name: root
   - Password: your_root_password
3. **Upload**: Drag files from left to /var/www/skoolific on right

### Option D: Using Hostinger File Manager

1. In Hostinger panel, go to "File Manager"
2. Navigate to /var/www/skoolific
3. Upload files using the upload button
4. This might be slow for large projects

✅ **Files Uploaded!**

## Step 12: Verify Files Are Uploaded

```bash
# Check files are there
cd /var/www/skoolific
ls -la

# You should see:
# - backend/
# - APP/
# - Uploads/
# - Various .md files
```

---

# PART 6: CONFIGURE BACKEND (5 Minutes)

## Step 13: Setup Backend Environment

```bash
# Go to backend directory
cd /var/www/skoolific/backend

# Copy VPS environment template
cp .env.vps .env

# Edit the .env file
nano .env
```

## Step 14: Update .env File

In the nano editor, update these 4 values:

```env
# Update these lines:
DB_USER=skoolific_user
DB_PASSWORD=Sk00l!f1c#2024$SecurePass

# Update these with your Gmail:
SMTP_USER=your-school-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

**To get Gmail App Password**:
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Factor Authentication if not enabled
3. Generate App Password
4. Copy the 16-character password
5. Paste it in SMTP_PASS

**Save and Exit**:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

## Step 15: Install Backend Dependencies

```bash
# Make sure you're in backend directory
cd /var/www/skoolific/backend

# Install dependencies (this takes 2-5 minutes)
npm install --production

# You should see "added XXX packages"
```

✅ **Backend Configured!**

---

# PART 7: BUILD FRONTEND (5 Minutes)

## Step 16: Build Frontend for Production

```bash
# Go to APP directory
cd /var/www/skoolific/APP

# Install dependencies (this takes 2-5 minutes)
npm install

# Build for production (uses .env.production automatically)
npm run build

# You should see "✓ built in XXXms"
```

This creates a `dist` folder with your production-ready frontend.

## Step 17: Verify Build

```bash
# Check dist folder exists
ls -la dist

# You should see index.html and assets folder
```

✅ **Frontend Built!**

---

# PART 8: CONFIGURE NGINX (5 Minutes)

## Step 18: Create Nginx Configuration

```bash
# Create Nginx config file
nano /etc/nginx/sites-available/skoolific
```

## Step 19: Paste This Configuration

Copy and paste this EXACT configuration:

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
        
        # Increase timeouts
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

    # Max upload size
    client_max_body_size 10M;
}
```

**Save and Exit**:
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

## Step 20: Enable the Site

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/skoolific /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# You should see "syntax is ok" and "test is successful"
```

## Step 21: Restart Nginx

```bash
# Restart Nginx
systemctl restart nginx

# Check status
systemctl status nginx
```

Press 'q' to exit.

✅ **Nginx Configured!**

---

# PART 9: GET SSL CERTIFICATE (3 Minutes)

## Step 22: Install SSL Certificate

```bash
# Run Certbot
certbot --nginx -d iqrab3.skoolific.com
```

**Follow the prompts**:
1. Enter your email address
2. Agree to Terms of Service (type 'Y')
3. Choose whether to share email (type 'Y' or 'N')
4. Certbot will automatically configure HTTPS

You should see: "Successfully deployed certificate"

## Step 23: Test Auto-Renewal

```bash
# Test renewal
certbot renew --dry-run

# Should see "Congratulations, all simulated renewals succeeded"
```

✅ **SSL Certificate Installed!** Your site now has HTTPS.

---

# PART 10: START BACKEND (3 Minutes)

## Step 24: Create Uploads Directory

```bash
# Create Uploads directory if it doesn't exist
mkdir -p /var/www/skoolific/Uploads
chmod 755 /var/www/skoolific/Uploads
```

## Step 25: Start Backend with PM2

```bash
# Go to backend directory
cd /var/www/skoolific/backend

# Start backend with PM2
pm2 start server.js --name skoolific-backend

# You should see a table showing the process running
```

## Step 26: Save PM2 Configuration

```bash
# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Copy and run the command it gives you (it will be something like):
# systemctl enable pm2-root
```

## Step 27: Check Backend Logs

```bash
# View logs
pm2 logs skoolific-backend

# Press Ctrl+C to exit logs
```

You should see:
- "Server running on 0.0.0.0:5000"
- "AI06 WebSocket Service enabled"
- Various initialization messages

✅ **Backend Running!**

---

# PART 11: CONFIGURE FIREWALL (2 Minutes)

## Step 28: Setup UFW Firewall

```bash
# Allow SSH (IMPORTANT - don't lock yourself out!)
ufw allow 22

# Allow HTTP
ufw allow 80

# Allow HTTPS
ufw allow 443

# Allow AI06 Device port
ufw allow 7788

# Enable firewall
ufw enable

# Type 'y' to confirm

# Check status
ufw status
```

You should see all ports listed as ALLOW.

✅ **Firewall Configured!**

---

# PART 12: TEST YOUR DEPLOYMENT (5 Minutes)

## Step 29: Test Backend API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

## Step 30: Test From Browser

Open your browser and visit:

1. **Frontend**: https://iqrab3.skoolific.com
   - You should see your school management system login page

2. **API Health**: https://iqrab3.skoolific.com/api/health
   - Should show: `{"status":"OK","message":"Server is running"}`

## Step 31: Check PM2 Status

```bash
# Check PM2 status
pm2 status

# Should show skoolific-backend as "online"

# View logs
pm2 logs skoolific-backend --lines 50
```

## Step 32: Check Nginx Logs

```bash
# Check for errors
tail -f /var/log/nginx/error.log

# Press Ctrl+C to exit
```

✅ **Everything Working!**

---

# PART 13: CONFIGURE AI06 DEVICE (5 Minutes)

## Step 33: Update AI06 Device Settings

On your AI06 biometric device:

1. **Go to Device Settings**
2. **Find Network/Server Settings**
3. **Update these values**:
   - **Server IP**: 76.13.48.245 (or iqrab3.skoolific.com)
   - **Server Port**: 7788
   - **Server Registration**: YES/Enabled
   - **Protocol**: WebSocket or TCP

4. **Save and Restart Device**

## Step 34: Test Device Connection

```bash
# Check if port 7788 is listening
netstat -tulpn | grep 7788

# Should show: tcp 0.0.0.0:7788 LISTEN

# Watch backend logs for device connection
pm2 logs skoolific-backend
```

When device connects, you should see:
- "AI06 device connected"
- Device IP address

✅ **Device Connected!**

---

# PART 14: FINAL VERIFICATION (5 Minutes)

## Step 35: Complete System Check

```bash
# Check all services
echo "=== PM2 Status ==="
pm2 status

echo "=== Nginx Status ==="
systemctl status nginx | grep Active

echo "=== PostgreSQL Status ==="
systemctl status postgresql | grep Active

echo "=== Firewall Status ==="
ufw status

echo "=== Disk Space ==="
df -h

echo "=== Memory Usage ==="
free -h
```

## Step 36: Test All Features

1. **Login to System**
   - Go to: https://iqrab3.skoolific.com
   - Login with admin credentials

2. **Test Attendance**
   - Check if AI06 device is connected
   - Test check-in/check-out

3. **Test Real-time Features**
   - Check if live attendance updates work
   - Test notifications

4. **Test File Uploads**
   - Try uploading a student photo
   - Check if it appears correctly

✅ **System Fully Operational!**

---

# PART 15: MAINTENANCE COMMANDS

## Useful Commands for Daily Use

### Check Backend Status
```bash
pm2 status
pm2 logs skoolific-backend
```

### Restart Backend
```bash
pm2 restart skoolific-backend
```

### Stop Backend
```bash
pm2 stop skoolific-backend
```

### View Nginx Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Restart Nginx
```bash
systemctl restart nginx
```

### Check Database
```bash
sudo -u postgres psql -d school_management2
```

### Backup Database
```bash
sudo -u postgres pg_dump school_management2 > backup_$(date +%Y%m%d).sql
```

### Update Code (if you make changes)
```bash
# Go to project directory
cd /var/www/skoolific

# Pull latest changes (if using Git)
git pull

# Rebuild frontend
cd APP
npm run build

# Restart backend
pm2 restart skoolific-backend
```

---

# TROUBLESHOOTING

## Problem: Site Not Loading

**Check DNS**:
```bash
nslookup iqrab3.skoolific.com
# Should return: 76.13.48.245
```

**Check Nginx**:
```bash
systemctl status nginx
nginx -t
```

## Problem: Backend Not Starting

**Check Logs**:
```bash
pm2 logs skoolific-backend
```

**Common Issues**:
- Database connection failed → Check backend/.env credentials
- Port already in use → Kill process on port 5000
- Missing dependencies → Run `npm install` again

## Problem: Database Connection Error

**Test Connection**:
```bash
sudo -u postgres psql -d school_management2 -U skoolific_user
```

**Reset Password**:
```bash
sudo -u postgres psql
ALTER USER skoolific_user WITH PASSWORD 'new_password';
\q
```

## Problem: SSL Certificate Issues

**Renew Certificate**:
```bash
certbot renew
systemctl restart nginx
```

## Problem: AI06 Device Not Connecting

**Check Port**:
```bash
netstat -tulpn | grep 7788
```

**Check Firewall**:
```bash
ufw status | grep 7788
```

**Check Backend Logs**:
```bash
pm2 logs skoolific-backend | grep AI06
```

---

# SUMMARY CHECKLIST

## ✅ Deployment Complete When:

- [ ] DNS A record added (iqrab3 → 76.13.48.245)
- [ ] All requirements installed (Node.js, PostgreSQL, Nginx, PM2)
- [ ] Database created with strong password
- [ ] Project files uploaded to /var/www/skoolific
- [ ] Backend .env configured (4 values updated)
- [ ] Backend dependencies installed
- [ ] Frontend built successfully
- [ ] Nginx configured and running
- [ ] SSL certificate installed
- [ ] Backend running with PM2
- [ ] Firewall configured
- [ ] Site accessible at https://iqrab3.skoolific.com
- [ ] API health check working
- [ ] AI06 device configured and connected
- [ ] All features tested

---

# 🎉 CONGRATULATIONS!

Your Skoolific School Management System is now live at:

**https://iqrab3.skoolific.com**

## What's Running:

✅ Frontend (React/Vite)
✅ Backend API (Node.js/Express)
✅ Database (PostgreSQL)
✅ Real-time Services (Socket.IO)
✅ AI06 Biometric Device Integration
✅ Auto-marker Services
✅ Guardian Notifications
✅ SSL Certificate (HTTPS)

## Next Steps:

1. **Change Default Passwords** in the system
2. **Add Your School Data** (students, staff, classes)
3. **Configure AI06 Device** with server details
4. **Test All Features** thoroughly
5. **Setup Regular Backups** (database + files)

## Support:

- Check logs: `pm2 logs skoolific-backend`
- Monitor system: `pm2 monit`
- View documentation: Files in project root

---

**Deployment Date**: $(date)
**Domain**: https://iqrab3.skoolific.com
**VPS IP**: 76.13.48.245
**Status**: ✅ LIVE & OPERATIONAL
