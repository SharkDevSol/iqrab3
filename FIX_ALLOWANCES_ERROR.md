# 🔧 Fix Allowances/Deductions Error

## The Problem
The `hr_allowances` and `hr_deductions` tables were created before we added the Ethiopian month columns, so they're missing those fields.

Error: `column "ethiopian_month" of relation "hr_allowances" does not exist`

## Quick Fix

Run this command to update the tables:

```bash
cd backend
node scripts/update-deductions-allowances-tables.js
```

This will:
- Add `ethiopian_month` column
- Add `ethiopian_year` column
- Add `start_date` column
- Add `end_date` column

To both `hr_deductions` and `hr_allowances` tables.

## What It Does

The script uses `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` which means:
- ✅ If the column doesn't exist, it adds it
- ✅ If the column already exists, it skips it (no error)
- ✅ Safe to run multiple times

## After Running the Script

1. The tables will have the new columns
2. You can add deductions and allowances with Ethiopian month tracking
3. The error will be gone!

## Verify It Worked

After running the script, try adding an allowance or deduction again. It should work now!

## Alternative: Manual SQL

If you prefer to run SQL manually:

```sql
-- Update hr_deductions table
ALTER TABLE hr_deductions 
ADD COLUMN IF NOT EXISTS ethiopian_month VARCHAR(50),
ADD COLUMN IF NOT EXISTS ethiopian_year INTEGER,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Update hr_allowances table
ALTER TABLE hr_allowances 
ADD COLUMN IF NOT EXISTS ethiopian_month VARCHAR(50),
ADD COLUMN IF NOT EXISTS ethiopian_year INTEGER,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;
```

## Why This Happened

The tables were created when you first added a deduction/allowance, but at that time the code didn't include the Ethiopian month fields. Now that we've added those fields, we need to update the existing tables.

## Run This Now

```bash
cd backend
node scripts/update-deductions-allowances-tables.js
```

Then try adding an allowance or deduction again!
