# ☢️ NUCLEAR OPTION - Delete ALL Finance Data

## ⚠️ EXTREME WARNING ⚠️

This will **PERMANENTLY DELETE EVERYTHING** related to finance:

### What Will Be Deleted:
- ❌ **ALL Invoices** (including originals, not just duplicates)
- ❌ **ALL Payments** (all payment records)
- ❌ **ALL Fee Structures** (all class fee settings)
- ❌ **ALL Late Fee Rules** (all late fee configurations)
- ❌ **ALL Payment Allocations** (payment-to-invoice links)
- ❌ **ALL Invoice Items** (invoice line items)

### What Will Be Kept:
- ✅ **Students** (student data remains)
- ✅ **Classes** (class data remains)
- ✅ **Accounts** (financial accounts remain)
- ✅ **Staff** (staff data remains)
- ✅ **Other modules** (attendance, posts, etc. remain)

---

## 🚨 BEFORE YOU PROCEED

### Ask Yourself:
1. ❓ Do I really want to delete EVERYTHING?
2. ❓ Have I backed up my database?
3. ❓ Am I prepared to recreate all fee structures?
4. ❓ Am I prepared to lose all payment history?
5. ❓ Is there no other way to fix my problem?

### If You Answered "NO" to Any Question:
**STOP! Don't run this script!**

Consider these alternatives:
- **Option A:** Delete only duplicates → Use `DELETE_DUPLICATE_INVOICES.bat`
- **Option B:** Delete specific fee structures → Use the UI
- **Option C:** Contact support for help

---

## 💾 BACKUP FIRST! (CRITICAL)

Before running this script, **BACKUP YOUR DATABASE**:

### Method 1: Using MySQL/MariaDB
```cmd
mysqldump -u root -p your_database_name > backup_before_delete.sql
```

### Method 2: Copy Database File
If using SQLite:
```cmd
copy backend\prisma\dev.db backup_before_delete.db
```

### Method 3: Export from Database Tool
Use phpMyAdmin, MySQL Workbench, or similar tool to export your database.

---

## 🚀 How to Run (If You're Absolutely Sure)

### Step 1: Backup (Required!)
- [ ] I have backed up my database
- [ ] I have verified the backup works
- [ ] I can restore from backup if needed

### Step 2: Stop Backend Server
```cmd
[In backend terminal, press Ctrl+C to stop server]
```

### Step 3: Run the Script

**Option A: Double-Click (Easiest)**
```
Double-click: DELETE_ALL_FINANCE_DATA.bat
```

**Option B: Command Line**
```cmd
cd backend
node scripts/delete-all-finance-data.js
```

### Step 4: Confirm
When prompted, press Enter to confirm deletion.

### Step 5: Wait
The script will run for 10-30 seconds.

---

## 📊 What You'll See

### During Execution:
```
🗑️  Starting to delete all financial data...

Deleting payment allocations...
✓ Deleted 150 payment allocations

Deleting payments...
✓ Deleted 75 payments

Deleting invoice items...
✓ Deleted 200 invoice items

Deleting invoices...
✓ Deleted 100 invoices

Deleting fee structure items...
✓ Deleted 15 fee structure items

Deleting fee structures...
✓ Deleted 5 fee structures

Deleting late fee rules...
✓ Deleted 2 late fee rules

✅ All financial data deleted successfully!

You can now start fresh with new fee structures and invoices.

✅ Script completed successfully
```

---

## ✅ After Running

### What You'll Have:
- **Empty Finance Module** - No invoices, no payments, no fee structures
- **Clean Slate** - Ready to start fresh
- **All Other Data** - Students, classes, staff, etc. still intact

### What You Need to Do:

#### 1. Restart Backend Server
```cmd
cd backend
npm start
```

#### 2. Recreate Fee Structures
```
Finance → Monthly Payment Settings → Class Fees → + Add Class Fee
```

For each class:
- Select class name
- Enter monthly fee amount
- Select payment months
- Click "Add Class Fee"

#### 3. Recreate Late Fee Rules (Optional)
```
Finance → Monthly Payment Settings → Late Fees → + Add Late Fee Rule
```

Example:
- Name: "Standard Late Fee"
- Grace Period: 15 days
- Penalty Type: Fixed Amount
- Penalty Value: 50 Birr

#### 4. Generate Invoices
```
Finance → Monthly Payment Settings → Class Fees → [Select Fee Structure] → Generate All Months
```

#### 5. Verify Everything
```
Finance → Monthly Payments → [Select Class]
```

Check:
- Each student has correct number of invoices
- All amounts are correct
- Month circles display correctly

---

## 🔄 Starting Fresh - Complete Guide

### Step-by-Step Setup:

#### 1. Create Fee Structures (5 minutes)
```
For Class A:
- Monthly Fee: 1200 Birr
- Months: Meskerem through Hamle (12 months)

For Class B:
- Monthly Fee: 1500 Birr
- Months: Meskerem through Hamle (12 months)

For Class C:
- Monthly Fee: 1300 Birr
- Months: Meskerem through Tir (5 months)
```

#### 2. Create Late Fee Rules (2 minutes)
```
Standard Late Fee:
- Grace Period: 15 days
- Amount: 50 Birr
- Applies to: TUITION
```

#### 3. Generate Invoices (1 minute per class)
```
For each fee structure:
- Click "Generate All Months"
- Wait for confirmation
- Verify invoices created
```

#### 4. Verify Setup (2 minutes)
```
Check Monthly Payments view:
- All students have invoices
- Amounts are correct
- No duplicates
```

**Total Time:** ~15-20 minutes

---

## 🆘 If Something Goes Wrong

### Problem: Script fails with error
**Solution:**
1. Check backend is stopped
2. Check database connection
3. Check error message
4. Restore from backup if needed

### Problem: Can't restore from backup
**Solution:**
```cmd
mysql -u root -p your_database_name < backup_before_delete.sql
```

### Problem: Lost all data and no backup
**Solution:**
- Unfortunately, data cannot be recovered
- You'll need to recreate everything manually
- This is why backup is CRITICAL!

---

## 📋 Checklist

Before running:
- [ ] I understand this deletes EVERYTHING
- [ ] I have backed up my database
- [ ] I have verified the backup works
- [ ] I have stopped the backend server
- [ ] I am prepared to recreate all settings
- [ ] I am absolutely sure I want to do this

After running:
- [ ] Script completed successfully
- [ ] Backend server restarted
- [ ] Fee structures recreated
- [ ] Late fee rules recreated
- [ ] Invoices generated
- [ ] Everything verified

---

## 🎯 Alternative Solutions

### If You Just Want to Fix Duplicates:
**Use:** `DELETE_DUPLICATE_INVOICES.bat`
- Removes only duplicates
- Keeps all settings
- Keeps original invoices
- Much safer!

### If You Want to Delete One Class:
**Use:** The UI
- Finance → Monthly Payment Settings → Class Fees
- Click 🗑️ on the fee structure
- Deletes only that class's data

### If You Want to Delete One Student's Invoices:
**Use:** The UI (future feature)
- Or contact support for SQL query

---

## 💡 Recommendation

**Unless you absolutely need to delete everything, I recommend:**

1. **First try:** `DELETE_DUPLICATE_INVOICES.bat`
   - Removes duplicates only
   - Keeps your settings
   - Much safer

2. **If that doesn't work:** Delete specific fee structures via UI
   - More targeted
   - Less destructive

3. **Only as last resort:** Use this nuclear option
   - Complete reset
   - Requires full setup again

---

## ⚠️ FINAL WARNING

**This script will:**
- ❌ Delete ALL invoices (100+ records)
- ❌ Delete ALL payments (all payment history)
- ❌ Delete ALL fee structures (all class settings)
- ❌ Delete ALL late fee rules (all late fee settings)

**This action:**
- ❌ CANNOT be undone
- ❌ CANNOT be reversed
- ❌ Will require complete setup again

**Are you ABSOLUTELY SURE?**

If yes, proceed to run `DELETE_ALL_FINANCE_DATA.bat`

If no, use `DELETE_DUPLICATE_INVOICES.bat` instead

---

**Last Updated:** February 4, 2026
**Risk Level:** 🔴 EXTREME
**Reversible:** ❌ NO (unless you have backup)
