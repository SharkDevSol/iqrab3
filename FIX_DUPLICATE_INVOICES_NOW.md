# 🔧 Fix Duplicate Invoices - Complete Guide

## Current Situation

You have duplicate invoices with different amounts (1300 Birr and 1400 Birr) for the same students and months. This happened because:

1. **Multiple fee structures were created** for the same class with different amounts
2. **Invoices were generated multiple times** before the duplicate prevention check was added

## ✅ What's Already Fixed

1. **Delete Button Added** - Late fee rules now have a 🗑️ Delete button
2. **Duplicate Prevention** - New code prevents creating duplicate invoices
3. **Cleanup Script Ready** - Script to remove duplicate invoices is ready

---

## 🚀 Step-by-Step Fix

### Step 1: Run the Cleanup Script

This will remove ALL duplicate invoices, keeping only the first one for each student/month combination.

**Option A: Using the Batch File (Easiest)**
```cmd
DELETE_DUPLICATE_INVOICES.bat
```

**Option B: Using Command Line**
```cmd
cd backend
node scripts/delete-duplicate-invoices.js
```

**What it does:**
- Finds all invoices with the same studentId + monthNumber
- Keeps the FIRST invoice (oldest)
- Deletes all duplicates
- Removes related payment allocations and invoice items

**Expected Output:**
```
🔍 Finding duplicate invoices...

Found 2 duplicates for 00000000-0000-0000-0006-000000000003-1
Found 2 duplicates for 00000000-0000-0000-0006-000000000003-2

🗑️  Deleting X duplicate invoices...

✅ Successfully deleted X duplicate invoices!

📊 Summary:
   - Total duplicates removed: X
   - Unique invoices kept: Y
```

---

### Step 2: Delete Extra Fee Structures

After cleaning up invoices, you need to delete the fee structures that created the wrong amounts.

1. **Go to:** Finance → Monthly Payment Settings → Class Fees tab
2. **Look for:** Multiple fee structures for the same class (e.g., "Class C Monthly Fee 2026-2027")
3. **Check amounts:** One shows 1300 Birr, another shows 1400 Birr
4. **Delete the wrong one:** Click the 🗑️ button next to the incorrect fee structure
5. **Confirm deletion:** This will remove the fee structure and prevent future duplicates

**⚠️ Important:** Delete the fee structure with the WRONG amount, keep the correct one!

---

### Step 3: Verify Everything is Clean

1. **Check Monthly Payments View:**
   ```
   Finance → Monthly Payments → Select Class C
   ```
   - Each student should have only ONE invoice per month
   - All amounts should be consistent (either all 1300 or all 1400)

2. **Check Invoice Count:**
   - If you have 10 students and 5 months selected
   - You should have exactly 50 invoices (10 × 5)
   - NOT 100 invoices (which means duplicates still exist)

3. **Check Student Balance:**
   - Click on any student
   - Verify they have the correct number of month circles
   - No duplicate months should appear

---

### Step 4: Test Late Fee Delete Button

1. **Go to:** Finance → Monthly Payment Settings → Late Fees tab
2. **Find any late fee rule**
3. **Click:** 🗑️ Delete button
4. **Confirm:** The rule should be permanently deleted
5. **Verify:** Refresh the page - the rule should be gone

---

## 🔍 Why Different Amounts (1300 vs 1400)?

This indicates you created TWO different fee structures for the same class:

**Fee Structure 1:**
- Class: C
- Amount: 1300 Birr/month
- Created: First

**Fee Structure 2:**
- Class: C  
- Amount: 1400 Birr/month
- Created: Later (maybe you changed your mind?)

When you clicked "Generate All Months" on BOTH fee structures, it created:
- 5 invoices × 10 students = 50 invoices at 1300 Birr
- 5 invoices × 10 students = 50 invoices at 1400 Birr
- **Total: 100 invoices (50 duplicates!)**

---

## 🛡️ Prevention (Already Implemented)

The code now prevents this from happening again:

1. **Duplicate Check:** Before generating invoices, the system checks if invoices already exist for that fee structure
2. **Error Message:** If duplicates are found, you'll see:
   ```
   "Invoices already generated for this fee structure.
   Delete them first if you want to regenerate."
   ```
3. **One Fee Structure Per Class:** You can only have one active fee structure per class at a time

---

## 📋 Checklist

- [ ] Run `DELETE_DUPLICATE_INVOICES.bat`
- [ ] Verify cleanup was successful (check output)
- [ ] Delete extra fee structures (keep only one per class)
- [ ] Verify Monthly Payments view shows correct data
- [ ] Test late fee delete button works
- [ ] Restart backend server: `cd backend && npm start`
- [ ] Refresh frontend in browser (Ctrl+F5)

---

## 🆘 If Something Goes Wrong

### Problem: Script shows "No duplicate invoices found" but you still see duplicates

**Solution:**
The duplicates might have different metadata. Run this to check:

```cmd
cd backend
node scripts/check-invoices.js
```

### Problem: Delete button doesn't work for late fee rules

**Solution:**
1. Check browser console for errors (F12)
2. Restart backend server
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

### Problem: Still seeing duplicate invoices after cleanup

**Solution:**
The cleanup script only removes duplicates with the same studentId + monthNumber. If invoices have different metadata, they won't be detected. You may need to:

1. Delete ALL invoices manually:
   ```cmd
   cd backend
   node scripts/delete-all-finance-data.js
   ```

2. Delete ALL fee structures from the UI

3. Start fresh:
   - Create ONE fee structure per class
   - Generate invoices ONCE
   - Don't click "Generate All Months" multiple times

---

## 💡 Best Practices Going Forward

1. **One Fee Structure Per Class** - Don't create multiple fee structures for the same class
2. **Generate Once** - Only click "Generate All Months" ONE time per fee structure
3. **Delete Before Regenerating** - If you need to change amounts, delete the fee structure first (this deletes all related invoices)
4. **Check Before Creating** - Always check if a fee structure already exists before creating a new one

---

## 🎯 Expected Final State

After following all steps:

✅ **Fee Structures:**
- Class A: 1 fee structure (e.g., 1200 Birr/month)
- Class B: 1 fee structure (e.g., 1500 Birr/month)
- Class C: 1 fee structure (e.g., 1300 Birr/month)

✅ **Invoices:**
- Each student has exactly ONE invoice per month
- All amounts are consistent within each class
- No duplicates

✅ **Late Fee Rules:**
- Delete button works
- Can add/remove rules as needed

✅ **Monthly Payments View:**
- Shows correct balance
- Month circles display correctly
- Payment history is accurate

---

## 📞 Need Help?

If you're still seeing issues after following this guide:

1. Check the backend console for error messages
2. Check the browser console (F12) for frontend errors
3. Verify the database connection is working
4. Make sure you're using the latest code (restart backend)

---

**Last Updated:** February 4, 2026
**Status:** Ready to execute
