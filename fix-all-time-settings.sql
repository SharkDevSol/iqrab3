-- Fix all time settings tables
-- Run on VPS: sudo -u postgres psql -d school_management2 -f fix-all-time-settings.sql

\echo '========================================='
\echo 'Fixing Time Settings Tables'
\echo '========================================='

-- 1. Fix academic_student_attendance_settings
\echo ''
\echo '1. Fixing academic_student_attendance_settings...'

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

INSERT INTO academic_student_attendance_settings 
(school_start_time, school_end_time, late_threshold_time, absent_threshold_time, auto_absent_enabled, school_days)
VALUES 
('08:00', '17:00', '08:15', '15:00', true, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

GRANT ALL PRIVILEGES ON TABLE academic_student_attendance_settings TO skoolific_user;
GRANT ALL PRIVILEGES ON SEQUENCE academic_student_attendance_settings_id_seq TO skoolific_user;

\echo '   ✓ academic_student_attendance_settings fixed'

-- 2. Fix shift_time_settings
\echo ''
\echo '2. Fixing shift_time_settings...'

DROP TABLE IF EXISTS shift_time_settings CASCADE;

CREATE TABLE shift_time_settings (
  id SERIAL PRIMARY KEY,
  shift_name VARCHAR(20) NOT NULL UNIQUE CHECK (shift_name IN ('shift1', 'shift2')),
  check_in_time TIME NOT NULL,
  check_out_time TIME NOT NULL,
  late_threshold TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO shift_time_settings (shift_name, check_in_time, check_out_time, late_threshold)
VALUES 
  ('shift1', '08:00', '17:00', '08:15'),
  ('shift2', '14:00', '23:00', '14:15');

GRANT ALL PRIVILEGES ON TABLE shift_time_settings TO skoolific_user;
GRANT ALL PRIVILEGES ON SEQUENCE shift_time_settings_id_seq TO skoolific_user;

\echo '   ✓ shift_time_settings fixed'

-- 3. Create/Fix hr_attendance_time_settings
\echo ''
\echo '3. Fixing hr_attendance_time_settings...'

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS hr_attendance_time_settings CASCADE;

CREATE TABLE hr_attendance_time_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_check_in TIME NOT NULL DEFAULT '08:00',
  late_threshold TIME NOT NULL DEFAULT '08:15',
  standard_check_out TIME NOT NULL DEFAULT '17:00',
  minimum_work_hours DECIMAL(4, 2) NOT NULL DEFAULT 8.0,
  half_day_threshold DECIMAL(4, 2) NOT NULL DEFAULT 4.0,
  grace_period_minutes INTEGER NOT NULL DEFAULT 15,
  max_checkout_hours DECIMAL(4, 2) DEFAULT 3.0,
  absent_threshold_time TIME DEFAULT '15:00',
  weekend_days INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO hr_attendance_time_settings 
(standard_check_in, late_threshold, standard_check_out, minimum_work_hours, half_day_threshold, grace_period_minutes, max_checkout_hours, absent_threshold_time, weekend_days)
VALUES 
('08:00', '08:15', '17:00', 8.0, 4.0, 15, 3.0, '15:00', ARRAY[6, 7]);

GRANT ALL PRIVILEGES ON TABLE hr_attendance_time_settings TO skoolific_user;

\echo '   ✓ hr_attendance_time_settings fixed'

-- 4. Verify all tables
\echo ''
\echo '========================================='
\echo 'Verification'
\echo '========================================='

\echo ''
\echo 'academic_student_attendance_settings:'
SELECT id, school_start_time, late_threshold_time, school_days FROM academic_student_attendance_settings;

\echo ''
\echo 'shift_time_settings:'
SELECT id, shift_name, check_in_time, late_threshold FROM shift_time_settings;

\echo ''
\echo 'hr_attendance_time_settings:'
SELECT id, standard_check_in, late_threshold, weekend_days FROM hr_attendance_time_settings;

\echo ''
\echo '========================================='
\echo '✅ All time settings tables fixed!'
\echo '========================================='
\echo ''
\echo 'Next step: pm2 restart skoolific-backend'
