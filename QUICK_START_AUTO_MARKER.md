# Quick Start: Student Attendance Auto-Marker

## ✅ What Was Fixed

The student attendance auto-marker was not running automatically. Now it:
- Starts automatically when you start the server
- Runs every hour to mark absent students
- Works even after deleting data or moving to new device

## 🚀 How to Use

### 1. Start Your Server (Normal)
```bash
cd backend
npm start
```

You should see this in the logs:
```
🤖 Student attendance auto-marker started
```

That's it! The auto-marker is now running automatically.

### 2. Verify It's Working

#### Option A: Check Server Logs
Look for messages like:
```
🤖 Student Attendance Auto-Marker
========================================
📅 Current Date: 2018/6/12
👥 Total students: 150
📅 2018/6/12 (Thursday): Marked 5, Skipped 145, Errors 0
```

#### Option B: Run Test Script
```bash
TEST_STUDENT_AUTO_MARKER.bat
```

#### Option C: Check Database
Open your database and run:
```sql
SELECT COUNT(*) FROM academic_student_attendance WHERE status = 'ABSENT';
```

### 3. Configure Settings (Optional)

Go to: **Academic → Student Attendance Settings**

You can configure:
- School days (which days to mark attendance)
- Auto-absent enabled (turn on/off)
- Absent marking times for each shift

## 📋 What It Does

The auto-marker:
1. Checks all students in all classes
2. Looks at all past school days (from start of year to today)
3. If a student has no attendance record for a school day, marks them ABSENT
4. Respects shift assignments (Shift 1 vs Shift 2)
5. Only processes configured school days (default: Monday-Friday)

## ⚙️ Default Settings

- **Auto-absent enabled**: TRUE (on by default)
- **School days**: Monday, Tuesday, Wednesday, Thursday, Friday
- **Shift 1 absent time**: 09:00 AM
- **Shift 2 absent time**: 02:00 PM
- **Runs every**: 1 hour

## 🔧 Manual Trigger (If Needed)

If you want to run it immediately without waiting:

### Via API:
```bash
curl -X POST http://localhost:5000/api/academic/student-attendance/mark-absent
```

### Via Command Line:
```bash
cd backend
node services/studentAttendanceAutoMarker.js
```

## ❓ Troubleshooting

### "No students found"
- Make sure you have students in your class tables
- Check that students have `is_active = TRUE` or `is_active IS NULL`

### "Auto-absent disabled"
- Go to Student Attendance Settings
- Enable "Auto-absent marking"
- Save settings

### "No days processed"
- Check that today is a school day (default: Monday-Friday)
- Verify `school_days` setting includes current day

## 🎯 Key Points

1. **Automatic**: Runs every hour, no manual intervention needed
2. **Permanent**: Works even after database reset or device change
3. **Smart**: Only marks school days, respects shifts
4. **Safe**: Won't create duplicate records
5. **Efficient**: Processes all past days in one run

## 📝 Need Help?

Check the detailed guide: `STUDENT_AUTO_MARKER_FIXED.md`

---

**Status**: ✅ WORKING - Auto-marker is now running automatically!
