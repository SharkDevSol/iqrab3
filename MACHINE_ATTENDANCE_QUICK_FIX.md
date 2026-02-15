# 🚀 Machine Attendance Quick Fix Guide

## 📊 CURRENT STATUS

Your system is **95% ready**! Here's what we found:

✅ **Working:**
- Database schema created
- AAS database sync service ready (120 records found)
- Webhook endpoints ready
- Server accessible from network
- Your laptop IP is correct: `10.22.134.159`

⚠️ **Needs Fixing:**
1. Machine Server IP is wrong (`.155` instead of `.159`)
2. No user mappings created yet
3. Server needs to be running for auto-sync

---

## 🔧 FIX #1: Update Machine Server IP (CRITICAL)

### Why This Matters
The machine is trying to push data to `010.022.134.155` but your laptop is at `010.022.134.159`. That's why you're not seeing any data in the server console!

### Steps:

1. **Go to the AI06 machine**
2. **Press Menu** → Enter admin password
3. **Navigate to**: Comm set → Server
4. **Change Server IP**:
   - FROM: `010.022.134.155` ❌
   - TO: `010.022.134.159` ✅
5. **Save** and optionally restart the machine

---

## 🔧 FIX #2: Create User Mappings

### Why This Matters
The machine uses User IDs (like 1, 2, 3) but your database uses person_ids (like staff IDs or student IDs). We need to map them!

### Example:
- Machine User ID `1` → Database person_id `khalid` (staff)
- Machine User ID `2` → Database person_id `student123` (student)

### Steps:

```bash
cd backend
npm run create:mapping
```

Follow the prompts:
1. Enter Machine User ID (e.g., `1`)
2. Enter person type (`staff` or `student`)
3. Enter database person_id (e.g., `khalid`)
4. Confirm

Repeat for all users who will use the face recognition machine.

### Quick Mapping (if you know the data):

You can also insert directly:

```sql
INSERT INTO user_machine_mapping (person_id, person_type, machine_user_id)
VALUES 
  ('khalid', 'staff', 1),
  ('student123', 'student', 2);
```

---

## 🔧 FIX #3: Start the Server

The auto-sync service only runs when the server is running.

```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
🚀 Starting AAS 6.0 real-time sync...
   Syncing every 2 minutes from: C:\AttendanceF\tmkq.mdb
```

---

## ✅ VERIFICATION

### 1. Check System Status

```bash
cd backend
npm run status
```

This shows:
- Network configuration
- Machine settings
- User mappings
- Attendance records
- AAS database status
- Webhook status
- Auto-sync status

### 2. Test Machine Push

After fixing the Server IP:

1. **Start your server**: `npm start`
2. **Do a face check-in** on the AI06 machine
3. **Watch the console** - you should see:
   ```
   📥 Received data from AI06 machine
   Headers: {...}
   Body: {...}
   ```

### 3. Test AAS Sync

1. In AAS 6.0: Click **Download Record** → **Data Analysis** → **Start Analysis**
2. Wait 2 minutes (or restart server to trigger immediate sync)
3. Check console for sync messages

---

## 🎯 COMPLETE WORKFLOW

Once everything is fixed, here's how it works:

### Method 1: Real-Time Push (Automatic)
```
User checks in on machine
    ↓
Machine pushes data to your server (instant)
    ↓
Server receives data and saves to database
    ↓
Attendance recorded!
```

### Method 2: AAS Database Sync (Automatic)
```
User checks in on machine
    ↓
AAS downloads records (manual: "Download Record")
    ↓
Every 2 minutes: Server reads AAS database
    ↓
New records synced to your database
    ↓
Attendance recorded!
```

### Method 3: CSV Import (Manual)
```
Export CSV from AAS 6.0
    ↓
Upload CSV to your system
    ↓
System parses and imports
    ↓
Attendance recorded!
```

---

## 📋 QUICK COMMANDS

```bash
# Check system status
npm run status

# Create user mapping
npm run create:mapping

# Start server (with auto-sync)
npm start

# Test machine connection
npm run test:connection

# Test AAS sync manually
npm run test:realtime-sync

# Inspect AAS database
npm run inspect:aas-database
```

---

## 🐛 TROUBLESHOOTING

### No data in server console after check-in?

1. **Verify Server IP on machine**: Must be `010.022.134.159`
2. **Check server is running**: `npm start`
3. **Check firewall**: Port 5000 must be open
4. **Check machine settings**:
   - Server Req: Yes
   - Use domainNm: No
   - SerPortNo: 5000

### AAS sync not working?

1. **Check AAS database path**: `C:\AttendanceF\tmkq.mdb`
2. **Download records in AAS**: Download Record → Data Analysis → Start Analysis
3. **Check user mappings**: `npm run status`
4. **Run manual sync**: `npm run test:realtime-sync`

### User not found in attendance?

1. **Check user mapping exists**: `npm run status`
2. **Create mapping**: `npm run create:mapping`
3. **Verify machine User ID**: Check in AAS 6.0 user list

---

## 📞 NEXT STEPS

1. ✅ **Fix machine Server IP** (`.155` → `.159`)
2. ✅ **Create user mappings** for all users
3. ✅ **Start the server** (`npm start`)
4. ✅ **Test with face check-in**
5. ✅ **Verify data appears** in console and database

Once these are done, your system will be **fully automatic**!

---

## 📖 RELATED GUIDES

- `MACHINE_PUSH_FIX_GUIDE.md` - Detailed machine configuration
- `AAS_6.0_IMPORT_GUIDE.md` - CSV import method
- `REALTIME_SYNC_GUIDE.md` - AAS database sync details
- `DUAL_MODE_ATTENDANCE_COMPLETE.md` - Complete system documentation

---

## 💡 TIPS

1. **Keep server running** for automatic sync
2. **Use real-time push** for instant attendance (once IP is fixed)
3. **AAS sync is backup** if push fails
4. **CSV import works on VPS** when you deploy

Your system supports all three methods simultaneously!
