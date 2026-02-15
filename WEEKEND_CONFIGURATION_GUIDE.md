# Weekend Days Configuration Guide

## Overview

This feature allows you to configure which days are weekends in your organization. Staff will NOT be automatically marked as absent on weekend days.

## Features

✅ Select any combination of days as weekends
✅ Auto-marker skips weekend days
✅ Visual day selection interface
✅ Default: Saturday & Sunday
✅ Flexible: Choose any days (e.g., Friday & Saturday for some regions)

## Setup

### Step 1: Run Database Migration

```bash
psql -U your_username -d your_database -f ADD_WEEKEND_DAYS_COLUMN.sql
```

Or manually:

```sql
ALTER TABLE hr_attendance_time_settings 
ADD COLUMN IF NOT EXISTS weekend_days INTEGER[] DEFAULT ARRAY[]::INTEGER[];
```

### Step 2: Restart Backend Server

```bash
cd backend
npm restart
```

### Step 3: Configure Weekend Days

1. Open: **HR & Staff Management → Time & Shift Settings**
2. Go to: **Global Settings** tab
3. Scroll to: **Weekend Days Configuration** section
4. Click on days to select/deselect as weekends
5. Click: **Save Global Settings**

## How It Works

### Day Numbers

```
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

### Auto-Marker Behavior

**Before Weekend Configuration:**
```
Mon Tue Wed Thu Fri Sat Sun
 A   A   A   A   A   A   A   ← All days marked absent
```

**After Configuring Sat & Sun as Weekends:**
```
Mon Tue Wed Thu Fri Sat Sun
 A   A   A   A   A   -   -   ← Weekends skipped
```

### Example Configurations

**Standard (Saturday & Sunday):**
```javascript
weekend_days: [0, 6]  // Sunday and Saturday
```

**Middle East (Friday & Saturday):**
```javascript
weekend_days: [5, 6]  // Friday and Saturday
```

**Custom (Wednesday only):**
```javascript
weekend_days: [3]  // Wednesday only
```

**No Weekends:**
```javascript
weekend_days: []  // Empty array - all days are working days
```

## UI Guide

### Weekend Selection Interface

```
┌─────────────────────────────────────────────────────────┐
│ 📅 Weekend Days Configuration                           │
├─────────────────────────────────────────────────────────┤
│ Select which days are weekends. Staff will NOT be       │
│ marked as absent on these days.                         │
│                                                          │
│ [  Sunday  ] [  Monday  ] [ Tuesday ] [ Wednesday ]     │
│ [ Thursday ] [  Friday  ] [✓Saturday] [✓ Sunday  ]      │
│                                                          │
│ Selected Weekends: Saturday, Sunday                     │
└─────────────────────────────────────────────────────────┘
```

- **White buttons**: Not selected (working days)
- **Green buttons with ✓**: Selected (weekend days)

## Testing

### Test 1: Configure Weekends

1. Open Time & Shift Settings
2. Select Saturday and Sunday
3. Save settings
4. Check server logs for confirmation

### Test 2: Verify Auto-Marker

Wait for auto-marker to run (every 60 seconds) and check logs:

```
🔍 Auto-marker checking attendance...
⏭️ Skipping Saturday (weekend day)
⏭️ Skipping Sunday (weekend day)
📅 Checking date: 6/6/2018 (Monday)
✅ Marked X staff as ABSENT
```

### Test 3: Check Attendance Page

1. Open Attendance System page
2. Verify weekend columns are empty (not marked absent)
3. Verify working days show absent marks

## API Reference

### Get Settings

```bash
GET /api/hr/attendance/time-settings
```

Response:
```json
{
  "success": true,
  "data": {
    "weekend_days": [0, 6],
    "absent_threshold_time": "15:00",
    ...
  }
}
```

### Update Settings

```bash
POST /api/hr/attendance/time-settings
Content-Type: application/json

{
  "weekendDays": [0, 6],
  "absentThresholdTime": "15:00",
  ...
}
```

## Database Schema

```sql
CREATE TABLE hr_attendance_time_settings (
  id UUID PRIMARY KEY,
  weekend_days INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  absent_threshold_time TIME DEFAULT '15:00',
  ...
);
```

## Troubleshooting

### Issue: Weekend days not being skipped

**Solution 1**: Check database
```sql
SELECT weekend_days FROM hr_attendance_time_settings;
```

**Solution 2**: Restart server
```bash
cd backend
npm restart
```

**Solution 3**: Check server logs
```bash
# Look for:
⏭️ Skipping Saturday (weekend day)
```

### Issue: Can't save weekend configuration

**Solution**: Run migration script
```bash
psql -U postgres -d your_database -f ADD_WEEKEND_DAYS_COLUMN.sql
```

### Issue: Old absent marks on weekends

**Solution**: Delete old weekend absent marks
```sql
-- Delete absent marks for Saturdays and Sundays
DELETE FROM hr_ethiopian_attendance
WHERE status = 'ABSENT'
  AND check_in IS NULL
  AND check_out IS NULL
  AND (
    -- Calculate day of week from Ethiopian date
    -- This is a simplified example - adjust based on your calendar conversion
    MOD(ethiopian_day, 7) IN (0, 6)
  );
```

## Regional Examples

### Ethiopia (Sunday only)
```javascript
weekend_days: [0]  // Sunday
```

### Saudi Arabia (Friday & Saturday)
```javascript
weekend_days: [5, 6]  // Friday and Saturday
```

### Israel (Friday & Saturday)
```javascript
weekend_days: [5, 6]  // Friday and Saturday
```

### UAE (Friday & Saturday)
```javascript
weekend_days: [5, 6]  // Friday and Saturday
```

### Western Countries (Saturday & Sunday)
```javascript
weekend_days: [0, 6]  // Sunday and Saturday
```

## Benefits

✅ **Accurate Attendance**: No false absent marks on weekends
✅ **Flexible**: Configure any days as weekends
✅ **Regional Support**: Works for any country's weekend pattern
✅ **Automatic**: Auto-marker respects weekend configuration
✅ **Visual**: Easy-to-use day selection interface

## Summary

| Feature | Status |
|---------|--------|
| Weekend configuration UI | ✅ Added |
| Database support | ✅ Added |
| Auto-marker integration | ✅ Added |
| Migration script | ✅ Included |
| Regional flexibility | ✅ Supported |

## Next Steps

1. Run `ADD_WEEKEND_DAYS_COLUMN.sql`
2. Restart backend server
3. Configure weekends in UI
4. Verify auto-marker skips weekends

---

**Last Updated**: February 2026
**Version**: 1.0
**Status**: Production Ready ✅
