# Monthly Payment Tracking - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Run Setup Script
```bash
cd backend
node scripts/setup-monthly-payments.js
```

This creates:
- Income account for tuition fees
- Fee structures for Class A ($1300), Class B ($1300), Class C ($1500)

### Step 2: Generate Monthly Invoices

Use the API or create a script to generate invoices for your students:

```javascript
// Example API call
POST /api/finance/invoices/generate
{
  "studentIds": ["student-1-id", "student-2-id", "student-3-id"],
  "feeStructureId": "class-a-fee-structure-id",
  "academicYearId": "current-academic-year-id",
  "dueDate": "2026-02-28",
  "campusId": "your-campus-id"
}
```

### Step 3: Access the Dashboard

1. Navigate to: `/finance/monthly-payments`
2. Select month and year
3. View payment status for all classes

## 📊 Main Features

### View Overview
- See all classes and their payment status
- Total collected vs pending amounts
- Number of paid/unpaid students

### View Class Details
- Click on any class to see individual students
- View each student's payment status
- See payment history

### Record Payment
1. Click "Record Payment" button next to student
2. Enter amount (full or partial)
3. Select payment method
4. Add reference number (optional)
5. Submit

## 🎯 Common Tasks

### Task 1: Check Who Hasn't Paid This Month
```
GET /api/finance/monthly-payments/unpaid-report?month=2&year=2026
```

### Task 2: Record a Cash Payment
```
POST /api/finance/monthly-payments/record-payment
{
  "invoiceId": "invoice-uuid",
  "amount": 1300,
  "paymentMethod": "CASH",
  "paymentDate": "2026-02-05",
  "campusId": "campus-uuid"
}
```

### Task 3: View Paid Students Report
```
GET /api/finance/monthly-payments/paid-report?month=2&year=2026
```

## 💡 Tips

1. **Generate invoices at the start of each month** - Don't wait until students come to pay
2. **Record payments immediately** - Keep the system up to date
3. **Check unpaid report weekly** - Follow up with students who haven't paid
4. **Use reference numbers** - Always record bank transfer references
5. **Accept partial payments** - Help students who can't pay the full amount at once

## 🔧 Configuration

### Set Different Monthly Fees by Class

Edit fee structures:
```javascript
POST /api/finance/fee-structures
{
  "name": "Class D Monthly Fee 2026",
  "academicYearId": "AY-2026-2027",
  "gradeLevel": "Class D",
  "items": [{
    "feeCategory": "TUITION",
    "amount": 2000,  // Different amount
    "accountId": "income-account-id",
    "paymentType": "RECURRING",
    "description": "Monthly tuition fee"
  }]
}
```

### Set Due Dates

When generating invoices, specify the due date:
```javascript
{
  "dueDate": "2026-02-28"  // End of month
}
```

## 📱 Frontend Integration

Add to your navigation:
```jsx
import MonthlyPayments from './PAGE/Finance/MonthlyPayments';

// In your routes
<Route path="/finance/monthly-payments" element={<MonthlyPayments />} />
```

## 🔐 Required Permissions

Users need these permissions:
- `invoices:view` - View payment information
- `payments:create` - Record payments
- `reports:view` - Access reports

## 📈 Reports Available

1. **Monthly Overview** - All classes summary
2. **Class Details** - Individual class breakdown
3. **Unpaid Report** - Students who haven't paid
4. **Paid Report** - Students who have paid
5. **Overdue Report** - Past due date payments

## 🆘 Troubleshooting

### Problem: No classes showing in overview
**Solution**: Generate invoices for the selected month first

### Problem: Can't record payment
**Solution**: Check that:
- Invoice exists and is not cancelled
- Amount doesn't exceed balance
- User has `payments:create` permission

### Problem: Wrong fee amount
**Solution**: Check fee structure for that class

## 📞 Support

For detailed documentation, see: `MONTHLY_PAYMENT_TRACKING_GUIDE.md`

---

**Quick Reference Card**

| Action | Endpoint |
|--------|----------|
| View Overview | `GET /api/finance/monthly-payments/overview` |
| View Class | `GET /api/finance/monthly-payments/class/:className` |
| Record Payment | `POST /api/finance/monthly-payments/record-payment` |
| Unpaid Report | `GET /api/finance/monthly-payments/unpaid-report` |
| Paid Report | `GET /api/finance/monthly-payments/paid-report` |

**Payment Status**
- 🟢 PAID - Fully paid
- 🟡 PARTIALLY_PAID - Partial payment received
- 🔵 ISSUED - Invoice sent, no payment yet
- 🔴 OVERDUE - Past due date

---

Last Updated: February 2026
