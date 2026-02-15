# 🔧 Fix: Port 7788 Already in Use

## ❌ Error Message
```
Error: listen EADDRINUSE: address already in use :::7788
```

## 🎯 What This Means
Port 7788 (used by AI06 WebSocket service) is already being used by another process. This usually happens when:
- Backend server is already running
- Previous server didn't shut down properly
- Another application is using port 7788

## ✅ Solution (Choose One)

### Option 1: Use Batch File (Easiest)
```bash
RESTART_BACKEND_CLEAN.bat
```
This will:
1. Kill all Node.js processes
2. Wait 2 seconds
3. Start backend in new window

### Option 2: Manual Kill (PowerShell)
```powershell
# Kill all Node.js processes
taskkill /F /IM node.exe

# Wait a moment
timeout /t 2

# Start backend
cd backend
node server.js
```

### Option 3: Find and Kill Specific Process
```powershell
# Find process using port 7788
netstat -ano | findstr :7788

# You'll see output like:
# TCP    0.0.0.0:7788    0.0.0.0:0    LISTENING    12345
#                                                   ^^^^^ PID

# Kill that specific process (replace 12345 with actual PID)
taskkill /F /PID 12345
```

### Option 4: Use Different Port (Temporary)
If you need to test quickly, modify the port:

**File:** `backend/server.js`
```javascript
// Change this line (around line 263):
const ai06Service = new AI06WebSocketService(7788);

// To:
const ai06Service = new AI06WebSocketService(7789);
```

Then update AI06 device configuration to use port 7789.

## 🔍 Verify Port is Free

**PowerShell:**
```powershell
Get-NetTCPConnection -LocalPort 7788 -ErrorAction SilentlyContinue
```

**If empty:** Port is free ✅
**If shows data:** Port is in use ❌

## 🚀 After Fixing

1. **Start backend:**
   ```bash
   cd backend
   node server.js
   ```

2. **Look for:**
   ```
   Server running on port 5000
   🔌 AI06 WebSocket Server started on port 7788
   ```

3. **Test:**
   ```
   http://localhost:5173/live-attendance
   ```

## 🛡️ Prevent This Issue

### Use Nodemon (Auto-restart)
```bash
# Install nodemon globally
npm install -g nodemon

# Start with nodemon
cd backend
nodemon server.js
```

Nodemon will automatically restart when you make changes and handle cleanup better.

### Proper Shutdown
Always stop the server with:
- **Ctrl+C** in the terminal
- Not by closing the terminal window

### Check Before Starting
```bash
# Check if port is in use
netstat -ano | findstr :7788

# If nothing shows, port is free
```

## 📝 Common Scenarios

### Scenario 1: "I closed the terminal but server is still running"
**Solution:** Use `RESTART_BACKEND_CLEAN.bat` or `taskkill /F /IM node.exe`

### Scenario 2: "I have multiple Node.js apps running"
**Solution:** Kill only the specific process using port 7788 (Option 3 above)

### Scenario 3: "Port 7788 is used by another application"
**Solution:** Either:
- Stop that application
- Or use Option 4 (change port)

### Scenario 4: "Error persists after killing processes"
**Solution:**
1. Restart your computer (clears all ports)
2. Or wait 30 seconds (Windows releases ports slowly)
3. Or use `netstat -ano | findstr :7788` to verify it's really free

## 🎯 Quick Reference

| Problem | Solution |
|---------|----------|
| Port in use | `RESTART_BACKEND_CLEAN.bat` |
| Multiple Node processes | `taskkill /F /IM node.exe` |
| Specific process | Find PID, then `taskkill /F /PID <PID>` |
| Need different port | Change in `server.js` line 263 |
| Verify port free | `netstat -ano \| findstr :7788` |

## ✅ Success Indicators

After fixing, you should see:
```
HTTP server created (development mode)
🔌 AI06 WebSocket Server started on port 7788
Server running on port 5000
Dashboard endpoints available at:
  http://localhost:5000/api/dashboard/stats
  ...
```

**No errors!** ✅

## 🆘 Still Not Working?

1. **Restart computer** - This clears all ports
2. **Check firewall** - May be blocking port 7788
3. **Try different port** - Use 7789 or 8788
4. **Check antivirus** - May be blocking Node.js

## 💡 Pro Tips

1. **Always use Ctrl+C** to stop the server properly
2. **Use nodemon** for development (auto-restart)
3. **Keep one terminal** for backend, one for frontend
4. **Check ports before starting** with netstat
5. **Use batch files** for quick restart

---

**Most Common Fix:** Just run `RESTART_BACKEND_CLEAN.bat` and you're done! 🎉
