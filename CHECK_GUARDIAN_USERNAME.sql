-- Check if all students have the same guardian username
-- Replace '0936311768' with your actual guardian phone number

SELECT 
    student_name,
    school_id,
    class,
    guardian_name,
    guardian_phone,
    guardian_username,
    guardian_password
FROM classes_schema."KG1B"
WHERE guardian_phone = '0936311768'

UNION ALL

SELECT 
    student_name,
    school_id,
    class,
    guardian_name,
    guardian_phone,
    guardian_username,
    guardian_password
FROM classes_schema."KG2A"
WHERE guardian_phone = '0936311768'

UNION ALL

SELECT 
    student_name,
    school_id,
    class,
    guardian_name,
    guardian_phone,
    guardian_username,
    guardian_password
FROM classes_schema."GRADE2"
WHERE guardian_phone = '0936311768';

-- Expected result: All 3 students should have SAME guardian_username
-- If they have different usernames, that's the problem!
