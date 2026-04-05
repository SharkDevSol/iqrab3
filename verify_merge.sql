-- Verify the merge
SELECT 'G8 Students:' as info, COUNT(*) as count FROM classes_schema."G8";
SELECT 'G8 Class Teacher:' as info, assigned_class FROM school_schema_points.class_teachers WHERE assigned_class = 'G8';
SELECT 'Backup G8A:' as info, COUNT(*) as count FROM classes_schema."G8A_backup";
SELECT 'Backup G8B:' as info, COUNT(*) as count FROM classes_schema."G8B_backup";
