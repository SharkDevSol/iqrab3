# START HERE: Student Machine Attendance

## The Problem

Student "kalid abdulamid" (Machine ID 3001) logged into the AI06 machine, but the Student Attendance page shows ABSENT instead of PRESENT.

## The Root Cause

The AI06 machine is **NOT configured** to push attendance logs to your backend server. The machine is storing logs internally but not sending them to your system.

## The Solution (3 Simple Steps)

### Step 1: Test the Webhook ✅

First, verify that the webhook works by running this test:

**Double-click:** `TEST_STUDENT_MACHINE_WEBHOOK.bat`

This will simulate a student check-in and verify the entire system works.

**Expected result:** 
- ✅ Health check passed
- ✅ Test endpoint passed
- ✅ Webhook accepted the data
- Check Student Attendance page - should show kalid abdulamid as PRESENT

If the test works, the backend is ready. Move to Step 2.

### Step 2: Get Your Webhook URL 🌐

**Double-click:** `SHOW_WEBHOOK_URL.bat`

This will show you the URL to configure on the machine.

**Example output:**
```
Configure your AI06 machine with this URL:
http://172.21.8.159:5000/api/machine/attendance
```

Copy this URL - you'll need it in Step 3.

### Step 3: Configure the Machine ⚙️

1. **Access Machine Admin Panel:**
   - Open browser
   - Go to: `http://10.22.134.43` (or your machine's IP)
   - Login with admin credentials

2. **Find Push Settings:**
   - Look for: "Communication Settings", "Push Settings", "Cloud Settings", or "HTTP Push"
   - Enable "Real-time Push" or "HTTP Push"

3. **Enter Webhook URL:**
   - Paste the URL from Step 2
   - Example: `http://172.21.8.159:5000/api/machine/attendance`
   - Protocol: HTTP (not HTTPS)
   - Method: POST

4. **Save and Test:**
   - Save settings
   - Have someone check in on the machine
   - Run: `CHECK_WEBHOOK_LOGS.bat`
   - Should show the check-in data

## Verification

After configuration, verify it's working:

1. **Have someone check in on the machine**
2. **Double-click:** `CHECK_WEBHOOK_LOGS.bat`
3. **Check Student Attendance page** - should show PRESENT

## Quick Reference

| Action | Command |
|--------|---------|
| Test webhook | `TEST_STUDENT_MACHINE_WEBHOOK.bat` |
| Get webhook URL | `SHOW_WEBHOOK_URL.bat` |
| Check logs | `CHECK_WEBHOOK_LOGS.bat` |

## Troubleshooting

### Test fails with "ECONNREFUSED"
**Solution:** Backend is not running. Start it:
```cmd
cd backend
npm start
```

### Test works but real machine doesn't
**Solution:** Machine is not configured. Complete Step 3.

### Machine configured but no logs
**Solution:** 
1. Check if machine can reach your server (ping test)
2. Check firewall settings
3. Verify URL is correct (no typos)
4. Check machine admin panel for error messages

### Data received but not showing in frontend
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (Ctrl+F5)
3. Check if correct date/week is selected

## What Happens After Configuration

Once configured, the flow is automatic:

```
Student checks in → Machine pushes to webhook → Backend saves → Frontend displays
```

No manual intervention needed. All future check-ins will be automatic.

## Technical Details

For more information, see:
- `STUDENT_MACHINE_ATTENDANCE_STATUS.md` - Detailed status report
- `MACHINE_STUDENT_ATTENDANCE_SETUP.md` - Complete setup guide

## Current Status

✅ Backend webhook: Ready
✅ Database: Ready
✅ Student registered: kalid abdulamid (Machine ID 3001)
✅ Frontend: Ready
❌ Machine configuration: **NOT DONE** ← This is what you need to do

---

**Next Action:** Run `TEST_STUDENT_MACHINE_WEBHOOK.bat` to verify the system works, then configure the machine.
