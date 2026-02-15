# How to Use Monthly Payment Tracking - Step by Step

## 🎯 What This System Does

This system helps you track monthly student payments. You can:
- See which students paid their monthly fees
- See which students haven't paid yet
- Record payments when students pay
- Generate reports

## 📋 Before You Start

### One-Time Setup (Do This Once)

1. **Run the setup script:**
   ```bash
   cd backend
   node scripts/setup-monthly-payments.js
   ```

2. **This creates:**
   - Class A monthly fee: $1300
   - Class B monthly fee: $1300
   - Class C monthly fee: $1500

## 🔄 Monthly Workflow

### Step 1: Start of Each Month - Generate Invoices

At the beginning of each month (e.g., February 1st), generate invoices for all students:

```
For each class:
1. Get list of all students in that class
2. Call API to generate invoices
3. Each student gets an invoice for their monthly fee
```

**Example API Call:**
```javascript
POST /api/finance/invoices/generate
{
  "studentIds": ["student1", "student2", "student3"],
  "feeStructureId": "class-a-fee-structure-id",
  "academicYearId": "2026-2027",
  "dueDate": "2026-02-28",
  "campusId": "main-campus"
}
```

### Step 2: View Payment Dashboard

1. Open your application
2. Go to Finance → Monthly Payments
3. Select the month (e.g., February)
4. Select the year (e.g., 2026)

**You will see:**
```
┌─────────────────────────────────────────┐
│     Monthly Payment Dashboard           │
│     February 2026                       │
├─────────────────────────────────────────┤
│                                         │
│  Total Students: 150                    │
│  Paid: 120        Unpaid: 25           │
│  Partial: 5                             │
│                                         │
│  Total Collected: $195,000              │
│  Total Pending: $37,500                 │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  CLASS A                                │
│  Monthly Fee: $1300                     │
│  Students: 50                           │
│  Paid: 40  Unpaid: 8  Partial: 2       │
│  Collected: $52,000                     │
│  [Click to view details]                │
│                                         │
│  CLASS B                                │
│  Monthly Fee: $1300                     │
│  Students: 50                           │
│  Paid: 42  Unpaid: 7  Partial: 1       │
│  Collected: $54,600                     │
│  [Click to view details]                │
│                                         │
│  CLASS C                                │
│  Monthly Fee: $1500                     │
│  Students: 50                           │
│  Paid: 38  Unpaid: 10  Partial: 2      │
│  Collected: $57,000                     │
│  [Click to view details]                │
│                                         │
└─────────────────────────────────────────┘
```

### Step 3: View Class Details

Click on any class (e.g., Class A) to see individual students:

```
┌─────────────────────────────────────────────────────────────────┐
│  Class A - February 2026                                        │
│  [← Back to Overview]                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Total: 50    Paid: 40    Unpaid: 8    Partial: 2             │
│                                                                 │
├──────────┬──────────┬────────┬──────┬─────────┬────────┬───────┤
│ Student  │ Invoice  │ Amount │ Paid │ Balance │ Status │ Action│
├──────────┼──────────┼────────┼──────┼─────────┼────────┼───────┤
│ STU001   │ INV-001  │ $1300  │$1300 │   $0    │ ✓ PAID │       │
│ STU002   │ INV-002  │ $1300  │ $650 │  $650   │ PARTIAL│ [Pay] │
│ STU003   │ INV-003  │ $1300  │  $0  │ $1300   │ UNPAID │ [Pay] │
│ STU004   │ INV-004  │ $1300  │$1300 │   $0    │ ✓ PAID │       │
│ ...      │ ...      │ ...    │ ...  │  ...    │ ...    │ ...   │
└──────────┴──────────┴────────┴──────┴─────────┴────────┴───────┘
```

### Step 4: Record a Payment

When a student comes to pay:

1. **Find the student** in the class details table
2. **Click "Record Payment"** button
3. **Fill in the payment form:**

```
┌─────────────────────────────────────┐
│  Record Payment                     │
├─────────────────────────────────────┤
│  Student ID: STU003                 │
│  Invoice: INV-003                   │
│  Balance Due: $1300                 │
│                                     │
│  Amount: [1300.00]                  │
│                                     │
│  Payment Method:                    │
│  ○ Cash                             │
│  ○ Bank Transfer                    │
│  ○ Mobile Money                     │
│  ○ Online Payment                   │
│                                     │
│  Payment Date: [2026-02-05]         │
│                                     │
│  Reference Number (Optional):       │
│  [TXN123456]                        │
│                                     │
│  [Record Payment]  [Cancel]         │
└─────────────────────────────────────┘
```

4. **Click "Record Payment"**
5. **System will:**
   - Create payment record
   - Generate receipt number
   - Update invoice status to PAID
   - Refresh the dashboard

### Step 5: View Reports

#### Unpaid Students Report

To see who hasn't paid:

```
GET /api/finance/monthly-payments/unpaid-report?month=2&year=2026
```

**Shows:**
- All students who haven't paid
- Students with partial payments
- Overdue students (past due date)
- Total amount pending

#### Paid Students Report

To see who has paid:

```
GET /api/finance/monthly-payments/paid-report?month=2&year=2026
```

**Shows:**
- All students who paid in full
- Payment dates
- Payment methods
- Receipt numbers

## 💰 Payment Scenarios

### Scenario 1: Full Payment

Student pays the full amount:

```
Student: John (Class A)
Monthly Fee: $1300
Payment: $1300 (Cash)
Result: Invoice status → PAID ✓
```

### Scenario 2: Partial Payment

Student pays part of the amount:

```
Student: Mary (Class B)
Monthly Fee: $1300
Payment: $650 (Bank Transfer)
Result: Invoice status → PARTIALLY_PAID
Balance Remaining: $650
```

Later, Mary pays the rest:

```
Student: Mary (Class B)
Balance: $650
Payment: $650 (Cash)
Result: Invoice status → PAID ✓
```

### Scenario 3: Late Payment

Student pays after due date:

```
Student: Peter (Class C)
Monthly Fee: $1500
Due Date: February 28
Payment Date: March 5 (7 days late)
Result: Invoice status → PAID ✓
Note: System tracks it was overdue
```

## 📊 Understanding Status Colors

The system uses colors to show payment status:

- **🟢 Green (PAID)** - Student paid in full
- **🟡 Yellow (PARTIAL)** - Student paid some, balance remaining
- **🔵 Blue (ISSUED)** - Invoice sent, no payment yet
- **🔴 Red (OVERDUE)** - Past due date, not paid

## 🔍 Common Questions

### Q: How do I change the monthly fee for a class?

A: Update the fee structure:
```javascript
PUT /api/finance/fee-structures/:id
{
  "items": [{
    "amount": 1400  // New amount
  }]
}
```

### Q: Can students pay in installments?

A: Yes! Record multiple partial payments:
1. First payment: $650
2. Second payment: $650
3. System automatically updates status

### Q: What if a student overpays?

A: The system will show an error if payment exceeds balance. You can:
- Record exact balance amount
- Create a credit for next month (future feature)

### Q: How do I print a receipt?

A: After recording payment, the system generates a receipt number. You can:
- Use this number to print from your receipt printer
- Export payment details to PDF (future feature)

### Q: Can I import payments from Excel?

A: Not yet, but it's a planned feature. Currently, record payments one by one or use the API for bulk import.

## 📅 Monthly Checklist

Use this checklist every month:

```
□ Day 1: Generate invoices for all students
□ Day 1-5: Send payment reminders to students
□ Daily: Record payments as students pay
□ Weekly: Check unpaid report and follow up
□ Day 25: Send reminders to unpaid students
□ End of month: Generate collection report
□ End of month: Reconcile with bank statements
```

## 🎓 Training Tips

When training staff:

1. **Start with overview** - Show the dashboard
2. **Demonstrate class view** - Click on a class
3. **Practice recording payment** - Use test data
4. **Show reports** - Explain paid/unpaid reports
5. **Handle scenarios** - Practice partial payments
6. **Answer questions** - Address specific concerns

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| No classes showing | Generate invoices for the month first |
| Can't record payment | Check user has `payments:create` permission |
| Wrong fee amount | Verify fee structure for that class |
| Student in wrong class | Update student class assignment |
| Payment exceeds balance | Check invoice balance before recording |

## 📞 Need Help?

1. Check the detailed guide: `MONTHLY_PAYMENT_TRACKING_GUIDE.md`
2. Check the quick start: `MONTHLY_PAYMENT_QUICK_START.md`
3. Contact system administrator
4. Submit support ticket

---

**Remember:**
- Generate invoices at start of month
- Record payments immediately
- Check unpaid report weekly
- Follow up with unpaid students
- Keep the system updated

**That's it! You're ready to track monthly payments! 🎉**
