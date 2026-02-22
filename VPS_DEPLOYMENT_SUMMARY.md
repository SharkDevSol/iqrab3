# VPS Deployment Summary - Quick Reference

## 🎯 Your System Overview

**Domain**: iqrab3.skoolific.com  
**System Type**: School Management System (Skoolific)  
**Tech Stack**: Node.js + React + PostgreSQL + Socket.IO

---

## ⚠️ CRITICAL SECURITY ISSUES (MUST FIX!)

### 1. Hardcoded Passwords
- **Location**: `backend/config/db.js` line 7
- **Location**: `check-guardian-usernames.js` line 7
- **Current**: `12345678` (visible in code)
- **Action**: Remove hardcoded values, use only environment variables

### 2. Weak Database Credentials
- **Username**: `postgres` (default)
- **Password**: `12345678` (very weak)
- **Action**: Create strong credentials on VPS

### 3. Exposed JWT Secret
- **Current**: Visible in `.env` file
- **Action**: Generate new 64+ character random string

### 4. SMTP Not Configured
- **Current**: Placeholder values
- **Action**: Set up real Gmail App Password

### 5. Hardcoded API URLs
- **Issue**: 20+ files have `http://localhost:5000` hardcoded
- **Action**: Use API utility instead (already exists in `APP/src/utils/api.js`)

---

## 🔧 REQUIRED CHANGES BEFORE DEPLOYMENT

### Backend Changes:

1. **Update `backend/.env`** (use template: `backend/.env.production.template`)
   - Strong DB password
   - New JWT secret (64+ chars)
   - Real SMTP credentials
   - Production domain

2. **Fix `backend/config/db.js`**
   ```javascript
   // REMOVE THIS LINE:
   password: process.env.DB_PASSWORD || '12345678',
   
   // REPLACE WITH:
   password: process.env.DB_PASSWORD,
   ```

3. **Update `backend/server.js` CORS** (line ~230)
   ```javascript
   const allowedOrigins = process.env.NODE_ENV === 'production' 
     ? ['https://iqrab3.skoolific.com']  // Only your domain
     : ['http://localhost:3000', 'http://localhost:5173'];
   ```

### Frontend Changes:

1. **Create `APP/.env.production`**
   ```env
   VITE_API_URL=https://iqrab3.skoolific.com/api
   VITE_WS_URL=wss://iqrab3.skoolific.com
   VITE_APP_URL=https://iqrab3.skoolific.com
   ```

2. **Replace hardcoded URLs** (optional but recommended)
   - Files affected: `TeacherClassAttendance.jsx`, `StudentFaultsS.jsx`, `Setting.jsx`, etc.
   - Replace `http://localhost:5000` with API utility

---

## 🚀 DEPLOYMENT PROCESS (SIMPLIFIED)

### On Your VPS:

```bash
# 1. Install requirements
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs postgresql nginx certbot python3-certbot-nginx
npm install -g pm2

# 2. Setup PostgreSQL
sudo -u postgres psql
CREATE DATABASE school_management2;
CREATE USER your_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE school_management2 TO your_user;
\q

# 3. Upload your project
mkdir -p /var/www/skoolific
# Upload files here (use Git, SCP, or FTP)

# 4. Configure backend
cd /var/www/skoolific/backend
nano .env  # Paste production config
npm install --production

# 5. Build frontend
cd /var/www/skoolific/APP
nano .env.production  # Paste production config
npm install
npm run build

# 6. Setup Nginx (see full guide for config)
nano /etc/nginx/sites-available/skoolific
ln -s /etc/nginx/sites-available/skoolific /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 7. Get SSL certificate
certbot --nginx -d iqrab3.skoolific.com

# 8. Start backend with PM2
cd /var/www/skoolific/backend
pm2 start server.js --name skoolific-backend
pm2 save
pm2 startup

# 9. Configure firewall
ufw allow 22,80,443,7788/tcp
ufw enable
```

### DNS Configuration (Hostinger):
- Type: A Record
- Name: iqrab3
- Points to: YOUR_VPS_IP
- TTL: 3600

---

## 📋 NO MANUAL SCRIPTS NEEDED!

Your system has **automatic initialization**:
- ✅ Database tables created automatically on first start
- ✅ Migrations run automatically via `validate-startup.js`
- ✅ Auto-marker services start automatically
- ✅ Guardian notifications start automatically
- ✅ Device sync services start automatically

**Just start the backend with PM2 and everything initializes!**

---

## 🔌 PORTS REQUIRED

| Port | Service | Firewall |
|------|---------|----------|
| 22 | SSH | Open |
| 80 | HTTP | Open |
| 443 | HTTPS | Open |
| 5000 | Backend API | Internal only (Nginx proxy) |
| 5432 | PostgreSQL | Internal only |
| 7788 | AI06 Device | Open (from device IP only) |

---

## 🎛️ AUTOMATIC SERVICES

These start automatically with the backend (no manual intervention):

1. **HR Attendance Auto-Marker** - Marks absent staff daily
2. **Student Attendance Auto-Marker** - Marks absent students daily  
3. **Guardian Notification Service** - Sends email notifications
4. **Device User Monitoring** - Syncs biometric device (every 5 min)
5. **Automatic Backup Service** - Backs up device users (every 6 hours)
6. **AI06 WebSocket Service** - Listens for device (port 7788)

**Managed by PM2** - restarts automatically if crashes.

---

## ✅ DEPLOYMENT CHECKLIST

**Before Deployment:**
- [ ] Run `PREPARE_FOR_VPS.bat` to generate JWT secret
- [ ] Update `backend/.env` with production values
- [ ] Remove hardcoded passwords from code
- [ ] Create `APP/.env.production`
- [ ] Update CORS configuration
- [ ] Test build locally: `npm run build` in APP folder

**On VPS:**
- [ ] Install Node.js, PostgreSQL, Nginx, PM2
- [ ] Create database and user with strong password
- [ ] Upload project files
- [ ] Install dependencies (backend & frontend)
- [ ] Build frontend
- [ ] Configure Nginx
- [ ] Get SSL certificate
- [ ] Start backend with PM2
- [ ] Configure firewall

**After Deployment:**
- [ ] Add DNS A record in Hostinger
- [ ] Test: `https://iqrab3.skoolific.com`
- [ ] Test API: `https://iqrab3.skoolific.com/api/health`
- [ ] Configure AI06 device with VPS IP
- [ ] Test attendance system
- [ ] Monitor PM2 logs: `pm2 logs skoolific-backend`

---

## 📚 DOCUMENTATION FILES

1. **HOSTINGER_VPS_DEPLOYMENT_GUIDE.md** - Complete step-by-step guide
2. **PREPARE_FOR_VPS.bat** - Security preparation script
3. **backend/.env.production.template** - Production environment template
4. **VPS_DEPLOYMENT_SUMMARY.md** - This quick reference

---

## 🆘 QUICK TROUBLESHOOTING

**Backend won't start:**
```bash
pm2 logs skoolific-backend
# Check for database connection errors
```

**Frontend shows blank page:**
```bash
# Check Nginx logs
tail -f /var/log/nginx/error.log

# Rebuild frontend
cd /var/www/skoolific/APP && npm run build
```

**Database connection failed:**
```bash
# Test connection
psql -U your_user -d school_management2

# Check credentials in backend/.env
```

**AI06 device not connecting:**
```bash
# Check if port 7788 is listening
netstat -tulpn | grep 7788

# Check firewall
ufw status

# Check backend logs
pm2 logs skoolific-backend | grep AI06
```

---

## 📞 SUPPORT COMMANDS

```bash
# Check all services
pm2 status
systemctl status nginx
systemctl status postgresql

# View logs
pm2 logs skoolific-backend
tail -f /var/log/nginx/error.log

# Restart services
pm2 restart skoolific-backend
systemctl restart nginx

# Monitor resources
pm2 monit
htop
```

---

**Ready to deploy!** Follow the detailed guide in `HOSTINGER_VPS_DEPLOYMENT_GUIDE.md`
