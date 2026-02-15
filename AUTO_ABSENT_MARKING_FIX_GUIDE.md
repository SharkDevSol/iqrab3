# Auto Absent Marking Fix Guide

## Problem
The auto-marker was not filling empty attendance cells with "ABSENT" status for past days. Staff without attendance records were showing as "-" (empty) instead of "A" (Absent).

## Root Causes Identified

1. **Staff Query Issue**: The old query only selected staff with `machine_id`, excluding staff without machine IDs
2. **Shift Support Missing**: Staff with "both" shifts need 2 separate attendance records per day
3. **Database Constraint**: The unique constraint didn't include `shift_type`, causing conflicts
4. **Limited Lookback**: Only checking 7 days instead of the full month

## Solution Implemented

### 1. Database Schema Fix

Run the SQL migration script to fix the database:

```bash
psql -U your_username -d your_database -f FIX_ATTENDANCE_AUTO_MARKER.sql
```

Or manually execute:

```sql
-- Drop old constraint
ALTER TABLE hr_ethiopian_attendance 
DROP CONSTRAINT IF EXISTS hr_ethiopian_attendance_staff_id_ethiopian_year_ethiopian_month_key;

-- Add shift_type column
ALTER TABLE hr_ethiopian_attendance 
ADD COLUMN IF NOT EXISTS shift_type VARCHAR(20) DEFAULT 'shift1';

-- Create new unique constraint with shift_type
ALTER TABLE hr_ethiopian_attendance 
ADD CONSTRAINT hr_ethiopian_attendance_unique_per_shift 
UNIQUE (staff_id, ethiopian_year, ethiopian_month, ethiopian_day, shift_type);

-- Update existing records
UPDATE hr_ethiopian_attendance 
SET shift_type = 'shift1' 
WHERE shift_type IS NULL;
```

### 2. Backend Service Update

The `attendanceAutoMarker.js` service has been updated to:

- Query ALL staff from all staff tables (Teachers, Administrative, Supportive)
- Support staff without machine IDs (uses global_staff_id or full_name as fallback)
- Handle "both" shift assignments (creates 2 records per day)
- Check past 30 days instead of just 7 days
- Use proper shift-aware queries

### 3. Manual Trigger Endpoint

A new API endpoint has been added to manually trigger the auto-marker:

**Endpoint**: `POST /api/hr/attendance/trigger-auto-marker`

**Usage**:
```bash
curl -X POST http://localhost:5000/api/hr/attendance/trigger-auto-marker \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Steps

### Step 1: Restart the Backend Server

```bash
cd backend
npm restart
# or
node server.js
```

### Step 2: Check Server Logs

Look for these log messages:
```
🤖 Attendance auto-marker started
🔍 Auto-marker checking attendance at HH:MM...
📋 Found X staff entries (including shift assignments)
✅ Marked X staff as ABSENT across past 30 days
```

### Step 3: Manual Trigger (Optional)

If you want to force it to run immediately instead of waiting:

```bash
# Using curl
curl -X POST http://localhost:5000/api/hr/attendance/trigger-auto-marker \
  -H "Authorization: Bearer YOUR_TOKEN"

# Or using Postman/Thunder Client
POST http://localhost:5000/api/hr/attendance/trigger-auto-marker
Headers: Authorization: Bearer YOUR_TOKEN
```

### Step 4: Verify in UI

1. Open the HR & Staff Management → Attendance System page
2. Select the current month (Yekatit 2018)
3. Check that empty cells now show "A" (Absent) in red
4. Verify staff with "both" shifts have 2 rows with separate attendance

## Expected Behavior After Fix

### Before Fix:
```
Staff Name    | 1/6 | 2/6 | 3/6 | 4/6 | 5/6 |
Ahmed         |  -  |  -  |  -  |  -  |  -  |
Bilal         |  -  |  -  |  -  |  -  |  -  |
```

### After Fix:
```
Staff Name    | 1/6 | 2/6 | 3/6 | 4/6 | 5/6 |
Ahmed         |  A  |  A  |  A  |  A  |  A  |
Bilal         |  A  |  A  |  A  |  A  |  A  |
Khalid (S1)   |  A  |  A  | L+H |  A  |  A  |
Khalid (S2)   |  A  |  A  |  P  |  A  |  A  |
```

## Auto-Marker Schedule

The auto-marker runs:
- **Frequency**: Every 60 seconds (1 minute)
- **Absent Marking**: Only after 3:00 PM (15:00) - configurable via `absent_threshold_time`
- **Lookback Period**: Past 30 days
- **Missing Check-Out**: After 3 hours since check-in - configurable via `max_checkout_hours`

## Configuration Settings

You can adjust these settings in the `hr_attendance_time_settings` table:

```sql
-- View current settings
SELECT * FROM hr_attendance_time_settings;

-- Update absent threshold (when to start marking absent)
UPDATE hr_attendance_time_settings 
SET absent_threshold_time = '15:00';  -- 3:00 PM

-- Update max checkout hours (when to mark "without check out")
UPDATE hr_attendance_time_settings 
SET max_checkout_hours = 3.0;  -- 3 hours
```

## Troubleshooting

### Issue: Still not marking absent

**Check 1**: Verify the auto-marker is running
```bash
# Check server logs for this message
🤖 Attendance auto-marker started
```

**Check 2**: Check current time vs threshold
```bash
# The auto-marker only marks absent after 3:00 PM
# Check server logs for:
⏳ Too early to mark absent (current HH:MM < threshold 15:00)
```

**Check 3**: Verify staff are in the database
```sql
-- Check if staff exist in staff tables
SELECT machine_id, full_name, global_staff_id, shift_assignment
FROM staff_teachers.your_class_table
UNION
SELECT machine_id, full_name, global_staff_id, shift_assignment
FROM staff_administrative_staff.your_class_table
UNION
SELECT machine_id, full_name, global_staff_id, shift_assignment
FROM staff_supportive_staff.your_class_table;
```

**Check 4**: Manually trigger the auto-marker
```bash
curl -X POST http://localhost:5000/api/hr/attendance/trigger-auto-marker \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Issue: Duplicate records error

This means the unique constraint is not properly set. Run the migration script again:
```bash
psql -U your_username -d your_database -f FIX_ATTENDANCE_AUTO_MARKER.sql
```

### Issue: Staff with "both" shifts not showing 2 rows

**Check**: Verify shift_assignment in staff table
```sql
SELECT full_name, shift_assignment 
FROM staff_teachers.your_class_table 
WHERE shift_assignment = 'both';
```

If shift_assignment is NULL or 'shift1', update it:
```sql
UPDATE staff_teachers.your_class_table 
SET shift_assignment = 'both' 
WHERE full_name = 'Staff Name';
```

## Summary of Changes

### Files Modified:
1. `backend/services/attendanceAutoMarker.js` - Enhanced staff query and shift support
2. `backend/routes/hr/attendance.js` - Added manual trigger endpoint

### Files Created:
1. `FIX_ATTENDANCE_AUTO_MARKER.sql` - Database migration script
2. `AUTO_ABSENT_MARKING_FIX_GUIDE.md` - This guide

### Key Improvements:
- ✅ Marks ALL staff as absent (including those without machine IDs)
- ✅ Supports "both" shift assignments (2 records per day)
- ✅ Checks past 30 days instead of 7 days
- ✅ Proper shift-aware queries
- ✅ Manual trigger endpoint for testing
- ✅ Better error handling and logging

## Next Steps

1. Run the database migration script
2. Restart the backend server
3. Wait until after 3:00 PM or manually trigger the auto-marker
4. Refresh the attendance page and verify absent marks appear
5. Monitor server logs for any errors

If you still face issues, check the server logs and share them for further debugging.
