# ✅ Timezone Fixed! Next Steps

## What Was Fixed

Your `backend/.env` file now has the correct timezone configuration:

```env
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/school_management?schema=school_comms&timezone=Africa/Addis_Ababa"
```

The timezone parameter is now properly added to the DATABASE_URL string (not as a separate line).

---

## 🚀 NEXT: Restart Backend Server

For the timezone change to take effect, you MUST restart your backend server:

### Option 1: If Backend is Running
1. Stop the backend (Ctrl+C in the terminal)
2. Start it again:
   ```cmd
   cd backend
   npm start
   ```

### Option 2: Use Restart Script
Double-click: `RESTART_BACKEND.bat`

---

## 🔍 Verify Timezone is Working

After restarting, check if times are now correct:

1. Go to **Live Attendance Monitor**
2. Have someone scan on the device
3. Check the time displayed - it should now show correct East Africa Time (EAT)

Example:
```
✅ BEFORE FIX: 05:30 AM (Wrong - UTC time)
✅ AFTER FIX:  08:30 AM (Correct - EAT time, UTC+3)
```

---

## 👥 NEXT: Recover Lost Users

Now that timezone is fixed, let's recover your lost user data.

### Step 1: Update Device IP

Open these 3 files and change the device IP to YOUR device IP:

1. `backend/backup-ai06-users.js` (line 6)
2. `backend/restore-ai06-users.js` (line 6)  
3. `backend/sync-ai06-to-staff.js` (line 6)

Change from:
```javascript
const DEVICE_IP = '192.168.1.201'; // Change to your device IP
```

To (example):
```javascript
const DEVICE_IP = '10.22.134.159'; // Your actual device IP
```

### Step 2: Choose Recovery Method

#### Option A: Device Still Has Users ✅
If your AI06 device still has the user data:

1. Double-click: `BACKUP_AI06_USERS_NOW.bat`
   - This pulls users from device and saves to backup file
   
2. Then choose:
   - `RESTORE_AI06_USERS.bat` - Put users back on device
   - `SYNC_AI06_TO_DATABASE.bat` - Add users to Staff database

#### Option B: You Have Backup File ✅
If you have a backup file in `backend/backups/`:

1. Double-click: `RESTORE_AI06_USERS.bat`
   - This restores users from backup to device

#### Option C: Both Lost ❌
If both device and backup lost data:
- You'll need to manually re-enroll users on the device
- Then run `BACKUP_AI06_USERS_NOW.bat` to create a backup

---

## 📋 Quick Checklist

- [x] ✅ Timezone fixed in .env file
- [ ] ⏳ Restart backend server
- [ ] ⏳ Verify times are correct
- [ ] ⏳ Update device IP in scripts
- [ ] ⏳ Recover user data
- [ ] ⏳ Test attendance system

---

## 🆘 Troubleshooting

### Backend Won't Start
- Check for syntax errors in .env file
- Make sure PostgreSQL is running
- Check port 5000 is not in use

### Times Still Wrong
1. Restart PostgreSQL service
2. Restart backend server
3. Clear browser cache
4. Check database timezone:
   ```sql
   SHOW timezone;
   ```

### Cannot Connect to Device
- Verify device IP: `ping YOUR_DEVICE_IP`
- Check device is powered on
- Ensure same network

---

## 📞 Quick Commands

```cmd
# Restart backend
cd backend
npm start

# Backup users from device
BACKUP_AI06_USERS_NOW.bat

# Restore users to device
RESTORE_AI06_USERS.bat

# Sync users to database
SYNC_AI06_TO_DATABASE.bat
```

---

## 📚 Documentation

- `START_HERE_FIX_TIMEZONE_AND_USERS.md` - Complete guide
- `TIMEZONE_AND_USER_RECOVERY_VISUAL_GUIDE.md` - Visual diagrams
- `FIX_TIMEZONE_AND_RECOVER_USERS.md` - Detailed documentation

---

## ✨ Summary

1. ✅ Timezone is now fixed
2. ⏳ Restart backend server
3. ⏳ Update device IP in scripts
4. ⏳ Recover user data

**You're almost done!** Just restart the backend and recover your users.
