# How to Generate Invoices and See Student Payments

## Why Monthly Payments Page is Empty

The Monthly Payments page shows **invoices** - actual bills sent to students. Right now it's empty because you've only created **fee structures** (templates), but haven't generated the actual invoices yet.

Think of it like this:
- **Fee Structure** = Template (e.g., "Class A pays $1300/month")
- **Invoice** = Actual bill sent to a student (e.g., "John Doe owes $1300 for February 2026")

## How to Generate Invoices

### Step 1: Go to Monthly Payment Settings

1. Navigate to **Finance → Monthly Payment Settings**
2. You'll see your fee structures (Class A, Class B, etc.)

### Step 2: Generate Invoices for a Class

1. Find the fee structure card (e.g., "Class A")
2. Make sure it's **Active** (toggle should be ON/green)
3. Click the **"📄 Generate Invoices"** button at the bottom of the card

### Step 3: Confirm Generation

A confirmation dialog will appear:
```
Generate invoices for Class A?

This will create invoices for all students 
in this class for the current month.

[Cancel] [OK]
```

Click **OK** to proceed.

### Step 4: Wait for Completion

The system will:
1. ✅ Fetch all students in the class
2. ✅ Create an invoice for each student
3. ✅ Set due date (5th of next month)
4. ✅ Show success message

You'll see:
```
Invoices generated!

Success: 25
Failed: 0

You can now view payments in the Monthly Payments page.
```

### Step 5: View in Monthly Payments

1. Go to **Finance → Monthly Payments**
2. You'll now see:
   - Class overview with student counts
   - Payment status (paid/unpaid/partial)
   - Total collected and pending amounts

## What Happens When You Generate Invoices

### For Each Student in the Class

```
Student: John Doe (Class A)
├─ Invoice Created
│  ├─ Invoice Number: INV-2026-001
│  ├─ Amount: $1300
│  ├─ Issue Date: Feb 1, 2026
│  ├─ Due Date: Mar 5, 2026
│  ├─ Status: ISSUED (unpaid)
│  └─ Items:
│     └─ TUITION: $1300
└─ Appears in Monthly Payments page
```

## Example Workflow

### 1. Create Fee Structures (Done ✅)
```
Class A: $1300/month ✅
Class B: $1300/month ✅
Class C: $1500/month ✅
```

### 2. Generate Invoices (Do This Now)
```
Class A: Click "Generate Invoices" → 25 invoices created
Class B: Click "Generate Invoices" → 30 invoices created
Class C: Click "Generate Invoices" → 20 invoices created
```

### 3. View in Monthly Payments
```
┌─────────────────────────────────────┐
│ February 2026 Overview              │
├─────────────────────────────────────┤
│ Total Students: 75                  │
│ Paid: 0                             │
│ Unpaid: 75                          │
│ Total Pending: $97,500              │
└─────────────────────────────────────┘

Class A: 25 students, $0 collected, $32,500 pending
Class B: 30 students, $0 collected, $39,000 pending
Class C: 20 students, $0 collected, $30,000 pending
```

### 4. Record Payments
When students pay:
1. Click on a class
2. Find the student
3. Click "Record Payment"
4. Enter amount and payment method
5. Save

## Important Notes

### When to Generate Invoices

- **Monthly**: Generate at the start of each month
- **Per Class**: Generate separately for each class
- **Active Only**: Only active fee structures can generate invoices

### What If I Generate Twice?

The system will create duplicate invoices. To avoid this:
- Only generate once per month per class
- Check Monthly Payments page first to see if invoices exist

### Invoice Details

- **Issue Date**: Today's date
- **Due Date**: 5th of next month
- **Status**: Starts as "ISSUED" (unpaid)
- **Amount**: From fee structure

## Troubleshooting

### "No students found in this class"

**Problem**: The class has no students in the database

**Solution**:
1. Go to student registration
2. Add students to the class
3. Try generating invoices again

### Button is Disabled

**Problem**: Fee structure is inactive

**Solution**:
1. Toggle the switch to ON (green)
2. Button will become enabled
3. Click "Generate Invoices"

### Invoices Not Showing in Monthly Payments

**Problem**: Wrong month/year selected

**Solution**:
1. Check the month/year selector at the top
2. Select current month
3. Invoices should appear

## Quick Steps Summary

1. ✅ **Create fee structures** (Done - you already did this!)
2. 📄 **Generate invoices** (Do this now - click the button on each class)
3. 👀 **View in Monthly Payments** (Go to Finance → Monthly Payments)
4. 💰 **Record payments** (When students pay, mark them as paid)

---

**Next Step:** Click the "📄 Generate Invoices" button on your fee structure cards!

Once you do that, the Monthly Payments page will show all your students and their payment status.
