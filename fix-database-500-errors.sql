-- Fix Database Issues Causing 500 Errors
-- Run this on VPS: sudo -u postgres psql -d school_management2 -f fix-database-500-errors.sql

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Grant permissions to skoolific_user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skoolific_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skoolific_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO skoolific_user;

-- 3. Create hr_attendance_time_settings table if not exists
CREATE TABLE IF NOT EXISTS hr_attendance_time_settings (
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

-- 4. Create shift_time_settings table if not exists
CREATE TABLE IF NOT EXISTS shift_time_settings (
  id SERIAL PRIMARY KEY,
  shift_name VARCHAR(20) NOT NULL UNIQUE CHECK (shift_name IN ('shift1', 'shift2')),
  check_in_time TIME NOT NULL,
  check_out_time TIME NOT NULL,
  late_threshold TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Insert default shift settings if not exists
INSERT INTO shift_time_settings (shift_name, check_in_time, check_out_time, late_threshold)
VALUES 
  ('shift1', '08:00', '17:00', '08:15'),
  ('shift2', '14:00', '23:00', '14:15')
ON CONFLICT (shift_name) DO NOTHING;

-- 6. Grant permissions on new tables
GRANT ALL PRIVILEGES ON TABLE hr_attendance_time_settings TO skoolific_user;
GRANT ALL PRIVILEGES ON TABLE shift_time_settings TO skoolific_user;
GRANT ALL PRIVILEGES ON SEQUENCE shift_time_settings_id_seq TO skoolific_user;

-- 7. Verify tables exist
SELECT 'hr_attendance_time_settings' as table_name, COUNT(*) as row_count FROM hr_attendance_time_settings
UNION ALL
SELECT 'shift_time_settings' as table_name, COUNT(*) as row_count FROM shift_time_settings;

\echo 'Database setup complete!'
