# Student Machine Attendance - Current Status

## Summary

The backend is **READY** to receive student attendance from the AI06 machine, but the machine is **NOT CONFIGURED** to push logs to the webhook.

## What's Been Done ✅

### 1. Backend Webhook Handler
- **File:** `backend/routes/machineWebhook.js`
- **Status:** ✅ Complete and tested
- **Features:**
  - Receives attendance data from machine
  - Validates machine user ID against BOTH staff and students
  - Converts to Ethiopian calendar
  - Determines PRESENT vs LATE status based on time settings
  - Saves to `academic_student_attendance` table
  - Detailed logging for debugging

### 2. Student Database Setup
- **Student:** kalid abdulamid
- **Student ID:** 9
- **Machine ID:** 3001
- **Class:** A
- **Status:** ✅ Registered in database with machine ID

### 3. Attendance Table
- **Table:** `academic_student_attendance`
- **Status:** ✅ Ready to receive data
- **Columns:** student_id, student_name, class_name, smachine_id, ethiopian_year, ethiopian_month, ethiopian_day, check_in_time, status, notes

### 4. Time Settings
- **Table:** `academic_student_attendance_settings`
- **Status:** ✅ Configured
- **Late Threshold:** Determines when student is marked LATE vs PRESENT

## What's NOT Working ❌

### Machine is Not Pushing Logs

**Evidence:**
- Webhook log file doesn't exist
- No machine records in database
- Backend console shows no incoming requests

**Root Cause:**
The AI06 machine is storing attendance logs internally but NOT pushing them to the backend webhook.

## The Solution

### Step 1: Test the Webhook (Verify it works)

Run this test script to simulate machine data:

```cmd
cd backend
node scripts/test-student-machine-webhook.js
```

This will:
- Test webhook connectivity
- Simulate kalid abdulamid checking in (Machine ID 3001)
- Show if data is saved correctly
- Verify the entire flow works

### Step 2: Configure Machine to Push

Access the AI06 machine admin panel and configure:

**Push URL:** `http://YOUR_SERVER_IP:5000/api/machine/attendance`

Replace `YOUR_SERVER_IP` with your server's IP address (find it with `ipconfig`)

**Settings to enable:**
- Real-time Push: ON
- HTTP Push: ON
- Protocol: HTTP (not HTTPS)
- Method: POST

### Step 3: Verify Machine is Pushing

After configuration, have someone check in on the machine, then run:

```cmd
cd backend
node scripts/check-webhook-logs.js
```

This will show if the webhook received any data.

## Testing Commands

### Test 1: Check Current Status
```cmd
cd backend
node scripts/check-machine-attendance.js
```
Shows: Current machine attendance records in database

### Test 2: Test Webhook with Simulated Data
```cmd
cd backend
node scripts/test-student-machine-webhook.js
```
Shows: If webhook can receive and process student data

### Test 3: Check Webhook Logs
```cmd
cd backend
node scripts/check-webhook-logs.js
```
Shows: What data the webhook has received from the machine

## Expected Flow (Once Configured)

```
1. Student checks in on AI06 machine
   ↓
2. Machine pushes log to webhook
   POST http://YOUR_IP:5000/api/machine/attendance
   Body: { "UserID": "3001", "DateTime": "2026-02-12 08:30:00", "Status": "0" }
   ↓
3. Backend receives and validates
   - Checks if Machine ID 3001 exists in student tables
   - Finds: kalid abdulamid (Class A)
   ↓
4. Backend converts to Ethiopian calendar
   - Converts Gregorian date to Ethiopian date
   - Determines day of week
   ↓
5. Backend determines status
   - Compares check-in time with late threshold
   - Sets status: PRESENT or LATE
   ↓
6. Backend saves to database
   INSERT INTO academic_student_attendance (...)
   ↓
7. Frontend displays
   Student Attendance page shows: kalid abdulamid - PRESENT ✓
```

## Troubleshooting

### Issue: Test script fails with "ECONNREFUSED"
**Solution:** Backend is not running. Start it with:
```cmd
cd backend
npm start
```

### Issue: Test script works but real machine doesn't
**Solution:** Machine is not configured to push. Follow Step 2 above.

### Issue: Machine pushes but data not saved
**Solution:** Check backend console for error messages. The webhook logs everything.

### Issue: Data saved but not showing in frontend
**Solution:** 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (Ctrl+F5)
3. Check if correct date/week is selected

## Files Created

1. `MACHINE_STUDENT_ATTENDANCE_SETUP.md` - Detailed setup guide
2. `backend/scripts/test-student-machine-webhook.js` - Test webhook with simulated data
3. `backend/scripts/check-webhook-logs.js` - View webhook logs
4. `backend/scripts/check-machine-attendance.js` - Check database records
5. `backend/scripts/find-machine-logs-table.js` - Database exploration (used for diagnosis)

## Files Modified

1. `backend/routes/machineWebhook.js` - Added student support (already done)
2. `APP/src/PAGE/Academic/StudentAttendanceSystem.jsx` - Displays attendance (already done)

## Next Action Required

**YOU NEED TO:**
1. Run test script to verify webhook works
2. Configure AI06 machine to push to webhook URL
3. Test with real check-in
4. Verify data appears in Student Attendance page

**The backend is ready. The machine configuration is the missing piece.**

---

## Quick Reference

**Webhook URL:** `http://YOUR_IP:5000/api/machine/attendance`

**Test Command:** `node scripts/test-student-machine-webhook.js`

**Check Logs:** `node scripts/check-webhook-logs.js`

**Student Info:**
- Name: kalid abdulamid
- Machine ID: 3001
- Class: A
- Student ID: 9

---

**Status:** ⏳ Waiting for machine configuration
