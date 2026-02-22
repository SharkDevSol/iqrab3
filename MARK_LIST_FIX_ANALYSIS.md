# Mark List Display Fix Analysis

## Current Implementation

### Student Profile (APP/src/COMPONENTS/StudentProfile.jsx)
- **Endpoint:** `GET /api/mark-list/student-marks/:schoolId/:className`
- **State:** `markListData` - stores the marks array
- **Fetch Logic:** Fetches when `activeTab === 'marklist'` and student exists
- **Display:** Shows subject cards with components, total score, and pass status

### Guardian Profile (APP/src/COMPONENTS/GuardianProfile.jsx)
- **Endpoint:** `GET /api/mark-list/student-marks/:schoolId/:className`
- **State:** `wardMarks` - object keyed by ward school_id
- **Fetch Logic:** Fetches when `activeTab === 'marklist'` and selectedMarkWard exists
- **Display:** Shows subject cards with components, total score, and pass status

### Backend API (backend/routes/markListRoutes.js)
- **Endpoint:** `/student-marks/:schoolId/:className`
- **Logic:**
  1. Gets student name from school_id
  2. Gets all subjects mapped to the class
  3. For each subject, checks all 4 terms
  4. Returns marks array with subject_name, term_number, total, pass_status, components

## Potential Issues

1. **Student Name Lookup:**
   - The endpoint tries to find student by school_id
   - Uses `is_active` column check (might fail if column doesn't exist)
   - Falls back to searching all class tables

2. **Subject Schema Names:**
   - Schema names are generated as `subject_{name}_schema`
   - Uses `.replace(/[\s\-]+/g, '_')` to sanitize names
   - This should work correctly (already fixed in previous conversation)

3. **Table Names:**
   - Table names are `{className}_term_{termNumber}`
   - Also uses `.replace(/[\s\-]+/g, '_')` for sanitization

4. **Data Structure:**
   - Returns: `{ marks: [...] }`
   - Each mark has: subject_name, term_number, total, pass_status, components[]
   - Each component has: name, score, max

## Fix Required

The issue is likely in the student name lookup. The endpoint checks for `is_active` column without verifying it exists first. This is the same pattern we fixed in other endpoints.

### Fix Location: backend/routes/markListRoutes.js line 1310

Current code:
```javascript
const studentResult = await pool.query(`
  SELECT student_name FROM classes_schema."${className}" 
  WHERE school_id = $1
    AND (is_active = TRUE OR is_active IS NULL)
`, [schoolId]);
```

Should be:
```javascript
// Check if is_active column exists
const columnCheck = await pool.query(`
  SELECT column_name 
  FROM information_schema.columns 
  WHERE table_schema = 'classes_schema' 
    AND table_name = $1 
    AND column_name = 'is_active'
`, [className]);

const hasIsActive = columnCheck.rows.length > 0;
const whereClause = hasIsActive ? 'AND (is_active = TRUE OR is_active IS NULL)' : '';

const studentResult = await pool.query(`
  SELECT student_name FROM classes_schema."${className}" 
  WHERE school_id = $1 ${whereClause}
`, [schoolId]);
```

Also need to fix the fallback loop (line 1318-1332) to check for is_active column existence.
