# 🔍 Live Attendance Monitor - Debug Guide

## Issue
Live Attendance Monitor page shows "Waiting for face scans..." but logs don't appear when someone scans their face on the AI06 device.

## ✅ What's Already Working
1. ✅ AI06 device connects to backend (port 7788)
2. ✅ Backend receives attendance logs from device
3. ✅ `socket.io-client` is installed in frontend
4. ✅ Route is added to App.jsx (`/live-attendance`)
5. ✅ CSS file exists and is imported

## 🔍 Debugging Steps

### Step 1: Test Socket.IO Connection (Simple Test)
1. **Open this URL in your browser:**
   ```
   http://localhost:5000/test-socketio.html
   ```

2. **You should see:**
   - ✅ Connected (ID: xyz123...)
   - If you see "❌ Disconnected", Socket.IO server has an issue

3. **Test the connection:**
   - Click "Test Emit Event" button
   - Check backend console for any logs

### Step 2: Test Live Attendance Page
1. **Open the Live Attendance Monitor:**
   ```
   http://localhost:5173/live-attendance
   ```

2. **Open Browser Console (F12)**
   - Look for these messages:
   ```
   🔌 Connecting to Socket.IO server...
   ✅ Connected to server! Socket ID: xyz123...
   Socket connected? true
   Socket ID: xyz123...
   ```

3. **If you see connection errors:**
   - Check if backend is running on port 5000
   - Check CORS settings
   - Try refreshing the page

### Step 3: Test with Real Face Scan
1. **Make sure backend is running:**
   ```bash
   cd backend
   node server.js
   ```

2. **Watch backend console for:**
   ```
   ✅ Socket.IO client connected: xyz123...
   Total connected clients: 1
   ```

3. **Scan a face on AI06 device**

4. **Backend should show:**
   ```
   📊 Received 1 attendance logs
   👤 Processing attendance for user ID: 4
   🔔 Broadcasting to Socket.IO clients...
   ✅ Broadcast sent to all connected clients
   ```

5. **Frontend console should show:**
   ```
   📊 NEW ATTENDANCE RECEIVED: {userId: 4, name: "User 4", ...}
   Adding log: {userId: 4, ...}
   Updated logs count: 1
   ```

6. **Page should display:**
   - New log card with animation
   - Stats updated (Total Logs: 1)

## 🐛 Common Issues & Solutions

### Issue 1: "Socket.IO client not connecting"
**Symptoms:**
- Browser console shows: `❌ Connection error`
- Status shows: `❌ Disconnected`

**Solutions:**
1. Check if backend is running: `http://localhost:5000/api/health`
2. Check CORS settings in `backend/server.js`
3. Try different transport: Change `transports: ['websocket', 'polling']` to `transports: ['polling', 'websocket']`

### Issue 2: "Connected but no logs appearing"
**Symptoms:**
- Status shows: `✅ Connected`
- Face scan works on device
- Backend receives logs
- But frontend doesn't show logs

**Solutions:**
1. Check backend console for: `🔔 Broadcasting to Socket.IO clients...`
2. If you see `⚠️ Socket.IO not initialized!`, restart backend
3. Check event name matches: `new-attendance` (both frontend and backend)
4. Check browser console for: `📊 NEW ATTENDANCE RECEIVED`

### Issue 3: "Backend not broadcasting"
**Symptoms:**
- Backend receives logs from device
- But doesn't show: `🔔 Broadcasting to Socket.IO clients...`

**Solutions:**
1. Restart backend server
2. Check if AI06 service is initialized with Socket.IO:
   ```javascript
   ai06Service.start(io);
   ```

### Issue 4: "CORS Error"
**Symptoms:**
- Browser console shows: `Access to XMLHttpRequest blocked by CORS`

**Solutions:**
1. Check `backend/server.js` CORS config includes:
   ```javascript
   origin: ['http://localhost:3000', 'http://localhost:5173']
   ```
2. Restart backend after changes

## 🧪 Manual Test Commands

### Test 1: Check Backend Health
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"OK","message":"Server is running"}`

### Test 2: Check Socket.IO Endpoint
Open browser console and run:
```javascript
const socket = io('http://localhost:5000');
socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('new-attendance', (data) => console.log('Attendance:', data));
```

### Test 3: Simulate Attendance Event (Backend)
Add this to backend console or create a test script:
```javascript
io.emit('new-attendance', {
  userId: 999,
  name: 'Test User',
  time: new Date().toISOString(),
  mode: 3,
  inout: 0
});
```

## 📝 Expected Flow

1. **AI06 Device** → Sends attendance log via WebSocket (port 7788)
2. **Backend AI06 Service** → Receives log, processes it
3. **Backend AI06 Service** → Emits `new-attendance` event via Socket.IO
4. **Socket.IO Server** → Broadcasts to all connected clients
5. **Frontend React Component** → Receives event, updates state
6. **UI** → Displays new log with animation

## 🔧 Quick Fixes

### Fix 1: Restart Everything
```bash
# Terminal 1 - Backend
cd backend
taskkill /F /IM node.exe
node server.js

# Terminal 2 - Frontend
cd APP
npm run dev
```

### Fix 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check Firewall
```powershell
# Allow port 5000
netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=5000
```

## 📞 Need More Help?

If none of these work, provide:
1. Backend console output (last 20 lines)
2. Browser console output (F12)
3. Network tab showing Socket.IO connection
4. Screenshot of the Live Attendance page

## ✅ Success Indicators

You'll know it's working when:
1. ✅ Status shows "Connected" (green)
2. ✅ Face scan on device triggers backend log
3. ✅ Backend shows "Broadcasting to Socket.IO clients..."
4. ✅ Browser console shows "NEW ATTENDANCE RECEIVED"
5. ✅ New log card appears with animation
6. ✅ Stats update (Total Logs increases)
