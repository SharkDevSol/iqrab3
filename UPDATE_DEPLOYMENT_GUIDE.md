# How to Update Your Deployed System

## Quick Answer: Use Git - It Only Updates Changed Files! ✅

---

## Method 1: Update via GitHub (Recommended - Easiest)

### Step 1: Push Changes from Your Computer

**On your local computer (Windows):**

```bash
# Go to your project folder
cd C:\Users\hp\Desktop\SCHOOLS (2)\SCHOOLS

# Add all changed files
git add .

# Commit with a message
git commit -m "Updated student form and fixed bug"

# Push to GitHub
git push origin main
```

✅ **Git automatically detects only the files you changed!**

---

### Step 2: Pull Changes on VPS

**SSH into your VPS and run:**

```bash
# For main site
cd /var/www/iqra
git pull origin main

# For school1
cd /var/www/school1
git pull origin main

# For school2
cd /var/www/school2
git pull origin main
```

✅ **Git only downloads the changed files!**

---

### Step 3: Restart Based on What Changed

**If you changed BACKEND files:**

```bash
cd /var/www/school1/backend
npm install  # Only if you added new packages
pm2 restart school1-backend
```

**If you changed FRONTEND files:**

```bash
cd /var/www/school1/APP
npm install  # Only if you added new packages
npm run build
```

**If you changed DATABASE (Prisma schema):**

```bash
cd /var/www/school1/backend
npx prisma migrate deploy
npx prisma generate
pm2 restart school1-backend
```

---

## Method 2: Update Specific Files Only (Manual)

If you only changed 1-2 files and don't want to use Git:

### Option A: Edit Directly on VPS

```bash
# SSH into VPS
ssh root@76.13.48.245

# Edit the file
nano /var/www/school1/backend/routes/studentRoutes.js

# Make your changes, save (Ctrl+X, Y, Enter)

# Restart
pm2 restart school1-backend
```

### Option B: Upload via SCP/SFTP

Use **WinSCP** or **FileZilla**:
1. Connect to: 76.13.48.245
2. Navigate to the file location
3. Drag and drop the updated file
4. Restart the service

---

## What Needs Restart After Update?

### Backend Changes:
```bash
pm2 restart school1-backend
```

### Frontend Changes:
```bash
cd /var/www/school1/APP
npm run build
# No restart needed - Nginx serves the new files automatically
```

### Database Schema Changes:
```bash
cd /var/www/school1/backend
npx prisma migrate deploy
pm2 restart school1-backend
```

### Nginx Config Changes:
```bash
nginx -t
systemctl restart nginx
```

---

## Update All Schools at Once

If you have multiple schools and want to update all:

```bash
# Update school1
cd /var/www/school1
git pull origin main
cd backend && npm install && pm2 restart school1-backend
cd ../APP && npm install && npm run build

# Update school2
cd /var/www/school2
git pull origin main
cd backend && npm install && pm2 restart school2-backend
cd ../APP && npm install && npm run build

# Update school3
cd /var/www/school3
git pull origin main
cd backend && npm install && pm2 restart school3-backend
cd ../APP && npm install && npm run build
```

---

## Common Update Scenarios:

### Scenario 1: Fixed a Bug in Backend

**Local Computer:**
```bash
git add backend/routes/studentRoutes.js
git commit -m "Fixed student registration bug"
git push origin main
```

**VPS:**
```bash
cd /var/www/school1
git pull origin main
pm2 restart school1-backend
```

✅ **Only 1 file updated!**

---

### Scenario 2: Updated Frontend UI

**Local Computer:**
```bash
git add APP/src/PAGE/Home.jsx
git commit -m "Updated home page design"
git push origin main
```

**VPS:**
```bash
cd /var/www/school1
git pull origin main
cd APP
npm run build
```

✅ **Only frontend files updated!**

---

### Scenario 3: Added New Feature (Backend + Frontend)

**Local Computer:**
```bash
git add .
git commit -m "Added new attendance report feature"
git push origin main
```

**VPS:**
```bash
cd /var/www/school1
git pull origin main

# Update backend
cd backend
npm install
pm2 restart school1-backend

# Update frontend
cd ../APP
npm install
npm run build
```

---

### Scenario 4: Database Schema Change

**Local Computer:**
```bash
# After changing schema.prisma
git add backend/prisma/schema.prisma
git commit -m "Added new field to Student table"
git push origin main
```

**VPS:**
```bash
cd /var/www/school1
git pull origin main
cd backend
npx prisma migrate deploy
npx prisma generate
pm2 restart school1-backend
```

---

## Quick Update Script

Create this script to make updates easier:

```bash
nano /root/update-school.sh
```

```bash
#!/bin/bash

SCHOOL=$1

if [ -z "$SCHOOL" ]; then
    echo "Usage: ./update-school.sh school1"
    exit 1
fi

echo "Updating $SCHOOL..."

cd /var/www/$SCHOOL
git pull origin main

echo "Updating backend..."
cd backend
npm install
pm2 restart ${SCHOOL}-backend

echo "Updating frontend..."
cd ../APP
npm install
npm run build

echo "✅ $SCHOOL updated successfully!"
```

**Make it executable:**
```bash
chmod +x /root/update-school.sh
```

**Use it:**
```bash
./update-school.sh school1
./update-school.sh school2
```

---

## Rollback if Something Goes Wrong

**Go back to previous version:**

```bash
cd /var/www/school1
git log  # See commit history
git checkout <commit-hash>  # Go back to specific version
pm2 restart school1-backend
cd APP && npm run build
```

---

## Best Practices:

1. ✅ **Always test locally first** before pushing to GitHub
2. ✅ **Use meaningful commit messages** ("Fixed login bug" not "update")
3. ✅ **Update one school at a time** to test before updating all
4. ✅ **Keep a backup** of your database before major updates
5. ✅ **Check logs after update** with `pm2 logs school1-backend`

---

## Summary:

**Question:** Do I upload ALL files?
**Answer:** NO! Git only updates changed files automatically.

**Process:**
1. Make changes on local computer
2. `git add .` → `git commit -m "message"` → `git push`
3. SSH to VPS → `git pull` → Restart services
4. Done! Only changed files are updated.

**Time:** Usually takes 1-2 minutes for small updates!
