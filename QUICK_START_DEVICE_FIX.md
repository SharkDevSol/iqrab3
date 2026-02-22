# Quick Start: Fix Device User Persistence Issue

## Problem
Users added to your AI06 biometric device randomly disappear after a few minutes.

## Solution Implemented
✅ All sync services now operate in READ-ONLY mode (never delete users)  
✅ Unmapped users are buffered and preserved  
✅ Real-time monitoring detects disappearances  
✅ Automatic backups every 6 hours  
✅ Distributed locking prevents sync conflicts  

## Quick Start (3 Steps)

### Step 1: Run Migration Script
```bash
cd backend
node migrate-device-users-to-buffer.js
```

This will:
- Connect to your AI06 device (192.168.1.201)
- Find all users on the device
- Identify unmapped users
- Add them to the buffer table

### Step 2: Restart Your Server
```bash
# Stop the server (Ctrl+C)
# Then start it again
node server.js
```

Look for these messages:
```
🔧 Initializing Device User Persistence Services...
✅ Sync Coordinator cleanup task started
✅ Device User Monitoring Service started
✅ Automatic Backup Service started (every 6 hours)
✅ All Device User Persistence Services initialized
```

### Step 3: Verify It's Working
```bash
# Check monitoring status (replace YOUR_TOKEN with your admin token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/monitoring/status
```

## What Happens Now?

### Automatic Protection
- **Every 5 minutes**: System checks device for user changes
- **Every 6 hours**: Automatic backup of all device users
- **On every sync**: Users are preserved, never deleted
- **Real-time**: Alerts if users disappear

### If You Add Users Directly to Device
1. Add user to device (e.g., ID: 100, Name: "John Doe")
2. Within 5 minutes, system detects the new user
3. User is added to buffer table as "unmapped"
4. You can map the user to a staff record via API

### View Unmapped Users
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/buffer?status=unmapped
```

### Map a User to Staff Record
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"personId": 123, "personType": "staff"}' \
  http://localhost:5000/api/device-users/buffer/BUFFER_ID/map
```

## Testing

### Test 1: Add a User
1. Add a test user to the device (ID: 999)
2. Wait 5 minutes
3. Check if user is still on device ✅
4. Check if user appears in buffer ✅

### Test 2: Verify Backups
```bash
# List backups
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/device-users/backups

# Check backup directory
ls -la backend/backups/
```

## Important Notes

⚠️ **Users will NEVER be deleted from the device automatically**  
✅ **All existing sync functionality continues to work**  
✅ **Attendance syncing is not affected**  
✅ **Database deletions do NOT affect device users**  

## If Something Goes Wrong

See `DEVICE_USER_PERSISTENCE_TROUBLESHOOTING.md` for detailed troubleshooting.

Quick checks:
```bash
# 1. Check if services are running
grep "Device User Persistence Services" backend/logs/server.log

# 2. Check database tables exist
psql -d school_management2 -c "\dt device_*"

# 3. Test device connectivity
curl http://192.168.1.201/

# 4. Check buffer table
psql -d school_management2 -c "SELECT COUNT(*) FROM device_user_buffer;"
```

## API Endpoints

All endpoints require authentication (Bearer token).

### Buffer Management
- `GET /api/device-users/buffer` - List unmapped users
- `POST /api/device-users/buffer/:id/map` - Map user to staff
- `GET /api/device-users/buffer/statistics` - Get statistics

### Monitoring
- `GET /api/device-users/monitoring/status` - Current status
- `GET /api/device-users/monitoring/history` - History
- `GET /api/device-users/monitoring/missing` - Check missing users

### Backups
- `GET /api/device-users/backups` - List backups
- `POST /api/device-users/backups/create` - Create backup
- `POST /api/device-users/backups/:filename/restore` - Restore

## Success!

If you see:
- ✅ Migration completed successfully
- ✅ Server started with all services
- ✅ Monitoring status returns data
- ✅ Users no longer disappear

**Your system is now protected!**

## Full Documentation

- **Deployment Guide**: `DEVICE_USER_PERSISTENCE_DEPLOYMENT.md`
- **Troubleshooting**: `DEVICE_USER_PERSISTENCE_TROUBLESHOOTING.md`
- **Requirements**: `.kiro/specs/device-user-persistence-fix/requirements.md`
- **Design**: `.kiro/specs/device-user-persistence-fix/design.md`
- **Tasks**: `.kiro/specs/device-user-persistence-fix/tasks.md`
