# 🏫 Class Teacher Assignment System - Complete Setup Guide

## Overview
The Class Teacher Assignment System allows you to assign one teacher to each class. This teacher becomes responsible for:
- Managing class attendance
- Viewing class student lists
- Creating weekly attendance records
- Monitoring class activities

## ✅ Key Features

### Data Persistence
- ✅ Survives device changes
- ✅ Survives database restarts
- ✅ Soft delete (assignments never truly deleted)
- ✅ Auto-timestamps on updates
- ✅ Indexed for fast performance

### System Capabilities
- ✅ One teacher per class (unique constraint)
- ✅ Teachers can be reassigned to different classes
- ✅ View all current assignments
- ✅ Track assignment history
- ✅ Check teacher authorization for classes

## 🚀 Installation & Setup

### Step 1: Initialize the System
Run the initialization script to set up all required database structures:

```bash
cd backend
node init-class-teacher-system.js
```

**Expected Output:**
```
🏫 Initializing Class Teacher Assignment System...

1️⃣ Creating school_schema_points schema...
✅ Schema created/verified

2️⃣ Creating class_teachers table...
✅ class_teachers table created/verified

3️⃣ Creating indexes...
✅ Indexes created

4️⃣ Creating update trigger...
✅ Update trigger created

5️⃣ Adding table documentation...
✅ Documentation added

6️⃣ Checking existing assignments...
✅ Found 0 active class teacher assignment(s)

7️⃣ Verifying teachers table...
✅ Teachers table exists with X teacher(s)

8️⃣ Verifying classes table...
✅ Classes table exists with X class(es)

═══════════════════════════════════════════════════════
✅ Class Teacher Assignment System Initialized Successfully!
═══════════════════════════════════════════════════════
```

### Step 2: Verify Prerequisites
Before using the system, ensure:

1. **Task 5 (Classes) is completed**
   - Classes must be defined in the system
   - Check: `school_schema_points.classes` table exists

2. **Task 6 (Teachers) is completed**
   - Teachers must be added to the system
   - Check: `school_schema_points.teachers` table exists

### Step 3: Restart Backend Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm start
# or
node server.js
```

### Step 4: Access the Frontend
Navigate to the Class Teacher Assignment page in your application.

## 📊 Database Schema

### Table: `school_schema_points.class_teachers`

```sql
CREATE TABLE school_schema_points.class_teachers (
  id SERIAL PRIMARY KEY,
  global_staff_id INTEGER NOT NULL,
  teacher_name VARCHAR(100) NOT NULL,
  assigned_class VARCHAR(100) NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(assigned_class)  -- Each class can only have ONE teacher
);
```

### Indexes
- `idx_class_teachers_staff_id` - Fast lookup by teacher ID
- `idx_class_teachers_class` - Fast lookup by class name
- `idx_class_teachers_active` - Fast filtering of active assignments

### Triggers
- `trigger_update_class_teacher_timestamp` - Auto-updates `updated_at` on changes

## 🔌 API Endpoints

### 1. Get All Teachers
```http
GET /api/class-teacher/teachers
```
Returns all teachers available for assignment.

**Response:**
```json
[
  {
    "global_staff_id": 1,
    "teacher_name": "John Doe",
    "staff_work_time": "Full Time",
    "role": "Teacher"
  }
]
```

### 2. Get All Classes
```http
GET /api/class-teacher/classes
```
Returns all classes in the system.

**Response:**
```json
["Grade 1A", "Grade 1B", "Grade 2A"]
```

### 3. Get All Assignments
```http
GET /api/class-teacher/assignments
```
Returns all active class teacher assignments.

**Response:**
```json
[
  {
    "id": 1,
    "global_staff_id": 1,
    "teacher_name": "John Doe",
    "assigned_class": "Grade 1A",
    "assigned_at": "2026-02-19T10:30:00Z",
    "is_active": true,
    "staff_work_time": "Full Time"
  }
]
```

### 4. Assign Teacher to Class
```http
POST /api/class-teacher/assign
Content-Type: application/json

{
  "global_staff_id": 1,
  "teacher_name": "John Doe",
  "assigned_class": "Grade 1A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "John Doe assigned to Grade 1A"
}
```

**Notes:**
- If class already has a teacher, the assignment will be updated
- Previous teacher is automatically unassigned
- Assignment timestamp is updated

### 5. Unassign Teacher from Class
```http
DELETE /api/class-teacher/unassign/:className
```

**Example:**
```http
DELETE /api/class-teacher/unassign/Grade%201A
```

**Response:**
```json
{
  "success": true,
  "message": "Teacher unassigned from Grade 1A"
}
```

**Notes:**
- This is a soft delete (sets `is_active = false`)
- Assignment history is preserved
- Can be reassigned later

### 6. Check Teacher Authorization
```http
GET /api/class-teacher/check/:globalStaffId
```

**Example:**
```http
GET /api/class-teacher/check/1
```

**Response:**
```json
{
  "isClassTeacher": true,
  "assignedClass": "Grade 1A",
  "assignment": {
    "id": 1,
    "global_staff_id": 1,
    "teacher_name": "John Doe",
    "assigned_class": "Grade 1A",
    "assigned_at": "2026-02-19T10:30:00Z",
    "is_active": true
  }
}
```

## 🎯 Usage Examples

### Frontend Integration

```javascript
import axios from 'axios';

// Fetch available teachers
const teachers = await axios.get('http://localhost:5000/api/class-teacher/teachers');

// Fetch available classes
const classes = await axios.get('http://localhost:5000/api/class-teacher/classes');

// Assign teacher to class
await axios.post('http://localhost:5000/api/class-teacher/assign', {
  global_staff_id: 1,
  teacher_name: 'John Doe',
  assigned_class: 'Grade 1A'
});

// Get all assignments
const assignments = await axios.get('http://localhost:5000/api/class-teacher/assignments');

// Unassign teacher
await axios.delete('http://localhost:5000/api/class-teacher/unassign/Grade%201A');

// Check if teacher is class teacher
const check = await axios.get('http://localhost:5000/api/class-teacher/check/1');
if (check.data.isClassTeacher) {
  console.log(`Teacher is assigned to ${check.data.assignedClass}`);
}
```

### Staff App Integration

```javascript
// Check if logged-in teacher is a class teacher
const globalStaffId = localStorage.getItem('staffId');
const response = await axios.get(`/api/class-teacher/check/${globalStaffId}`);

if (response.data.isClassTeacher) {
  // Show class teacher features
  const assignedClass = response.data.assignedClass;
  // Load students, create attendance, etc.
}
```

## 🔒 Security & Authorization

### Access Control
- Only assigned class teachers can:
  - Create weekly attendance for their class
  - Update attendance for their class
  - View detailed student information

### Verification
Every protected endpoint verifies:
```javascript
const assignment = await pool.query(`
  SELECT * FROM school_schema_points.class_teachers 
  WHERE global_staff_id = $1 AND assigned_class = $2 AND is_active = true
`, [globalStaffId, className]);

if (assignment.rows.length === 0) {
  return res.status(403).json({ 
    error: 'You are not authorized to access this class' 
  });
}
```

## 🛠️ Maintenance & Troubleshooting

### Check System Status
```sql
-- Count active assignments
SELECT COUNT(*) FROM school_schema_points.class_teachers WHERE is_active = true;

-- View all assignments
SELECT * FROM school_schema_points.class_teachers WHERE is_active = true;

-- Find unassigned classes
SELECT c.class_name 
FROM (SELECT unnest(class_names) as class_name FROM school_schema_points.classes WHERE id = 1) c
LEFT JOIN school_schema_points.class_teachers ct ON c.class_name = ct.assigned_class AND ct.is_active = true
WHERE ct.id IS NULL;

-- View assignment history (including removed)
SELECT * FROM school_schema_points.class_teachers ORDER BY assigned_at DESC;
```

### Common Issues

#### Issue: "Teachers table not found"
**Solution:** Complete Task 6 (Teacher Setup) first
```bash
# Check if teachers exist
SELECT COUNT(*) FROM school_schema_points.teachers WHERE role = 'Teacher';
```

#### Issue: "Classes table not found"
**Solution:** Complete Task 5 (Class Setup) first
```bash
# Check if classes exist
SELECT class_names FROM school_schema_points.classes WHERE id = 1;
```

#### Issue: "Assignment not persisting"
**Solution:** Check database connection and run initialization script
```bash
node backend/init-class-teacher-system.js
```

### Reinitialization
If you need to reinitialize the system (safe - preserves data):
```bash
cd backend
node init-class-teacher-system.js
```

This will:
- ✅ Recreate tables if missing
- ✅ Recreate indexes if missing
- ✅ Preserve existing assignments
- ✅ Verify system integrity

## 📈 Performance Optimization

### Indexes
The system uses 3 indexes for optimal performance:
1. `global_staff_id` - Fast teacher lookup
2. `assigned_class` - Fast class lookup
3. `is_active` - Fast filtering

### Query Performance
- Teacher lookup: O(log n) with index
- Class lookup: O(log n) with index
- Assignment check: O(1) with unique constraint

## 🔄 Migration & Backup

### Export Assignments
```sql
COPY school_schema_points.class_teachers TO '/path/to/backup.csv' CSV HEADER;
```

### Import Assignments
```sql
COPY school_schema_points.class_teachers FROM '/path/to/backup.csv' CSV HEADER;
```

### Full Backup
```bash
pg_dump -U postgres -d school_management2 -t school_schema_points.class_teachers > class_teachers_backup.sql
```

### Restore
```bash
psql -U postgres -d school_management2 < class_teachers_backup.sql
```

## ✅ Success Criteria

After setup, you should be able to:
- ✅ View list of all teachers
- ✅ View list of all classes
- ✅ Assign teachers to classes
- ✅ Reassign teachers to different classes
- ✅ Unassign teachers from classes
- ✅ View all current assignments
- ✅ Check teacher authorization
- ✅ System persists across device changes
- ✅ System survives database restarts

## 📞 Support

If you encounter issues:
1. Check backend console logs for detailed error messages
2. Verify prerequisites (Tasks 5 & 6 completed)
3. Run initialization script again
4. Check database connection in `backend/config/db.js`

---

**Status**: ✅ PRODUCTION READY
**Version**: 1.0.0
**Last Updated**: 2026-02-19
**Persistence**: ✅ Device-Independent
