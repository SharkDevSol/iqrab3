# ✅ Automatic Late Fee Application

## What Was Implemented

Late fees are now applied **automatically** when invoices become overdue!

---

## How It Works

### Before (Manual):
```
1. Invoice becomes overdue
2. Admin must remember to click "⚡ Apply Late Fees Now"
3. Late fees are applied
4. Student sees updated balance
```

### After (Automatic):
```
1. Invoice becomes overdue
2. Student or admin views Monthly Payments page
3. System automatically checks and applies late fees
4. Student immediately sees updated balance with late fee
```

---

## When Late Fees Are Applied Automatically

### Triggers:
1. **When viewing overview page:**
   - Finance → Monthly Payments (main page)
   - System checks all invoices
   - Applies late fees to overdue invoices

2. **When viewing class details:**
   - Finance → Monthly Payments → Select Class
   - System checks invoices for that class
   - Applies late fees to overdue invoices

3. **Silent background process:**
   - Runs automatically
   - No user action required
   - No notification (silent)

---

## Late Fee Logic

### Conditions for Application:
1. ✅ Invoice status: ISSUED, PARTIALLY_PAID, or OVERDUE
2. ✅ Current date > Due date
3. ✅ Days past due > Grace period days
4. ✅ Invoice doesn't already have late fee (lateFeeAmount = 0)
5. ✅ Active late fee rule exists

### Calculation:
```javascript
// Fixed Amount (e.g., 50 Birr)
lateFeeAmount = 50 Birr

// Percentage (e.g., 5%)
lateFeeAmount = (invoiceAmount × 5) / 100
```

### Example Timeline:
```
Sep 11, 2025 (Meskerem 1):
  → Invoice created: 1200 Birr
  → Due date: Sep 26, 2025 (15 days grace)
  → Status: PENDING

Sep 26, 2025:
  → Due date reached
  → Status: Still PENDING (grace period ends today)

Sep 27, 2025:
  → Past due date (1 day overdue)
  → Student views Monthly Payments page
  → System automatically applies late fee: 50 Birr
  → New balance: 1250 Birr
  → Status: OVERDUE ✅
```

---

## What Happens Automatically

### Step 1: Check Overdue Invoices
```javascript
// Get all unpaid invoices without late fees
const invoices = await prisma.invoice.findMany({
  where: {
    status: { in: ['ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] },
    lateFeeAmount: 0 // Only invoices without late fees
  }
});
```

### Step 2: Calculate Days Past Due
```javascript
const today = new Date();
const dueDate = new Date(invoice.dueDate);
const daysPastDue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
```

### Step 3: Check Grace Period
```javascript
if (daysPastDue > gracePeriodDays) {
  // Apply late fee
}
```

### Step 4: Apply Late Fee
```javascript
await prisma.invoice.update({
  where: { id: invoice.id },
  data: {
    lateFeeAmount: 50, // or calculated amount
    netAmount: totalAmount + 50 - discountAmount,
    status: 'OVERDUE'
  }
});
```

---

## Visual Changes

### Invoice Table - Before:
```
Month      | Amount  | Due Date   | Status  | Action
-----------|---------|------------|---------|----------
Meskerem   | 1200    | 9/26/2025  | OVERDUE | 💳 Pay
Balance: 1200 Birr
```

### Invoice Table - After (Automatic):
```
Month      | Amount  | Due Date   | Status  | Action
-----------|---------|------------|---------|----------
Meskerem   | 1250    | 9/26/2025  | OVERDUE | 💳 Pay
           | (1200 + 50 late fee)
Balance: 1250 Birr ⚠️
```

---

## Benefits

### For Students:
- ✅ See accurate balance immediately
- ✅ No surprises - late fees show right away
- ✅ Clear indication of overdue status

### For School:
- ✅ No manual work required
- ✅ Late fees applied consistently
- ✅ Automatic enforcement of payment policy

### For System:
- ✅ Real-time updates
- ✅ No missed late fees
- ✅ Accurate financial reporting

---

## Technical Implementation

### Files Created:
1. **backend/services/autoLateFeeService.js**
   - Automatic late fee application logic
   - Runs silently in background
   - Checks and applies late fees

### Files Modified:
1. **backend/routes/financeMonthlyPaymentViewRoutes.js**
   - Added automatic late fee check to overview route
   - Added automatic late fee check to class details route
   - Runs before fetching invoice data

### Code Added:
```javascript
// In route handlers
const { applyLateFeesAutomatically } = require('../services/autoLateFeeService');

router.get('/overview', async (req, res) => {
  // Auto-apply late fees before fetching data
  await applyLateFeesAutomatically();
  
  // ... rest of route logic
});

router.get('/class/:className', async (req, res) => {
  // Auto-apply late fees before fetching data
  await applyLateFeesAutomatically();
  
  // ... rest of route logic
});
```

---

## Example Scenarios

### Scenario 1: Student Views Their Invoices
```
1. Student logs in
2. Goes to Finance → Monthly Payments
3. System automatically checks for overdue invoices
4. Finds Meskerem invoice is 5 days overdue
5. Applies 50 Birr late fee automatically
6. Student sees: "Balance: 1250 Birr (includes 50 Birr late fee)"
```

### Scenario 2: Admin Views Class Report
```
1. Admin goes to Monthly Payments
2. Selects "Class C"
3. System automatically checks all Class C invoices
4. Finds 10 students with overdue invoices
5. Applies late fees to all 10 automatically
6. Admin sees updated balances for all students
```

### Scenario 3: Multiple Overdue Months
```
Student has 3 overdue months:
- Meskerem: Due 9/26/2025, now 10/15/2025 (19 days overdue)
- Tikimt: Due 10/26/2025, not yet overdue
- Hidar: Due 11/25/2025, not yet overdue

System automatically:
1. Applies late fee to Meskerem only (past grace period)
2. Leaves Tikimt and Hidar without late fees (not yet due)
3. Student sees:
   - Meskerem: 1250 Birr (1200 + 50 late fee) ⚠️
   - Tikimt: 1200 Birr
   - Hidar: 1200 Birr
```

---

## Console Logging

### When Late Fees Are Applied:
```
✓ Auto-applied late fee to invoice INV-123: 50 Birr
✓ Auto-applied late fee to invoice INV-124: 50 Birr
✓ Auto-applied late fee to invoice INV-125: 50 Birr
🔔 Auto-applied late fees to 3 overdue invoices
```

### When No Late Fees Needed:
```
(No console output - silent operation)
```

---

## Important Notes

### Late Fee Applied Once:
- ✅ Late fee is applied only once per invoice
- ✅ System checks: `lateFeeAmount = 0` before applying
- ✅ Once applied, won't apply again

### Grace Period Respected:
- ✅ Late fee only applies after grace period
- ✅ Example: 15 days grace = late fee on day 16
- ✅ Due date + grace period = late fee start date

### Multiple Rules:
- ✅ If multiple late fee rules exist, uses first applicable one
- ✅ Only one late fee per invoice
- ✅ Uses the rule with longest grace period first

---

## Testing

### Test Scenario 1: View Overdue Invoice
1. Create an invoice with past due date
2. Go to Monthly Payments page
3. Check if late fee is automatically added
4. Verify balance shows: Original + Late fee

### Test Scenario 2: Within Grace Period
1. Create an invoice due yesterday (within 15 days)
2. Go to Monthly Payments page
3. Verify NO late fee is added
4. Verify status is still PENDING

### Test Scenario 3: Past Grace Period
1. Create an invoice due 20 days ago
2. Go to Monthly Payments page
3. Verify late fee IS added
4. Verify status changes to OVERDUE

---

## Manual Override Still Available

### If Needed:
You can still manually apply late fees using:
```
Finance → Monthly Payment Settings → Late Fees → ⚡ Apply Late Fees Now
```

This is useful for:
- Bulk application to all invoices
- Testing late fee rules
- Forcing re-check of all invoices

---

## Summary

✅ **Late fees now apply automatically**
✅ **No manual button click required**
✅ **Runs when viewing Monthly Payments page**
✅ **Silent background process**
✅ **Respects grace period**
✅ **Applied only once per invoice**

---

**Date:** February 4, 2026
**Status:** ✅ Complete
**Type:** Automatic Background Process
