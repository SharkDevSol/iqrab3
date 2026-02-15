# Machine Student Attendance Setup Guide

## Current Situation

✅ **What's Working:**
- Student "kalid abdulamid" has Machine ID 3001 in the database
- Webhook endpoint is ready at `/api/machine/attendance`
- Backend code supports BOTH staff and student attendance from machine

❌ **What's NOT Working:**
- Machine is NOT pushing logs to the webhook
- No machine logs have been received (webhook log file is empty)
- Student attendance shows ABSENT because no machine data is being received

## The Problem

The AI06 machine needs to be configured to PUSH attendance logs to your backend server. Currently, it's storing logs internally but not sending them to your system.

## Solution: Configure Machine to Push Logs

### Step 1: Find Your Server IP Address

Run this command to find your server's IP address:

```cmd
ipconfig
```

Look for "IPv4 Address" - it should be something like `192.168.1.100` or `10.22.134.43`

### Step 2: Configure Machine Push Settings

You need to access the AI06 machine's web interface or admin panel:

1. **Access Machine Admin Panel:**
   - Open browser and go to: `http://10.22.134.43` (or your machine's IP)
   - Login with admin credentials

2. **Find Push/Webhook Settings:**
   - Look for: "Communication Settings", "Push Settings", "Cloud Settings", or "HTTP Push"
   - Enable "Real-time Push" or "HTTP Push"

3. **Configure Push URL:**
   - Set Push URL to: `http://YOUR_SERVER_IP:5000/api/machine/attendance`
   - Example: `http://192.168.1.100:5000/api/machine/attendance`
   - Protocol: HTTP (not HTTPS)
   - Method: POST

4. **Save and Test:**
   - Save settings
   - Test connection (machine should have a "Test" button)

### Step 3: Verify Webhook is Receiving Data

After configuring the machine, have someone check in on the machine, then run:

```cmd
cd backend
node scripts/check-webhook-logs.js
```

This will show if the webhook received any data.

## Alternative: Manual Import (If Push Doesn't Work)

If the machine cannot push logs, you can manually pull logs from the machine:

### Option 1: Use ZKTeco SDK

The machine might support SDK-based pulling. You would need to:
1. Install ZKTeco SDK
2. Create a script to pull logs periodically
3. Import them into the database

### Option 2: Export from Machine

1. Access machine admin panel
2. Export attendance logs as CSV/Excel
3. Import them manually into the system

## Testing the Webhook

### Test 1: Check if Webhook is Accessible

From another computer on the same network:

```cmd
curl http://YOUR_SERVER_IP:5000/api/machine/test
```

Should return: "OK - Webhook is working!"

### Test 2: Send Test Data

```cmd
curl -X POST http://YOUR_SERVER_IP:5000/api/machine/attendance -H "Content-Type: application/json" -d "{\"UserID\":\"3001\",\"DateTime\":\"2026-02-12 08:30:00\",\"Status\":\"0\"}"
```

This simulates a student check-in.

### Test 3: Check Backend Logs

Watch the backend console for messages like:

```
📥 ========================================
📥 Received data from AI06 machine
📥 ========================================
```

## Expected Flow

Once configured correctly:

1. **Student checks in on machine** (Machine ID 3001)
2. **Machine pushes log to webhook** → `POST /api/machine/attendance`
3. **Backend receives log** → Logs to console and file
4. **Backend validates** → Checks if Machine ID 3001 matches a student
5. **Backend finds student** → "kalid abdulamid" in class A
6. **Backend saves attendance** → Inserts into `academic_student_attendance`
7. **Frontend displays** → Student shows as PRESENT in attendance page

## Troubleshooting

### Issue: Machine can't reach webhook

**Solution:** Check firewall settings

```cmd
netsh advfirewall firewall add rule name="Node Backend" dir=in action=allow protocol=TCP localport=5000
```

### Issue: Webhook receives data but doesn't save

**Solution:** Check backend console for error messages. The webhook logs everything.

### Issue: Student still shows ABSENT

**Possible causes:**
1. Machine ID mismatch (check if 3001 is correct)
2. Webhook not receiving data
3. Backend error (check console)
4. Frontend not refreshing (clear cache)

## Next Steps

1. ✅ Configure machine to push to webhook
2. ✅ Test with one student check-in
3. ✅ Verify data appears in backend console
4. ✅ Check student attendance page
5. ✅ If working, all future check-ins will be automatic

## Files Modified

- `backend/routes/machineWebhook.js` - Webhook handler (supports students)
- `backend/routes/academic/studentAttendance.js` - Student attendance API
- `APP/src/PAGE/Academic/StudentAttendanceSystem.jsx` - Frontend display

## Database Tables

- `academic_student_attendance` - Where student attendance is saved
- `classes_schema.A` (and other classes) - Where student Machine IDs are stored
- `academic_student_attendance_settings` - Time settings for LATE threshold

---

**Status:** Webhook is ready and waiting for machine to push data. Machine configuration is the missing piece.
