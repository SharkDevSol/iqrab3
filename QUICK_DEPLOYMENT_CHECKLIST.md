# Quick Deployment Checklist

## ✅ Pre-Deployment (On Your Local Machine)

### 1. Update Machine IP Address
- [x] Updated `backend/.env` - Changed AI06_DEVICE_IP to `192.168.1.2`
- [ ] Run `UPDATE_MACHINE_IP.sql` on your database to update stored IPs

### 2. Prepare Files
- [x] Created `backend/.env.production` with VPS settings
- [x] Created `APP/.env.production` with VPS API URL
- [ ] Update passwords in `.env.production`:
  - [ ] DB_PASSWORD (change from default)
  - [ ] JWT_SECRET (generate new 64+ character key)
  - [ ] SMTP credentials (if using email)

### 3. Test Locally
- [ ] Test with new machine IP (192.168.1.2)
- [ ] Verify biometric device connection
- [ ] Test all features work

---

## 🚀 VPS Deployment Steps

### 1. Connect to VPS
```bash
ssh root@76.13.48.245
```

### 2. Upload Your Project
**Option A: Using SCP**
```bash
# On your local machine
tar -czf school-system.tar.gz SCHOOLS/
scp school-system.tar.gz root@76.13.48.245:/root/

# On VPS
ssh root@76.13.48.245
cd /root
tar -xzf school-system.tar.gz
mv SCHOOLS school-system
```

**Option B: Using Git**
```bash
# On VPS
cd /root
git clone YOUR_REPO_URL school-system
```

### 3. Run Deployment Script
```bash
cd /root/school-system
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

### 4. Configure Database
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE school_management2;
CREATE USER postgres WITH PASSWORD 'YOUR_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE school_management2 TO postgres;
\q

# Import your database backup
sudo -u postgres psql school_management2 < your_backup.sql

# Update machine IP in database
sudo -u postgres psql school_management2 < UPDATE_MACHINE_IP.sql
```

### 5. Update Environment Variables
```bash
cd /root/school-system/backend
nano .env

# Update these:
# - DB_PASSWORD
# - JWT_SECRET
# - SMTP credentials
```

### 6. Restart Backend
```bash
pm2 restart school-backend
pm2 logs school-backend  # Check for errors
```

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Access frontend: http://76.13.48.245
- [ ] Login as admin (username: admin, password: admin123)
- [ ] Dashboard loads correctly
- [ ] Upload a file (test uploads)
- [ ] Check student/staff lists
- [ ] Test biometric device (192.168.1.2)
- [ ] Test reports generation
- [ ] Check WebSocket connection (real-time features)
- [ ] Test mobile app installation
- [ ] Verify custom icon displays

---

## 🔧 Troubleshooting

### Backend not starting
```bash
pm2 logs school-backend
# Look for errors
```

### Can't access website
```bash
# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check firewall
sudo ufw status

# Check if port 80 is open
netstat -tulpn | grep :80
```

### Database connection error
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
sudo -u postgres psql -d school_management2
```

### Biometric device not connecting
- [ ] Verify device IP is 192.168.1.2
- [ ] Check device is on same network as VPS
- [ ] Verify port 7788 is open: `sudo ufw allow 7788/tcp`
- [ ] Check WebSocket logs: `pm2 logs school-backend | grep AI06`

---

## 📝 Important URLs

- **Frontend**: http://76.13.48.245
- **Backend API**: http://76.13.48.245:5000/api
- **Admin Login**: http://76.13.48.245 (admin/admin123)
- **Biometric Device**: 192.168.1.2:80

---

## 🔐 Security Reminders

- [ ] Change default admin password after first login
- [ ] Update DB_PASSWORD in .env
- [ ] Generate new JWT_SECRET (64+ characters)
- [ ] Setup SSL certificate (optional but recommended)
- [ ] Enable automatic backups
- [ ] Monitor logs regularly

---

## 📞 Quick Commands

```bash
# View backend logs
pm2 logs school-backend

# Restart backend
pm2 restart school-backend

# View Nginx logs
tail -f /var/log/nginx/error.log

# Check system resources
htop

# Manual backup
/root/backup-school-system.sh

# Update application
cd /root/school-system
git pull  # if using git
cd backend && npm install
cd ../APP && npm install && npm run build
pm2 restart school-backend
sudo systemctl reload nginx
```

---

## 📊 Monitoring

### Check Application Status
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

### View Resource Usage
```bash
htop           # CPU and memory
df -h          # Disk space
free -h        # Memory usage
```

### Check Logs
```bash
pm2 logs school-backend                    # Backend logs
tail -f /var/log/nginx/access.log         # Nginx access
tail -f /var/log/nginx/error.log          # Nginx errors
sudo tail -f /var/log/postgresql/*.log    # PostgreSQL logs
```

---

## 🆘 Emergency Contacts

- VPS Provider: Hostinger
- VPS IP: 76.13.48.245
- Root Access: ssh root@76.13.48.245
- Database: school_management2
- Biometric Device IP: 192.168.1.2

---

## 📚 Documentation Files

- `VPS_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `WEBSITE_ICON_SYSTEM.md` - Icon system documentation
- `UPDATE_MACHINE_IP.sql` - SQL script to update machine IP
- `deploy-to-vps.sh` - Automated deployment script
- This file - Quick reference checklist
