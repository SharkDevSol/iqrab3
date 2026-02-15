# Server Start Guide - Port 5000 Issue Fixed

## ✅ Problem Solved

The error `EADDRINUSE: address already in use :::5000` has been resolved.

**What happened:**
- Port 5000 was already in use by another Node.js process (PID: 26912)
- The old process has been terminated
- Port 5000 is now available

---

## 🚀 Start Your Server Now

### Option 1: Using npm (Recommended)
```bash
cd backend
npm run dev
```

### Option 2: Using node directly
```bash
cd backend
node server.js
```

---

## 🔍 If Port Issue Happens Again

### Quick Fix - Use the Scripts (Easiest):

**Option 1: Kill only port 5000 process**
```powershell
cd backend
.\kill-port-5000.ps1
```

**Option 2: Kill all Node processes (use with caution)**
```powershell
cd backend
.\kill-all-node.ps1
```

### Manual Fix - PowerShell Commands:

**Check what's using port 5000:**
```powershell
Get-NetTCPConnection -LocalPort 5000 | Select-Object LocalPort, OwningProcess, State
```

**Find the process details:**
```powershell
Get-Process -Id <PROCESS_ID>
```

**Kill the specific process:**
```powershell
Stop-Process -Id <PROCESS_ID> -Force
```

**Kill all Node processes (use with caution):**
```powershell
Get-Process node | Stop-Process -Force
```

---

## 🛠️ Alternative: Change Port

If you want to use a different port, edit `backend/.env`:

```env
PORT=5001
```

Or edit `backend/server.js` line 203:
```javascript
const PORT = process.env.PORT || 5001;
```

---

## ✅ Expected Output When Server Starts

You should see:
```
HTTP server created (development mode)
Server running on port 5000
Dashboard endpoints available at:
  http://localhost:5000/api/dashboard/stats
  http://localhost:5000/api/dashboard/recent-faults
  http://localhost:5000/api/dashboard/top-offenders

🤖 Machine Webhook Ready:
   Listening for AI06 machine at: http://10.22.134.159:5000/api/machine-webhook
   Machine should push data directly to this endpoint
```

---

## 🧪 Test Your Server

Once started, test with:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Or open in browser
http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 📊 Test New Dashboard Endpoints

```bash
# Test finance summary (requires authentication)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/reports/finance/summary

# Test inventory summary
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/reports/inventory/summary

# Test HR summary
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/reports/hr/summary

# Test asset summary
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/reports/assets/summary
```

---

## 🎯 Next Steps

1. ✅ Start backend server: `cd backend && npm run dev`
2. ✅ Start frontend: `cd APP && npm run dev`
3. ✅ Login to dashboard
4. ✅ Test new Finance, Inventory, HR, Asset tabs

---

## 💡 Pro Tips

### Prevent Port Conflicts
- Always stop the server properly (Ctrl+C) instead of closing terminal
- Use nodemon for auto-restart during development
- Check for running processes before starting

### Quick Commands
```bash
# Check if server is running
curl http://localhost:5000/api/health

# View all Node processes
Get-Process node

# Kill all Node processes (emergency)
taskkill /F /IM node.exe
```

---

## 🐛 Common Issues

### Issue: "Cannot find module"
**Solution:** Run `npm install` in backend folder

### Issue: "Database connection failed"
**Solution:** Check PostgreSQL is running and .env has correct credentials

### Issue: "JWT token invalid"
**Solution:** Login again to get fresh token

### Issue: Port still in use after killing process
**Solution:** Wait 30 seconds or restart your computer

---

**Status:** ✅ Ready to start server  
**Port:** 5000 (Available)  
**Last Updated:** January 31, 2026
