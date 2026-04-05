-- ============================================
-- BACKUP G8A and G8B before merging
-- Run this BEFORE running the merge script
-- ============================================

-- Create backup tables
CREATE TABLE "G8A_backup" AS SELECT * FROM "G8A";
CREATE TABLE "G8B_backup" AS SELECT * FROM "G8B";

-- Verify backups
SELECT 'G8A backup created:' as info, COUNT(*) as count FROM "G8A_backup";
SELECT 'G8B backup created:' as info, COUNT(*) as count FROM "G8B_backup";

-- Backup class teacher assignments
CREATE TABLE class_teachers_backup AS 
SELECT * FROM school_schema_points.class_teachers 
WHERE assigned_class IN ('G8A', 'G8B');

SELECT 'Class teacher assignments backed up:' as info, COUNT(*) as count FROM class_teachers_backup;
