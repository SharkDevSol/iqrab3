# Quick Start: Ethiopian Monthly Payment System

## After Database Cleanup - Step by Step

Since you just deleted all monthly payment data, follow these steps to set up and test:

## Step 1: Make Sure Backend is Running

```bash
cd backend
node server.js
```

You should see:
```
Server running on port 5000
Database connected
```

## Step 2: Log in as Admin

1. Go to: http://localhost:5173/login
2. Click **"Admin Login"** (NOT Staff Login)
3. Enter credentials:
   - Username: `admin`
   - Password: `admin123`

**Important:** You MUST be logged in as admin, not as staff!

## Step 3: Set Up Default Accounts (If Not Already Done)

Run this script to create default income accounts:

```bash
node backend/scripts/setup-default-accounts.js
```

This creates the chart of accounts needed for invoices.

## Step 4: Add Your First Class Fee Structure

1. Go to **Finance → Monthly Payment Settings**
2. Click **"+ Add Class Fee"**
3. Fill in the form:

```
Class Name: [Select a class, e.g., "Grade_5"]
Monthly Fee: 1300
Select Months: 
  ☑ Meskerem (መስከረም)
  ☑ Tikimt (ጥቅምት)
  ☑ Hidar (ኅዳር)
  ☑ Tahsas (ታኅሣሥ)
  ☑ Tir (ጥር)
  ☑ Yekatit (የካቲት)
  ☑ Megabit (መጋቢት)
  ☑ Miazia (ሚያዝያ)
  ☑ Ginbot (ግንቦት)
  ☑ Sene (ሰኔ)
  
Description: Grade 5 monthly tuition fee
```

4. Click **"Add Class Fee"**

You should see a success message!

## Step 5: Verify Fee Structure Was Created

After clicking "Add Class Fee", you should see a card showing:
- Class name (e.g., "Grade_5")
- Monthly fee (e.g., "$1300/month")
- Payment months (e.g., "10 months")
- List of selected months
- Status: Active ✓

## Step 6: Generate First Month Invoices

1. On the fee structure card, click **"Generate Next Month"**
2. You'll see a confirmation dialog:
   ```
   Generate invoices for Grade_5?
   
   This will create invoices for month 1 of 10 (Meskerem (መስከረም)).
   
   All students in this class will receive an invoice.
   ```
3. Click **OK**

## Step 7: Check Results

You should see a success message:
```
✅ Invoices generated successfully!

Month: Meskerem (መስከረም) (1 of 10)
Success: X invoices created

📅 Next: Click "Generate Invoices" again to create invoices for month 2
```

## Step 8: Test Balance Accumulation

### Generate Month 2 Without Paying Month 1

1. Click **"Generate Next Month"** again
2. Confirm for **Tikimt (ጥቅምት)** (Month 2)
3. Success message shows invoices created

### Check Student Balance

Now each student should have:
- **Month 1 (Meskerem)**: 1,300 Birr (unpaid)
- **Month 2 (Tikimt)**: 1,300 Birr (current)
- **Total Balance**: 2,600 Birr ✅

### Generate Month 3

1. Click **"Generate Next Month"** again
2. Confirm for **Hidar (ኅዳር)** (Month 3)

Now each student should have:
- **Month 1**: 1,300 Birr + 50 Birr late fee = 1,350 Birr
- **Month 2**: 1,300 Birr + 50 Birr late fee = 1,350 Birr
- **Month 3**: 1,300 Birr (current)
- **Total Balance**: 4,000 Birr ✅

## Troubleshooting

### Error: "No income account found"

**Solution:** Run the setup script:
```bash
node backend/scripts/setup-default-accounts.js
```

### Error: "No students found in this class"

**Solution:** Make sure you have students enrolled in the selected class. Check:
1. Go to Students section
2. Verify students exist in the class you selected
3. If no students, add some students first

### Error: "No months configured for this fee structure"

**Solution:** The fee structure was created without months selected. 
1. Delete the fee structure (click 🗑️ button)
2. Create a new one
3. Make sure to check at least one month checkbox

### Error: "Failed to fetch classes"

**Solution:** 
1. Make sure backend server is running
2. Check you're logged in as admin (not staff)
3. Refresh the page

### Error: "403 Forbidden"

**Solution:** You're not logged in as admin.
1. Log out
2. Log in as **admin** (not staff)
3. Try again

## Expected Behavior

### After Adding Fee Structure
✅ Card appears showing class, fee, and months
✅ "Generate Next Month" button is enabled
✅ Status shows "Active"

### After Generating Month 1
✅ Success message shows
✅ Invoice count increases
✅ Button still enabled for Month 2

### After Generating Month 2 (without paying Month 1)
✅ Success message shows
✅ Student balance = 2,600 Birr (1,300 + 1,300)
✅ Button still enabled for Month 3

### After Generating Month 3 (still unpaid)
✅ Success message shows
✅ Student balance = 4,000 Birr (1,350 + 1,350 + 1,300)
✅ Late fees applied to overdue months

## Quick Commands Reference

```bash
# Start backend server
cd backend
node server.js

# Setup default accounts (if needed)
node backend/scripts/setup-default-accounts.js

# Delete all payment data (to start fresh)
node backend/scripts/delete-all-monthly-payment-data.js --confirm

# Check database connection
node backend/scripts/check-current-status.js
```

## What to Test

1. ✅ **Create fee structure** with Ethiopian months
2. ✅ **Generate Month 1** - Check invoices created
3. ✅ **Generate Month 2** without paying - Check balance = 2,600
4. ✅ **Generate Month 3** without paying - Check balance = 4,000 with late fees
5. ✅ **Make payment** - Check balance reduces
6. ✅ **Generate Month 4** after partial payment - Check balance accumulates correctly

## Need Help?

If you're still getting errors:
1. Check backend console for detailed error messages
2. Verify you're logged in as admin
3. Make sure students exist in the selected class
4. Ensure default accounts are set up
5. Check that backend server is running

Read the full guide: `ETHIOPIAN_CALENDAR_BALANCE_ACCUMULATION_GUIDE.md`
