# 🤖 AI06 Machine Direct Connection Guide

## 🎯 GOAL

Connect your AI06 Face Recognition Machine **directly** to your server (no AAS software needed).

---

## ✅ CURRENT STATUS

Your system is ready! Here's what's configured:

- ✅ Database schema created
- ✅ Webhook endpoints ready and listening
- ✅ Network connectivity verified
- ✅ Server can receive data
- ✅ Your laptop IP: `10.22.134.159`
- ✅ Machine IP: `10.22.134.43`

---

## ⚠️ WHAT NEEDS TO BE FIXED

### Issue #1: Machine Server IP is Wrong

**Current**: Machine is configured to push to `010.022.134.155`  
**Correct**: Should be `010.022.134.159` (your laptop IP)

This is why face check-ins don't appear in your server console!

---

## 🔧 STEP-BY-STEP FIX

### Step 1: Update Machine Server IP (2 minutes)

1. **Go to the AI06 machine**
2. **Press Menu** (enter admin password if needed)
3. **Navigate to**: Comm set → Server
4. **You should see**:
   - Server Req: Yes
   - Use domainNm: No
   - Server IP: `010.022.134.155` ← **WRONG**
   - SerPortNo: 5000

5. **Change Server IP**:
   - Select "Server IP"
   - Change to: `010.022.134.159`
   - Save

6. **Restart machine** (optional but recommended)

---

### Step 2: Create User Mappings (1 minute per user)

The machine uses User IDs (1, 2, 3...) but your database uses person_ids. We need to map them!

**Simple Command:**
```bash
cd backend
node scripts/add-mapping.js <machineUserId> <personType> <personId>
```

**Examples:**
```bash
# Map machine User ID 1 to staff member "khalid"
node scripts/add-mapping.js 1 staff khalid

# Map machine User ID 2 to student "student123"
node scripts/add-mapping.js 2 student student123

# Map machine User ID 3 to staff member "teacher1"
node scripts/add-mapping.js 3 staff teacher1
```

**List all mappings:**
```bash
node scripts/list-mappings.js
```

---

### Step 3: Start Your Server (10 seconds)

```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
🤖 Machine Webhook Ready:
   Listening for AI06 machine at: http://10.22.134.159:5000/api/machine-webhook
   Machine should push data directly to this endpoint
```

**Keep this terminal open!** You need to watch it for incoming data.

---

### Step 4: Test the Connection (1 minute)

1. **Do a face check-in** on the AI06 machine
2. **Watch your server console** immediately
3. **You should see**:

```
📥 ========================================
📥 Received data from AI06 machine
📥 ========================================
⏰ Time: 1/30/2026, 2:30:45 PM
📋 Headers: {...}
📦 Body: {...}
🔗 Query: {...}
========================================

🔍 Parsing machine data...
📊 Extracted data: { userId: '1', timestamp: '2026-01-30 14:30:45', checkType: '0' }
✅ Mapped: Machine User 1 → khalid (staff)
✅ Attendance saved: khalid at 1/30/2026, 2:30:45 PM
✅ Data processed successfully!
```

---

## 🎉 SUCCESS!

If you see the above output, **congratulations!** Your system is working!

Every time someone does face recognition:
1. Machine captures face
2. Machine pushes data to your server **instantly**
3. Server maps machine User ID to person_id
4. Attendance saved to database
5. Done! ✅

---

## 🔍 VERIFICATION

### Check System Status
```bash
cd backend
npm run status
```

This shows:
- Network configuration ✅
- Machine settings ✅
- User mappings ✅
- Recent attendance records ✅
- Webhook activity ✅

### Check Attendance Records
```bash
cd backend
npm run status
```

Look for the "📊 ATTENDANCE RECORDS" section to see recent check-ins.

### Check Webhook Log
```bash
cd backend
type machine-webhook-log.txt
```

This file contains all data received from the machine.

---

## 🐛 TROUBLESHOOTING

### No data in console after check-in?

**1. Verify Machine Server IP**
- Go to machine: Menu → Comm set → Server
- Server IP must be: `010.022.134.159`
- NOT: `010.022.134.155`

**2. Verify Server is Running**
```bash
# Check if server is running
npm run test:connection
```

All tests should pass.

**3. Check Firewall**
```bash
# Allow port 5000
netsh advfirewall firewall add rule name="Node Server" dir=in action=allow protocol=TCP localport=5000
```

**4. Check Machine Settings**
- Server Req: Must be **Yes**
- Use domainNm: Must be **No**
- SerPortNo: Must be **5000**

**5. Try Different Endpoint**

The machine might use a different path. Our server listens to:
- `/api/machine-webhook/attendance`
- `/api/machine-webhook/push`
- `/api/machine-webhook/` (root)

All should work!

---

### "User ID not mapped" error?

This means the machine User ID doesn't have a mapping in your database.

**Solution**:
```bash
npm run create:mapping
```

Create a mapping for that User ID.

---

### Data appears but not saved?

Check the console output:
- ✅ "Attendance saved" = Success
- ⚠️ "User ID not mapped" = Need to create mapping
- ⚠️ "Attendance already exists" = Duplicate (already recorded today)

---

## 📊 HOW IT WORKS

```
┌─────────────────────────────────────┐
│   AI06 Face Recognition Machine     │
│   IP: 10.22.134.43                  │
│                                     │
│   User does face check-in           │
└──────────────┬──────────────────────┘
               │
               │ HTTP POST (instant)
               │
               ↓
┌─────────────────────────────────────┐
│   Your Server (Laptop)              │
│   IP: 10.22.134.159:5000            │
│                                     │
│   Webhook receives data             │
│   Parses User ID & timestamp        │
│   Maps to person_id                 │
│   Saves to database                 │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│   PostgreSQL Database               │
│                                     │
│   dual_mode_attendance table        │
│   - person_id: khalid               │
│   - date: 2026-01-30                │
│   - status: present                 │
│   - source_type: machine            │
│   - timestamp: 14:30:45             │
└─────────────────────────────────────┘
```

---

## 🚀 DEPLOYMENT TO VPS

When you move to a VPS, you'll need to:

1. **Update Machine Server IP** to your VPS IP
2. **Ensure VPS port 5000 is open**
3. **Use HTTPS** (recommended for security)
4. **Keep server running** (use PM2 or similar)

Example with PM2:
```bash
npm install -g pm2
pm2 start server.js --name "school-backend"
pm2 save
pm2 startup
```

---

## 📋 QUICK COMMANDS

```bash
# Check system status
npm run status

# Add user mapping
node scripts/add-mapping.js 1 staff khalid

# List all mappings
node scripts/list-mappings.js

# Start server
npm start

# Test connection
npm run test:connection

# View webhook log
type machine-webhook-log.txt
```

---

## ✅ CHECKLIST

Before testing, make sure:

- [ ] Machine Server IP is `010.022.134.159`
- [ ] Machine Server Req is `Yes`
- [ ] Machine SerPortNo is `5000`
- [ ] User mappings created for all users
- [ ] Server is running (`npm start`)
- [ ] Firewall allows port 5000
- [ ] You're watching the server console

Then do a face check-in and watch the magic happen! ✨

---

## 🎯 SUMMARY

You're literally **one IP address change** away from a fully working system!

1. Change machine Server IP: `.155` → `.159`
2. Create user mappings
3. Start server
4. Test with face check-in
5. Done! 🎉

**No AAS software needed. Direct machine-to-server connection. Real-time. Automatic.**
