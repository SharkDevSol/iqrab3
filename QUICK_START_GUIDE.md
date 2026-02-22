# 🚀 Quick Start Guide - Attendance System

## TL;DR - Just Start the Server!

```bash
cd backend
npm start
```

That's it! Everything initializes automatically. ✅

---

## What You Get Automatically

When you start the server, the system automatically:

1. ✅ Creates all required database tables
2. ✅ Inserts default configurations
3. ✅ Starts the auto-marker (marks absent staff)
4. ✅ Enables all attendance features

**No manual scripts. No device-specific setup. Just works!**

---

## First Time Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Edit `backend/.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
PORT=5000
```

### 3. Start Server
```bash
npm start
```

You'll see:
```
🚀 Initializing Attendance Systems...
   ✅ Shift settings initialized
   ✅ Global settings initialized
   ✅ Ethiopian attendance initialized
   ✅ Class teachers initialized
✅ All Attendance Systems Initialized

🤖 Attendance auto-marker started
Server running on port 5000
```

---

## Using the System

### Record Attendance
```javascript
// Frontend: POST to /api/hr/attendance/ethiopian
{
  "staffId": "106",
  "staffName": "John Doe",
  "ethYear": 2018,
  "ethMonth": 6,
  "ethDay": 12,
  "checkIn": "08:00",
  "checkOut": null,
  "shiftType": "shift1"
}
```

### View Attendance
```javascript
// Frontend: GET /api/hr/attendance/ethiopian-month?year=2018&month=6
```

### Assign Staff Shift
```javascript
// Frontend: PUT /api/hr/shift-settings/staff/Teachers/teachers/2/shift
{
  "shiftAssignment": "shift1"  // or "shift2" or "both"
}
```

---

## Auto-Marker Behavior

The auto-marker runs every 60 seconds and:

1. **Marks Absent Staff** (after 3:00 PM)
   - Checks all staff from all departments
   - Creates ABSENT records for staff without check-in
   - Checks past 30 days for missing records

2. **Detects Missing Check-Outs** (after 3 hours)
   - Finds staff who checked in but didn't check out
   - Marks as "PRESENT + without check out" or "LATE + without check out"

3. **Applies Leave Overrides**
   - Changes ABSENT to LEAVE for approved leave requests

---

## Configuration

### Change Absent Threshold (Default: 3:00 PM)
```sql
UPDATE hr_attendance_time_settings
SET absent_threshold_time = '14:00';  -- 2:00 PM
```

### Change Max Checkout Hours (Default: 3 hours)
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 4.0;  -- 4 hours
```

### Set Weekend Days (Default: None)
```sql
UPDATE hr_attendance_time_settings
SET weekend_days = ARRAY[0, 6];  -- Sunday and Saturday
```

### Change Shift Times
```sql
-- Shift 1 (Default: 08:00 - 17:00)
UPDATE shift_time_settings
SET check_in_time = '07:30',
    check_out_time = '16:30',
    late_threshold = '07:45'
WHERE shift_name = 'shift1';

-- Shift 2 (Default: 14:00 - 22:00)
UPDATE shift_time_settings
SET check_in_time = '13:00',
    check_out_time = '21:00',
    late_threshold = '13:15'
WHERE shift_name = 'shift2';
```

---

## Testing

### Test Auto-Marker
```bash
cd backend
node test-auto-marker-now.js
```

### Check Database
```sql
-- Today's attendance
SELECT staff_name, status, check_in, check_out, shift_type
FROM hr_ethiopian_attendance
WHERE ethiopian_year = 2018 
  AND ethiopian_month = 6 
  AND ethiopian_day = 12
ORDER BY staff_name;

-- Absent count
SELECT COUNT(*) FROM hr_ethiopian_attendance WHERE status = 'ABSENT';

-- Missing check-out count
SELECT COUNT(*) FROM hr_ethiopian_attendance WHERE status LIKE '%without check out%';
```

---

## Device Changes

### Old Way (Manual)
```bash
# On new device:
node init-attendance-tables.js
node init-class-teacher-system.js
node init-all-attendance-systems.js
# etc...
```

### New Way (Automatic)
```bash
# On new device:
npm start
# Done! ✅
```

---

## Troubleshooting

### Server won't start
- Check database connection in `.env`
- Check if port 5000 is available

### Auto-marker not running
- Check backend console for "🤖 Attendance auto-marker started"
- Restart server if missing

### 500 errors
- Check backend console for detailed error
- Restart server to trigger auto-initialization

### Tables missing
- Just restart server - tables auto-create

---

## Status Codes

| Status | Meaning |
|--------|---------|
| PRESENT | On time, checked out |
| LATE | Checked in after late threshold |
| HALF_DAY | Worked less than half day |
| LATE + HALF_DAY | Both late and half day |
| PRESENT + without check out | Checked in but no check out |
| LATE + without check out | Late and no check out |
| ABSENT | No check-in (auto-marked) |
| LEAVE | On approved leave |

---

## Support Files

- `SYSTEM_AUTO_INITIALIZATION_COMPLETE.md` - Complete auto-init guide
- `COMPLETE_ATTENDANCE_SYSTEM_READY.md` - Full system documentation
- `ETHIOPIAN_ATTENDANCE_COMPLETE_FIX.md` - Ethiopian calendar details

---

## Summary

✅ **Zero manual scripts required**
✅ **Works on any device**
✅ **Survives data deletion**
✅ **Auto-marker runs automatically**
✅ **Just start server and go!**

---

**Date**: 2026-02-19
**Status**: ✅ PRODUCTION READY
**Setup Time**: < 1 minute
**Manual Steps**: 0
