-- Add Weekend Days Support to Attendance Time Settings
-- This script adds the weekend_days column to support weekend configuration

-- Step 1: Add weekend_days column if it doesn't exist
ALTER TABLE hr_attendance_time_settings 
ADD COLUMN IF NOT EXISTS weekend_days INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- Step 2: Set default weekend (Saturday and Sunday) if column was just added
-- Only update if weekend_days is NULL or empty
UPDATE hr_attendance_time_settings 
SET weekend_days = ARRAY[0, 6]  -- 0=Sunday, 6=Saturday
WHERE weekend_days IS NULL OR weekend_days = ARRAY[]::INTEGER[];

-- Verification
SELECT 
  'Weekend Days Configuration:' as info,
  weekend_days,
  CASE 
    WHEN 0 = ANY(weekend_days) THEN 'Sunday, '
    ELSE ''
  END ||
  CASE 
    WHEN 1 = ANY(weekend_days) THEN 'Monday, '
    ELSE ''
  END ||
  CASE 
    WHEN 2 = ANY(weekend_days) THEN 'Tuesday, '
    ELSE ''
  END ||
  CASE 
    WHEN 3 = ANY(weekend_days) THEN 'Wednesday, '
    ELSE ''
  END ||
  CASE 
    WHEN 4 = ANY(weekend_days) THEN 'Thursday, '
    ELSE ''
  END ||
  CASE 
    WHEN 5 = ANY(weekend_days) THEN 'Friday, '
    ELSE ''
  END ||
  CASE 
    WHEN 6 = ANY(weekend_days) THEN 'Saturday'
    ELSE ''
  END as weekend_day_names
FROM hr_attendance_time_settings;

-- Show current settings
SELECT * FROM hr_attendance_time_settings;
