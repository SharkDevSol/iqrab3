# Device User Persistence Fix - Deployment Guide

## Overview

This deployment guide will help you implement the device user persistence fix that prevents users from randomly disappearing from your AI06 biometric device.

## What This Fix Does

✅ **Prevents user deletion** - Sync services will NEVER delete users from the device  
✅ **Buffers unmapped users** - Users added directly to the device are preserved in a staging table  
✅ **Distributed locking** - Prevents sync conflicts between multiple services  
✅ **Real-time monitoring** - Detects and alerts when users disappear  
✅ **Automatic backups** - Creates backups every 6 hours  
✅ **Admin interface** - View and map unmapped users easily

## Prerequisites

- PostgreSQL database running
- AI06 device accessible at 192.168.1.201 (or update IP in config)
- Node.js backend server
- Admin access to the system

## Deployment Steps

### Step 1: Database Migration

The database schema has already been created (Task 1 completed). Verify the tables exist:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'device_user_buffer',
  'sync_locks',
  'user_conflicts',
  'device_user_audit_log',
  'device_user_count_history'
);
```

If any tables are missing, they were created in Task 1.

### Step 2: Update Environment Variables (Optional)

Add these optional environment variables to your `.env` file:

```env
# Device User Persistence Configuration
AI06_DEVICE_IP=192.168.1.201
AI06_DEVICE_PORT=80
SYNC_LOCK_TIMEOUT=300
MONITORING_INTERVAL=5
BACKUP_INTERVAL=6
BACKUP_RETENTION=30
BUFFER_RETENTION=90
```

### Step 3: Run Migration Script

This script will populate the buffer with any existing unmapped users:

```bash
cd backend
node migrate-device-users-to-buffer.js
```

Expected output:
```
========================================
Device User Buffer Migration
========================================

📡 Connecting to AI06 device...
✅ Retrieved X users from device

🔍 Identifying unmapped users...
  ✅ Buffered: User Name (ID: 100)
  ✅ Buffered: User Name (ID: 101)

========================================
Migration Summary:
========================================
📊 Total device users: X
✅ Mapped users: X
⚠️  Unmapped users: X
💾 Newly buffered: X
========================================
```

### Step 4: Restart Server

Restart your Node.js backend server to initialize the new services:

```bash
# Stop the server (Ctrl+C if running)
# Then start it again
cd backend
node server.js
```

You should see these new log messages:

```
🔧 Initializing Device User Persistence Services...
✅ Sync Coordinator cleanup task started
✅ Device User Monitoring Service started
✅ Automatic Backup Service started (every 6 hours)
✅ All Device User Persistence Services initialized
```

### Step 5: Verify Services Are Running

Check that all services are operational:

1. **Check monitoring status:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/status
```

2. **Check buffer statistics:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/buffer/statistics
```

3. **List backups:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/backups
```

### Step 6: Map Unmapped Users (If Any)

If the migration found unmapped users, you need to map them to staff records:

1. **View unmapped users:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/buffer?status=unmapped
```

2. **Map a user to a staff record:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"personId": 123, "personType": "staff"}' \
  http://localhost:5000/api/device-users/buffer/BUFFER_ID/map
```

## Verification

### Test 1: Add a User Directly to Device

1. Add a new user directly to the AI06 device (ID: 999, Name: "Test User")
2. Wait 5 minutes for the monitoring service to detect it
3. Check the buffer:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/buffer?status=unmapped
```
4. You should see "Test User" in the buffer

### Test 2: Verify Users Don't Disappear

1. Add multiple users to the device
2. Wait for sync operations to run (check logs)
3. Verify all users are still on the device
4. Check audit logs to confirm no deletions occurred

### Test 3: Check Backups

1. Wait for the first backup to be created (or trigger manually)
2. List backups:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/backups
```
3. Verify backup files exist in `backend/backups/` directory

## Monitoring

### Real-time Monitoring

The monitoring service polls the device every 5 minutes and:
- Tracks user count changes
- Logs warnings if users disappear
- Sends alerts to administrators
- Maintains historical data

View monitoring history:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/history?hours=24
```

### Check for Missing Users

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/missing
```

## Rollback Procedure

If you need to rollback this deployment:

### Step 1: Stop Services

Edit `backend/server.js` and comment out the service initialization:

```javascript
// Comment out these lines:
// deviceUserMonitoringService.startMonitoring(5);
// backupRestoreService.startAutoBackup(6);
```

### Step 2: Restart Server

```bash
cd backend
node server.js
```

### Step 3: (Optional) Remove Database Tables

Only if you want to completely remove the feature:

```sql
DROP TABLE IF EXISTS device_user_count_history;
DROP TABLE IF EXISTS device_user_audit_log;
DROP TABLE IF EXISTS user_conflicts;
DROP TABLE IF EXISTS sync_locks;
DROP TABLE IF EXISTS device_user_buffer;
```

## Troubleshooting

See `DEVICE_USER_PERSISTENCE_TROUBLESHOOTING.md` for common issues and solutions.

## API Endpoints

All endpoints require authentication (Bearer token).

### Buffer Management
- `GET /api/device-users/buffer` - List unmapped users
- `POST /api/device-users/buffer/:id/map` - Map user to staff record
- `GET /api/device-users/buffer/statistics` - Get buffer statistics

### Monitoring
- `GET /api/device-users/monitoring/status` - Current device status
- `GET /api/device-users/monitoring/history` - User count history
- `GET /api/device-users/monitoring/missing` - Check for missing users

### Backups
- `GET /api/device-users/backups` - List available backups
- `POST /api/device-users/backups/create` - Create backup manually
- `POST /api/device-users/backups/:filename/restore` - Restore from backup

### Conflicts
- `GET /api/device-users/conflicts` - List unresolved conflicts
- `POST /api/device-users/conflicts/:id/resolve` - Resolve a conflict

## Success Criteria

✅ Migration script runs successfully  
✅ Server starts with all services initialized  
✅ Monitoring service detects device users  
✅ Backups are created automatically  
✅ Unmapped users appear in buffer  
✅ Users never disappear from device  

## Support

If you encounter issues:
1. Check server logs for errors
2. Verify device connectivity: `curl http://192.168.1.201/`
3. Check database connectivity
4. Review `DEVICE_USER_PERSISTENCE_TROUBLESHOOTING.md`

## Next Steps

After successful deployment:
1. Monitor the system for 24-48 hours
2. Map any unmapped users to staff records
3. Review audit logs regularly
4. Test backup restoration procedure
5. Configure alerts for user disappearances
