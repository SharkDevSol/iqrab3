# How to Delete Logs Without Deleting Users

## The Problem
You clicked "Delete all Glog" and it deleted users too. This shouldn't happen - let me explain the correct way.

## The Correct Menu Options

```
Data Mgt Menu:
├── Down GLog          ✅ Download logs (backup)
├── Down all GLog      ✅ Download all logs (backup)
├── Clean all enroll   ⚠️  DELETES USERS (don't use!)
├── Delete all Glog    ✅ Delete logs only (safe)
├── Clear Database     ⚠️  DELETES EVERYTHING (don't use!)
├── Init Menu          ℹ️  Initialize menu
├── Clean manager      ℹ️  Clean manager data
└── Clear inactive users ⚠️ Delete inactive users
```

## Step-by-Step: Delete Logs Safely

### Step 1: Backup Users (Important!)
```
1. Run: BACKUP_AI06_USERS.bat
2. Wait for "Backup Complete!"
3. Check: backend/backups/ folder has new file
```

### Step 2: Download Logs (Optional but recommended)
```
On Device:
1. Press ESC → Data Mgt
2. Select "Down all GLog"
3. Wait for download to complete
```

### Step 3: Delete Logs Only
```
On Device:
1. Press ESC → Data Mgt
2. Select "Delete all Glog" (4th option)
3. Confirm deletion
4. Logs deleted, users remain!
```

## If You Accidentally Deleted Users

### Quick Restore
```
1. Run: RESTORE_AI06_USERS.bat
2. Wait for restore to complete
3. Check device: Users should be back!
```

## Visual Guide

### ✅ CORRECT: Delete Logs Only
```
Before:
- Users: 50 enrolled
- Logs: 5000 records

Action: Delete all Glog

After:
- Users: 50 enrolled ✅
- Logs: 0 records ✅
```

### ❌ WRONG: Clean All Enroll
```
Before:
- Users: 50 enrolled
- Logs: 5000 records

Action: Clean all enroll

After:
- Users: 0 enrolled ❌
- Logs: 5000 records (still there!)
```

## Prevention Tips

1. **Always backup first** - Run BACKUP_AI06_USERS.bat
2. **Read menu carefully** - "Delete all Glog" vs "Clean all enroll"
3. **Test on one device** - If you have multiple devices
4. **Keep backups** - Don't delete backup files

## Menu Translation

| Menu Option | What It Does | Safe? |
|-------------|--------------|-------|
| Delete all Glog | Delete attendance logs | ✅ Yes |
| Clean all enroll | Delete all users | ❌ No |
| Clear Database | Delete everything | ❌ No |
| Down all GLog | Download logs | ✅ Yes |
| Clear inactive users | Delete inactive users only | ⚠️ Careful |

## Quick Commands

```bash
# Backup users before deleting
BACKUP_AI06_USERS.bat

# Restore if something went wrong
RESTORE_AI06_USERS.bat

# Check device connection
cd backend
node test-ai06-device.js
```

## Summary

**To delete logs without deleting users:**
1. Backup: `BACKUP_AI06_USERS.bat`
2. Device: ESC → Data Mgt → **Delete all Glog** (not "Clean all enroll"!)
3. Verify: Users still enrolled, logs cleared

**If users were deleted:**
1. Restore: `RESTORE_AI06_USERS.bat`
2. Wait for completion
3. Verify: Users back on device
