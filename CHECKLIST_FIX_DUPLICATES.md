# ✅ Checklist: Fix Duplicate Invoices

Print this page and check off each item as you complete it.

---

## 📋 Pre-Flight Check

Before you start, verify:

- [ ] Backend server is running (`cd backend && npm start`)
- [ ] Frontend is accessible (http://localhost:3000 or http://localhost:5173)
- [ ] You can log in to the system
- [ ] You have admin access to Finance module

**If any of these fail, fix them first before continuing.**

---

## 🚀 Step 1: Run Cleanup Script

### Actions:
- [ ] Locate file: `DELETE_DUPLICATE_INVOICES.bat`
- [ ] Double-click the file
- [ ] Press Enter when prompted
- [ ] Wait for script to complete (10-30 seconds)

### Verify Success:
- [ ] See message: "✅ Successfully deleted X duplicate invoices!"
- [ ] See summary with count of duplicates removed
- [ ] No error messages in output

### If Failed:
- [ ] Check backend is running
- [ ] Check database connection
- [ ] Try running manually: `cd backend && node scripts/delete-duplicate-invoices.js`
- [ ] Check console for error messages

---

## 🗑️ Step 2: Delete Extra Fee Structures

### Navigate:
- [ ] Open Finance module
- [ ] Go to Monthly Payment Settings
- [ ] Click on "Class Fees" tab

### Identify Duplicates:
- [ ] Look for fee structures with same class name
- [ ] Note the different amounts (e.g., 1300 vs 1400)
- [ ] Identify which amount is CORRECT
- [ ] Identify which amount is WRONG

### Delete Wrong Ones:
For each duplicate fee structure:
- [ ] Click 🗑️ button on the WRONG fee structure
- [ ] Read confirmation dialog carefully
- [ ] Confirm deletion
- [ ] Wait for success message
- [ ] Verify fee structure disappears from list

### Verify:
- [ ] Each class has only ONE fee structure
- [ ] All amounts are correct
- [ ] No duplicate class names

---

## ✅ Step 3: Verify Monthly Payments

### Navigate:
- [ ] Go to Finance → Monthly Payments
- [ ] Select a class that had duplicates

### Check Student List:
- [ ] Each student appears only once
- [ ] All amounts are consistent (not mixed 1300/1400)
- [ ] Balance calculations look correct

### Check Student Details:
Pick any student and verify:
- [ ] Month circles display correctly
- [ ] Each month appears only once (no duplicate circles)
- [ ] Green circles = paid months
- [ ] Red circles = unpaid unlocked months
- [ ] Blue circles = locked future months
- [ ] Total balance is correct

### Check Multiple Students:
Repeat for 2-3 more students:
- [ ] Student 2: Correct invoices
- [ ] Student 3: Correct invoices
- [ ] Student 4: Correct invoices

---

## 🔧 Step 4: Test Late Fee Delete Button

### Navigate:
- [ ] Go to Finance → Monthly Payment Settings
- [ ] Click on "Late Fees" tab

### Test Delete:
- [ ] Find any late fee rule
- [ ] Click 🗑️ Delete button
- [ ] Read confirmation dialog
- [ ] Confirm deletion
- [ ] Verify success message appears
- [ ] Verify rule disappears from list

### Verify Persistence:
- [ ] Refresh the page (F5)
- [ ] Verify deleted rule is still gone
- [ ] Verify other rules are still there

### If Failed:
- [ ] Restart backend server
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Try again

---

## 🛡️ Step 5: Test Duplicate Prevention

### Create Test Fee Structure:
- [ ] Go to Monthly Payment Settings → Class Fees
- [ ] Click "+ Add Class Fee"
- [ ] Select a class that already has a fee structure
- [ ] Enter any amount
- [ ] Select some months
- [ ] Click "Add Class Fee"

### Expected Result:
- [ ] Should succeed (creates second fee structure)

### Try to Generate Invoices:
- [ ] Click "Generate All Months" on the NEW fee structure
- [ ] Should see error: "Invoices already generated for this fee structure"
- [ ] Invoices should NOT be created

### Clean Up:
- [ ] Delete the test fee structure you just created
- [ ] Verify it's deleted

---

## 📊 Step 6: Final Verification

### Database Check:
Run this query (optional, for advanced users):
```sql
SELECT studentId, 
       JSON_EXTRACT(metadata, '$.monthNumber') as month,
       COUNT(*) as count
FROM Invoice
GROUP BY studentId, month
HAVING count > 1;
```

Expected result:
- [ ] No rows returned (no duplicates)

### Invoice Count Check:
Calculate expected invoices:
- Number of students: _____ (e.g., 10)
- Number of months: _____ (e.g., 5)
- Expected total: _____ (students × months)

Check actual count:
- [ ] Go to Monthly Payments
- [ ] Count total invoices shown
- [ ] Actual count matches expected count

### Balance Check:
Pick any student:
- Monthly fee: _____ Birr (e.g., 1300)
- Unpaid months: _____ (e.g., 5)
- Expected balance: _____ Birr (fee × months)
- Actual balance: _____ Birr
- [ ] Actual matches expected

---

## 🎉 Success Criteria

You're done when ALL of these are true:

- [ ] Cleanup script ran successfully
- [ ] All duplicate fee structures deleted
- [ ] Each student has only ONE invoice per month
- [ ] All amounts are consistent within each class
- [ ] Month circles display correctly
- [ ] Late fee delete button works
- [ ] Cannot create duplicate invoices
- [ ] Balance calculations are correct
- [ ] No error messages in console
- [ ] System feels "clean" and correct

---

## 📝 Notes Section

Use this space to write down any issues or observations:

```
Issue 1:
________________________________________________________
________________________________________________________

Issue 2:
________________________________________________________
________________________________________________________

Issue 3:
________________________________________________________
________________________________________________________
```

---

## 🆘 Troubleshooting

If you encounter problems:

### Problem: Cleanup script shows "No duplicates found"
**Solution:**
- [ ] Check if duplicates actually exist in Monthly Payments view
- [ ] If yes, duplicates might have different metadata
- [ ] Contact support with screenshot

### Problem: Delete button doesn't work
**Solution:**
- [ ] Restart backend: `cd backend && npm start`
- [ ] Clear browser cache: Ctrl+Shift+Delete
- [ ] Refresh page: Ctrl+F5
- [ ] Try again

### Problem: Still seeing duplicates after cleanup
**Solution:**
- [ ] Run cleanup script again
- [ ] Check backend console for errors
- [ ] Verify database connection
- [ ] Contact support if persists

### Problem: Can't find duplicate fee structures
**Solution:**
- [ ] Check all pages (use pagination)
- [ ] Look for same class name with different amounts
- [ ] Check academic year matches
- [ ] May be on different page

---

## 📞 Support

If you need help:

1. **Check Documentation:**
   - [ ] Read `START_HERE_FIX_DUPLICATES.md`
   - [ ] Read `FIX_DUPLICATE_INVOICES_NOW.md`
   - [ ] Read `DUPLICATE_INVOICE_VISUAL_GUIDE.md`

2. **Check Logs:**
   - [ ] Backend console for errors
   - [ ] Browser console (F12) for errors
   - [ ] Cleanup script output

3. **Contact Support:**
   - [ ] Provide error messages
   - [ ] Provide screenshots
   - [ ] Describe what you tried

---

## ⏱️ Time Tracking

Track how long each step takes:

- Step 1 (Cleanup): _____ minutes
- Step 2 (Delete): _____ minutes
- Step 3 (Verify): _____ minutes
- Step 4 (Test Delete): _____ minutes
- Step 5 (Test Prevention): _____ minutes
- Step 6 (Final Check): _____ minutes

**Total Time:** _____ minutes

**Expected:** ~3-5 minutes

---

## ✅ Sign-Off

When everything is complete:

**Completed by:** _______________________

**Date:** _______________________

**Time:** _______________________

**Status:** ☐ Success  ☐ Partial  ☐ Failed

**Notes:** 
________________________________________________________
________________________________________________________
________________________________________________________

---

**You're all set! 🎉**
