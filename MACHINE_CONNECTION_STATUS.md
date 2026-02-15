# 🔍 Attendance Machine Connection Status

## Quick Test

**Run this command to test the connection:**

```bash
# Double-click this file:
TEST_MACHINE_CONNECTION.bat
```

OR run manually:
```bash
cd backend
node test-machine-connection.js
```

## What the Test Checks

1. ✅ **TCP Connection** - Can we reach the machine?
2. ✅ **WebSocket Connection** - Can we connect to port 7788?
3. ✅ **Service Status** - Is the AI06 service running?
4. ✅ **Network Diagnostics** - Are we on the same network?

## Current Configuration

Based on your server.js:
- **WebSocket Port**: 7788
- **Machine IP**: Should be in `.env` file as `AI06_DEVICE_IP`
- **Service**: AI06WebSocketService is initialized ✅

## Common Issues & Solutions

### ❌ "Connection Timeout"
**Problem**: Cannot reach the machine

**Solutions**:
1. Check if machine is powered on
2. Verify machine IP address
3. Make sure both devices are on same network
4. Check firewall settings

### ❌ "WebSocket Connection Failed"
**Problem**: TCP works but WebSocket doesn't

**Solutions**:
1. Verify WebSocket port is 7788 on machine
2. Check if machine WebSocket service is enabled
3. Restart the attendance machine
4. Check machine settings for "Push Mode" or "WebSocket Mode"

### ⚠️ "Service Not Connected"
**Problem**: Connection works but service isn't active

**Solutions**:
1. Restart backend server: `npm run dev`
2. Check backend console for errors
3. Verify AI06 service initialization in server.js

## Machine Configuration

Your attendance machine should be configured with:

```
Server Type: WebSocket
Server IP: YOUR_COMPUTER_IP (e.g., 192.168.1.100)
Server Port: 7788
Push Interval: 30 seconds (or real-time)
```

## How to Find Your Computer's IP

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter

**Example**: 192.168.1.100

## Checking Backend Logs

When the backend starts, you should see:
```
🔌 AI06 WebSocket Server Ready:
   Listening on port 7788 for AI06 device
   Configure AI06 device with:
   - Server IP: YOUR_LOCAL_IP (e.g., 192.168.1.100)
   - Server Port: 7788
```

## Real-Time Connection Status

When someone scans on the machine, you should see in backend console:
```
📥 Received attendance from AI06 device
💾 Saving attendance: Machine ID 100, Name: khalid
⏰ Machine time (UTC): 2026-02-10 02:54:30
⏰ Local time (EAT): 2026-02-10 05:54:30
✅ Check-in time: 05:54:30
```

## Testing Steps

1. **Run Connection Test**
   ```bash
   TEST_MACHINE_CONNECTION.bat
   ```

2. **Check Backend Console**
   - Look for "AI06 WebSocket Server Ready"
   - Look for connection messages

3. **Test with Real Scan**
   - Scan fingerprint on machine
   - Check backend console for attendance message
   - Check attendance page for new record

4. **Verify Time Display**
   - Machine shows: 02:54:30 (UTC)
   - System should show: 05:54:30 (EAT - UTC+3)

## Troubleshooting Checklist

- [ ] Machine is powered on
- [ ] Machine IP is correct in `.env`
- [ ] Both devices on same network
- [ ] Backend server is running
- [ ] Port 7788 is not blocked by firewall
- [ ] Machine is configured for WebSocket/Push mode
- [ ] Machine has correct server IP and port
- [ ] Staff have Machine IDs assigned
- [ ] Time zone conversion is working (UTC → EAT)

## Need Help?

If connection test fails:
1. Check all items in troubleshooting checklist
2. Review backend console logs
3. Check machine display for connection status
4. Verify network connectivity with `ping MACHINE_IP`
5. Check Windows Firewall settings for port 7788

## Files to Check

- `backend/.env` - Machine IP configuration
- `backend/server.js` - AI06 service initialization
- `backend/services/ai06WebSocketService.js` - Connection logic
- Backend console - Real-time connection logs
