# AI06 User Deletion Issue - Troubleshooting Guide

## Problem
Users are being deleted from the AI06 attendance device automatically.

## Analysis
After reviewing your code, we confirmed:
- ✅ Your software does NOT delete users from the device
- ✅ Your software only READS attendance logs from the device
- ✅ The device manages its own user database

## Possible Root Causes

### 1. Device Memory Full
- AI06 devices have limited storage (typically 3,000-5,000 users)
- When memory is full, device may auto-delete old/inactive users
- **Solution**: Check device memory usage and clear old attendance logs

### 2. Firmware Bug
- Some AI06 firmware versions have bugs causing user deletion
- **Solution**: Update device firmware to latest version

### 3. Cloud Software Conflict
- If using ZKTeco cloud software + your local server simultaneously
- Both systems may be syncing and overwriting each other
- **Solution**: Disable cloud software temporarily and test

### 4. Power Loss/Reset
- Improper shutdown can corrupt device database
- **Solution**: Use UPS for device, ensure proper shutdown procedures

### 5. Manual Deletion
- Someone with physical/admin access clearing users
- **Solution**: Check device access logs, restrict physical access

## Immediate Actions

### 1. Create Regular Backups
```bash
# Run daily backup
node backend/backup-ai06-users.js
```

### 2. Monitor Device Users
```bash
# Start monitoring service (runs continuously)
node backend/monitor-device-users.js
```

This will:
- Check device users every minute
- Auto-backup every hour
- Alert when users are deleted
- Log all deletion incidents

### 3. Auto-Restore Missing Users
```bash
# Restore users from latest backup
node backend/auto-restore-users.js
```

## Testing Steps (As Suggested by Support)

### Test 1: Without Cloud Software
1. Disconnect any ZKTeco cloud software
2. Register users directly on device
3. Monitor for 24-48 hours
4. Check if users remain

### Test 2: With Cloud Software
1. Connect your local server
2. Register users
3. Monitor for 24-48 hours
4. Compare with Test 1 results

## Recommended Setup

### Option A: Scheduled Monitoring (Windows)
Create a scheduled task to run monitoring script:

1. Open Task Scheduler
2. Create new task:
   - Trigger: At system startup
   - Action: Start program
   - Program: `node`
   - Arguments: `C:\path\to\backend\monitor-device-users.js`
   - Start in: `C:\path\to\backend`

### Option B: Scheduled Restore (Windows)
Create a scheduled task to auto-restore:

1. Open Task Scheduler
2. Create new task:
   - Trigger: Daily at 2:00 AM
   - Action: Start program
   - Program: `node`
   - Arguments: `C:\path\to\backend\auto-restore-users.js`
   - Start in: `C:\path\to\backend`

## Device Configuration Checks

### Check Device Settings
1. Access device web interface: `http://192.168.1.201`
2. Check these settings:
   - **Auto-delete old records**: Should be OFF
   - **User capacity**: Check if near limit
   - **Firmware version**: Note for support
   - **Cloud sync**: Disable if not needed

### Check Device Logs
1. Access device admin panel
2. Check operation logs for:
   - User deletion events
   - Admin access times
   - System errors

## Long-term Solutions

### 1. Implement User Sync System
Instead of relying on device to store users permanently:
- Store master user list in your database
- Sync users TO device daily
- Device becomes "cache" not "source of truth"

### 2. Increase Backup Frequency
- Backup every hour instead of daily
- Keep backups for 30 days
- Store backups in multiple locations

### 3. Add Alerting
Modify `monitor-device-users.js` to send alerts:
- Email notifications
- SMS alerts
- Webhook to monitoring system

## Files Created

1. **backend/monitor-device-users.js**
   - Monitors device users continuously
   - Auto-backups every hour
   - Logs deletion incidents
   - Alerts on critical user loss

2. **backend/auto-restore-users.js**
   - Compares device users with latest backup
   - Restores missing users automatically
   - Can be run manually or scheduled

3. **backend/backup-ai06-users.js** (existing)
   - Creates backup of all device users
   - Saves to `backend/backups/` directory

4. **backend/restore-ai06-users.js** (existing)
   - Restores all users from backup
   - Overwrites device user list

## Next Steps

1. ✅ Run initial backup:
   ```bash
   node backend/backup-ai06-users.js
   ```

2. ✅ Start monitoring:
   ```bash
   node backend/monitor-device-users.js
   ```

3. ⏳ Wait 24-48 hours and check logs

4. 📊 Review `backend/logs/user-deletion-incidents.log`

5. 🔧 If users deleted, run auto-restore:
   ```bash
   node backend/auto-restore-users.js
   ```

## Support Communication

When contacting support, provide:
- Device firmware version
- Number of users before/after deletion
- Backup files showing missing users
- Incident logs from monitoring script
- Whether cloud software is enabled
- Network topology (device → server connection)

## Questions to Ask Support

1. What is the maximum user capacity for this device model?
2. Is there an auto-delete feature in the firmware?
3. Are there known bugs in our firmware version?
4. Should we upgrade firmware? Which version?
5. Can device logs show who/what deleted users?
6. Is there a way to disable cloud sync completely?
7. What is the recommended backup strategy?

---

**Created**: February 16, 2026
**Status**: Active Monitoring Required
