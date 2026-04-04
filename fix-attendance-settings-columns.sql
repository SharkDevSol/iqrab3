-- Fix attendance settings table column types
-- Run on VPS: sudo -u postgres psql -d school_management2 -f fix-attendance-settings-columns.sql

\echo 'Fixing academic_student_attendance_settings table...'

-- Check current table structure
\d academic_student_attendance_settings

-- Drop the table and recreate with correct types
DROP TABLE IF EXISTS academic_student_attendance_settings CASCADE;

CREATE TABLE academic_student_attendance_settings (
  id SERIAL PRIMARY KEY,
  school_start_time TIME NOT NULL DEFAULT '08:00',
  school_end_time TIME NOT NULL DEFAULT '17:00',
  late_threshold_time TIME NOT NULL DEFAULT '08:15',
  absent_threshold_time TIME NOT NULL DEFAULT '15:00',
  auto_absent_enabled BOOLEAN DEFAULT true,
  school_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO academic_student_attendance_settings 
(school_start_time, school_end_time, late_threshold_time, absent_threshold_time, auto_absent_enabled, school_days)
VALUES 
('08:00', '17:00', '08:15', '15:00', true, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE academic_student_attendance_settings TO skoolific_user;
GRANT ALL PRIVILEGES ON SEQUENCE academic_student_attendance_settings_id_seq TO skoolific_user;

-- Verify
SELECT * FROM academic_student_attendance_settings;

\echo 'Table fixed successfully!'
