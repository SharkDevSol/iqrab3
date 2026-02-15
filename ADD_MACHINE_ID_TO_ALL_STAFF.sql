-- Add machine_id column to ALL staff tables
-- Run this SQL script in your PostgreSQL database

-- Add machine_id to staff_supportive_staff tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'staff_supportive_staff' 
          AND table_type = 'BASE TABLE'
    LOOP
        -- Check if column exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'staff_supportive_staff' 
              AND table_name = table_record.table_name 
              AND column_name = 'machine_id'
        ) THEN
            EXECUTE format('ALTER TABLE staff_supportive_staff.%I ADD COLUMN machine_id VARCHAR(50) UNIQUE', table_record.table_name);
            RAISE NOTICE 'Added machine_id to staff_supportive_staff.%', table_record.table_name;
        ELSE
            RAISE NOTICE 'machine_id already exists in staff_supportive_staff.%', table_record.table_name;
        END IF;
    END LOOP;
END $$;

-- Add machine_id to staff_administrative_staff tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'staff_administrative_staff' 
          AND table_type = 'BASE TABLE'
    LOOP
        -- Check if column exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'staff_administrative_staff' 
              AND table_name = table_record.table_name 
              AND column_name = 'machine_id'
        ) THEN
            EXECUTE format('ALTER TABLE staff_administrative_staff.%I ADD COLUMN machine_id VARCHAR(50) UNIQUE', table_record.table_name);
            RAISE NOTICE 'Added machine_id to staff_administrative_staff.%', table_record.table_name;
        ELSE
            RAISE NOTICE 'machine_id already exists in staff_administrative_staff.%', table_record.table_name;
        END IF;
    END LOOP;
END $$;

-- Add machine_id to staff_teachers tables (if not already added)
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'staff_teachers' 
          AND table_type = 'BASE TABLE'
    LOOP
        -- Check if column exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'staff_teachers' 
              AND table_name = table_record.table_name 
              AND column_name = 'machine_id'
        ) THEN
            EXECUTE format('ALTER TABLE staff_teachers.%I ADD COLUMN machine_id VARCHAR(50) UNIQUE', table_record.table_name);
            RAISE NOTICE 'Added machine_id to staff_teachers.%', table_record.table_name;
        ELSE
            RAISE NOTICE 'machine_id already exists in staff_teachers.%', table_record.table_name;
        END IF;
    END LOOP;
END $$;

-- Verify the changes
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE column_name = 'machine_id'
  AND table_schema IN ('staff_teachers', 'staff_supportive_staff', 'staff_administrative_staff')
ORDER BY table_schema, table_name;
