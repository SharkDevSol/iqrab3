# Automatic Balance Accumulation System

## How It Works Now

### ✅ One-Time Invoice Generation

Instead of clicking "Generate Next Month" multiple times, you now click **"Generate All Months"** ONCE and the system:

1. **Creates ALL invoices** for all selected months at once
2. **Automatically accumulates balance** each month
3. **Applies late fees** to overdue invoices automatically

## Example Scenario

### Setup
- Class: Grade 5
- Monthly Fee: 1,300 Birr
- Selected Months: 10 months (Meskerem to Sene)
- Students: 3 students

### Step 1: Click "Generate All Months" (ONE TIME)

The system creates:
- **30 invoices total** (3 students × 10 months)
- Each student gets 10 invoices (one for each month)
- Due dates are 30 days apart

### Step 2: Balance Accumulates Automatically

**Month 1 (Meskerem) - Due: Day 30**
- Student A balance: 1,300 Birr
- Student B balance: 1,300 Birr
- Student C balance: 1,300 Birr

**Month 2 (Tikimt) - Due: Day 60**

If Student A didn't pay Month 1:
- Month 1: 1,300 Birr (unpaid)
- Month 2: 1,300 Birr (due)
- **Total balance: 2,600 Birr** ✅

If Student B paid Month 1:
- Month 1: 0 Birr (paid ✓)
- Month 2: 1,300 Birr (due)
- **Total balance: 1,300 Birr** ✅

**Month 3 (Hidar) - Due: Day 90**

If Student A still didn't pay:
- Month 1: 1,300 + 50 late fee = 1,350 Birr (overdue)
- Month 2: 1,300 + 50 late fee = 1,350 Birr (overdue)
- Month 3: 1,300 Birr (due)
- **Total balance: 4,000 Birr** ✅

## How Balance Calculation Works

The system automatically:

1. **Checks all unpaid invoices** for the student
2. **Calculates days overdue** for each invoice
3. **Applies late fees** based on late fee rules
4. **Sums everything** to show total balance

### Balance Formula

```
Total Balance = 
  Sum of all unpaid invoice amounts
  + Sum of all late fees on overdue invoices
```

### Example Calculation

Student has 3 unpaid invoices:
- Invoice 1 (Meskerem): 1,300 Birr, 15 days overdue → Late fee: 50 Birr
- Invoice 2 (Tikimt): 1,300 Birr, 5 days overdue → Late fee: 0 Birr (grace period)
- Invoice 3 (Hidar): 1,300 Birr, not yet due → Late fee: 0 Birr

**Total Balance = 1,300 + 50 + 1,300 + 0 + 1,300 + 0 = 3,950 Birr**

## Payment Processing

### When Student Makes Payment

The system automatically:

1. **Allocates to oldest invoice first** (FIFO - First In, First Out)
2. **Updates invoice status** (PAID, PARTIALLY_PAID, PENDING)
3. **Recalculates balance** for remaining unpaid invoices

### Payment Example

**Student owes:**
- Month 1: 1,350 Birr (1,300 + 50 late fee)
- Month 2: 1,300 Birr
- Month 3: 1,300 Birr
- **Total: 3,950 Birr**

**Student pays: 2,000 Birr**

**System allocates:**
1. Month 1 invoice: 1,350 Birr → **PAID** ✓
2. Month 2 invoice: 650 Birr → **PARTIALLY_PAID**

**New balance: 1,950 Birr** (650 from Month 2 + 1,300 from Month 3)

## Setting Up the System

### Step 1: Create Fee Structure

1. Go to **Finance → Monthly Payment Settings**
2. Click **"+ Add Class Fee"**
3. Select class and enter monthly fee
4. **Select Ethiopian months** (e.g., 10 months)
5. Click **"Add Class Fee"**

### Step 2: Generate All Invoices (ONE TIME)

1. Click **"Generate All Months"** button
2. Confirm the dialog
3. System creates ALL invoices for ALL months

**That's it!** No need to click again each month.

### Step 3: Monitor Balances

The system automatically:
- Tracks unpaid invoices
- Applies late fees to overdue amounts
- Shows current balance for each student

## Viewing Student Balances

### In Monthly Payments Section

1. Go to **Finance → Monthly Payments**
2. Select class
3. View student list with:
   - Current balance
   - Unpaid months count
   - Late fees accumulated
   - Payment history

### Balance Display Example

```
Student: Ahmed Ali
Class: Grade 5

Current Balance: 4,000 Birr

Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Month 1 (Meskerem)
  Amount: 1,300 Birr
  Late Fee: 50 Birr
  Status: OVERDUE (15 days)
  Subtotal: 1,350 Birr

Month 2 (Tikimt)
  Amount: 1,300 Birr
  Late Fee: 50 Birr
  Status: OVERDUE (5 days)
  Subtotal: 1,350 Birr

Month 3 (Hidar)
  Amount: 1,300 Birr
  Late Fee: 0 Birr
  Status: PENDING (due in 10 days)
  Subtotal: 1,300 Birr
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Balance: 4,000 Birr
Unpaid Months: 3
Total Late Fees: 100 Birr
```

## Late Fee Rules

### How Late Fees Work

1. **Grace Period**: No late fee during grace period (e.g., 5 days)
2. **After Grace Period**: Late fee applies
3. **Types**:
   - **Fixed Amount**: e.g., 50 Birr per overdue invoice
   - **Percentage**: e.g., 5% of invoice amount

### Setting Up Late Fees

1. Go to **Finance → Monthly Payment Settings**
2. Click **Late Fees** tab
3. Click **"+ Add Late Fee Rule"**
4. Configure:
   ```
   Rule Name: Standard Late Fee
   Grace Period: 5 days
   Penalty Type: Fixed Amount
   Penalty Value: 50
   ```
5. Click **"Add Late Fee Rule"**

## Reports and Tracking

### Available Reports

1. **Student Balance Report**
   - All students with balances
   - Unpaid amounts per student
   - Late fees accumulated

2. **Monthly Collection Report**
   - Total collected per month
   - Outstanding balance per month
   - Payment trends

3. **Class Payment Summary**
   - Total students in class
   - Students with unpaid balance
   - Total outstanding amount
   - Average balance per student

4. **Overdue Invoices Report**
   - All overdue invoices
   - Days overdue
   - Late fees applied
   - Students affected

## Advantages of This System

### ✅ One-Time Setup
- Click "Generate All Months" once
- No need to remember to generate each month
- All invoices created upfront

### ✅ Automatic Balance Accumulation
- System tracks unpaid amounts
- Automatically adds to balance
- No manual calculation needed

### ✅ Automatic Late Fees
- Applied after grace period
- Calculated based on days overdue
- Added to balance automatically

### ✅ FIFO Payment Allocation
- Oldest invoices paid first
- Fair and transparent
- Automatic allocation

### ✅ Real-Time Balance Tracking
- Always up-to-date
- Includes all unpaid amounts
- Shows late fees

## Troubleshooting

### Issue: "Invoices already generated"

**Cause:** You already clicked "Generate All Months" for this fee structure.

**Solution:** 
- Invoices are already created
- Check the invoices section to view them
- If you need to regenerate, delete the fee structure and create a new one

### Issue: Balance not showing correctly

**Check:**
- Are all invoices created?
- Are late fee rules active?
- Is the due date correct?

**Solution:**
- Verify invoices exist for all months
- Check late fee rule settings
- Ensure due dates are set correctly

### Issue: Late fees not applying

**Check:**
- Is late fee rule active?
- Is invoice past due date?
- Is grace period configured correctly?

**Solution:**
- Activate late fee rule
- Check invoice due dates
- Verify grace period settings

## Best Practices

### 1. Generate Invoices at Start of Academic Year
- Create fee structure
- Click "Generate All Months" once
- All invoices ready for the year

### 2. Set Reasonable Late Fees
- Grace period: 5-10 days
- Fixed amount: 50-100 Birr
- Or percentage: 2-5%

### 3. Monitor Balances Regularly
- Check weekly
- Follow up with high balances
- Send payment reminders

### 4. Process Payments Promptly
- Record as soon as received
- Verify allocation
- Provide receipts

## Summary

### Old Way (Manual)
1. Click "Generate Next Month" for Month 1
2. Wait for Month 2
3. Click "Generate Next Month" for Month 2
4. Wait for Month 3
5. Click "Generate Next Month" for Month 3
6. ... repeat 10 times

### New Way (Automatic) ✅
1. Click **"Generate All Months"** ONCE
2. System creates all 10 months of invoices
3. Balance accumulates automatically
4. Late fees apply automatically
5. Done! 🎉

**No more clicking every month!**
**Balance accumulates automatically!**
**Late fees apply automatically!**

This is the Ethiopian calendar monthly payment system with automatic balance accumulation!
