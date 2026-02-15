# Adding machine_id Column to All Staff Tables

## Problem
The `machine_id` column is missing from Supportive Staff and Administrative Staff tables, which means:
- These staff members cannot use the attendance system
- The forms don't show the machine_id field
- Excel import/export doesn't include machine_id

## Solution
Add the `machine_id` column to all staff tables.

## Method 1: Run SQL Script (Recommended)

1. Open your PostgreSQL database client (pgAdmin, DBeaver, or psql)
2. Connect to your database
3. Open the file `ADD_MACHINE_ID_TO_ALL_STAFF.sql`
4. Execute the entire script
5. Check the output to verify columns were added

## Method 2: Run Node.js Script

1. Open terminal in your project root
2. Run:
   ```bash
   node backend/scripts/add-machine-id-to-all-staff.js
   ```
3. Check for success messages

## Method 3: Manual SQL Commands

Run these commands one by one in your database:

### For Supportive Staff
```sql
-- Replace 'Supp' with your actual table name
ALTER TABLE staff_supportive_staff."Supp" 
ADD COLUMN machine_id VARCHAR(50) UNIQUE;
```

### For Administrative Staff
```sql
-- Replace with your actual table names
ALTER TABLE staff_administrative_staff."Admin_Department" 
ADD COLUMN machine_id VARCHAR(50) UNIQUE;
```

### For Teachers (if not already added)
```sql
-- Replace with your actual table names
ALTER TABLE staff_teachers."Science_Department" 
ADD COLUMN machine_id VARCHAR(50) UNIQUE;
```

## After Adding the Column

1. **Restart Backend Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```

2. **Refresh Frontend**
   - Hard refresh the browser (Ctrl+F5 or Cmd+Shift+R)
   - Or clear browser cache

3. **Verify**
   - Go to Staff Registration page
   - Select Supportive Staff or Administrative Staff
   - You should now see "Machine ID" field in the form

## What is machine_id?

The `machine_id` is used for:
- **Attendance Tracking**: Links staff to biometric devices
- **Auto-Marking**: Automatically marks attendance from device logs
- **Identification**: Unique identifier for each staff member on attendance machines

## Recommended machine_id Format

- **Teachers**: 1-99 (e.g., 1, 2, 3...)
- **Supportive Staff**: 100-199 (e.g., 100, 101, 102...)
- **Administrative Staff**: 200-299 (e.g., 200, 201, 202...)
- **Students**: 1000-9999 (e.g., 1001, 1002, 1003...)

This prevents conflicts between different user types.

## Troubleshooting

### Column Already Exists Error
```
ERROR: column "machine_id" of relation "..." already exists
```
**Solution**: The column is already there. Just restart the server and refresh the browser.

### Permission Denied Error
```
ERROR: permission denied for schema staff_supportive_staff
```
**Solution**: Make sure you're connected as a database user with ALTER TABLE permissions.

### Table Not Found Error
```
ERROR: relation "staff_supportive_staff.Supp" does not exist
```
**Solution**: Check your actual table names using:
```sql
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema IN ('staff_teachers', 'staff_supportive_staff', 'staff_administrative_staff');
```

## Verify the Changes

Run this query to check if machine_id was added:

```sql
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE column_name = 'machine_id'
  AND table_schema IN ('staff_teachers', 'staff_supportive_staff', 'staff_administrative_staff')
ORDER BY table_schema, table_name;
```

You should see `machine_id` listed for all your staff tables.

## About account_number

The `account_number` column was mentioned but:
- It doesn't exist in the current staff forms
- It's not used in the system
- No action needed for account_number

If you want to add `account_number` for financial tracking, you can run:

```sql
-- Add account_number to all staff tables
ALTER TABLE staff_supportive_staff."Supp" 
ADD COLUMN account_number VARCHAR(50);

ALTER TABLE staff_administrative_staff."Admin_Department" 
ADD COLUMN account_number VARCHAR(50);

ALTER TABLE staff_teachers."Science_Department" 
ADD COLUMN account_number VARCHAR(50);
```

## Summary

1. Run the SQL script `ADD_MACHINE_ID_TO_ALL_STAFF.sql`
2. Restart backend server
3. Refresh browser
4. machine_id field should now appear in all staff forms
5. Excel import/export will include machine_id column

After this, all staff types (Teachers, Supportive Staff, Administrative Staff) will have the machine_id field for attendance tracking!
