# CRITICAL: Add is_active Column to Database

## The Problem
The error shows: `column "is_active" does not exist`

This means the `is_active` column hasn't been added to your database tables yet. All the backend code is ready, but the database schema needs to be updated.

## Solution: Run the Migration Script

### Step 1: Stop the Backend Server
Press `Ctrl+C` in the terminal where the backend is running.

### Step 2: Run the Migration Script

Open a new terminal and run:

```cmd
cd backend
node ../add-is-active-column.js
```

Or if you're in the root directory:

```cmd
node add-is-active-column.js
```

### Step 3: What the Script Does

The script will:
1. ✅ Find all class tables in `classes_schema`
2. ✅ Add `is_active BOOLEAN DEFAULT TRUE` column to each table
3. ✅ Find all staff tables in staff schemas
4. ✅ Add `is_active BOOLEAN DEFAULT TRUE` column to each staff table
5. ✅ Skip tables that already have the column
6. ✅ Show a summary of what was done

### Step 4: Restart the Backend Server

After the migration completes successfully:

```cmd
cd backend
node server.js
```

### Step 5: Test

1. Go to the Student Attendance page
2. The deactivated students should now be hidden
3. Go to ListStudent page and deactivate a student
4. Verify they disappear from all modules

## Expected Output

You should see something like:

```
🔍 Finding all class tables in classes_schema...
📊 Found 8 class tables
✅ Added is_active column to A
✅ Added is_active column to B
✅ Added is_active column to C
...

📊 Summary:
   ✅ Successfully added: 8
   ⏭️  Already existed: 0
   ❌ Errors: 0
   📋 Total tables: 8

🔍 Finding all staff tables...
✅ Added is_active column to staff_teachers.teachers
...

📊 Staff Tables Summary:
   ✅ Successfully added: 5
   ⏭️  Already existed: 0
   ❌ Errors: 0
   📋 Total staff tables: 5

✅ Migration complete!
🔄 Please restart your backend server now.
```

## If You Get Errors

If the script fails, you can manually add the column using pgAdmin or psql:

```sql
-- For each class table
ALTER TABLE classes_schema."A" ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE classes_schema."B" ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
-- ... repeat for all your class tables

-- For each staff table
ALTER TABLE staff_teachers."teachers" ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
-- ... repeat for all your staff tables
```

## After Migration

Once the column is added:
- All existing students/staff will have `is_active = TRUE` (active by default)
- When you deactivate someone, it sets `is_active = FALSE`
- All backend queries now filter out records where `is_active = FALSE`
- Deactivated users will be hidden from all modules
