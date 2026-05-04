-- Create HR Attendance Deduction Settings Table
-- This table stores deduction rules for different staff types and attendance statuses

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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_staff_type 
  ON hr_attendance_deduction_settings(staff_type);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_type 
  ON hr_attendance_deduction_settings(deduction_type);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_active 
  ON hr_attendance_deduction_settings(is_active);

-- Insert default deduction settings
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

-- Add comment to table
COMMENT ON TABLE hr_attendance_deduction_settings IS 'Stores deduction rules for staff attendance issues';
