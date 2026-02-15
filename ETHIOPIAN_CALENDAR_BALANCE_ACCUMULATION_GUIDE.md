# Ethiopian Calendar Monthly Payment with Balance Accumulation

## Overview

The payment system now uses the **Ethiopian calendar** (13 months) and implements **automatic balance accumulation**:

- Students select which Ethiopian months to pay
- Each month, new fees are added to unpaid balance
- Late fees automatically apply to overdue amounts
- Balance accumulates until paid

## Ethiopian Calendar Months

The system uses all 13 Ethiopian calendar months:

1. **Meskerem (መስከረም)** - 30 days
2. **Tikimt (ጥቅምት)** - 30 days
3. **Hidar (ኅዳር)** - 30 days
4. **Tahsas (ታኅሣሥ)** - 30 days
5. **Tir (ጥር)** - 30 days
6. **Yekatit (የካቲት)** - 30 days
7. **Megabit (መጋቢት)** - 30 days
8. **Miazia (ሚያዝያ)** - 30 days
9. **Ginbot (ግንቦት)** - 30 days
10. **Sene (ሰኔ)** - 30 days
11. **Hamle (ሐምሌ)** - 30 days
12. **Nehase (ነሐሴ)** - 30 days
13. **Pagume (ጳጉሜን)** - 5/6 days

## How Balance Accumulation Works

### Example Scenario

**Setup:**
- Class: Grade 5
- Monthly Fee: 1,300 Birr
- Selected Months: 10 months (Meskerem to Sene)
- Late Fee: 50 Birr after 5 days grace period

### Month 1 (Meskerem)
- Invoice generated: **1,300 Birr**
- Student balance: **1,300 Birr**
- Status: Pending

### Month 2 (Tikimt)

**Scenario A: Student paid Month 1**
- Previous balance: 0 Birr (paid)
- New month fee: 1,300 Birr
- **Total balance: 1,300 Birr**

**Scenario B: Student didn't pay Month 1**
- Previous balance: 1,300 Birr (unpaid)
- Late fee (if overdue): 50 Birr
- New month fee: 1,300 Birr
- **Total balance: 2,650 Birr**

### Month 3 (Hidar)

**Scenario A: Student paid all previous months**
- Previous balance: 0 Birr
- New month fee: 1,300 Birr
- **Total balance: 1,300 Birr**

**Scenario B: Student didn't pay any month**
- Month 1 balance: 1,300 Birr
- Month 1 late fee: 50 Birr
- Month 2 balance: 1,300 Birr
- Month 2 late fee: 50 Birr
- New month fee: 1,300 Birr
- **Total balance: 4,000 Birr**

## Setting Up Monthly Payments

### Step 1: Add Class Fee Structure

1. Go to **Finance → Monthly Payment Settings**
2. Click **"+ Add Class Fee"**
3. Fill in the form:

```
Class Name: Grade 5
Monthly Fee: 1300
Select Months: ☑ Meskerem
               ☑ Tikimt
               ☑ Hidar
               ☑ Tahsas
               ☑ Tir
               ☑ Yekatit
               ☑ Megabit
               ☑ Miazia
               ☑ Ginbot
               ☑ Sene
               ☐ Hamle
               ☐ Nehase
               ☐ Pagume

Description: Grade 5 monthly tuition fee
```

4. Click **"Add Class Fee"**

### Step 2: Configure Late Fee Rules (Optional)

1. Go to **Late Fees** tab
2. Click **"+ Add Late Fee Rule"**
3. Configure:

```
Rule Name: Standard Late Fee
Grace Period: 5 days
Penalty Type: Fixed Amount
Penalty Value: 50
```

4. Click **"Add Late Fee Rule"**

### Step 3: Generate Monthly Invoices

1. Go back to **Class Fees** tab
2. Find your class fee structure
3. Click **"Generate Next Month"**
4. Confirm the generation

The system will:
- Create invoices for all students in the class
- Add current month's fee (1,300 Birr)
- Include any unpaid balance from previous months
- Apply late fees to overdue amounts
- Show detailed summary

## Invoice Generation Details

### What Happens When You Generate Invoices

For each student, the system:

1. **Checks previous balance**
   - Finds all unpaid invoices
   - Calculates total unpaid amount
   - Identifies overdue invoices

2. **Calculates late fees**
   - Checks if invoice is past due date
   - Applies late fee rules
   - Adds late fee to balance

3. **Creates new invoice**
   - Current month fee: 1,300 Birr
   - Previous unpaid balance: (if any)
   - Late fees: (if applicable)
   - **Total due = Sum of all above**

### Invoice Breakdown Example

```
Invoice #: INV-2024-000123
Student: Ahmed Ali
Class: Grade 5
Month: Tikimt (Month 2 of 10)

Items:
1. Tikimt Monthly Fee                    1,300.00 Birr
2. Previous Balance - Meskerem           1,300.00 Birr
3. Late Fee - Meskerem (10 days overdue)    50.00 Birr
                                        ---------------
Total Due:                               2,650.00 Birr
```

## Payment Processing

### When Student Makes Payment

The system automatically:

1. **Allocates payment to oldest invoices first (FIFO)**
   - Pays Meskerem invoice first
   - Then Tikimt invoice
   - Then Hidar invoice, etc.

2. **Updates invoice status**
   - PAID: Fully paid
   - PARTIALLY_PAID: Partially paid
   - PENDING: Not paid yet
   - OVERDUE: Past due date

3. **Calculates new balance**
   - Remaining unpaid amount
   - Upcoming late fees

### Payment Example

**Student owes:**
- Meskerem: 1,350 Birr (1,300 + 50 late fee)
- Tikimt: 1,300 Birr
- Total: 2,650 Birr

**Student pays: 2,000 Birr**

**System allocates:**
1. Meskerem invoice: 1,350 Birr (PAID ✓)
2. Tikimt invoice: 650 Birr (PARTIALLY_PAID)

**New balance: 650 Birr** (remaining from Tikimt)

## Viewing Student Balance

### For Administrators

1. Go to **Finance → Monthly Payments**
2. Select class
3. View student list with balances
4. See detailed breakdown:
   - Current month fee
   - Previous unpaid balance
   - Late fees
   - Total due

### Balance Information Shows

```
Student: Fatima Hassan
Class: Grade 5

Current Balance: 4,000 Birr

Breakdown:
- Meskerem (Month 1): 1,300 Birr + 50 Birr late fee
- Tikimt (Month 2): 1,300 Birr + 50 Birr late fee
- Hidar (Month 3): 1,300 Birr (current month)

Unpaid Months: 3
Total Late Fees: 100 Birr
```

## Automatic Features

### 1. Balance Accumulation
- ✅ Automatically adds new month fee to existing balance
- ✅ Preserves unpaid amounts from previous months
- ✅ No manual calculation needed

### 2. Late Fee Application
- ✅ Automatically checks due dates
- ✅ Applies late fees after grace period
- ✅ Increases with each overdue day

### 3. Payment Allocation
- ✅ Pays oldest invoices first (FIFO)
- ✅ Automatically updates invoice status
- ✅ Calculates remaining balance

### 4. Month Tracking
- ✅ Tracks which months are selected
- ✅ Generates invoices in order
- ✅ Prevents duplicate generation

## Reports and Tracking

### Available Reports

1. **Student Balance Report**
   - Shows all students with balances
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

## Best Practices

### 1. Generate Invoices on Time
- Generate at the start of each Ethiopian month
- Don't skip months
- Generate in sequence (Month 1, then 2, then 3...)

### 2. Set Reasonable Late Fees
- Grace period: 5-10 days recommended
- Fixed amount: 50-100 Birr
- Or percentage: 2-5% of monthly fee

### 3. Monitor Balances Regularly
- Check student balances weekly
- Follow up with students who have high balances
- Send payment reminders

### 4. Process Payments Promptly
- Record payments as soon as received
- Verify payment allocation
- Provide receipts to students

## Troubleshooting

### Issue: Balance not accumulating

**Check:**
- Are invoices being generated correctly?
- Is the fee structure active?
- Are students in the correct class?

**Solution:**
- Verify fee structure settings
- Check invoice generation logs
- Ensure students are enrolled

### Issue: Late fees not applying

**Check:**
- Is late fee rule active?
- Is grace period configured correctly?
- Are invoices past due date?

**Solution:**
- Activate late fee rule
- Check grace period settings
- Verify due dates on invoices

### Issue: Payment not reducing balance

**Check:**
- Was payment recorded correctly?
- Is payment allocated to invoices?
- Check payment status

**Solution:**
- Re-record payment if needed
- Verify payment allocation
- Check invoice payment status

## API Endpoints

### Generate Invoices with Balance
```http
POST /api/finance/progressive-invoices/generate-next
Authorization: Bearer {token}
Content-Type: application/json

{
  "feeStructureId": "uuid"
}
```

### Get Student Balance
```http
GET /api/finance/students/{studentId}/balance?feeStructureId={uuid}
Authorization: Bearer {token}
```

### Record Payment
```http
POST /api/finance/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": "schoolId-classId",
  "amount": 2000,
  "paymentMethod": "CASH",
  "feeStructureId": "uuid"
}
```

## Summary

The Ethiopian calendar monthly payment system with balance accumulation:

✅ Uses all 13 Ethiopian months
✅ Automatically accumulates unpaid balance
✅ Applies late fees to overdue amounts
✅ Allocates payments to oldest invoices first
✅ Tracks payment history per student
✅ Provides detailed balance breakdown
✅ Generates comprehensive reports

Students pay only for selected months, and balances accumulate automatically until paid!
