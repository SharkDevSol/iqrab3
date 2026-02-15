-- Add new columns for automatic attendance marking
-- Run this SQL script to add the required columns

ALTER TABLE hr_attendance_time_settings
ADD COLUMN IF NOT EXISTS max_checkout_hours DECIMAL(4,2) DEFAULT 3.0,
ADD COLUMN IF NOT EXISTS absent_threshold_time TIME DEFAULT '15:00';

-- Update existing record if it exists
UPDATE hr_attendance_time_settings
SET 
  max_checkout_hours = COALESCE(max_checkout_hours, 3.0),
  absent_threshold_time = COALESCE(absent_threshold_time, '15:00'::TIME)
WHERE id IS NOT NULL;

-- Verify the columns were added
SELECT 
  late_threshold,
  half_day_threshold,
  max_checkout_hours,
  absent_threshold_time
FROM hr_attendance_time_settings
LIMIT 1;
