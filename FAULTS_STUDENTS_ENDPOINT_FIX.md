# Faults Students Endpoint Fix

## Issue
After selecting a class in the Faults tab, the system showed "Failed to load students" error. The students list was not loading.

## Root Cause
The `/api/faults/students/:className` endpoint was querying from the wrong schema:
- **Before**: `FROM public."${className}"`
- **Should be**: `FROM classes_schema."${className}"`

The endpoint was also not filtering for active students only.

## Solution
Updated the studentFaultsRoutes.js to use the correct schema and filter logic, matching the behavior of the student list endpoint.

### Changes Made

**File**: `bilal/backend/routes/studentFaultsRoutes.js`

**Before**:
```javascript
router.get('/students/:className', async (req, res) => {
  const { className } = req.params;
  if (!/^[a-zA-Z0-9_]+$/.test(className)) {
    console.error('Validation failed: Invalid className', { className });
    return res.status(400).json({ error: 'Invalid class name' });
  }
  try {
    console.log(`Fetching students for class: ${className}`);
    const result = await pool.query(`
      SELECT school_id, class_id, student_name
      FROM public."${className}"
      ORDER BY LOWER(student_name) ASC
    `);
    console.log(`Fetched ${result.rows.length} students for ${className}`);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error fetching students for ${className}:`, error);
    res.status(500).json({ error: 'Failed to fetch students', details: error.message });
  }
});
```

**After**:
```javascript
router.get('/students/:className', async (req, res) => {
  const { className } = req.params;
  if (!/^[a-zA-Z0-9_]+$/.test(className)) {
    console.error('Validation failed: Invalid className', { className });
    return res.status(400).json({ error: 'Invalid class name' });
  }
  try {
    console.log(`Fetching students for class: ${className}`);
    // Use classes_schema like student list does
    const result = await pool.query(`
      SELECT school_id, class_id, student_name
      FROM classes_schema."${className}"
      WHERE is_active = TRUE OR is_active IS NULL
      ORDER BY LOWER(student_name) ASC
    `);
    console.log(`Fetched ${result.rows.length} students for ${className}`);
    res.json(result.rows);
  } catch (error) {
    console.error(`Error fetching students for ${className}:`, error);
    res.status(500).json({ error: 'Failed to fetch students', details: error.message });
  }
});
```

## Key Changes

1. ✅ Changed schema from `public` to `classes_schema`
2. ✅ Added filter for active students: `WHERE is_active = TRUE OR is_active IS NULL`
3. ✅ Now matches the behavior of `/api/student-list/students/:className`

## Deployment Details

- **Commit**: e92ca86 - "fix: Use classes_schema in faults students endpoint"
- **Backend Restarted**: PM2 process ID 10 (bilal-backend)
- **Deployed**: March 7, 2026
- **Server**: 76.13.48.245
- **Status**: ✅ LIVE

## Testing Steps

1. ✅ Navigate to https://bilal.skoolific.com/app/staff
2. ✅ Log in as a teacher
3. ✅ Click on "Faults" tab
4. ✅ Select a class from the dropdown
5. ✅ Verify students load successfully (no "Failed to load students" error)
6. ✅ Verify only active students are shown
7. ✅ Select a student and report a fault
8. ✅ Verify the fault is saved successfully

## Database Schema Structure

### Classes Schema
```
classes_schema
├── class_1 (table)
│   ├── school_id
│   ├── class_id
│   ├── student_name
│   ├── is_active
│   └── ... (other student fields)
├── class_2 (table)
├── grade_10_a (table)
└── ... (other class tables)
```

### Faults Schema
```
class_students_fault
├── class_1 (table)
│   ├── id
│   ├── student_name
│   ├── fault_type
│   ├── description
│   ├── date
│   ├── reported_by
│   └── level
└── ... (other class fault tables)
```

## Related Endpoints

### Get Classes
```
GET /api/student-list/classes
Response: ["class_1", "class_2", "grade_10_a", ...]
```

### Get Students (Fixed)
```
GET /api/faults/students/:className
Response: [
  { school_id: "001", class_id: "1", student_name: "John Doe" },
  { school_id: "002", class_id: "1", student_name: "Jane Smith" }
]
```

### Get Faults
```
GET /api/faults/faults/:className
Response: [
  {
    id: 1,
    student_name: "John Doe",
    fault_type: "Late Arrival",
    description: "Arrived 15 minutes late",
    date: "2026-03-07",
    reported_by: "Mr. Teacher",
    level: "Minor"
  }
]
```

### Report Fault
```
POST /api/faults/add-fault
Body: FormData {
  className: "class_1",
  student_name: "John Doe",
  fault_type: "Late Arrival",
  fault_level: "Minor",
  date: "2026-03-07",
  description: "Arrived 15 minutes late",
  reported_by: "Mr. Teacher"
}
```

## Benefits

1. **Consistency**: Uses the same schema as student list
2. **Active Students Only**: Filters out inactive/deactivated students
3. **Reliability**: Matches proven student list query pattern
4. **Error Prevention**: Proper schema prevents "table not found" errors

## Files Modified

- `bilal/backend/routes/studentFaultsRoutes.js` - Updated students endpoint

## Complete Flow

1. **Teacher selects class** → Frontend calls `/api/student-list/classes`
2. **System loads students** → Frontend calls `/api/faults/students/:className`
3. **Backend queries** → `classes_schema."${className}"` with active filter
4. **Students displayed** → Teacher can select student to report fault
5. **Fault reported** → Saved to `class_students_fault."${className}"`

## Status
✅ **DEPLOYED AND FUNCTIONAL**

The students list now loads correctly when a class is selected in the Faults tab. Teachers can successfully report and view student faults.

## No Frontend Changes Required

This was a backend-only fix. The frontend code remains unchanged and will automatically work with the corrected endpoint.

## Access URLs
- Staff Profile: https://bilal.skoolific.com/app/staff → Faults Tab
- Admin Faults Page: https://bilal.skoolific.com/faults
