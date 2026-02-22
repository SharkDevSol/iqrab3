-- Fix check_in constraint to prevent null value errors
-- This makes the system more resilient to data deletion or device changes

-- Step 1: Make check_in nullable (remove NOT NULL constraint if it exists)
ALTER TABLE hr_ethiopian_attendance 
ALTER COLUMN check_in DROP NOT NULL;

-- Step 2: Add a check constraint to ensure logical data integrity
-- Either both check_in and check_out are null, or check_in must have a value
ALTER TABLE hr_ethiopian_attendance 
DROP CONSTRAINT IF EXISTS check_in_logic;

ALTER TABLE hr_ethiopian_attendance 
ADD CONSTRAINT check_in_logic 
CHECK (
  (check_in IS NOT NULL) OR 
  (check_in IS NULL AND check_out IS NULL)
);

-- This ensures:
-- ✅ check_in = '08:00', check_out = NULL (valid - checked in, not out yet)
-- ✅ check_in = '08:00', check_out = '17:00' (valid - complete record)
-- ✅ check_in = NULL, check_out = NULL (valid - empty record)
-- ❌ check_in = NULL, check_out = '17:00' (invalid - can't check out without checking in)
