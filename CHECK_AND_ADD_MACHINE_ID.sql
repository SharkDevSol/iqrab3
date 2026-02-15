-- Step 1: Check what staff tables exist
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_schema IN ('staff_teachers', 'staff_supportive_staff', 'staff_administrative_staff')
ORDER BY table_schema, table_name;

-- Step 2: Check if machine_id column exists in these tables
SELECT 
    table_schema,
    table_name,
    column_name
FROM information_schema.columns
WHERE table_schema IN ('staff_teachers', 'staff_supportive_staff', 'staff_administrative_staff')
  AND column_name = 'machine_id'
ORDER BY table_schema, table_name;

-- Step 3: Add machine_id to the 'supportive' table (adjust table name if different)
ALTER TABLE staff_supportive_staff."supportive" 
ADD COLUMN IF NOT EXISTS machine_id VARCHAR(50) UNIQUE;

-- Step 4: Add machine_id to administrative staff tables (adjust table name)
-- First, find the actual table name by running Step 1, then use it here
-- Example:
-- ALTER TABLE staff_administrative_staff."administrative" 
-- ADD COLUMN IF NOT EXISTS machine_id VARCHAR(50) UNIQUE;

-- Step 5: Verify the column was added
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema IN ('staff_supportive_staff', 'staff_administrative_staff')
  AND column_name = 'machine_id';
