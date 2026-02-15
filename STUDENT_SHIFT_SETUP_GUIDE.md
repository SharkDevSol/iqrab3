# Student Attendance Dual-Shift System Setup Guide

## Overview
This guide explains how to set up and use the dual-shift system for student attendance.

## What's New?
- **Two Shifts**: Configure separate check-in times for Shift 1 and Shift 2
- **Class Assignment**: Assign each class to either Shift 1 or Shift 2
- **Automatic Time Management**: Attendance marking uses shift-specific times automatically

## Installation Steps

### 1. Run the Setup Script
```bash
ADD_STUDENT_SHIFT_SUPPORT.bat
```

This will:
- Add shift columns to the database
- Set default times for both shifts
- Assign all classes to Shift 1 by default

### 2. Configure Shift Times
1. Navigate to: **Academic → Student Attendance Time Settings**
2. You'll see three sections:
   - **Shift 1 Time Configuration**
   - **Shift 2 Time Configuration**
   - **Class Shift Assignment**

### 3. Set Shift 1 Times
Configure times for morning shift (example):
- Check-in Start: 07:00
- Check-in End: 08:30
- Late Threshold: 08:00
- Auto-Absent Marking: 09:00

### 4. Set Shift 2 Times
Configure times for afternoon shift (example):
- Check-in Start: 13:00
- Check-in End: 14:30
- Late Threshold: 14:00
- Auto-Absent Marking: 15:00

### 5. Assign Classes to Shifts
In the **Class Shift Assignment** section:
- Select "Shift 1" or "Shift 2" for each class
- Example:
  - Class A → Shift 1
  - Class B → Shift 2
  - Class C → Shift 1

### 6. Save Settings
Click the **Save Settings** button at the bottom

## How It Works

### Attendance Marking
- Students in Shift 1 classes use Shift 1 times
- Students in Shift 2 classes use Shift 2 times
- Auto-absent marking runs at the configured time for each shift

### Example Timeline

**Shift 1 (Morning):**
```
07:00 - Check-in window opens
08:00 - Late threshold (check-ins after this = LATE)
08:30 - Check-in window closes
09:00 - Auto-absent marking (no check-in = ABSENT)
```

**Shift 2 (Afternoon):**
```
13:00 - Check-in window opens
14:00 - Late threshold (check-ins after this = LATE)
14:30 - Check-in window closes
15:00 - Auto-absent marking (no check-in = ABSENT)
```

## Viewing Attendance
- The Student Attendance System page shows attendance for all classes
- Attendance records automatically use the correct shift times
- No changes needed to the attendance viewing interface

## Database Changes
The following tables were modified:
- `academic_student_attendance_settings` - Added shift time columns
- `academic_class_shift_assignment` - New table for class-shift mapping
- `academic_student_attendance` - Added shift_number column

## Backward Compatibility
- Legacy time settings are preserved
- Existing attendance records remain unchanged
- System works with or without shift assignments

## Troubleshooting

### Classes not showing in assignment list
- Make sure classes exist in the classes_schema
- Refresh the page

### Shift times not applying
- Verify you clicked "Save Settings"
- Check that classes are assigned to the correct shift
- Restart the backend server if needed

### Auto-absent marking not working
- Ensure "Auto-Absent Marking" is enabled
- Check that the marking time has passed
- Verify students have machine IDs set

## Support
For issues or questions, check the system logs or contact support.
