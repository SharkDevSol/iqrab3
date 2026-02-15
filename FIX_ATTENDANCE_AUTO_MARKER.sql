-- Fix Attendance Auto-Marker Database Schema
-- This script updates the hr_ethiopian_attendance table to properly support shift-based attendance

-- Step 1: Drop the old unique constraint if it exists
ALTER TABLE hr_ethiopian_attendance 
DROP CONSTRAINT IF EXISTS hr_ethiopian_attendance_staff_id_ethiopian_year_ethiopian_month_key;

-- Step 2: Add shift_type column if it doesn't exist
ALTER TABLE hr_ethiopian_attendance 
ADD COLUMN IF NOT EXISTS shift_type VARCHAR(20) DEFAULT 'shift1';

-- Step 3: Create new unique constraint that includes shift_type
-- This allows staff with "both" shifts to have 2 records per day
ALTER TABLE hr_ethiopian_attendance 
ADD CONSTRAINT hr_ethiopian_attendance_unique_per_shift 
UNIQUE (staff_id, ethiopian_year, ethiopian_month, ethiopian_day, shift_type);

-- Step 4: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_date_lookup 
ON hr_ethiopian_attendance(ethiopian_year, ethiopian_month, ethiopian_day);

CREATE INDEX IF NOT EXISTS idx_attendance_staff_lookup 
ON hr_ethiopian_attendance(staff_id);

-- Step 5: Update existing records without shift_type to have 'shift1'
UPDATE hr_ethiopian_attendance 
SET shift_type = 'shift1' 
WHERE shift_type IS NULL;

-- Verification queries
SELECT 'Total attendance records:' as info, COUNT(*) as count FROM hr_ethiopian_attendance;
SELECT 'Records by shift:' as info, shift_type, COUNT(*) as count FROM hr_ethiopian_attendance GROUP BY shift_type;
SELECT 'Recent records:' as info, staff_name, ethiopian_month, ethiopian_day, shift_type, status FROM hr_ethiopian_attendance ORDER BY created_at DESC LIMIT 10;
