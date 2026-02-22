# AI06 Device - Quick Reference Card

## ✅ Current Status
- **WebSocket Service:** ENABLED ✅
- **Port:** 7788
- **Device Connected:** YES (Serial: AYTE16052143)
- **Last Check:** February 21, 2026

---

## 🚨 If Device Shows "No Connection"

### Quick Fix (3 steps):

1. **Check .env file** (`backend/.env`):
   ```env
   AI06_WEBSOCKET_ENABLED=true  ← Must be true!
   ```

2. **Restart server**:
   ```bash
   cd backend
   node server.js
   ```

3. **Look for this message**:
   ```
   ✅ AI06 WebSocket Service enabled on port 7788
   🔌 AI06 WebSocket Server started on port 7788
   ```

---

## 🔧 Health Check Command

Before starting server, run:
```bash
node backend/check-ai06-service.js
```

This will verify:
- ✅ Service is enabled in .env
- ✅ Port 7788 is available
- ✅ Service file exists
- ✅ Server.js has correct code

---

## 📍 Important File Locations

| File | Purpose | Line # |
|------|---------|--------|
| `backend/.env` | Enable/disable service | Line 18-21 |
| `backend/server.js` | Service initialization | Line 348-365 |
| `backend/services/ai06WebSocketService.js` | WebSocket handler | Full file |

---

## ⚠️ NEVER DO THIS

❌ Set `AI06_WEBSOCKET_ENABLED=false`
❌ Comment out WebSocket service in server.js
❌ Delete `ai06WebSocketService.js` file
❌ Change port 7788 without updating device

---

## 📱 Device Configuration

Configure AI06 device with:
- **Server IP:** Your computer's local IP (find with `ipconfig`)
- **Server Port:** 7788
- **Protocol:** WebSocket
- **Server Reg:** YES
- **Push Mode:** Enabled

---

## 🆘 Emergency Recovery

If service gets disabled:

```bash
# 1. Fix .env
echo AI06_WEBSOCKET_ENABLED=true >> backend/.env

# 2. Verify
node backend/check-ai06-service.js

# 3. Restart
cd backend
node server.js
```

---

## 📞 Support

- Full Guide: `AI06_DEVICE_SETUP_GUIDE.md`
- Connection Status: Dashboard → Device Connection Status
- Logs: Check server console for "AI06" messages

---

**Last Updated:** February 21, 2026
**Device Status:** ✅ Connected and Working
