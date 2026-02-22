-- ============================================
-- Update Machine IP Address (Safe Version)
-- From: 192.168.1.201 to 192.168.1.2
-- This script is IDEMPOTENT - safe to run multiple times
-- ============================================

-- 1. Update machine_config table (if exists and has records)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'machine_config') THEN
        UPDATE machine_config 
        SET ip_address = '192.168.1.2' 
        WHERE ip_address = '192.168.1.201';
        
        RAISE NOTICE 'Updated machine_config table';
    ELSE
        RAISE NOTICE 'Table machine_config does not exist - skipping';
    END IF;
END $$;

-- 2. Update user_machine_mapping table (if exists and has the column)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'user_machine_mapping' 
        AND column_name = 'machine_ip'
    ) THEN
        UPDATE user_machine_mapping 
        SET machine_ip = '192.168.1.2' 
        WHERE machine_ip = '192.168.1.201';
        
        RAISE NOTICE 'Updated user_machine_mapping table';
    ELSE
        RAISE NOTICE 'Table user_machine_mapping or column machine_ip does not exist - skipping';
    END IF;
END $$;

-- 3. Update attendance_devices table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'attendance_devices') THEN
        UPDATE attendance_devices 
        SET device_ip = '192.168.1.2' 
        WHERE device_ip = '192.168.1.201';
        
        RAISE NOTICE 'Updated attendance_devices table';
    ELSE
        RAISE NOTICE 'Table attendance_devices does not exist - skipping';
    END IF;
END $$;

-- 4. Update system_config table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'system_config') THEN
        UPDATE system_config 
        SET config_value = '192.168.1.2' 
        WHERE config_key = 'biometric_device_ip' 
          AND config_value = '192.168.1.201';
        
        RAISE NOTICE 'Updated system_config table';
    ELSE
        RAISE NOTICE 'Table system_config does not exist - skipping';
    END IF;
END $$;

-- 5. Verify the changes (only show existing tables)
DO $$
DECLARE
    rec RECORD;
    found_any BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Verification Results:';
    RAISE NOTICE '========================================';
    
    -- Check machine_config
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'machine_config') THEN
        FOR rec IN 
            SELECT id, ip_address, name 
            FROM machine_config 
            WHERE ip_address = '192.168.1.2'
        LOOP
            RAISE NOTICE 'machine_config: ID=%, IP=%, Name=%', rec.id, rec.ip_address, rec.name;
            found_any := TRUE;
        END LOOP;
    END IF;
    
    IF NOT found_any THEN
        RAISE NOTICE 'No records found with IP 192.168.1.2';
        RAISE NOTICE 'This is normal if you have not configured any biometric devices yet';
    END IF;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'âœ… Machine IP update completed successfully!';
    RAISE NOTICE 'Old IP: 192.168.1.201';
    RAISE NOTICE 'New IP: 192.168.1.2';
    RAISE NOTICE '========================================';
END $$;
