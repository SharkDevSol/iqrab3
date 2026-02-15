# 🔧 FIX PAYROLL IN 3 STEPS

## The Error You're Seeing:
```
error: column "allowance_type" does not exist
```

---

## ✅ Quick Fix (Takes 1 minute)

### Step 1: Run the Fix
**Double-click this file:**
```
FIX_PAYROLL_TABLES.bat
```

Wait for it to complete. You'll see:
```
✅ hr_allowances table is now ready!
✅ hr_deductions table is now ready!
```

---

### Step 2: Restart Backend
**Double-click this file:**
```
RESTART_BACKEND.bat
```

Or manually:
```bash
cd backend
node server.js
```

---

### Step 3: Test Payroll
1. Open your app
2. Go to **Payroll System**
3. Click **"Generate Payroll"**
4. Select month and year
5. Click **"Generate"**

**It should work now!** ✅

---

## What the Fix Does

The fix script:
1. Checks if `hr_allowances` table has wrong column name
2. Renames `allowance_name` → `allowance_type`
3. Verifies `hr_deductions` table is correct
4. Shows you the final structure

---

## If You Still Get Errors

### Error: "No salary records found"
**Solution:** Add salaries in Salary Management first

### Error: "Authentication required"
**Solution:** Login again

### Error: "Table does not exist"
**Solution:** The fix script will create the tables automatically

---

## That's It!

After running the fix, your payroll system will work perfectly.

**Files to run:**
1. `FIX_PAYROLL_TABLES.bat` ← Run this first
2. `RESTART_BACKEND.bat` ← Then restart

**Total time:** ~1 minute
