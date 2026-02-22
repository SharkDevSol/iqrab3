# AI06 Biometric Attendance System

## 🎯 System Overview

This system connects AI06 biometric devices (fingerprint/face recognition) to automatically record staff and student attendance in real-time.

**Current Status:** ✅ ACTIVE AND CONNECTED

---

## 📁 Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `AI06_QUICK_REFERENCE.md` | Quick troubleshooting | Device not connecting |
| `AI06_DEVICE_SETUP_GUIDE.md` | Complete setup guide | Initial setup or recovery |
| `AI06_README.md` | This file - system overview | Understanding the system |

---

## 🔧 System Components

### 1. WebSocket Server (Port 7788)
- **Location:** `backend/services/ai06WebSocketService.js`
- **Purpose:** Listens for device connections and attendance logs
- **Status Check:** Dashboard → Device Connection Status

### 2. Configuration
- **File:** `backend/.env`
- **Key Settings:**
  ```env
  AI06_WEBSOCKET_ENABLED=true    # Must be true!
  AI06_WEBSOCKET_PORT=7788
  AI06_DEVICE_IP=192.168.1.201
  ```

### 3. Database Tables
- `hr_ethiopian_attendance` - Staff attendance records
- `academic_student_attendance` - Student attendance records
- `device_user_buffer` - Unmapped device users
- `user_machine_mapping` - Device ID to person mapping

### 4. Monitoring Services
- **Device User Monitoring** - Polls device every 5 minutes
- **Auto Backup** - Backs up device users every 6 hours
- **Sync Coordinator** - Prevents duplicate operations

---

## 🚀 Quick Start

### First Time Setup

1. **Configure Device:**
   - Server IP: Your computer's local IP (run `ipconfig`)
   - Server Port: 7788
   - Protocol: WebSocket
   - Server Reg: YES

2. **Start Server:**
   ```bash
   cd backend
   npm start
   ```

3. **Verify Connection:**
   - Open Dashboard → Device Connection Status
   - Should show: "1 Connected Device"

### Daily Operation

The system runs automatically. No manual intervention needed.

**Attendance Flow:**
1. Person scans fingerprint/face on device
2. Device sends log to WebSocket server (port 7788)
3. Server identifies person (staff or student)
4. Attendance saved to database
5. Dashboard updates in real-time

---

## 🔍 Health Checks

### Before Starting Server

```bash
npm run check:ai06
```

This validates:
- ✅ Service enabled in .env
- ✅ Port 7788 available
- ✅ Service files exist
- ✅ No code conflicts

### After Starting Server

Check server logs for:
```
✅ AI06 WebSocket Service enabled on port 7788
🔌 AI06 WebSocket Server started on port 7788
📡 Waiting for AI06 devices to connect...
```

### In Dashboard

Navigate to: **Device Connection Status**

Expected:
- WebSocket Server: ✅ Running (Port 7788)
- Connected Devices: 1 (or more)
- Device details visible

---

## 🛠️ Troubleshooting

### Problem: "No Devices Connected"

**Step 1:** Check if service is enabled
```bash
npm run check:ai06
```

**Step 2:** Verify .env configuration
```env
AI06_WEBSOCKET_ENABLED=true  ← Must be true
```

**Step 3:** Restart server
```bash
cd backend
npm start
```

**Step 4:** Check device configuration
- Server IP must be your LOCAL IP (not localhost)
- Server Port must be 7788
- Protocol must be WebSocket

### Problem: "Service Disabled After Update"

This happens if someone comments out the WebSocket code.

**Fix:**
1. Open `backend/server.js`
2. Go to line ~348
3. Ensure code is NOT commented out:
   ```javascript
   // Should look like this:
   const AI06WebSocketService = require('./services/ai06WebSocketService');
   
   // NOT like this:
   // const AI06WebSocketService = require('./services/ai06WebSocketService');
   ```

### Problem: "Port 7788 Already in Use"

**Check what's using the port:**
```bash
# Windows
netstat -ano | findstr :7788

# Linux/Mac
lsof -i :7788
```

**Solution:**
- If it's your server: OK, already running
- If it's another process: Stop that process or change AI06 port

---

## 🔐 Data Protection

### Automatic Backups

Device users are backed up every 6 hours to:
- Database table: `device_user_buffer`
- Backup files: `backend/backups/ai06-users-*.json`

### Manual Backup

```bash
cd backend
node backup-ai06-users.js
```

### Restore from Backup

```bash
cd backend
node restore-ai06-users.js
```

---

## 📊 Monitoring & Logs

### Real-Time Monitoring

Dashboard shows:
- Connected devices count
- Last update time
- Device details (serial, model)
- Connection status

### Server Logs

Watch for these messages:
- `📱 NEW DEVICE CONNECTION` - Device connected
- `📨 RAW MESSAGE RECEIVED` - Attendance log received
- `✅ Attendance saved` - Successfully processed
- `📴 DEVICE DISCONNECTED` - Device disconnected

### Database Queries

Check recent attendance:
```sql
-- Staff attendance (last 10)
SELECT * FROM hr_ethiopian_attendance 
ORDER BY created_at DESC LIMIT 10;

-- Student attendance (last 10)
SELECT * FROM academic_student_attendance 
ORDER BY created_at DESC LIMIT 10;
```

---

## 🔄 System Maintenance

### Weekly Tasks
- ✅ Check device connection status
- ✅ Verify attendance records are being saved
- ✅ Review unmapped users in device buffer

### Monthly Tasks
- ✅ Backup device users manually
- ✅ Clean up old backup files
- ✅ Review and update device user mappings

### After System Changes
- ✅ Run health check: `npm run check:ai06`
- ✅ Verify .env configuration
- ✅ Test device connection
- ✅ Check attendance recording

---

## 🆘 Emergency Recovery

If the system stops working completely:

### Step 1: Verify Configuration
```bash
cd backend
node check-ai06-service.js
```

### Step 2: Check .env File
```bash
# Open backend/.env
# Ensure this line exists:
AI06_WEBSOCKET_ENABLED=true
```

### Step 3: Verify Server Code
```bash
# Open backend/server.js
# Search for "AI06 WEBSOCKET SERVICE"
# Ensure code is NOT commented out
```

### Step 4: Restart Everything
```bash
# Stop server (Ctrl+C)
# Restart server
cd backend
npm start
```

### Step 5: Test Connection
- Open Dashboard → Device Connection Status
- Should show device connected
- Test by scanning on device

---

## 📞 Support Resources

### Documentation
- Quick Reference: `AI06_QUICK_REFERENCE.md`
- Setup Guide: `AI06_DEVICE_SETUP_GUIDE.md`
- This File: `AI06_README.md`

### Scripts
- Health Check: `npm run check:ai06`
- Backup Users: `node backend/backup-ai06-users.js`
- Restore Users: `node backend/restore-ai06-users.js`

### Key Files
- Service: `backend/services/ai06WebSocketService.js`
- Config: `backend/.env`
- Server: `backend/server.js` (line 348-365)

---

## ⚠️ Critical Warnings

### NEVER DO THIS:
1. ❌ Set `AI06_WEBSOCKET_ENABLED=false` in .env
2. ❌ Comment out WebSocket service in server.js
3. ❌ Delete `ai06WebSocketService.js` file
4. ❌ Change port 7788 without updating device
5. ❌ Delete device user mappings without backup

### ALWAYS DO THIS:
1. ✅ Run health check before starting server
2. ✅ Keep .env backed up
3. ✅ Document any configuration changes
4. ✅ Test after system updates
5. ✅ Monitor connection status regularly

---

## 📈 System Statistics

**Current Configuration:**
- WebSocket Port: 7788
- Connected Devices: 1
- Device Model: AI06 Face Recognition
- Device Serial: AYTE16052143
- Status: ✅ Active and Recording

**Last Updated:** February 21, 2026
**System Version:** 1.0.0
**Maintainer:** System Administrator

---

## 🎓 How It Works

### Attendance Recording Flow

```
1. Person approaches device
   ↓
2. Scans fingerprint or face
   ↓
3. Device verifies identity
   ↓
4. Device sends log via WebSocket (port 7788)
   ↓
5. Server receives log
   ↓
6. Server checks if person is staff or student
   ↓
7. Server calculates Ethiopian date
   ↓
8. Server determines status (PRESENT/LATE/etc.)
   ↓
9. Server saves to database
   ↓
10. Dashboard updates in real-time
```

### Device User Mapping

Each person has:
- **Machine ID:** Unique ID on the device (e.g., "123")
- **Person ID:** Database ID (staff_id or student_id)
- **Mapping:** Links machine ID to person ID

When device sends attendance:
1. Server receives machine ID
2. Looks up mapping to find person ID
3. Saves attendance with person details

---

**End of Documentation**

For questions or issues, refer to the troubleshooting section or check server logs.
