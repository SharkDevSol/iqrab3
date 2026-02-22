# AI06 Biometric Device Setup Guide

## ⚠️ CRITICAL: WebSocket Service Must Stay Enabled

The AI06 WebSocket service on port 7788 is **REQUIRED** for biometric attendance devices to connect. 

### Configuration Location

**File:** `backend/.env`

```env
# AI06 Biometric Device Configuration
AI06_WEBSOCKET_ENABLED=true    # ⚠️ NEVER set to false
AI06_WEBSOCKET_PORT=7788       # Default port for AI06 devices
AI06_DEVICE_IP=192.168.1.201   # Your device IP address
AI06_DEVICE_PORT=80            # Device HTTP port
```

### Server Code Location

**File:** `backend/server.js` (Lines ~348-365)

The WebSocket service initialization is controlled by the `AI06_WEBSOCKET_ENABLED` environment variable.

```javascript
// ===========================================
// AI06 WEBSOCKET SERVICE
// ===========================================
// CRITICAL: DO NOT DISABLE - Required for AI06 device connections
```

## Device Connection Status

Check device connection at: **http://localhost:5000/api/dashboard** (or your frontend)

You should see:
- ✅ WebSocket Server: Running (Port 7788)
- ✅ Connected Devices: 1 (or more)
- Device details: Serial number, model, connection status

## Troubleshooting

### Problem: "No Devices Connected"

**Solution 1: Check if WebSocket service is running**
```bash
netstat -ano | findstr :7788
```
If nothing appears, the service is not running.

**Solution 2: Verify .env configuration**
```env
AI06_WEBSOCKET_ENABLED=true  # Must be true
```

**Solution 3: Restart backend server**
```bash
cd backend
node server.js
```

Look for this message:
```
✅ AI06 WebSocket Service enabled on port 7788
🔌 AI06 WebSocket Server started on port 7788
📡 Waiting for AI06 devices to connect...
```

### Problem: Service was disabled in code

**Check:** `backend/server.js` around line 348

**Wrong (DISABLED):**
```javascript
// TEMPORARILY DISABLED - Port 7788 conflict
// const AI06WebSocketService = require('./services/ai06WebSocketService');
```

**Correct (ENABLED):**
```javascript
// CRITICAL: DO NOT DISABLE - Required for AI06 device connections
const AI06_ENABLED = process.env.AI06_WEBSOCKET_ENABLED !== 'false';
```

## Device Configuration

Configure your AI06 device with these settings:

1. **Server IP:** Your computer's local IP address (NOT localhost)
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Linux/Mac)
   - Example: 192.168.1.100

2. **Server Port:** 7788

3. **Protocol:** WebSocket

4. **Server Registration:** YES/Enabled

5. **Push Mode:** Enabled (for real-time attendance)

## Data Persistence

The system automatically:
- ✅ Saves all attendance logs to database
- ✅ Handles device disconnections gracefully
- ✅ Reconnects automatically when device comes back online
- ✅ Buffers unmapped users for later assignment

### If you delete data or change devices:

1. **Device users are backed up** in `device_user_buffer` table
2. **Attendance logs are permanent** in `hr_ethiopian_attendance` and `academic_student_attendance`
3. **Device mappings** are stored in `user_machine_mapping` table

### To restore after data loss:

```bash
cd backend
node backup-ai06-users.js    # Creates backup
node restore-ai06-users.js   # Restores from backup
```

## Monitoring Services

The following services run automatically on server start:

1. **Device User Monitoring** - Polls device every 5 minutes
2. **Auto Backup Service** - Backs up device users every 6 hours
3. **Sync Coordinator** - Prevents duplicate operations
4. **Attendance Auto-Marker** - Marks absent staff/students automatically

## Important Files

- `backend/server.js` - Main server with WebSocket initialization
- `backend/services/ai06WebSocketService.js` - WebSocket handler
- `backend/.env` - Configuration settings
- `backend/routes/deviceUserManagement.js` - Device user management API

## Emergency Recovery

If the WebSocket service gets disabled accidentally:

1. Open `backend/.env`
2. Set `AI06_WEBSOCKET_ENABLED=true`
3. Restart server: `node server.js`
4. Verify in logs: "✅ AI06 WebSocket Service enabled"

## Version Control

When committing code changes:
- ✅ Always keep `AI06_WEBSOCKET_ENABLED=true` in .env
- ✅ Never commit commented-out WebSocket service code
- ✅ Document any changes to AI06 service in commit messages

---

**Last Updated:** February 21, 2026
**Status:** ✅ Service Running and Connected
