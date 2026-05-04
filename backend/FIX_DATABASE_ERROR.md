# Fix: Missing hr_attendance_deduction_settings Table

## Error Message
```
❌ Error fetching attendance issues: relation "hr_attendance_deduction_settings" does not exist
```

## Problem
The database table `hr_attendance_deduction_settings` is missing from your PostgreSQL database.

## Solution Options

### Option 1: Run SQL Script Directly (Recommended)

1. **Open your PostgreSQL client** (pgAdmin, DBeaver, or psql command line)

2. **Connect to your database**: `school_management10`

3. **Run the SQL file**: `backend/database/FIX_MISSING_TABLE.sql`

   Or copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS hr_attendance_deduction_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_type VARCHAR(255) NOT NULL,
  deduction_type VARCHAR(50) NOT NULL,
  deduction_amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_type, deduction_type)
);

INSERT INTO hr_attendance_deduction_settings 
  (staff_type, deduction_type, deduction_amount, description, is_active)
VALUES 
  ('Teacher', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Teacher', 'Absent', 200.00, 'Deduction for absence', true),
  ('Teacher', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  ('Administrative', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Administrative', 'Absent', 200.00, 'Deduction for absence', true),
  ('Administrative', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  ('Support Staff', 'Late', 30.00, 'Deduction for late arrival', true),
  ('Support Staff', 'Absent', 150.00, 'Deduction for absence', true),
  ('Support Staff', 'Half-Day', 75.00, 'Deduction for half-day absence', true)
ON CONFLICT (staff_type, deduction_type) DO NOTHING;
```

### Option 2: Using psql Command Line

```bash
# Navigate to backend directory
cd backend

# Run the SQL file
psql -U postgres -d school_management10 -f database/FIX_MISSING_TABLE.sql

# Or run directly
psql -U postgres -d school_management10 -c "CREATE TABLE IF NOT EXISTS hr_attendance_deduction_settings (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), staff_type VARCHAR(255) NOT NULL, deduction_type VARCHAR(50) NOT NULL, deduction_amount DECIMAL(10, 2) NOT NULL, description TEXT, is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(staff_type, deduction_type));"
```

### Option 3: Using Node.js Script (If Database Credentials are Correct)

```bash
# Update backend/.env with correct database password
# Then run:
cd backend
node scripts/create-hr-deduction-settings-table.js
```

## Verify the Fix

After running the SQL, verify the table exists:

```sql
SELECT COUNT(*) FROM hr_attendance_deduction_settings;
```

You should see 9 or more rows.

## Restart Your Application

After creating the table:

1. **Restart the backend server**
2. **Refresh your browser**
3. **The error should be resolved**

## What This Table Does

The `hr_attendance_deduction_settings` table stores deduction rules for staff attendance issues:

- **Late arrivals**: Deduction amount for coming late
- **Absences**: Deduction amount for being absent
- **Half-day**: Deduction amount for half-day absence

Different staff types (Teacher, Administrative, Support Staff) can have different deduction amounts.

## Need Help?

If you still see the error after running the SQL:

1. Check if PostgreSQL is running
2. Verify database name is `school_management10`
3. Check database user has permissions to create tables
4. Look at backend server logs for more details
