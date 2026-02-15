# 📋 Student Attendance System Implementation Plan

## Overview

Create a student attendance system similar to the staff attendance system, but with these key differences:
- **Weekly view** instead of monthly
- **Check-in only** (no check-out required)
- **Machine ID** for each student
- Integrated with AI06 machine for automatic check-ins

---

## Phase 1: Add Machine ID to Student Registration

### 1.1 Update Student Database Schema

Add `machine_id` column to all student tables:

```sql
-- For each class table (e.g., students_grade_1, students_grade_2, etc.)
ALTER TABLE students_grade_1 
ADD COLUMN IF NOT EXISTS machine_id VARCHAR(50) UNIQUE;

ALTER TABLE students_grade_2 
ADD COLUMN IF NOT EXISTS machine_id VARCHAR(50) UNIQUE;

-- Repeat for all class tables
```

### 1.2 Update Student Registration Form

**File**: `APP/src/PAGE/CreateRegister/CreateRegisterStudent/CreateRegisterStudent.jsx`

Add machine_id field to the form:
- Field type: Text input (number)
- Label: "Machine ID"
- Required: Yes
- Validation: Must be unique
- Position: After student_name, before age

**Important fields order**:
1. Student Name (required)
2. Machine ID (required) ← NEW
3. Age (required)
4. Gender (required)
5. Guardian info...
6. Custom fields...

### 1.3 Update Student API Endpoints

**File**: `backend/routes/students.js`

- Add `machine_id` to INSERT queries
- Add `machine_id` to UPDATE queries
- Add validation for unique machine_id
- Add machine_id to response data

---

## Phase 2: Create Student Attendance System Page

### 2.1 Create New Page Component

**File**: `APP/src/PAGE/Academic/StudentAttendanceSystem.jsx`

**Features**:
- Weekly view (Monday to Sunday)
- Ethiopian calendar support
- Check-in only (no check-out)
- Color-coded status badges:
  - ✅ Present (Green)
  - ❌ Absent (Red)
  - 🏖️ Leave (Purple)

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Student Attendance System (Ethiopian Calendar)          │
│                                                          │
│ [Week Selector] [Year: 2018] [Class: Grade 1 ▼]        │
│                                                          │
│ Weekly Summary - Week 1, Yekatit 2018                   │
│ Present: 45  Absent: 5  On Leave: 2                     │
│                                                          │
│ ┌──────────┬────┬────┬────┬────┬────┬────┬────┬────┐   │
│ │ Student  │ ID │Mon │Tue │Wed │Thu │Fri │Sat │Sun │   │
│ ├──────────┼────┼────┼────┼────┼────┼────┼────┼────┤   │
│ │ Ahmed    │101 │ ✅ │ ✅ │ ✅ │ ✅ │ ✅ │ -  │ -  │   │
│ │ Fatima   │102 │ ✅ │ ❌ │ ✅ │ ✅ │ ✅ │ -  │ -  │   │
│ │ Hassan   │103 │ ✅ │ ✅ │ 🏖️ │ 🏖️ │ 🏖️ │ -  │ -  │   │
│ └──────────┴────┴────┴────┴────┴────┴────┴────┴────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Create Backend API Endpoints

**File**: `backend/routes/academic/studentAttendance.js`

**Endpoints**:

1. `GET /api/academic/student-attendance/weekly`
   - Query params: `week`, `year`, `class`
   - Returns: All attendance records for the week

2. `POST /api/academic/student-attendance/check-in`
   - Body: `{ studentId, studentName, class, ethYear, ethMonth, ethDay, checkInTime }`
   - Creates check-in record

3. `GET /api/academic/student-attendance/summary`
   - Query params: `week`, `year`, `class`
   - Returns: Weekly statistics

### 2.3 Create Database Table

```sql
CREATE TABLE IF NOT EXISTS academic_student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  class_name VARCHAR(255) NOT NULL,
  ethiopian_year INTEGER NOT NULL,
  ethiopian_month INTEGER NOT NULL,
  ethiopian_day INTEGER NOT NULL,
  day_of_week VARCHAR(20) NOT NULL, -- Monday, Tuesday, etc.
  week_number INTEGER NOT NULL, -- Week 1, 2, 3, 4 of the month
  check_in_time TIME NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PRESENT', -- PRESENT, ABSENT, LEAVE
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, ethiopian_year, ethiopian_month, ethiopian_day)
);

CREATE INDEX idx_student_attendance_week 
ON academic_student_attendance(class_name, ethiopian_year, ethiopian_month, week_number);
```

---

## Phase 3: Integrate with AI06 Machine

### 3.1 Update Machine Webhook

**File**: `backend/routes/machineWebhook.js`

Add logic to detect if the machine user ID belongs to a student or staff:

```javascript
// Check if it's a student
const studentResult = await pool.query(`
  SELECT student_id, student_name, class_name
  FROM (
    SELECT machine_id as student_id, student_name, 'Grade 1' as class_name 
    FROM students_grade_1 WHERE machine_id = $1
    UNION
    SELECT machine_id, student_name, 'Grade 2' as class_name 
    FROM students_grade_2 WHERE machine_id = $1
    -- Add all class tables
  ) AS all_students
  LIMIT 1
`, [userId]);

if (studentResult.rows.length > 0) {
  // It's a student - save to student attendance
  await saveStudentAttendance(studentResult.rows[0], timestamp);
} else {
  // It's staff - save to staff attendance (existing logic)
  await saveStaffAttendance(...);
}
```

### 3.2 Auto-Marker for Students

**File**: `backend/services/studentAttendanceAutoMarker.js`

Similar to staff auto-marker, but:
- Marks students as ABSENT if no check-in by threshold time
- Only marks on school days (Monday-Friday)
- Gets students from class tables
- Uses weekly grouping

---

## Phase 4: Weekly View Logic

### 4.1 Week Calculation

Ethiopian calendar weeks:
- Week 1: Days 1-7
- Week 2: Days 8-14
- Week 3: Days 15-21
- Week 4: Days 22-28
- Week 5: Days 29-30 (if applicable)

### 4.2 Week Selector Component

```jsx
<select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
  <option value="1">Week 1 (Days 1-7)</option>
  <option value="2">Week 2 (Days 8-14)</option>
  <option value="3">Week 3 (Days 15-21)</option>
  <option value="4">Week 4 (Days 22-28)</option>
  <option value="5">Week 5 (Days 29-30)</option>
</select>
```

### 4.3 Day of Week Mapping

```javascript
const getDayOfWeek = (ethYear, ethMonth, ethDay) => {
  // Convert Ethiopian to Gregorian
  const gregDate = ethiopianToGregorian(ethYear, ethMonth, ethDay);
  
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayIndex = gregDate.getDay();
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};
```

---

## Phase 5: Class Filter

### 5.1 Class Selector

Add dropdown to filter by class:

```jsx
<select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
  <option value="">All Classes</option>
  <option value="Grade 1">Grade 1</option>
  <option value="Grade 2">Grade 2</option>
  <option value="Grade 3">Grade 3</option>
  {/* Dynamic from database */}
</select>
```

### 5.2 Get Students by Class

```javascript
const getStudentsByClass = async (className) => {
  const tableName = `students_${className.toLowerCase().replace(' ', '_')}`;
  
  const result = await pool.query(`
    SELECT student_id, student_name, machine_id
    FROM ${tableName}
    ORDER BY student_name
  `);
  
  return result.rows;
};
```

---

## Implementation Steps

### Step 1: Database Changes (30 minutes)
1. Add `machine_id` column to all student tables
2. Create `academic_student_attendance` table
3. Add indexes

### Step 2: Update Student Registration (1 hour)
1. Add machine_id field to form
2. Update validation
3. Update API endpoints
4. Test registration with machine_id

### Step 3: Create Student Attendance Page (2 hours)
1. Create StudentAttendanceSystem.jsx component
2. Implement weekly view layout
3. Add week selector and class filter
4. Add check-in functionality
5. Style with colors and badges

### Step 4: Backend API (1 hour)
1. Create studentAttendance.js routes
2. Implement GET /weekly endpoint
3. Implement POST /check-in endpoint
4. Implement GET /summary endpoint

### Step 5: Machine Integration (1 hour)
1. Update machineWebhook.js
2. Add student detection logic
3. Save to student attendance table
4. Test with AI06 machine

### Step 6: Auto-Marker (1 hour)
1. Create studentAttendanceAutoMarker.js
2. Implement absent marking logic
3. Schedule to run daily
4. Test marking

### Step 7: Testing (1 hour)
1. Test student registration with machine_id
2. Test manual check-in
3. Test machine check-in
4. Test weekly view
5. Test class filtering
6. Test auto-marker

---

## Total Estimated Time: 7-8 hours

---

## Next Steps

Would you like me to:
1. Start with Phase 1 (Add machine_id to student registration)?
2. Create the complete student attendance page?
3. Set up the database tables first?

Let me know which part you'd like to implement first!
