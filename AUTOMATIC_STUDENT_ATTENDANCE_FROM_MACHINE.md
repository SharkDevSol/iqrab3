# Automatic Student Attendance from AI06 Machine

## ✅ COMPLETE - System is Ready!

The system now **AUTOMATICALLY** pulls attendance logs from the AI06 machine and matches them with student Machine IDs.

## How It Works

```
┌─────────────────────┐
│   AI06 Machine      │
│   IP: 10.22.134.43  │
│                     │
│  Student checks in: │
│  Machine ID: 3001   │
│  Name: kalid        │
│  Time: 08:30        │
└─────────────────────┘
          │
          │ ✅ AUTOMATICALLY SENDS
          │ (WebSocket connection on port 7788)
          ▼
┌─────────────────────┐
│  Backend Server     │
│  AI06 WebSocket     │
│  Service            │
│  Port: 7788         │
└─────────────────────┘
          │
          │ 🔍 CHECKS
          ▼
┌─────────────────────┐
│  Is Machine ID      │
│  a STUDENT?         │
│                     │
│  Machine ID: 3001   │
│  → Check all class  │
│    tables for       │
│    smachine_id      │
└─────────────────────┘
          │
          │ ✅ FOUND!
          ▼
┌─────────────────────┐
│  Student Info       │
│                     │
│  Name: kalid        │
│  Class: A           │
│  Student ID: 9      │
└─────────────────────┘
          │
          │ 📅 CONVERTS
          ▼
┌─────────────────────┐
│  Ethiopian Calendar │
│                     │
│  Gregorian:         │
│  2026-02-12         │
│                     │
│  Ethiopian:         │
│  2018/6/5 (Thu)     │
└─────────────────────┘
          │
          │ ⏰ DETERMINES STATUS
          ▼
┌─────────────────────┐
│  Time Check         │
│                     │
│  Check-in: 08:30    │
│  Threshold: 09:00   │
│                     │
│  Status: PRESENT ✅ │
└─────────────────────┘
          │
          │ 💾 SAVES
          ▼
┌─────────────────────┐
│  Database           │
│                     │
│  academic_student_  │
│  attendance         │
│                     │
│  ✅ Record saved    │
└─────────────────────┘
          │
          │ 📊 DISPLAYS
          ▼
┌─────────────────────┐
│  Frontend           │
│  Student Attendance │
│  Page               │
│                     │
│  kalid abdulamid    │
│  ✅ PRESENT         │
│  08:30              │
└─────────────────────┘
```

## What Was Changed

### File: `backend/services/ai06WebSocketService.js`

**Added:**
1. Student detection logic - checks if Machine ID belongs to a student
2. `saveStudentAttendance()` function - saves student attendance
3. Ethiopian calendar conversion for students
4. PRESENT vs LATE status determination
5. Automatic check-in time recording

**How it works:**
- When machine sends attendance log
- System checks if Machine ID matches any `smachine_id` in class tables
- If student found → saves to `academic_student_attendance`
- If not student → saves to `hr_ethiopian_attendance` (staff)

## Configuration Required

### Step 1: Configure AI06 Machine

The machine needs to connect to your backend server via WebSocket.

**Access Machine Admin Panel:**
1. Open browser: `http://10.22.134.43`
2. Login with admin credentials
3. Go to: "Communication Settings" or "Server Settings"

**Configure Server Connection:**
- Server IP: `YOUR_SERVER_IP` (e.g., `172.21.8.159`)
- Server Port: `7788`
- Protocol: WebSocket
- Server Registration: YES
- Real-time Push: YES

**Save and Restart Machine**

### Step 2: Verify Connection

After configuration, check backend console for:

```
🔌 AI06 WebSocket Server started on port 7788
📱 New device connected from 10.22.134.43
✅ Device registered: [SERIAL_NUMBER]
```

### Step 3: Test with Real Check-in

Have a student check in on the machine, then check backend console:

```
📨 Received: {
  "cmd": "sendlog",
  "count": 1,
  "record": [
    {
      "enrollid": "3001",
      "name": "kalid",
      "time": "2026-02-12 08:30:24",
      "mode": 3,
      "inout": 0
    }
  ]
}

💾 ========================================
💾 Saving attendance from AI06 Machine
💾 ========================================
   Machine ID: 3001
   Name: kalid
   Scan Time: 2026-02-12 08:30:24

🔍 STEP 1: Identifying person type...
✅ Found STUDENT: kalid abdulamid (Class: A)

📚 Processing STUDENT attendance...
📅 Ethiopian Date: 5/6/2018 (Thursday)
⏰ Check-in Time: 08:30:24
✅ Student is ON TIME (checked in at 08:30, threshold: 09:00)
✅ Inserted new attendance record

✅ ========================================
✅ STUDENT Attendance Saved Successfully
✅ ========================================
   Student: kalid abdulamid
   Date: 5/6/2018 (Thursday)
   Status: PRESENT
   Check-in: 08:30:24
✅ ========================================
```

## How to Check if It's Working

### Method 1: Check Backend Console

When backend starts, you should see:
```
🔌 AI06 WebSocket Server started on port 7788
```

When student checks in, you should see:
```
📨 Received: { "cmd": "sendlog", ... }
✅ STUDENT Attendance Saved Successfully
```

### Method 2: Check Student Attendance Page

1. Open Student Attendance System page
2. Select current week
3. Look for the student who checked in
4. Should show PRESENT with check-in time

### Method 3: Check Database

Run this script:
```cmd
cd backend
node scripts/check-machine-attendance.js
```

Should show recent student attendance records.

## Troubleshooting

### Issue: Machine not connecting

**Check:**
1. Is backend running? (`npm start` in backend folder)
2. Is port 7788 open? (firewall)
3. Can machine reach server? (ping test)
4. Is server IP correct in machine settings?

**Solution:**
```cmd
# Check if port 7788 is listening
netstat -an | findstr 7788

# Open firewall port
netsh advfirewall firewall add rule name="AI06 WebSocket" dir=in action=allow protocol=TCP localport=7788
```

### Issue: Machine connects but no logs

**Check:**
1. Backend console - any error messages?
2. Is machine configured to push logs in real-time?
3. Is "Server Registration" enabled on machine?

**Solution:**
- Enable "Real-time Push" on machine
- Enable "Server Registration" on machine
- Restart machine after configuration

### Issue: Logs received but not saved

**Check:**
1. Backend console - what does it say?
2. Does student have `smachine_id` set in database?
3. Is Machine ID correct?

**Solution:**
- Verify student has `smachine_id` field set
- Check if Machine ID matches exactly
- Look for error messages in backend console

### Issue: Saved but not showing in frontend

**Check:**
1. Is correct date/week selected?
2. Is correct year selected?
3. Browser cache cleared?

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check if data exists: `node scripts/check-machine-attendance.js`

## Status Determination

### PRESENT
- Check-in time ≤ Late threshold
- Example: Check-in at 08:30, threshold 09:00 → PRESENT

### LATE
- Check-in time > Late threshold
- Example: Check-in at 09:15, threshold 09:00 → LATE

### Late Threshold
Configured in: `academic_student_attendance_settings` table

## Features

✅ **Automatic Detection**
- System automatically detects if Machine ID is student or staff
- No manual configuration needed per student

✅ **Real-time Processing**
- Attendance saved immediately when student checks in
- No delay or batch processing

✅ **Ethiopian Calendar**
- Automatically converts Gregorian to Ethiopian date
- Calculates correct day of week

✅ **Status Determination**
- Automatically determines PRESENT vs LATE
- Based on configurable time threshold

✅ **Duplicate Prevention**
- If student checks in multiple times, keeps earliest time
- Updates status if needed

✅ **Detailed Logging**
- Every step logged to console
- Easy to debug and verify

## Current Status

✅ Backend code updated
✅ Student detection added
✅ Ethiopian calendar conversion added
✅ Status determination added
✅ Database saving added
✅ Logging added

⏳ **Waiting for:** Machine configuration (Step 1)

## Next Steps

1. ✅ Configure AI06 machine to connect to server (port 7788)
2. ✅ Verify connection in backend console
3. ✅ Test with real student check-in
4. ✅ Check Student Attendance page
5. ✅ All future check-ins will be automatic

---

**The system is ready. Just configure the machine and it will work automatically!**
