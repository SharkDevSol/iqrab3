-- Fix: Update all students with same phone to have same guardian username
-- This will fix the payments tab to show all students

-- Step 1: Check current state
SELECT 
    'BEFORE FIX' as status,
    student_name,
    school_id,
    class,
    guardian_phone,
    guardian_username
FROM classes_schema."KG1B"
WHERE guardian_phone = '0936311768'

UNION ALL

SELECT 
    'BEFORE FIX' as status,
    student_name,
    school_id,
    class,
    guardian_phone,
    guardian_username
FROM classes_schema."KG2A"
WHERE guardian_phone = '0936311768'

UNION ALL

SELECT 
    'BEFORE FIX' as status,
    student_name,
    school_id,
    class,
    guardian_phone,
    guardian_username
FROM classes_schema."GRADE2"
WHERE guardian_phone = '0936311768';

-- Step 2: Update all students to use the SAME guardian username
-- Replace 'abdurhmanahmmed_4386' with the username you want to keep

-- Update KG2A (obsa yusuf)
UPDATE classes_schema."KG2A"
SET 
    guardian_username = 'abdurhmanahmmed_4386',
    guardian_password = (
        SELECT guardian_password 
        FROM classes_schema."KG1B" 
        WHERE guardian_phone = '0936311768' 
        LIMIT 1
    )
WHERE guardian_phone = '0936311768';

-- Update GRADE2 (halima yusuf)
UPDATE classes_schema."GRADE2"
SET 
    guardian_username = 'abdurhmanahmmed_4386',
    guardian_password = (
        SELECT guardian_password 
        FROM classes_schema."KG1B" 
        WHERE guardian_phone = '0936311768' 
        LIMIT 1
    )
WHERE guardian_phone = '0936311768';

-- Step 3: Verify the fix
SELECT 
    'AFTER FIX' as status,
    student_name,
    school_id,
    class,
    guardian_phone,
    guardian_username
FROM classes_schema."KG1B"
WHERE guardian_phone = '0936311768'

UNION ALL

SELECT 
    'AFTER FIX' as status,
    student_name,
    school_id,
    class,
    guardian_phone,
    guardian_username
FROM classes_schema."KG2A"
WHERE guardian_phone = '0936311768'

UNION ALL

SELECT 
    'AFTER FIX' as status,
    student_name,
    school_id,
    class,
    guardian_phone,
    guardian_username
FROM classes_schema."GRADE2"
WHERE guardian_phone = '0936311768';

-- Expected result: All students should now have guardian_username = 'abdurhmanahmmed_4386'
