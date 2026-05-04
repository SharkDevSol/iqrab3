# 🚀 Quick Deploy Guide - VPS Deployment

## ✅ Changes Already Pushed to GitHub
All code changes have been committed and pushed to the `main` branch.

## 🎯 Deploy to VPS Now

### Method 1: Automated (Easiest)
Run this command from your local machine:
```batch
DEPLOY_TO_VPS.bat
```
Enter your VPS IP when prompted.

### Method 2: Manual SSH (Most Common)
```bash
# 1. Connect to VPS
ssh root@your-vps-ip

# 2. Navigate to project
cd /root/iqrab3

# 3. Pull changes
git pull origin main

# 4. Restart backend
cd backend
pm2 restart backend

# 5. Verify
pm2 status
```

### Method 3: One-Line Command
From your local machine:
```bash
ssh root@your-vps-ip "cd /root/iqrab3 && git pull origin main && cd backend && pm2 restart backend && pm2 status"
```

## 🧪 Test After Deployment
1. Open: https://iqrab3.skoolific.com
2. Go to Student Faults page
3. ✅ Classes should load (no 401 error)
4. ✅ Reports should load (no 401 error)

## ❓ What If It Doesn't Work?

### Check Backend Status:
```bash
ssh root@your-vps-ip
pm2 logs backend --lines 50
```

### Restart Backend:
```bash
ssh root@your-vps-ip
pm2 restart backend
```

### Check Latest Commit:
```bash
ssh root@your-vps-ip
cd /root/iqrab3
git log -1
# Should show: "Fix: Make faults classes and reports endpoints public"
```

## 📊 What Was Fixed?
- `/api/faults/classes` - Now public (no auth needed)
- `/api/faults/reports` - Now public (no auth needed)
- All other endpoints still protected ✅

## 🎉 Expected Result
No more 401 errors when loading the Student Faults page!
