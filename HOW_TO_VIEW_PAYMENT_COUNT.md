# How to View Payment Count and History

## Quick Guide

### Step 1: Go to Monthly Payments
```
Finance Management → Monthly Payments
```

### Step 2: Select a Class
Click on any class card to see student details

### Step 3: Look at the "Payments" Column
You'll see a new column showing payment counts:

```
┌────────────────────────────────────────────────────────┐
│ Student Payment Status                                 │
├──────┬─────────┬────────┬──────┬─────────┬────────────┤
│ ID   │ Invoice │ Amount │ Paid │ Balance │ Payments   │
├──────┼─────────┼────────┼──────┼─────────┼────────────┤
│ S001 │ INV-001 │ $1300  │$1300 │   $0    │ 1 payment📋│
│ S002 │ INV-002 │ $1300  │$1300 │   $0    │ 2 payments📋│
│ S003 │ INV-003 │ $1300  │ $650 │  $650   │ 1 payment📋│
│ S004 │ INV-004 │ $1300  │  $0  │ $1300   │ 0 payments │
└──────┴─────────┴────────┴──────┴─────────┴────────────┘
                                              ↑
                                    Click this button!
```

### Step 4: Click the 📋 Button
Click the clipboard icon to view payment history

### Step 5: View Payment Details

A modal will open showing:

```
┌──────────────────────────────────────────────────┐
│ Payment History                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ Student ID: S002                                 │
│ Invoice: INV-002                                 │
│ Total Amount: $1300.00                           │
│ Total Paid: $1300.00                             │
│ Balance: $0.00                                   │
│ Number of Payments: 2                            │
│                                                  │
├──────────────────────────────────────────────────┤
│ Payment Transactions                             │
├──────────────────────────────────────────────────┤
│                                                  │
│ #  Receipt    Date        Amount    Method      │
│ ─  ────────   ──────────  ────────  ──────────  │
│ 1  RCP-001    2026-02-05  $650.00   Cash        │
│ 2  RCP-002    2026-02-15  $650.00   Bank        │
│                                                  │
├──────────────────────────────────────────────────┤
│                          [Close]                 │
└──────────────────────────────────────────────────┘
```

## What You Can See

### Payment Count Badge
- **Blue badge** with number
- Shows total payments made
- Example: "2 payments"

### Payment History Details
- **Receipt number** for each payment
- **Date** when payment was made
- **Amount** paid in each transaction
- **Payment method** (Cash, Bank, Mobile Money, Online)

## Understanding Payment Counts

### 0 Payments
```
0 payments
```
- Student hasn't paid yet
- No history button shown
- Status: UNPAID or ISSUED

### 1 Payment
```
1 payment 📋
```
- Student paid once (full or partial)
- Click 📋 to see details
- Could be full payment or first installment

### Multiple Payments
```
3 payments 📋
```
- Student paid in installments
- Click 📋 to see all transactions
- Useful for tracking partial payments

## Use Cases

### Case 1: Verify Full Payment
```
Student: John
Amount: $1300
Paid: $1300
Payments: 1 payment 📋

Click 📋 to see:
- Receipt: RCP-001
- Date: Feb 5, 2026
- Amount: $1300
- Method: Cash
```

### Case 2: Track Installments
```
Student: Mary
Amount: $1300
Paid: $1300
Payments: 2 payments 📋

Click 📋 to see:
- Payment 1: $650 on Feb 5 (Cash)
- Payment 2: $650 on Feb 15 (Bank Transfer)
```

### Case 3: Partial Payment
```
Student: Peter
Amount: $1300
Paid: $650
Payments: 1 payment 📋

Click 📋 to see:
- Payment 1: $650 on Feb 10 (Mobile Money)
- Balance remaining: $650
```

## Tips

### 💡 Quick Check
Look at the payment count to quickly see:
- Who paid in full (1 payment, balance $0)
- Who paid in installments (multiple payments)
- Who hasn't paid (0 payments)

### 💡 Verify Receipts
Use payment history to:
- Find receipt numbers
- Verify payment dates
- Check payment methods
- Resolve disputes

### 💡 Track Patterns
Monitor payment behavior:
- Students who prefer installments
- Common payment methods
- Payment timing patterns

## Color Guide

### Payment Count Badge
- **Blue background** (#e3f2fd)
- **Blue text** (#1976d2)
- Rounded corners

### Payment Method Badge
- **Green background** (#d4edda)
- **Green text** (#155724)
- Shows in history modal

## Mobile View

On mobile devices:
- Table scrolls horizontally
- Payment count still visible
- History modal is responsive
- Touch-friendly buttons

## Keyboard Shortcuts

- **Click 📋**: Open payment history
- **Esc**: Close modal (if implemented)
- **Tab**: Navigate between elements

## Common Questions

### Q: Why does it show "0 payments" but status is "PAID"?
A: This shouldn't happen. If it does, there might be a data sync issue. Refresh the page.

### Q: Can I edit payment history?
A: No, payment history is read-only for audit purposes. Contact admin to correct errors.

### Q: Can I print payment history?
A: Not yet, but this feature is planned. For now, you can take a screenshot.

### Q: What if payment count doesn't match?
A: Refresh the page. If issue persists, check with system administrator.

## Troubleshooting

### Payment count not showing
1. Refresh the page (Ctrl + F5)
2. Check if payments were recorded
3. Verify invoice exists

### History button (📋) not clickable
1. Make sure payment count > 0
2. Check browser console for errors
3. Try different browser

### Modal not opening
1. Check for JavaScript errors (F12)
2. Refresh the page
3. Clear browser cache

## Summary

✅ **Payment count** shows in table
✅ **History button** (📋) for details
✅ **Complete transaction history**
✅ **Receipt numbers** tracked
✅ **Easy to verify** payments

---

**Quick Steps**:
1. Go to Monthly Payments
2. Select a class
3. Look at "Payments" column
4. Click 📋 to view history

**That's it!** 🎉
