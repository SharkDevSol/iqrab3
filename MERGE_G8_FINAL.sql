-- ============================================
-- FINAL MERGE: G8A and G8B into G8
-- Handles unique constraints properly
-- ============================================

BEGIN;

-- Step 1: Backup first
CREATE TABLE IF NOT EXISTS classes_schema."G8A_backup" AS SELECT * FROM classes_schema."G8A";
CREATE TABLE IF NOT EXISTS classes_schema."G8B_backup" AS SELECT * FROM classes_schema."G8B";

SELECT 'G8A Students:' as info, COUNT(*) as count FROM classes_schema."G8A";
SELECT 'G8B Students:' as info, COUNT(*) as count FROM classes_schema."G8B";

-- Step 2: Copy all students from G8B to G8A
INSERT INTO classes_schema."G8A" (
    school_id, student_name, age, gender, class, class_id,
    image_student, guardian_name, guardian_phone, guardian_username, is_active
)
SELECT 
    school_id, student_name, age, gender, 'G8A', class_id,
    image_student, guardian_name, guardian_phone, guardian_username, is_active
FROM classes_schema."G8B";

SELECT 'After merge:' as info, COUNT(*) as count FROM classes_schema."G8A";

-- Step 3: Merge all subject tables
INSERT INTO subject_amh_schema.g8a_term_1 SELECT * FROM subject_amh_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_amh_schema.g8a_term_2 SELECT * FROM subject_amh_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_eng_schema.g8a_term_1 SELECT * FROM subject_eng_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_eng_schema.g8a_term_2 SELECT * FROM subject_eng_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_math_schema.g8a_term_1 SELECT * FROM subject_math_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_math_schema.g8a_term_2 SELECT * FROM subject_math_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_bio_schema.g8a_term_1 SELECT * FROM subject_bio_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_bio_schema.g8a_term_2 SELECT * FROM subject_bio_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_chem_schema.g8a_term_1 SELECT * FROM subject_chem_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_chem_schema.g8a_term_2 SELECT * FROM subject_chem_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_phy_schema.g8a_term_1 SELECT * FROM subject_phy_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_phy_schema.g8a_term_2 SELECT * FROM subject_phy_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_geo_schema.g8a_term_1 SELECT * FROM subject_geo_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_geo_schema.g8a_term_2 SELECT * FROM subject_geo_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_his_schema.g8a_term_1 SELECT * FROM subject_his_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_his_schema.g8a_term_2 SELECT * FROM subject_his_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_civ_schema.g8a_term_1 SELECT * FROM subject_civ_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_civ_schema.g8a_term_2 SELECT * FROM subject_civ_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_eco_schema.g8a_term_1 SELECT * FROM subject_eco_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_eco_schema.g8a_term_2 SELECT * FROM subject_eco_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_ict_schema.g8a_term_1 SELECT * FROM subject_ict_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_ict_schema.g8a_term_2 SELECT * FROM subject_ict_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_sport_schema.g8a_term_1 SELECT * FROM subject_sport_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_sport_schema.g8a_term_2 SELECT * FROM subject_sport_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_arabi_schema.g8a_term_1 SELECT * FROM subject_arabi_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_arabi_schema.g8a_term_2 SELECT * FROM subject_arabi_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_qur_schema.g8a_term_1 SELECT * FROM subject_qur_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_qur_schema.g8a_term_2 SELECT * FROM subject_qur_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_taf_schema.g8a_term_1 SELECT * FROM subject_taf_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_taf_schema.g8a_term_2 SELECT * FROM subject_taf_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_tar_schema.g8a_term_1 SELECT * FROM subject_tar_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_tar_schema.g8a_term_2 SELECT * FROM subject_tar_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_safuu_schema.g8a_term_1 SELECT * FROM subject_safuu_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_safuu_schema.g8a_term_2 SELECT * FROM subject_safuu_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_saaynaannoo_schema.g8a_term_1 SELECT * FROM subject_saaynaannoo_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_saaynaannoo_schema.g8a_term_2 SELECT * FROM subject_saaynaannoo_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_agri_schema.g8a_term_1 SELECT * FROM subject_agri_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_agri_schema.g8a_term_2 SELECT * FROM subject_agri_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_ao_schema.g8a_term_1 SELECT * FROM subject_ao_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_ao_schema.g8a_term_2 SELECT * FROM subject_ao_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_g_s_schema.g8a_term_1 SELECT * FROM subject_g_s_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_g_s_schema.g8a_term_2 SELECT * FROM subject_g_s_schema.g8b_term_2 ON CONFLICT DO NOTHING;
INSERT INTO subject_soc_schema.g8a_term_1 SELECT * FROM subject_soc_schema.g8b_term_1 ON CONFLICT DO NOTHING;
INSERT INTO subject_soc_schema.g8a_term_2 SELECT * FROM subject_soc_schema.g8b_term_2 ON CONFLICT DO NOTHING;

-- Step 4: Delete G8B references first (to avoid unique constraint violations)
DELETE FROM school_schema_points.class_teachers WHERE assigned_class = 'G8B';
DELETE FROM subjects_of_school_schema.teacher_assignments WHERE "className" = 'G8B';
DELETE FROM subjects_of_school_schema.mark_lists WHERE class_name = 'G8B';
DELETE FROM schedule_schema.class_subject_configs WHERE class_name = 'G8B';
UPDATE schedule_schema.teachers SET assigned_classes = array_remove(assigned_classes, 'G8B') WHERE 'G8B' = ANY(assigned_classes);
DELETE FROM evaluation_book_schema.teacher_class_assignments WHERE class_name = 'G8B';
UPDATE evaluation_book_schema.daily_evaluations SET class_name = 'G8A' WHERE class_name = 'G8B';
UPDATE posts SET class = 'G8A' WHERE class = 'G8B';
UPDATE student_faults_schema.student_faults SET class = 'G8A' WHERE class = 'G8B';
UPDATE finance_schema.monthly_payments SET class = 'G8A' WHERE class = 'G8B';
UPDATE finance_schema.invoices SET class = 'G8A' WHERE class = 'G8B';

-- Step 5: Rename G8A to G8
ALTER TABLE classes_schema."G8A" RENAME TO "G8";
UPDATE classes_schema."G8" SET class = 'G8';

-- Rename subject tables
ALTER TABLE subject_amh_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_amh_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_eng_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_eng_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_math_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_math_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_bio_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_bio_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_chem_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_chem_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_phy_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_phy_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_geo_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_geo_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_his_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_his_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_civ_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_civ_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_eco_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_eco_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_ict_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_ict_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_sport_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_sport_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_arabi_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_arabi_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_qur_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_qur_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_taf_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_taf_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_tar_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_tar_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_safuu_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_safuu_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_saaynaannoo_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_saaynaannoo_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_agri_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_agri_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_ao_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_ao_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_g_s_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_g_s_schema.g8a_term_2 RENAME TO g8_term_2;
ALTER TABLE subject_soc_schema.g8a_term_1 RENAME TO g8_term_1;
ALTER TABLE subject_soc_schema.g8a_term_2 RENAME TO g8_term_2;

-- Step 6: Update references from G8A to G8
UPDATE school_schema_points.class_teachers SET assigned_class = 'G8' WHERE assigned_class = 'G8A';
UPDATE subjects_of_school_schema.teacher_assignments SET "className" = 'G8' WHERE "className" = 'G8A';
UPDATE subjects_of_school_schema.mark_lists SET class_name = 'G8' WHERE class_name = 'G8A';
UPDATE schedule_schema.class_subject_configs SET class_name = 'G8' WHERE class_name = 'G8A';
UPDATE schedule_schema.teachers SET assigned_classes = array_replace(assigned_classes, 'G8A', 'G8') WHERE 'G8A' = ANY(assigned_classes);
UPDATE evaluation_book_schema.teacher_class_assignments SET class_name = 'G8' WHERE class_name = 'G8A';
UPDATE evaluation_book_schema.daily_evaluations SET class_name = 'G8' WHERE class_name = 'G8A';
UPDATE posts SET class = 'G8' WHERE class = 'G8A';
UPDATE student_faults_schema.student_faults SET class = 'G8' WHERE class = 'G8A';
UPDATE finance_schema.monthly_payments SET class = 'G8' WHERE class = 'G8A';
UPDATE finance_schema.invoices SET class = 'G8' WHERE class = 'G8A';

-- Step 7: Drop G8B tables
DROP TABLE IF EXISTS classes_schema."G8B";
DROP TABLE IF EXISTS subject_amh_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_amh_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_eng_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_eng_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_math_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_math_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_bio_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_bio_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_chem_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_chem_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_phy_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_phy_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_geo_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_geo_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_his_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_his_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_civ_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_civ_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_eco_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_eco_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_ict_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_ict_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_sport_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_sport_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_arabi_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_arabi_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_qur_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_qur_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_taf_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_taf_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_tar_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_tar_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_safuu_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_safuu_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_saaynaannoo_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_saaynaannoo_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_agri_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_agri_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_ao_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_ao_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_g_s_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_g_s_schema.g8b_term_2;
DROP TABLE IF EXISTS subject_soc_schema.g8b_term_1;
DROP TABLE IF EXISTS subject_soc_schema.g8b_term_2;

SELECT 'Final G8 Students:' as info, COUNT(*) as count FROM classes_schema."G8";

COMMIT;

SELECT '✅ MERGE COMPLETE! G8A and G8B have been merged into G8' as status;
