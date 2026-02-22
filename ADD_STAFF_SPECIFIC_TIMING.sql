-- Create table for staff-specific shift timing overrides
CREATE TABLE IF NOT EXISTS staff_specific_shift_timing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id VARCHAR(255) NOT NULL,
  staff_name VARCHAR(255) NOT NULL,
  shift_type VARCHAR(20) NOT NULL CHECK (shift_type IN ('shift1', 'shift2')),
  custom_check_in TIME,
  custom_check_out TIME,
  custom_late_threshold TIME,
  anytime_check BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_id, shift_type)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_specific_timing_staff_id ON staff_specific_shift_timing(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_specific_timing_shift ON staff_specific_shift_timing(shift_type);

-- Insert sample data (optional)
-- INSERT INTO staff_specific_shift_timing (staff_id, staff_name, shift_type, custom_check_in, custom_check_out, custom_late_threshold, anytime_check)
-- VALUES ('STAFF001', 'Ahmed Ali', 'shift1', '09:00', '18:00', '09:15', false);

COMMENT ON TABLE staff_specific_shift_timing IS 'Stores staff-specific shift timing overrides';
COMMENT ON COLUMN staff_specific_shift_timing.anytime_check IS 'If true, staff can come anytime without late/half-day/absent deductions';
