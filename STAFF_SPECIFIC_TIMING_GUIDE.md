# Staff-Specific Shift Timing Feature

## Overview
This feature allows you to set custom check-in/out times for individual staff members, overriding the default shift times. You can also enable "Anytime Check" for specific staff who can come at any time without late/half-day/absent deductions.

## Features

### 1. Staff-Specific Custom Times
- Set custom check-in time for a specific staff member
- Set custom check-out time
- Set custom late threshold time
- These override the default shift times (Shift 1 or Shift 2)

### 2. Anytime Check Option
When enabled for a staff member:
- ✅ Staff can check in at ANY time
- ✅ No late marking
- ✅ No half-day marking
- ✅ No absent deductions
- ✅ Always marked as PRESENT

## How It Works

### Example Scenario:
**Default Shift 1 Times:**
- Check-in: 7:00 AM
- Late threshold: 7:15 AM
- Check-out: 3:00 PM

**Ahmed's Custom Times (Shift 1):**
- Check-in: 9:00 AM
- Late threshold: 9:15 AM
- Check-out: 5:00 PM

**Result:**
- When Ahmed checks in at 9:10 AM → PRESENT (not late)
- When other Shift 1 staff check in at 9:10 AM → LATE (past 7:15 AM)

### Anytime Check Example:
**Sara has "Anytime Check" enabled:**
- Sara checks in at 10:00 AM → PRESENT
- Sara checks in at 2:00 PM → PRESENT
- Sara works only 3 hours → PRESENT (no half-day)
- Sara doesn't come → Only marked absent if manually marked

## Setup Instructions

### Step 1: Run Database Migration
```bash
ADD_STAFF_SPECIFIC_TIMING.bat
```

This creates the `staff_specific_shift_timing` table.

### Step 2: Access the Feature
Navigate to: **HR → Time & Shift Settings → Staff-Specific Timing**

### Step 3: Configure Staff
1. Search for the staff member by name or email
2. Click "Set Specific Time" button
3. Select the shift (Shift 1 or Shift 2)
4. Choose one of two options:

   **Option A: Custom Times**
   - Enter custom check-in time
   - Enter custom check-out time
   - Enter custom late threshold
   - Add notes (optional)

   **Option B: Anytime Check**
   - Check the "Anytime Check" checkbox
   - Staff can now come anytime without penalties

5. Click "Save"

## Database Structure

### Table: `staff_specific_shift_timing`
```sql
- id (UUID, Primary Key)
- staff_id (VARCHAR, Staff ID)
- staff_name (VARCHAR, Staff Name)
- shift_type (VARCHAR, 'shift1' or 'shift2')
- custom_check_in (TIME, nullable)
- custom_check_out (TIME, nullable)
- custom_late_threshold (TIME, nullable)
- anytime_check (BOOLEAN, default false)
- notes (TEXT, nullable)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- UNIQUE(staff_id, shift_type)
```

## API Endpoints

### Get All Staff-Specific Timings
```
GET /api/hr/shift-settings/staff-specific-timing
```

### Get Specific Staff Timing
```
GET /api/hr/shift-settings/staff-specific-timing/:staffId/:shiftType
```

### Create/Update Staff-Specific Timing
```
POST /api/hr/shift-settings/staff-specific-timing
Body: {
  staff_id: string,
  staff_name: string,
  shift_type: 'shift1' | 'shift2',
  custom_check_in: string (HH:MM) | null,
  custom_check_out: string (HH:MM) | null,
  custom_late_threshold: string (HH:MM) | null,
  anytime_check: boolean,
  notes: string | null
}
```

### Delete Staff-Specific Timing
```
DELETE /api/hr/shift-settings/staff-specific-timing/:staffId/:shiftType
```

## Attendance Logic Priority

The system checks in this order:

1. **Anytime Check** (highest priority)
   - If enabled → Always PRESENT

2. **Staff-Specific Custom Times**
   - If configured → Use custom times

3. **Shift-Specific Times** (Shift 1 or Shift 2)
   - Use shift default times

4. **Global Times** (lowest priority)
   - Fallback to global settings

## Use Cases

### 1. Senior Staff with Flexible Hours
- Enable "Anytime Check" for directors, principals
- They can attend meetings, travel, work from home without penalties

### 2. Part-Time Staff
- Set custom check-in/out times
- Example: Part-time teacher works 10 AM - 2 PM instead of 8 AM - 5 PM

### 3. Medical Staff
- Doctor works 9 AM - 6 PM (custom times)
- Different from regular Shift 1 (8 AM - 5 PM)

### 4. Night Security
- Custom times for night shift security
- Check-in: 10 PM, Check-out: 6 AM

## Important Notes

1. **Shift Assignment Required**: Staff must first be assigned to a shift (Shift 1, Shift 2, or Both) before setting specific times

2. **Per-Shift Configuration**: If a staff member works both shifts, you can set different specific times for each shift

3. **Anytime Check Overrides Everything**: When enabled, all time-based rules are ignored

4. **No Retroactive Changes**: Changing specific times only affects future attendance, not past records

5. **Deletion**: Deleting a specific timing configuration reverts the staff to using default shift times

## Troubleshooting

### Staff not showing in list
- Ensure staff is properly registered in the system
- Check that staff has a valid global_staff_id

### Custom times not applying
- Verify the staff_id matches exactly
- Check that the shift_type matches the staff's assigned shift
- Look at backend logs for "staff-specific timing" messages

### Anytime check not working
- Ensure anytime_check is set to true in the database
- Check backend logs for "anytime check enabled" message
- Verify the attendance route is using the updated logic

## Future Enhancements

Potential additions:
- Bulk import of staff-specific timings via CSV
- Temporary timing overrides (date range)
- Different times for different days of the week
- Integration with leave management system
- Automatic notifications when staff-specific times are changed
