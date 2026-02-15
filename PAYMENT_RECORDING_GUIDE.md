# How to Record Student Payments - Step by Step Guide

## Overview
When a student pays their monthly fee, you need to record it in the system. This guide shows you exactly how to do it.

## Step-by-Step Instructions

### Step 1: Open Monthly Payments Page
1. Click **Finance** in the left menu
2. Click **Monthly Payments**
3. Select the month (e.g., February)
4. Select the year (e.g., 2026)

You'll see a table with all invoices for that month.

### Step 2: Find the Student
You have 3 ways to find a student:

**Option A: Scroll through the table**
- Look through the list visually

**Option B: Use search**
- Type student name in search box (e.g., "Ahmed")
- Or type student ID (e.g., "2-2")
- Or type invoice number (e.g., "INV-2026-000001")

**Option C: Filter by status**
- Click "Pending" to see only unpaid invoices
- Click "Partial" to see partially paid invoices

### Step 3: Click "Record Payment" Button
1. Find the student's row in the table
2. Look at the last column (Action)
3. Click the **💳 Record Payment** button

A modal (popup window) will appear.

### Step 4: Fill in Payment Details

The modal shows:
- Invoice number
- Student name
- Total amount
- Already paid amount
- Balance due

Now fill in the form:

#### 4.1 Payment Amount
- **Pre-filled** with the balance due
- **Full Payment**: Leave as is (e.g., $1300)
- **Partial Payment**: Change to amount received (e.g., $500)

#### 4.2 Payment Method
Select how the student paid:
- **Cash**: Student paid in cash
- **Bank Transfer**: Student transferred money to school account
- **Mobile Money**: Student used mobile money (M-Pesa, etc.)
- **Cheque**: Student gave a cheque
- **Card**: Student paid by debit/credit card
- **Online**: Student paid through online portal

#### 4.3 Payment Date
- **Default**: Today's date
- **Change**: If payment was made on a different day

#### 4.4 Reference Number (Optional)
Enter any reference:
- Bank transaction ID
- Mobile money reference
- Cheque number
- Receipt number from another system

#### 4.5 Notes (Optional)
Add any additional information:
- "Paid by father"
- "Partial payment, will pay rest next week"
- "Late payment, waived late fee"

### Step 5: Submit Payment
1. Review all information
2. Click **✓ Record Payment** button
3. Wait for success message

**Success Message:**
```
Payment recorded successfully!
```

### Step 6: Verify Payment Recorded
After submitting, the page refreshes automatically.

Check the student's row:
- **Paid column**: Should show new amount
- **Balance column**: Should show remaining balance
- **Status badge**: Should update
  - 🟢 **PAID**: If fully paid
  - 🟡 **PARTIALLY PAID**: If partial payment
- **Action column**: 
  - Shows "✓ Paid" if fully paid
  - Still shows "Record Payment" if balance remains

## Examples

### Example 1: Full Payment
**Scenario**: Ahmed's parents pay full monthly fee

1. Find Ahmed in the table
   - Invoice: INV-2026-000015
   - Amount: $1300
   - Paid: $0
   - Balance: $1300
   - Status: PENDING

2. Click "Record Payment"

3. Fill form:
   - Amount: $1300 (leave as is)
   - Method: Cash
   - Date: Today
   - Reference: (leave empty)
   - Notes: "Paid by father"

4. Click "Record Payment"

5. Result:
   - Paid: $1300
   - Balance: $0
   - Status: PAID ✅
   - Action: "✓ Paid"

### Example 2: Partial Payment
**Scenario**: Fatima's parents pay half now, half later

1. Find Fatima in the table
   - Invoice: INV-2026-000023
   - Amount: $1300
   - Paid: $0
   - Balance: $1300
   - Status: PENDING

2. Click "Record Payment"

3. Fill form:
   - Amount: $650 (change from $1300)
   - Method: Bank Transfer
   - Date: Today
   - Reference: TXN-123456789
   - Notes: "First installment, will pay rest on 15th"

4. Click "Record Payment"

5. Result:
   - Paid: $650
   - Balance: $650
   - Status: PARTIALLY PAID 🟡
   - Action: "Record Payment" (still available)

6. When they pay the rest:
   - Click "Record Payment" again
   - Amount: $650 (auto-filled with remaining balance)
   - Method: Bank Transfer
   - Date: February 15
   - Reference: TXN-987654321
   - Notes: "Second installment, full payment complete"

7. Final Result:
   - Paid: $1300
   - Balance: $0
   - Status: PAID ✅
   - Action: "✓ Paid"

### Example 3: Mobile Money Payment
**Scenario**: Student pays via mobile money

1. Find student in table

2. Click "Record Payment"

3. Fill form:
   - Amount: $1300
   - Method: Mobile Money
   - Date: Today
   - Reference: MP123456789 (M-Pesa reference)
   - Notes: "Paid via M-Pesa"

4. Click "Record Payment"

5. Done! ✅

### Example 4: Late Payment
**Scenario**: Student pays after due date

1. Find student in table
   - Notice: Row is highlighted in red
   - Status shows: OVERDUE 🔴

2. Click "Record Payment"

3. Fill form:
   - Amount: $1300
   - Method: Cash
   - Date: Today (actual payment date)
   - Reference: (empty)
   - Notes: "Late payment, no penalty applied"

4. Click "Record Payment"

5. Result:
   - Status changes from OVERDUE to PAID
   - Red highlighting removed
   - Payment recorded with actual date

## Receipt Numbers

Every payment gets a unique receipt number:
- **Format**: RCP-2026-000001
- **RCP**: Receipt prefix
- **2026**: Year
- **000001**: Sequential number

The system generates this automatically. You can:
- Print this receipt for the student
- Use it for accounting records
- Reference it in disputes

## Common Questions

### Q: Can I record multiple payments for one invoice?
**A**: Yes! Record partial payments one at a time. Each gets its own receipt number.

### Q: What if I enter the wrong amount?
**A**: Currently, you need to contact admin to reverse the payment. Be careful when entering amounts!

### Q: Can I record a payment for a past date?
**A**: Yes! Change the payment date to when they actually paid.

### Q: What if the student pays more than the balance?
**A**: The system won't allow it. Maximum payment is the remaining balance.

### Q: Do I need to enter a reference number?
**A**: No, it's optional. But it's helpful for tracking, especially for bank transfers.

### Q: Can I see all payments a student has made?
**A**: Currently, you can see the total paid amount. Payment history feature coming soon!

### Q: What happens if I close the modal without submitting?
**A**: Nothing is saved. The payment is not recorded.

### Q: Can I edit a payment after recording it?
**A**: Not yet. Contact admin if you need to modify a payment.

## Tips for Efficient Payment Recording

### 1. Use Search
Don't scroll through hundreds of students. Type their name or ID in the search box.

### 2. Filter by Status
Click "Pending" to see only unpaid invoices. Faster than looking through all invoices.

### 3. Always Enter Reference
Even if optional, it helps with:
- Tracking payments
- Resolving disputes
- Accounting reconciliation

### 4. Add Notes
Brief notes help later:
- "Paid by guardian"
- "Partial payment agreed"
- "Late fee waived"

### 5. Verify Before Submitting
Double-check:
- ✅ Correct amount
- ✅ Correct payment method
- ✅ Correct date
- ✅ Reference number (if applicable)

### 6. Check After Recording
Always verify the payment was recorded:
- Look at the Paid column
- Check the Balance column
- Verify the Status badge

## Troubleshooting

### Problem: "Record Payment" button doesn't work
**Solution**: 
- Refresh the page (Ctrl + F5)
- Check if you're logged in
- Verify you have payment recording permissions

### Problem: Modal doesn't appear
**Solution**:
- Check browser console (F12)
- Disable browser extensions
- Try a different browser

### Problem: "Payment failed" error
**Solution**:
- Check the amount is valid
- Verify the amount doesn't exceed balance
- Check server is running
- Contact admin

### Problem: Payment recorded but status didn't update
**Solution**:
- Refresh the page
- Check if payment was actually recorded
- Contact admin if issue persists

### Problem: Can't find the student
**Solution**:
- Check spelling in search
- Try searching by ID instead of name
- Verify invoice was generated for that student
- Check you're viewing the correct month

## Security Notes

- Only authorized users can record payments
- All payments are logged with:
  - Who recorded it
  - When it was recorded
  - All payment details
- Payments cannot be deleted (only reversed by admin)
- Receipt numbers are unique and sequential

## What Happens Behind the Scenes

When you record a payment:

1. **System validates**:
   - Amount is positive
   - Amount doesn't exceed balance
   - All required fields filled

2. **System creates**:
   - Payment record
   - Receipt number
   - Payment allocation (links payment to invoice)

3. **System updates**:
   - Invoice paid amount
   - Invoice status
   - Student payment history

4. **System logs**:
   - Who recorded the payment
   - When it was recorded
   - All payment details

5. **System refreshes**:
   - Page reloads
   - Shows updated information

## Best Practices

### Daily Workflow
1. Open Monthly Payments page
2. Filter by "Pending"
3. Record payments as students pay
4. Verify each payment after recording
5. Keep reference numbers organized

### End of Day
1. Check "Pending" count
2. Verify all payments recorded
3. Note any partial payments
4. Follow up on overdue payments

### End of Month
1. Review all invoices
2. Check collection rate
3. Follow up on unpaid invoices
4. Generate payment reports

---

**Remember**: Always double-check before clicking "Record Payment"!

**Need Help?** Contact your system administrator or check the server logs for errors.

---

**Last Updated**: February 1, 2026
**Version**: 1.0
**Status**: ✅ Ready to use
