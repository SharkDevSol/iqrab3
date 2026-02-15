# Attendance Time Settings - Complete ✅

## Overview
Created a configurable Attendance Time Settings page where you can set the standard work hours and rules for determining attendance status (PRESENT, LATE, HALF_DAY). The system now uses these settings instead of hardcoded values.

---

## Features

### 1. **Configurable Work Hours**
- Standard Check-In Time (e.g., 08:00)
- Late Threshold Time (e.g., 08:15)
- Standard Check-Out Time (e.g., 17:00)
- Grace Period in Minutes (e.g., 15 minutes)

### 2. **Configurable Rules**
- Minimum Work Hours for Full Day (e.g., 8 hours)
- Half Day Threshold (e.g., 4 hours)

### 3. **Real-Time Examples**
- Shows examples based on your current settings
- Visual preview of how rules will be applied
- Color-coded status indicators

### 4. **Automatic Status Calculation**
- System uses your settings to determine status
- No more hardcoded values
- Easy to adjust for your organization

---

## How It Works

### Status Determination Rules:

```
✅ PRESENT:
- Check-in before Late Threshold
- Work at least Minimum Work Hours

⏰ LATE:
- Check-in after Late Threshold
- (Even if they work full hours)

⏱️ HALF_DAY:
- Work less than Half Day Threshold hours
- (Regardless of check-in time)

❌ ABSENT:
- No check-in record
```

---

## Example Configuration

### Default Settings:
```
Standard Check-In:     08:00
Late Threshold:        08:15
Grace Period:          15 minutes
Standard Check-Out:    17:00
Minimum Work Hours:    8 hours
Half Day Threshold:    4 hours
```

### Example Scenarios:

**Scenario 1: On Time**
```
Check-in:  08:00
Check-out: 17:00
Hours:     9.0
Status:    PRESENT ✅
```

**Scenario 2: Late Arrival**
```
Check-in:  08:30  (after 08:15 threshold)
Check-out: 17:00
Hours:     8.5
Status:    LATE ⏰
```

**Scenario 3: Half Day (Early Leave)**
```
Check-in:  08:00
Check-out: 12:00
Hours:     4.0
Status:    HALF_DAY ⏱️
```

**Scenario 4: Half Day (Late + Early)**
```
Check-in:  10:00
Check-out: 14:00
Hours:     4.0
Status:    HALF_DAY ⏱️
```

---

## How to Use

### Accessing Settings:

1. Navigate to **HR & Staff Management**
2. Click on **⏰ Time Settings**
3. You'll see the configuration page

### Configuring Settings:

1. **Set Standard Check-In Time**
   - When staff should arrive (e.g., 08:00)

2. **Set Late Threshold**
   - Maximum allowed arrival time before marked late (e.g., 08:15)

3. **Set Grace Period**
   - Buffer time in minutes (e.g., 15 minutes)
   - This is the difference between standard and late threshold

4. **Set Standard Check-Out Time**
   - When staff should leave (e.g., 17:00)

5. **Set Minimum Work Hours**
   - Required hours for full day (e.g., 8 hours)

6. **Set Half Day Threshold**
   - Hours below which it's considered half day (e.g., 4 hours)

7. **Click "💾 Save Settings"**

### Testing Your Settings:

The page shows real-time examples based on your configuration:
- On Time Staff example
- Late Arrival example
- Half Day examples

---

## Database Schema

### New Table: `hr_attendance_time_settings`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| id | UUID | auto | Primary key |
| standard_check_in | TIME | 08:00 | Expected arrival time |
| late_threshold | TIME | 08:15 | Late if after this time |
| standard_check_out | TIME | 17:00 | Expected departure time |
| minimum_work_hours | DECIMAL(4,2) | 8.0 | Full day hours |
| half_day_threshold | DECIMAL(4,2) | 4.0 | Half day if less than this |
| grace_period_minutes | INTEGER | 15 | Grace period in minutes |
| created_at | TIMESTAMPTZ | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOW() | Last update timestamp |

**Note**: Only one row exists in this table (singleton pattern)

---

## API Endpoints

### Get Settings:
```
GET /api/hr/attendance/time-settings
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "standard_check_in": "08:00:00",
    "late_threshold": "08:15:00",
    "standard_check_out": "17:00:00",
    "minimum_work_hours": 8.0,
    "half_day_threshold": 4.0,
    "grace_period_minutes": 15,
    "created_at": "2026-02-08T...",
    "updated_at": "2026-02-08T..."
  }
}
```

### Save Settings:
```
POST /api/hr/attendance/time-settings
```

**Request Body:**
```json
{
  "standardCheckIn": "08:00",
  "lateThreshold": "08:15",
  "standardCheckOut": "17:00",
  "minimumWorkHours": 8.0,
  "halfDayThreshold": 4.0,
  "gracePeriodMinutes": 15
}
```

---

## Integration with Attendance System

The attendance marking endpoints now automatically fetch and use these settings:

1. **When marking attendance** (`POST /api/hr/attendance/ethiopian`):
   - Fetches current settings from database
   - Uses `late_threshold` to determine if LATE
   - Uses `half_day_threshold` to determine if HALF_DAY

2. **When bulk marking** (`POST /api/hr/attendance/ethiopian/bulk`):
   - Fetches settings once
   - Applies to all staff records
   - Consistent rule application

---

## Benefits

### 1. **Flexibility**
- Adjust rules without code changes
- Different organizations have different policies
- Easy to update as policies change

### 2. **Transparency**
- Staff know the exact rules
- Clear thresholds
- No ambiguity

### 3. **Consistency**
- Same rules applied to everyone
- Automatic calculation
- No manual errors

### 4. **Easy Management**
- Simple UI to configure
- Real-time examples
- Visual feedback

---

## Common Configurations

### Strict Policy:
```
Standard Check-In:     08:00
Late Threshold:        08:05  (only 5 min grace)
Half Day Threshold:    4 hours
```

### Flexible Policy:
```
Standard Check-In:     08:00
Late Threshold:        08:30  (30 min grace)
Half Day Threshold:    3 hours
```

### Standard Policy:
```
Standard Check-In:     08:00
Late Threshold:        08:15  (15 min grace)
Half Day Threshold:    4 hours
```

---

## Files Created

### Frontend:
1. **APP/src/PAGE/HR/AttendanceTimeSettings.jsx**
   - Settings configuration page
   - Real-time examples
   - Form validation

### Backend:
2. **backend/routes/hr/attendance.js**
   - Added time settings endpoints
   - Updated attendance marking to use settings
   - Updated bulk marking to use settings

### Navigation:
3. **APP/src/PAGE/Home.jsx**
   - Added "⏰ Time Settings" menu link

4. **APP/src/App.jsx**
   - Added route for time settings page

---

## Testing

### Test Your Configuration:

1. **Go to Time Settings**
   - HR → ⏰ Time Settings

2. **Set Your Rules**
   - Configure times and thresholds
   - Save settings

3. **Mark Attendance**
   - Go to Attendance System
   - Mark attendance with different times
   - Verify status is calculated correctly

4. **Test Scenarios**:
   - Check-in at 08:00 → Should be PRESENT
   - Check-in at 08:20 → Should be LATE
   - Check-in 08:00, out 12:00 → Should be HALF_DAY

---

## Troubleshooting

### Settings Not Applying?

1. **Did you save the settings?**
   - Click "💾 Save Settings" button
   - Wait for success message

2. **Restart backend server**
   - Settings are fetched on each request
   - But restart ensures clean state

3. **Check database**
   - Verify settings are saved in `hr_attendance_time_settings` table

### Wrong Status Calculated?

1. **Check your threshold times**
   - Late Threshold should be after Standard Check-In
   - Example: Check-In 08:00, Threshold 08:15

2. **Check working hours**
   - Half Day Threshold should be less than Minimum Work Hours
   - Example: Half Day 4 hours, Full Day 8 hours

---

## Summary

You now have a fully configurable attendance time settings system!

**Key Features:**
- ✅ Configurable work hours
- ✅ Configurable late threshold
- ✅ Configurable half day rules
- ✅ Real-time examples
- ✅ Automatic status calculation
- ✅ Easy to update

**Impact:**
- Flexible policy management
- No code changes needed
- Consistent rule application
- Better staff understanding

---

**Status**: ✅ Complete and Ready to Use
**Date**: February 8, 2026
**Location**: HR → ⏰ Time Settings
