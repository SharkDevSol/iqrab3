-- ============================================
-- Update Machine IP Address from 192.168.1.201 to 192.168.1.2
-- Run this script after changing your router
-- ============================================

-- 1. Update machine_config table (if exists)
UPDATE machine_config 
SET ip_address = '192.168.1.2' 
WHERE ip_address = '192.168.1.201';

-- 2. Update user_machine_mapping table (if exists)
UPDATE user_machine_mapping 
SET machine_ip = '192.168.1.2' 
WHERE machine_ip = '192.168.1.201';

-- 3. Check for any other tables that might store IP addresses
-- Update attendance_devices table (if exists)
UPDATE attendance_devices 
SET device_ip = '192.168.1.2' 
WHERE device_ip = '192.168.1.201';

-- 4. Update any configuration tables
UPDATE system_config 
SET config_value = '192.168.1.2' 
WHERE config_key = 'biometric_device_ip' 
  AND config_value = '192.168.1.201';

-- 5. Verify the changes
SELECT 'machine_config' as table_name, ip_address 
FROM machine_config 
WHERE ip_address = '192.168.1.2'
UNION ALL
SELECT 'user_machine_mapping' as table_name, machine_ip 
FROM user_machine_mapping 
WHERE machine_ip = '192.168.1.2';

-- Display success message
SELECT 'Machine IP updated successfully from 192.168.1.201 to 192.168.1.2' as status;
