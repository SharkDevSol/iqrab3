-- ========================================
-- COMPLETE VPS DATABASE MIGRATION SCRIPT
-- Run this on VPS to add all missing tables and columns
-- ========================================

-- Grant permissions first
GRANT ALL ON SCHEMA public TO skoolific_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skoolific_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skoolific_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO skoolific_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO skoolific_user;

-- ========================================
-- 1. STAFF ATTENDANCE SETTINGS
-- ========================================
CREATE TABLE IF NOT EXISTS staff_attendance_settings (
  id SERIAL PRIMARY KEY,
  late_threshold INTEGER DEFAULT 15,
  absent_threshold TIME DEFAULT '15:00:00',
  max_checkout_hours INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO staff_attendance_settings (id, late_threshold, absent_threshold, max_checkout_hours)
VALUES (1, 15, '15:00:00', 3)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 2. ADD MISSING COLUMNS TO STAFF_ATTENDANCE
-- ========================================
ALTER TABLE staff_attendance ADD COLUMN IF NOT EXISTS ethiopian_year INTEGER;
ALTER TABLE staff_attendance ADD COLUMN IF NOT EXISTS ethiopian_month INTEGER;
ALTER TABLE staff_attendance ADD COLUMN IF NOT EXISTS ethiopian_day INTEGER;

-- ========================================
-- 3. DEVICE USER MONITORING
-- ========================================
ALTER TABLE device_user_monitoring ADD COLUMN IF NOT EXISTS device_user_id VARCHAR(100);
ALTER TABLE device_user_monitoring ADD COLUMN IF NOT EXISTS severity VARCHAR(50);

-- ========================================
-- 4. HR ATTENDANCE TIME SETTINGS
-- ========================================
CREATE TABLE IF NOT EXISTS hr_attendance_time_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_check_in TIME NOT NULL DEFAULT '08:00',
  standard_check_out TIME NOT NULL DEFAULT '17:00',
  late_threshold_minutes INTEGER DEFAULT 15,
  early_departure_threshold_minutes INTEGER DEFAULT 15,
  overtime_threshold_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO hr_attendance_time_settings (standard_check_in, standard_check_out, late_threshold_minutes)
VALUES ('08:00', '17:00', 15)
ON CONFLICT DO NOTHING;

-- ========================================
-- 5. SHIFT TIME SETTINGS
-- ========================================
CREATE TABLE IF NOT EXISTS shift_time_settings (
  id SERIAL PRIMARY KEY,
  shift_name VARCHAR(20) NOT NULL UNIQUE CHECK (shift_name IN ('shift1', 'shift2')),
  check_in_time TIME NOT NULL,
  check_out_time TIME NOT NULL,
  late_threshold_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default shifts
INSERT INTO shift_time_settings (shift_name, check_in_time, check_out_time, late_threshold_minutes)
VALUES 
  ('shift1', '08:00:00', '14:00:00', 15),
  ('shift2', '14:00:00', '20:00:00', 15)
ON CONFLICT (shift_name) DO NOTHING;

-- ========================================
-- 6. USER MACHINE MAPPING
-- ========================================
CREATE TABLE IF NOT EXISTS user_machine_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id VARCHAR(50) NOT NULL,
  person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('staff', 'student')),
  machine_id VARCHAR(50) NOT NULL,
  device_user_id VARCHAR(100),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_synced_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 7. MACHINE CONFIG
-- ========================================
CREATE TABLE IF NOT EXISTS machine_config (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  ip_address VARCHAR(50),
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 8. CLASS SHIFT ASSIGNMENT
-- ========================================
CREATE TABLE IF NOT EXISTS academic_class_shift_assignment (
  id SERIAL PRIMARY KEY,
  class_name VARCHAR(255) NOT NULL UNIQUE,
  shift_name VARCHAR(20) CHECK (shift_name IN ('shift1', 'shift2')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- 9. ADD SHIFT COLUMNS TO STUDENTS TABLE
-- ========================================
DO $$
BEGIN
  -- Add shift_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'students' 
    AND column_name = 'shift_name'
  ) THEN
    ALTER TABLE students ADD COLUMN shift_name VARCHAR(20);
  END IF;
END $$;

-- ========================================
-- 10. STAFF SPECIFIC TIMING
-- ========================================
CREATE TABLE IF NOT EXISTS staff_specific_timing (
  id SERIAL PRIMARY KEY,
  global_staff_id INTEGER NOT NULL,
  check_in_time TIME NOT NULL,
  check_out_time TIME NOT NULL,
  late_threshold_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(global_staff_id)
);

-- ========================================
-- 11. WEEKEND DAYS SETTINGS
-- ========================================
ALTER TABLE staff_attendance_settings ADD COLUMN IF NOT EXISTS weekend_days TEXT DEFAULT 'Saturday,Sunday';

-- ========================================
-- 12. CONVERSATION PARTICIPANTS (for chat system)
-- ========================================
CREATE TABLE IF NOT EXISTS conversation_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER,
  user_id INTEGER,
  user_type VARCHAR(50),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- FINAL: Grant all permissions again
-- ========================================
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skoolific_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skoolific_user;

-- ========================================
-- DONE!
-- ========================================
