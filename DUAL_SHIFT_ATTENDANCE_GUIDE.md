# Dual-Shift Attendance System - Complete Guide

## Overview

The dual-shift attendance system allows your organization to manage staff working in different time schedules:
- **Shift 1 (Morning)**: Typically 8:00 AM - 5:00 PM
- **Shift 2 (Afternoon)**: Typically 2:00 PM - 10:00 PM  
- **Both Shifts**: Staff who work both shifts will have 2 separate check-in/out records per day

## Installation Steps

### 1. Run Database Migration

Execute the batch script to add shift columns to your database:

```bash
ADD_SHIFT_COLUMNS.bat
```

This will:
- Add `shift_assignment` column to all staff tables (teachers_class, administrative_staff_class, supportive_staff_class)
- Create `shift_time_settings` table with default times for Shift 1 and Shift 2
- Add `shift_type` column to attendance tables
- Insert default shift configurations

### 2. Restart Backend Server

After running the migration, restart your backend server to load the new routes:

```bash
cd backend
npm start
```

### 3. Access New Pages

The system adds three new pages to your HR module:

#### A. Shift Time Settings (`/hr/shift-time-settings`)
Configure check-in/out times for each shift:
- Check-In Time
- Check-Out Time
- Late Threshold
- Grace Period (minutes)
- Minimum Work Hours
- Half-Day Threshold

#### B. Staff Shift Assignment (`/hr/staff-shift-assignment`)
Assign staff to shifts:
- View all staff with current shift assignments
- Filter by shift, department, or search by name
- Bulk assign shifts to staff members
- See summary counts for each shift

#### C. Staff Registration Form
When creating/editing staff:
- New field: "Shift Assignment (Attendance Shift)"
- Options: Shift 1 (Morning), Shift 2 (Afternoon), Both Shifts
- Default: Shift 1

## How It Works

### For Staff Assigned to Single Shift (Shift 1 or Shift 2)

1. Staff checks in/out once per day
2. Attendance is validated against their assigned shift times
3. Late marking uses the shift-specific late threshold
4. Work hours calculated based on shift-specific minimum hours

### For Staff Assigned to Both Shifts

1. Staff checks in/out TWICE per day:
   - First check-in/out for Shift 1
   - Second check-in/out for Shift 2
2. Two separate attendance records created
3. Each record validated against respective shift times
4. Total work hours = Shift 1 hours + Shift 2 hours

## Configuration Examples

### Example 1: Standard Office Hours (Shift 1)
- Check-In: 08:00 AM
- Late Threshold: 08:15 AM
- Check-Out: 05:00 PM
- Minimum Work Hours: 8.0
- Grace Period: 15 minutes

### Example 2: Afternoon/Evening Shift (Shift 2)
- Check-In: 02:00 PM
- Late Threshold: 02:15 PM
- Check-Out: 10:00 PM
- Minimum Work Hours: 8.0
- Grace Period: 15 minutes

### Example 3: Split Shift (Both)
Staff works both shifts with a break in between:
- Shift 1: 08:00 AM - 12:00 PM (4 hours)
- Break: 12:00 PM - 02:00 PM
- Shift 2: 02:00 PM - 06:00 PM (4 hours)
- Total: 8 hours

## Staff Assignment Scenarios

### Scenario 1: Ahmed (Shift 1 Only)
- **Assignment**: Shift 1
- **Check-In**: 08:00 AM
- **Check-Out**: 05:00 PM
- **Records**: 1 attendance record per day

### Scenario 2: Jamal (Shift 2 Only)
- **Assignment**: Shift 2
- **Check-In**: 02:00 PM
- **Check-Out**: 10:00 PM
- **Records**: 1 attendance record per day

### Scenario 3: Halima (Both Shifts)
- **Assignment**: Both
- **First Check-In**: 08:00 AM (Shift 1)
- **First Check-Out**: 12:00 PM (Shift 1)
- **Second Check-In**: 02:00 PM (Shift 2)
- **Second Check-Out**: 06:00 PM (Shift 2)
- **Records**: 2 attendance records per day

## Attendance Display

The attendance system will show:
- Staff name with shift badge (🌅 Shift 1, 🌆 Shift 2, 🔄 Both)
- For "Both" staff: Two rows showing separate check-in/out times
- Color-coded status badges:
  - 🟢 Present (P)
  - 🔴 Absent (A)
  - 🟡 Late (L)
  - 🔵 Half Day (H)

## API Endpoints

### Get All Shift Settings
```
GET /api/hr/shift-settings
```

### Get Specific Shift Settings
```
GET /api/hr/shift-settings/:shiftName
```

### Update Shift Settings
```
PUT /api/hr/shift-settings/:shiftName
Body: {
  check_in_time: "08:00",
  check_out_time: "17:00",
  late_threshold: "08:15",
  minimum_work_hours: 8.0,
  half_day_threshold: 4.0,
  grace_period_minutes: 15
}
```

### Get Staff Shift Assignment
```
GET /api/hr/shift-settings/staff/:staffId/shift
```

### Update Staff Shift Assignment
```
PUT /api/hr/shift-settings/staff/:staffType/:className/:staffId/shift
Body: {
  shift_assignment: "shift1" | "shift2" | "both"
}
```

## Database Schema

### shift_time_settings Table
```sql
- id (SERIAL PRIMARY KEY)
- shift_name (VARCHAR) - 'shift1' or 'shift2'
- check_in_time (TIME)
- check_out_time (TIME)
- late_threshold (TIME)
- minimum_work_hours (DECIMAL)
- half_day_threshold (DECIMAL)
- grace_period_minutes (INTEGER)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Staff Tables (shift_assignment column added)
```sql
- shift_assignment (VARCHAR) - 'shift1', 'shift2', or 'both'
- Default: 'shift1'
```

### Attendance Tables (shift_type column added)
```sql
- shift_type (VARCHAR) - 'shift1' or 'shift2'
- Used for staff with "both" shifts to indicate which shift the record is for
```

## Troubleshooting

### Issue: Shift settings not loading
**Solution**: Ensure database migration ran successfully and backend server restarted

### Issue: Staff shift assignment not saving
**Solution**: Check that staff exists in the correct table (teachers_class, administrative_staff_class, or supportive_staff_class)

### Issue: Attendance not showing for "Both" staff
**Solution**: Verify that shift_type column exists in staff_attendance and dual_mode_attendance tables

### Issue: Late marking not working correctly
**Solution**: Check shift-specific late threshold times in Shift Time Settings page

## Best Practices

1. **Configure Shift Times First**: Set up Shift 1 and Shift 2 times before assigning staff
2. **Assign Shifts During Onboarding**: Set shift assignment when creating new staff
3. **Review Regularly**: Use Staff Shift Assignment page to audit and update assignments
4. **Monitor Both-Shift Staff**: Pay special attention to staff working both shifts for overtime tracking
5. **Communicate Changes**: Inform staff when their shift assignment changes

## Support

For issues or questions:
1. Check this guide first
2. Review the database migration log
3. Check backend server logs for errors
4. Verify all API endpoints are accessible

## Future Enhancements

Potential features for future versions:
- Automatic shift rotation scheduling
- Overtime calculation for both-shift staff
- Shift-based reporting and analytics
- Mobile app support for shift-based check-in
- Shift swap requests and approvals
