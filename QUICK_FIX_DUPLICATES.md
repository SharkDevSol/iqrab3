# 🚀 Quick Fix - Duplicate Invoices (3 Steps)

## Problem
You have duplicate invoices with different amounts (1300 and 1400 Birr) for the same students.

## Solution (Takes 2 minutes)

### Step 1: Run Cleanup Script
Double-click this file:
```
DELETE_DUPLICATE_INVOICES.bat
```

**What it does:** Removes all duplicate invoices, keeps only the first one for each student/month.

---

### Step 2: Delete Extra Fee Structures

1. Open: **Finance → Monthly Payment Settings → Class Fees**
2. Look for duplicate fee structures (same class, different amounts)
3. Click **🗑️** button on the WRONG fee structure
4. Confirm deletion

**Example:**
- ✅ Keep: "Class C Monthly Fee" - 1300 Birr
- ❌ Delete: "Class C Monthly Fee" - 1400 Birr

---

### Step 3: Verify

1. Go to: **Finance → Monthly Payments**
2. Select a class
3. Check: Each student should have only ONE invoice per month
4. Verify: All amounts are consistent

---

## ✅ Done!

Your system is now clean:
- No duplicate invoices
- One fee structure per class
- Correct amounts for all students

---

## 🔧 If Delete Button Doesn't Work

1. Restart backend:
   ```cmd
   cd backend
   npm start
   ```

2. Refresh browser (Ctrl+F5)

3. Try delete button again

---

## 📖 Need More Details?

See: `FIX_DUPLICATE_INVOICES_NOW.md` for complete guide

---

**Status:** Ready to execute
**Time Required:** 2 minutes
**Risk:** Low (script only deletes duplicates, keeps originals)
