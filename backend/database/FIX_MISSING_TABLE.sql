-- ============================================================================
-- FIX: Create Missing hr_attendance_deduction_settings Table
-- ============================================================================
-- Run this SQL script directly in your PostgreSQL database to fix the error:
-- "relation hr_attendance_deduction_settings does not exist"
-- ============================================================================

-- Step 1: Create the table
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_staff_type 
  ON hr_attendance_deduction_settings(staff_type);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_type 
  ON hr_attendance_deduction_settings(deduction_type);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_active 
  ON hr_attendance_deduction_settings(is_active);

-- Step 3: Insert default deduction settings
INSERT INTO hr_attendance_deduction_settings 
  (staff_type, deduction_type, deduction_amount, description, is_active)
VALUES 
  -- Teacher deductions
  ('Teacher', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Teacher', 'Absent', 200.00, 'Deduction for absence', true),
  ('Teacher', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  
  -- Administrative staff deductions
  ('Administrative', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Administrative', 'Absent', 200.00, 'Deduction for absence', true),
  ('Administrative', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  
  -- Support staff deductions
  ('Support Staff', 'Late', 30.00, 'Deduction for late arrival', true),
  ('Support Staff', 'Absent', 150.00, 'Deduction for absence', true),
  ('Support Staff', 'Half-Day', 75.00, 'Deduction for half-day absence', true),
  
  -- Management deductions
  ('Management', 'Late', 75.00, 'Deduction for late arrival', true),
  ('Management', 'Absent', 250.00, 'Deduction for absence', true),
  ('Management', 'Half-Day', 125.00, 'Deduction for half-day absence', true)
ON CONFLICT (staff_type, deduction_type) DO NOTHING;

-- Step 4: Verify the table was created
SELECT 
  'Table created successfully!' as status,
  COUNT(*) as total_settings
FROM hr_attendance_deduction_settings;

-- Step 5: Show all settings
SELECT 
  staff_type,
  deduction_type,
  deduction_amount,
  description,
  is_active
FROM hr_attendance_deduction_settings
ORDER BY staff_type, deduction_type;

-- ============================================================================
-- DONE! The table has been created with default settings.
-- You can now refresh your application and the error should be resolved.
-- ============================================================================
