# 🔧 FIX PAYROLL ERROR

## ❌ Error Description

You're seeing this error:
```
error: column "allowance_type" does not exist
hint: Perhaps you meant to reference the column "hr_allowances.allowance_name"
```

And also:
```
relation "teachers.teachers" does not exist
```

---

## 🎯 Root Causes

### Issue 1: Column Name Mismatch
The `hr_allowances` table was created with column name `allowance_name` but the code expects `allowance_type`.

### Issue 2: Schema Query Error
The code was trying to query `"teachers"."teachers"` instead of `"teachers"."[ClassName]"`.

---

## ✅ Solution

### Quick Fix (Recommended)

**Run this batch file:**
```
FIX_PAYROLL_TABLES.bat
```

This will:
1. Check the current table structure
2. Rename `allowance_name` to `allowance_type` if needed
3. Verify both `hr_allowances` and `hr_deductions` tables
4. Show you the final structure

---

## 🔧 Manual Fix (Alternative)

If you prefer to fix manually:

### Step 1: Check Current Structure
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'hr_allowances'
ORDER BY ordinal_position;
```

### Step 2: Rename Column (if needed)
```sql
ALTER TABLE hr_allowances 
RENAME COLUMN allowance_name TO allowance_type;
```

### Step 3: Verify
```sql
SELECT * FROM hr_allowances LIMIT 1;
```

---

## 🔍 What Was Fixed in Code

### 1. Schema Query Fix
**Before:**
```javascript
const detailsResult = await pool.query(`
  SELECT account_number
  FROM "${schema}"."${staff.class_name}"
  WHERE global_staff_id = $1
`, [staffId]);
```

**After:**
```javascript
const schema = sanitizeStaffTypeToSchema(staff.staff_type);
const className = staff.class_name;

const detailsResult = await pool.query(`
  SELECT account_number
  FROM "${schema}"."${className}"
  WHERE global_staff_id = $1
`, [staffId]);
```

### 2. Error Handling Added
**Before:**
```javascript
const allowancesResult = await pool.query(allowancesQuery, [staffId, ethiopianMonthName, parseInt(ethYear)]);
```

**After:**
```javascript
const allowancesResult = await pool.query(allowancesQuery, [staffId, ethiopianMonthName, parseInt(ethYear)]).catch(err => {
  console.log(`⚠️ Error fetching allowances for ${salary.staff_name}:`, err.message);
  return { rows: [] };
});
```

---

## 📋 Verification Steps

### After Running Fix:

1. **Check Table Structure:**
   ```bash
   node backend/scripts/fix-allowances-table.js
   ```

   Expected output:
   ```
   ✅ Final table structure:
      id: uuid
      staff_id: character varying
      staff_name: character varying
      allowance_type: character varying  ← Should be this, not allowance_name
      amount: numeric
      ethiopian_month: character varying
      ethiopian_year: integer
      start_date: date
      end_date: date
      created_at: timestamp with time zone
   ```

2. **Test Payroll Generation:**
   - Go to Payroll System
   - Click "Generate Payroll"
   - Select month and year
   - Should work without errors

---

## 🐛 If Still Getting Errors

### Error: "relation does not exist"
**Solution:** The staff schema tables might not exist. Check:
```sql
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name IN ('teachers', 'supportive_staff', 'administrative_staff');
```

### Error: "column does not exist"
**Solution:** Run the fix script again:
```bash
node backend/scripts/fix-allowances-table.js
```

### Error: "staff_id not found"
**Solution:** Ensure you have added salaries in Salary Management first.

---

## 📊 Expected Behavior After Fix

### Payroll Generation Should:
1. ✅ Query `hr_complete_salaries` successfully
2. ✅ Query `hr_allowances` with `allowance_type` column
3. ✅ Query `hr_deductions` with `deduction_type` column
4. ✅ Calculate totals correctly
5. ✅ Display results in UI
6. ✅ Export to Excel successfully

### Console Should Show:
```
📊 Generating payroll for Ethiopian month Yekatit (6)/2018
✅ Generated payroll for 10 staff members
```

### No Errors Should Appear:
- ❌ No "column does not exist" errors
- ❌ No "relation does not exist" errors
- ❌ No 500 Internal Server Error

---

## 🔄 Why This Happened

The `hr_allowances` table was likely created by an earlier version of the code that used `allowance_name` instead of `allowance_type`. The current code expects `allowance_type` to match the `hr_deductions` table which uses `deduction_type`.

**Standardization:**
- `hr_allowances.allowance_type` ✅
- `hr_deductions.deduction_type` ✅
- Both follow the same naming pattern

---

## 🚀 Quick Test After Fix

1. **Run the fix:**
   ```
   FIX_PAYROLL_TABLES.bat
   ```

2. **Restart backend:**
   ```
   RESTART_BACKEND.bat
   ```

3. **Test payroll:**
   - Open Payroll System
   - Generate payroll for any month
   - Should work perfectly!

---

## 📞 Still Having Issues?

If you're still seeing errors after running the fix:

1. Check the backend console for detailed error messages
2. Verify the table structure manually in your database
3. Ensure you have salary data in `hr_complete_salaries`
4. Check that staff records exist in `staff_users`

---

**Status**: Fix scripts created and ready to run
**Estimated Fix Time**: 1 minute
**Difficulty**: Easy (just run the batch file)
