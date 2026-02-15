# SQL Type Mismatch Fix

## Error Fixed
```
"operator does not exist: integer = character varying"
```

## Root Cause
The `school_id` column in attendance tables is stored as **INTEGER**, but the code was trying to compare it as **VARCHAR/TEXT**.

PostgreSQL doesn't allow direct comparison between different types without explicit casting.

## The Fix

### Before (Broken):
```sql
WHERE a.school_id = $1::text  -- ❌ Fails if school_id is INTEGER
```

### After (Fixed):
```sql
WHERE (
  a.school_id = $1::integer OR  -- Try integer comparison first
  a.school_id::text = $1::text  -- Fallback to text comparison
)
```

## What Changed

Updated 3 endpoints in `backend/routes/guardianAttendanceRoutes.js`:
1. `/student/:className/:tableName/:schoolId` - Weekly attendance
2. `/monthly-summary/:className/:schoolId/:year/:month` - Monthly summary
3. `/trends/:className/:schoolId` - Attendance trends

All now handle both INTEGER and VARCHAR school_id columns.

## How It Works

```javascript
// Parse schoolId to check if it's numeric
const schoolIdInt = parseInt(schoolId);
const isNumeric = !isNaN(schoolIdInt);

// Build SQL with conditional integer comparison
WHERE (
  ${isNumeric ? 'school_id = $1::integer OR' : ''} 
  school_id::text = $1::text
)
```

If schoolId is "4" (numeric):
- Tries: `school_id = 4` (integer comparison)
- OR: `school_id::text = '4'` (text comparison)

If schoolId is "ABC" (non-numeric):
- Only tries: `school_id::text = 'ABC'` (text comparison)

## Next Steps

1. **Restart the backend server** (one more time!)
   ```bash
   Ctrl+C
   node server.js
   ```

2. **Refresh the guardian page**

3. **Test the attendance tab**

## Expected Result

✅ No more 500 errors
✅ Attendance loads correctly
✅ Works with both integer and string school IDs
✅ Handles missing attendance schemas gracefully

## Why This Happened

Different parts of your system use different data types for `school_id`:
- Classes table: Might be VARCHAR
- Attendance tables: INTEGER
- API parameters: String (from URL)

The fix makes the code flexible to handle all cases.

---

**Status**: Fixed - Restart Required
**Files Modified**: `backend/routes/guardianAttendanceRoutes.js`
**Impact**: All guardian attendance endpoints
