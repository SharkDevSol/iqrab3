# 🚨 FIX VPS DATABASE NOW

## Current Error on Production
```
❌ Error on: https://iqrab3.schoolific.com/hr/leave
relation "hr_attendance_deduction_settings" does not exist
```

This is a **PRODUCTION** issue on your VPS server.

---

## ✅ QUICK FIX (5 Minutes)

### Step 1: SSH into VPS

```bash
ssh root@76.13.48.245
```

Enter your VPS password when prompted.

---

### Step 2: Find Your Project

```bash
# Try common locations
cd /var/www/iqrab3 || cd /root/iqrab3 || cd ~/iqrab3

# If not found, search for it
find / -name "iqrab3" -type d 2>/dev/null | head -5

# Once found, navigate to it
cd /path/to/iqrab3  # use the path from above
```

---

### Step 3: Pull Latest Changes

```bash
git pull origin main
```

You should see:
```
Updating 8bf2c71..b82a31d
Fast-forward
 4 files changed, 455 insertions(+)
```

---

### Step 4: Fix Database

```bash
cd backend

# Method A: Using Node.js script (try this first)
node scripts/quick-fix-table.js
```

**If that works**, you'll see:
```
✅ Connected successfully!
✅ Table created successfully!
✅ Total deduction settings: 12
```

**If it fails**, try Method B:

```bash
# Method B: Using psql directly
psql -U postgres -d school_management10 -f database/FIX_MISSING_TABLE.sql
```

**If psql asks for password**, enter your PostgreSQL password.

---

### Step 5: Restart Backend

```bash
# Try these commands in order
pm2 restart iqrab3-backend

# OR
pm2 restart bilal-backend

# OR restart all
pm2 restart all

# Check status
pm2 status
```

---

### Step 6: Verify Fix

```bash
# Check database
psql -U postgres -d school_management10 -c "SELECT COUNT(*) FROM hr_attendance_deduction_settings;"
```

Should return: **12**

---

### Step 7: Test Website

Open browser: `https://iqrab3.schoolific.com/hr/leave`

**Error should be GONE!** ✅

---

## 🚀 AUTOMATED FIX (One Command)

If you want to do everything automatically:

```bash
ssh root@76.13.48.245 << 'EOF'
cd /var/www/iqrab3 || cd /root/iqrab3 || cd ~/iqrab3
git pull origin main
cd backend
node scripts/quick-fix-table.js
pm2 restart iqrab3-backend
pm2 status
EOF
```

---

## 🔍 Troubleshooting

### If Project Not Found

Clone it:
```bash
cd /var/www
git clone https://github.com/SharkDevSol/iqrab3.git
cd iqrab3/backend
npm install
```

### If Database Script Fails

Run SQL manually:
```bash
psql -U postgres -d school_management10
```

Then paste this SQL:
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
  ('Support Staff', 'Half-Day', 75.00, 'Deduction for half-day absence', true),
  ('Management', 'Late', 75.00, 'Deduction for late arrival', true),
  ('Management', 'Absent', 250.00, 'Deduction for absence', true),
  ('Management', 'Half-Day', 125.00, 'Deduction for half-day absence', true)
ON CONFLICT (staff_type, deduction_type) DO NOTHING;
```

Exit psql: `\q`

### If PM2 Not Found

```bash
npm install -g pm2
cd /var/www/iqrab3/backend
pm2 start server.js --name iqrab3-backend
pm2 save
```

### Check Logs

```bash
pm2 logs iqrab3-backend --lines 50
```

---

## ✅ Verification Checklist

- [ ] SSH into VPS successful
- [ ] Project found/cloned
- [ ] Git pull completed
- [ ] Database table created (12 rows)
- [ ] Backend restarted
- [ ] Website loads without error
- [ ] HR Leave page works

---

## 📞 Quick Commands Reference

```bash
# SSH
ssh root@76.13.48.245

# Navigate
cd /var/www/iqrab3/backend

# Pull changes
git pull origin main

# Fix database
node scripts/quick-fix-table.js

# Restart
pm2 restart iqrab3-backend

# Check status
pm2 status

# View logs
pm2 logs iqrab3-backend

# Test database
psql -U postgres -d school_management10 -c "SELECT COUNT(*) FROM hr_attendance_deduction_settings;"
```

---

## 🎯 What This Fixes

Creates the missing table on your **production database** that stores HR deduction rules for:
- Late arrivals
- Absences
- Half-day absences

For different staff types (Teacher, Administrative, Support Staff, Management).

---

**This is a PRODUCTION fix for your live server!**
**Do this NOW to fix the error on https://iqrab3.schoolific.com/**
