# ✅ Machine IP Address Updated

## Summary
All references to the biometric device IP address have been updated from **192.168.1.201** to **192.168.1.2**

---

## Files Updated (15 files)

### Configuration Files
1. ✅ `backend/.env` - Main environment configuration
2. ✅ `backend/config/deviceUserPersistence.config.js` - Device persistence config

### Service Files
3. ✅ `backend/server.js` - Main server file
4. ✅ `backend/services/DeviceUserMonitoringService.js` - Device monitoring (3 locations)

### Utility Scripts
5. ✅ `backend/auto-restore-users.js` - Auto restore users
6. ✅ `backend/backup-ai06-users.js` - Backup device users
7. ✅ `backend/migrate-device-users-to-buffer.js` - User migration
8. ✅ `backend/monitor-device-users.js` - User monitoring
9. ✅ `backend/restore-ai06-users.js` - Restore users
10. ✅ `backend/sync-ai06-to-staff.js` - Sync to staff
11. ✅ `backend/test-device-protection.js` - Test protection
12. ✅ `backend/test-machine-connection.js` - Test connection

### Database Update
13. ✅ `UPDATE_MACHINE_IP.sql` - SQL script to update database
14. ✅ `UPDATE_MACHINE_IP_IN_DATABASE.bat` - Batch file to run SQL update

---

## Port Configuration

### Current Port Settings (No Change Needed)
- **HTTP Port**: 80 (standard for AI06 device)
- **WebSocket Port**: 7788 (for real-time communication)
- **TCP Port**: 4370 (for direct TCP communication)

**Note**: Port 80 is the standard HTTP port for the AI06 biometric device. You only need to change it if your device is configured to use a different port.

---

## Next Steps

### 1. Update Database (Important!)
Run this to update IP addresses stored in the database:

**Option A: Using Batch File**
```bash
UPDATE_MACHINE_IP_IN_DATABASE.bat
```

**Option B: Using psql directly**
```bash
psql -U postgres -d school_management2 -f UPDATE_MACHINE_IP.sql
```

### 2. Restart Backend Server
After updating the database, restart your backend:

```bash
# Stop the server (Ctrl+C if running)
# Then start again
cd backend
npm start
```

### 3. Test Connection
Test if the device connects with the new IP:

```bash
cd backend
node test-machine-connection.js
```

You should see:
- ✅ Testing connection to 192.168.1.2
- ✅ WebSocket connection successful
- ✅ Device responding

---

## Verification Checklist

- [ ] Backend server restarted
- [ ] Database IP addresses updated (run UPDATE_MACHINE_IP.sql)
- [ ] Test connection successful (node test-machine-connection.js)
- [ ] Device appears online in admin panel
- [ ] Attendance records are being received
- [ ] Staff can register fingerprints

---

## Troubleshooting

### Device Not Connecting?

1. **Check Device IP**
   - Verify device is actually at 192.168.1.2
   - Check device network settings
   - Ping the device: `ping 192.168.1.2`

2. **Check Network**
   - Ensure device and server are on same network
   - Check firewall settings
   - Verify router configuration

3. **Check Ports**
   - Port 80 should be open on device
   - Port 7788 should be open for WebSocket
   - Test: `telnet 192.168.1.2 80`

4. **Check Backend Logs**
   - Look for connection errors
   - Check WebSocket status
   - Verify device communication

### Still Having Issues?

Run the connection test:
```bash
cd backend
node test-machine-connection.js
```

Check the output for specific error messages.

---

## Device Port Information

### When to Change Port

You need to change the port ONLY if:
- Your device is configured to use a different HTTP port (not 80)
- You have multiple devices on different ports
- Your network requires a specific port

### How to Change Port (if needed)

1. **Update .env file**
   ```env
   AI06_DEVICE_PORT=8080  # Change to your port
   ```

2. **Restart backend**
   ```bash
   npm start
   ```

### Standard Ports (Current Configuration)
- **AI06_DEVICE_PORT=80** - HTTP communication (standard)
- **AI06_WEBSOCKET_PORT=7788** - WebSocket for real-time data
- These are the default ports and work for most setups

---

## Summary

✅ **IP Address**: Updated from 192.168.1.201 to 192.168.1.2
✅ **Port**: 80 (no change needed - this is standard)
✅ **Files Updated**: 15 files
⏳ **Next**: Run UPDATE_MACHINE_IP_IN_DATABASE.bat to update database

---

## Quick Test

After updating, test the connection:

```bash
# 1. Update database
UPDATE_MACHINE_IP_IN_DATABASE.bat

# 2. Restart backend
cd backend
npm start

# 3. In another terminal, test connection
cd backend
node test-machine-connection.js
```

If you see "✅ Connection successful", you're all set! 🎉
