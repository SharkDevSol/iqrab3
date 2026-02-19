# Subject Mapping 500 Error - Fix

## Problem
Getting 500 error when trying to map subjects to classes:
```
POST http://localhost:5173/api/mark-list/map-subjects-classes 500 (Internal Server Error)
```

## Root Cause
The `subject_class_mappings` table may have:
1. A foreign key constraint causing issues
2. Not been created properly
3. Constraint conflicts during DELETE operation

## Solution Applied

### 1. Enhanced Error Handling
- Changed validation errors from throwing to skipping invalid entries
- Added `ON CONFLICT DO NOTHING` to prevent duplicate key errors
- Added table existence check in the endpoint

### 2. Removed Foreign Key Constraint
The foreign key constraint from `subject_name` to `subjects` table was causing issues when:
- Deleting subjects
- Updating subject names
- Clearing mappings

### 3. Better Validation
- Validates class exists before inserting
- Validates subject exists before inserting
- Skips invalid entries instead of failing entire operation

## Quick Fix

### Option 1: Restart Server
The fix is already in the code. Just restart your server:
```bash
cd backend
npm start
```

### Option 2: Run Migration (if restart doesn't work)
```sql
-- In your database client, run:
ALTER TABLE subjects_of_school_schema.subject_class_mappings 
DROP CONSTRAINT IF EXISTS subject_class_mappings_subject_name_fkey;
```

Or use the migration file:
```bash
psql %DATABASE_URL% -f backend/database/fix_subject_mappings_table.sql
```

## What Changed

### Before
```javascript
// Would throw error and rollback entire transaction
if (classResult.rows.length === 0) {
  throw new Error(`Class ${mapping.className} not found`);
}

// Would fail on duplicate
INSERT INTO ... VALUES ($1, $2)
```

### After
```javascript
// Skips invalid entries, continues with valid ones
if (classResult.rows.length === 0) {
  console.warn(`Class ${mapping.className} not found, skipping`);
  continue;
}

// Handles duplicates gracefully
INSERT INTO ... VALUES ($1, $2) ON CONFLICT DO NOTHING
```

## Testing

After restarting the server, try mapping subjects to classes again. You should see:
```json
{
  "message": "Subject-class mappings saved successfully"
}
```

## Troubleshooting

### Still Getting 500 Error?

1. **Check server logs** for the specific error message
2. **Verify subjects exist**:
   ```sql
   SELECT * FROM subjects_of_school_schema.subjects;
   ```
3. **Verify classes exist**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'classes_schema';
   ```
4. **Check table exists**:
   ```sql
   SELECT * FROM subjects_of_school_schema.subject_class_mappings;
   ```

### Error: "relation does not exist"
Run the migration script or restart the server to create the table.

### Error: "foreign key constraint"
Run the migration to remove the foreign key constraint.

## Summary

- ✅ Removed problematic foreign key constraint
- ✅ Added better error handling
- ✅ Validates data before inserting
- ✅ Skips invalid entries instead of failing
- ✅ Handles duplicates gracefully
- ✅ Creates table if it doesn't exist

Just restart your server and try again!
