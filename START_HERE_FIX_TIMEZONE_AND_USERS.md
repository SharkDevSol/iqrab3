# 🚀 START HERE: Fix Timezone & Recover Users

## Quick 3-Step Solution

### ⏰ STEP 1: Fix Timezone (5 minutes)

1. **Update Device IP** in these files:
   - `backend/backup-ai06-users.js` (line 6)
   - `backend/restore-ai06-users.js` (line 6)
   - `backend/sync-ai06-to-staff.js` (line 6)
   
   Change `192.168.1.201` to YOUR device IP

2. **Update Database Timezone**:
   - Open `backend/.env`
   - Change this line:
   ```env
   DATABASE_URL="postgresql://postgres:12345678@localhost:5432/school_management?schema=school_comms"
   ```
   
   To this (add timezone parameter):
   ```env
   DATABASE_URL="postgresql://postgres:12345678@localhost:5432/school_management?schema=school_comms&timezone=Africa/Addis_Ababa"
   ```

3. **Restart Backend**:
   ```cmd
   cd backend
   npm start
   ```

---

### 👥 STEP 2: Recover Lost Users

Choose ONE option based on your situation:

#### Option A: You Have Backup Files ✅
If you have backup files in `backend/backups/`:

1. Double-click: `RESTORE_AI06_USERS.bat`
2. Wait for completion
3. Done! ✅

#### Option B: Device Still Has Users ✅
If your AI06 device still has the user data:

1. Double-click: `BACKUP_AI06_USERS_NOW.bat`
2. This creates a backup file
3. Then double-click: `RESTORE_AI06_USERS.bat`
4. Done! ✅

#### Option C: Sync to Database ✅
If you want users in your Staff database:

1. Double-click: `SYNC_AI06_TO_DATABASE.bat`
2. Users will be added to Staff table
3. Done! ✅

---

### ✅ STEP 3: Verify Everything Works

1. **Check Timezone**:
   - Look at attendance times in your system
   - They should now show correct local time

2. **Check Users**:
   - Go to Live Attendance Monitor
   - Users should appear when they scan
   - Names should display correctly

3. **Test Attendance**:
   - Have someone scan on device
   - Check if it appears in system immediately
   - Verify time is correct

---

## 🆘 Troubleshooting

### "Cannot connect to device"
- Check device IP: `ping YOUR_DEVICE_IP`
- Ensure device is powered on
- Verify same network

### "No backup files found"
- Use Option B to create backup first
- Or use Option C to sync to database

### "Timezone still wrong"
1. Restart PostgreSQL service
2. Restart backend server
3. Clear browser cache

---

## 📞 Quick Commands

```cmd
# Fix timezone
FIX_TIMEZONE_NOW.bat

# Backup users from device
BACKUP_AI06_USERS_NOW.bat

# Restore users to device
RESTORE_AI06_USERS.bat

# Sync users to database
SYNC_AI06_TO_DATABASE.bat
```

---

## 📚 Detailed Documentation

For more details, see: `FIX_TIMEZONE_AND_RECOVER_USERS.md`

---

## ✨ Summary

1. ⏰ Fix timezone in `.env` file
2. 👥 Recover users (backup/restore/sync)
3. ✅ Test and verify

**Total Time: 10-15 minutes**
