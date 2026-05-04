# 🚀 Deploy to VPS - Quick Guide

## VPS Details
- **IP**: `76.13.48.245`
- **Domain**: `https://iqrab3.skoolific.com/`
- **SSH**: `ssh root@76.13.48.245`

---

## ✅ Quick Deploy (3 Steps)

### Step 1: SSH into VPS
```bash
ssh root@76.13.48.245
```
Enter your password when prompted.

### Step 2: Download and Run Setup Script
```bash
# Download the setup script
curl -o vps-setup.sh https://raw.githubusercontent.com/SharkDevSol/iqrab3/main/vps-setup.sh

# Make it executable
chmod +x vps-setup.sh

# Run it
bash vps-setup.sh
```

### Step 3: Verify
Open your browser: `https://iqrab3.skoolific.com/`

---

## 📝 Alternative: Manual Steps

If the script doesn't work, follow these manual steps:

### 1. SSH into VPS
```bash
ssh root@76.13.48.245
```

### 2. Find or Clone Project
```bash
# Search for existing project
find / -name "iqrab3" -type d 2>/dev/null

# If not found, clone it
cd /var/www
git clone https://github.com/SharkDevSol/iqrab3.git
cd iqrab3
```

### 3. Pull Latest Changes
```bash
cd /var/www/iqrab3  # or wherever your project is
git pull origin main
```

### 4. Install Dependencies
```bash
cd backend
npm install
```

### 5. Setup Environment
```bash
# If .env doesn't exist
cp .env.production .env
```

### 6. Fix Database
```bash
node scripts/quick-fix-table.js
```

Expected output:
```
Starting Quick Fix Script...
Attempting connection method 1...
Connected successfully!
Table created successfully!
Total deduction settings: 12
```

### 7. Restart Backend
```bash
pm2 restart iqrab3-backend
# OR
pm2 restart bilal-backend
# OR if not running
pm2 start server.js --name iqrab3-backend
```

### 8. Check Status
```bash
pm2 status
pm2 logs iqrab3-backend --lines 20
```

---

## 🔍 Troubleshooting

### If Database Fix Fails

Connect to PostgreSQL and run SQL manually:

```bash
# Connect to database
psql -U postgres -d school_management10

# Run this SQL:
```

```sql
CREATE TABLE IF NOT EXISTS hr_attendance_deduction_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_type VARCHAR(255) NOT NULL,
  deduction_type VARCHAR(50) NOT NULL,
  deduction_amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_type, deduction_type)
);

INSERT INTO hr_attendance_deduction_settings 
  (staff_type, deduction_type, deduction_amount, description, is_active)
VALUES 
  ('Teacher', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Teacher', 'Absent', 200.00, 'Deduction for absence', true),
  ('Teacher', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  ('Administrative', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Administrative', 'Absent', 200.00, 'Deduction for absence', true),
  ('Administrative', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  ('Support Staff', 'Late', 30.00, 'Deduction for late arrival', true),
  ('Support Staff', 'Absent', 150.00, 'Deduction for absence', true),
  ('Support Staff', 'Half-Day', 75.00, 'Deduction for half-day absence', true)
ON CONFLICT (staff_type, deduction_type) DO NOTHING;

-- Verify
SELECT COUNT(*) FROM hr_attendance_deduction_settings;
```

Exit psql: `\q`

### If PM2 Not Found

```bash
# Install PM2
npm install -g pm2

# Start backend
cd /var/www/iqrab3/backend
pm2 start server.js --name iqrab3-backend
pm2 save
pm2 startup
```

### Check Logs

```bash
# Backend logs
pm2 logs iqrab3-backend

# PostgreSQL logs
tail -f /var/log/postgresql/*.log

# System logs
journalctl -xe
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] `git pull` completed successfully
- [ ] `npm install` completed without errors
- [ ] Database table created (12 rows)
- [ ] PM2 shows backend as "online"
- [ ] Website loads: https://iqrab3.skoolific.com/
- [ ] No errors in browser console
- [ ] Attendance issues page works

---

## 📞 Quick Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs iqrab3-backend

# Restart backend
pm2 restart iqrab3-backend

# Check database
psql -U postgres -d school_management10 -c "SELECT COUNT(*) FROM hr_attendance_deduction_settings;"

# Test API
curl http://localhost:5000/api/health
```

---

## 🎯 What Was Fixed

The error `relation "hr_attendance_deduction_settings" does not exist` has been fixed by:

1. ✅ Created SQL migration file
2. ✅ Created automated fix script
3. ✅ Pushed to GitHub
4. ✅ Ready to deploy to VPS

The table stores HR deduction rules for staff attendance (late, absent, half-day).

---

**Need help?** Check `DEPLOY_TO_VPS.md` for detailed troubleshooting.
