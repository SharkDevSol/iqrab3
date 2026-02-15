# Attendance Pages Reference Guide

## Overview

Your system now has **THREE different attendance systems** for different purposes:

---

## 1. Student Attendance (Class Teachers)

**Purpose**: Teachers mark attendance for their assigned class students

**Location**: 
- Route: `/staff/attendance-staff`
- Component: `APP/src/Staff/ATTENDANCE/StaffAttendance.jsx`
- Navigation: Staff Menu → "Student Attendance"

**Who Uses It**: Class Teachers

**What It Does**:
- Mark students as Present/Absent/Late
- View class roster
- Save daily attendance records
- View attendance history

**Access**:
```
Login as Staff → Navigate to "Student Attendance"
```

---

## 2. Staff Personal Attendance (NEW - Two-Step Verification)

**Purpose**: Staff members clock in/out for their own work attendance

**Location**:
- Route: `/staff/my-attendance`
- Component: `APP/src/PAGE/StaffAttendanceSystem/StaffAttendanceSystem.jsx`
- Navigation: Staff Menu → "My Attendance"

**Who Uses It**: All Staff (Teachers & General Staff)

**What It Does**:
- **Teachers**: Two-step verification clock in/out
  - Step 1: Initial timestamp
  - Step 2: Confirmation timestamp
- **General Staff**: Single-step clock in/out
- Real-time clock display
- View today's attendance status
- Calculate hours worked

**Access**:
```
Login as Staff → Navigate to "My Attendance"
OR
Direct URL: http://localhost:5173/staff/my-attendance
```

**Logic**:
```javascript
if (role === "Teacher") {
  // Two-step verification required
  1. Click "Clock In (Step 1)" → Capture timestamp 1
  2. Click "Confirm Arrival (Step 2)" → Capture timestamp 2
  3. Both timestamps saved for verification
} else {
  // Single-step for general staff
  1. Click "Clock In" → Immediate attendance record
}
```

---

## 3. Attendance Records (Admin View)

**Purpose**: Administrators view and manage all staff attendance records

**Location**:
- Route: `/attendance-records`
- Component: `APP/src/PAGE/StaffAttendanceSystem/AttendanceRecords.jsx`
- Navigation: Main Menu → "Attendance Records"

**Who Uses It**: Administrators/HR

**What It Does**:
- View all staff attendance records
- Filter by staff ID, date range, role
- Generate summary reports
- Export to CSV
- View statistics (total days, hours worked, etc.)

**Access**:
```
Login as Admin → Navigate to "Attendance Records"
OR
Direct URL: http://localhost:5173/attendance-records
```

---

## Quick Access URLs

| System | URL | Users |
|--------|-----|-------|
| Student Attendance | `/staff/attendance-staff` | Class Teachers |
| Staff Personal Attendance | `/staff/my-attendance` | All Staff |
| Attendance Records (Admin) | `/attendance-records` | Administrators |
| Staff Attendance (Main App) | `/staff-attendance-system` | All Staff (Alternative) |

---

## Navigation Structure

```
Main App (/)
├── Dashboard
├── Attendance Records (/attendance-records) ← Admin view
├── Staff Attendance System (/staff-attendance-system) ← Alternative access
└── ...

Staff Portal (/staff)
├── Home
├── Post
├── Student Attendance (/staff/attendance-staff) ← Mark student attendance
├── My Attendance (/staff/my-attendance) ← NEW: Personal clock in/out
├── Marks
├── Evaluation
└── Profile
```

---

## Comparison Table

| Feature | Student Attendance | Staff Personal Attendance | Attendance Records |
|---------|-------------------|--------------------------|-------------------|
| **Purpose** | Mark student attendance | Staff clock in/out | View all records |
| **Users** | Class Teachers | All Staff | Administrators |
| **Two-Step Verification** | No | Yes (Teachers only) | N/A (View only) |
| **Records** | Student records | Staff records | All staff records |
| **Export** | No | No | Yes (CSV) |
| **Filters** | By class | N/A | By staff/date/role |
| **Real-time Clock** | No | Yes | No |

---

## For Teachers

You now have **TWO attendance pages**:

1. **"Student Attendance"** - Mark your students' attendance
   - Access: Staff Menu → "Student Attendance"
   - Use this to mark students as present/absent

2. **"My Attendance"** - Clock in/out for yourself
   - Access: Staff Menu → "My Attendance"
   - Use this to record your own work hours
   - Requires two-step verification

---

## For General Staff

You have **ONE attendance page**:

1. **"My Attendance"** - Clock in/out for yourself
   - Access: Staff Menu → "My Attendance"
   - Single-step clock in/out
   - No verification required

---

## For Administrators

You have **TWO views**:

1. **"Attendance Records"** - View all staff attendance
   - Access: Main Menu → "Attendance Records"
   - Filter, search, and export data

2. **"Staff Attendance System"** - Alternative access
   - Access: Main Menu → "Staff Attendance System"
   - Same functionality as staff view

---

## Database Tables

Each system uses different tables:

| System | Database Table |
|--------|---------------|
| Student Attendance | `student_attendance` |
| Staff Personal Attendance | `staff_attendance`, `staff_attendance_pending` |
| Attendance Records | Reads from `staff_attendance` |

---

## Testing

### Test Student Attendance
```
1. Login as a class teacher
2. Go to Staff Menu → "Student Attendance"
3. Mark students as present/absent
4. Save attendance
```

### Test Staff Personal Attendance (Teacher)
```
1. Login as a teacher
2. Go to Staff Menu → "My Attendance"
3. Click "Clock In (Step 1)"
4. Click "Confirm Arrival (Step 2)"
5. Later: Click "Clock Out"
```

### Test Staff Personal Attendance (General Staff)
```
1. Login as general staff
2. Go to Staff Menu → "My Attendance"
3. Click "Clock In"
4. Later: Click "Clock Out"
```

### Test Attendance Records (Admin)
```
1. Login as administrator
2. Go to Main Menu → "Attendance Records"
3. Apply filters
4. View records
5. Export CSV
```

---

## Summary

- **Student Attendance** = Teachers marking students
- **My Attendance** = Staff clocking in/out for themselves (NEW)
- **Attendance Records** = Admin viewing all staff records (NEW)

The new staff attendance system with two-step verification for teachers is now fully integrated and accessible via the Staff Menu!
