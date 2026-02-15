# 🔧 FIX ALLOWANCES ERROR - RUN THIS NOW!

## The Problem
The `hr_allowances` and `hr_deductions` tables don't have the Ethiopian month columns.

## ⚡ QUICK FIX - Run This Command:

```bash
cd backend
node scripts/recreate-deductions-allowances-tables.js
```

## What This Does:

1. **Backs up** your existing deductions and allowances
2. **Drops** the old tables
3. **Creates** new tables with Ethiopian month support
4. **Restores** your old data (without Ethiopian month info)

## Safe to Run

- ✅ Your existing data is backed up first
- ✅ Old entries are restored
- ✅ New entries will have Ethiopian month tracking
- ✅ No data loss!

## After Running:

1. Try adding an allowance or deduction again
2. It should work now!
3. You'll see the Ethiopian month info in the modal

## Alternative: Just Delete Old Data

If you don't care about old deductions/allowances, you can just delete the tables:

```sql
DROP TABLE IF EXISTS hr_deductions CASCADE;
DROP TABLE IF EXISTS hr_allowances CASCADE;
```

Then the backend will create them with the correct schema when you add a new entry.

## RUN THIS NOW:

```bash
cd backend
node scripts/recreate-deductions-allowances-tables.js
```

Then try adding an allowance again!
