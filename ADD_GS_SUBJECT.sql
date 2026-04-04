-- Add G.S Subject and Map to Classes G7A, G7B, G8A, G8B
-- This script adds the G.S subject and creates mappings for specified classes

-- Step 1: Insert the G.S subject if it doesn't exist
INSERT INTO subjects_of_school_schema.subjects (subject_name)
VALUES ('G.S')
ON CONFLICT (subject_name) DO NOTHING;

-- Step 2: Add subject-class mappings for G.S with G7A, G7B, G8A, G8B
INSERT INTO subjects_of_school_schema.subject_class_mappings (subject_name, class_name)
VALUES 
    ('G.S', 'G7A'),
    ('G.S', 'G7B'),
    ('G.S', 'G8A'),
    ('G.S', 'G8B')
ON CONFLICT (subject_name, class_name) DO NOTHING;

-- Step 3: Verify the insertions
SELECT 'Subject Added:' as status, subject_name, created_at 
FROM subjects_of_school_schema.subjects 
WHERE subject_name = 'G.S';

SELECT 'Mappings Created:' as status, subject_name, class_name, subject_class, created_at 
FROM subjects_of_school_schema.subject_class_mappings 
WHERE subject_name = 'G.S'
ORDER BY class_name;
