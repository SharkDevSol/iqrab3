-- ============================================
-- MERGE G8A and G8B into G8
-- This script will:
-- 1. Copy all students from G8B to G8A
-- 2. Update all references in other tables
-- 3. Rename G8A to G8
-- 4. Clean up G8B
-- ============================================

BEGIN;

-- Step 1: Check current data
SELECT 'G8A Students:' as info, COUNT(*) as count FROM "G8A";
SELECT 'G8B Students:' as info, COUNT(*) as count FROM "G8B";

-- Step 2: Copy all students from G8B to G8A
-- First, get the max id from G8A to avoid conflicts
DO $$
DECLARE
    max_id INTEGER;
    student RECORD;
BEGIN
    -- Get max id from G8A
    SELECT COALESCE(MAX(id), 0) INTO max_id FROM "G8A";
    
    -- Copy each student from G8B to G8A
    FOR student IN SELECT * FROM "G8B" LOOP
        max_id := max_id + 1;
        
        INSERT INTO "G8A" (
            id, school_id, student_name, age, gender, class, class_id,
            image_student, guardian_name, guardian_phone, guardian_username,
            is_active, created_at, updated_at, machine_id
        ) VALUES (
            max_id,
            student.school_id,
            student.student_name,
            student.age,
            student.gender,
            'G8A', -- Keep as G8A for now, will rename table later
            student.class_id,
            student.image_student,
            student.guardian_name,
            student.guardian_phone,
            student.guardian_username,
            student.is_active,
            student.created_at,
            student.updated_at,
            student.machine_id
        );
        
        RAISE NOTICE 'Copied student: % (ID: % -> %)', student.student_name, student.id, max_id;
    END LOOP;
END $$;

-- Step 3: Update all references to G8B in other tables

-- Update class teacher assignments
UPDATE school_schema_points.class_teachers 
SET assigned_class = 'G8A' 
WHERE assigned_class = 'G8B';

-- Update teacher assignments (mark lists)
UPDATE subjects_of_school_schema.teacher_assignments 
SET "className" = 'G8A' 
WHERE "className" = 'G8B';

-- Update mark lists
UPDATE subjects_of_school_schema.mark_lists 
SET class_name = 'G8A' 
WHERE class_name = 'G8B';

-- Update schedule assignments
UPDATE schedule_schema.class_subject_configs 
SET class_name = 'G8A' 
WHERE class_name = 'G8B';

-- Update teacher schedules
UPDATE schedule_schema.teachers 
SET assigned_classes = array_replace(assigned_classes, 'G8B', 'G8A')
WHERE 'G8B' = ANY(assigned_classes);

-- Update evaluation book assignments
UPDATE evaluation_book_schema.teacher_class_assignments 
SET class_name = 'G8A' 
WHERE class_name = 'G8B';

-- Update daily evaluations
UPDATE evaluation_book_schema.daily_evaluations 
SET class_name = 'G8A' 
WHERE class_name = 'G8B';

-- Update posts
UPDATE posts 
SET class = 'G8A' 
WHERE class = 'G8B';

-- Update student faults
UPDATE student_faults_schema.student_faults 
SET class = 'G8A' 
WHERE class = 'G8B';

-- Update monthly payments
UPDATE finance_schema.monthly_payments 
SET class = 'G8A' 
WHERE class = 'G8B';

-- Update invoices
UPDATE finance_schema.invoices 
SET class = 'G8A' 
WHERE class = 'G8B';

-- Step 4: Rename G8A table to G8
ALTER TABLE "G8A" RENAME TO "G8";

-- Step 5: Update the class field in the newly renamed G8 table
UPDATE "G8" SET class = 'G8';

-- Step 6: Drop G8B table (all data has been moved)
DROP TABLE IF EXISTS "G8B";

-- Step 7: Verify the merge
SELECT 'Final G8 Students:' as info, COUNT(*) as count FROM "G8";
SELECT 'Remaining G8B references in class_teachers:' as info, COUNT(*) as count 
FROM school_schema_points.class_teachers WHERE assigned_class = 'G8B';

COMMIT;

-- ============================================
-- VERIFICATION QUERIES (Run these after the merge)
-- ============================================

-- Check all students in G8
-- SELECT * FROM "G8" ORDER BY student_name;

-- Check class teacher assignments
-- SELECT * FROM school_schema_points.class_teachers WHERE assigned_class LIKE 'G8%';

-- Check teacher assignments
-- SELECT * FROM subjects_of_school_schema.teacher_assignments WHERE "className" LIKE 'G8%';

-- Check mark lists
-- SELECT DISTINCT class_name FROM subjects_of_school_schema.mark_lists WHERE class_name LIKE 'G8%';
