# 🧪 Test Late Fee Fixes Now

## Quick Test Guide (10 minutes)

### Test 1: Fix Tir Month Late Fee (2 minutes)

**Steps**:
1. Restart backend server (to load new code)
2. Go to Finance → Monthly Payments
3. Select your class
4. Click on a student
5. Look at the invoice table

**Expected Result**:
- All overdue months should show the same late fee
- Example: Meskerem, Tikimt, Hidar, Tahsas all show 1270 Birr (1200 + 70)
- **Tir should also show 1270 Birr** (not 1200 Birr)

**If Tir still shows 1200 Birr**:
1. Go to Finance → Monthly Payment Settings
2. Click "Late Fees" tab
3. Click "⚡ Apply Late Fees Now"
4. Go back to Monthly Payments
5. Refresh the page
6. Tir should now show 1270 Birr ✅

---

### Test 2: Pay Multiple Months (3 minutes)

**Steps**:
1. Go to Finance → Monthly Payments
2. Select a class and student
3. Click "💰 Pay Multiple Months" button
4. Try selecting months:

**Test Case A: Select First Month**
- Click on the first unpaid month (e.g., Meskerem)
- ✅ Should be selected
- Total should update

**Test Case B: Select Next Month**
- Click on the next month (e.g., Tikimt)
- ✅ Should be selected
- Total should update to sum of both months

**Test Case C: Try to Skip a Month**
- Deselect Tikimt
- Try to click Hidar (skipping Tikimt)
- ❌ Should show error: "Please select months in sequential order"

**Test Case D: Try to Start with Wrong Month**
- Deselect all months
- Try to click Tikimt (not the first unpaid)
- ❌ Should show error: "Please start with Meskerem (the first unpaid month)"

**Test Case E: Select Multiple Sequential Months**
- Select Meskerem
- Select Tikimt
- Select Hidar
- ✅ All three should be selected
- Total should be sum of all three

**Test Case F: Submit Payment**
- Keep 3 months selected
- Fill in payment details
- Click "✓ Pay 3 Months"
- ✅ Should succeed
- All 3 months should be marked as paid

---

### Test 3: Apply Late Fees Now (2 minutes)

**Steps**:
1. Go to Finance → Monthly Payment Settings
2. Click "Late Fees" tab
3. Click "⚡ Apply Late Fees Now" button

**Expected Result**:
```
✅ Late fees applied successfully!

X invoices received late fees.
(Y already had late fees)

Refresh the Monthly Payments page to see updated balances.
```

**Verify**:
1. Go to Finance → Monthly Payments
2. Select a class and student
3. Check overdue invoices
4. All should have late fees applied
5. Balance should include late fee (e.g., 1270 Birr instead of 1200 Birr)

**If it says "0 invoices received late fees"**:
- This means all overdue invoices already have late fees ✅
- Or no invoices are past the grace period yet

---

### Test 4: Toggle Off Removes Late Fees (3 minutes)

**Before Test - Check Current Balances**:
1. Go to Finance → Monthly Payments
2. Select a class and student
3. Note the balance of an overdue month (e.g., Meskerem: 1270 Birr)

**Steps**:
1. Go to Finance → Monthly Payment Settings
2. Click "Late Fees" tab
3. Find your active late fee rule
4. Toggle it OFF (click the switch to inactive)

**Expected Result**:
```
✅ Late fee rule deactivated and late fees removed from all invoices
```

**Verify Late Fees Removed**:
1. Go to Finance → Monthly Payments
2. Select the same class and student
3. Check the same overdue month
4. Balance should be REDUCED by late fee amount
5. Example: 1270 Birr → 1200 Birr ✅

**Re-enable the Rule**:
1. Go back to Monthly Payment Settings → Late Fees
2. Toggle the rule back ON
3. Click "⚡ Apply Late Fees Now"
4. Late fees should be reapplied
5. Balance should go back up: 1200 Birr → 1270 Birr ✅

---

## Complete Test Checklist

- [ ] **Test 1**: Tir month shows late fee (1270 Birr, not 1200 Birr)
- [ ] **Test 2A**: Can select first unpaid month
- [ ] **Test 2B**: Can select next consecutive month
- [ ] **Test 2C**: Cannot skip months (shows error)
- [ ] **Test 2D**: Cannot start with wrong month (shows error)
- [ ] **Test 2E**: Can select multiple sequential months
- [ ] **Test 2F**: Can submit payment for multiple months
- [ ] **Test 3**: Apply Late Fees Now works and shows results
- [ ] **Test 4**: Toggle off removes late fees from balances
- [ ] **Test 4B**: Toggle back on and reapply works

---

## Troubleshooting

### Issue: Tir still shows 1200 Birr
**Solution**: 
1. Click "⚡ Apply Late Fees Now" in Payment Settings
2. Refresh the Monthly Payments page
3. Should now show 1270 Birr

### Issue: Can't select any months in multi-month payment
**Solution**:
1. Make sure there are unpaid months
2. Make sure you're starting with the first unpaid month
3. Check browser console for errors

### Issue: Apply Late Fees says "0 invoices"
**Solution**:
- This is normal if all overdue invoices already have late fees
- Or if no invoices are past the grace period yet
- Check the grace period setting (e.g., 15 days)

### Issue: Toggle off doesn't remove late fees
**Solution**:
1. Make sure you're toggling the rule OFF (not ON)
2. Check the success message
3. Refresh the Monthly Payments page
4. Clear browser cache if needed

### Issue: Backend errors
**Solution**:
1. Restart backend server: `cd backend && node server.js`
2. Check backend terminal for error messages
3. Make sure database is running

---

## Expected Behavior Summary

### Multi-Month Payment
```
✅ ALLOWED:
- Select first unpaid month
- Select next consecutive month
- Select multiple consecutive months
- Deselect and reselect in order

❌ NOT ALLOWED:
- Skip months
- Select out of order
- Start with non-first month
```

### Late Fee Application
```
✅ WHEN APPLIED:
- Invoice is past due date
- Invoice is past grace period
- Invoice doesn't already have late fee

❌ WHEN SKIPPED:
- Invoice not yet due
- Invoice within grace period
- Invoice already has late fee
```

### Toggle Off Behavior
```
✅ WHEN TOGGLING OFF:
- Automatically removes late fees from ALL invoices
- Updates balances immediately
- Shows confirmation message

✅ WHEN TOGGLING BACK ON:
- Late fees NOT automatically reapplied
- Must click "⚡ Apply Late Fees Now"
- Or wait for auto-apply on next page load
```

---

## Success Criteria

All fixes are working if:
1. ✅ Tir month shows late fee (same as other overdue months)
2. ✅ Can select multiple consecutive months for payment
3. ✅ Cannot skip months or select out of order
4. ✅ Apply Late Fees Now button works and shows results
5. ✅ Toggle off removes late fees from balances
6. ✅ Toggle back on and reapply restores late fees

---

## Quick Commands

### Restart Backend
```bash
cd backend
node server.js
```

### Check Database for Late Fees
```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.invoice.findMany({ 
  where: { lateFeeAmount: { gt: 0 } },
  select: { invoiceNumber: true, lateFeeAmount: true, netAmount: true }
})
.then(invoices => {
  console.log('Invoices with late fees:', invoices.length);
  invoices.forEach(inv => {
    console.log(inv.invoiceNumber, '- Late Fee:', inv.lateFeeAmount, 'Birr');
  });
  process.exit(0);
});
"
```

### Remove All Late Fees (Manual)
```bash
cd backend
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.invoice.updateMany({ 
  where: { lateFeeAmount: { gt: 0 } },
  data: { lateFeeAmount: 0 }
})
.then(result => {
  console.log('Removed late fees from', result.count, 'invoices');
  process.exit(0);
});
"
```

All fixes are ready to test! 🎉
