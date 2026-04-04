-- Check Student Machine IDs Setup
-- Run this on VPS to verify students are ready for machine integration

-- 1. Check how many students have machine IDs set
SELECT 
  'Total Students with Machine IDs' as status,
  COUNT(*) as count
FROM (
  SELECT smachine_id FROM classes_schema."GRADE10" WHERE smachine_id IS NOT NULL
  UNION ALL
  SELECT smachine_id FROM classes_schema."KG1A" WHERE smachine_id IS NOT NULL
  -- Add more classes as needed
) as all_students;

-- 2. Show students WITH machine IDs (ready for machine)
SELECT 
  student_name,
  smachine_id as machine_id,
  'GRADE10' as class_name
FROM classes_schema."GRADE10"
WHERE smachine_id IS NOT NULL
ORDER BY student_name
LIMIT 20;

-- 3. Show students WITHOUT machine IDs (need to be configured)
SELECT 
  student_name,
  'GRADE10' as class_name,
  'NO MACHINE ID' as status
FROM classes_schema."GRADE10"
WHERE smachine_id IS NULL
ORDER BY student_name
LIMIT 20;

-- 4. Check recent machine attendance logs
SELECT 
  student_name,
  ethiopian_day || '/' || ethiopian_month || '/' || ethiopian_year as ethiopian_date,
  check_in_time,
  status,
  created_at
FROM academic_student_attendance
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 20;

-- 5. Check if AI06 service is receiving data
-- (This checks the global_machine_ids table)
SELECT 
  smachine_id,
  student_name,
  class_name,
  created_at
FROM global_machine_ids
ORDER BY created_at DESC
LIMIT 20;
