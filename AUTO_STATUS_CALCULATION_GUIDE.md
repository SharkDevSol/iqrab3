# Automatic Status Calculation Based on Check-in Time

## Overview
The system now automatically calculates whether a student is PRESENT or LATE based on their actual check-in time compared to their shift's late threshold. You cannot manually set a student as "PRESENT" if they checked in late - the system will automatically correct it to "LATE".

## How It Works

### Automatic Status Determination

The system follows this logic:

1. **Get Student's Class** → Determine which class the student belongs to
2. **Get Class Shift** → Check if the class is assigned to Shift 1 or Shift 2
3. **Get Shift Threshold** → Load the late threshold time for that shift
4. **Compare Times** → Compare check-in time with late threshold
5. **Set Status** → Automatically set PRESENT or LATE

### Example Scenarios

#### Shift 1 (Morning) - Late Threshold: 08:00 AM

| Check-in Time | Manual Status | Actual Status | Reason |
|---------------|---------------|---------------|---------|
| 07:30 AM | PRESENT | ✅ PRESENT | On time (before 08:00) |
| 07:59 AM | PRESENT | ✅ PRESENT | On time (before 08:00) |
| 08:01 AM | PRESENT | ❌ LATE | Late (after 08:00) - auto-corrected |
| 08:30 AM | PRESENT | ❌ LATE | Late (after 08:00) - auto-corrected |
| 02:00 PM | PRESENT | ❌ LATE | Late (after 08:00) - auto-corrected |

#### Shift 2 (Afternoon) - Late Threshold: 01:00 PM (13:00)

| Check-in Time | Manual Status | Actual Status | Reason |
|---------------|---------------|---------------|---------|
| 12:30 PM | PRESENT | ✅ PRESENT | On time (before 13:00) |
| 12:59 PM | PRESENT | ✅ PRESENT | On time (before 13:00) |
| 01:01 PM | PRESENT | ❌ LATE | Late (after 13:00) - auto-corrected |
| 02:00 PM | PRESENT | ❌ LATE | Late (after 13:00) - auto-corrected |

## Where This Applies

### 1. Manual Attendance Entry
When a teacher manually marks attendance:
- Teacher selects "PRESENT" and enters check-in time "14:00" (2:00 PM)
- System checks: Is 14:00 > 08:00 (Shift 1 threshold)? YES
- System automatically changes status to "LATE"
- Teacher sees the corrected status

### 2. AI06 Face Recognition Device
When a student scans their face:
- Device sends check-in time to server
- System looks up student's class and shift
- System compares time with shift threshold
- System automatically sets correct status (PRESENT or LATE)

### 3. API Check-in Endpoint
When using the check-in API:
```javascript
POST /api/academic/student-attendance/check-in
{
  "studentId": "12345",
  "className": "class_a",
  "checkInTime": "14:00:00",
  "status": "PRESENT"  // Will be auto-corrected to LATE
}
```

### 4. Bulk Import/Update
When importing attendance data:
- System processes each record
- Automatically calculates correct status
- Saves with corrected status

## Configuration

### Setting Late Thresholds

1. Go to **Student Attendance Time Settings** page
2. Configure **Shift 1 Late Threshold** (e.g., 08:00 AM)
3. Configure **Shift 2 Late Threshold** (e.g., 01:00 PM)
4. Save settings

### Assigning Classes to Shifts

1. In the **Class Shift Assignment** section
2. Select shift for each class:
   - Morning classes → Shift 1
   - Afternoon classes → Shift 2
3. Save assignments

## Fixing Existing Records

If you have existing attendance records with incorrect status, run:

```bash
FIX_ATTENDANCE_STATUS.bat
```

This will:
- Check all existing PRESENT/LATE records
- Compare check-in time with shift threshold
- Auto-correct any mismatched statuses
- Show summary of corrections

## Technical Details

### Status Calculation Logic

```javascript
// Get shift assignment for class
const shiftNumber = getClassShift(className); // 1 or 2

// Get late threshold for shift
const lateThreshold = shiftNumber === 2 
  ? settings.shift2_late_threshold  // e.g., "13:00:00"
  : settings.shift1_late_threshold; // e.g., "08:00:00"

// Compare times (HH:MM format)
const checkInTime = "14:00"; // 2:00 PM
const threshold = "08:00";   // 8:00 AM

if (checkInTime > threshold) {
  status = "LATE";  // 14:00 > 08:00 = LATE
} else {
  status = "PRESENT";
}
```

### Database Updates

The system updates these fields:
- `status` - Automatically calculated (PRESENT or LATE)
- `shift_number` - Stored for reference (1 or 2)
- `check_in_time` - Actual time student checked in
- `updated_at` - Timestamp of last update

## Special Cases

### ABSENT Status
- ABSENT status is NOT affected by check-in time
- Used when student doesn't check in at all
- Set by auto-marker or manually by teacher

### LEAVE Status
- LEAVE status is NOT affected by check-in time
- Used for approved absences
- Set manually by teacher or admin

### Only PRESENT/LATE Are Auto-Calculated
The system only auto-corrects between PRESENT and LATE:
- ✅ PRESENT → LATE (if time is late)
- ✅ LATE → PRESENT (if time is on-time)
- ❌ ABSENT → Not changed
- ❌ LEAVE → Not changed

## Benefits

1. **Accuracy**: Status always matches actual check-in time
2. **Consistency**: No human error in marking late students
3. **Fairness**: Same rules applied to all students
4. **Transparency**: Clear threshold times for each shift
5. **Automation**: Less manual work for teachers

## User Interface Changes

### Attendance Edit Modal
When editing attendance:
- Teacher can select status dropdown
- Teacher enters check-in time
- On save, system may auto-correct status
- Corrected status is shown immediately

### Visual Feedback
The system could show:
- ⚠️ Warning if selected status doesn't match time
- ✅ Confirmation when status is correct
- 🔄 Auto-correction message

## API Response Example

```json
{
  "success": true,
  "message": "Attendance updated successfully",
  "data": {
    "student_id": "12345",
    "student_name": "John Doe",
    "class_name": "class_a",
    "check_in_time": "14:00:00",
    "status": "LATE",  // Auto-corrected from PRESENT
    "shift_number": 1,
    "notes": "Status auto-corrected based on check-in time"
  }
}
```

## Troubleshooting

### Status Not Updating
1. Check shift assignment for the class
2. Verify late threshold is configured
3. Ensure check-in time is provided
4. Check backend logs for errors

### Wrong Status Calculated
1. Verify class is assigned to correct shift
2. Check shift late threshold time
3. Confirm check-in time format (HH:MM:SS)
4. Run fix script to correct existing records

### Time Comparison Issues
- Times are compared as strings in HH:MM format
- "08:00" < "14:00" = true (correct)
- "14:00" > "08:00" = true (correct)
- Ensure times are in 24-hour format

## Summary

The system now intelligently determines attendance status based on actual check-in time and shift configuration. This ensures:
- ✅ Accurate attendance records
- ✅ Fair application of late policies
- ✅ Reduced manual errors
- ✅ Automated status calculation
- ✅ Shift-specific time management

No more manually marking someone as "PRESENT" when they arrived at 2:00 PM for a morning shift - the system handles it automatically!
