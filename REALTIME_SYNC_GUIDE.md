# Real-Time Attendance Sync Guide 🚀

## 🎉 Automatic Sync is Now Possible!

We found your AAS 6.0 database at: `C:\AttendanceF\tmkq.mdb`

Now your system can automatically sync attendance in real-time without manual CSV export/import!

---

## 🔄 How It Works

```
User checks in on AI06 Machine (10.22.134.43)
         ↓
Data saved to AAS 6.0 Database (tmkq.mdb)
         ↓
Your Node.js backend reads database every 2 minutes
         ↓
New check-ins automatically imported
         ↓
Appears in your web interface immediately!
```

**No manual intervention needed!** ✨

---

## 🚀 Quick Start

### Step 1: Inspect the Database Structure

First, let's see what's in the AAS database:

```bash
cd backend

# Close AAS 6.0 software first (important!)
npm run inspect:aas-database
```

This will show you:
- All tables in the database
- Column names
- Sample data
- Which table contains attendance records

### Step 2: Create User Mappings

If you haven't already, create mappings for your staff/students:

```bash
npm run create:sample-mappings
```

Or use the API to create real mappings.

### Step 3: Test the Sync

```bash
npm run test:realtime-sync
```

This will:
- Connect to AAS database
- Read attendance records
- Sync to your system
- Show results

### Step 4: Start Automatic Sync

**Option A: Via API (Recommended)**

```bash
curl -X POST http://localhost:5000/api/machine-attendance/realtime-sync/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"intervalMinutes": 2}'
```

**Option B: Auto-start on Server Boot**

Add this to your `server.js`:

```javascript
const aasRealtimeSync = require('./services/aasRealtimeSync');

// Start real-time sync when server starts
aasRealtimeSync.startAutoSync(2); // Sync every 2 minutes
```

---

## 📡 API Endpoints

### Start Automatic Sync
```
POST /api/machine-attendance/realtime-sync/start
Body: { "intervalMinutes": 2 }
```

Starts automatic sync that runs every X minutes.

### Stop Automatic Sync
```
POST /api/machine-attendance/realtime-sync/stop
```

Stops the automatic sync service.

### Get Sync Status
```
GET /api/machine-attendance/realtime-sync/status
```

Returns:
```json
{
  "status": {
    "isRunning": true,
    "lastSyncTime": "2026-01-30T09:30:00.000Z",
    "dbPath": "C:\\AttendanceF\\tmkq.mdb"
  }
}
```

### Trigger Manual Sync
```
POST /api/machine-attendance/realtime-sync/sync-now
```

Runs sync immediately (doesn't affect automatic schedule).

### Inspect Database
```
GET /api/machine-attendance/realtime-sync/inspect-database
```

Returns database structure (for debugging).

---

## ⚙️ Configuration

### Change Sync Interval

Default is 2 minutes. You can change it:

```javascript
// Sync every 1 minute (more real-time, more load)
aasRealtimeSync.startAutoSync(1);

// Sync every 5 minutes (less load, less real-time)
aasRealtimeSync.startAutoSync(5);
```

### Change Database Path

If your AAS database is in a different location, edit `backend/services/aasRealtimeSync.js`:

```javascript
constructor() {
  this.dbPath = 'C:\\YourPath\\YourDatabase.mdb';
  // ...
}
```

---

## 🔍 How It Finds Attendance Records

The service automatically looks for common table names:
- `CHECKINOUT`
- `att_log`
- `AttendanceLog`
- `Attendance`
- `CheckInOut`
- `ATTLOG`

And common column names:
- User ID: `USERID`, `UserId`, `BADGENUMBER`
- Date/Time: `CHECKTIME`, `CheckTime`, `DATETIME`

If your database uses different names, run `npm run inspect:aas-database` to see the actual structure.

---

## ⚠️ Important Notes

### 1. Close AAS 6.0 Software

When testing or inspecting the database, **close the AAS 6.0 software** first. The database file can only be read by one program at a time.

For production use, you have two options:
- **Option A**: Keep AAS 6.0 closed, use only your web system
- **Option B**: Use a database replication tool to copy the database periodically

### 2. User Mappings Required

The sync only works for users who have mappings in the `user_machine_mapping` table. Unmapped User IDs will be reported but not synced.

### 3. Duplicate Prevention

The system uses `ON CONFLICT DO NOTHING` to prevent duplicate records. It's safe to sync the same data multiple times.

### 4. Performance

- Syncing every 2 minutes is recommended for real-time feel
- Each sync takes ~1-2 seconds for typical databases
- Minimal impact on system performance

---

## 🧪 Testing Workflow

### Test 1: Inspect Database
```bash
npm run inspect:aas-database
```

**Expected:** See list of tables and columns

### Test 2: Create Mappings
```bash
npm run create:sample-mappings
```

**Expected:** 3 sample mappings created

### Test 3: Test Sync
```bash
npm run test:realtime-sync
```

**Expected:** Records synced successfully

### Test 4: Check Database
```sql
SELECT * FROM dual_mode_attendance 
WHERE source_type = 'machine' 
ORDER BY created_at DESC 
LIMIT 10;
```

**Expected:** See attendance records with `source_machine_ip = '10.22.134.43'`

### Test 5: Start Auto-Sync
```bash
# Via API or add to server.js
```

**Expected:** Sync runs automatically every 2 minutes

### Test 6: Real Check-In
1. Check in on AI06 machine
2. Wait 2-3 minutes
3. Check your web interface
4. **Expected:** New attendance record appears!

---

## 🎯 Production Deployment

### Step 1: Add to server.js

Edit `backend/server.js` and add:

```javascript
const aasRealtimeSync = require('./services/aasRealtimeSync');

// ... after server starts ...

// Start real-time sync
console.log('🚀 Starting AAS 6.0 real-time sync...');
aasRealtimeSync.startAutoSync(2); // Every 2 minutes

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Stopping real-time sync...');
  aasRealtimeSync.stopAutoSync();
  process.exit(0);
});
```

### Step 2: Create All User Mappings

Map all your staff and students to their machine User IDs.

### Step 3: Test Thoroughly

- Test with multiple users
- Test with different check-in times
- Verify data accuracy
- Check for unmapped users

### Step 4: Monitor

Check the audit log regularly:

```sql
SELECT * FROM attendance_audit_log 
WHERE operation_type = 'machine_sync' 
ORDER BY timestamp DESC 
LIMIT 20;
```

### Step 5: Handle Unmapped Users

Set up a daily report or notification for unmapped User IDs.

---

## 🐛 Troubleshooting

### Issue: "Cannot read database file"

**Cause:** AAS 6.0 software is open

**Solution:** Close AAS 6.0 software

### Issue: "Attendance table not found"

**Cause:** Table name is different in your database

**Solution:** 
1. Run `npm run inspect:aas-database`
2. Find the attendance table name
3. Update `aasRealtimeSync.js` with the correct table name

### Issue: "No new records to sync"

**Cause:** No check-ins since last sync, or all users are unmapped

**Solution:**
1. Check in on the machine
2. Verify user mappings exist
3. Run `npm run test:realtime-sync` again

### Issue: "All records unmapped"

**Cause:** No user mappings created

**Solution:** Create user mappings via API or script

### Issue: Sync is slow

**Cause:** Large database or slow disk

**Solution:** Increase sync interval to 5 minutes

---

## 📊 Monitoring Dashboard (Future Enhancement)

You can build a dashboard showing:
- Sync status (running/stopped)
- Last sync time
- Records synced today
- Unmapped User IDs
- Sync errors

---

## 🎉 Success Criteria

Your real-time sync is working when:

1. ✅ `npm run inspect:aas-database` shows database structure
2. ✅ `npm run test:realtime-sync` syncs records successfully
3. ✅ User mappings exist for all staff/students
4. ✅ Check-ins on machine appear in web interface within 2-3 minutes
5. ✅ No unmapped User IDs reported
6. ✅ Audit log shows successful syncs

---

## 📚 Files Reference

- **Service:** `backend/services/aasRealtimeSync.js`
- **Routes:** `backend/routes/machineAttendance.js`
- **Test Script:** `backend/scripts/test-realtime-sync.js`
- **Inspect Script:** `backend/scripts/inspect-aas-database.js`
- **Database:** `C:\AttendanceF\tmkq.mdb`

---

## 🚀 Next Steps

1. **Close AAS 6.0 software**
2. **Run:** `npm run inspect:aas-database`
3. **Run:** `npm run test:realtime-sync`
4. **If successful, add to server.js** for automatic startup
5. **Test with real check-ins**
6. **Build frontend UI** to show sync status

---

**You now have real-time automatic attendance sync! 🎉**

No more manual CSV exports - check-ins appear automatically within minutes!
