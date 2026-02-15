# Automatic Monthly Invoice System - Complete Guide

## Overview

Your system now works like this:

### ✅ **One-Time Setup**
- Set up class fees **ONCE** (not every month)
- Set up late fee rules **ONCE**
- System remembers these settings

### ✅ **Automatic Monthly Generation**
- Run a script at the beginning of each month
- System automatically creates invoices for ALL students
- Includes unpaid amounts from previous months
- Applies late fees automatically

### ✅ **Cumulative Unpaid Amounts**
- If student didn't pay last month: Next invoice = This month + Last month
- Example:
  - February: $1300 (not paid)
  - March invoice: $1300 (March) + $1300 (February arrears) = $2600

### ✅ **Automatic Late Fees**
- After 10 days overdue: Adds $100 penalty
- Example:
  - Invoice due: February 28
  - Today: March 11 (11 days late)
  - Penalty: $100 added automatically
  - New total: $1300 + $100 = $1400

---

## Step-by-Step Setup

### Step 1: Set Up Class Fees (One Time Only)

1. Go to **Finance → Payment Settings**
2. Click **"+ Add Class Fee"**
3. Fill in:
   - **Class Name**: Select from dropdown (e.g., "Class A")
   - **Monthly Fee**: Enter amount (e.g., $1300)
   - **Description**: "Monthly tuition fee"
4. Click **"Add Class Fee"**
5. Repeat for all classes

**Important**: You only do this ONCE! The system will use these fees every month.

### Step 2: Set Up Late Fee Rule (One Time Only)

1. Go to **Finance → Payment Settings**
2. Click **"Late Fees"** tab
3. Click **"+ Add Late Fee Rule"**
4. Fill in:
   - **Rule Name**: "Standard Late Fee"
   - **Grace Period**: 10 days
   - **Penalty Type**: Fixed Amount
   - **Penalty Value**: 100
5. Click **"Add Late Fee Rule"**

**Important**: You only do this ONCE! The system will apply this rule automatically.

### Step 3: Generate Invoices for Current Month

**Option A: Using the Script (Recommended)**

Open terminal in backend folder and run:

```bash
# For current month (February 2026)
node scripts/generate-monthly-invoices.js

# For specific month
node scripts/generate-monthly-invoices.js 3 2026  # March 2026
```

**Option B: Using Payment Settings Page**

1. Go to **Finance → Payment Settings**
2. Find the class card
3. Click **"📄 Generate Invoices"**
4. Repeat for each class

---

## How It Works

### First Month (February 2026)

**Setup:**
- Class A fee: $1300/month
- Late fee: $100 after 10 days

**Generate Invoices:**
```bash
node scripts/generate-monthly-invoices.js 2 2026
```

**Result:**
- All Class A students get invoice for $1300
- Due date: February 28, 2026
- Status: PENDING

### Student Pays on Time

**Scenario**: Ahmed pays $1300 on February 20

**Result:**
- Invoice status: PAID
- Next month (March): New invoice for $1300 only

### Student Doesn't Pay

**Scenario**: Fatima doesn't pay in February

**What Happens:**

**March 1-10** (Grace period):
- February invoice: $1300 (OVERDUE)
- No penalty yet

**March 11** (After 10 days):
- System automatically adds $100 late fee
- February invoice: $1300 + $100 = $1400 (OVERDUE)

**March Invoice Generation:**
```bash
node scripts/generate-monthly-invoices.js 3 2026
```

**March Invoice:**
- Current month: $1300
- February arrears: $1400 (with late fee)
- **Total: $2700**

### Student Pays Partial Amount

**Scenario**: Omar pays $500 in February (invoice is $1300)

**Result:**
- February invoice: 
  - Total: $1300
  - Paid: $500
  - Balance: $800
  - Status: PARTIALLY PAID

**March Invoice:**
- Current month: $1300
- February balance: $800
- **Total: $2100**

---

## Monthly Workflow

### Beginning of Each Month

**Day 1 of the month:**

1. **Generate Invoices**
   ```bash
   cd backend
   node scripts/generate-monthly-invoices.js
   ```

2. **Check Results**
   - Go to Finance → Monthly Payments
   - Select current month
   - Verify all invoices created

3. **Review Arrears**
   - Check which students have unpaid amounts
   - See cumulative totals

### During the Month

**Record payments as students pay:**

1. Go to Finance → Monthly Payments
2. Find student
3. Click "Record Payment"
4. Enter payment details
5. Submit

### End of Month

**Day 28-31:**

1. **Check Unpaid Invoices**
   - Filter by "Pending"
   - See who hasn't paid

2. **Send Reminders**
   - Contact parents/guardians
   - Remind about due date

3. **Prepare for Next Month**
   - Note students with arrears
   - Ready to generate next month's invoices

---

## Script Features

### What the Script Does

1. **Fetches all students** from all classes
2. **Checks existing invoices** (skips if already generated)
3. **Calculates unpaid amounts** from previous months
4. **Applies late fees** for overdue invoices (>10 days)
5. **Generates new invoices** with cumulative amounts
6. **Creates invoice items**:
   - Current month fee
   - Arrears (if any)
7. **Shows detailed report** of what was generated

### Script Output Example

```
============================================================
📅 AUTOMATIC MONTHLY INVOICE GENERATION
============================================================

🔄 Generating invoices for 3/2026...

📋 Found 75 students

📚 Processing Class A (25 students)...
  ✅ Ahmed Ali: $1300.00
  ✅ Fatima Hassan: $1300.00 + $1400.00 arrears = $2700.00
  ⚠️  Applied late fee $100.00 to invoice INV-2026-000015
  ✅ Omar Said: $1300.00 + $800.00 arrears = $2100.00
  ...

📚 Processing Class B (25 students)...
  ✅ Sara Mohamed: $1300.00
  ...

📚 Processing Class C (25 students)...
  ✅ Ali Ahmed: $1500.00
  ...

============================================================
📊 Summary:
   ✅ Generated: 70
   ⏭️  Skipped (already exists): 5
   ❌ Errors: 0
============================================================

✅ Invoice generation complete!
```

---

## Late Fee System

### How Late Fees Work

**Grace Period**: 10 days after due date

**Timeline Example:**
- Invoice due: February 28
- Grace period: March 1-10 (no penalty)
- Late fee applied: March 11 onwards

**Penalty**: $100 fixed amount

**Application**:
- Automatically applied when script runs
- Only applied once per invoice
- Added to invoice net amount

### Late Fee Rules

You can create multiple late fee rules:

**Example 1: Standard Late Fee**
- Grace Period: 10 days
- Type: Fixed Amount
- Value: $100

**Example 2: Extended Late Fee**
- Grace Period: 30 days
- Type: Fixed Amount
- Value: $200

**Example 3: Percentage Late Fee**
- Grace Period: 10 days
- Type: Percentage
- Value: 5% (5% of unpaid amount)

The system uses the rule with the longest grace period that has been exceeded.

---

## Examples

### Example 1: Student Pays Every Month

**February:**
- Invoice: $1300
- Paid: $1300 (Feb 15)
- Status: PAID

**March:**
- Invoice: $1300 (new)
- Paid: $1300 (Mar 20)
- Status: PAID

**April:**
- Invoice: $1300 (new)
- No arrears!

### Example 2: Student Misses One Month

**February:**
- Invoice: $1300
- Paid: $0
- Status: PENDING → OVERDUE (after Feb 28)

**March 11:**
- Late fee applied: $100
- February invoice: $1400

**March Invoice Generated:**
- Current: $1300
- Arrears: $1400
- Total: $2700

**March 25 - Student Pays:**
- Pays: $2700
- Both invoices: PAID

**April:**
- Invoice: $1300 (new)
- No arrears!

### Example 3: Student Pays Partially

**February:**
- Invoice: $1300
- Paid: $500 (Feb 20)
- Balance: $800
- Status: PARTIALLY PAID

**March Invoice:**
- Current: $1300
- Arrears: $800
- Total: $2100

**March 15 - Student Pays:**
- Pays: $1300
- February invoice: PAID ($500 + $800 = $1300)
- March invoice: PENDING ($1300 - $0 = $1300)

**April Invoice:**
- Current: $1300
- Arrears: $1300 (March unpaid)
- Total: $2600

### Example 4: Student Accumulates 3 Months

**February:**
- Invoice: $1300
- Paid: $0
- Status: OVERDUE
- With late fee: $1400

**March:**
- Invoice: $1300 + $1400 = $2700
- Paid: $0
- Status: OVERDUE
- With late fee: $2800

**April:**
- Invoice: $1300 + $2800 = $4100
- **Total owed: $4100**

---

## Automation Options

### Option 1: Manual Monthly Run

Run the script manually at the beginning of each month:

```bash
cd backend
node scripts/generate-monthly-invoices.js
```

### Option 2: Scheduled Task (Windows)

Create a Windows Task Scheduler task:

1. Open Task Scheduler
2. Create Basic Task
3. Name: "Generate Monthly Invoices"
4. Trigger: Monthly, Day 1, 8:00 AM
5. Action: Start a program
6. Program: `node`
7. Arguments: `C:\path\to\backend\scripts\generate-monthly-invoices.js`
8. Start in: `C:\path\to\backend`

### Option 3: Cron Job (Linux/Mac)

Add to crontab:

```bash
# Run on 1st of every month at 8:00 AM
0 8 1 * * cd /path/to/backend && node scripts/generate-monthly-invoices.js
```

### Option 4: Add to Backend Startup

Add a check in `server.js` to generate invoices if it's the 1st of the month.

---

## Troubleshooting

### Problem: Invoices not generated

**Solution:**
1. Check fee structures are active
2. Verify students exist in database
3. Run script with error logging:
   ```bash
   node scripts/generate-monthly-invoices.js 2>&1 | tee invoice-log.txt
   ```

### Problem: Late fees not applied

**Solution:**
1. Check late fee rule is active
2. Verify grace period is exceeded
3. Run script again (it will apply late fees)

### Problem: Duplicate invoices

**Solution:**
- Script automatically skips existing invoices
- Safe to run multiple times

### Problem: Wrong amounts

**Solution:**
1. Check fee structure amounts
2. Verify unpaid invoices from previous months
3. Check late fee calculations

---

## Best Practices

### 1. Run Script Early in the Month
- Run on Day 1 or 2
- Gives students full month to pay

### 2. Review Before Sending
- Check generated invoices
- Verify amounts are correct
- Fix any issues before notifying parents

### 3. Keep Records
- Save script output logs
- Track generation dates
- Monitor error rates

### 4. Regular Reconciliation
- Weekly: Check payment status
- Monthly: Verify all invoices generated
- Quarterly: Review arrears

### 5. Communication
- Notify parents when invoices generated
- Send reminders before due date
- Follow up on overdue payments

---

## Summary

### What You Need to Do

**One Time:**
1. ✅ Set up class fees (done once)
2. ✅ Set up late fee rule (done once)

**Every Month:**
1. 🔄 Run invoice generation script (Day 1)
2. 📧 Notify parents (Day 1-2)
3. 💰 Record payments as received
4. 📊 Review unpaid invoices (End of month)

**Automatic:**
- ✅ Cumulative unpaid amounts
- ✅ Late fee application
- ✅ Invoice number generation
- ✅ Status updates

---

## Quick Reference

| Task | Command | When |
|------|---------|------|
| Generate invoices | `node scripts/generate-monthly-invoices.js` | Day 1 of month |
| Specific month | `node scripts/generate-monthly-invoices.js 3 2026` | As needed |
| View invoices | Finance → Monthly Payments | Anytime |
| Record payment | Click "Record Payment" | When student pays |
| Check arrears | Filter by "Pending" or "Partial" | Anytime |

---

**Last Updated**: February 1, 2026
**Status**: ✅ Ready to use
**Next Step**: Run the script for current month!
