# Progressive Monthly Payment System - Complete Guide

## Overview
The new progressive monthly payment system allows you to:
- ✅ Delete all existing financial data and start fresh
- ✅ Select multiple months when creating class fees (e.g., 10 months)
- ✅ Generate invoices progressively month by month
- ✅ Only show current month's payment to students
- ✅ Automatically progress to next month after payment

## Step 1: Delete All Financial Data

Before starting fresh, delete all existing financial data:

```bash
cd backend
node scripts/delete-all-finance-data.js
```

This will delete:
- All invoices
- All payments
- All fee structures
- All late fee rules

## Step 2: Add Class Fee with Multiple Months

1. Go to **Finance** → **Payment Settings**
2. Click **"+ Add Class Fee"**
3. Fill in the form:
   - **Class Name**: Select from dropdown (e.g., "Class A")
   - **Monthly Fee Amount**: Enter amount (e.g., 1300)
   - **Select Months for Payment**: Check the months you want (e.g., September to June = 10 months)
   - **Description**: Optional description

4. Click **"Add Class Fee"**

### Example: 10-Month Payment Plan
If you select months: September, October, November, December, January, February, March, April, May, June

The system will:
- Store these 10 months in the fee structure
- Generate invoices progressively (one month at a time)
- Show only the current month's invoice to students

## Step 3: Generate Invoices Progressively

### First Month (September)
1. Go to **Payment Settings** → **Class Fees** tab
2. Find your class fee card
3. Click **"📄 Generate Next Month"**
4. Confirm the dialog

Result:
- Invoices created for **September** only
- All students in the class get 1 invoice
- Students see: "September 2026 - Monthly tuition fee - Class A"

### Second Month (October)
After students have paid September fees:
1. Click **"📄 Generate Next Month"** again
2. Confirm the dialog

Result:
- Invoices created for **October** only
- Students now see October invoices
- Previous September invoices remain in history

### Continue for Remaining Months
Repeat the process for each month:
- November (Month 3)
- December (Month 4)
- January (Month 5)
- February (Month 6)
- March (Month 7)
- April (Month 8)
- May (Month 9)
- June (Month 10)

## Step 4: View Payments

Go to **Finance** → **Monthly Payments** to see:
- Current month's invoices
- Payment status for each student
- Payment history

## How It Works

### Progressive Invoice Generation
```
Month 1: Click "Generate Next Month" → Creates September invoices
Month 2: Click "Generate Next Month" → Creates October invoices
Month 3: Click "Generate Next Month" → Creates November invoices
...and so on
```

### Student View
Students only see invoices for months that have been generated:
- **After Month 1 generation**: Students see 1 invoice (September)
- **After Month 2 generation**: Students see 2 invoices (September + October)
- **After Month 3 generation**: Students see 3 invoices (September + October + November)

### Payment Tracking
- Each month's invoice is separate
- Students can pay one month at a time
- Or pay multiple months at once using "Pay Multiple Months" button
- System tracks which months are paid and which are pending

## Benefits

### 1. Controlled Cash Flow
- Generate invoices only when you're ready
- Don't overwhelm students with 10 invoices at once
- Better cash flow management

### 2. Clear Monthly Tracking
- Each month has its own invoice
- Easy to see which month is paid/unpaid
- Clear payment history

### 3. Flexible Payment
- Students can pay current month
- Or pay multiple months in advance
- System handles both scenarios

### 4. Automatic Late Fees
If you've set up late fee rules:
- Late fees apply to overdue invoices
- Each month's invoice has its own due date
- Automatic calculation of penalties

## Example Workflow

### School Administrator
1. **Start of Academic Year** (September):
   - Delete old financial data
   - Create Class A fee: $1300/month for 10 months
   - Select months: Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr, May, Jun
   - Generate September invoices

2. **End of September**:
   - Check payment status
   - Generate October invoices
   - Students now see October payment

3. **Monthly Routine**:
   - At the end of each month, generate next month's invoices
   - Monitor payment status
   - Follow up with students who haven't paid

### Student/Parent
1. **September**: Receives 1 invoice for September ($1300)
2. **October**: Receives 1 invoice for October ($1300)
3. **Can pay**:
   - One month at a time: $1300
   - Multiple months: $2600 (2 months), $3900 (3 months), etc.

## Technical Details

### Database Structure
- **FeeStructure**: Stores class fee configuration
  - `description` field contains JSON with selected months
  - Example: `{"months": [9,10,11,12,1,2,3,4,5,6], "description": "Monthly tuition"}`

- **Invoice**: One invoice per student per month
  - `description` includes month name: "Sep 2026 - Monthly tuition fee - Class A"
  - `dueDate` set to end of target month

### API Endpoints

#### Get Current Month Info
```
GET /api/finance/progressive-invoices/current-month?feeStructureId={id}
```
Returns:
- Current month number (1-12)
- Current month index (1-10)
- Total months (10)
- Selected months array

#### Generate Next Month
```
POST /api/finance/progressive-invoices/generate-next
Body: { feeStructureId: "..." }
```
Returns:
- Month generated
- Success count
- Error count

## Troubleshooting

### "All months have already been generated"
- You've generated all 10 months
- No more invoices to create
- Students can now pay any pending months

### "No students found in this class"
- Make sure students are registered in the class
- Check class name matches exactly

### "No months configured for this fee structure"
- Fee structure was created before multi-month feature
- Delete and recreate the fee structure with month selection

## Best Practices

1. **Generate invoices at the start of each month**
   - Don't generate all months at once
   - Give students time to pay current month

2. **Monitor payment status regularly**
   - Check Monthly Payments page weekly
   - Follow up with students who are behind

3. **Set up late fee rules**
   - Encourages timely payment
   - Automatic penalty calculation

4. **Communicate with parents**
   - Notify when new month's invoice is generated
   - Send payment reminders before due date

## Summary

The progressive monthly payment system gives you complete control over when invoices are generated, making it easier to manage cash flow and student payments throughout the academic year. Students see a clear, month-by-month payment schedule, and you can track payments accurately for each month.
