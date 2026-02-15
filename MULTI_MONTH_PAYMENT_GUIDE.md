# Multi-Month Payment Feature - Complete Guide

## ✅ What's New

Students can now pay for multiple months at once! This is perfect for:
- Parents who want to pay several months in advance
- Students with accumulated arrears
- Bulk payments at the beginning of term

---

## 🎯 How It Works

### Single Month Payment (As Before)
- Click **"💳 Pay This Month"** button
- Pay only the current invoice
- Quick and simple

### Multi-Month Payment (NEW!)
- Click **"📅 Pay Multiple Months"** button
- See all unpaid invoices for that student
- Select which months to pay
- Pay all at once with one transaction

---

## 📋 Step-by-Step Guide

### Step 1: Open Monthly Payments
1. Go to **Finance → Monthly Payments**
2. Select month and year
3. Find the student in the table

### Step 2: Click "Pay Multiple Months"
1. Find the student's row
2. Click **"📅 Pay Multiple Months"** button
3. Modal opens showing all unpaid invoices

### Step 3: Select Invoices
The modal shows:
- **Student Info**: Name, Class, ID
- **All Unpaid Invoices**: Listed by month
- **Checkboxes**: Select which months to pay

**Each invoice shows:**
- Month and year (e.g., "February 2026")
- Invoice number
- Due date
- Total amount
- Amount already paid (if partial)
- Balance remaining
- OVERDUE tag (if past due date)

**By default**: All invoices are selected

### Step 4: Adjust Selection (Optional)
- **Uncheck** invoices you don't want to pay
- **Check** invoices you want to pay
- See **total update** automatically

**Selection Summary shows:**
- Number of invoices selected
- Total amount for selected invoices

### Step 5: Enter Payment Details
1. **Payment Amount**: 
   - Pre-filled with total of selected invoices
   - Can pay less (partial payment)
   - Cannot pay more than total

2. **Payment Method**: Cash, Bank Transfer, Mobile Money, etc.

3. **Payment Date**: When payment was made

4. **Reference Number**: Transaction ID (optional)

5. **Notes**: Any additional information (optional)

### Step 6: Submit Payment
1. Click **"✓ Record Payment"**
2. System processes payment
3. Success message shows:
   - Number of invoices paid
   - Total amount paid

### Step 7: Verify
- Page refreshes automatically
- Check invoice statuses updated
- Verify amounts paid

---

## 💡 How Payment is Applied

**Important**: Payment is applied in chronological order (oldest first)

### Example 1: Full Payment for 3 Months

**Student has 3 unpaid invoices:**
- February: $1300
- March: $1300
- April: $1300
- **Total: $3900**

**Parent pays: $3900**

**Result:**
- February: PAID ($1300)
- March: PAID ($1300)
- April: PAID ($1300)
- All invoices fully paid ✅

### Example 2: Partial Payment for Multiple Months

**Student has 3 unpaid invoices:**
- February: $1300
- March: $1300
- April: $1300
- **Total: $3900**

**Parent pays: $2000**

**Result:**
- February: PAID ($1300) ✅
- March: PARTIALLY PAID ($700 of $1300)
- April: PENDING ($0 of $1300)
- Remaining balance: $1900

### Example 3: Selective Payment

**Student has 4 unpaid invoices:**
- January: $1300 (OVERDUE)
- February: $1300 (OVERDUE)
- March: $1300
- April: $1300

**Parent selects only:**
- ✅ January
- ✅ February
- ❌ March (unchecked)
- ❌ April (unchecked)

**Parent pays: $2600**

**Result:**
- January: PAID ($1300) ✅
- February: PAID ($1300) ✅
- March: PENDING (not selected)
- April: PENDING (not selected)

### Example 4: Paying with Arrears

**Student has invoices with arrears:**
- February: $1400 ($1300 + $100 late fee)
- March: $2700 ($1300 current + $1400 arrears)
- **Total: $4100**

**Parent pays: $4100**

**Result:**
- February: PAID ($1400) ✅
- March: PAID ($2700) ✅
- All cleared! ✅

---

## 🎨 Visual Features

### Invoice Display
Each invoice card shows:
- 📅 Month and year
- 📄 Invoice number
- 📆 Due date
- 💰 Total amount
- ✅ Amount paid (if any)
- 💵 Balance remaining
- 🔴 OVERDUE tag (if late)

### Color Coding
- **White background**: Normal invoice
- **Red background**: Overdue invoice
- **Green text**: Amount already paid
- **Red tag**: OVERDUE indicator

### Selection Summary
- Shows count of selected invoices
- Shows total amount
- Updates in real-time as you check/uncheck

---

## 📊 Use Cases

### Use Case 1: Beginning of Term Payment
**Scenario**: Parent wants to pay for entire term (3 months)

**Steps:**
1. Click "Pay Multiple Months"
2. All 3 months selected by default
3. Enter $3900 (3 × $1300)
4. Submit
5. Done! All 3 months paid ✅

### Use Case 2: Catching Up on Arrears
**Scenario**: Student missed 2 months, now paying all 3

**Steps:**
1. Click "Pay Multiple Months"
2. See 3 unpaid invoices (2 overdue, 1 current)
3. All selected by default
4. Enter total amount
5. Submit
6. All caught up! ✅

### Use Case 3: Partial Catch-Up
**Scenario**: Student owes 4 months but can only pay 2

**Steps:**
1. Click "Pay Multiple Months"
2. See 4 unpaid invoices
3. Uncheck 2 recent months
4. Keep 2 oldest months checked
5. Enter amount for 2 months
6. Submit
7. 2 oldest months paid ✅

### Use Case 4: Advance Payment
**Scenario**: Parent traveling, wants to pay next 2 months in advance

**Steps:**
1. Generate invoices for next 2 months first
2. Click "Pay Multiple Months"
3. Select current + next 2 months
4. Enter total
5. Submit
6. Paid in advance! ✅

---

## ⚠️ Important Notes

### Payment Order
- **Always oldest first**: System pays oldest invoices first
- **Cannot skip**: Can't pay April without paying February
- **Automatic**: System handles the order for you

### Amount Limits
- **Minimum**: $0.01
- **Maximum**: Total of selected invoices
- **Cannot overpay**: System prevents paying more than owed

### Partial Payments
- If amount < total: Pays invoices in order until money runs out
- Last invoice may be partially paid
- Remaining invoices stay unpaid

### Invoice Selection
- Must select at least 1 invoice
- Can select all or some
- Selection updates total automatically

---

## 🔧 Troubleshooting

### Problem: "Pay Multiple Months" button not showing
**Solution**: 
- Refresh page (Ctrl + F5)
- Check invoice status (button only shows for unpaid invoices)

### Problem: No invoices showing in modal
**Solution**:
- Check if invoices were generated for this student
- Verify student has unpaid invoices
- Try refreshing the page

### Problem: Cannot pay more than selected total
**Solution**:
- This is intentional to prevent overpayment
- Either reduce payment amount
- Or select more invoices

### Problem: Payment not applied correctly
**Solution**:
- Check payment was recorded (look for success message)
- Refresh page to see updated statuses
- Verify amounts in invoice table

---

## 📱 Mobile Support

The feature works on mobile devices:
- Buttons stack vertically
- Modal scrolls on small screens
- Touch-friendly checkboxes
- Responsive layout

---

## 🎯 Benefits

### For Parents
- ✅ Pay multiple months at once
- ✅ Save time (one transaction instead of many)
- ✅ Clear view of all outstanding amounts
- ✅ Flexible (choose which months to pay)

### For School
- ✅ Better cash flow (advance payments)
- ✅ Fewer transactions to process
- ✅ Easier reconciliation
- ✅ Automatic payment allocation

### For Students
- ✅ Catch up on arrears easily
- ✅ Pay ahead for peace of mind
- ✅ Clear payment history
- ✅ No confusion about what's owed

---

## 📝 Quick Reference

| Action | Button | Result |
|--------|--------|--------|
| Pay one month | 💳 Pay This Month | Pays current invoice only |
| Pay multiple months | 📅 Pay Multiple Months | Opens selection modal |
| Select all | (Default) | All invoices checked |
| Select some | Uncheck boxes | Only checked invoices paid |
| View total | Selection Summary | Shows total of selected |
| Submit payment | ✓ Record Payment | Processes payment |

---

## 🚀 Examples in Action

### Example: Parent Pays 3 Months

**Before:**
```
February: $1300 PENDING
March: $1300 PENDING  
April: $1300 PENDING
Total Owed: $3900
```

**Action:**
1. Click "📅 Pay Multiple Months"
2. All 3 months selected
3. Enter $3900
4. Submit

**After:**
```
February: $1300 PAID ✅
March: $1300 PAID ✅
April: $1300 PAID ✅
Total Owed: $0
```

### Example: Partial Payment

**Before:**
```
February: $1300 OVERDUE
March: $1300 OVERDUE
April: $1300 PENDING
Total Owed: $3900
```

**Action:**
1. Click "📅 Pay Multiple Months"
2. All 3 months selected
3. Enter $2000 (partial)
4. Submit

**After:**
```
February: $1300 PAID ✅
March: $700 PARTIALLY PAID (balance: $600)
April: $1300 PENDING
Total Owed: $1900
```

---

**Status**: ✅ Ready to use
**Date**: February 1, 2026
**Next Step**: Try it out in Monthly Payments page!

**Need Help?** Check the Monthly Payments page or contact support.
