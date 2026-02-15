# Quick Start - Automatic Monthly Invoice System

## ✅ What Changed

### Before:
- ❌ Had to add class fees every month
- ❌ Manual invoice generation each month
- ❌ No automatic arrears tracking
- ❌ No automatic late fees

### Now:
- ✅ Set up class fees **ONCE**
- ✅ Automatic invoice generation
- ✅ Automatic arrears (unpaid amounts carry forward)
- ✅ Automatic late fees ($100 after 10 days)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Set Up Late Fee Rule (One Time)

```bash
cd backend
node scripts/setup-late-fee-rule.js
```

**Result**: $100 penalty after 10 days overdue

### Step 2: Set Up Class Fees (One Time)

1. Go to **Finance → Payment Settings**
2. Click **"+ Add Class Fee"**
3. Select class, enter $1300 (or your amount)
4. Click "Add"
5. Repeat for all classes

**Result**: Fees saved permanently

### Step 3: Generate This Month's Invoices

```bash
cd backend
node scripts/generate-monthly-invoices.js
```

**Result**: Invoices created for all students

---

## 📅 Monthly Workflow

### Day 1 of Each Month:

```bash
cd backend
node scripts/generate-monthly-invoices.js
```

That's it! The script:
- ✅ Creates invoices for all students
- ✅ Adds unpaid amounts from previous months
- ✅ Applies late fees automatically
- ✅ Skips students who already have invoices

---

## 💡 How It Works

### Example: Student Who Doesn't Pay

**February:**
- Invoice: $1300
- Student doesn't pay
- Due: Feb 28

**March 1-10:**
- Grace period (no penalty)

**March 11:**
- Late fee applied: $100
- February invoice: $1400

**March 1 - Generate Invoices:**
```bash
node scripts/generate-monthly-invoices.js 3 2026
```

**March Invoice:**
- Current month: $1300
- February arrears: $1400
- **Total: $2700**

### Example: Student Who Pays

**February:**
- Invoice: $1300
- Student pays: $1300
- Status: PAID

**March Invoice:**
- Current month: $1300
- No arrears
- **Total: $1300**

---

## 🎯 Key Features

### 1. Cumulative Unpaid Amounts
- Unpaid amounts automatically carry forward
- Example: 2 months unpaid = $1300 + $1300 = $2600

### 2. Automatic Late Fees
- After 10 days: +$100
- Applied automatically by script
- Only applied once per invoice

### 3. Partial Payments
- Student pays $500 of $1300
- Next month: $1300 + $800 = $2100

### 4. Smart Duplicate Prevention
- Safe to run script multiple times
- Skips existing invoices
- No duplicates created

---

## 📊 View Invoices

1. Go to **Finance → Monthly Payments**
2. Select month and year
3. See all invoices with:
   - Student names
   - Amounts
   - Payment status
   - Arrears (if any)

---

## 💳 Record Payments

1. Find student in table
2. Click **"💳 Record Payment"**
3. Enter amount and method
4. Submit

System automatically:
- Updates invoice status
- Calculates remaining balance
- Shows in next month if unpaid

---

## 🔧 Troubleshooting

### No invoices generated?
```bash
# Check if fee structures exist
# Go to Finance → Payment Settings
# Make sure classes are added and active
```

### Late fees not applied?
```bash
# Run the setup script
node scripts/setup-late-fee-rule.js

# Then generate invoices again
node scripts/generate-monthly-invoices.js
```

### Wrong amounts?
```bash
# Check fee structures in Payment Settings
# Verify amounts are correct
# Check for unpaid invoices from previous months
```

---

## 📝 Commands Reference

```bash
# Setup late fee rule (one time)
node scripts/setup-late-fee-rule.js

# Generate invoices for current month
node scripts/generate-monthly-invoices.js

# Generate invoices for specific month
node scripts/generate-monthly-invoices.js 3 2026  # March 2026
```

---

## ✅ Checklist

**One-Time Setup:**
- [ ] Run late fee setup script
- [ ] Add class fees in Payment Settings
- [ ] Verify fees are active

**Monthly Tasks:**
- [ ] Day 1: Run invoice generation script
- [ ] Day 1-2: Notify parents
- [ ] During month: Record payments
- [ ] End of month: Review unpaid invoices

---

## 🎉 Benefits

### For You:
- ⏱️ Save time (no manual invoice creation)
- 🎯 Accurate tracking (automatic arrears)
- 💰 Better collection (automatic late fees)
- 📊 Clear reporting (see everything in one place)

### For Parents:
- 📧 Clear invoices (shows all amounts)
- 💳 Easy payment (record anytime)
- 📱 Transparent (see payment history)

---

**Status**: ✅ Ready to use
**Next Step**: Run the setup scripts and generate invoices!

**Need Help?** Check `AUTOMATIC_MONTHLY_INVOICES_GUIDE.md` for detailed documentation.
