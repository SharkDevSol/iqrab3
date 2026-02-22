# Device User Persistence - Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: Users Still Disappearing After Deployment

**Symptoms:**
- Users added to device still disappear after a few minutes
- No entries in device_user_buffer table

**Possible Causes:**
1. Services not started properly
2. Sync services still using old code
3. Device IP address incorrect

**Solutions:**

1. **Verify services are running:**
```bash
# Check server logs for these messages:
✅ Sync Coordinator cleanup task started
✅ Device User Monitoring Service started
✅ Automatic Backup Service started
```

2. **Check if sync services are using new code:**
```bash
# Look for these log messages during sync:
🔒 Sync lock acquired
🔓 Sync lock released
```

3. **Verify device IP:**
```bash
# Test device connectivity
curl http://192.168.1.201/cgi-bin/js/app/module/userManager.js \
  -d '{"command":"getUserList","token":""}' \
  -H "Content-Type: application/json"
```

4. **Check sync_locks table:**
```sql
SELECT * FROM sync_locks ORDER BY acquired_at DESC LIMIT 5;
```

---

### Issue 2: Migration Script Fails

**Symptoms:**
- `migrate-device-users-to-buffer.js` throws errors
- "Failed to get users from device" message

**Possible Causes:**
1. Device not accessible
2. Database connection issues
3. Missing tables

**Solutions:**

1. **Test device connectivity:**
```bash
ping 192.168.1.201
```

2. **Verify database tables exist:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'device_user_buffer';
```

3. **Check database connection:**
```bash
# Test with psql
psql -h localhost -U postgres -d school_management2 -c "SELECT 1;"
```

4. **Run migration with verbose logging:**
```bash
DEBUG=* node migrate-device-users-to-buffer.js
```

---

### Issue 3: Buffer Not Showing Unmapped Users

**Symptoms:**
- Users exist on device but not in buffer
- API returns empty array

**Possible Causes:**
1. Users are already mapped
2. Monitoring service not running
3. Sync services not discovering users

**Solutions:**

1. **Check if users are mapped:**
```sql
SELECT 
  m.machine_user_id,
  s.name,
  m.person_id
FROM user_machine_mapping m
LEFT JOIN staff s ON s.id = m.person_id;
```

2. **Manually trigger user discovery:**
```bash
# Run migration script again
node migrate-device-users-to-buffer.js
```

3. **Check monitoring service status:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/status
```

4. **Check device_user_buffer table directly:**
```sql
SELECT * FROM device_user_buffer WHERE mapping_status = 'unmapped';
```

---

### Issue 4: Backups Not Being Created

**Symptoms:**
- No backup files in `backend/backups/` directory
- Backup service started but no files created

**Possible Causes:**
1. Backup directory doesn't exist
2. Permission issues
3. Service not running

**Solutions:**

1. **Create backup directory:**
```bash
mkdir -p backend/backups
chmod 755 backend/backups
```

2. **Manually trigger backup:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/backups/create
```

3. **Check server logs:**
```bash
# Look for backup-related messages
grep -i "backup" backend/logs/server.log
```

4. **Verify backup service is running:**
```javascript
// In server.js, check this line exists:
backupRestoreService.startAutoBackup(6);
```

---

### Issue 5: Sync Lock Errors

**Symptoms:**
- "Could not acquire sync lock" messages
- Multiple sync services failing

**Possible Causes:**
1. Lock not being released properly
2. Expired locks not cleaned up
3. Multiple services trying to sync simultaneously

**Solutions:**

1. **Check for stuck locks:**
```sql
SELECT * FROM sync_locks WHERE expires_at < NOW();
```

2. **Manually clean up expired locks:**
```sql
DELETE FROM sync_locks WHERE expires_at < NOW();
```

3. **Verify cleanup task is running:**
```javascript
// In server.js, check this exists:
setInterval(async () => {
  await syncCoordinator.cleanupExpiredLocks();
}, 5 * 60 * 1000);
```

4. **Check lock status:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/status
```

---

### Issue 6: Monitoring Service Not Detecting Changes

**Symptoms:**
- Users disappear but no alerts
- No entries in device_user_count_history

**Possible Causes:**
1. Monitoring service not started
2. Polling interval too long
3. Device communication issues

**Solutions:**

1. **Verify monitoring service is running:**
```bash
# Check server logs for:
✅ Device User Monitoring Service started
```

2. **Check monitoring history:**
```sql
SELECT * FROM device_user_count_history 
ORDER BY timestamp DESC LIMIT 10;
```

3. **Manually check for missing users:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/missing
```

4. **Adjust polling interval (if needed):**
```javascript
// In server.js, change from 5 to 2 minutes:
deviceUserMonitoringService.startMonitoring(2);
```

---

### Issue 7: Cannot Map Users to Staff Records

**Symptoms:**
- "Person ID does not exist" error
- Mapping API returns 400 error

**Possible Causes:**
1. Staff record doesn't exist
2. Wrong person ID
3. Database constraint issues

**Solutions:**

1. **Verify staff record exists:**
```sql
SELECT id, name FROM staff WHERE id = YOUR_PERSON_ID;
```

2. **Check buffer user details:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/buffer
```

3. **Create staff record first:**
```sql
INSERT INTO staff (name, email, phone) 
VALUES ('User Name', 'email@example.com', '1234567890');
```

4. **Then map the user:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"personId": STAFF_ID, "personType": "staff"}' \
  http://localhost:5000/api/device-users/buffer/BUFFER_ID/map
```

---

### Issue 8: Conflicts Not Being Detected

**Symptoms:**
- Device and database have different data but no conflicts logged
- Conflicts table is empty

**Possible Causes:**
1. Conflict detection not running
2. Data actually matches
3. Service not configured

**Solutions:**

1. **Manually trigger conflict detection:**
```javascript
// In Node.js console or script:
const conflictService = require('./services/ConflictResolutionService');
const conflicts = await conflictService.detectConflicts();
console.log(conflicts);
```

2. **Check conflicts table:**
```sql
SELECT * FROM user_conflicts WHERE resolved = false;
```

3. **Verify conflict detection logic:**
```bash
# Check if ConflictResolutionService is being called
grep -r "detectConflicts" backend/services/
```

---

### Issue 9: Server Won't Start After Deployment

**Symptoms:**
- Server crashes on startup
- Error messages about missing modules

**Possible Causes:**
1. Missing dependencies
2. Syntax errors in new code
3. Database connection issues

**Solutions:**

1. **Check for missing dependencies:**
```bash
npm install
```

2. **Check server logs:**
```bash
node server.js 2>&1 | tee server-error.log
```

3. **Verify all service files exist:**
```bash
ls -la backend/services/SyncCoordinator.js
ls -la backend/services/DeviceUserBufferService.js
ls -la backend/services/DeviceUserAuditService.js
ls -la backend/services/DeviceUserMonitoringService.js
ls -la backend/services/BackupRestoreService.js
ls -la backend/services/ConflictResolutionService.js
```

4. **Test database connection:**
```bash
node -e "const pool = require('./backend/config/db'); pool.query('SELECT 1').then(() => console.log('DB OK')).catch(console.error);"
```

---

### Issue 10: Restore from Backup Fails

**Symptoms:**
- Restore operation returns errors
- Users not restored to device

**Possible Causes:**
1. Backup file corrupted
2. Device not accessible
3. Invalid backup format

**Solutions:**

1. **Verify backup file exists and is valid JSON:**
```bash
cat backend/backups/ai06-users-backup-TIMESTAMP.json | jq .
```

2. **Test device connectivity:**
```bash
curl http://192.168.1.201/
```

3. **Try dry-run first:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true}' \
  http://localhost:5000/api/device-users/backups/FILENAME/restore
```

4. **Manually restore using script:**
```bash
node backend/restore-ai06-users.js
```

---

## Diagnostic Commands

### Check System Status

```bash
# 1. Check if services are running
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/status

# 2. Check buffer statistics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/buffer/statistics

# 3. Check recent audit logs
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/history?hours=1

# 4. List backups
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/backups
```

### Database Diagnostic Queries

```sql
-- Check buffer status
SELECT mapping_status, COUNT(*) 
FROM device_user_buffer 
GROUP BY mapping_status;

-- Check recent audit logs
SELECT operation_type, COUNT(*) 
FROM device_user_audit_log 
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY operation_type;

-- Check sync locks
SELECT * FROM sync_locks 
WHERE expires_at > NOW();

-- Check user count history
SELECT user_count, timestamp 
FROM device_user_count_history 
ORDER BY timestamp DESC 
LIMIT 10;

-- Check conflicts
SELECT conflict_type, COUNT(*) 
FROM user_conflicts 
WHERE resolved = false 
GROUP BY conflict_type;
```

---

## Getting Help

If you're still experiencing issues:

1. **Collect diagnostic information:**
   - Server logs
   - Database query results
   - Device connectivity test results
   - API response examples

2. **Check the requirements document:**
   - `.kiro/specs/device-user-persistence-fix/requirements.md`

3. **Review the design document:**
   - `.kiro/specs/device-user-persistence-fix/design.md`

4. **Check implementation tasks:**
   - `.kiro/specs/device-user-persistence-fix/tasks.md`

---

## Prevention Tips

1. **Regular monitoring:**
   - Check buffer status daily
   - Review audit logs weekly
   - Verify backups are being created

2. **Proactive maintenance:**
   - Map unmapped users promptly
   - Resolve conflicts as they arise
   - Test backup restoration monthly

3. **System health checks:**
   - Monitor device connectivity
   - Check database performance
   - Review sync service logs

4. **Documentation:**
   - Keep track of manual interventions
   - Document any custom configurations
   - Update troubleshooting guide with new issues
