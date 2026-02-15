# ✅ Live Attendance Monitor - Quick Checklist

## Before Testing

- [ ] Backend is running: `cd backend && node server.js`
- [ ] Frontend is running: `cd APP && npm run dev`
- [ ] AI06 device is connected (optional for initial test)

## Test 1: Basic Connection

1. [ ] Open: `http://localhost:5173/live-attendance`
2. [ ] Status shows: **✅ Connected** (green badge)
3. [ ] Browser console (F12) shows: `✅ Connected to server! Socket ID: ...`
4. [ ] No errors in console

**If failed:** Check backend is running on port 5000

## Test 2: Manual Event Trigger

1. [ ] Open new tab: `http://localhost:5000/api/test-attendance`
2. [ ] See JSON response with `"success": true`
3. [ ] Response shows `"connectedClients": 1` (or more)
4. [ ] Switch back to Live Attendance page
5. [ ] **New log appears** with:
   - User ID: 999
   - Name: "Test User"
   - 😊 Face ID icon
   - 📥 Check In badge (green)
   - Slide-in animation
6. [ ] Stats update: Total Logs = 1, Check Ins = 1

**If failed:** Check browser console for errors

## Test 3: Real Face Scan (AI06 Device)

1. [ ] AI06 device is connected to Wi-Fi
2. [ ] Backend shows: `✅ Device registered: AYTE16052143`
3. [ ] Scan face on AI06 device
4. [ ] Backend console shows:
   ```
   📊 Received 1 attendance logs
   🔔 Broadcasting to Socket.IO clients...
   ✅ Broadcast sent to all connected clients
   ```
5. [ ] Live Attendance page shows new log **instantly**
6. [ ] Log shows correct:
   - User ID
   - Timestamp
   - Mode (Face ID)
   - Check In/Out

**If failed:** Check AI06 device connection

## Troubleshooting Quick Fixes

### Fix 1: Restart Backend
```bash
cd backend
taskkill /F /IM node.exe
node server.js
```

### Fix 2: Refresh Frontend
- Press Ctrl+Shift+R (hard refresh)
- Or close and reopen browser tab

### Fix 3: Check Ports
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Check if port 7788 is in use (AI06)
netstat -ano | findstr :7788
```

### Fix 4: Test Socket.IO Separately
Open: `http://localhost:5000/test-socketio.html`
- Should show: ✅ Connected

## Expected Backend Console Output

```
Server running on port 5000
🔌 AI06 WebSocket Server started on port 7788
✅ Socket.IO client connected: abc123...
   Total connected clients: 1
```

When face scanned:
```
📱 New device connected from ::ffff:172.21.8.43
✅ Device registered: AYTE16052143
📊 Received 1 attendance logs
👤 Processing attendance for user ID: 4
🔔 Broadcasting to Socket.IO clients...
✅ Broadcast sent to all connected clients
```

## Expected Frontend Console Output

```
🔌 Connecting to Socket.IO server...
✅ Connected to server! Socket ID: abc123...
Socket connected? true
Socket ID: abc123...
```

When event received:
```
📊 NEW ATTENDANCE RECEIVED: {userId: 4, name: "User 4", ...}
Adding log: {userId: 4, ...}
Updated logs count: 1
```

## Success Criteria

✅ All 3 tests pass
✅ No errors in console
✅ Logs appear instantly (< 1 second)
✅ Animations work smoothly
✅ Stats update correctly
✅ Connection stable (no disconnects)

## If Everything Works

**🎉 CONGRATULATIONS!** Your Live Attendance Monitor is working perfectly!

You can now:
- Monitor attendance in real-time
- See who's checking in/out
- Track daily attendance
- Use it for security monitoring
- Display on a big screen in the office

## If Something Doesn't Work

1. Read: `LIVE_ATTENDANCE_DEBUG_GUIDE.md`
2. Check backend logs
3. Check browser console
4. Test with: `http://localhost:5000/api/test-attendance`
5. Restart everything

## Quick Test Command

**Windows:**
```bash
TEST_LIVE_ATTENDANCE.bat
```

This will:
1. Open Live Attendance page
2. Trigger test event
3. Show you if it's working

---

**Need help?** Check the debug guide or provide:
- Backend console output
- Browser console output
- Screenshot of the page
