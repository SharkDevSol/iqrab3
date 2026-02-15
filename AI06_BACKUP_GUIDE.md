# AI06 Backup and Log Management Guide

## Problem Summary
When you click "Delete all Glog", it should only delete attendance logs, NOT users. However, if users were deleted, you may have clicked the wrong option.

## Menu Options Explained

### Safe Options (Delete Logs Only)
- **Delete all Glog** ✅ - Deletes attendance logs, keeps users
- **Down GLog** ✅ - Downloads logs (backup before delete)
- **Down all GLog** ✅ - Downloads all logs

### Dangerous Options (Delete Users)
- **Clean all enroll** ⚠️ - DELETES ALL USERS
- **Clear Database** ⚠️ - DELETES EVERYTHING
- **Clear inactive users** ⚠️ - Deletes inactive users only

## Step-by-Step: Delete Logs Safely

### 1. Backup Users First
```
Menu → User Mgt → Download all snapshots
```
This creates a backup of all enrolled users.

### 2. Backup Attendance Logs
```
Menu → Data Mgt → Down all GLog
```
This downloads all attendance records.

### 3. Delete Logs Only
```
Menu → Data Mgt → Delete all Glog
```
This removes attendance logs but keeps users enrolled.

## If Users Were Accidentally Deleted

### Restore from Device Backup
```
Menu → User Mgt → Download all snapshots (if you backed up before)
```

### Re-enroll from Your System
If you have users in your backend database, you can re-push them to the device.

## Automatic Backup Script

Run this before deleting logs to backup user data from your system:


## Using the Backup Scripts

### Before Deleting Logs (Recommended)

1. **Backup users from device:**
   ```
   Double-click: BACKUP_AI06_USERS.bat
   ```
   This saves all users to `backend/backups/` folder

2. **Now safe to delete logs on device:**
   - Go to device: Data Mgt → Delete all Glog

### If Users Were Accidentally Deleted

1. **Restore users from backup:**
   ```
   Double-click: RESTORE_AI06_USERS.bat
   ```
   This pushes users back to the device

## Configuration

Edit these files to match your device IP:
- `backend/backup-ai06-users.js` - Line 6: Change IP address
- `backend/restore-ai06-users.js` - Line 6: Change IP address

```javascript
const DEVICE_IP = '192.168.1.201'; // Change to your device IP
```

## Best Practices

### Daily Routine
1. Backup users (once per day)
2. Download attendance logs
3. Delete old logs from device
4. Keep device storage clean

### Weekly Routine
1. Full backup of device (snapshots)
2. Verify backup files exist
3. Test restore on test device (if available)

## Troubleshooting

### "Delete all Glog" deleted users
- You may have clicked "Clean all enroll" by mistake
- Use RESTORE_AI06_USERS.bat to restore

### Cannot connect to device
- Check device IP address
- Verify network connection
- Ping device: `ping 192.168.1.201`

### Backup file not found
- Run BACKUP_AI06_USERS.bat first
- Check `backend/backups/` folder exists

## Quick Reference

| Action | Command |
|--------|---------|
| Backup users | `BACKUP_AI06_USERS.bat` |
| Restore users | `RESTORE_AI06_USERS.bat` |
| Delete logs only | Device: Data Mgt → Delete all Glog |
| Download logs | Device: Data Mgt → Down all GLog |
| Backup device users | Device: User Mgt → Download all snapshots |

## Summary

✅ **Safe:** Delete all Glog (deletes logs only)
⚠️ **Dangerous:** Clean all enroll (deletes users)
🔄 **Backup:** Run BACKUP_AI06_USERS.bat before any delete operation
🔧 **Restore:** Run RESTORE_AI06_USERS.bat if users were deleted
