# 🔧 FIX PAYROLL DUPLICATES

## ❌ Problem

You have 6 staff members but payroll shows 8 rows with:
- Duplicate names (Ahmed appears 4 times)
- Missing names (2 rows with no names)
- Wrong totals

---

## ✅ Solution (2 Steps)

### Step 1: Check the Problem
**Run this to see what's wrong:**
```
cd backend
node scripts/check-salary-data.js
```

This will show you:
- All salary records
- Which staff have duplicates
- Records with missing names
- Recommendations

---

### Step 2: Fix the Duplicates
**Run this to fix:**
```
FIX_DUPLICATE_PAYROLL.bat
```

Or manually:
```
cd backend
node scripts/fix-duplicate-salaries.js
```

This will:
1. Find all duplicate salary records
2. Keep only the most recent one per staff
3. Delete the duplicates
4. Remove records with missing names

---

## 🔍 What Causes This?

The `hr_complete_salaries` table has multiple records for the same staff member. This happens when:
1. Salary is edited multiple times (creates new records instead of updating)
2. Staff is added multiple times by mistake
3. Old records weren't marked as inactive

---

## 📊 Expected Result

After running the fix:
- ✅ Exactly 6 salary records (one per staff)
- ✅ All records have names
- ✅ No duplicates
- ✅ Payroll shows 6 rows

**Your 6 staff:**
1. Ahmed
2. bilal
3. Chaltu
4. faxe
5. obsa
6. yusuf

---

## 🧪 Test After Fix

1. **Restart backend:**
   ```
   RESTART_BACKEND.bat
   ```

2. **Generate payroll again:**
   - Go to Payroll System
   - Click "Generate Payroll"
   - Select month and year
   - Should show exactly 6 staff members

---

## 🔧 Manual Fix (Alternative)

If you prefer SQL:

### 1. Check duplicates:
```sql
SELECT staff_id, staff_name, COUNT(*) as count
FROM hr_complete_salaries
GROUP BY staff_id, staff_name
HAVING COUNT(*) > 1;
```

### 2. Delete records with missing names:
```sql
DELETE FROM hr_complete_salaries 
WHERE staff_name IS NULL OR staff_name = '';
```

### 3. Keep only most recent per staff:
```sql
-- For each staff, keep only the most recent record
DELETE FROM hr_complete_salaries
WHERE id NOT IN (
  SELECT DISTINCT ON (staff_id) id
  FROM hr_complete_salaries
  ORDER BY staff_id, created_at DESC
);
```

---

## 📝 Prevention

To prevent this in the future:

### When editing salary in Salary Management:
The system should **UPDATE** existing records, not create new ones.

Check `backend/routes/hr/salaryManagement.js`:
- The `POST /add-complete` endpoint creates new records
- Should check if staff already has active salary
- If yes, deactivate old one before creating new

---

## ✅ Quick Fix Command

**Just run this:**
```
FIX_DUPLICATE_PAYROLL.bat
```

Then restart backend and test payroll.

---

**Estimated Time:** 1 minute
**Difficulty:** Easy
