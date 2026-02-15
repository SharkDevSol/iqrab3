# Monthly Payment Tracking System - Complete Guide

## Overview

The Monthly Payment Tracking System allows you to:
- Track monthly student payments by class
- See who has paid and who hasn't
- Record payments and generate receipts
- View detailed payment reports
- Monitor payment collection progress

## Features

### 1. Monthly Overview Dashboard
- View all classes and their payment status for a selected month
- See total students, paid, unpaid, and partially paid counts
- Track total collected and pending amounts
- Filter by month and year

### 2. Class-Specific View
- Click on any class to see detailed student payment status
- View individual student invoices and balances
- See payment history for each student
- Record new payments directly from the interface

### 3. Payment Recording
- Record cash, bank transfer, mobile money, or online payments
- Automatic receipt generation
- Update invoice status automatically
- Support for partial payments

### 4. Reports
- Paid students report
- Unpaid students report
- Overdue payments tracking
- Payment collection summary

## Setup Instructions

### Step 1: Configure Monthly Fee Structures

First, you need to set up fee structures for each class:

```javascript
// Example: Create fee structure for Class A (1300 monthly)
POST /api/finance/fee-structures
{
  "name": "Class A Monthly Fee 2026",
  "academicYearId": "your-academic-year-id",
  "gradeLevel": "Class A",
  "items": [
    {
      "feeCategory": "TUITION",
      "amount": 1300,
      "accountId": "your-income-account-id",
      "paymentType": "RECURRING",
      "description": "Monthly tuition fee"
    }
  ]
}

// Example: Create fee structure for Class B (1300 monthly)
POST /api/finance/fee-structures
{
  "name": "Class B Monthly Fee 2026",
  "academicYearId": "your-academic-year-id",
  "gradeLevel": "Class B",
  "items": [
    {
      "feeCategory": "TUITION",
      "amount": 1300,
      "accountId": "your-income-account-id",
      "paymentType": "RECURRING",
      "description": "Monthly tuition fee"
    }
  ]
}

// Example: Create fee structure for Class C (1500 monthly)
POST /api/finance/fee-structures
{
  "name": "Class C Monthly Fee 2026",
  "academicYearId": "your-academic-year-id",
  "gradeLevel": "Class C",
  "items": [
    {
      "feeCategory": "TUITION",
      "amount": 1500,
      "accountId": "your-income-account-id",
      "paymentType": "RECURRING",
      "description": "Monthly tuition fee"
    }
  ]
}
```

### Step 2: Generate Monthly Invoices

At the beginning of each month, generate invoices for all students:

```javascript
// Generate invoices for all students in Class A
POST /api/finance/invoices/generate
{
  "studentIds": ["student-1-id", "student-2-id", "student-3-id"],
  "feeStructureId": "class-a-fee-structure-id",
  "academicYearId": "your-academic-year-id",
  "dueDate": "2026-02-28",
  "campusId": "your-campus-id"
}

// Repeat for Class B and Class C
```

### Step 3: Access the Monthly Payment Dashboard

1. Navigate to the Finance module
2. Click on "Monthly Payments"
3. Select the month and year you want to view
4. The dashboard will show:
   - Total students across all classes
   - Number of paid, unpaid, and partially paid students
   - Total amount collected and pending
   - Individual class summaries

### Step 4: View Class Details

1. Click on any class card to see detailed student information
2. You'll see a table with:
   - Student ID
   - Invoice number
   - Total amount due
   - Amount paid
   - Balance remaining
   - Payment status
   - Due date
   - Action buttons

### Step 5: Record a Payment

1. In the class details view, find the student who is paying
2. Click the "Record Payment" button
3. Fill in the payment form:
   - Amount (defaults to full balance, can be changed for partial payment)
   - Payment method (Cash, Bank Transfer, Mobile Money, Online)
   - Payment date
   - Reference number (optional, for bank transfers)
4. Click "Record Payment"
5. The system will:
   - Create a payment record
   - Generate a receipt number
   - Update the invoice status
   - Refresh the dashboard

## API Endpoints

### 1. Get Monthly Overview
```
GET /api/finance/monthly-payments/overview?month=2&year=2026
```

Response:
```json
{
  "month": 2,
  "year": 2026,
  "summary": {
    "totalClasses": 3,
    "totalStudents": 150,
    "totalPaid": 120,
    "totalUnpaid": 25,
    "totalPartial": 5,
    "totalCollected": 195000,
    "totalPending": 37500
  },
  "classes": [
    {
      "className": "Class A",
      "monthlyFee": 1300,
      "totalStudents": 50,
      "paidStudents": 40,
      "unpaidStudents": 8,
      "partiallyPaidStudents": 2,
      "totalCollected": 52000,
      "totalPending": 10400
    }
  ]
}
```

### 2. Get Class Details
```
GET /api/finance/monthly-payments/class/Class%20A?month=2&year=2026
```

Response:
```json
{
  "className": "Class A",
  "month": 2,
  "year": 2026,
  "summary": {
    "totalStudents": 50,
    "paidCount": 40,
    "unpaidCount": 8,
    "partialCount": 2,
    "totalCollected": 52000,
    "totalPending": 10400
  },
  "students": [
    {
      "studentId": "STU001",
      "invoiceNumber": "INV-2026-02-001",
      "amount": 1300,
      "paidAmount": 1300,
      "balance": 0,
      "status": "PAID",
      "dueDate": "2026-02-28",
      "payments": [
        {
          "receiptNumber": "RCP-001",
          "amount": 1300,
          "paymentDate": "2026-02-05",
          "paymentMethod": "CASH"
        }
      ]
    }
  ]
}
```

### 3. Record Payment
```
POST /api/finance/monthly-payments/record-payment
{
  "invoiceId": "invoice-uuid",
  "amount": 1300,
  "paymentMethod": "CASH",
  "paymentDate": "2026-02-05",
  "referenceNumber": "TXN123456",
  "campusId": "campus-uuid"
}
```

### 4. Get Unpaid Report
```
GET /api/finance/monthly-payments/unpaid-report?month=2&year=2026
```

Response:
```json
{
  "month": 2,
  "year": 2026,
  "summary": {
    "totalUnpaid": 33,
    "totalAmountDue": 42900,
    "overdueCount": 10,
    "partiallyPaidCount": 5
  },
  "students": [
    {
      "studentId": "STU045",
      "invoiceNumber": "INV-2026-02-045",
      "totalAmount": 1300,
      "paidAmount": 0,
      "balance": 1300,
      "status": "OVERDUE",
      "dueDate": "2026-02-28",
      "daysOverdue": 5
    }
  ]
}
```

### 5. Get Paid Report
```
GET /api/finance/monthly-payments/paid-report?month=2&year=2026
```

## Payment Status Definitions

- **PAID**: Full payment received
- **PARTIALLY_PAID**: Some payment received, balance remaining
- **ISSUED**: Invoice issued, no payment yet
- **OVERDUE**: Past due date, no payment
- **CANCELLED**: Invoice cancelled

## Workflow Example

### Scenario: Class A has 50 students, monthly fee is 1300

1. **Start of Month (February 1)**
   - Generate 50 invoices for Class A students
   - Each invoice: 1300, due date: February 28

2. **During the Month**
   - Student 1 pays 1300 on Feb 5 → Status: PAID
   - Student 2 pays 650 on Feb 10 → Status: PARTIALLY_PAID
   - Student 3 hasn't paid → Status: ISSUED

3. **After Due Date (March 1)**
   - Student 3's invoice → Status: OVERDUE
   - System can send reminders
   - Late fees can be applied (if configured)

4. **View Reports**
   - Monthly overview shows: 1 paid, 1 partial, 1 overdue
   - Unpaid report lists Student 2 (650 balance) and Student 3 (1300 balance)
   - Total collected: 1950, Total pending: 1950

## Best Practices

1. **Generate Invoices Early**: Create invoices at the start of each month
2. **Set Realistic Due Dates**: Give students enough time to pay
3. **Record Payments Promptly**: Update the system as soon as payments are received
4. **Review Reports Weekly**: Check unpaid reports to follow up with students
5. **Use Reference Numbers**: Always record bank transfer reference numbers
6. **Partial Payments**: Accept partial payments to help students manage cash flow
7. **Export Reports**: Regularly export reports for accounting records

## Troubleshooting

### Issue: Can't see any classes in overview
**Solution**: Make sure invoices have been generated for the selected month

### Issue: Payment recording fails
**Solution**: Check that:
- Invoice exists and is not cancelled
- Payment amount doesn't exceed balance
- Campus ID is correct
- User has payment recording permissions

### Issue: Wrong monthly fee amount
**Solution**: Check the fee structure configuration for that class

### Issue: Student appears in wrong class
**Solution**: Verify the student's class assignment in the student management module

## Integration with Other Modules

The Monthly Payment Tracking system integrates with:

1. **Student Management**: Gets student information and class assignments
2. **Accounting**: Posts transactions to the general ledger
3. **Reporting**: Provides data for financial reports
4. **Notifications**: Can trigger payment reminders (future feature)

## Security and Permissions

Required permissions:
- `INVOICES_VIEW`: View payment information
- `INVOICES_CREATE`: Generate invoices
- `PAYMENTS_CREATE`: Record payments
- `REPORTS_VIEW`: Access payment reports

## Future Enhancements

Planned features:
- Automatic invoice generation (scheduled)
- SMS/Email payment reminders
- Online payment gateway integration
- Payment plan management
- Bulk payment import from Excel
- Parent portal for online payments
- Payment receipt printing
- Late fee automation

## Support

For issues or questions:
1. Check this guide first
2. Review the API documentation
3. Contact the system administrator
4. Submit a support ticket

---

**Last Updated**: February 2026
**Version**: 1.0
