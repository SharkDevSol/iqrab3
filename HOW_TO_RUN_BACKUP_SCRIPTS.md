# How to Run Backup Scripts

## You Have 3 Options:

### Option 1: PowerShell Scripts (Recommended)
```powershell
# Backup users
.\BACKUP_AI06_USERS.ps1

# Restore users
.\RESTORE_AI06_USERS.ps1
```

### Option 2: Batch Files with .\
```powershell
# Backup users
.\BACKUP_AI06_USERS.bat

# Restore users
.\RESTORE_AI06_USERS.bat
```

### Option 3: Direct Node Commands
```powershell
# Backup users
cd backend
node backup-ai06-users.js

# Restore users
cd backend
node restore-ai06-users.js
```

## Quick Start

### Step 1: Configure Device IP
Before running, edit the device IP in these files:
- `backend/backup-ai06-users.js` (line 6)
- `backend/restore-ai06-users.js` (line 6)

Change this line:
```javascript
const DEVICE_IP = '192.168.1.201'; // Change to your device IP
```

### Step 2: Backup Users
```powershell
.\BACKUP_AI06_USERS.ps1
```

### Step 3: Delete Logs on Device
On the AI06 device:
1. Press ESC
2. Select "Data Mgt"
3. Select "Delete all Glog" (4th option)
4. Confirm

### Step 4: If Users Were Deleted (Restore)
```powershell
.\RESTORE_AI06_USERS.ps1
```

## Troubleshooting

### Error: "cannot be loaded because running scripts is disabled"
Run this command first (as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "The term is not recognized"
Add `.\` before the command:
```powershell
.\BACKUP_AI06_USERS.ps1
```

### Error: "Cannot connect to device"
1. Check device IP address
2. Verify device is powered on
3. Test connection:
```powershell
ping 192.168.1.201
```

## What Each Script Does

### BACKUP_AI06_USERS
- Connects to AI06 device
- Downloads all enrolled users
- Saves to `backend/backups/ai06-users-backup-[timestamp].json`
- Shows summary of users backed up

### RESTORE_AI06_USERS
- Finds latest backup file
- Connects to AI06 device
- Uploads all users back to device
- Shows success/failure count

## File Locations

```
SCHOOLS/
├── BACKUP_AI06_USERS.ps1      ← PowerShell script
├── BACKUP_AI06_USERS.bat      ← Batch script
├── RESTORE_AI06_USERS.ps1     ← PowerShell script
├── RESTORE_AI06_USERS.bat     ← Batch script
└── backend/
    ├── backup-ai06-users.js   ← Backup logic
    ├── restore-ai06-users.js  ← Restore logic
    └── backups/               ← Backup files stored here
        └── ai06-users-backup-2026-02-10T10-30-00.json
```

## Daily Workflow

### Morning (Before Deleting Logs)
```powershell
# 1. Backup users
.\BACKUP_AI06_USERS.ps1

# 2. Go to device and delete logs
# ESC → Data Mgt → Delete all Glog
```

### If Something Goes Wrong
```powershell
# Restore users immediately
.\RESTORE_AI06_USERS.ps1
```

## Summary

✅ **Use PowerShell scripts** - Easiest way
✅ **Always backup first** - Before deleting anything
✅ **Keep backup files** - Don't delete from backend/backups/
✅ **Test restore** - Make sure it works before you need it
