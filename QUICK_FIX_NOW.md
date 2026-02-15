# ⚡ QUICK FIX - Port 7788 Error

## 🎯 The Problem
```
Error: listen EADDRINUSE: address already in use :::7788
```

## ✅ The Solution (2 Steps)

### Step 1: Run This Batch File
```
RESTART_BACKEND_CLEAN.bat
```

**Double-click it!** It will:
- ✅ Kill all Node.js processes
- ✅ Wait 2 seconds
- ✅ Start backend in new window

### Step 2: Wait for Success Message
```
Server running on port 5000
🔌 AI06 WebSocket Server started on port 7788
```

**That's it!** ✅

---

## 🔄 Alternative: Manual Fix

**Open PowerShell and run:**
```powershell
taskkill /F /IM node.exe
cd backend
node server.js
```

---

## 🧪 Test It Works

1. Open: `http://localhost:5173/live-attendance`
2. Should show: **✅ Connected**
3. Test: `http://localhost:5000/api/test-attendance`
4. Log appears! 🎉

---

## 💡 Why This Happens

Port 7788 is already in use because:
- Backend is already running somewhere
- Previous server didn't close properly
- Terminal was closed without stopping server (Ctrl+C)

---

## 🛡️ Prevent It Next Time

**Always stop server with Ctrl+C** (not by closing terminal)

Or use **nodemon** for auto-restart:
```bash
npm install -g nodemon
cd backend
nodemon server.js
```

---

**Need more help?** See `FIX_PORT_IN_USE_ERROR.md` for detailed solutions.
