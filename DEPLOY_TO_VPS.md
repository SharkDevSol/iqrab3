# 🚀 Deploy to VPS - Step by Step Guide

## 📋 VPS Information
- **IP Address**: `76.13.48.245`
- **SSH Access**: `ssh root@76.13.48.245`
- **Domain**: `https://iqrab3.skoolific.com/`
- **Database**: `school_management10`

---

## 🎯 Quick Deploy (Automated)

### Option 1: Using PowerShell (Windows)
```powershell
.\deploy-to-vps.ps1
```

### Option 2: Using Bash (Linux/Mac)
```bash
chmod +x deploy-to-vps.sh
./deploy-to-vps.sh
```

---

## 📝 Manual Deployment Steps

### Step 1: SSH into VPS
```bash
ssh root@76.13.48.245
```

### Step 2: Navigate to Project Directory
```bash
# Try common locations
cd /var/www/iqrab3
# OR
cd /root/iqrab3
# OR
cd ~/iqrab3

# If not found, search for it
find / -name "iqrab3" -type d 2>/dev/null
```

### Step 3: Pull Latest Changes
```bash
git pull origin main
```

You should see:
```
remote: Enumerating objects: 15, done.
remote: Counting objects: 100% (15/15), done.
...
Updating e3d73a8..8c22199
Fast-forward
 6 files changed, 633 insertions(+)
```

### Step 4: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 5: Fix Database (Create Missing Table)

**Method A: Using Node.js Script (Recommended)**
```bash
node scripts/quick-fix-table.js
```

Expected output:
```
🚀 Starting Quick Fix Script...
🔄 Attempting connection method 1...
✅ Connected successfully!
✅ Table created successfully!
✅ Total deduction settings: 12
```

**Method B: Using psql (If Method A fails)**
```bash
# Check database credentials in .env file
cat .env | grep DB_

# Run SQL file
psql -U postgres -d school_management10 -f database/FIX_MISSING_TABLE.sql
```

**Method C: Using pgAdmin (If both fail)**
1. Open pgAdmin on your local machine
2. Connect to VPS database: `76.13.48.245:5432`
3. Open database: `school_management10`
4. Run SQL from: `backend/database/FIX_MISSING_TABLE.sql`

### Step 6: Restart Backend Server
```bash
# Try these commands in order
pm2 restart iqrab3-backend

# OR
pm2 restart bilal-backend

# OR restart all
pm2 restart all

# If nothing is running, start it
pm2 start server.js --name iqrab3-backend
```

### Step 7: Check Status
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs iqrab3-backend --lines 50

# Check if server is responding
curl http://localhost:5000/api/health
```

### Step 8: Verify Fix
```bash
# Test database connection
psql -U postgres -d school_management10 -c "SELECT COUNT(*) FROM hr_attendance_deduction_settings;"
```

Expected output:
```
 count 
-------
    12
(1 row)
```

---

## 🔍 Troubleshooting

### Issue 1: Git Pull Fails
```bash
# Check git status
git status

# If there are conflicts
git stash
git pull origin main
git stash pop
```

### Issue 2: Database Connection Fails
```bash
# Check if PostgreSQL is running
systemctl status postgresql

# Start PostgreSQL if stopped
systemctl start postgresql

# Check database exists
psql -U postgres -l | grep school_management10
```

### Issue 3: PM2 Not Found
```bash
# Install PM2 globally
npm install -g pm2

# Or use node directly
cd backend
node server.js
```

### Issue 4: Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env
nano .env
# Change PORT=5000 to PORT=5001
```

### Issue 5: Permission Denied
```bash
# Fix permissions
chown -R root:root /var/www/iqrab3
chmod -R 755 /var/www/iqrab3
```

---

## 📊 Verify Deployment

### 1. Check Backend API
```bash
curl https://iqrab3.skoolific.com/api/health
```

Expected: `{"status":"ok"}`

### 2. Check Frontend
Open browser: `https://iqrab3.skoolific.com/`

### 3. Test Attendance Issues Page
Navigate to HR → Attendance → Issues

Should load without errors!

### 4. Check Database Table
```bash
psql -U postgres -d school_management10 -c "SELECT staff_type, deduction_type, deduction_amount FROM hr_attendance_deduction_settings LIMIT 5;"
```

Expected output:
```
   staff_type   | deduction_type | deduction_amount 
----------------+----------------+------------------
 Teacher        | Late           |            50.00
 Teacher        | Absent         |           200.00
 Teacher        | Half-Day       |           100.00
 Administrative | Late           |            50.00
 Administrative | Absent         |           200.00
```

---

## 🔄 Rollback (If Something Goes Wrong)

```bash
# Go back to previous version
git log --oneline -5
git reset --hard <previous-commit-hash>

# Restart server
pm2 restart iqrab3-backend
```

---

## 📝 Post-Deployment Checklist

- [ ] Code pulled from GitHub
- [ ] Dependencies installed
- [ ] Database table created
- [ ] Backend server restarted
- [ ] No errors in PM2 logs
- [ ] Website loads correctly
- [ ] Attendance issues page works
- [ ] No console errors in browser

---

## 🆘 Need Help?

### Check Logs
```bash
# Backend logs
pm2 logs iqrab3-backend --lines 100

# System logs
journalctl -u postgresql -n 50

# Nginx logs (if applicable)
tail -f /var/log/nginx/error.log
```

### Database Logs
```bash
# PostgreSQL logs location
tail -f /var/log/postgresql/postgresql-*.log
```

### Quick Health Check Script
```bash
# Create a health check script
cat > health-check.sh << 'EOF'
#!/bin/bash
echo "🔍 System Health Check"
echo "====================="
echo ""
echo "📊 PM2 Status:"
pm2 status
echo ""
echo "🗄️  Database:"
psql -U postgres -d school_management10 -c "SELECT COUNT(*) as tables FROM information_schema.tables WHERE table_schema = 'public';"
echo ""
echo "🌐 Backend API:"
curl -s http://localhost:5000/api/health || echo "❌ Backend not responding"
echo ""
echo "📝 Recent Logs:"
pm2 logs --lines 10 --nostream
EOF

chmod +x health-check.sh
./health-check.sh
```

---

## ✅ Success Indicators

After successful deployment:

1. ✅ `git pull` shows "Already up to date" or lists updated files
2. ✅ `pm2 status` shows backend running (status: online)
3. ✅ Database query returns 12 rows
4. ✅ Website loads at https://iqrab3.skoolific.com/
5. ✅ No errors in browser console
6. ✅ Attendance issues page loads correctly

---

**Last Updated**: After fixing hr_attendance_deduction_settings table issue
**Commit**: `8c22199` - Fix: Add missing hr_attendance_deduction_settings table
